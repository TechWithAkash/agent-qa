# DRISHTI.AI — Stage 2 Readiness Audit & Implementation Planning

> **Project:** DRISHTI.AI — Autonomous AI QA Engineer  
> **Track:** CODE APEX 3.0 | iMocha Track IM-02  
> **Date:** October 18, 2026  
> **Status:** AUDIT & PLANNING REPORT — AWAITING EXPLICIT APPROVAL BEFORE IMPLEMENTATION  

---

## A. Executive Summary

### Verdict: **READY WITH LIMITATIONS** (Prototype UI / Demonstration Mode) / **NOT READY** (Autonomous Dynamic Execution & GitHub Ingestion)

#### Summary of Current State
DRISHTI.AI currently possesses two distinct architectural engines in the codebase:
1. **The Complete Python/Playwright Pipeline (`apps/runner` & `apps/backend`):** A well-architected 10-stage autonomous engine (`S1`–`S10`) built on Playwright Chromium, an Assertion DSL, deterministic BFS state exploration, 3× failure replay verification, and template-based Pytest codegen. However, this engine requires MongoDB and Docker Compose to claim and execute jobs, which are not currently running in the native developer environment.
2. **The Frontend In-Memory Demonstration Engine (`apps/frontend/app/api/store.js`):** A simulated runner built directly into the Next.js API routes that crawls URLs via Cheerio/Fetch and emits deterministic events, hardcoded ShopLite findings (`B1`–`B4`), and authentic route screenshots.

#### Primary Vulnerabilities & Gaps
1. **Simulated vs. Real Execution Disconnect:** The frontend UI currently operates on the in-memory store fallback (`store.js`) rather than dispatching jobs to the Python Playwright runner. Anomaly coordinates (`x: 28, y: 42, w: 44, h: 8`) and replay verification rates are synthetically injected rather than computed from live Playwright element bounding boxes.
2. **GitHub Testing Gap:** The current GitHub integration only performs static `raw.githubusercontent.com` HTTP fetches of `package.json` and `README.md`. It does not clone, isolate, install dependencies, launch, or probe live applications from GitHub repositories.
3. **Execution Sandbox Absence:** If arbitrary GitHub repositories or untrusted applications are executed on the host without an ephemeral container sandbox (with cgroups, seccomp, and egress network isolation), the host is vulnerable to arbitrary code execution during `npm install` lifecycle scripts (`preinstall`/`postinstall`).

---

## B. Existing Feature Inventory

