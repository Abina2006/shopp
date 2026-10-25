# pylint: disable=missing-module-docstring,missing-class-docstring,missing-function-docstring,line-too-long,unused-argument,import-error,duplicate-code
import scrapy
from shopwise_scraper.items import ProductItem  # type: ignore


class AmazonSpider(scrapy.Spider):
    name = 'amazon_mock'
    allowed_domains = ['quotes.toscrape.com']
    start_urls = ['http://quotes.toscrape.com/']

    def parse(self, response, **kwargs):  # type: ignore
        self.log(f"Parsing mock Amazon listing data from {response.url}...")

        mock_products = [
            {
                'name': 'iPhone 15 Pro (128GB)',
                'category': 'Electronics',
                'brand': 'Apple',
                'image_url': 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=300',
                'description': 'Aerospace-grade titanium design with Apple A17 Pro CPU.',
                'seller_name': 'Amazon',
                'seller_url': 'https://amazon.example.com/dp/B0CHX12345',
                'price': 129990.00,
                'currency': 'INR',
                'rating': 4.7,
                'review_count': 312,
                'reviews': [
                    {
                        'reviewer_name': 'Alex G',
                        'rating': 5,
                        'review_text': 'Exceptional build and camera performance. Fits perfectly.'
                    },
                    {
                        'reviewer_name': 'Sarah K',
                        'rating': 4,
                        'review_text': 'Great phone, but warning: runs slightly hot during high graphics loads.'
                    }
                ]
            },
            {
                'name': 'Sony WH-1000XM5 ANC Headphones',
                'category': 'Audio',
                'brand': 'Sony',
                'image_url': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=300',
                'description': 'Advanced Active Noise Canceling Wireless Over-ear headphone.',
                'seller_name': 'Amazon',
                'seller_url': 'https://amazon.example.com/dp/B09XS8728S',
                'price': 29990.00,
                'currency': 'INR',
                'rating': 4.6,
                'review_count': 812,
                'reviews': [
                    {
                        'reviewer_name': 'David R',
                        'rating': 5,
                        'review_text': 'The soundstage and ANC quality is absolutely unmatched!'
                    }
                ]
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
