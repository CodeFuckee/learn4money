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
_cache = {}


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


def font(size, weight="Black"):
    key = (size, weight)
    if key not in _cache:
        _cache[key] = cjk_font(size, weight)
    return _cache[key]


def gradient_bg(top, bottom):
    img = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(img)
    for y in range(H):
        t = y / (H - 1)
        d.line([(0, y), (W, y)], fill=tuple(int(a + (b - a) * t) for a, b in zip(top, bottom)))
    return img


def glow(img, center, radius, color, alpha):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.ellipse([center[0] - radius, center[1] - radius, center[0] + radius, center[1] + radius],
              fill=color + (alpha,))
    img.alpha_composite(layer.filter(ImageFilter.GaussianBlur(80)))
    return img


def alpha_rect(img, box, radius, fill):
    """半透明矩形：画在临时图层再合成（ImageDraw 直写会丢 alpha）。"""
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(layer).rounded_rectangle(box, radius=radius, fill=fill)
    img.alpha_composite(layer)


def shot_card(img, shot_path, top, width, radius=26, crop_h=None, border=(255, 255, 255, 36)):
    """截图 → 圆角 + 描边 + 投影，居中贴到 top 位置。crop_h=只保留顶部 N 原始像素。"""
    shot = Image.open(shot_path).convert("RGB")
    if crop_h:
        shot = shot.crop((0, 0, shot.width, crop_h))
    scale = width / shot.width
    shot = shot.resize((width, int(shot.height * scale)), Image.LANCZOS)
    sh = shot.height
    card = Image.new("RGBA", (width, sh), (0, 0, 0, 0))
    mask = Image.new("L", (width, sh), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, width, sh], radius, fill=255)
    card.paste(shot, (0, 0), mask)

    x = (W - width) // 2
    shadow = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle(
        [x - 6, top + 14, x + width + 6, top + sh + 26], radius + 6, fill=(0, 0, 0, 120))
    img.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(18)))
    img.alpha_composite(card, (x, top))
    ImageDraw.Draw(img).rounded_rectangle([x, top, x + width, top + sh], radius,
                                          outline=border, width=2)
    return top + sh


def text_c(d, xy, s, f, fill, anchor="mm"):
    d.text(xy, s, font=f, fill=fill, anchor=anchor)


