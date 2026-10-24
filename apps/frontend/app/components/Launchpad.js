"use client";

import { useState } from "react";
import {
  Globe,
  Play,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  LockKeyhole,
  Sliders,
  Sparkles,
  Check,
  Compass,
  ShoppingCart,
  Lock,
  FileCode2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export const PRESET_TARGETS = [
  {
    id: "wealthwise",
    label: "WealthWise Live App",
    url: "https://www.mywealthwise.in",
    description: `# WealthWise Ground-Truth Autonomous QA Rules

- Sign-up Flow: Navigation to /auth/signup must render registration inputs; malformed emails rejected with 400.
- Login Portal: Authentication at /auth/signin must support case-insensitive emails; forgot password link must resolve 200 OK.
- Financial Dashboard: Budget and Expense tracking tabs must update dashboard metrics deterministically.`,
    mode: "sandbox",
  },
  {
    id: "padmora",
    label: "Padmora Sarees",
    url: "https://padmorasarees.com/",
    description: `# Padmora Sarees Ground-Truth Autonomous QA Rules
- Storefront Availability: Root URL and Mohar collection banner must resolve HTTP 200 OK without unhandled load errors.
- Headline & Branding: Main H1 "Padmora Sarees by Yashi | Handloom" rendered with proper contrast and DOM hierarchy.
- Product Weaves: Interactive category filters (Maheshwari, Banarasi, Narayanpet, Paithani) and "Every saree, one place" collections.
- Media & Video: "Sarees in Motion" video players and customer care footer links must not throw unhandled exceptions.`,
    mode: "sandbox",
  },
  {
    id: "designrip",
    label: "DesignRip.in",
    url: "https://designrip.in",
    description: `# Behavioral Rules & Ground Truth Constraints

- Navigation: Root URL and all discovered internal links must resolve with HTTP 200 OK.
- Form Inputs: Input fields must enforce format validation (emails, URLs, required attributes).
- Interactive Controls: Buttons and links must dispatch handlers without uncaught exceptions.
- Security: Application must serve traffic over HTTPS with appropriate security headers.`,
    mode: "sandbox",
  },
  {
    id: "shoplite",
    label: "ShopLite (Benchmark)",
    url: "http://localhost:3001",
    description: `# ShopLite Ground-Truth Benchmark Rules
- Sign-up: Malformed emails must be rejected; duplicate emails must return user-friendly message.
- Login: Case-insensitive email authentication; forgot password link must not 404.`,
    mode: "sandbox",
  },
  {
    id: "github",
    label: "GitHub Repository",
    url: "https://github.com/TechWithAkash/agent-qa",
    description: `# GitHub Repository Audit Rules
- Codebase Analysis: Discover routes, interactive components, forms, and dependencies.
- Frontend Invariants: Verify build entrypoint, manifest, and accessible DOM anchors.
- Security Policies: Inspect secrets leakage, CSP configuration, and package vulnerabilities.`,
    mode: "sandbox",
  },
  {
    id: "custom",
    label: "Custom Target",
    url: "",
    description: `# Behavioral Rules & Ground Truth Constraints

- Navigation: Root URL and all discovered internal links must resolve with HTTP 200 OK.
- Form Inputs: Input fields must enforce format validation (emails, URLs, required attributes).
- Interactive Controls: Buttons and links must dispatch handlers without uncaught exceptions.
- Security: Application must serve traffic over HTTPS with appropriate security headers.`,
    mode: "sandbox",
  },
];

export const QUALITY_GOAL_PACKS = [
  {
    id: "nav",
    icon: Compass,
    label: "Navigation & Routing",
    tag: "Core",
    desc: "Crawl routes, verify HTTP 200, detect broken links",
    rules: "- Navigation: Root URL and all discovered internal links must resolve with HTTP 200 OK without dead links.",
  },
  {
    id: "auth",
    icon: Lock,
    label: "Auth & Gateways",
    tag: "Critical",
    desc: "Validate sign-up forms, login, and password recovery",
    rules: "- Authentication: /auth/signup must reject malformed emails with 400; /auth/signin must authenticate case-insensitive; forgot password must not 404.",
  },
  {
    id: "forms",
    icon: CheckCircle2,
    label: "Form Boundaries",
    tag: "UX",
    desc: "Audit required fields, input sanitization, error states",
    rules: "- Form Inputs: Required fields must prevent submission with user-visible errors; inputs must sanitize boundary characters.",
  },
  {
    id: "security",
    icon: ShieldCheck,
    label: "Security & Invariants",
    tag: "Security",
    desc: "Enforce CSP, nosniff, zero console exceptions",
    rules: "- Security Invariants: Validate HTTPS encryption, Content-Security-Policy headers, and ensure 0 unhandled browser runtime console errors.",
  },
  {
    id: "ecommerce",
    icon: ShoppingCart,
    label: "Checkout Funnel",
    tag: "Funnel",
    desc: "Check product catalog, cart count, checkout triggers",
    rules: "- E-Commerce: Product catalog must load images, add-to-cart must increment quantity, and checkout must trigger order flow.",
  },
];

export default function Launchpad({
  targetUrl,
  setTargetUrl,
  description,
  setDescription,
  mode,
  setMode,
  attestation,
  setAttestation,
  loading,
  error,
  onSubmit,
  onPresetSelect,
  activePreset,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showRuleEditor, setShowRuleEditor] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState(["nav", "auth", "forms", "security"]);
  const [maxConcurrency, setMaxConcurrency] = useState(3);
  const [replayAttempts, setReplayAttempts] = useState(3);
  const [viewportWidth, setViewportWidth] = useState(1280);
  const [authEnabled, setAuthEnabled] = useState(true);
  const [authEmail, setAuthEmail] = useState("demo@mywealthwise.in");
  const [authPassword, setAuthPassword] = useState("DemoUser2026!QA");

  const handleToggleGoal = (goalId) => {
    let nextGoals;
    if (selectedGoals.includes(goalId)) {
      nextGoals = selectedGoals.filter((g) => g !== goalId);
    } else {
      nextGoals = [...selectedGoals, goalId];
    }
    setSelectedGoals(nextGoals);

    const combinedRules = nextGoals
      .map((id) => QUALITY_GOAL_PACKS.find((p) => p.id === id)?.rules)
      .filter(Boolean)
      .join("\n");

    const header = `# Ground-Truth Behavioral Rules for ${targetUrl || "Target Web Application"}\n\n`;
    setDescription(header + combinedRules);
  };

  const isHttps = targetUrl.startsWith("https://");
  const isLocalhost = targetUrl.includes("localhost") || targetUrl.includes("127.0.0.1");

  return (
    <section id="operation-workspace" className="py-20 lg:py-28 bg-white border-t border-[#e6e9ee]">
      <div className="mx-auto max-w-[980px] px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="subtle" className="mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2D9FFE] animate-pulse" />
            <span>Autonomous QA Launchpad</span>
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#000000] tracking-tight">
            Launch an autonomous audit in seconds.
          </h2>
          <p className="mt-3 text-sm text-[#525252] leading-relaxed">
            Provide a target URL and choose your testing goals. DRISHTI explores your application, models real user journeys, and verifies regressions across 3× fresh browser replays.
          </p>
        </div>

        {/* Workspace Form Card */}
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-[#e6e9ee] bg-white shadow-xs overflow-hidden"
        >
          {/* Target Preset Picker Bar */}
          <div className="p-4 sm:p-5 border-b border-[#e6e9ee] bg-[#f8fafc] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#000000]">
                Target Presets:
              </span>
              <span className="text-xs text-[#737373] hidden sm:inline">
                Staging environments &amp; benchmarks
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {PRESET_TARGETS.map((p) => {
                const isSelected = activePreset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onPresetSelect(p.id)}
                    className={`px-3 py-1 text-xs rounded-full font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-[#000000] text-white shadow-2xs font-semibold"
                        : "bg-white text-[#525252] border border-[#e6e9ee] hover:bg-[#fafafa] hover:text-[#000000]"
                    }`}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#2D9FFE]" />}
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Body: 2 Columns */}
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Target & Goal Packs (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Target URL Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="target-url"
                    className="block text-xs font-semibold text-[#000000]"
                  >
                    Target Application URL
                  </label>
                  {targetUrl && (
                    <span className="text-[11px] font-mono flex items-center gap-1">
                      {isHttps ? (
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>HTTPS Secure</span>
                        </span>
                      ) : isLocalhost ? (
                        <span className="text-[#0b7ee6] bg-[#2D9FFE]/10 border border-[#2D9FFE]/20 px-2 py-0.5 rounded-full font-medium">
                          Localhost
                        </span>
                      ) : (
                        <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>HTTP</span>
                        </span>
                      )}
                    </span>
                  )}
                </div>
                <div className="relative rounded-[9px] border border-[#e6e9ee] bg-white shadow-2xs focus-within:border-[#2D9FFE] focus-within:ring-2 focus-within:ring-[#2D9FFE]/15 transition-all">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#737373]">
                    <Globe className="w-4 h-4 text-[#2D9FFE]" />
                  </div>
                  <input
                    id="target-url"
                    type="url"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://your-staging-app.com"
                    className="block w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#000000] placeholder-[#a3a3a3] focus:outline-hidden bg-transparent font-sans"
                    required
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-[#737373]">
                  Playwright Chromium agents will autonomously explore navigation, DOM anchors, and forms.
                </p>
              </div>

              {/* 1-Click Quality Goals Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#2D9FFE]" />
                    <span className="text-xs font-semibold text-[#000000]">
                      Quality Goals
                    </span>
                  </div>
                  <span className="text-[11px] text-[#737373]">
                    {selectedGoals.length} of {QUALITY_GOAL_PACKS.length} active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {QUALITY_GOAL_PACKS.map((g) => {
                    const isChecked = selectedGoals.includes(g.id);
                    return (
                      <div
                        key={g.id}
                        onClick={() => handleToggleGoal(g.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                          isChecked
                            ? "bg-white border-[#2D9FFE] shadow-2xs ring-1 ring-[#2D9FFE]/20"
                            : "bg-[#f8fafc] border-[#e6e9ee] hover:bg-white hover:border-[#cbd5e1]"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                            isChecked
                              ? "bg-[#2D9FFE] text-white"
                              : "border border-[#cbd5e1] bg-white"
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-medium text-[#000000] truncate">
                              {g.label}
                            </span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#f0f0f0] text-[#525252]">
                              {g.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#737373] mt-0.5 line-clamp-1 leading-normal">
                            {g.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Progressive Disclosure: Custom Rule Editor Drawer */}
              <div className="pt-2 border-t border-[#e6e9ee]">
                <button
                  type="button"
                  onClick={() => setShowRuleEditor(!showRuleEditor)}
                  className="flex items-center justify-between w-full py-1 text-xs font-medium text-[#525252] hover:text-[#000000] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <FileCode2 className="w-3.5 h-3.5 text-[#2D9FFE]" />
                    <span>View / Customize Invariant Rules</span>
                  </span>
                  <span className="text-[11px] font-mono text-[#a3a3a3] flex items-center gap-1">
                    {showRuleEditor ? "Collapse" : "Expand"}
                    {showRuleEditor ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </span>
                </button>

                {showRuleEditor && (
                  <div className="mt-3 space-y-2 animate-in fade-in duration-150">
                    <textarea
                      id="target-description"
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Custom invariants, status expectations, and edge-cases..."
                      className="block w-full p-3 text-xs text-[#000000] border border-[#e6e9ee] rounded-xl shadow-2xs focus:border-[#2D9FFE] focus:ring-1 focus:ring-[#2D9FFE]/20 focus:outline-hidden font-mono leading-relaxed bg-[#f8fafc]"
                    />
                  </div>
                )}
              </div>

              {/* Collapsible Advanced Parameters */}
              <div className="pt-2 border-t border-[#e6e9ee]">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-1.5 text-xs font-medium text-[#737373] hover:text-[#000000] transition-colors cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#2D9FFE]" />
                  <span>Advanced Parameters (Concurrency &amp; Replay)</span>
                  {showAdvanced ? (
                    <ChevronUp className="w-3 h-3 text-[#a3a3a3]" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-[#a3a3a3]" />
                  )}
                </button>

                {showAdvanced && (
                  <div className="mt-3 p-4 rounded-xl bg-[#f8fafc] border border-[#e6e9ee] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs animate-in fade-in duration-150">
                    <div>
                      <label className="block text-[11px] font-medium text-[#000000] mb-1">
                        Replay Iterations
                      </label>
                      <input
                        type="number"
                        min="2"
                        max="5"
                        value={replayAttempts}
                        onChange={(e) => setReplayAttempts(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs border border-[#e6e9ee] rounded-lg bg-white"
                      />
                      <span className="text-[10px] text-[#737373] mt-0.5 block">3× fresh contexts</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[#000000] mb-1">
                        Concurrency
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="6"
                        value={maxConcurrency}
                        onChange={(e) => setMaxConcurrency(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs border border-[#e6e9ee] rounded-lg bg-white"
                      />
                      <span className="text-[10px] text-[#737373] mt-0.5 block">Parallel headless workers</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[#000000] mb-1">
                        Viewport Width
                      </label>
                      <input
                        type="number"
                        min="375"
                        max="1920"
                        step="10"
                        value={viewportWidth}
                        onChange={(e) => setViewportWidth(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs border border-[#e6e9ee] rounded-lg bg-white"
                      />
                      <span className="text-[10px] text-[#737373] mt-0.5 block">1280px Desktop default</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Execution Safety, Auth Crawl & Launch (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6 lg:border-l lg:border-[#e6e9ee] lg:pl-8">
              <div className="space-y-6">
                {/* Execution Safety Mode Selector */}
                <div>
                  <label
                    htmlFor="mode-select"
                    className="block text-xs font-semibold text-[#000000] mb-2"
                  >
                    Execution Safety Mode
                  </label>
                  <select
                    id="mode-select"
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="block w-full px-3 py-2 text-xs text-[#000000] border border-[#e6e9ee] rounded-[9px] shadow-2xs focus:border-[#2D9FFE] focus:outline-hidden bg-white font-medium cursor-pointer"
                  >
                    <option value="sandbox">Sandbox Mode (Exploration &amp; Non-Destructive Actions)</option>
                    <option value="safe_exploration">Safe Exploration (Passive DOM Inspection &amp; Read-Only)</option>
                  </select>
                </div>

                {/* Authenticated Application Crawl */}
                <div className="p-4 rounded-xl border border-[#e6e9ee] bg-[#f8fafc] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#000000]">
                      <LockKeyhole className="w-3.5 h-3.5 text-[#2D9FFE]" />
                      <span>Audit Behind Login</span>
                    </label>
                    <input
                      type="checkbox"
                      checked={authEnabled}
                      onChange={(e) => setAuthEnabled(e.target.checked)}
                      className="rounded border-[#cbd5e1] text-[#2D9FFE] focus:ring-0 cursor-pointer"
                    />
                  </div>

                  {authEnabled && (
                    <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                        <input
                          type="text"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          placeholder="Test Email"
                          className="px-2.5 py-1.5 rounded-lg border border-[#e6e9ee] bg-white text-zinc-900 text-xs"
                        />
                        <input
                          type="password"
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          placeholder="Password"
                          className="px-2.5 py-1.5 rounded-lg border border-[#e6e9ee] bg-white text-zinc-900 text-xs"
                        />
                      </div>
                      <span className="text-[10px] text-emerald-700 font-mono block">
                        ✓ Pre-seeded for WealthWise &amp; ShopLite targets
                      </span>
                    </div>
                  )}
                </div>

                {/* Friendly Target Authorization Confirmation */}
                <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e6e9ee]">
                  <label
                    htmlFor="attestation-check"
                    className="flex items-start gap-2.5 cursor-pointer text-xs select-none"
                  >
                    <input
                      id="attestation-check"
                      type="checkbox"
                      checked={attestation}
                      onChange={(e) => setAttestation(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-[#cbd5e1] text-[#2D9FFE] focus:ring-[#2D9FFE] cursor-pointer"
                    />
                    <div>
                      <span className="font-medium text-[#000000] flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Authorized Testing Confirmation</span>
                      </span>
                      <span className="text-[#737373] text-[11px] mt-0.5 block leading-relaxed">
                        I confirm I am authorized to test this target in a non-destructive sandbox.
                      </span>
                    </div>
                  </label>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              {/* Primary Action Button */}
              <div className="pt-4 border-t border-[#e6e9ee]">
                <Button
                  id="start-run-btn"
                  type="submit"
                  disabled={loading || !attestation}
                  size="lg"
                  className="w-full text-xs sm:text-sm font-semibold shadow-xs"
                >
                  {loading ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin text-white" />
                      <span>Initializing Autonomous Session...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current text-white" />
                      <span>Launch Autonomous QA Run</span>
                    </>
                  )}
                </Button>
                <div className="mt-2 text-center text-[11px] text-[#737373]">
                  Submits to FastAPI /api/runs &bull; Redirects to live audit dashboard
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
