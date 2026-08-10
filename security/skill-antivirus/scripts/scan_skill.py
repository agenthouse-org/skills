#!/usr/bin/env python3
"""Static, non-executing scanner for SKILL.md files, skill directories, and ZIP packages.

May safely stage ZIP contents into a temp directory (path-checked, read-only files)
for follow-on LLM review. Never executes submitted content and never uses the network.
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import stat
import tempfile
import zipfile
from dataclasses import asdict, dataclass
from pathlib import Path

SCHEMA_VERSION = "1.2"
MAX_FILES = 1000
MAX_FILE_BYTES = 2 * 1024 * 1024
MAX_UNCOMPRESSED = 50 * 1024 * 1024
MAX_RATIO = 1000
MAX_ENTRY_READ = 512 * 1024

# Inert text marker modeled on the EICAR concept. Not a runnable payload.
TEST_SIGNATURE = "AGENTHOUSE-SKILL-ANTIVIRUS-TEST-FILE"
LEGACY_TEST_SIGNATURE = "EICAR-ANTIVIRUS-TEST-FILE"

TEXT_SUFFIXES = {
    ".md", ".txt", ".json", ".jsonl", ".yaml", ".yml", ".toml", ".ini", ".cfg",
    ".py", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".sh", ".bash", ".zsh",
    ".ps1", ".bat", ".cmd", ".rb", ".go", ".rs", ".java", ".xml", ".html", ".css",
    ".svg", ".env", ".sample", ".example", ".gitignore", ".vbs", ".hta", ".wsf",
}
MANIFEST_NAMES = {
    "package.json", "package-lock.json", "npm-shrinkwrap.json",
    "requirements.txt", "pyproject.toml", "setup.py", "Pipfile",
    "Cargo.toml", "go.mod", "Gemfile", "composer.json",
}
# Native / installer payloads — recommend classic AV; optional user-consented VT.
NATIVE_EXECUTABLE_SUFFIXES = {
    ".exe", ".com", ".scr", ".msi", ".dll", ".sys", ".drv", ".cpl", ".pif",
    ".bin", ".so", ".dylib", ".wasm", ".node", ".ocx", ".ax",
}
# Script-host payloads uncommon in legitimate skills.
HOST_SCRIPT_SUFFIXES = {
    ".vbs", ".vbe", ".hta", ".wsf", ".wsh", ".msc", ".bat", ".cmd", ".jse",
}
IMAGE_SUFFIXES = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".bmp"}
ARCHIVE_SUFFIXES = {".zip", ".tar", ".gz", ".tgz", ".bz2", ".7z", ".rar", ".xz"}
SHELL_SCRIPT_SUFFIXES = {".ps1", ".sh", ".bash", ".zsh"}

SEVERITY_RANK = {"low": 1, "medium": 2, "high": 3, "critical": 4}

VT_HINT = (
    "Scan with a classic antivirus. Optionally, the user may upload this specific "
    "file to VirusTotal (https://www.virustotal.com/) or another multi-engine scanner "
    "— only with explicit user consent. Never auto-upload; do not upload whole skill "
    "ZIPS or documents that may contain secrets."
)

EXPLANATIONS = {
    "prompt-injection": "Attempts to override the reviewing agent's instruction hierarchy.",
    "trust-misrepresentation": "Misrepresents authority or urgency to skip normal safety review.",
    "secret-access": "May access or collect credentials or other secrets.",
    "browser-or-clipboard": "May access browser data, cookies, or clipboard contents.",
    "private-file-harvest": "May collect private local files unrelated to a narrow declared task.",
    "exfiltration": "May transmit sensitive data off-host.",
    "network-or-download": "Uses network access, remote content, or package download behavior that needs review.",
    "remote-code": "May download and execute or evaluate remote code.",
    "privilege-escalation": "May elevate privileges beyond a normal skill install.",
    "persistence": "May survive beyond the intended task via startup/login hooks.",
    "unauthorized-install": "May install software, extensions, or global tools without clear consent.",
    "destructive": "May delete, encrypt, overwrite, or otherwise disrupt data.",
    "resource-abuse": "May exhaust CPU, memory, disk, or process limits.",
    "obfuscation": "Uses encoding or concealment that can hide behavior.",
    "dynamic-code": "Generates or evaluates code dynamically, reducing reviewability.",
    "evasion": "Attempts to avoid detection, logging, or user awareness.",
    "suspicious-dependency": "Dependency metadata looks risky, mutable, or mismatched to purpose.",
    "install-hook": "Install-time hooks can run unexpected code during package setup.",
    "executable-payload": "Executable or script-host payload; not fully assessable by this skill — use classic antivirus.",
    "shell-script": "Shell/PowerShell script present; review as code, do not execute during antivirus review.",
    "opaque-asset": "Binary or media asset that text review cannot fully assess.",
    "native-binary": "Contains native or opaque binary content that text review cannot fully assess.",
    "provenance": "Authorship, licensing, or packaging provenance looks inconsistent or missing.",
    "archive-hazard": "The archive exceeds safe structural limits and may be abusive to process.",
    "archive-traversal": "The archive contains a path that could escape its extraction directory.",
    "archive-symlink": "The archive contains a symlink that could redirect extraction outside its directory.",
    "archive-bomb": "The archive has unsafe compression or expansion characteristics.",
    "nested-archive": "Nested archives can conceal additional content from a superficial review.",
    "misleading-filename": "Filename appears crafted to disguise executable or hidden content.",
    "invalid-package": "The package could not be safely parsed as a valid archive.",
    "test-signature": "Contains an inert antivirus test marker; this is not evidence of executable malware.",
    "hidden-payload": "Hidden or dotfile content may conceal instructions or scripts.",
    "staging-blocked": "Unsafe archive entry blocked during contained staging.",
}

REMEDIATIONS = {
    "test-signature": "Keep only in isolated fixtures/tests; remove from distributable skills.",
    "archive-traversal": "Rebuild the archive without absolute or parent-path entries.",
    "archive-symlink": "Remove symlinks from distributable skill packages.",
    "archive-bomb": "Reduce archive size and compression ratio; split content if needed.",
    "nested-archive": "Avoid nested archives; ship a flat skill directory instead. Do not auto-extract nested archives during review.",
    "executable-payload": VT_HINT,
    "native-binary": VT_HINT,
    "opaque-asset": "Confirm the asset is required and benign; keep it out of executable paths.",
    "shell-script": "Review script text under containment; remove if not required for the skill.",
    "install-hook": "Remove install-time scripts or document and pin them for explicit user consent.",
    "staging-blocked": "Rebuild the package without traversal/symlink entries before review can continue safely.",
}

LINE_RULES: list[tuple[str, str, re.Pattern[str]]] = [
    ("prompt-injection", "high", re.compile(
        r"(?i)(ignore|disregard|override|bypass)\s+((all|any|previous|prior|system|developer|safety|above)\s+){0,3}"
        r"(instructions|rules|messages|guardrails|policies)|you\s+are\s+now\s+(?:in\s+)?(?:unrestricted|jailbreak)|"
        r"jailbreak\s+mode|do\s+not\s+follow\s+(?:your|the)\s+(?:system|safety)"
    )),
    ("trust-misrepresentation", "medium", re.compile(
        r"(?i)(official\s+(security\s+)?update\s+from\s+(openai|anthropic|cursor|agenthouse)|"
        r"mandated\s+by\s+(openai|anthropic|cursor)|disable\s+safety\s+to\s+continue)"
    )),
    ("secret-access", "high", re.compile(
        r"(?i)((api[_ -]?key|access[_ -]?token|auth(entication)?[_ -]?token|password|secret|credential|"
        r"private[_ -]?key|\.env|aws_secret|ssh\s*key).{0,60}(read|collect|send|extract|steal|upload|exfil|"
        r"harvest|dump|exfiltrat))|"
        r"((read|collect|steal|harvest|dump|exfiltrat).{0,60}(api[_ -]?key|token|password|secret|credential|"
        r"private[_ -]?key|\.env))"
    )),
    ("browser-or-clipboard", "high", re.compile(
        r"(?i)(cookie(s)?|browser\s+profile|login\s+data|keychain|credential\s+manager|clipboard).{0,40}"
        r"(read|dump|steal|exfil|upload|send)|"
        r"(read|dump|steal).{0,40}(clipboard|cookies|browser\s+data)"
    )),
    ("private-file-harvest", "high", re.compile(
        r"(?i)(read|collect|upload|zip|exfil).{0,50}(~\/|home\s+directory|documents\s+folder|"
        r"private\s+files|all\s+files|entire\s+disk)|steal\s+(files|documents|photos)"
    )),
    ("exfiltration", "high", re.compile(
        r"(?i)(curl|wget|invoke-webrequest|invoke-restmethod|requests\.|httpx\.|urllib|fetch\s*\(|"
        r"webhook|telegram|discord\.com/api|pastebin).{0,100}"
        r"(env|secret|token|password|cookie|clipboard|file|key)|"
        r"(exfiltrat|send\s+(?:secrets|credentials|tokens)\s+to)"
    )),
    ("remote-code", "critical", re.compile(
        r"(?i)(curl|wget|irm|invoke-webrequest).{0,80}(\|\s*(sh|bash|zsh|powershell|pwsh|iex|python)|"
        r">\s*/tmp/.{0,40}(sh|bash|py))|"
        r"(iex\s*\(|invoke-expression).{0,40}(http|download)|"
        r"download.{0,40}(and\s+)?(execute|run|eval)|"
        r"pip\s+install\s+.+https?://|npm\s+install\s+.+git\+"
    )),
    ("network-or-download", "medium", re.compile(
        r"(?i)\b(curl|wget|invoke-webrequest|invoke-restmethod|pip\s+install|npm\s+install|pnpm\s+install|"
        r"yarn\s+add|gem\s+install|cargo\s+install)\b|"
        r"(?<!xmlns=['\"])https?://[^\s)\"']+"
    )),
    ("privilege-escalation", "high", re.compile(
        r"(?i)\b(sudo\s+|runas\b|pkexec\b|doas\b|chmod\s+[0-7]*[sS]|setuid|uac\s+bypass)\b"
    )),
    ("persistence", "high", re.compile(
        r"(?i)(schtasks|scheduled\s+task|launchagent|launchdaemon|\bcrontab\b|"
        r"startup\s+folder|currentversion\\\\run|New-Service|systemctl\s+enable|"
        r"(?:^|[^.\w])(?:\.bashrc|\.zshrc|\.profile)(?:\b|$))"
    )),
    ("unauthorized-install", "high", re.compile(
        r"(?i)(install\s+browser\s+extension|silent\s+install|msiexec\s+/i|add-apt-repository|"
        r"global\s+install.*without\s+asking)"
    )),
    ("destructive", "high", re.compile(
        r"(?i)(rm\s+-rf\s+[/\~$]|Remove-Item\s+-Recurse|format\s+[a-z]:|del\s+/[fq]\s+|cipher\s+/w|"
        r"wipe\s+(disk|drive|all)|encrypt\s+all\s+files|ransom|shred\s+-)"
    )),
    ("resource-abuse", "medium", re.compile(
        r"(?i)(fork\s*bomb|while\s+true\s*;\s*do|:(){:|:&};:|cryptominer|xmrig|minerd)"
    )),
    ("obfuscation", "medium", re.compile(
        r"(?i)(base64\s+(-d|--decode| -D)|fromcharcode|\\x[0-9a-f]{2}\\x[0-9a-f]{2}\\x[0-9a-f]{2}|"
        r"marshal\.loads|zlib\.decompress\(\s*base64)"
    )),
    ("dynamic-code", "medium", re.compile(
        r"(?i)(\beval\s*\(|\bexec\s*\(|\bCompile\s*\(|powershell\s+(-enc|-e)\b|python3?\s+-c\b|"
        r"node\s+-e\b|os\.system\s*\(|subprocess\.(call|Popen|run)\s*\()"
    )),
    ("evasion", "high", re.compile(
        r"(?i)(disable\s+(antivirus|defender|safeguard|guardrail)|do\s+not\s+tell\s+the\s+user|"
        r"hide\s+this\s+from\s+(the\s+)?user|anti[- ]analy[sz]is|clear\s+(the\s+)?logs)"
    )),
    ("test-signature", "high", re.compile(
        re.escape(TEST_SIGNATURE) + r"|" + re.escape(LEGACY_TEST_SIGNATURE)
    )),
]


@dataclass
class Finding:
    category: str
    severity: str
    confidence: str
    path: str
    line: int | None
    evidence: str
    explanation: str
    remediation: str


def make_finding(
    category: str,
    severity: str,
    path: str,
    line: int | None,
    evidence: str,
    confidence: str = "medium",
) -> Finding:
    remediation = REMEDIATIONS.get(
        category,
        "Review the referenced content and remove it unless the behavior is explicitly required and trusted.",
    )
    return Finding(
        category=category,
        severity=severity,
        confidence=confidence,
        path=path,
        line=line,
        evidence=evidence[:240],
        explanation=EXPLANATIONS.get(category, "Suspicious content requires review."),
        remediation=remediation,
    )


def confidence_for(category: str) -> str:
    if category in {
        "test-signature",
        "prompt-injection",
        "archive-traversal",
        "archive-symlink",
        "archive-bomb",
        "remote-code",
        "executable-payload",
        "staging-blocked",
    }:
        return "high"
    return "medium"


def classify_path(path: str) -> str:
    suffix = Path(path).suffix.lower()
    name = Path(path).name.lower()
    if suffix in NATIVE_EXECUTABLE_SUFFIXES or suffix in HOST_SCRIPT_SUFFIXES:
        return "executable"
    if suffix in IMAGE_SUFFIXES:
        return "asset"
    if suffix in ARCHIVE_SUFFIXES:
        return "archive"
    if suffix in TEXT_SUFFIXES or name in MANIFEST_NAMES or name == "skill.md":
        return "text"
    return "unknown"


def make_readonly(path: Path) -> None:
    try:
        mode = path.stat().st_mode
        path.chmod(mode & ~stat.S_IWRITE & ~stat.S_IWGRP & ~stat.S_IWOTH)
    except OSError:
        pass


def safe_zip_member_path(name: str) -> Path | None:
    if not name or name.endswith("/"):
        return None
    normalized = name.replace("\\", "/")
    if normalized.startswith("/") or re.match(r"^[A-Za-z]:", normalized):
        return None
    parts = Path(normalized).parts
    if not parts or ".." in parts:
        return None
    return Path(*parts)


def stage_zip(source: Path, stage_dir: Path | None = None) -> tuple[Path, list[dict], list[Finding]]:
    """Extract a ZIP into a contained temp directory. Never executes members."""
    findings: list[Finding] = []
    inventory: list[dict] = []
    root = Path(stage_dir) if stage_dir else Path(tempfile.mkdtemp(prefix="skill-antivirus-stage-"))
    root.mkdir(parents=True, exist_ok=True)

    try:
        with zipfile.ZipFile(source) as archive:
            infos = archive.infolist()
            if len(infos) > MAX_FILES:
                findings.append(
                    make_finding("archive-hazard", "high", source.name, None, f"{len(infos)} entries", "high")
                )
            total = 0
            written = 0
            for info in infos[:MAX_FILES]:
                name = info.filename
                target_rel = safe_zip_member_path(name)
                mode = info.external_attr >> 16
                if mode and stat.S_ISLNK(mode):
                    findings.append(make_finding("archive-symlink", "high", name, None, "symlink entry", "high"))
                    findings.append(make_finding("staging-blocked", "high", name, None, "symlink not staged", "high"))
                    continue
                if target_rel is None:
                    if name.endswith(("/", "\\")):
                        continue
                    findings.append(make_finding("archive-traversal", "high", name, None, name, "high"))
                    findings.append(make_finding("staging-blocked", "high", name, None, "unsafe path not staged", "high"))
                    continue

                lower = name.lower().replace("\\", "/")
                if any(lower.endswith(ext) for ext in ARCHIVE_SUFFIXES):
                    findings.append(make_finding("nested-archive", "medium", str(target_rel).replace("\\", "/"), None, name, "high"))
                    # Containment: do not extract nested archives.
                    inventory.append({
                        "path": str(target_rel).replace("\\", "/"),
                        "kind": "archive",
                        "size": info.file_size,
                        "staged": False,
                        "note": "nested archive not extracted",
                    })
                    continue

                total += max(info.file_size, 0)
                if total > MAX_UNCOMPRESSED:
                    findings.append(
                        make_finding("archive-bomb", "high", str(target_rel), None, f"total>{MAX_UNCOMPRESSED}", "high")
                    )
                    break
                if info.compress_size and info.file_size and info.file_size / max(info.compress_size, 1) > MAX_RATIO:
                    findings.append(
                        make_finding(
                            "archive-bomb",
                            "high",
                            str(target_rel),
                            None,
                            f"uncompressed={info.file_size}; compressed={info.compress_size}",
                            "high",
                        )
                    )
                    continue
                if info.file_size > MAX_FILE_BYTES:
                    findings.append(
                        make_finding(
                            "archive-hazard",
                            "medium",
                            str(target_rel),
                            None,
                            f"entry larger than {MAX_FILE_BYTES} bytes",
                            "medium",
                        )
                    )

                dest = root / target_rel
                dest.parent.mkdir(parents=True, exist_ok=True)
                data = archive.read(info)
                # Cap what we write; scanning uses the same cap.
                dest.write_bytes(data[:MAX_ENTRY_READ] if len(data) > MAX_ENTRY_READ else data)
                make_readonly(dest)
                written += 1
                rel = str(target_rel).replace("\\", "/")
                inventory.append({
                    "path": rel,
                    "kind": classify_path(rel),
                    "size": len(data),
                    "staged": True,
                    "staged_path": str(dest),
                })
    except (zipfile.BadZipFile, OSError, RuntimeError) as exc:
        findings.append(make_finding("invalid-package", "high", source.name, None, str(exc), "high"))

    make_readonly(root)
    return root, inventory, findings


def inventory_dir(source: Path) -> list[dict]:
    items: list[dict] = []
    for path in sorted(source.rglob("*")):
        if not path.is_file():
            continue
        parts = set(path.parts)
        if ".git" in parts or "__pycache__" in parts or "node_modules" in parts:
            continue
        rel = str(path.relative_to(source)).replace("\\", "/")
        try:
            size = path.stat().st_size
        except OSError:
            size = 0
        items.append({
            "path": rel,
            "kind": classify_path(rel),
            "size": size,
            "staged": False,
            "staged_path": str(path),
        })
        if len(items) >= MAX_FILES:
            break
    return items


def scan_text(path: str, text: str) -> list[Finding]:
    results: list[Finding] = []
    for number, line in enumerate(text.splitlines(), 1):
        for category, severity, pattern in LINE_RULES:
            if pattern.search(line):
                results.append(
                    make_finding(category, severity, path, number, line.strip(), confidence_for(category))
                )
    return results


def looks_binary(data: bytes) -> bool:
    if not data:
        return False
    sample = data[:4096]
    if b"\x00" in sample:
        return True
    textish = sum(1 for b in sample if b in (9, 10, 13) or 32 <= b <= 126)
    return textish / max(len(sample), 1) < 0.75


def misleading_filename(path: str) -> Finding | None:
    name = Path(path).name
    lower = name.lower()
    if re.search(r"\.(md|txt|pdf|png|jpg|html)\.(exe|bat|cmd|ps1|js|scr|com|vbs|hta)$", lower):
        return make_finding("misleading-filename", "high", path, None, name, "high")
    if name.startswith(".") and Path(path).suffix.lower() in NATIVE_EXECUTABLE_SUFFIXES | HOST_SCRIPT_SUFFIXES | SHELL_SCRIPT_SUFFIXES:
        return make_finding("hidden-payload", "medium", path, None, name, "medium")
    if re.search(r"[\u200b-\u200f\u202a-\u202e]", name):
        return make_finding("misleading-filename", "high", path, None, "name contains bidi/zero-width chars", "high")
    return None


def scan_manifest(path: str, text: str) -> list[Finding]:
    results: list[Finding] = []
    lower_name = Path(path).name.lower()
    if lower_name == "package.json":
        try:
            data = json.loads(text)
        except json.JSONDecodeError:
            return results
        scripts = data.get("scripts") or {}
        for hook in ("preinstall", "postinstall", "install", "prepare", "prepublish"):
            if hook in scripts:
                results.append(
                    make_finding("install-hook", "high", path, None, f"{hook}: {scripts[hook]}", "high")
                )
        for section in ("dependencies", "devDependencies", "optionalDependencies", "peerDependencies"):
            deps = data.get(section) or {}
            if not isinstance(deps, dict):
                continue
            for dep_name, spec in deps.items():
                spec_s = str(spec)
                if re.search(r"(?i)(git\+|github:|http://|https://|file:)", spec_s):
                    results.append(
                        make_finding("suspicious-dependency", "medium", path, None, f"{dep_name}: {spec_s}", "medium")
                    )
    if lower_name in {"setup.py", "pyproject.toml"} and re.search(
        r"(?i)(cmdclass|postinstall|os\.system|subprocess|urllib\.request)", text
    ):
        results.append(
            make_finding(
                "install-hook",
                "high",
                path,
                None,
                "install-time code execution pattern in Python packaging metadata",
                "medium",
            )
        )
    return results


def extension_findings(path: str) -> list[Finding]:
    suffix = Path(path).suffix.lower()
    results: list[Finding] = []
    if suffix in NATIVE_EXECUTABLE_SUFFIXES or suffix in HOST_SCRIPT_SUFFIXES:
        results.append(
            make_finding(
                "executable-payload",
                "high",
                path,
                None,
                f"executable or script-host extension: {suffix or '[none]'}",
                "high",
            )
        )
    elif suffix in SHELL_SCRIPT_SUFFIXES:
        results.append(
            make_finding("shell-script", "medium", path, None, f"shell script extension: {suffix}", "medium")
        )
    return results


def scan_bytes(path: str, data: bytes) -> list[Finding]:
    results: list[Finding] = []
    mis = misleading_filename(path)
    if mis:
        results.append(mis)
    results.extend(extension_findings(path))

    suffix = Path(path).suffix.lower()
    name = Path(path).name.lower()

    if suffix in IMAGE_SUFFIXES or (looks_binary(data) and suffix not in TEXT_SUFFIXES and name not in MANIFEST_NAMES):
        category = "opaque-asset" if suffix in IMAGE_SUFFIXES else "native-binary"
        # Prefer executable-payload when extension already classified as executable.
        if suffix not in NATIVE_EXECUTABLE_SUFFIXES and suffix not in HOST_SCRIPT_SUFFIXES:
            results.append(
                make_finding(category, "medium", path, None, "Binary or opaque content detected", "high" if category == "native-binary" else "medium")
            )
        ascii_view = data.decode("utf-8", errors="ignore")
        if TEST_SIGNATURE in ascii_view or LEGACY_TEST_SIGNATURE in ascii_view:
            results.append(make_finding("test-signature", "high", path, None, TEST_SIGNATURE, "high"))
        if suffix in IMAGE_SUFFIXES:
            return results
        if looks_binary(data) and suffix not in TEXT_SUFFIXES:
            return results

    text = data.decode("utf-8", errors="replace")
    results.extend(scan_text(path, text))
    if name in MANIFEST_NAMES or Path(path).name in MANIFEST_NAMES:
        results.extend(scan_manifest(path, text))
    if Path(path).name.startswith(".") and suffix in HOST_SCRIPT_SUFFIXES | SHELL_SCRIPT_SUFFIXES | NATIVE_EXECUTABLE_SUFFIXES:
        results.append(make_finding("hidden-payload", "medium", path, None, Path(path).name, "medium"))
    return results


def scan_zip_members(source: Path) -> list[Finding]:
    """Static analysis of ZIP members without staging (used when --stage is off)."""
    results: list[Finding] = []
    try:
        with zipfile.ZipFile(source) as archive:
            infos = archive.infolist()
            if len(infos) > MAX_FILES:
                results.append(make_finding("archive-hazard", "high", source.name, None, f"{len(infos)} entries", "high"))
            total = 0
            for info in infos[:MAX_FILES]:
                name = info.filename
                normalized = Path(name)
                if name.startswith(("/", "\\")) or ".." in normalized.parts or re.match(r"^[A-Za-z]:", name):
                    results.append(make_finding("archive-traversal", "high", name, None, name, "high"))
                mode = info.external_attr >> 16
                if mode and stat.S_ISLNK(mode):
                    results.append(make_finding("archive-symlink", "high", name, None, "symlink entry", "high"))
                total += max(info.file_size, 0)
                if total > MAX_UNCOMPRESSED:
                    results.append(make_finding("archive-bomb", "high", name, None, f"total_uncompressed>{MAX_UNCOMPRESSED}", "high"))
                    break
                if info.compress_size and info.file_size and info.file_size / max(info.compress_size, 1) > MAX_RATIO:
                    results.append(
                        make_finding(
                            "archive-bomb",
                            "high",
                            name,
                            None,
                            f"uncompressed={info.file_size}; compressed={info.compress_size}",
                            "high",
                        )
                    )
                lower = name.lower()
                if any(lower.endswith(ext) for ext in ARCHIVE_SUFFIXES) and not info.is_dir():
                    results.append(make_finding("nested-archive", "medium", name, None, name, "high"))
                if info.is_dir():
                    continue
                if info.file_size > MAX_FILE_BYTES:
                    results.append(
                        make_finding("archive-hazard", "medium", name, None, f"entry larger than {MAX_FILE_BYTES} bytes", "medium")
                    )
                results.extend(scan_bytes(name.replace("\\", "/"), archive.read(info)[:MAX_ENTRY_READ]))
    except (zipfile.BadZipFile, OSError, RuntimeError) as exc:
        results.append(make_finding("invalid-package", "high", source.name, None, str(exc), "high"))
    return results


def iter_dir_files(root: Path) -> list[Path]:
    files: list[Path] = []
    for path in sorted(root.rglob("*")):
        if not path.is_file():
            continue
        parts = set(path.parts)
        if ".git" in parts or "__pycache__" in parts or "node_modules" in parts:
            continue
        files.append(path)
        if len(files) > MAX_FILES:
            break
    return files


def scan_dir(source: Path) -> list[Finding]:
    results: list[Finding] = []
    files = iter_dir_files(source)
    if len(files) > MAX_FILES:
        results.append(make_finding("archive-hazard", "high", str(source), None, f"more than {MAX_FILES} files", "high"))
    total = 0
    for path in files[:MAX_FILES]:
        rel = str(path.relative_to(source)).replace("\\", "/")
        try:
            size = path.stat().st_size
        except OSError as exc:
            results.append(make_finding("invalid-package", "medium", rel, None, str(exc), "medium"))
            continue
        total += size
        if total > MAX_UNCOMPRESSED:
            results.append(make_finding("archive-bomb", "high", rel, None, f"tree exceeds {MAX_UNCOMPRESSED} bytes", "high"))
            break
        if path.is_symlink():
            results.append(make_finding("archive-symlink", "high", rel, None, "symlink file", "high"))
            continue
        if size > MAX_FILE_BYTES:
            results.append(
                make_finding("archive-hazard", "medium", rel, None, f"file larger than {MAX_FILE_BYTES} bytes", "medium")
            )
        data = path.read_bytes()[:MAX_ENTRY_READ]
        results.extend(scan_bytes(rel, data))
        if any(rel.lower().endswith(ext) for ext in ARCHIVE_SUFFIXES):
            results.append(make_finding("nested-archive", "medium", rel, None, rel, "high"))
    return results


def dedupe(findings: list[Finding]) -> list[Finding]:
    seen: set[tuple] = set()
    out: list[Finding] = []
    for item in findings:
        key = (item.category, item.path, item.line, item.evidence)
        if key in seen:
            continue
        seen.add(key)
        out.append(item)
    return out


def verdict_for(findings: list[Finding]) -> tuple[str, str]:
    if not findings:
        return "CLEAN", "high"
    max_severity = max(SEVERITY_RANK[item.severity] for item in findings)
    verdict = "UNSAFE" if max_severity >= SEVERITY_RANK["high"] else "REVIEW"
    confidence = "high" if any(item.confidence == "high" for item in findings) else "medium"
    return verdict, confidence


def scan(source: Path, stage: bool = False, stage_dir: Path | None = None) -> dict:
    source = source.resolve()
    stage_path: str | None = None
    inventory: list[dict] = []
    findings: list[Finding] = []

    if source.is_dir():
        findings = scan_dir(source)
        inventory = inventory_dir(source)
        input_kind = "directory"
    elif source.suffix.lower() == ".zip":
        input_kind = "zip"
        if stage:
            root, inventory, stage_findings = stage_zip(source, stage_dir)
            stage_path = str(root)
            findings.extend(stage_findings)
            # Static-analyze staged files (and record nested archives already flagged).
            findings.extend(scan_dir(root))
            # Also re-check zip structure for members that were not staged.
            findings.extend(scan_zip_members(source))
        else:
            findings = scan_zip_members(source)
            # Inventory from zip headers only (not staged).
            try:
                with zipfile.ZipFile(source) as archive:
                    for info in archive.infolist()[:MAX_FILES]:
                        if info.is_dir():
                            continue
                        rel = info.filename.replace("\\", "/")
                        inventory.append({
                            "path": rel,
                            "kind": classify_path(rel),
                            "size": info.file_size,
                            "staged": False,
                        })
            except (zipfile.BadZipFile, OSError):
                pass
    elif source.is_file():
        data = source.read_bytes()[:MAX_ENTRY_READ]
        findings = scan_bytes(source.name, data)
        inventory = [{
            "path": source.name,
            "kind": classify_path(source.name),
            "size": source.stat().st_size,
            "staged": False,
            "staged_path": str(source),
        }]
        input_kind = "file"
    else:
        findings = [make_finding("invalid-package", "high", str(source), None, "input not found", "high")]
        input_kind = "unknown"

    findings = dedupe(findings)
    verdict, confidence = verdict_for(findings)
    report = {
        "schema_version": SCHEMA_VERSION,
        "input": str(source),
        "input_kind": input_kind,
        "stage_dir": stage_path,
        "inventory": inventory,
        "inventory_count": len(inventory),
        "verdict": verdict,
        "confidence": confidence,
        "finding_count": len(findings),
        "findings": [asdict(item) for item in findings],
        "containment": {
            "executed_content": False,
            "network_access": False,
            "nested_archives_extracted": False,
            "auto_uploaded": False,
            "staged_readonly": bool(stage_path),
        },
        "limitations": (
            "Static analysis cannot guarantee the absence of malware; "
            "submitted content was not executed or networked. "
            "LLM review (agent mode) must still inspect every inventoried text file under containment rules. "
            "Executables need classic antivirus; VirusTotal only with explicit user consent."
        ),
    }
    return report


def render_human(report: dict) -> str:
    lines = [
        f"Verdict: {report['verdict']} (confidence: {report['confidence']})",
        f"Input: {report['input']} ({report.get('input_kind', 'unknown')})",
        f"Inventory: {report.get('inventory_count', 0)} files",
    ]
    if report.get("stage_dir"):
        lines.append(f"Stage (read-only extract): {report['stage_dir']}")
    lines.append(f"Findings: {report['finding_count']}")
    for item in report["findings"]:
        location = f"{item['path']}:{item['line']}" if item["line"] else item["path"]
        lines.append(
            f"- [{item['severity']}/{item['confidence']}] {item['category']} at {location}: {item['evidence']}"
        )
    lines.append(report["limitations"])
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Statically scan a SKILL.md, skill directory, or skill ZIP without executing it"
    )
    parser.add_argument("input", type=Path)
    parser.add_argument("--json-out", type=Path)
    parser.add_argument(
        "--stage",
        action="store_true",
        help="For ZIP inputs: extract safely to a temp dir (read-only) for agent/LLM review",
    )
    parser.add_argument(
        "--stage-dir",
        type=Path,
        help="Optional explicit staging directory (created if needed). Prefer omitting to use a system temp dir.",
    )
    parser.add_argument(
        "--cleanup-stage",
        action="store_true",
        help="Delete stage_dir after scanning (only with --stage). Use when no LLM follow-up will read the files.",
    )
    args = parser.parse_args()
    if not args.input.exists():
        parser.error(f"input not found: {args.input}")
    if args.stage_dir and not args.stage:
        parser.error("--stage-dir requires --stage")
    if args.cleanup_stage and not args.stage:
        parser.error("--cleanup-stage requires --stage")

    report = scan(args.input, stage=args.stage, stage_dir=args.stage_dir)
    if args.json_out:
        args.json_out.parent.mkdir(parents=True, exist_ok=True)
        args.json_out.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(render_human(report))

    if args.cleanup_stage and report.get("stage_dir"):
        shutil.rmtree(report["stage_dir"], ignore_errors=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
