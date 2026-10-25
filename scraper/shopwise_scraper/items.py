# pylint: disable=missing-module-docstring,missing-class-docstring,missing-function-docstring,line-too-long
import re
import scrapy
from itemloaders import ItemLoader
from itemloaders.processors import MapCompose, TakeFirst, Identity


def clean_text(value):
    if value is None:
        return ""
    return str(value).strip()


def clean_price(value):
    if value is None:
        return 0.0
    if isinstance(value, (int, float)):
        return float(value)
    # Remove commas and extract numeric price representation (e.g. "Rs. 1,499.00" -> 1499.0)
    cleaned = str(value).replace(',', '').strip()
    match = re.search(r'\d+(?:\.\d+)?', cleaned)
    if match:
        try:
            return float(match.group(0))
        except ValueError:
            return 0.0
    return 0.0


def clean_rating(value):
    if value is None:
        return 0.0
    if isinstance(value, (int, float)):
        return float(value)
    # Extract rating number (e.g. "4.7 out of 5 stars" -> 4.7)
    match = re.search(r'\d+(?:\.\d+)?', str(value))
    if match:
        try:
            return float(match.group(0))
        except ValueError:
            return 0.0
    return 0.0


def clean_integer(value):
    if value is None:
        return 0
    if isinstance(value, int):
        return value
    if isinstance(value, float):
        return int(value)
    # Extract integer count (e.g. "1,234 reviews" or "312 ratings" -> 1234 or 312)
    cleaned = str(value).replace(',', '').strip()
    match = re.search(r'\d+(?:\.\d+)?', cleaned)
    if match:
        try:
            return int(float(match.group(0)))
        except ValueError:
            return 0
    return 0


class ReviewItem(scrapy.Item):
    reviewer_name = scrapy.Field(
        input_processor=MapCompose(clean_text),
        output_processor=TakeFirst()
    )
    rating = scrapy.Field(
        input_processor=MapCompose(clean_rating),
        output_processor=TakeFirst()
    )
    review_text = scrapy.Field(
        input_processor=MapCompose(clean_text),
        output_processor=TakeFirst()
    )
    sentiment_score = scrapy.Field(output_processor=TakeFirst())
    summarized_text = scrapy.Field(output_processor=TakeFirst())


class ProductItem(scrapy.Item):
    name = scrapy.Field(
        input_processor=MapCompose(clean_text),
        output_processor=TakeFirst()
    )
    category = scrapy.Field(
        input_processor=MapCompose(clean_text),
        output_processor=TakeFirst()
    )
    brand = scrapy.Field(
        input_processor=MapCompose(clean_text),
        output_processor=TakeFirst()
    )
    image_url = scrapy.Field(
        input_processor=MapCompose(clean_text),
        output_processor=TakeFirst()
    )
    description = scrapy.Field(
        input_processor=MapCompose(clean_text),
        output_processor=TakeFirst()
    )

    # Listings fields associated with product
    seller_name = scrapy.Field(
        input_processor=MapCompose(clean_text),
        output_processor=TakeFirst()
    )
    seller_url = scrapy.Field(
        input_processor=MapCompose(clean_text),
        output_processor=TakeFirst()
    )
    price = scrapy.Field(
        input_processor=MapCompose(clean_price),
        output_processor=TakeFirst()
    )
    currency = scrapy.Field(
        input_processor=MapCompose(clean_text),
        output_processor=TakeFirst()
    )
    rating = scrapy.Field(
        input_processor=MapCompose(clean_rating),
        output_processor=TakeFirst()
    )
    review_count = scrapy.Field(
        input_processor=MapCompose(clean_integer),
        output_processor=TakeFirst()
    )

    # Nested reviews
    reviews = scrapy.Field(output_processor=Identity())


class ProductLoader(ItemLoader):
    default_item_class = ProductItem
    default_output_processor = TakeFirst()
