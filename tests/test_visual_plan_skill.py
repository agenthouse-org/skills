import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "engineering" / "visual-plan"


class VisualPlanSkillTests(unittest.TestCase):
    def test_skill_stays_decision_first_and_offline(self):
        skill = (SKILL / "SKILL.md").read_text(encoding="utf-8")
        smoke = (SKILL / "examples" / "smoke-test.md").read_text(encoding="utf-8")

        self.assertIn('name: "visual-plan"', skill)
        self.assertTrue((SKILL / "README.md").is_file())
        self.assertTrue((SKILL / "templates" / "visual-plan.md").is_file())
        self.assertIn("wireframe", skill.lower())
        self.assertIn("mermaid", skill.lower())
        self.assertIn("erDiagram", skill)
        self.assertIn("Decide", skill)
        self.assertNotIn("plan.agent-native.com", skill.lower())
        self.assertNotIn("http://", skill.lower())
        self.assertIn("Do not implement", smoke)
        self.assertIn("short", smoke.lower())


if __name__ == "__main__":
    unittest.main()
