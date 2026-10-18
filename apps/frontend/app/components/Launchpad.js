"use client";

import { useState } from "react";
import {
  Globe,
  Play,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Terminal,
  Activity,
  CheckCircle2,
  LockKeyhole,
  Sliders,
  ExternalLink,
} from "lucide-react";

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
  const [maxConcurrency, setMaxConcurrency] = useState(3);
  const [replayAttempts, setReplayAttempts] = useState(3);
  const [viewportWidth, setViewportWidth] = useState(1280);

  return (
    <section id="operation-workspace" className="py-20 lg:py-28 bg-[#FAFAF9] border-t border-[#E5E5E5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-white text-[#737373] border border-[#E5E5E5] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Autonomous QA Launchpad</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#171717] tracking-tight">
            Start testing your application.
          </h2>
          <p className="mt-3 text-base text-[#737373] leading-relaxed">
            Provide a target URL and behavioral guidelines. DRISHTI will explore the application, model core user journeys, validate failures through 3× clean replay, and export a pytest regression suite.
          </p>
        </div>

        {/* Workspace Form Card */}
        <form
          onSubmit={onSubmit}
          className="bg-white border border-[#E5E5E5] rounded-xl shadow-xs overflow-hidden"
        >
          {/* Target Preset Picker Bar */}
          <div className="p-4 sm:p-5 border-b border-[#E5E5E5] bg-[#FAFAF9]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#171717]">Preset Target:</span>
              <span className="text-xs text-[#737373]">Select a validated benchmark or custom URL</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {PRESET_TARGETS.map((p) => {
                const isSelected = activePreset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onPresetSelect(p.id)}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                      isSelected
                        ? "bg-[#171717] text-white shadow-2xs"
                        : "bg-white text-[#525252] border border-[#E5E5E5] hover:bg-[#F5F5F4] hover:text-[#171717]"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Body: 2 Columns */}
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Target & Testing Guidelines (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Target URL Input */}
              <div>
                <label
                  htmlFor="target-url"
                  className="block text-xs font-semibold text-[#171717] mb-2 uppercase tracking-wider font-mono"
                >
                  Target Web URL or GitHub Repository
                </label>
                <div className="relative rounded-lg border border-[#E5E5E5] bg-white shadow-2xs focus-within:border-[#171717] focus-within:ring-1 focus-within:ring-[#171717]/10 transition-all">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A3A3A3]">
                    <Globe className="w-4 h-4 text-[#737373]" />
                  </div>
                  <input
                    id="target-url"
                    type="text"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://your-staging-app.com"
                    className="block w-full pl-10 pr-4 py-2.5 text-xs text-[#171717] placeholder-[#A3A3A3] focus:outline-none bg-transparent"
                    required
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-[#737373]">
                  Chromium headless engine will initiate deterministic DOM frontier exploration on this URL.
                </p>
              </div>

              {/* Testing Guidelines & Expectations */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="target-description"
                    className="block text-xs font-semibold text-[#171717] uppercase tracking-wider font-mono"
                  >
                    Testing Guidelines & Behavioral Expectations
                  </label>
                  <span className="text-[11px] font-mono text-[#A3A3A3]">
                    {description.length} chars
                  </span>
                </div>
                <textarea
                  id="target-description"
                  rows={8}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe critical user journeys, validation rules, HTTP response expectations..."
                  className="block w-full p-3.5 text-xs text-[#171717] border border-[#E5E5E5] rounded-lg shadow-2xs focus:border-[#171717] focus:ring-1 focus:ring-[#171717]/10 focus:outline-none font-mono leading-relaxed"
                />
                <p className="mt-1.5 text-[11px] text-[#737373]">
                  DRISHTI parses these rules into Assertion DSL contracts to verify form validations, HTTP status codes, and deterministic routing.
                </p>
              </div>

              {/* Collapsible Advanced Settings */}
              <div className="pt-2 border-t border-[#E5E5E5]">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-1.5 text-xs font-medium text-[#737373] hover:text-[#171717] transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#F97316]" />
                  <span>Advanced Engine Parameters</span>
                  {showAdvanced ? (
                    <ChevronUp className="w-3 h-3 text-[#A3A3A3]" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-[#A3A3A3]" />
                  )}
                </button>

                {showAdvanced && (
                  <div className="mt-4 p-4 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#171717] mb-1">
                        Replay Isolation Count
                      </label>
                      <input
                        type="number"
                        min="2"
                        max="5"
                        value={replayAttempts}
                        onChange={(e) => setReplayAttempts(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs border border-[#E5E5E5] rounded bg-white"
                      />
                      <span className="text-[10px] text-[#A3A3A3] mt-0.5 block">Default 3× fresh contexts</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#171717] mb-1">
                        Crawl Concurrency
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="6"
                        value={maxConcurrency}
                        onChange={(e) => setMaxConcurrency(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs border border-[#E5E5E5] rounded bg-white"
                      />
                      <span className="text-[10px] text-[#A3A3A3] mt-0.5 block">Parallel headless workers</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#171717] mb-1">
                        Viewport Width
                      </label>
                      <input
                        type="number"
                        min="375"
                        max="1920"
                        step="10"
                        value={viewportWidth}
                        onChange={(e) => setViewportWidth(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs border border-[#E5E5E5] rounded bg-white"
                      />
                      <span className="text-[10px] text-[#A3A3A3] mt-0.5 block">1280px standard desktop</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Execution Mode, Attestation & Launch (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6 lg:border-l lg:border-[#E5E5E5] lg:pl-8">
              <div className="space-y-6">
                {/* Execution Mode Selector */}
                <div>
                  <label
                    htmlFor="mode-select"
                    className="block text-xs font-semibold text-[#171717] mb-2 uppercase tracking-wider font-mono"
                  >
                    Execution Safety Mode
                  </label>
                  <select
                    id="mode-select"
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="block w-full px-3 py-2.5 text-xs text-[#171717] border border-[#E5E5E5] rounded-lg shadow-2xs focus:border-[#171717] focus:outline-none bg-white font-medium"
                  >
                    <option value="sandbox">Sandbox Mode (Exploration & Non-Destructive Actions)</option>
                    <option value="safe_exploration">Safe Exploration (Read-Only Navigation & Form Probing)</option>
                  </select>
                  <p className="mt-1.5 text-[11px] text-[#737373]">
                    {mode === "sandbox"
                      ? "Allows autonomous exploration, form validation boundary probing, and deterministic replay in isolated sandboxes."
                      : "Strictly limits autonomous agent actions to GET requests, navigation, and passive DOM inspection."}
                  </p>
                </div>

                {/* Authorization Attestation Row (SEC-1 Required) */}
                <div className="p-4 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                  <label
                    htmlFor="attestation-check"
                    className="flex items-start gap-2.5 cursor-pointer text-xs"
                  >
                    <input
                      id="attestation-check"
                      type="checkbox"
                      checked={attestation}
                      onChange={(e) => setAttestation(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-[#D4D4D4] text-[#171717] focus:ring-[#171717]"
                    />
                    <div>
                      <span className="font-semibold text-[#171717] block">
                        Authorization Attestation (SEC-1 Required)
                      </span>
                      <span className="text-[#737373] text-[11px] mt-0.5 block leading-relaxed">
                        I confirm that I own or am explicitly authorized to test this target URL, and that this test run operates in a controlled non-production or staging environment.
                      </span>
                    </div>
                  </label>
                </div>

                {/* Engine Telemetry Readiness Checklist */}
                <div className="p-3.5 bg-white border border-[#E5E5E5] rounded-lg text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-[#F5F5F4] text-[#737373]">
                    <span className="font-semibold text-[#171717]">Engine Environment Readiness</span>
                    <span className="font-mono text-emerald-700">Ready</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#525252]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Chromium Browser Sandboxes
                    </span>
                    <span className="font-mono text-[#737373]">v1.50 Headless</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#525252]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Isolated Replay Contexts
                    </span>
                    <span className="font-mono text-[#737373]">Enabled (3×)</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#525252]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Pytest Codegen Emitter
                    </span>
                    <span className="font-mono text-[#737373]">Active</span>
                  </div>
                </div>

                {/* Error Banner if any */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                    <div>
                      <span className="font-semibold block">Execution Blocked</span>
                      <span>{error}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Primary Action Button */}
              <div className="pt-4 border-t border-[#E5E5E5]">
                <button
                  id="start-run-btn"
                  type="submit"
                  disabled={loading || !attestation}
                  className={`w-full py-3.5 px-6 rounded-lg text-xs font-semibold tracking-tight transition-all flex items-center justify-center gap-2 shadow-xs ${
                    loading || !attestation
                      ? "bg-[#E5E5E5] text-[#A3A3A3] cursor-not-allowed"
                      : "bg-[#171717] text-white hover:bg-black active:scale-[0.99]"
                  }`}
                >
                  {loading ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin text-[#F97316]" />
                      <span>Initializing Autonomous Session...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current text-[#F97316]" />
                      <span>Launch Autonomous QA Run</span>
                    </>
                  )}
                </button>
                <div className="mt-2 text-center text-[11px] text-[#A3A3A3]">
                  Submits to FastAPI /api/runs &bull; Redirects to live telemetry dashboard
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
