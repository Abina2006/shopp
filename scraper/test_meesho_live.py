import urllib.request
import json
import re

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-IN,en;q=0.9',
}

def test_fetch(query="boat airdopes alpha"):
    encoded_q = urllib.parse.quote_plus(query)
    url = f"https://www.meesho.com/search?q={encoded_q}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8', errors='ignore')
            print(f"Status 200, HTML length: {len(html)}")
            
            # Check __NEXT_DATA__
            match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', html)
            if match:
                data = json.loads(match.group(1))
                page_props = data.get('props', {}).get('pageProps', {})
                print("Keys in pageProps:", list(page_props.keys()))
                # Check for products in initialState or searchResults
                init_state = page_props.get('initialState', {})
                print("Keys in initialState:", list(init_state.keys()))
                products = init_state.get('search', {}).get('products', []) or init_state.get('plp', {}).get('products', [])
                print(f"Found {len(products)} products in search state")
                for p in products[:5]:
                    print(f"-> {p.get('name')} | ₹{p.get('price')} | {p.get('rating')}★ | {p.get('rating_count')} reviews")
            else:
                print("Checking regex prices...")
                # Search for price patterns
                prices = re.findall(r'₹\s*([0-9,]+)', html)
                print("Found prices:", prices[:8])
    except Exception as e:
        print("Error fetching Meesho:", e)

if __name__ == '__main__':
    test_fetch()
