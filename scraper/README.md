# ShopWise AI — E-Commerce Web Scraper

This scraper is built with Python and Scrapy. It runs spiders targeting designated e-commerce sandboxes and processes data into the central PostgreSQL database.

## Prerequisites

- Python 3.10+
- A running PostgreSQL database instance (defined in the main workspace backend `.env` file)

## Local Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

2. Activate the virtual environment:
   - On Windows (PowerShell):
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

3. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Spiders

To run a spider manually, use:
```bash
scrapy crawl <spider_name>
```
*(Spiders will be configured and implemented in the Scraping Module B7).*
