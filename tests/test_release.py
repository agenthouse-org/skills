import json
import tempfile
import unittest
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parents[1]))
from build import release


class ReleaseTests(unittest.TestCase):
    def test_discovers_current_skills(self):
        items = release.discover()
        self.assertEqual({x["name"] for x in items}, {"ai-content-disclosure", "adaptive-sales-qualification", "build-innovation-capacity", "create-role-profile", "frontend-acceptance", "motion-ad", "positioning-brief", "skill-antivirus", "visual-plan", "web-usability-conformity"})
        self.assertEqual({x["category"] for x in items}, {"engineering", "governance", "innovation", "marketing", "organization-design", "sales", "security", "usability"})

    def test_fixture_skills_are_not_published(self):
        names = {x["name"] for x in release.discover()}
        self.assertNotIn("eicar-test-skill", names)
        fixture = release.ROOT / "security/skill-antivirus/fixtures/eicar-test-skill/MARKER.md"
        self.assertTrue(fixture.is_file())
        self.assertFalse(
            (release.ROOT / "security/skill-antivirus/fixtures/eicar-test-skill/SKILL.md").exists(),
            "fixture must not ship a second SKILL.md (Claude/ZIP loaders require exactly one)",
        )

    def test_enrichment_preserves_source_and_injects_once(self):
        source = release.ROOT / "governance/ai-content-disclosure/SKILL.md"
        original = source.read_text(encoding="utf-8")
        item = next(x for x in release.discover() if x["name"] == "ai-content-disclosure")
        enriched = release.enriched_skill(source, item, "2026-08-07", "https://example.test/manifest.json")
        self.assertEqual(source.read_text(encoding="utf-8"), original)
        self.assertTrue(enriched.startswith("---\nname:"))
        self.assertEqual(enriched.count("## agenthouse update awareness"), 1)
        self.assertIn('update-manifest: "https://example.test/manifest.json"', enriched)

    def test_manifest_is_deterministic_and_safe(self):
        with tempfile.TemporaryDirectory() as directory:
            path = release.manifest(release.discover(), "2026-08-07", "agenthouse-org/skills", "release-2026-08-07", Path(directory))
            data = json.loads(path.read_text())
            self.assertEqual(sorted(data), sorted(x["name"] for x in release.discover()))
            self.assertEqual(set(data["ai-content-disclosure"]), {"latest", "released", "releaseUrl"})
            self.assertNotIn("instructions", path.read_text())

    def test_update_docs_rewrites_main_and_skill_download_sections(self):
        items = release.discover()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "README.md").write_text(
                "intro\n<!-- SKILLS_TABLE_START -->\nold\n<!-- SKILLS_TABLE_END -->\n",
                encoding="utf-8",
            )
            for item in items:
                skill_dir = root / item["path"]
                skill_dir.mkdir(parents=True)
                (skill_dir / "README.md").write_text(
                    f"# {item['name']}\n\n<!-- DOWNLOAD_START -->\nold\n<!-- DOWNLOAD_END -->\n",
                    encoding="utf-8",
                )

            release.update_docs(items, "agenthouse-org/skills", "release-2026-08-08", root)

            main = (root / "README.md").read_text(encoding="utf-8")
            self.assertIn("| Skill | Purpose | Version | Files | Download | Agent install |", main)
            self.assertIn("adaptive-sales-qualification-v0.1.3.zip", main)
            self.assertIn("skill-antivirus", main)
            self.assertIn("/sales/adaptive-sales-qualification#install-with-your-agent", main)

            sales = (root / "sales/adaptive-sales-qualification/README.md").read_text(encoding="utf-8")
            self.assertIn("## Download", sales)
            self.assertIn("releases/download/release-2026-08-08/adaptive-sales-qualification-v0.1.3.zip", sales)
            self.assertIn("npx skills add agenthouse-org/skills --skill adaptive-sales-qualification", sales)
            self.assertNotIn("\nold\n", sales)

            for item in items:
                readme = (root / item["path"] / "README.md").read_text(encoding="utf-8")
                self.assertEqual(readme.count("### Install with your agent"), 1, item["name"])
                prompt = release.agent_install_prompt(item, "agenthouse-org/skills", "release-2026-08-08")
                self.assertIn("```text\n" + prompt + "\n```", readme)

    def test_agent_install_prompt_is_complete_and_safe(self):
        item = next(x for x in release.discover() if x["name"] == "motion-ad")
        prompt = release.agent_install_prompt(item, "agenthouse-org/skills", "release-2026-08-08")
        zip_url = "https://github.com/agenthouse-org/skills/releases/download/release-2026-08-08/motion-ad-v" + item["version"] + ".zip"
        self.assertTrue(prompt.startswith('Please install the agent skill "motion-ad"'))
        self.assertIn(f"v{item['version']}", prompt)
        self.assertIn(release.summary_of(item["description"]), prompt)
        self.assertIn(f"ZIP: {zip_url}", prompt)
        self.assertIn(f"SHA-256: {zip_url}.sha256", prompt)
        self.assertIn("npx skills add agenthouse-org/skills --skill motion-ad", prompt)
        self.assertIn("Do not run any script from the skill during installation", prompt)
        self.assertNotIn("```", prompt)
        self.assertEqual(release.summary_of("One sentence. Another."), "One sentence.")

        text = "# Motion Ad\n\n<!-- DOWNLOAD_START -->\nold\n<!-- DOWNLOAD_END -->\n"
        with tempfile.TemporaryDirectory() as directory:
            skill_dir = Path(directory) / item["path"]
            skill_dir.mkdir(parents=True)
            (skill_dir / "README.md").write_text(text, encoding="utf-8")
            release.update_skill_readme(item, "agenthouse-org/skills", "release-2026-08-08", Path(directory))
            release.update_skill_readme(item, "agenthouse-org/skills", "release-2026-08-09", Path(directory))
            again = (skill_dir / "README.md").read_text(encoding="utf-8")
            self.assertEqual(again.count("### Install with your agent"), 1)
            self.assertIn("release-2026-08-09", again)
            self.assertNotIn("release-2026-08-08", again)

    def test_build_pages_writes_directory_and_manifest(self):
        items = release.discover()
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "pages"
            release.build_pages(items, "agenthouse-org/skills", "release-2026-08-08", "2026-08-08", output)
            catalogue = json.loads((output / "skills.json").read_text(encoding="utf-8"))
            self.assertEqual(catalogue["releaseTag"], "release-2026-08-08")
            self.assertEqual(sorted(catalogue["categories"]), sorted({x["category"] for x in items}))
            self.assertEqual(len(catalogue["skills"]), len(items))
            sample = next(x for x in catalogue["skills"] if x["name"] == "adaptive-sales-qualification")
            self.assertEqual(sample["category"], "sales")
            self.assertTrue(sample["downloadUrl"].endswith("adaptive-sales-qualification-v0.1.3.zip"))
            self.assertEqual(sample["checksumUrl"], sample["downloadUrl"] + ".sha256")
            self.assertIn(sample["downloadUrl"], sample["agentPrompt"])
            self.assertIn("data-copy", (output / "app.js").read_text(encoding="utf-8"))
            self.assertTrue((output / "index.html").is_file())
            self.assertTrue((output / "styles.css").is_file())
            self.assertTrue((output / "app.js").is_file())
            self.assertTrue((output / "manifest.json").is_file())

    def test_build_pages_publishes_packed_examples_as_demos(self):
        items = release.discover()
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "pages"
            release.build_pages(items, "agenthouse-org/skills", "release-2026-08-08", "2026-08-08", output)
            catalogue = json.loads((output / "skills.json").read_text(encoding="utf-8"))
            motion = next(x for x in catalogue["skills"] if x["name"] == "motion-ad")
            self.assertEqual([d["lang"] for d in motion["demos"]], ["en", "de", "en", "de"])
            self.assertEqual(motion["demos"][0]["url"], "demos/motion-ad/dealdesk/index.en.html")
            self.assertEqual(motion["demos"][2]["url"], "demos/motion-ad/dealdesk-loud/index.en.html")
            self.assertIn("DealDesk", motion["demos"][0]["title"])
            for demo in motion["demos"]:
                self.assertTrue((output / demo["url"]).is_file(), demo["url"])
            self.assertFalse((output / "demos/motion-ad/dealdesk/scene.html").exists())
            sales = next(x for x in catalogue["skills"] if x["name"] == "adaptive-sales-qualification")
            self.assertEqual(sales["demos"], [])


if __name__ == "__main__":
    unittest.main()
