# pylint: disable=missing-module-docstring,missing-function-docstring,line-too-long,broad-exception-caught
"""
_playwright_fetch.py  –  Standalone headless fetch script.

Called as a subprocess by _scrapy_runner.py.
Usage: python _playwright_fetch.py "<url>"
Outputs: single JSON line with {"html": "...", "url": "..."} or {"error": "..."}
"""
import sys
import json
import os


def fetch(target_url: str) -> None:
    from playwright.sync_api import sync_playwright  # type: ignore

    with sync_playwright() as pw:
        browser = pw.chromium.launch(
            headless=True,
            args=[
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--blink-settings=imagesEnabled=false',
            ]
        )
        context = browser.new_context(
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            viewport={'width': 1366, 'height': 768},
            locale='en-IN',
            timezone_id='Asia/Kolkata',
            extra_http_headers={
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-IN,en-US;q=0.9,en;q=0.8',
                'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'none',
                'sec-fetch-user': '?1',
                'upgrade-insecure-requests': '1',
            }
        )
        page = context.new_page()

        # Route blocking for non-text assets (images, stylesheets, fonts, media) to speed up loading
        try:
            page.route("**/*.{png,jpg,jpeg,gif,svg,webp,css,woff,woff2,mp4,mp3}", lambda route: route.abort())
        except Exception:
            pass

        try:
            page.goto(target_url, wait_until='domcontentloaded', timeout=5000)
        except Exception:
            try:
                page.goto(target_url, wait_until='commit', timeout=2000)
            except Exception:
                browser.close()
                print(json.dumps({"error": "Page load failed"}))
                return

        # Brief pause for inline JS execution
        try:
            page.wait_for_timeout(500)
        except Exception:
            pass

        html = page.content()
        final_url = page.url
        browser.close()

        # Only output the JSON line, nothing else
        print(json.dumps({"html": html, "url": final_url}))


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No URL provided"}))
        sys.exit(1)
    try:
        fetch(sys.argv[1])
    except Exception as exc:
        print(json.dumps({"error": str(exc)}))
