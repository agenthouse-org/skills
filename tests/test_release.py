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
        self.assertEqual({x["name"] for x in items}, {"ai-content-disclosure", "adaptive-sales-qualification", "build-innovation-capacity", "create-role-profile"})

    def test_enrichment_preserves_source_and_injects_once(self):
        source = release.ROOT / "governance/ai-content-disclosure/SKILL.md"
        original = source.read_text(encoding="utf-8")
        item = next(x for x in release.discover() if x["name"] == "ai-content-disclosure")
        enriched = release.enriched_skill(source, item, "2026-08-07", "https://example.test/manifest.json")
        self.assertEqual(source.read_text(encoding="utf-8"), original)
        self.assertEqual(enriched.count("## AgentHouse update awareness"), 1)
        self.assertIn('update-manifest: "https://example.test/manifest.json"', enriched)

    def test_manifest_is_deterministic_and_safe(self):
        with tempfile.TemporaryDirectory() as directory:
            path = release.manifest(release.discover(), "2026-08-07", "AgentHouse-org/skills", "release-2026-08-07", Path(directory))
            data = json.loads(path.read_text())
            self.assertEqual(sorted(data), sorted(x["name"] for x in release.discover()))
            self.assertEqual(set(data["ai-content-disclosure"]), {"latest", "released", "releaseUrl"})
            self.assertNotIn("instructions", path.read_text())


if __name__ == "__main__":
    unittest.main()
