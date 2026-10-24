# DRISHTI AI — Agent-Generated Outputs UI/UX Redesign Specification
## Solving Cognitive Overload & Delivering Persona-Driven, Actionable Results

> **Status:** Actionable Implementation Plan  
> **Target Files:**  
> - `apps/frontend/app/components/results/AuditSummaryHeader.js`  
> - `apps/frontend/app/components/results/DefectsTab.js`  
> - `apps/frontend/app/components/results/JourneysTab.js`  
> - `apps/frontend/app/components/results/PytestTab.js`  
> - `apps/frontend/app/components/results/AiToolsTab.js`  
> - `apps/frontend/app/runs/[id]/page.js`  
> **Key Constraint:** 100% Frontend Only — Zero modifications to backend APIs, schemas, or agent execution.

---

## 1. Problem Statement & Hackathon Mentor Feedback

During the Round 1 hackathon mentoring review, judges praised DRISHTI's autonomous crawling, 3× replay flakiness elimination, and multi-agent coordination. However, they delivered critical feedback on the presentation layer:
1. **Wall of Text & Cognitive Overload:** Raw technical descriptions, DOM selectors, and assertion DSL contracts are displayed front-and-center, overwhelming non-technical reviewers and product managers.
2. **Missing Executive Bottom-Line:** Reviewers must hunt through multiple tabs to answer the basic business question: *"Can this release be safely shipped to production, and what breaks customer revenue?"*
3. **Generic vs. Personalized Experience:** A PM, QA Lead, and Frontend Dev see identical raw logs. Information is not tailored to their context and decision-making needs.
4. **Lack of Actionable Next Steps:** The UI tells users that a test failed, but does not clearly articulate **What broke**, **Why it matters**, and **How to fix it**.

---

## 2. Redesign Architecture & Design Principles

### Principle 1: 3-Second Executive Verdict (Outcome First)
Replace intimidating technical alert banners with a clear, calm **Executive Health Scorecard**:
- High-visibility **Release Verdict Pill** (`READY TO SHIP` / `RELEASE BLOCKED` / `AUDIT WARNINGS`).
- Circular SVG **Quality Health Gauge** showing pass rate percentage.
- **Top 3 Actionable Takeaways**: Clear bullet points highlighting the exact business impact and required fixes.

### Principle 2: Role-Based Personalization (PM • Dev • QA)
- **PM Mode (Executive / Product)**:
  - Focuses on customer journey impact, conversion friction, and plain-English risk assessments.
  - Hides code, stack traces, and CSS selectors by default.
- **Dev Mode (Engineering)**:
  - Surfaces exact DOM locators, failing HTTP payloads, stack traces, and 1-click reproduction code.
- **QA Mode (Quality & Automation)**:
  - Emphasizes assertion contracts, 3× isolated replay stability, flakiness statistics, and pytest coverage.

### Principle 3: "What • Why • Fix" Defect Cards (Progressive Disclosure)
Every detected defect card is structured into 3 clear, digestible tiers:
1. **Header & Severity:** Clean title, affected user flow, route tag, and severity badge.
2. **The 3 Core Answers:**
   - 🚨 **What Broke:** 1 clear sentence describing the observed bug.
   - 💼 **Why It Matters:** Business/customer impact (e.g. "Prevents users from completing signup").
   - 🛠️ **How to Fix:** Actionable developer guidance with recommended fix.
3. **Expandable Developer Drawer:** Raw DOM selectors, HTTP responses, and Playwright reproduction scripts available on click.

### Principle 4: Visual Storytelling & Clean Metrics
- Journey flow visualizer showing step-by-step progress cards.
- Visual side-by-side screenshots with red anomaly bounding boxes.
- Clean tabs matching the Simulithic theme (pure white canvas, `#e6e9ee` borders, electric blue accents).

---

## 3. Phased Implementation Roadmap

- **Phase 1: Executive Summary Header (`AuditSummaryHeader.js`)**
  - Implement Circular Quality Gauge, Verdict Pill, Persona-tailored summary, and Actionable Control Bar.
- **Phase 2: Defects & Observations Layer (`DefectsTab.js`)**
  - Transform defect cards into the "What • Why • Fix" scannable format with progressive disclosure for deep technical details.
- **Phase 3: Audited User Journeys Layer (`JourneysTab.js`)**
  - Enhance journey cards with plain-English user stories, step visualizers, and expandable code.
- **Phase 4: CI/CD & AI QA Tools (`PytestTab.js` & `AiToolsTab.js`)**
  - Modernize Pytest codegen with GitHub Actions & Docker tabs; upgrade Self-Healing interactive assistant.
- **Phase 5: Verification & End-to-End Validation**
  - Run lint checks, verify compilation, and test all persona views and responsive breakpoints.
