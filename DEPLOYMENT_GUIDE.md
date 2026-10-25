# 🚀 ShopWise AI — Complete Deployment Guide (Vercel + Render + Neon)

Your application is **100% production-ready**:
- ✅ **Frontend Vite Build**: Tested & verified (`dist/` compiles with 0 errors).
- ✅ **Single Page Application Routing**: `frontend/vercel.json` rewrite rule is active.
- ✅ **CORS**: Configured to automatically accept requests from Vercel, Netlify, and Render.
- ✅ **Cloud Database**: Neon PostgreSQL is already active and connected.
- ✅ **Git Repository**: Initialized locally on branch `main` with `.env` and `node_modules` safely protected.

---

## 📌 Overview of the 3 Steps

| Component | Platform | Free Tier | Setup Time |
| :--- | :--- | :--- | :--- |
| **1. Code Repository** | **GitHub** | Free | 2 minutes |
| **2. Backend API** | **Render.com** | Free Web Service | 3 minutes |
| **3. Frontend Web App** | **Vercel.com** | Free Hobby Tier | 2 minutes |

---

## Step 1: Push Code to GitHub

1. Open [GitHub](https://github.com/new) and click **New Repository**.
2. Name your repository (e.g. `shopwise-ai`).
3. Leave it as **Public** or **Private**, do NOT check "Add a README" or ".gitignore" (these already exist locally).
4. Click **Create repository**.
5. Copy the repository URL (e.g., `https://github.com/<your-username>/shopwise-ai.git`).
6. In your terminal inside `shopwiseAI/`, run:
   ```bash
   git remote add origin https://github.com/<your-username>/shopwise-ai.git
   git push -u origin main
   ```

---

## Step 2: Deploy Backend to Render

1. Go to [Render.com](https://dashboard.render.com/) and log in (you can log in with GitHub).
2. Click **New +** → **Web Service**.
3. Select **Build and deploy from a Git repository** and connect your `shopwise-ai` repo.
4. Fill in the configuration details:
   - **Name**: `shopwise-backend` (or your chosen name)
   - **Region**: Singapore or Frankfurt (closest to you)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install` *(this automatically triggers `prisma generate`)*
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. Scroll down to **Environment Variables** and add the following:

   | Key | Value |
   | :--- | :--- |
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |
   | `DATABASE_URL` | *(Copy your Neon DATABASE_URL from backend/.env)* |
   | `JWT_SECRET` | `shopwise_ai_secure_jwt_secret_key_2026` |
   | `JWT_REFRESH_SECRET` | `shopwise_ai_secure_jwt_refresh_secret_key_2026_a8d7e9b2` |
   | `JWT_EXPIRES_IN` | `7d` |
   | `GEMINI_API_KEY` | *(Copy your GEMINI_API_KEY from backend/.env)* |

6. Click **Deploy Web Service**.
7. Once deployed, Render will provide your public backend URL, for example:
   👉 `https://shopwise-backend-xxxx.onrender.com`
   *(Verify it by opening `https://shopwise-backend-xxxx.onrender.com/api/products` in your browser).*

---

## Step 3: Deploy Frontend to Vercel

1. Go to [Vercel.com](https://vercel.com/) and sign in with GitHub.
2. Click **Add New...** → **Project**.
3. Locate your `shopwise-ai` repository and click **Import**.
4. In the Project Configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click `Edit` and select `frontend`
   - **Build Command**: `npm run build` *(default)*
   - **Output Directory**: `dist` *(default)*
5. Expand **Environment Variables** and add:

   | Key | Value |
   | :--- | :--- |
   | `VITE_API_BASE_URL` | `https://shopwise-backend-xxxx.onrender.com/api` |
   *(Replace with your actual Render URL from Step 2, and remember to include `/api` at the end)*

6. Click **Deploy**.
7. In ~60 seconds, your site is live! You will get a link like `https://shopwise-ai.vercel.app`.

---

## 🔁 Future Updates

Whenever you make improvements or changes in the code:
```bash
git add .
git commit -m "update: improvements"
git push
```
Render and Vercel will **automatically detect the push and redeploy** your backend and frontend with zero downtime!
