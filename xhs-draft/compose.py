#!/usr/bin/env python3
"""learn4money 小红书 3:4 四图组合成：封面 + 看板 + 主题 + 用法卡。"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = Path(__file__).parent
RAW = HERE / "raw"
OUT = HERE / "final"
OUT.mkdir(exist_ok=True)

W, H = 1242, 1656
NAVY_TOP, NAVY_BOT = (9, 22, 44), (18, 52, 96)
ACCENT = (86, 156, 255)  # app 蓝
GOLD = (255, 200, 84)  # 金色强调
WHITE = (255, 255, 255)
MUTED = (158, 180, 208)

FONT_DIR = Path("/usr/share/fonts/opentype/noto")


def cjk_font(size, weight="Black"):
    """从 Noto CJK ttc 里挑 SC 字面。"""
    path = FONT_DIR / f"NotoSansCJK-{weight}.ttc"
    for i in range(6):
        try:
            f = ImageFont.truetype(str(path), size, index=i)
            if "SC" in f.getname()[0]:
                return f
        except Exception:
            break
    return ImageFont.truetype(str(path), size)


F_BLACK = {}
F_REG = {}


def font(size, weight="Black"):
    cache = F_BLACK if weight == "Black" else F_REG
    if size not in cache:
        cache[size] = cjk_font(size, weight)
    return cache[size]


def gradient_bg(top, bottom):
    img = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(img)
    for y in range(H):
        t = y / (H - 1)
        d.line([(0, y), (W, y)], fill=tuple(int(a + (b - a) * t) for a, b in zip(top, bottom)))
    return img


def glow(img, center, radius, color, alpha):
    """模糊光斑装饰。"""
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.ellipse([center[0] - radius, center[1] - radius, center[0] + radius, center[1] + radius],
              fill=color + (alpha,))
    img.alpha_composite(layer.filter(ImageFilter.GaussianBlur(80)))
    return img


def shot_card(img, shot_path, top, width, radius=26, border=(255, 255, 255, 36)):
    """截图 → 圆角 + 描边 + 投影，居中贴到 top 位置。"""
    shot = Image.open(shot_path).convert("RGB")
    scale = width / shot.width
    shot = shot.resize((width, int(shot.height * scale)), Image.LANCZOS)
    sh = shot.height
    card = Image.new("RGBA", (width, sh), (0, 0, 0, 0))
    mask = Image.new("L", (width, sh), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, width, sh], radius, fill=255)
    card.paste(shot, (0, 0), mask)

    x = (W - width) // 2
    # 投影
    shadow = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle(
        [x - 6, top + 14, x + width + 6, top + sh + 26], radius + 6, fill=(0, 0, 0, 120))
    img.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(18)))
    img.alpha_composite(card, (x, top))
    # 细描边
    ImageDraw.Draw(img).rounded_rectangle([x, top, x + width, top + sh], radius,
                                          outline=border, width=2)
    return top + sh


def text_c(d, xy, s, f, fill, anchor="mm"):
    d.text(xy, s, font=f, fill=fill, anchor=anchor)


def pill(d, cx, cy, label, pad=26, fsize=34, bg=(86, 156, 255, 60), fg=ACCENT):
    f = font(fsize)
    tw = d.textlength(label, font=f)
    d.rounded_rectangle([cx - tw / 2 - pad, cy - fsize, cx + tw / 2 + pad, cy + fsize + 8],
                        radius=fsize + 4, fill=bg)
    text_c(d, (cx, cy + 4), label, f, fg)


def footer(d, note):
    text_c(d, (W // 2, H - 64), note, font(30, "Regular"), MUTED)


def page_bg():
    img = gradient_bg(NAVY_TOP, NAVY_BOT).convert("RGBA")
    glow(img, (W - 120, 180), 260, ACCENT, 40)
    glow(img, (80, H - 220), 300, (40, 90, 170), 50)
    return img


# ---------- 1. 封面：大屏巨字 hero ----------
img = page_bg()
d = ImageDraw.Draw(img)
pill(d, W // 2, 96, "自制开源 · 学习挣钱看板")
text_c(d, (W // 2, 250), "学一分钟", font(128), WHITE)
text_c(d, (W // 2, 396), "挣一分钟的钱", font(128), GOLD)
end_y = shot_card(img, RAW / "bigscreen-running.png", 520, 1064)
text_c(d, (W // 2, end_y + 64), "金额随时间实时上涨", font(52), WHITE)
text_c(d, (W // 2, end_y + 130), "暂停会冻结 · 结束自动入账", font(38, "Regular"), MUTED)
footer(d, "开源免费 · 数据只存在本机浏览器")
img.convert("RGB").save(OUT / "01-cover.png", quality=95)

# ---------- 2. 看板页：经典暗色 ----------
img = page_bg()
d = ImageDraw.Draw(img)
pill(d, W // 2, 96, "01 · 界面")
text_c(d, (W // 2, 208), "今日学 4h45m = ¥545.98", font(76), WHITE)
text_c(d, (W // 2, 300), "月薪一填，时薪自动折算到每秒", font(40, "Regular"), MUTED)
shot_card(img, RAW / "regular-classic-dark.png", 390, 1064)
footer(d, "统计 / 记录 / 清空，一个页面全齐")
img.convert("RGB").save(OUT / "02-dashboard.png", quality=95)

# ---------- 3. 主题页：双图叠 ----------
img = page_bg()
d = ImageDraw.Draw(img)
pill(d, W // 2, 96, "02 · 主题")
text_c(d, (W // 2, 208), "8 套主题随便换", font(88), WHITE)
text_c(d, (W // 2, 296), "4 种设计语言 × 深 / 浅色", font(40, "Regular"), MUTED)
y = shot_card(img, RAW / "regular-material-light.png", 386, 1064)
# 小标签
label_bg = ImageDraw.Draw(img)
label_bg.rounded_rectangle([(W - 1064) // 2, y + 16, (W + 1064) // 2, y + 76], radius=20,
                           fill=(255, 255, 255, 28))
text_c(d, (W // 2, y + 46), "Material 浅色（M3 胶囊）", font(34), WHITE)
shot_card(img, RAW / "regular-apple-dark.png", y + 116, 1064)
footer(d, "经典 / Material / Apple / Fluent")
img.convert("RGB").save(OUT / "03-themes.png", quality=95)

# ---------- 4. 用法卡：纯排版 ----------
img = page_bg()
d = ImageDraw.Draw(img)
pill(d, W // 2, 110, "03 · 怎么用")
steps = [
    ("1", "填工资", "月薪 / 时薪都行，自动折算"),
    ("2", "点「开始学习」", "金额一秒一跳，越学越上头"),
    ("3", "点「结束」", "自动记账，今日 / 累计收入汇总"),
]
y = 260
for num, title, desc in steps:
    d.rounded_rectangle([120, y, 240, y + 120], radius=30, fill=(86, 156, 255, 70))
    text_c(d, (180, y + 62), num, font(64), WHITE)
    text_c(d, (300, y + 38), title, font(58), WHITE, anchor="lm")
    text_c(d, (300, y + 96), desc, font(38, "Regular"), MUTED, anchor="lm")
    y += 168

d.rounded_rectangle([120, y + 40, W - 120, y + 250], radius=36, fill=(255, 255, 255, 22))
text_c(d, (W // 2, y + 96), "<5 秒的误触不会记账", font(44), GOLD)
text_c(d, (W // 2, y + 160), "刷新 / 关掉浏览器，时长和金额都不丢", font(40, "Regular"), MUTED)
text_c(d, (W // 2, y + 216), "外接显示器打开还有巨字大屏模式", font(40, "Regular"), MUTED)

text_c(d, (W // 2, y + 340), "开源 · 免费 · 无后端", font(52), WHITE)
text_c(d, (W // 2, y + 410), "GitHub 搜 CodeFuckee/learn4money", font(38, "Regular"), ACCENT)
footer(d, "网页直接打开就能用，不用装 App")
img.convert("RGB").save(OUT / "04-howto.png", quality=95)

print("done ->", OUT)
