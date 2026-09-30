import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "marketing" / "positioning-brief"


class PositioningBriefSkillTests(unittest.TestCase):
    def test_skill_reads_first_and_consults_briefly(self):
        skill = (SKILL / "SKILL.md").read_text(encoding="utf-8")
        self.assertIn('name: "positioning-brief"', skill)
        self.assertIn("Read before asking", skill)
        self.assertIn("one at a time", skill)
        self.assertIn("assumption", skill.lower())
        self.assertIn("do-not-claim", skill)
        for resource in ("references/frameworks.md", "references/questions.md", "templates/brief.md"):
            self.assertIn(resource, skill)
            self.assertTrue((SKILL / resource).is_file(), resource)
        self.assertTrue((SKILL / "README.md").is_file())
        self.assertTrue((SKILL / "examples" / "smoke-test.md").is_file())

    def test_frameworks_cover_positioning_and_narrative(self):
        frameworks = (SKILL / "references" / "frameworks.md").read_text(encoding="utf-8")
        for lens in ("Value proposition canvas", "Jobs to be done", "Alternatives and difference", "Positioning statement", "Proof"):
            self.assertIn(lens, frameworks)
        for narrative in ("Strategic narrative", "PAS", "BAB", "ABT", "AIDA"):
            self.assertIn(narrative, frameworks)

    def test_template_keeps_headings_other_skills_read(self):
        template = (SKILL / "templates" / "brief.md").read_text(encoding="utf-8")
        for heading in ("## Audience", "## Promise", "## Proof", "## Do not claim", "## Narrative", "## Call to action", "## Tone and channel", "## Open assumptions"):
            self.assertIn(heading, template)


if __name__ == "__main__":
    unittest.main()
