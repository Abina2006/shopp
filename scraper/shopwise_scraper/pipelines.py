# pylint: disable=broad-exception-caught,missing-module-docstring,missing-class-docstring,missing-function-docstring,line-too-long
import datetime
import psycopg2
from psycopg2.extras import RealDictCursor


class PostgresPipeline:
    def __init__(self, db_url):
        self.db_url = db_url
        self.conn = None
        self.cursor = None
        self.crawler = None
        self.start_time = None
        self.items_scraped = 0
        self.errors_count = 0

    @classmethod
    def from_crawler(cls, crawler):
        pipeline = cls(
            db_url=crawler.settings.get('DATABASE_URL')
        )
        pipeline.crawler = crawler
        return pipeline

    def open_spider(self, spider):
        if not self.db_url:
            spider.logger.error("DATABASE_URL not found in settings!")
            return

        try:
            # Strip query parameters (like ?schema=public) for psycopg2 compatibility
            clean_db_url = self.db_url.split('?')[0] if '?' in self.db_url else self.db_url
            self.conn = psycopg2.connect(clean_db_url)
            self.cursor = self.conn.cursor(cursor_factory=RealDictCursor)
            spider.logger.info("Successfully connected to PostgreSQL database.")

            # Start tracking logs
            self.start_time = datetime.datetime.now()
            self.items_scraped = 0
            self.errors_count = 0
        except Exception as e:
            spider.logger.error(f"Failed to connect to database: {e}")

    def close_spider(self, spider):
        if self.conn and self.cursor:
            cursor = self.cursor
            conn = self.conn
            # Write run logs if possible
            try:
                end_time = datetime.datetime.now()
                start = self.start_time or end_time
                duration = (end_time - start).total_seconds()

                import uuid
                # Check/create log table manually if needed
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS scraper_logs (
                        id UUID PRIMARY KEY,
                        spider_name VARCHAR(100),
                        items_scraped INT,
                        errors_count INT,
                        started_at TIMESTAMP,
                        finished_at TIMESTAMP,
                        duration_seconds FLOAT
                    )
                """)
                cursor.execute("""
                    INSERT INTO scraper_logs (id, spider_name, items_scraped, errors_count, started_at, finished_at, duration_seconds)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (str(uuid.uuid4()), spider.name, self.items_scraped, self.errors_count, start, end_time, duration))
                conn.commit()
            except Exception as e:
                spider.logger.error(f"Failed to save scraper logs: {e}")

            cursor.close()
            conn.close()
            spider.logger.info("PostgreSQL connection closed.")

    def process_item(self, item, spider):
        if not self.conn or not self.cursor:
            return item

        cursor = self.cursor
        conn = self.conn

        try:
            # 1. Check if product exists using exact or fuzzy string matching
            import difflib

            product_id = None
            
            # First try exact match
            cursor.execute(
                "SELECT id, name FROM products WHERE LOWER(name) = LOWER(%s) AND LOWER(brand) = LOWER(%s)",
                (item['name'], item['brand'])
            )
            exact_match = cursor.fetchone()

            if exact_match:
                product_id = exact_match['id']
            else:
                # Fuzzy match: search products within the same brand or category
                cursor.execute(
                    "SELECT id, name FROM products WHERE LOWER(brand) = LOWER(%s) OR LOWER(category) = LOWER(%s)",
                    (item['brand'], item['category'])
                )
                candidates = cursor.fetchall()
                best_ratio = 0.0
                best_candidate_id = None

                item_name_lower = item['name'].lower()
                for cand in candidates:
                    cand_name_lower = cand['name'].lower()
                    # Calculate similarity ratio
                    ratio = difflib.SequenceMatcher(None, item_name_lower, cand_name_lower).ratio()
                    # Also check if core words overlap
                    item_words = set(item_name_lower.split())
                    cand_words = set(cand_name_lower.split())
                    overlap_ratio = len(item_words.intersection(cand_words)) / max(len(item_words), 1)

                    score = max(ratio, overlap_ratio)
                    if score > best_ratio and score >= 0.60:
                        best_ratio = score
                        best_candidate_id = cand['id']

                if best_candidate_id:
                    product_id = best_candidate_id
                    spider.logger.info(f"Fuzzy match found: '{item['name']}' matched to product ID {product_id} (score: {best_ratio:.2f})")
                else:
                    # Create new Product
                    cursor.execute(
                        "INSERT INTO products (id, name, category, brand, image_url, description, created_at) "
                        "VALUES (gen_random_uuid(), %s, %s, %s, %s, %s, %s) RETURNING id",
                        (item['name'], item['category'], item['brand'], item['image_url'], item['description'], datetime.datetime.now())
                    )
                    res = cursor.fetchone()
                    product_id = res['id'] if res else None
                    conn.commit()

            if not product_id:
                return item

            # 2. Check if listing already exists from this seller for this product
            cursor.execute(
                "SELECT id, price FROM product_listings WHERE product_id = %s AND seller_name = %s",
                (product_id, item['seller_name'])
            )
            existing_listing = cursor.fetchone()

            if existing_listing:
                listing_id = existing_listing['id']
                old_price = existing_listing['price']

                # Update Listing
                cursor.execute(
                    "UPDATE product_listings SET price = %s, rating = %s, review_count = %s, last_scraped_at = %s "
                    "WHERE id = %s",
                    (item['price'], item['rating'], item['review_count'], datetime.datetime.now(), listing_id)
                )
            else:
                # Create Listing
                cursor.execute(
                    "INSERT INTO product_listings (id, product_id, seller_name, seller_url, price, currency, rating, review_count, last_scraped_at) "
                    "VALUES (gen_random_uuid(), %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
                    (product_id, item['seller_name'], item['seller_url'], item['price'], item['currency'], item['rating'], item['review_count'], datetime.datetime.now())
                )
                res_listing = cursor.fetchone()
                listing_id = res_listing['id'] if res_listing else None
                old_price = None

            if not listing_id:
                return item

            # 3. Add to Price History if price changed or is new
            if old_price is None or float(old_price) != float(item['price']):
                cursor.execute(
                    "INSERT INTO price_history (id, listing_id, price, recorded_at) "
                    "VALUES (gen_random_uuid(), %s, %s, %s)",
                    (listing_id, item['price'], datetime.datetime.now())
                )

            # 4. Insert reviews and link to listing
            if 'reviews' in item and item['reviews']:
                for rev in item['reviews']:
                    # Check if review already exists
                    cursor.execute(
                        "SELECT id FROM reviews WHERE listing_id = %s AND reviewer_name = %s AND review_text = %s",
                        (listing_id, rev['reviewer_name'], rev['review_text'])
                    )
                    if not cursor.fetchone():
                        cursor.execute(
                            "INSERT INTO reviews (id, listing_id, reviewer_name, rating, review_text, sentiment_score, summarized_text, scraped_at) "
                            "VALUES (gen_random_uuid(), %s, %s, %s, %s, %s, %s, %s)",
                            (listing_id, rev['reviewer_name'], rev['rating'], rev['review_text'], None, None, datetime.datetime.now())
                        )

            conn.commit()
            self.items_scraped += 1

        except Exception as e:
            conn.rollback()
            self.errors_count += 1
            spider.logger.error(f"Error processing scraped item to database: {e}")

        return item
