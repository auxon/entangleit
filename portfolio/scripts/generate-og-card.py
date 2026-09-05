#!/usr/bin/env python3
"""1200×630 EntangleIT wordmark for LinkedIn/Twitter. No face, no personal name."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

WIDTH, HEIGHT = 1200, 630
OUT = Path(__file__).resolve().parents[1] / "static" / "og-card.png"

BG = (10, 10, 11, 255)
AMBER = (245, 158, 11, 255)
TEXT = (244, 244, 245, 255)
BORDER = (255, 255, 255, 28)

MONO = "/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-SemiBold.ttf"
MONO_BOLD = "/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-ExtraBold.ttf"
INTER_BOLD = "/usr/share/fonts/truetype/macos/Inter-Bold.ttf"


def font(path, size):
    return ImageFont.truetype(path, size)


def centered(draw, text, face, y, fill):
    left, top, right, bottom = draw.textbbox((0, 0), text, font=face)
    x = (WIDTH - (right - left)) / 2
    draw.text((x, y), text, font=face, fill=fill)
    return bottom - top


def main():
    img = Image.new("RGBA", (WIDTH, HEIGHT), BG)
    glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse((300, 80, 900, 520), fill=(245, 158, 11, 40))
    img = Image.alpha_composite(img, glow.filter(ImageFilter.GaussianBlur(90)))

    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle((36, 36, WIDTH - 36, HEIGHT - 36), radius=28, outline=BORDER, width=2)

    mark = font(MONO_BOLD, 42)
    word = font(INTER_BOLD, 92)
    centered(draw, "EI", mark, 200, AMBER)
    centered(draw, "EntangleIT", word, 270, TEXT)

    bar_w = 160
    bar_y = 400
    draw.rounded_rectangle(
        ((WIDTH - bar_w) / 2, bar_y, (WIDTH + bar_w) / 2, bar_y + 4),
        radius=2,
        fill=AMBER,
    )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.convert("RGB").save(OUT, "PNG", optimize=True)
    print(f"wrote {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
