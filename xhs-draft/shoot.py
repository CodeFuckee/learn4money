#!/usr/bin/env python3
"""learn4money 小红书配图截图脚本：4 个状态，deviceScaleFactor=2 保证清晰。"""
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = "http://10.0.0.205:8765/learn4money/"
OUT = Path(__file__).parent / "raw"
OUT.mkdir(exist_ok=True)


def set_wage_hourly(page):
    """打开设置对话框（大屏模式）→ 切时薪 → 填 3600（每秒挣 1 元）。"""
    page.click("#settingsBtn")
    page.wait_for_selector("#wageInput", state="visible")
    page.click("#modeHourly")
    page.fill("#wageInput", "3600")
    page.keyboard.press("Escape")
    page.wait_for_selector("#wageInput", state="hidden")


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()

        # A. 大屏模式运行态（经典 Carbon，金额巨字居中）
        ctx = browser.new_context(viewport={"width": 1720, "height": 1080}, device_scale_factor=2)
        page = ctx.new_page()
        page.goto(BASE)
        page.wait_for_selector("#startBtn")
        set_wage_hourly(page)
        page.click("#startBtn")
        page.wait_for_selector("#statusText:has-text('挣钱中')")
        time.sleep(7)  # 涨到 ¥7 左右，巨字好看
        amount = page.text_content("#earnedAmount").strip()
        print("bigscreen amount:", amount)
        page.screenshot(path=str(OUT / "bigscreen-running.png"))
        page.click("#stopBtn")  # 停止 → 产生一条记录
        time.sleep(1)
        ctx.close()

        # B/C/D. 常规看板（<1280 窄布局）：经典暗色 / Material 浅色 / Apple 暗色
        # 播种 4 条今日记录（月薪 2w → 时薪 114.94，时长×费率自洽），看板有历史数据更真实
        SEED = """() => {
          const D = (h, m) => new Date(2026, 10, 5, h, m, 0);
          const mk = (sh, sm, eh, em, secs, earned) => ({
            id: 'seed-' + sh + sm,
            date: '2026-11-05',
            startIso: D(sh, sm).toISOString(),
            endIso: D(eh, em).toISOString(),
            seconds: secs,
            earned,
          });
          const rs = [mk(9,2,9,47,2700,86.21), mk(10,30,11,50,4800,153.26),
                      mk(14,0,16,5,7500,239.46), mk(16,31,17,6,2100,67.05)];
          localStorage.setItem('l4m.records', JSON.stringify(rs));
        }"""
        for lang, mode, name in [
            ("classic", "dark", "regular-classic-dark"),
            ("material", "light", "regular-material-light"),
            ("apple", "dark", "regular-apple-dark"),
        ]:
            ctx = browser.new_context(viewport={"width": 1260, "height": 760}, device_scale_factor=2)
            page = ctx.new_page()
            page.goto(BASE)
            page.evaluate(
                "([l, m, seed]) => { localStorage.setItem('l4m.themeLang', JSON.stringify(l)); localStorage.setItem('l4m.themeMode', JSON.stringify(m)); (eval(seed))(); }",
                [lang, mode, SEED],
            )
            page.reload()
            page.wait_for_selector("#todayEarned")
            time.sleep(1.5)  # 等字体/图标稳定
            page.screenshot(path=str(OUT / f"{name}.png"))
            print("shot:", name)
            ctx.close()

        browser.close()
        print("done ->", OUT)


if __name__ == "__main__":
    main()
