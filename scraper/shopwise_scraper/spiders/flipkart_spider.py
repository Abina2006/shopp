# pylint: disable=missing-module-docstring,missing-class-docstring,missing-function-docstring,line-too-long,unused-argument,import-error,duplicate-code
import scrapy
from shopwise_scraper.items import ProductItem  # type: ignore


class FlipkartSpider(scrapy.Spider):
    name = 'flipkart_mock'
    allowed_domains = ['quotes.toscrape.com']
    start_urls = ['http://quotes.toscrape.com/']

    def parse(self, response, **kwargs):  # type: ignore
        self.log(f"Parsing mock Flipkart listing data from {response.url}...")

        mock_products = [
            {
                'name': 'Sony WH-1000XM5 ANC Headphones',
                'category': 'Audio',
                'brand': 'Sony',
                'image_url': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=300',
                'description': 'Advanced Active Noise Canceling Wireless Over-ear headphone.',
                'seller_name': 'Flipkart',
                'seller_url': 'https://flipkart.example.com/sony-wh1000xm5',
                'price': 28490.00,
                'currency': 'INR',
                'rating': 4.4,
                'review_count': 204,
                'reviews': [
                    {
                        'reviewer_name': 'Rahul S',
                        'rating': 4,
                        'review_text': 'Very fast delivery from Flipkart. Quality noise cancelation!'
                    }
                ]
            },
            {
                'name': 'Samsung Galaxy Watch 6',
                'category': 'Wearables',
                'brand': 'Samsung',
                'image_url': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300',
                'description': 'Track sleep, body composition, and exercise wellness.',
                'seller_name': 'Flipkart',
                'seller_url': 'https://flipkart.example.com/samsung-watch-6',
                'price': 19999.00,
                'currency': 'INR',
                'rating': 4.3,
                'review_count': 110,
                'reviews': []
            }
        ]

        for p in mock_products:
            item = ProductItem()
            item['name'] = p['name']
            item['category'] = p['category']
            item['brand'] = p['brand']
            item['image_url'] = p['image_url']
            item['description'] = p['description']
            item['seller_name'] = p['seller_name']
            item['seller_url'] = p['seller_url']
            item['price'] = p['price']
            item['currency'] = p['currency']
            item['rating'] = p['rating']
            item['review_count'] = p['review_count']
            item['reviews'] = p['reviews']
            yield item