| Capability / Module | Implementation Status | Code Evidence & Call Paths | Remaining Gap | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **Next.js Frontend & Dashboard** | **VERIFIED** | `apps/frontend/app/runs/[id]/page.js`, `page.js` | UI connects to in-memory store; needs seamless toggle between live Python runner and local store. | P0 |
| **FastAPI Backend API** | **CODE-ONLY** | `apps/backend/main.py:18-41`, `app/routes/runs.py` | Requires active MongoDB instance (`drishti-mongo`) to start; not running in standalone native mode. | P0 |
| **Playwright Browser Manager** | **CODE-ONLY** | `apps/runner/browser/context.py:13-70` | Playwright Chromium launch and hardening exist in Python code, but `playwright` is not installed in host global Python. | P0 |
| **Autonomous Web Crawler & Discovery** | **PARTIALLY VERIFIED** | `apps/frontend/app/api/store.js:189-365` (Cheerio), `apps/runner/explore/crawler.py:44-120` (Playwright) | Frontend discovers routes via HTTP scraping; Python BFS crawler with DOM fingerprinting is code-only. | P0 |
| **User Journey & Test-Case Planning** | **PARTIALLY VERIFIED** | `apps/runner/plan/planner.py:25-61`, `apps/frontend/app/api/store.js:534-565` | Template scenarios for ShopLite/Auth exist; dynamic ungrounded step dropping needs live evaluation. | P1 |
| **Browser Action & Assertion DSL** | **CODE-ONLY** | `apps/runner/pipeline/s5_executor.py:40-100`, `apps/runner/plan/dsl.py` | AssertionEvaluator handles `url_matches`, `element_visible`, `no_server_errors`; not executed in standalone mode. | P1 |
| **Screenshot Evidence Pipeline** | **VERIFIED** | `apps/runner/browser/evidence.py:69-80`, `apps/frontend/public/screenshots/` | Screenshots capture full viewport; bounding-box coordinates for defect annotations are currently hardcoded. | P1 |
| **Defect Validation (3× Replay Engine)** | **CODE-ONLY** | `apps/runner/validate/validator.py:24-85` | Python code implements 3× replay with clean context isolation; frontend currently emits simulated replay events. | P0 |
| **Pytest Codegen & Export** | **VERIFIED** | `apps/runner/codegen/test_generator.py:10-65`, `apps/frontend/app/runs/[id]/page.js:2030-2085` | Generates clean, standalone `pytest-playwright` Python test files with 1-click download; independent re-execution in S10 is a stub. | P1 |
| **ShopLite Benchmark & Planted Bugs** | **VERIFIED** | `apps/shoplite/src/index.js:18-30`, `apps/shoplite/verify/` | ShopLite is live on port 3001 with 8 configurable planted bugs (`B1`–`B8`) and working `/test/reset` endpoint. | P0 |
| **GitHub Repository Ingestion** | **NOT IMPLEMENTED** | `apps/frontend/app/api/store.js:163-186` | Only inspects raw GitHub metadata via HTTP; cannot clone, build, launch, or test apps from a repo. | P2 |
| **Execution Sandboxing & Isolation** | **NOT IMPLEMENTED** | `docker-compose.yml:72-74` (`no-new-privileges:true`) | No dynamic ephemeral Docker/microVM sandbox exists to run untrusted code safely. | P2 |
| **Grounded Anomaly Localization** | **PARTIALLY VERIFIED** | `apps/frontend/app/runs/[id]/page.js:1422-1440` | Visual bounding box canvas is implemented in UI, but coordinates are statically declared instead of Playwright-measured. | P1 |

---

## C. Official Stage 2 Compliance Matrix

| Stage 2 Acceptance Criterion | Status | Code Evidence | Missing Behavior & Remaining Gaps | Recommended Action |
| :--- | :--- | :--- | :--- | :--- |
| **1. Input of URL & description** | **VERIFIED** | `apps/frontend/app/page.js:280-320` | None. Target URL, mode (sandbox/read-only), and description input forms are fully operational. | Keep existing UI; wire backend run configuration. |
| **2. Autonomous exploration like real user** | **PARTIALLY VERIFIED** | `apps/frontend/app/api/store.js:289`, `apps/runner/explore/crawler.py:44` | Python runner exploration is verified in code but unexecuted natively due to missing MongoDB/runner process. | Support direct, non-Docker local execution of the Python crawler via SQLite/file-based queue or direct invocation. |
| **3. Test generation for $\ge 1$ key journey** | **VERIFIED** | `apps/frontend/app/runs/[id]/page.js:370-494` | Tests for Sign-Up (`J-03`), Sign-In (`J-04`), CTA conversion (`J-05`), and Form contracts (`J-06`) are generated. | Ensure runner planner generates Playwright scripts for all discovered forms. |
| **4. Detection of $\ge 1$ planted bug** | **VERIFIED** | `apps/shoplite/src/index.js:109-144`, `apps/shoplite/verify/b1.py` | ShopLite B1 (malformed email accepted) and B2 (duplicate email 500) are live, active, and verified. | Connect live runner to assert against ShopLite and capture the failure dynamically. |
| **5. Bug report with steps, expected/actual, SS** | **VERIFIED** | `apps/frontend/app/runs/[id]/page.js:1140-1240` | Report cards feature trigger steps, expected vs. actual behavior, severity badges, and screenshot captures. | Replace static coordinate fallback with actual Playwright element bounding box. |
| **6. Reusable automated tests runnable independently** | **VERIFIED** | `apps/frontend/app/runs/[id]/page.js:2030-2085`, `apps/runner/codegen/test_generator.py` | Generates clean Python `pytest` files with `page.goto()`, `fill()`, and `expect()` assertions that download cleanly. | Implement S10 execution to run `pytest` against the generated file and verify 0 syntax errors. |
| **7. Reproduction of reported bug by following steps** | **VERIFIED** | `apps/shoplite/verify/b1.py`, `b2.py` | B1 and B2 reproduction scripts confirm 100% reproducibility by following the trigger steps. | Keep verification scripts as automated ground-truth checks. |

