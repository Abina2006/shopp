# pylint: disable=missing-module-docstring,missing-function-docstring,line-too-long,broad-exception-caught
"""
extract_url.py  –  Programmatic Scrapy launcher for a single URL.

Usage (CLI):
    python extract_url.py "https://some-product-page.com/product/123"

The script runs the link_spider in a subprocess and prints JSON to stdout:
    {"success": true, "data": [...]}  or  {"success": false, "error": "..."}

This avoids Scrapy's one-reactor-per-process constraint so the backend can
call it multiple times per server lifecycle via child_process.exec().
"""
import sys
import json
import subprocess
import os


def extract_url(target_url: str) -> dict:
    """Invoke Scrapy via subprocess and return parsed JSON result."""
    scrapy_script = os.path.join(os.path.dirname(__file__), '_scrapy_runner.py')
    result = subprocess.run(
        [sys.executable, scrapy_script, target_url],
        capture_output=True,
        text=True,
        timeout=60,
        cwd=os.path.dirname(__file__),
    )
    raw = (result.stdout or '').strip()
    if not raw:
        return {"success": False, "error": result.stderr or "No output from spider."}
    # Find the last JSON line
    for line in reversed(raw.split('\n')):
        line = line.strip()
        if line.startswith('{'):
            try:
                return json.loads(line)
            except json.JSONDecodeError:
                continue
    return {"success": False, "error": "Could not parse spider output."}


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "No URL provided. Usage: python extract_url.py <url>"}))
        sys.exit(1)

    url_arg = sys.argv[1]
    output = extract_url(url_arg)
    print(json.dumps(output))
