# DRISHTI AI — Vercel Live Deployment Guide

This guide walks you through deploying the **DRISHTI AI** platform to Vercel in less than 2 minutes.

---

## Why DRISHTI AI Works Out-of-the-Box on Vercel

DRISHTI AI's Next.js 16 App Router frontend (`apps/frontend`) is architected with a **hybrid autonomous engine**:
- **With a dedicated backend:** It proxies requests to `BACKEND_API_URL` (FastAPI).
- **Serverless / Standalone mode:** When deployed to Vercel without a separate backend, its built-in API routes (`/api/runs`, `/api/findings`, `/api/runs/[id]`, etc.) automatically fall back to the built-in in-memory engine, producing real-time multi-agent swarm steps, live telemetry, interactive browser sandboxes, and executive defect reports.

---

## Step-by-Step Deployment (2 Minutes)

### Step 1: Open Vercel & Import Your GitHub Repository
1. Navigate to [**https://vercel.com/new**](https://vercel.com/new).
2. Sign in with your GitHub account (`TechWithAkash`).
3. Under **Import Git Repository**, search for:
   ```text
   TechWithAkash/agent-qa
   ```
4. Click the blue **Import** button.

---

### Step 2: Configure the Root Directory (Crucial Step!)

Because the repository is structured as a monorepo, you **must tell Vercel where the Next.js application lives**:

1. Under **Project Configuration**, find **Root Directory**.
2. Click **Edit** next to `./`.
3. Select or type:
   ```text
   apps/frontend
   ```
4. Click **Continue**.

Vercel will automatically detect **Next.js** as the Framework Preset.

---

### Step 3: Add Environment Variables (Optional but Recommended)

In the **Environment Variables** section on Vercel, add:

| Key | Value | Description |
| :--- | :--- | :--- |
| `GROQ_API_KEY` | `gsk_...` (Your Groq Key) | Enables high-speed Llama-3.3-70b AI reasoning |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | (Optional) Public canonical URL |

*(If you don't provide a Groq key immediately, DRISHTI AI will still run seamlessly using its deterministic ground-truth engine!)*

---

### Step 4: Click Deploy!

Click the **Deploy** button.

Vercel will:
1. Run `npm install` inside `apps/frontend`.
2. Compile Next.js 16 with Turbopack.
3. Prerender all static and dynamic routes (`/`, `/benchmarks`, `/login`, `/register`, `/runs/[id]`).
4. Provide you with a live production URL:
   ```
   https://agent-qa-drishti.vercel.app (or custom domain)
   ```

---

## Alternative: Deploy via Vercel CLI from Your Terminal

If you prefer deploying directly from your Mac terminal:

```bash
# 1. Navigate to the frontend directory
cd /Users/akashvishwakarma/codeapex-3.0/apps/frontend

# 2. Run Vercel CLI (interactive setup)
npx vercel

# Follow the prompts:
# ? Set up and deploy "~/codeapex-3.0/apps/frontend"? [Y/n] y
# ? Which scope do you want to deploy to? (Select your personal account)
# ? Link to existing project? [y/N] n
# ? What’s your project’s name? drishti-ai
# ? In which directory is your code located? ./
```

To deploy directly to production:
```bash
npx vercel --prod
```

---

## Live Features Available on Vercel:

1. **Autonomous Launchpad (`/`):** Enter target URLs and launch runs.
2. **Multi-Agent Swarm Modal:** Real-time sequential 10-agent execution visualizer with live telemetry.
3. **Executive QA Results Dashboard (`/runs/[id]`):**
   - **Tab 1: Defects & Observations:** Expected vs Observed behavior, reproduction steps, technical evidence, macOS screenshot frame with pixel pinpoint.
   - **Tab 2: Audited User Journeys:** Full step traces & pre/post action screenshots.
   - **Tab 3: Live Browser & Locators:** Responsive Desktop/Tablet/Mobile viewports + 1-click locator copy matrix.
   - **Tab 4: Pytest Artifact:** Standalone, downloadable `pytest-playwright` `.py` suite.
   - **Tab 5: AI QA & Self-Healing:** Natural language test prompts & locator drift simulation.
4. **Authentication:**
   - `/login` with the **1-Click Demo Login as Paras** button.
   - `/register` with role selection (QA Lead, Developer, Judge/Evaluator).
   - Profile badge and dropdown in the top navigation bar with persistent `localStorage` session sync.
