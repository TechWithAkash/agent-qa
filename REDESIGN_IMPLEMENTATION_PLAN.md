# DRISHTI AI — Landing Page & Authentication Redesign Specification
## Inspired by Simulithic Design Language & Premium Autonomous QA Architecture

> **Document Type:** Dedicated Implementation Plan & Design System Specification  
> **Status:** Approved Architecture & Ready for Phased Execution  
> **Target Workspaces:** `apps/frontend` (`app/page.js`, `app/login/page.js`, `app/register/page.js`, `app/components/*`, `app/globals.css`)  
> **Core Objective:** Elevate DRISHTI AI's landing page, login page, and signup page into a world-class, production-ready SaaS product experience inspired by [Simulithic](https://www.simulithic.com/)—featuring clean minimalism, generous whitespace, monochromatic typography, electric blue accents, and custom isometric product graphics—while preserving 100% of existing QA run execution, authentication, and API integrations.

---

## 1. Executive Summary & Design Philosophy

### The Simulithic Design Philosophy
The reference design represents the pinnacle of modern developer/enterprise SaaS aesthetics (seen in platforms like Simulithic, Linear, and Vercel):
- **Ultra-clean, high-density clarity:** Pure white canvas (`#FFFFFF`) or subtle canvas (`#FAFAFA`), paired with fine slate hairline borders (`#E2E8F0` / `#E5E7EB`) and soft micro-drop shadows.
- **Editorial Typography & Generous Whitespace:** Tight letter-spacing (`tracking-tight`), crisp headings (`#09090b`), muted secondary text (`#64748b`), and dramatic vertical spacing (`py-24` to `py-32`).
- **Signature Electric Blue Accents:** High-contrast royal blue (`#0066FF` / `#2563EB` / `#0284C7`) used intentionally for primary CTAs, active status nodes, and visual conduits.
- **Isometric Vector Product Art:** Rather than generic illustrations or stock screenshots, the interface employs custom isometric 3D wireframe line-art depicting devices (laptops, phones, servers), test flows, and execution pipelines on a perspective matrix grid.

### DRISHTI Product Alignment
DRISHTI is an **Autonomous AI QA Engineer** that navigates web apps, discovers routes, executes 3× deterministic replays to eliminate flakiness, and generates standalone Pytest-Playwright suites. The redesign bridges high-end visual elegance with real engineering depth:
1. Retains all live execution capabilities (Launchpad, preset targets like WealthWise, Padmora, ShopLite, custom URLs, and direct API submission to `/api/runs`).
2. Preserves the full authentication system (`localStorage` persistence, 1-Click "Paras" evaluator demo, role switching between PM, Dev, and QA).
3. Replaces disparate visual elements with a cohesive, polished design system.

---

## 2. Audit of Existing Application & Gap Analysis

| Aspect | Current State in Codebase | Target State (Redesign) | Retain / Redesign / Remove |
| :--- | :--- | :--- | :--- |
| **Color Palette** | Mix of warm cream (`#FAFAF9`), orange (`#F97316`), and dark gray (`#171717`). Inconsistent button styles across components. | Unified Simulithic palette: Pure white/slate canvas, sharp slate borders (`#E2E8F0`), deep obsidian text (`#09090b`), and electric royal blue (`#2563EB` / `#0066FF`). | **Redesign** design tokens in `globals.css`. |
| **Hero Section** | Asymmetric 2-column with a dense interactive demo on right. High visual weight, lacks breathing room. | Expansive, centered headline: *"End-to-end tests that write themselves."* with dual CTAs and a multi-device isometric line-art illustration featuring laptops, tablets, and phones on a 30° perspective grid. | **Redesign** into editorial hero + custom isometric SVG device matrix. |
| **Problem Statement** | Bulleted points in hero. | High-impact 3-line editorial transition section: *"Writing every test takes time. Describing every flow takes foresight. Prod breaks on the one you missed."* | **Redesign** into dedicated typographic section with generous whitespace. |
| **Feature 1: Flow Mapping** | Buried in technical cards. | *"Map every flow with one command"* featuring terminal command pill (`npx drishti test <url>`) + isometric application core distributing flow nodes. | **Redesign** with custom isometric cluster graphic. |
| **Feature 2: Multi-Environment** | Generic text description. | *"Every environment, verified."* featuring dual isometric device cards (Desktop + Mobile) with verified flow tags. | **Redesign** with dual isometric cards. |
| **Feature 3: CI/CD Pipeline** | Dense tabular view. | *"Runs wherever you ship."* featuring step-by-step workflow (PRs, Scheduled Audits, Webhooks) + isometric infrastructure conduit. | **Redesign** with alternating layout. |
| **Feature 4: Test Reports** | Tabbed raw code. | *"Know what broke before you merge."* featuring high-fidelity test results preview card with 3× replay status and Pytest export. | **Redesign** with clean inspection card. |
| **Interactive Launchpad** | Present, but styling is heavy. | Restyled into a sleek, modern, high-precision test launchpad integrated smoothly into the page flow. | **Retain all functionality & Redesign UI.** |
| **Login Page** | Basic form with orange accents. Functional 1-click Paras demo login. | Minimalist split/centered layout with subtle isometric background grid, blue accents, refined inputs, and preserved 1-click demo login. | **Retain all auth logic & Redesign UI.** |
| **Signup Page** | Basic multi-input form. | Consistent auth styling, pre-fill option, clear role selection, and polished validation states. | **Retain all registration logic & Redesign UI.** |
| **Navigation & Footer** | Functional with persona switcher. Contains 1 ESLint effect warning in Navbar. | Minimalist header with clean links, glowing status, persona switcher, and prominent blue CTA; clean footer with receding grid. | **Fix lint bug & Polish visual style.** |

