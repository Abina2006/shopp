# ShopWise AI — Smart Shopping Comparison Platform

ShopWise AI is a monorepo-based smart shopping comparison platform designed to collect, aggregate, and compare product listings from multiple e-commerce websites with AI-powered insights.

## Project Structure

```text
shopwise-ai/
├── backend/          # Node.js + Express + PostgreSQL (Prisma ORM)
├── frontend/         # React + Vite + Tailwind CSS
├── scraper/          # Python + Scrapy
├── docs/             # Documentation
└── README.md         # Monorepo Entrypoint Documentation
```

## Prerequisites

- **Node.js**: v18 or later
- **npm**: v9 or later
- **Python**: v3.10 or later (for the web scraper)
- **PostgreSQL**: Local or cloud instance

## Installation & Setup

1. **Install Dependencies**
   From the root folder, run:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `backend/.env.example` to `backend/.env` and update details (e.g. database credentials, Gemini API keys).
   - Copy `frontend/.env.example` to `frontend/.env` and update configuration.

3. **Database Migration & Seed**
   (Once Database module is set up in B1)
   ```bash
   cd backend
   npm run db:migrate
   npm run db:seed
   ```

4. **Running Locally**
   - **Backend**:
     ```bash
     npm run start:backend
     ```
   - **Frontend**:
     ```bash
     npm run start:frontend
     ```
   - **Scraper**:
     Instructions are provided in the [scraper/README.md](file:///c:/Users/ADMIN/shopwiseAI/scraper/README.md).
