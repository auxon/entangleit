#!/usr/bin/env python3
"""Generate the LinkedIn/Twitter OG card. Product branding only — no personal name."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

WIDTH, HEIGHT = 1200, 630
OUT = Path(__file__).resolve().parents[1] / "static" / "og-card.png"

BG = (10, 10, 11, 255)
AMBER = (245, 158, 11, 255)
TEXT = (244, 244, 245, 255)
MUTED = (161, 161, 170, 255)
PILL_BG = (26, 26, 29, 255)
BORDER = (255, 255, 255, 28)

INTER_BOLD = "/usr/share/fonts/truetype/macos/Inter-Bold.ttf"
INTER_MED = "/usr/share/fonts/truetype/macos/Inter-Medium.ttf"
MONO = "/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-SemiBold.ttf"


def font(path, size):
    return ImageFont.truetype(path, size)


def main():
    img = Image.new("RGBA", (WIDTH, HEIGHT), BG)
    glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse((220, -220, 980, 360), fill=(245, 158, 11, 55))
    img = Image.alpha_composite(img, glow.filter(ImageFilter.GaussianBlur(80)))

    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle((36, 36, WIDTH - 36, HEIGHT - 36), radius=28, outline=BORDER, width=2)

    brand = font(MONO, 28)
    draw.text((80, 78), "EI", font=brand, fill=AMBER)
    draw.text((130, 80), "ENTANGLEIT", font=font(MONO, 22), fill=AMBER)

    headline = font(INTER_BOLD, 64)
    draw.text((80, 190), "Card payments live", font=headline, fill=TEXT)
    draw.text((80, 268), "on Cloudflare.", font=headline, fill=TEXT)

    sub = font(INTER_MED, 28)
    draw.text((80, 360), "Stripe Checkout, Workers, webhooks. This week.", font=sub, fill=MUTED)

    pills = [
        ("CARD", BG[:3] + (255,), AMBER, AMBER),
        ("$149 DIY", TEXT, PILL_BG, BORDER),
        ("Leak", TEXT, PILL_BG, BORDER),
    ]
    x, y = 80, 460
    pill_font = font(MONO, 22)
    for label, color, fill, outline in pills:
        tw = draw.textlength(label, font=pill_font)
        pad_x, pad_y = 22, 14
        w, h = tw + pad_x * 2, 22 + pad_y * 2
        draw.rounded_rectangle((x, y, x + w, y + h), radius=8, fill=fill, outline=outline, width=2)
        draw.text((x + pad_x, y + pad_y - 2), label, font=pill_font, fill=color)
        x += w + 16

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.convert("RGB").save(OUT, "PNG", optimize=True)
    print(f"wrote {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
