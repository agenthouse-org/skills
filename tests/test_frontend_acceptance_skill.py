import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "engineering" / "frontend-acceptance"


class FrontendAcceptanceSkillTests(unittest.TestCase):
    def test_skill_has_a_portable_package_and_smoke_test(self):
        skill = (SKILL / "SKILL.md").read_text(encoding="utf-8")
        smoke_test = (SKILL / "examples" / "smoke-test.md").read_text(encoding="utf-8")

        self.assertIn('name: "frontend-acceptance"', skill)
        self.assertTrue((SKILL / "README.md").is_file())
        self.assertTrue((SKILL / "templates" / "evidence-record.md").is_file())
        self.assertIn("design contract", skill.lower())
        self.assertIn("real browser", skill.lower())
        self.assertIn("screenshot", skill.lower())
        self.assertIn("accessibility", skill.lower())
        self.assertNotIn("showboat", skill.lower())
        self.assertNotIn("playwright", skill.lower())
        self.assertIn("The run passes when", smoke_test)


if __name__ == "__main__":
    unittest.main()
