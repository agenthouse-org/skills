#!/usr/bin/env python3
"""Deterministically place an official EU AI disclosure icon on a raster image."""

from __future__ import annotations

import argparse
from pathlib import Path
from typing import Literal

from PIL import Image, ImageOps

Corner = Literal["top-left", "top-right", "bottom-left", "bottom-right"]


def load_icon(path: Path, target_width: int) -> Image.Image:
    if path.suffix.lower() == ".svg":
        try:
            import cairosvg
        except ImportError as exc:
            raise SystemExit("SVG input requires cairosvg: pip install cairosvg") from exc
        png = cairosvg.svg2png(url=str(path), output_width=target_width)
        import io
        icon = Image.open(io.BytesIO(png)).convert("RGBA")
    else:
        icon = Image.open(path).convert("RGBA")
        ratio = target_width / icon.width
        icon = icon.resize((target_width, max(1, round(icon.height * ratio))), Image.Resampling.LANCZOS)
    return icon


def position(canvas: tuple[int, int], overlay: tuple[int, int], corner: Corner, margin: int) -> tuple[int, int]:
    width, height = canvas
    ow, oh = overlay
    positions = {
        "top-left": (margin, margin),
        "top-right": (width - ow - margin, margin),
        "bottom-left": (margin, height - oh - margin),
        "bottom-right": (width - ow - margin, height - oh - margin),
    }
    x, y = positions[corner]
    if x < 0 or y < 0:
        raise ValueError("Icon and margin do not fit within the image")
    return x, y


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--icon", type=Path, required=True)
    parser.add_argument("--corner", choices=["top-left", "top-right", "bottom-left", "bottom-right"], default="bottom-right")
    parser.add_argument("--relative-width", type=float, default=0.15, help="Icon width as fraction of image width")
    parser.add_argument("--margin", type=float, default=0.02, help="Margin as fraction of image width")
    parser.add_argument("--overwrite", action="store_true")
    args = parser.parse_args()

    if args.output.exists() and not args.overwrite:
        raise SystemExit(f"Output exists: {args.output}. Use --overwrite to replace it.")
    if not 0.03 <= args.relative_width <= 0.5:
        raise SystemExit("--relative-width must be between 0.03 and 0.5")
    if not 0 <= args.margin <= 0.2:
        raise SystemExit("--margin must be between 0 and 0.2")

    base = ImageOps.exif_transpose(Image.open(args.input)).convert("RGBA")
    icon_width = max(1, round(base.width * args.relative_width))
    margin = round(base.width * args.margin)
    icon = load_icon(args.icon, icon_width)
    xy = position(base.size, icon.size, args.corner, margin)
    base.alpha_composite(icon, xy)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    if args.output.suffix.lower() in {".jpg", ".jpeg"}:
        base.convert("RGB").save(args.output, quality=95, optimize=True)
    else:
        base.save(args.output)


if __name__ == "__main__":
    main()
