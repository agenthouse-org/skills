import json
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "marketing" / "motion-ad"
DEALDESK = SKILL / "examples" / "dealdesk"


def node(*args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["node", *args],
        cwd=SKILL,
        capture_output=True,
        text=True,
        encoding="utf-8",
        check=False,
    )


class MotionAdSkillTests(unittest.TestCase):
    def test_skill_is_html_first_with_optional_webm(self):
        skill = (SKILL / "SKILL.md").read_text(encoding="utf-8")
        craft = (SKILL / "references" / "craft.md").read_text(encoding="utf-8")
        self.assertIn('name: "motion-ad"', skill)
        self.assertIn("no video inside", skill.lower())
        for script in ("check-ad.mjs", "new-ad.mjs", "pack.mjs", "render.mjs"):
            self.assertIn(script, skill)
        self.assertIn("--webm", skill)
        self.assertIn("--fit", skill)
        self.assertIn("data-fit", skill)
        self.assertNotIn(".mp4", skill.lower())
        for banned in ("danny.md", "opus", "showreel", "himanshu"):
            self.assertNotIn(banned, skill.lower())
            self.assertNotIn(banned, craft.lower())

    def test_scaffold_passes_loose_and_fails_strict(self):
        with tempfile.TemporaryDirectory() as directory:
            out = Path(directory) / "index.html"
            created = node("scripts/new-ad.mjs", "--out", str(out), "--title", "Sample")
            self.assertEqual(created.returncode, 0, created.stderr)
            loose = node("scripts/check-ad.mjs", str(out))
            self.assertEqual(loose.returncode, 0, loose.stderr)
            self.assertIn("scaffold", loose.stdout.lower())
            strict = node("scripts/check-ad.mjs", str(out), "--strict")
            self.assertNotEqual(strict.returncode, 0)

    def test_scaffold_folder_packs_from_copy(self):
        with tempfile.TemporaryDirectory() as directory:
            scene = Path(directory) / "ad"
            created = node("scripts/new-ad.mjs", "--dir", str(scene))
            self.assertEqual(created.returncode, 0, created.stderr)
            for name in ("scene.html", "scene.css", "copy.en.json", "index.en.html"):
                self.assertTrue((scene / name).exists(), name)
            self.assertIn("{{hook.l1}}", (scene / "scene.html").read_text(encoding="utf-8"))
            packed = (scene / "index.en.html").read_text(encoding="utf-8")
            self.assertNotIn("{{", packed)
            self.assertIn("Say the shift.", packed)
            again = node("scripts/new-ad.mjs", "--dir", str(scene))
            self.assertNotEqual(again.returncode, 0)

    def test_pack_fails_on_missing_copy_key(self):
        with tempfile.TemporaryDirectory() as directory:
            scene = Path(directory) / "scene"
            shutil.copytree(DEALDESK, scene, ignore=shutil.ignore_patterns("index.*.html", "renders"))
            copy = json.loads((scene / "copy.de.json").read_text(encoding="utf-8"))
            del copy["hook.l1"]
            (scene / "copy.de.json").write_text(json.dumps(copy, ensure_ascii=False), encoding="utf-8")
            single = node("scripts/pack.mjs", "--scene", str(scene), "--lang", "de", "--out", str(scene / "de.html"))
            self.assertNotEqual(single.returncode, 0)
            self.assertIn("hook.l1", single.stderr)
            every = node("scripts/pack.mjs", "--scene", str(scene), "--all")
            self.assertNotEqual(every.returncode, 0)

    def test_dealdesk_ships_english_and_german(self):
        english = json.loads((DEALDESK / "copy.en.json").read_text(encoding="utf-8"))
        german = json.loads((DEALDESK / "copy.de.json").read_text(encoding="utf-8"))
        self.assertEqual(sorted(english), sorted(german))
        self.assertIn("/de/dealdesk/", german["end.href"])

        packed = node("scripts/pack.mjs", "--scene", "examples/dealdesk", "--all")
        self.assertEqual(packed.returncode, 0, packed.stderr)
        self.assertNotIn("warning", packed.stderr)
        for lang, phrase in (("en", "From enquiry to order."), ("de", "Von der Anfrage zum Auftrag.")):
            page = DEALDESK / f"index.{lang}.html"
            checked = node("scripts/check-ad.mjs", str(page), "--strict")
            self.assertEqual(checked.returncode, 0, checked.stderr + checked.stdout)
            html = page.read_text(encoding="utf-8")
            self.assertIn(f'<html lang="{lang}"', html)
            self.assertIn(phrase, html)

    @unittest.skipUnless((SKILL / "node_modules" / "playwright-core").exists(), "run npm install in the skill for browser checks")
    def test_dealdesk_fits_in_every_language(self):
        node("scripts/pack.mjs", "--scene", "examples/dealdesk", "--all")
        result = node(
            "scripts/render.mjs",
            str(DEALDESK / "index.en.html"),
            str(DEALDESK / "index.de.html"),
            "--fit",
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_checker_rejects_video(self):
        with tempfile.TemporaryDirectory() as directory:
            page = Path(directory) / "bad.html"
            page.write_text("<video src='ad.mp4'></video>", encoding="utf-8")
            result = node("scripts/check-ad.mjs", str(page), "--strict")
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("video", result.stderr.lower())


if __name__ == "__main__":
    unittest.main()
