# pylint: disable=missing-module-docstring,line-too-long
import os
from dotenv import load_dotenv

# Load env variables from backend .env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '../../backend/.env'))

BOT_NAME = 'shopwise_scraper'

SPIDER_MODULES = ['shopwise_scraper.spiders']
NEWSPIDER_MODULE = 'shopwise_scraper.spiders'

# Respect robots.txt rules
ROBOTSTXT_OBEY = True

# Configure maximum concurrent requests
CONCURRENT_REQUESTS = 8

# Configure a delay for requests (default: 1 sec)
DOWNLOAD_DELAY = 1.0

# Disable cookies (enabled by default)
COOKIES_ENABLED = False

# Override default User-Agent
USER_AGENT = 'ShopWiseAI-Scraper/1.0 (+http://shopwise.ai)'

# Configure item pipelines
ITEM_PIPELINES = {
    'shopwise_scraper.pipelines.PostgresPipeline': 300,
}

# Autothrottle settings
AUTOTHROTTLE_ENABLED = True
AUTOTHROTTLE_START_DELAY = 1.0
AUTOTHROTTLE_MAX_DELAY = 10.0
AUTOTHROTTLE_TARGET_CONCURRENCY = 1.0

# Database Settings
DATABASE_URL = os.getenv('DATABASE_URL')
