#!/usr/bin/env python3
"""Build and validate AgentHouse skill release artifacts."""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import tempfile
import zipfile
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = Path(__file__).with_name("update-management.md")
SEMVER = re.compile(r"^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$")


def frontmatter(path: Path) -> tuple[str, str, str]:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        raise ValueError(f"{path} has no YAML frontmatter")
    end = text.find("\n---", 4)
    if end < 0:
        raise ValueError(f"{path} has invalid YAML frontmatter")
    block = text[4:end]
    values: dict[str, str] = {}
    for line in block.splitlines():
        match = re.match(r"^([A-Za-z0-9_-]+):\s*(.*)$", line)
        if match:
            value = match.group(2).strip()
            if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
                value = value[1:-1]
            values[match.group(1)] = value
    return text, text[end + 4 :], values


def discover(root: Path = ROOT) -> list[dict[str, str]]:
    result = []
    ignored = {".git", ".github", "build", "dist", "release-assets", "node_modules"}
    for skill_file in sorted(root.rglob("SKILL.md")):
        if any(part in ignored for part in skill_file.parts):
            continue
        _, _, meta = frontmatter(skill_file)
        name, version = meta.get("name", "").strip(), meta.get("version", "").strip()
        if not name or not version:
            raise ValueError(f"{skill_file} requires name and version")
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", name):
            raise ValueError(f"Invalid skill name: {name}")
        if not SEMVER.fullmatch(version):
            raise ValueError(f"Invalid semantic version: {version}")
        if skill_file.parent.name != name:
            raise ValueError(f"Folder '{skill_file.parent.name}' does not match skill name '{name}'")
        result.append({"path": str(skill_file.parent.relative_to(root)), "name": name, "version": version, "description": meta.get("description", "").strip()})
    if not result:
        raise ValueError("No skills found")
    return result


def enriched_skill(source: Path, item: dict[str, str], release_date: str, manifest_url: str) -> str:
    text, body, _ = frontmatter(source)
    end = text.find("\n---", 4)
    metadata = [
        "metadata:",
        "  publisher: AgentHouse",
        f'  version: "{item["version"]}"',
        f'  release-date: "{release_date}"',
        f'  update-manifest: "{manifest_url}"',
    ]
    new_frontmatter = text[4:end] + "\n" + "\n".join(metadata) + text[end:]
    return new_frontmatter + body + TEMPLATE.read_text(encoding="utf-8")


def package(item: dict[str, str], output: Path, release_date: str, manifest_url: str) -> Path:
    source_dir = ROOT / item["path"]
    stage = output / item["name"]
    shutil.copytree(source_dir, stage)
    (stage / "SKILL.md").write_text(enriched_skill(source_dir / "SKILL.md", item, release_date, manifest_url), encoding="utf-8")
    asset = output / f'{item["name"]}-v{item["version"]}.zip'
    with zipfile.ZipFile(asset, "w", zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(stage.rglob("*")):
            if path.is_file():
                archive.write(path, Path(item["name"]) / path.relative_to(stage))
    digest = hashlib.sha256(asset.read_bytes()).hexdigest()
    asset.with_name(asset.name + ".sha256").write_text(f"{digest}  {asset.name}\n", encoding="utf-8")
    return asset


def manifest(items: list[dict[str, str]], release_date: str, repository: str, release_tag: str, output: Path) -> Path:
    data = {}
    for item in items:
        entry = {"latest": item["version"], "released": release_date, "releaseUrl": f"https://github.com/{repository}/releases/tag/{release_tag}"}
        data[item["name"]] = entry
    target = output / "manifest.json"
    target.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return target


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=["validate", "package", "manifest"])
    parser.add_argument("--output", type=Path, default=Path("dist"))
    parser.add_argument("--repository", default="AgentHouse-org/skills")
    parser.add_argument("--release-tag", default="release-local")
    parser.add_argument("--release-date", default=date.today().isoformat())
    parser.add_argument("--manifest-url", default="https://agenthouse-org.github.io/skills/manifest.json")
    args = parser.parse_args()
    items = discover()
    if args.command == "validate":
        print(json.dumps(items, indent=2))
    elif args.command == "manifest":
        args.output.mkdir(parents=True, exist_ok=True)
        print(manifest(items, args.release_date, args.repository, args.release_tag, args.output))
    else:
        args.output.mkdir(parents=True, exist_ok=True)
        for item in items:
            print(package(item, args.output, args.release_date, args.manifest_url))


if __name__ == "__main__":
    main()