---

## D. GitHub Repository Testing Gap Analysis

### Step-by-Step Feasibility Audit

| Step | Requirement | Current Status | Findings & Implementation Gap |
| :---: | :--- | :---: | :--- |
| **1** | User supplies public GitHub URL | **VERIFIED** | UI accepts GitHub URLs and pre-populates repository audit prompt. |
| **2** | Safely retrieve repository | **MISSING** | No `git clone --depth 1` mechanism exists. Only fetches raw file URLs via HTTP. |
| **3** | Inspect structure, framework & commands | **PARTIAL** | Inspects `package.json` dependencies via raw HTTP, but does not parse scripts (`build`, `dev`, `start`) or setup instructions. |
| **4** | Determine if runnable web application | **MISSING** | Lacks validation to distinguish deployable web apps from backend libraries, utilities, or CLI tools. |
| **5** | Identify required env variables safely | **MISSING** | Does not parse `.env.example` to detect required configuration without exposing secrets. |
| **6** | Prepare isolated execution environment | **MISSING** | No dynamic ephemeral Docker container or cgroup sandbox is created. |
| **7** | Install dependencies & launch app | **MISSING** | Does not run `npm install --ignore-scripts` or launch processes with resource and time limits. |
| **8** | Check health & identify target URL | **MISSING** | No HTTP readiness polling loop on ephemeral ports (e.g., `3000`–`3100`). |
| **9** | Existing QA engine explores & tests | **MISSING** | Exploration engine has never been connected to a dynamically launched ephemeral container. |
| **10** | Evidence-backed findings & reusable tests | **PARTIAL** | Finding generation works for web targets, but lacks repo-level file context mapping. |

### Smallest Viable Initial Framework Scope
To guarantee safety and high reliability, the first iteration of GitHub repository testing must support **only**:
1. **Node.js Web Applications:** Next.js, Vite (React/Vue), and Express static/SSR apps.
2. **Standard Package Managers:** `npm` and `yarn` (with `--ignore-scripts` enforced).
3. **Explicit Launch Commands:** `npm run dev` or `npm start` with a documented or default port (`3000`, `5173`, `8080`).
4. **Safety Filter:** Reject repos exceeding 150MB, containing binary blobs, or requiring Docker-in-Docker / external database clusters.

### Security Threat Matrix & Mandatory Mitigations
- **Untrusted Build & Package Scripts:** Always pass `--ignore-scripts` during `npm install` to prevent malicious `postinstall` script execution.
- **Arbitrary Code Execution:** Execute app builds inside a dedicated unprivileged container (`USER node`, `read-only rootfs`, `no-new-privileges:true`).
- **Network Egress Attacks (SSRF):** Drop container network capabilities; block access to private subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) and cloud metadata (`169.254.169.254`).
- **Resource Exhaustion (Zip Bombs / Infinite Loops):** Impose hard limits: max 120s clone/install timeout, 512MB RAM cap, 1 CPU core limit.

---

## E. Screenshot and Anomaly-Localization Gap Analysis

### Current Evidence Pipeline
1. **Viewport Captures:** In `apps/runner/browser/evidence.py`, `capture_screenshot()` executes `page.screenshot()`. In `apps/frontend/app/runs/[id]/page.js`, route-specific static captures (`wealthwise-home.png`, `wealthwise-signup.png`, `wealthwise-budget.png`) are mapped to user journeys.
2. **Current Defect Canvas:** The frontend renders a canvas with an overlaid SVG/HTML neon crosshair:
   ```javascript
   style={{
     left: `${f.anomaly_location.x ?? 25}%`,
     top: `${f.anomaly_location.y ?? 35}%`,
     width: `${f.anomaly_location.w ?? 50}%`,
     height: `${f.anomaly_location.h ?? 12}%`,
   }}
   ```
   **The Gap:** `x`, `y`, `w`, and `h` are currently static estimations. They are not measured from live DOM elements during test execution.

