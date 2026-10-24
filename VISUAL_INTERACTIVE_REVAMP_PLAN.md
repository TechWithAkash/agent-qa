# DRISHTI AI — Visual & Interactive Revamp Plan
## Eliminating Text-Heavy Overhead & Maximizing Visual Clarity

> **Guiding Principle**: Less unnecessary text, more meaningful visuals, more useful interactions, zero compromise on functionality.

---

## 1. Audit: Identified Text-Heavy Patterns

| Screen / Area | Current Text-Heavy Pattern | Visual & Interactive Replacement |
| :--- | :--- | :--- |
| **`/dashboard`** | 4 KPI cards each contain multi-line explanatory paragraphs below the numbers. | **Visual Gauge Meters & Sparklines**: Circular progress ring for Quality (88%), segmented defect severity bar, 0.0% flakiness guarantee badge. |
| **`/dashboard`** | Target preset cards have raw text descriptions and lack direct actions. | **Direct-Action Target Cards**: Favicons, live latency tags, and **1-click "▶ Run Test"** button directly on card. |
| **`/dashboard`** | Recent runs table shows duplicate text pills and lacks quick actions. | **Interactive Data Rows**: Segmented pass/fail mini-bars, clickable defect badges, 1-click Re-run and Copy ID buttons. |
| **`/dashboard`** | Agent topology at bottom consists of 7 static grey boxes. | **Interactive Connected Flow Rail**: Animated connecting line, agent status pulses, click-to-inspect trigger. |
| **`/runs/[id]`** | Executive verdict header contains multi-sentence paragraphs. | **Visual Verdict Matrix**: 3-badge bottom-line (Verdict, Impact, Next Step) with progressive disclosure drawer. |
| **`/runs`** | Test runs list relies on text descriptions. | **Interactive Run Deck**: Status filter pills with live counts, pass/fail visual bar, quick action popovers. |
| **`/analytics`** | Defect categories displayed as static HTML tables. | **Interactive SVG Donut & Bar Visualizations**: Visual defect density chart and journey reliability bars. |
| **`/settings`** | Paragraph descriptions for each persona mode. | **Interactive Visual Cards**: Icon badges, feature checklists, and instant toast feedback. |

---

## 2. Interactive Component Specifications

### 2.1 Visual Metrics Bar (`MetricGaugeCard`)
- Replaces explanatory paragraphs with:
  - Circular SVG progress meter (Quality %)
  - Segmented color-coded defect bar (Critical / Warning / Clean)
  - Interactive hover tooltips for secondary technical detail

### 2.2 Direct-Action Preset Launcher
- Each target card (`WealthWise`, `Padmora`, `ShopLite`) features:
  - Target emblem/globe with live status dot
  - Target URL with 1-click external link
  - **Direct "▶ Launch 3× Audit" button** that executes `POST /api/runs` and transitions straight to the live swarm modal!

### 2.3 Interactive Data Table (`RunsTable`)
- Each row contains:
  - Copyable Run ID with feedback tooltip
  - Visual 8-step journey bar (7 green, 1 amber)
  - Quick action buttons: "Re-run", "View Report"

---

## 3. Implementation Sequence

1. **Dashboard (`/dashboard`)**: Implement visual SVG gauges, segmented defect bars, direct-action cards, and interactive topology.
2. **Runs Repository (`/runs`)**: Add visual status filters, journey pass/fail mini-bars, and 1-click run actions.
3. **Run Console (`/runs/[id]`)**: Streamline executive header with visual verdict matrix and progressive disclosure.
4. **Analytics (`/analytics`)**: Add interactive SVG donut chart and journey reliability bar charts.
5. **Settings (`/settings`)**: Streamline into visual cards with instant feedback.
6. **Lint & Verification**: Confirm `0 errors` and fast compilation.
