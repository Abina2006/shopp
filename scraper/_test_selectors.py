import sys
sys.path.insert(0, '.')
from scrapy.http import HtmlResponse
import urllib.request

req = urllib.request.Request(
    'http://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html',
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
)
html = urllib.request.urlopen(req).read()
response = HtmlResponse(url='http://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html', body=html)

print('=== PRICE ===')
print('price_color p:', response.css('p.price_color::text').get())
print('.price_color:', response.css('.price_color::text').get())
print('itemprop price:', response.css('[itemprop="price"]::attr(content)').get())

print('=== IMAGE ===')
img = response.css('div.item.active img::attr(src)').get()
print('div.item.active img raw:', img)
if img:
    print('urljoin:', response.urljoin(img))

print('=== RATING ===')
print('star-rating class:', response.css('.star-rating::attr(class)').get())

print('=== DESCRIPTION ===')
desc = response.css('#product_description + p::text').get()
print('desc:', desc[:100] if desc else None)