### Grounded Anomaly Localization Architecture
To satisfy the requirement that annotations reflect actual browser observations:
1. **Playwright Bounding Box Probe:** When an invariant assertion fails on element selector `sel`:
   ```python
   box = await page.locator(sel).first.bounding_box()
   viewport = page.viewport_size or {"width": 1280, "height": 720}
   anomaly_location = {
       "selector": sel,
       "x": round((box["x"] / viewport["width"]) * 100, 2),
       "y": round((box["y"] / viewport["height"]) * 100, 2),
       "w": round((box["width"] / viewport["width"]) * 100, 2),
       "h": round((box["height"] / viewport["height"]) * 100, 2),
   }
   ```
2. **Distinction Between Observed Facts and AI Hypotheses:**
   - **CONFIRMED DEFECT:** Invariant assertion failed (e.g. HTTP 500, dead link 404, uncaught console exception, or element missing) verified across 3× replays.
   - **SUSPECTED DEFECT:** Layout displacement, low color contrast, or unaligned text suggested by visual evaluation requiring human triage.
   - **ENVIRONMENT FAILURE:** Preflight health probe failed or upstream gateway timed out (labeled `INCONCLUSIVE`).

---

## F. Execution Sandbox Recommendation

### Comparative Evaluation

| Evaluation Criteria | Option A: Dedicated Host Subprocess (`child_process.spawn`) | Option B: Ephemeral Docker Container (`docker run --rm`) | Option C: MicroVM / gVisor (`runsc` / Firecracker) |
| :--- | :--- | :--- | :--- |
| **Isolation Boundary** | Weak (shared filesystem, env vars, and host network). | **Strong** (cgroups, namespaces, isolated virtual network). | **Exceptional** (kernel virtualization boundary). |
| **Security Risk** | High (malicious scripts can read host files or attack localhost). | **Low** (isolated container, drop all capabilities, restricted network). | Near-zero (hardware-assisted kernel isolation). |
| **Operational Complexity**| Very Low (runs everywhere without Docker). | **Medium** (requires Docker daemon; standard for dev & CI). | High (requires Linux bare-metal, KVM access, complex setup). |
| **Egress Network Control**| None (relies on OS firewall rules). | **Easy** (`--network internal` or iptables egress restrictions). | High (requires custom tap devices and virtual switches). |
| **Suitability for Hackathon**| Acceptable only for verified benchmark apps. | **RECOMMENDED FOR PROTOTYPE & STAGE 2** | Over-engineered for 48h prototype; production goal. |

### Architectural Recommendation
**Adopt Option B: Ephemeral Docker Container with Strict Safety Flags:**
- **Launch Command:**
  ```bash
  docker run -d --rm \
    --name "drishti-sandbox-${run_id}" \
    --network drishti-sandbox-net \
    --memory="512m" --cpus="1.0" \
    --security-opt="no-new-privileges:true" \
    --read-only --tmpfs /tmp:rw,noexec,nosuid \
    -v "/tmp/repos/${run_id}:/app:ro" \
    -p "0:3000" \
    drishti-app-runner:node20
  ```
- **Lifecycle Management:** Dedicated Python context manager (`apps/runner/sandbox/docker_manager.py`) that handles pull, build, run, healthcheck, test, and guaranteed cleanup on `finally`.

---

## G. Proposed Implementation Plan

### Phase P0: Required Fixes for a Reliable Stage 2 Demonstration
*Focus: Eliminate dependency on Docker Compose for local evaluation; wire direct execution between frontend, Python runner, and ShopLite.*

- **Task P0.1: Standalone Runner Invocation Engine**
  - **Objective:** Enable the Python runner to execute a single run directly from CLI or API without requiring MongoDB or Docker Compose.
  - **Files:** `apps/runner/main.py`, `apps/runner/pipeline/__init__.py`
  - **Proposed Changes:** Add `run_single_job(target_url, run_id, output_dir)` mode using local JSON files for runs/events instead of MongoDB when `STANDALONE=1`.
  - **Complexity:** Medium | **Risks:** Dual persistence paths.
  - **Acceptance Test:** `python3 apps/runner/main.py --target http://localhost:3001 --standalone` discovers ShopLite, detects B1/B2, and writes `run_report.json`.