---

## 3. Design System & Token Architecture

### 3.1 Color Palette
```css
/* Base Canvas & Surfaces */
--bg-canvas: #FFFFFF;
--bg-subtle: #F8FAFC;
--bg-card: #FFFFFF;
--bg-card-hover: #F8FAFC;

/* Borders & Hairlines */
--border-subtle: #E2E8F0;
--border-medium: #CBD5E1;
--border-focus: #2563EB;

/* Monochromatic Typography */
--text-primary: #0F172A;     /* Deep slate / obsidian */
--text-secondary: #475569;   /* Slate 600 */
--text-muted: #94A3B8;       /* Slate 400 */

/* Brand & Functional Accents */
--accent-blue: #0066FF;      /* Simulithic electric royal blue */
--accent-blue-hover: #0052CC;
--accent-blue-subtle: rgba(0, 102, 255, 0.08);
--accent-blue-border: rgba(0, 102, 255, 0.25);

--badge-yc: #F97316;         /* Orange YC accent */
--status-success: #10B981;   /* Emerald 500 */
--status-warning: #F59E0B;   /* Amber 500 */
--status-error: #EF4444;     /* Rose 500 */
```

### 3.2 Typography Scale
- **Display 1 (Hero Title):** `text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.035em] leading-[1.08]`
- **Display 2 (Section Title):** `text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] leading-[1.12]`
- **Body Large:** `text-base sm:text-lg text-slate-600 leading-relaxed font-normal`
- **Body Small:** `text-xs sm:text-sm text-slate-500 leading-normal`
- **Code / Mono:** `font-mono text-xs text-slate-700 tracking-tight`

### 3.3 Isometric Vector Graphics Engine
We construct pure, crisp, scalable SVG isometric components using consistent 30° projection:
- **`IsometricHeroDevices`**: Multi-device isometric array (Laptop with open screen showing route tree, second laptop, tablet, and mobile phones, with glowing agent node and connecting perspective grid lines).
- **`IsometricFlowCluster`**: Central DRISHTI hub dispatching test routes to an array of isometric journey nodes with animated pulse indicators.
- **`IsometricEnvironmentCards`**: Desktop & mobile viewports floating on isometric acrylic pedestals.
- **`IsometricPipeline`**: Stepwise CI/CD build runner with glowing test execution path.

---

## 4. Landing Page Structure & User Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. Minimal Navigation Bar                                              │
│    Brand Mark [D] DRISHTI AI | Features | How it Works | Benchmarks    │
│    Role Switcher [PM | Dev | QA] | Docs ↗ | [Sign In] [Launch a Run]   │
├────────────────────────────────────────────────────────────────────────┤
│ 2. Hero Section                                                        │
│    - Badge: "Backed by Autonomous Quality Engineering" / Spec Pill     │
│    - Title: "End-to-end tests that write themselves."                  │
│    - Subtitle: "Powered by autonomous agents that explore, verify,     │
│                and generate regression suites without manual scripts." │
│    - CTA Row: [Start Testing Free (Blue)] [Explore Interactive Demo]   │
│    - Device Selectors: iOS • Android • macOS • Windows • Linux         │
│    - Custom Isometric Hero Devices Line-Art Illustration               │
├────────────────────────────────────────────────────────────────────────┤
│ 3. Problem Statement & Reality Check                                   │
│    "Writing every test takes time.                                     │
│     Describing every flow takes foresight.                             │
│     Prod breaks on the one you missed."                                │
├────────────────────────────────────────────────────────────────────────┤
│ 4. Feature 1: "Map every flow with one command"                        │
│    - Terminal command pill: `npx drishti test https://your-app.com`    │
│    - Isometric Application Core distributing user journey nodes        │
├────────────────────────────────────────────────────────────────────────┤
│ 5. Feature 2: "Every environment, verified."                           │
│    - Subtitle: Cross-device, cross-viewport, multi-network stability   │
│    - Dual Isometric Cards: Web Desktop Viewport & Mobile Viewport      │
├────────────────────────────────────────────────────────────────────────┤
│ 6. Feature 3: "Runs wherever you ship."                                │
│    - Left: 3-step timeline (PR & Commit CI, Scheduled Audits, Slack)   │
│    - Right: Isometric Runner & Infrastructure conduit                  │
├────────────────────────────────────────────────────────────────────────┤
│ 7. Feature 4: "Know what broke before you merge."                      │
│    - High-fidelity interactive test report preview card with live tabs │
│      (Defects, 3× Clean Replay proof, Pytest Code, Network Traces)     │
├────────────────────────────────────────────────────────────────────────┤
│ 8. Interactive Launchpad (Core Engine Workspace)                       │
│    - Target URL input, Presets (WealthWise, Padmora, ShopLite, GitHub) │
│    - Quality Goal Packs, Instant API Run dispatch                      │
├────────────────────────────────────────────────────────────────────────┤
│ 9. Benchmark & Proof Section (ShopLite Standardized Suite)             │
│    - 100% bug detection, 0% flakiness, 100% clean Pytest codegen      │
├────────────────────────────────────────────────────────────────────────┤
│ 10. Closing Final Call to Action                                       │
│     "Deploy autonomous QA across your stack in 60 seconds."            │
│     [Launch a QA Run] [View GitHub Docs ↗]                             │
├────────────────────────────────────────────────────────────────────────┤
│ 11. Minimalist Footer                                                  │
│     Logo, system status, legal links, receding isometric grid line     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Login & Signup Page Redesign Specification