def pill(d, cx, cy, label, fsize=36):
    """实心蓝底白字标签。"""
    f = font(fsize)
    tw = d.textlength(label, font=f)
    pad = 30
    box = [cx - tw / 2 - pad, cy - fsize - 6, cx + tw / 2 + pad, cy + fsize + 12]
    d.rounded_rectangle(box, radius=(box[3] - box[1]) // 2, fill=ACCENT)
    text_c(d, (cx, cy + 3), label, f, WHITE)


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
pill(d, W // 2, 100, "自制开源 · 学习挣钱看板")
text_c(d, (W // 2, 258), "学一分钟", font(128), WHITE)
text_c(d, (W // 2, 404), "挣一分钟的钱", font(128), GOLD)
end_y = shot_card(img, RAW / "bigscreen-running.png", 528, 1064)
text_c(d, (W // 2, end_y + 66), "金额随时间实时上涨", font(52), WHITE)
text_c(d, (W // 2, end_y + 132), "暂停会冻结 · 结束自动入账", font(38, "Regular"), MUTED)
footer(d, "开源免费 · 数据只存在本机浏览器")
img.convert("RGB").save(OUT / "01-cover.png", quality=95)

# ---------- 2. 看板页：经典暗色 + 三枚卖点 ----------
img = page_bg()
d = ImageDraw.Draw(img)
pill(d, W // 2, 100, "01 · 界面")
text_c(d, (W // 2, 214), "今日学 4h45m = ¥545.98", font(76), WHITE)
text_c(d, (W // 2, 306), "月薪一填，时薪自动折算到每秒", font(40, "Regular"), MUTED)
end_y = shot_card(img, RAW / "regular-classic-dark.png", 396, 1064)
chips = [("自动记账", "结束即入账"), ("误触过滤", "<5 秒不记"), ("数据本地", "刷新不丢")]
cw, gap = 330, 22
x0 = (W - cw * 3 - gap * 2) // 2
cy = end_y + 96
for i, (t, s) in enumerate(chips):
    x = x0 + i * (cw + gap)
    alpha_rect(img, [x, cy, x + cw, cy + 150], 26, (255, 255, 255, 26))
    text_c(d, (x + cw / 2, cy + 52), t, font(44), WHITE)
    text_c(d, (x + cw / 2, cy + 110), s, font(32, "Regular"), MUTED)
footer(d, "统计 / 记录 / 清空，一个页面全齐")
img.convert("RGB").save(OUT / "02-dashboard.png", quality=95)

# ---------- 3. 主题页：两截上半屏 ----------
img = page_bg()
d = ImageDraw.Draw(img)
pill(d, W // 2, 100, "02 · 主题")
text_c(d, (W // 2, 214), "8 套主题随便换", font(88), WHITE)
text_c(d, (W // 2, 306), "4 种设计语言 × 深 / 浅色", font(40, "Regular"), MUTED)
crop_h = 1000  # 截上半（原始像素 2520×1520 的顶部 1000 ≈ 逻辑 500px）：标题 + 主题切换器 + 工资卡 + 统计
y = shot_card(img, RAW / "regular-material-light.png", 396, 1064, crop_h=crop_h)
alpha_rect(img, [(W - 520) // 2, y + 14, (W + 520) // 2, y + 70], 22, (8, 20, 40, 190))
text_c(d, (W // 2, y + 42), "Material 浅色 · M3 胶囊", font(32), WHITE)
y2 = shot_card(img, RAW / "regular-apple-dark.png", y + 116, 1064, crop_h=crop_h)
alpha_rect(img, [(W - 520) // 2, y2 + 14, (W + 520) // 2, y2 + 70], 22, (8, 20, 40, 190))
text_c(d, (W // 2, y2 + 42), "Apple 深色 · 胶囊按钮", font(32), WHITE)
footer(d, "经典 / Material / Apple / Fluent")
img.convert("RGB").save(OUT / "03-themes.png", quality=95)

# ---------- 4. 用法卡：纯排版 ----------
img = page_bg()
d = ImageDraw.Draw(img)
pill(d, W // 2, 116, "03 · 怎么用")
steps = [
    ("1", "填工资", "月薪 / 时薪都行，自动折算"),
    ("2", "点「开始学习」", "金额一秒一跳，越学越上头"),
    ("3", "点「结束」", "自动记账，今日 / 累计收入汇总"),
]
y = 296
for num, title, desc in steps:
    d.rounded_rectangle([120, y, 250, y + 130], radius=32, fill=ACCENT)
    text_c(d, (185, y + 67), num, font(68), WHITE)
    text_c(d, (310, y + 42), title, font(60), WHITE, anchor="lm")
    text_c(d, (310, y + 102), desc, font(40, "Regular"), MUTED, anchor="lm")
    y += 190

alpha_rect(img, [120, y + 30, W - 120, y + 290], 36, (255, 255, 255, 24))
text_c(d, (W // 2, y + 92), "<5 秒的误触不会记账", font(46), GOLD)
text_c(d, (W // 2, y + 162), "刷新 / 关掉浏览器，时长和金额都不丢", font(40, "Regular"), MUTED)
text_c(d, (W // 2, y + 226), "外接显示器打开，还有巨字大屏模式", font(40, "Regular"), MUTED)

text_c(d, (W // 2, y + 400), "开源 · 免费 · 无后端", font(56), WHITE)
text_c(d, (W // 2, y + 480), "GitHub 搜 CodeFuckee/learn4money", font(40, "Regular"), ACCENT)
footer(d, "网页直接打开就能用，不用装 App")
img.convert("RGB").save(OUT / "04-howto.png", quality=95)

print("done ->", OUT)