- **Task P0.2: Live Execution Bridge in Next.js API**
  - **Objective:** Connect Next.js `/api/runs` to trigger the Python runner process directly when running in native local mode.
  - **Files:** `apps/frontend/app/api/runs/route.js`, `apps/frontend/app/api/store.js`
  - **Proposed Changes:** Spawn Python runner via child process if backend is unreachable; stream events from generated JSON log into `globalStore`.
  - **Complexity:** Medium | **Risks:** Node process management.
  - **Acceptance Test:** Submitting `http://localhost:3001` in the dashboard runs live Playwright Chromium contexts and displays real-time progress.

---

### Phase P1: Grounded Screenshot Capture and Anomaly Localization
*Focus: Replace static bounding box coordinates with real Playwright element coordinates.*

- **Task P1.1: Element Bounding Box Extraction in Failure Validator**
  - **Objective:** Extract exact pixel coordinates and viewport percentages for elements associated with failed invariants.
  - **Files:** `apps/runner/pipeline/s5_executor.py`, `apps/runner/validate/validator.py`
  - **Proposed Changes:** Call `page.locator(target).bounding_box()` on assertion failure; inject `{selector, x, y, w, h}` into finding payload.
  - **Complexity:** Low | **Risks:** Element may detach or scroll offscreen (fallback to viewport center).
  - **Acceptance Test:** B1 finding on ShopLite contains exact coordinates matching the email input field on `/signup`.

- **Task P1.2: Evidence Bundle Screenshot Storage & Serving**
  - **Objective:** Store defect screenshots in persistent `public/artifacts/` with deterministic paths and hashes.
  - **Files:** `apps/runner/browser/evidence.py`, `apps/frontend/app/runs/[id]/page.js`
  - **Proposed Changes:** Ensure screenshot files are copied to frontend static directory so image links never break.
  - **Complexity:** Low | **Risks:** Disk space accumulation.
  - **Acceptance Test:** Clicking defect details card loads the actual captured failure screenshot from disk.

---

### Phase P2: Public GitHub Repository Ingestion & Safe Launch
*Focus: Retrieve public repositories, validate framework, and safely launch in isolated containers.*

- **Task P2.1: Repository Ingestion & Framework Analyzer**
  - **Objective:** Clone public GitHub repositories and inspect `package.json` to verify supported web framework.
  - **Files:** New module: `apps/runner/github/ingest.py`
  - **Proposed Changes:** Implement shallow clone (`git clone --depth 1`) in a sandboxed temp directory; parse framework (`Next.js`, `Vite`, `Express`); reject unsupported repos.
  - **Complexity:** Medium | **Risks:** Large repositories, non-web codebases.
  - **Acceptance Test:** Ingesting `https://github.com/TechWithAkash/agent-qa` detects Next.js framework, port 3000, and `npm run dev` script.

- **Task P2.2: Ephemeral Docker Container Launcher**
  - **Objective:** Launch the application in a hardened, resource-constrained container and wait for HTTP readiness.
  - **Files:** New module: `apps/runner/sandbox/container.py`
  - **Proposed Changes:** Build minimal Docker container runner; execute `npm install --ignore-scripts`; start web server; poll `http://localhost:${PORT}` until healthy.
  - **Complexity:** High | **Risks:** Port conflicts, slow package installs.
  - **Acceptance Test:** Successfully launches a demo Vite/Next app and returns an internal ephemeral URL for testing.

---

### Phase P3: End-to-End Repository QA & Test Replay Verification
*Focus: Run full autonomous testing against the launched repo and verify generated Pytest tests.*

- **Task P3.1: Reusable Pytest Replay Execution (Stage S10)**
  - **Objective:** Execute `pytest -v` against generated tests during S10 to confirm they pass independently.
  - **Files:** `apps/runner/pipeline/__init__.py`
  - **Proposed Changes:** Add `subprocess.run(["pytest", test_file])` in S10; record exit codes and replay verification rates.
  - **Complexity:** Medium | **Risks:** Flaky timing during test replay.
  - **Acceptance Test:** S10 verifies generated test runs independently and returns exit code 0.