### 5.1 Shared Architecture
- **Canvas:** Crisp white background with an ambient isometric perspective grid background (`opacity-40`).
- **Card Container:** Floating `max-w-md` card with `rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 p-8`.
- **Top Brand Mark:** Centered DRISHTI logo badge with electric blue glow.
- **Form Controls:**
  - Modern floating or clearly labeled inputs with subtle slate border `#E2E8F0`.
  - Electric blue focus state: `focus:border-blue-600 focus:ring-2 focus:ring-blue-100`.
  - Password visibility toggle (Eye/EyeOff icon).
  - Validation feedback (emerald green for valid, rose red for error).
- **1-Click Evaluator Access:**
  - Preserved prominently with a refined, high-trust badge design ("1-Click Evaluator Access as Paras — Staff QA Architect").
  - Instant demo authentication without manual typing for judges and reviewers.
- **Security Trust Badges:**
  - "TLS 1.3 End-to-End Encryption" • "Zero-Knowledge Local Storage".

---

## 6. Implementation Phases & Milestones

### Phase 1: Design Tokens & Base Styling Setup
- Update `apps/frontend/app/globals.css` with Simulithic design tokens: pure white canvas, slate hairlines, electric blue accents, isometric grid pattern utilities.
- Fix ESLint warning in `apps/frontend/app/components/Navbar.js` (`setMounted` in `useEffect`).

### Phase 2: Isometric SVG Components Library
- Create `apps/frontend/app/components/isometric/IsometricHeroDevices.js`: Bespoke SVG isometric illustration with laptop, tablet, mobile phones, server diamond, perspective grid, and subtle CSS pulse animation.
- Create `apps/frontend/app/components/isometric/IsometricFlowCluster.js`: Isometric flow mapping diagram with central hub and peripheral journey cards.
- Create `apps/frontend/app/components/isometric/IsometricEnvironmentCards.js`: Dual isometric cards for desktop and mobile verification.
- Create `apps/frontend/app/components/isometric/IsometricPipeline.js`: Multi-layered CI/CD infrastructure diagram.

### Phase 3: Landing Page Component Overhaul
- Update `apps/frontend/app/page.js`:
  - New minimalist hero with device toggle tabs and `IsometricHeroDevices`.
  - Typographic problem statement section.
  - Alternating feature sections (Flow mapping, Environments, CI/CD pipeline, Test report preview).
  - Refined Launchpad integration preserving all form handling and `/api/runs` dispatch.
  - Upgraded Final CTA and Footer.

### Phase 4: Login & Signup Pages Redesign
- Redesign `apps/frontend/app/login/page.js`:
  - Pure white card, ambient isometric grid, electric blue buttons, 1-Click Paras login, password toggle, complete error/success states.
- Redesign `apps/frontend/app/register/page.js`:
  - Consistent layout, role selection, 1-click pre-fill, full validation.

### Phase 5: Motion, Polish & Validation
- Refine hover states, smooth transitions, focus rings, and mobile responsiveness across 320px, 768px, 1024px, 1440px.
- Run `npm run lint` and verify zero errors.
- Confirm full end-to-end functionality of all buttons, forms, presets, and auth state sync.

---

## 7. Acceptance Criteria
1. **Visual Fidelity:** Landing page matches the Simulithic aesthetic—clean, minimalist, generous whitespace, monochromatic typography, electric blue accents, and custom isometric illustrations.
2. **Functional Integrity:** Preserves 100% of existing functionality: Launchpad URL submission, presets (WealthWise, Padmora, ShopLite, GitHub), API run creation, results navigation, role switching (PM, Dev, QA).
3. **Authentication Parity:** Login and Register work seamlessly with `localStorage` user persistence, 1-click demo login, password toggle, and cross-tab event synchronization.
4. **Code Quality:** Zero ESLint errors, clean component separation, responsive design on mobile and desktop, accessible contrast (WCAG AA).
