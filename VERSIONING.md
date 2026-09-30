# Skill versioning and update awareness

Each source `SKILL.md` keeps its own semantic version in frontmatter. That version is authoritative for the ZIP filename and the packaged version. Existing date-based `release-*` tags remain the repository-wide release convention.

During GitHub Actions packaging, a temporary copy of each skill receives AgentHouse metadata and the shared update-awareness instructions from `build/update-management.md`. Source skills are not modified.

The generated `manifest.json` contains only supported metadata: `latest`, `released`, and `releaseUrl`. It is published as a GitHub Release asset and to GitHub Pages. Set the repository variable `SKILL_MANIFEST_URL` when the public endpoint changes.

On each `release-*` tag, the workflow also rewrites:

- the root README catalogue between `<!-- SKILLS_TABLE_START -->` / `<!-- SKILLS_TABLE_END -->`
- each skill `README.md` download block between `<!-- DOWNLOAD_START -->` / `<!-- DOWNLOAD_END -->`, including the copy-paste agent install prompt
- the GitHub Pages Skills Directory at `https://agenthouse-org.github.io/skills/` (`index.html` + `skills.json` + `manifest.json`)

Update awareness only notifies users. It never installs or downloads a replacement, runtime instructions, code, references, prompts, or dependencies. A missing or invalid network response must not prevent the skill from operating.

To release, update the relevant source version, push a date-based `release-YYYY-MM-DD` tag, and let the release workflow validate, package, publish the ZIPs/checksums, generate the manifest, update README download links, and deploy the directory.
