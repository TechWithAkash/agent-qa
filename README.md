# DRISHTI AI — Autonomous AI QA Engineer

> **Team Refactor** | CODE APEX 3.0, iMocha Track IM-02 | VIT Pune, AISF

An autonomous AI agent that tests web applications: it explores the app, decides what to test, runs tests in a browser, validates failures, and reports real bugs with evidence.

## Quick Start

```bash
# 1. Clone and configure
cp .env.example .env
# Edit .env with your LLM API key

# 2. Start all services
docker compose up --build

# 3. Open the dashboard
open http://localhost:3000
```

## Architecture

| Component     | Tech                | Port  |
|---------------|---------------------|-------|
| Dashboard     | Next.js + Tailwind  | 3000  |
| Backend API   | FastAPI + Pydantic  | 8000  |
| Runner        | Python + Playwright | —     |
| Database      | MongoDB             | 27017 |
| ShopLite      | Express.js          | 3001  |

See [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md) for full design.

## Repository Layout

```
drishti-ai/
  apps/
    frontend/       # Next.js dashboard
    backend/        # FastAPI REST API
    runner/         # Pipeline (S1–S10), browser layer, LLM gateway
    shoplite/       # Benchmark target app with plantable bugs
  benchmarks/       # Scoring runner, descriptions, results
  tests/            # System-level tests (unit, integration, security)
  data/             # gitignored — artifacts, LLM cache
  demo/             # Fallback recordings, demo script
```

## AI Tools and Models Used

| Tool / Model       | Purpose                              |
|--------------------|--------------------------------------|
| *(fill in)*        | LLM for test planning                |
| Playwright         | Browser automation                   |
| *(fill in)*        | Code assistance during development   |

> Per IM-02 guidelines: all AI tools and models used are listed above.

## Credits

- [Playwright](https://playwright.dev/) — Browser automation (Apache-2.0)
- [FastAPI](https://fastapi.tiangolo.com/) — Backend framework (MIT)
- [Next.js](https://nextjs.org/) — Frontend framework (MIT)
- [MongoDB](https://www.mongodb.com/) — Database (SSPL)
- [pytest](https://pytest.org/) — Testing framework (MIT)

## Team

- **Paras Sanjay Kumbhar** — Team Leader
- *(add team members)*

## License

For CODE APEX 3.0 hackathon submission only.
