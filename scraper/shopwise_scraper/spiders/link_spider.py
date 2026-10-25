# pylint: disable=missing-module-docstring,missing-class-docstring,missing-function-docstring,line-too-long,unused-argument,import-error,duplicate-code,broad-exception-caught,too-many-locals,too-many-branches,too-many-statements,too-many-nested-blocks
import json
import re
import urllib.parse
import scrapy
from shopwise_scraper.items import ProductItem  # type: ignore


class LinkSpider(scrapy.Spider):
    name = 'link_spider'

    def __init__(self, *args, url=None, **kwargs):
        super().__init__(*args, **kwargs)
        if url:
            # Ensure url has scheme
            if not url.startswith('http://') and not url.startswith('https://'):
                url = 'https://' + url
            self.start_urls = [url]
            parsed = urllib.parse.urlparse(url)
            self.allowed_domains = [parsed.netloc] if parsed.netloc else []
        else:
            self.start_urls = ['http://quotes.toscrape.com/']
            self.allowed_domains = ['quotes.toscrape.com']

    def parse(self, response, **kwargs):  # type: ignore
        self.log(f"Crawling target product link: {response.url}")
        domain = urllib.parse.urlparse(response.url).netloc.lower()

        # Determine seller name from domain
        seller_name = "Online Store"
        if 'amazon' in domain:
            seller_name = 'Amazon'
        elif 'flipkart' in domain:
            seller_name = 'Flipkart'
        elif 'meesho' in domain:
            seller_name = 'Meesho'
        elif 'myntra' in domain:
            seller_name = 'Myntra'
        elif 'croma' in domain:
            seller_name = 'Croma'
        elif 'reliancedigital' in domain:
            seller_name = 'Reliance Digital'
        elif domain:
            seller_name = domain.replace('www.', '').split('.')[0].capitalize()

        # 1. Check for JSON-LD structured data (Schema.org Product)
        json_ld_products = []
        for script in response.css('script[type="application/ld+json"]::text').getall():
            try:
                data = json.loads(script)
                if isinstance(data, dict):
                    if data.get('@type') == 'Product':
                        json_ld_products.append(data)
                    elif '@graph' in data and isinstance(data['@graph'], list):
                        for item in data['@graph']:
                            if isinstance(item, dict) and item.get('@type') == 'Product':
                                json_ld_products.append(item)
                elif isinstance(data, list):
                    for item in data:
                        if isinstance(item, dict) and item.get('@type') == 'Product':
                            json_ld_products.append(item)
            except Exception:
                continue

        # 2. Extract Primary Product
        title = None
        brand = seller_name
        category = "General"
        image_url = None
        description = None
        price = 0.0
        currency = "INR"
        rating = 0.0
        review_count = 0
        reviews = []

        if json_ld_products:
            prod = json_ld_products[0]
            title = prod.get('name')
            description = prod.get('description')
            image_raw = prod.get('image')
            if isinstance(image_raw, list) and image_raw:
                image_url = image_raw[0]
            elif isinstance(image_raw, str):
                image_url = image_raw
            elif isinstance(image_raw, dict):
                image_url = image_raw.get('url')

            if isinstance(prod.get('brand'), dict):
                brand = prod['brand'].get('name', seller_name)
            elif isinstance(prod.get('brand'), str):
                brand = prod['brand']

            category = prod.get('category', 'Electronics')

            # Offers / Price
            offers = prod.get('offers')
            if isinstance(offers, dict):
                price = offers.get('price', 0.0)
                currency = offers.get('priceCurrency', 'INR')
            elif isinstance(offers, list) and offers:
                price = offers[0].get('price', 0.0)
                currency = offers[0].get('priceCurrency', 'INR')

            # Aggregate Rating
            agg_rating = prod.get('aggregateRating')
            if isinstance(agg_rating, dict):
                rating = agg_rating.get('ratingValue', 0.0)
                review_count = agg_rating.get('reviewCount', 0) or agg_rating.get('ratingCount', 0)

            # Reviews
            raw_reviews = prod.get('review', [])
            if isinstance(raw_reviews, dict):
                raw_reviews = [raw_reviews]
            for r in raw_reviews:
                if isinstance(r, dict):
                    author_obj = r.get('author', {})
                    reviewer_name = author_obj.get('name', 'Verified Buyer') if isinstance(author_obj, dict) else str(author_obj or 'Verified Buyer')
                    rev_rating_obj = r.get('reviewRating', {})
                    rev_rating = rev_rating_obj.get('ratingValue', 5.0) if isinstance(rev_rating_obj, dict) else 5.0
                    rev_body = r.get('reviewBody', '') or r.get('description', '')
                    if rev_body:
                        reviews.append({
                            'reviewer_name': reviewer_name,
                            'rating': float(rev_rating or 5.0),
                            'review_text': str(rev_body).strip()
                        })

        # 3. Fallback to OpenGraph / Twitter meta tags
        if not title:
            title = (
                response.css('meta[property="og:title"]::attr(content)').get()
                or response.css('meta[name="twitter:title"]::attr(content)').get()
                or response.css('title::text').get()
            )
            if title:
                # Clean up title suffixes like " | Amazon.in" or " - Flipkart"
                title = re.sub(r'\s*([|\-–—]).*$', '', title).strip()

        # Sanitize bot-block error titles like "Access Denied"
        INVALID_TITLES = ['access denied', '403 forbidden', '404 not found', 'attention required', 'just a moment', 'robot check', 'security check', 'cloudflare', 'blocked', 'forbidden']
        if title and any(inv in str(title).lower() for inv in INVALID_TITLES):
            title = None

        if not title:
            path_parts = [p for p in urllib.parse.urlparse(response.url).path.split('/') if p and p not in ['p', 'dp', 'product', 'products', 'item', 'buy', 'catalogue', 'index.html']]
            for part in path_parts:
                clean_part = re.sub(r'[\-_]', ' ', part).strip()
                if len(clean_part.split()) >= 2 or len(clean_part) > 8:
                    words = [w.capitalize() for w in clean_part.split() if not re.match(r'^\d+$', w)]
                    if words:
                        title = ' '.join(words)
                        break

        if not image_url:
            image_url = (
                response.css('meta[property="og:image"]::attr(content)').get()
                or response.css('meta[name="twitter:image"]::attr(content)').get()
                or response.css('#landingImage::attr(src)').get()
                or response.css('div.item.active img::attr(src)').get()  # books.toscrape
                or response.css('img.product-image::attr(src)').get()
                or response.css('.product_main img::attr(src)').get()
                or response.css('img.primary-image::attr(src)').get()
                or response.css('img::attr(src)').get()
            )
            # Make relative URLs absolute
            if image_url and image_url.startswith('../'):
                image_url = response.urljoin(image_url)
            elif image_url and not image_url.startswith('http'):
                image_url = response.urljoin(image_url)

        if not description:
            description = (
                response.css('meta[property="og:description"]::attr(content)').get()
                or response.css('meta[name="description"]::attr(content)').get()
                or response.css('#product_description + p::text').get()  # books.toscrape
                or response.css('.product-description p::text').get()
                or response.css('[itemprop="description"]::text').get()
            )

        # 4. DOM Fallback Selectors for Price
        if not price or float(price) == 0.0:
            price_text = (
                response.css('meta[property="product:price:amount"]::attr(content)').get()
                or response.css('.a-price .a-offscreen::text').get()
                or response.css('._30jeq3._16Jclm::text').get()
                or response.css('._30jeq3::text').get()
                or response.css('p.price_color::text').get()  # books.toscrape
                or response.css('.price_color::text').get()
                or response.css('.price::text').get()
                or response.css('[data-price]::attr(data-price)').get()
                or response.css('.product-price::text').get()
                or response.css('[itemprop="price"]::attr(content)').get()
                or response.css('[itemprop="price"]::text').get()
            )
            if price_text:
                # Strip any leading currency symbols (£, $, ₹, ¥, €, or any non-digit/non-dot/non-comma)
                clean_str = re.sub(r'[^\d.,]', '', str(price_text)).replace(',', '')
                cleaned_p = re.search(r'\d+(?:\.\d+)?', clean_str)
                if cleaned_p:
                    price = float(cleaned_p.group(0))

        # 5. DOM Fallback Selectors for Rating & Review Count
        if not rating or float(rating) == 0.0:
            # books.toscrape stores rating as CSS class: star-rating One/Two/Three/Four/Five
            rating_word = response.css('.star-rating::attr(class)').get()
            if rating_word:
                word_map = {'one': 1.0, 'two': 2.0, 'three': 3.0, 'four': 4.0, 'five': 5.0}
                for word, val in word_map.items():
                    if word in rating_word.lower():
                        rating = val
                        break
            if not rating or float(rating) == 0.0:
                rating_text = (
                    response.css('span[data-hook="rating-out-of-text"]::text').get()
                    or response.css('.a-icon-alt::text').get()
                    or response.css('._3LWZlK::text').get()
                    or response.css('.rating-score::text').get()
                    or response.css('[itemprop="ratingValue"]::attr(content)').get()
                    or response.css('[itemprop="ratingValue"]::text').get()
                )
                if rating_text:
                    cleaned_r = re.search(r'\d+(?:\.\d+)?', str(rating_text))
                    if cleaned_r:
                        rating = float(cleaned_r.group(0))

        if not review_count or int(review_count) == 0:
            count_text = (
                response.css('#acrCustomerReviewText::text').get()
                or response.css('._2_R_DZ span::text').get()
                or response.css('.total-reviews::text').get()
                or response.css('[itemprop="reviewCount"]::attr(content)').get()
                or response.css('[itemprop="reviewCount"]::text').get()
            )
            if count_text:
                cleaned_c = re.search(r'[\d,]+', str(count_text).replace(',', ''))
                if cleaned_c:
                    review_count = int(cleaned_c.group(0))

        # 6. DOM Fallback Selectors for Customer Reviews
        if not reviews:
            review_elements = (
                response.css('[data-hook="review"]')
                or response.css('._2wzgFH')
                or response.css('.review-card')
                or response.css('.customer-review')
                or response.css('[itemprop="review"]')
            )
            for rev_el in review_elements[:10]:
                r_name = (
                    rev_el.css('.a-profile-name::text').get()
                    or rev_el.css('._2sc7ZR::text').get()
                    or rev_el.css('.author::text').get()
                    or rev_el.css('[itemprop="author"]::text').get()
                    or 'Verified Customer'
                )
                r_rating_text = (
                    rev_el.css('.a-icon-alt::text').get()
                    or rev_el.css('._3LWZlK::text').get()
                    or rev_el.css('.rating::text').get()
                    or '5'
                )
                r_text = (
                    rev_el.css('[data-hook="review-body"] span::text').get()
                    or rev_el.css('.t-ZTKy::text').get()
                    or rev_el.css('.review-text::text').get()
                    or rev_el.css('[itemprop="reviewBody"]::text').get()
                    or rev_el.css('p::text').get()
                )
                if r_text and len(r_text.strip()) > 3:
                    cleaned_rr = re.search(r'\d+(?:\.\d+)?', str(r_rating_text))
                    r_val = float(cleaned_rr.group(0)) if cleaned_rr else 5.0
                    reviews.append({
                        'reviewer_name': r_name.strip(),
                        'rating': r_val,
                        'review_text': r_text.strip()
                    })

        # Do not yield item if no real title or price could be extracted
        if not title or title.startswith('Product from') or not price or float(price) == 0.0:
            self.log(f"Could not extract authentic title/price from {response.url}, skipping item.")
            return

        if not image_url or not image_url.startswith('http'):
            image_url = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300"
        if not description:
            description = f"Product extracted live from {seller_name} ({response.url})."
        if not rating:
            rating = 4.0
        if not review_count:
            review_count = len(reviews)

        # Build primary product item
        item = ProductItem()
        item['name'] = title
        item['category'] = category
        item['brand'] = brand
        item['image_url'] = image_url
        item['description'] = description
        item['seller_name'] = seller_name
        item['seller_url'] = response.url
        item['price'] = float(price)
        item['currency'] = currency
        item['rating'] = float(rating)
        item['review_count'] = int(review_count)
        item['reviews'] = reviews

        self.log(f"Successfully extracted product: '{title}' - ₹{price} ({rating}★, {len(reviews)} reviews)")
        yield item
