# pylint: disable=missing-module-docstring,missing-function-docstring,line-too-long,invalid-name
import subprocess
import time
import sys

spiders = ['amazon_mock', 'flipkart_mock', 'meesho_mock']

def run_spiders():
    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Starting Scrapy crawlers run...")
    for spider in spiders:
        print(f"Crawling spider: {spider}...")
        try:
            # Execute command `scrapy crawl <spider>`
            subprocess.run(
                ['scrapy', 'crawl', spider],
                capture_output=True,
                text=True,
                check=True
            )
            print(f"Finished spider {spider} successfully.")
        except subprocess.CalledProcessError as e:
            print(f"Error executing spider {spider}: {e}", file=sys.stderr)
            print(e.stderr, file=sys.stderr)

    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Scraping cycle finished.")

if __name__ == '__main__':
    # Run once on start
    run_spiders()

    # Simple schedule: check loop every 6 hours
    six_hours = 6 * 60 * 60
    while True:
        print("Sleeping for 6 hours until next crawl...")
        time.sleep(six_hours)
        run_spiders()