---

### Phase P4: Optional Future Enhancements
*Focus: Post-hackathon optimizations.*
- Multi-browser testing (Firefox, WebKit).
- LangGraph multi-agent collaborative planning.
- Vector database embedding search for failure memory across long-term runs.

---

## H. Recommended Execution Order

```
[P0.1: Standalone Runner Engine] ───► [P0.2: Frontend-Runner Bridge]
           │
           ▼
[P1.1: Playwright Bounding Box Localization] ───► [P1.2: Screenshot Evidence Pipeline]
           │
           ▼
[P2.1: GitHub Ingestion & Analyzer] ───► [P2.2: Ephemeral Docker Sandbox]
                                                     │
                                                     ▼
                                      [P3.1: Automated Pytest Replay S10]
```

### Dependency-Aware Staging:
1. **Milestone 1 (P0):** Get the real Python Playwright engine running standalone on the local machine without Docker/MongoDB.
2. **Milestone 2 (P1):** Ground anomaly bounding boxes in live Playwright DOM measurements.
3. **Milestone 3 (P2):** Implement safe GitHub cloning and ephemeral container execution.
4. **Milestone 4 (P3):** Complete the feedback loop by having S10 automatically verify generated Pytest test scripts.

---

## I. Verification Plan

The following test matrix will be executed to verify readiness once implementation begins:

1. **ShopLite Regression Benchmark:** Run autonomous crawler against `http://localhost:3001` with `BUG_SET=all`. Verify detection of B1 (malformed email) and B2 (duplicate email 500) with 100% replay pass rate.
2. **Grounded Bounding Box Check:** Assert that the visual defect coordinates for B1 match the actual bounding box of `input[name="email"]` within $\pm 2$ pixels.
3. **Independent Pytest Re-execution:** Run `pytest -v tests/generated_test_b1.py --headed` from a fresh terminal shell and confirm independent execution.
4. **GitHub Repo Ingestion & Safety Gate:** Pass a public repository URL; verify that `--ignore-scripts` is enforced, network egress to private subnets is blocked, and the application mounts on an isolated ephemeral port.
5. **Teardown & Cleanup:** Confirm that on test completion or abort, all child processes, Docker containers, and temporary clone directories are destroyed.

---

## J. Unresolved Strategic Questions

1. **Local Native vs. Docker Compose Deployment:** Should the primary evaluation setup assume Docker Compose (with MongoDB + FastAPI backend) is running, or should we deliver a lightweight SQLite/direct-process runner so the platform runs anywhere with a single script? *(Recommendation: Support both; prioritize standalone local runner for maximum evaluation reliability).*
2. **Supported GitHub Repository Matrix:** Do you want to restrict GitHub ingestion strictly to Node.js applications (Next.js, Vite, React, Express) for the hackathon demo, or should Python (FastAPI/Flask) web apps also be in scope for Phase 2? *(Recommendation: Restrict to Node.js first).*

---

## Summary & Strict Approval Gate

1. **Top 5 Priorities:**
   - **P0.1:** Standalone Python Playwright runner execution without Docker/MongoDB dependency.
   - **P0.2:** Live bridge between Next.js dashboard and the real Python runner process.
   - **P1.1:** Live DOM element bounding-box measurement for grounded screenshot annotations.
   - **P2.1:** GitHub repository shallow cloning and framework inspection module.
   - **P2.2:** Ephemeral, isolated container sandbox with `--ignore-scripts` enforcement.
2. **Recommended Starting Phase:** **Phase P0 (Standalone Runner Engine & Frontend Bridge)** to ensure the core Playwright QA engine is 100% active and observable before layering on repository sandboxing.
3. **Decisions Requiring Your Input:**
   - Deployment mode preference (standalone direct runner vs. full Docker Compose stack).
   - Approval of the restricted Node.js framework scope for GitHub repository testing.
4. **Compliance Statement:** **No application files, dependencies, databases, or deployment configurations were created or altered during this audit.**
