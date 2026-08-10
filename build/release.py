#!/usr/bin/env python3
"""Build and validate AgentHouse skill release artifacts."""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import zipfile
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = Path(__file__).with_name("update-management.md")
PAGES_SRC = Path(__file__).with_name("pages")
SEMVER = re.compile(r"^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$")

SKILLS_TABLE_START = "<!-- SKILLS_TABLE_START -->"
SKILLS_TABLE_END = "<!-- SKILLS_TABLE_END -->"
DOWNLOAD_START = "<!-- DOWNLOAD_START -->"
DOWNLOAD_END = "<!-- DOWNLOAD_END -->"


def frontmatter(path: Path) -> tuple[str, str, dict[str, str]]:
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


def title_case(name: str) -> str:
    return name.replace("-", " ").title()


def category_of(path: str) -> str:
    parts = Path(path).parts
    if len(parts) >= 2:
        return parts[0]
    return "uncategorized"


def download_url(repository: str, release_tag: str, name: str, version: str) -> str:
    return f"https://github.com/{repository}/releases/download/{release_tag}/{name}-v{version}.zip"


def skill_url(repository: str, path: str) -> str:
    return f"https://github.com/{repository}/tree/main/{path}"


def discover(root: Path = ROOT) -> list[dict[str, str]]:
    result = []
    # fixtures/ and tests/ may contain self-test packages that must not be published
    # as catalogue skills. Fixtures must not use SKILL.md (ZIP loaders require exactly one).
    ignored = {".git", ".github", "build", "dist", "release-assets", "pages", "node_modules", "fixtures", "tests"}
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
        rel = str(skill_file.parent.relative_to(root)).replace("\\", "/")
        result.append(
            {
                "path": rel,
                "name": name,
                "version": version,
                "description": meta.get("description", "").strip(),
                "category": category_of(rel),
                "author": meta.get("author", "").strip(),
                "license": meta.get("license", "").strip(),
            }
        )
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
    new_frontmatter = text[:4] + text[4:end] + "\n" + "\n".join(metadata) + text[end:]
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


def replace_markers(text: str, start: str, end: str, body: str) -> str:
    if start not in text or end not in text:
        raise ValueError(f"Missing markers {start} / {end}")
    return re.sub(
        rf"{re.escape(start)}.*?{re.escape(end)}",
        f"{start}\n{body}\n{end}",
        text,
        count=1,
        flags=re.DOTALL,
    )


def ensure_download_markers(readme: str) -> str:
    if DOWNLOAD_START in readme and DOWNLOAD_END in readme:
        return readme
    block = f"\n{DOWNLOAD_START}\n{DOWNLOAD_END}\n"
    match = re.search(r"^# .+$", readme, flags=re.MULTILINE)
    if not match:
        return readme.rstrip() + "\n" + block
    insert_at = match.end()
    return readme[:insert_at] + "\n" + block + readme[insert_at:]


def download_section(item: dict[str, str], repository: str, release_tag: str) -> str:
    zip_url = download_url(repository, release_tag, item["name"], item["version"])
    release_url = f"https://github.com/{repository}/releases/tag/{release_tag}"
    asset = f'{item["name"]}-v{item["version"]}.zip'
    return "\n".join(
        [
            "## Download",
            "",
            f"- **Version:** `{item['version']}`",
            f"- **ZIP:** [{asset}]({zip_url})",
            f"- **Release:** [{release_tag}]({release_url})",
            f"- **Install:** `npx skills add {repository} --skill {item['name']}`",
        ]
    )


def update_main_readme(items: list[dict[str, str]], repository: str, release_tag: str, root: Path = ROOT) -> Path:
    readme_path = root / "README.md"
    rows = []
    for item in items:
        title = title_case(item["name"])
        url = skill_url(repository, item["path"])
        zip_link = download_url(repository, release_tag, item["name"], item["version"])
        rows.append(
            f"| [{title}]({url}) "
            f"| {item['description']} "
            f"| `{item['version']}` "
            f"| [View]({url}) "
            f"| [ZIP]({zip_link}) |"
        )
    body = "\n".join(
        [
            "| Skill | Purpose | Version | Files | Download |",
            "|---|---|---:|---|---|",
            *rows,
        ]
    )
    updated = replace_markers(readme_path.read_text(encoding="utf-8"), SKILLS_TABLE_START, SKILLS_TABLE_END, body)
    readme_path.write_text(updated, encoding="utf-8")
    return readme_path


def update_skill_readme(item: dict[str, str], repository: str, release_tag: str, root: Path = ROOT) -> Path:
    readme_path = root / item["path"] / "README.md"
    if readme_path.is_file():
        text = ensure_download_markers(readme_path.read_text(encoding="utf-8"))
    else:
        text = f"# {title_case(item['name'])}\n\n{DOWNLOAD_START}\n{DOWNLOAD_END}\n"
    section = download_section(item, repository, release_tag)
    updated = replace_markers(text, DOWNLOAD_START, DOWNLOAD_END, section)
    readme_path.parent.mkdir(parents=True, exist_ok=True)
    readme_path.write_text(updated, encoding="utf-8")
    return readme_path


def update_docs(items: list[dict[str, str]], repository: str, release_tag: str, root: Path = ROOT) -> list[Path]:
    changed = [update_main_readme(items, repository, release_tag, root)]
    for item in items:
        changed.append(update_skill_readme(item, repository, release_tag, root))
    return changed


def catalogue_payload(items: list[dict[str, str]], repository: str, release_tag: str, release_date: str) -> dict:
    skills = []
    for item in items:
        skills.append(
            {
                "name": item["name"],
                "title": title_case(item["name"]),
                "description": item["description"],
                "version": item["version"],
                "category": item["category"],
                "path": item["path"],
                "author": item.get("author", ""),
                "license": item.get("license", ""),
                "skillUrl": skill_url(repository, item["path"]),
                "downloadUrl": download_url(repository, release_tag, item["name"], item["version"]),
                "releaseUrl": f"https://github.com/{repository}/releases/tag/{release_tag}",
                "install": f"npx skills add {repository} --skill {item['name']}",
            }
        )
    categories = sorted({skill["category"] for skill in skills})
    return {
        "generated": release_date,
        "releaseTag": release_tag,
        "repository": repository,
        "categories": categories,
        "skills": skills,
    }


def build_pages(
    items: list[dict[str, str]],
    repository: str,
    release_tag: str,
    release_date: str,
    output: Path,
) -> Path:
    output.mkdir(parents=True, exist_ok=True)
    for name in ("index.html", "styles.css", "app.js"):
        shutil.copyfile(PAGES_SRC / name, output / name)
    catalogue = catalogue_payload(items, repository, release_tag, release_date)
    (output / "skills.json").write_text(json.dumps(catalogue, indent=2) + "\n", encoding="utf-8")
    manifest(items, release_date, repository, release_tag, output)
    return output


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=["validate", "package", "manifest", "update-docs", "pages"])
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
    elif args.command == "update-docs":
        for path in update_docs(items, args.repository, args.release_tag):
            print(path)
    elif args.command == "pages":
        print(build_pages(items, args.repository, args.release_tag, args.release_date, args.output))
    else:
        args.output.mkdir(parents=True, exist_ok=True)
        for item in items:
            print(package(item, args.output, args.release_date, args.manifest_url))


if __name__ == "__main__":
    main()
