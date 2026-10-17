"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Bug,
  Sparkles,
  ArrowRight,
  Activity,
  Code2,
  RotateCcw,
  Compass,
  FileCheck,
  Globe,
  Sliders,
  Play,
  AlertTriangle,
} from "lucide-react";
import TechnicalVisualization from "./components/TechnicalVisualization";

const DEFAULT_RULES = `# Behavioral Rules & Ground Truth Constraints

- Navigation: Root URL and all discovered internal links must resolve with HTTP 200 OK.
- Form Inputs: Input fields must enforce format validation (emails, URLs, required attributes).
- Interactive Controls: Buttons and links must dispatch handlers without uncaught exceptions.
- Security: Application must serve traffic over HTTPS with appropriate security headers.`;

export default function LandingPage() {
  const router = useRouter();

  // Primary operation form state
  const [targetUrl, setTargetUrl] = useState("https://designrip.in");
  const [description, setDescription] = useState(DEFAULT_RULES);
  const [mode, setMode] = useState("sandbox");
  const [attestation, setAttestation] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePreset = (type) => {
    if (type === "designrip") {
      setTargetUrl("https://designrip.in");
      setDescription(DEFAULT_RULES);
      setMode("sandbox");
      setAttestation(true);
      setError(null);
    } else if (type === "shoplite") {
      setTargetUrl("http://localhost:3001");
      setDescription(`# ShopLite Ground-Truth Benchmark Rules
- Sign-up: Malformed emails must be rejected; duplicate emails must return user-friendly message.
- Login: Case-insensitive email authentication; forgot password link must not 404.`);
      setMode("sandbox");
      setAttestation(true);
      setError(null);
    } else {
      setTargetUrl("");
      setDescription(DEFAULT_RULES);
      setMode("sandbox");
      setAttestation(true);
      setError(null);
    }
  };

  const scrollToWorkspace = () => {
    const el = document.getElementById("operation-workspace");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetUrl.trim()) {
      setError("Please enter a valid website URL to test.");
      return;
    }
    if (!attestation) {
      setError("Authorization Attestation (SEC-1) must be confirmed to run tests.");
      return;
    }

    setLoading(true);
    setError(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

    try {
      const res = await fetch(`${apiUrl}/runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_url: targetUrl.trim(),
          description: description,
          mode: mode,
          authorization: {
            confirmed: true,
            statement: "I own or am authorized to test this target and it is a non-production environment.",
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || data.error?.message || "Failed to create run");
      }

      const data = await res.json();
      router.push(`/runs/${data.run_id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* =========================================================================
          HERO SECTION with TECHNICAL VISUALIZATION
          ========================================================================= */}
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-16 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Hero Content */}
          <div className="space-y-6 text-center lg:col-span-7 lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-semibold text-indigo-400">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
              <span>Autonomous AI QA Platform &bull; Track IM-02</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl leading-[1.08]">
              Autonomous Testing. <br />
              <span className="text-indigo-400">
                Zero Scripting. Proven Bugs.
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-base font-normal leading-relaxed text-[var(--text-secondary)] sm:text-lg lg:mx-0">
              DRISHTI AI autonomously explores any web application, models real user journeys, plans grounded scenarios with an Assertion DSL, and validates defects through <strong>3&times; clean browser replay</strong>.
            </p>

            {/* Hero CTA buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 lg:justify-start">
              <button
                onClick={scrollToWorkspace}
                className="btn-primary flex items-center gap-2 px-6 py-3 text-sm cursor-pointer"
              >
                <span>Launch QA Operation</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => {
                  handlePreset("designrip");
                  scrollToWorkspace();
                }}
                className="btn-secondary flex items-center gap-2 px-5 py-3 text-sm cursor-pointer"
              >
                <Globe className="h-4 w-4 text-indigo-400" />
                <span>Test Live Web App</span>
              </button>
            </div>

            {/* Clean Platform Highlights */}
            <div className="grid max-w-lg grid-cols-3 gap-6 pt-6 border-t border-[var(--border-subtle)] mx-auto lg:mx-0 text-left">
              <div>
                <div className="text-sm font-bold text-[var(--text-primary)]">Full Exploration</div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">Routes, forms, buttons</div>
              </div>
              <div>
                <div className="text-sm font-bold text-emerald-400">Zero Flakiness</div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">3&times; clean replay proof</div>
              </div>
              <div>
                <div className="text-sm font-bold text-indigo-400">CI / CD Ready</div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">Pytest test codegen</div>
              </div>
            </div>
          </div>

          {/* Right Technical Visualization */}
          <div className="lg:col-span-5 relative w-full">
            <TechnicalVisualization />
          </div>
        </div>
      </section>

      {/* =========================================================================
          AUTONOMOUS QA LAUNCHPAD (Primary Clean Workspace)
          ========================================================================= */}
      <section id="operation-workspace" className="mx-auto max-w-7xl px-6 py-10 scroll-mt-20">
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-8 shadow-xl md:p-10">
          {/* Header & Presets */}
          <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-subtle)] pb-6 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                  Autonomous QA Launchpad
                </h2>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                Enter any website URL to autonomously explore, model user journeys, and detect real defects.
              </p>
            </div>

            {/* Presets Segmented Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[var(--text-muted)] mr-1 hidden sm:inline">Presets:</span>
              <button
                type="button"
                onClick={() => handlePreset("designrip")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
                  targetUrl === "https://designrip.in"
                    ? "border-indigo-500/50 bg-indigo-600/20 text-indigo-300"
                    : "border-[var(--border-subtle)] bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Live App (designrip.in)
              </button>
              <button
                type="button"
                onClick={() => handlePreset("custom")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
                  targetUrl === "" || targetUrl === "https://example.com"
                    ? "border-indigo-500/50 bg-indigo-600/20 text-indigo-300"
                    : "border-[var(--border-subtle)] bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                New Custom URL
              </button>
              <button
                type="button"
                onClick={() => handlePreset("shoplite")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
                  targetUrl.includes("3001")
                    ? "border-indigo-500/50 bg-indigo-600/20 text-indigo-300"
                    : "border-[var(--border-subtle)] bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                ShopLite Benchmark (Local)
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
              <div className="flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
                <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Target URL & Execution Mode */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
              <div className="space-y-2 md:col-span-8">
                <label
                  htmlFor="target-url"
                  className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[var(--text-secondary)] uppercase"
                >
                  <Globe className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Target Application URL</span>
                </label>
                <input
                  id="target-url"
                  type="url"
                  required
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://your-website.com"
                  className="input-base"
                />
              </div>

              <div className="space-y-2 md:col-span-4">
                <label
                  htmlFor="mode-select"
                  className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[var(--text-secondary)] uppercase"
                >
                  <Sliders className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Execution Mode</span>
                </label>
                <select
                  id="mode-select"
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="input-base text-xs"
                >
                  <option value="sandbox">Sandbox Mode (Exploration & Actions)</option>
                  <option value="safe">Safe Mode (Read-Only Navigation)</option>
                </select>
              </div>
            </div>

            {/* Application Rules & Constraints Textarea */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="target-description"
                  className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[var(--text-secondary)] uppercase"
                >
                  <FileCheck className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Testing Guidelines & Behavioral Expectations</span>
                </label>
                <span className="font-mono text-xs text-[var(--text-muted)]">
                  {description.length} chars
                </span>
              </div>
              <textarea
                id="target-description"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-base font-mono text-xs leading-relaxed"
                placeholder="Enter rules, invariants, or expected flows..."
              />
            </div>

            {/* SEC-1 Authorization Checkbox */}
            <div className="flex items-start gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-secondary)]/50 p-4">
              <input
                id="attestation-check"
                type="checkbox"
                checked={attestation}
                onChange={(e) => setAttestation(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[var(--border-strong)] bg-[var(--surface-tertiary)] text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <label
                htmlFor="attestation-check"
                className="text-xs leading-relaxed text-[var(--text-secondary)] cursor-pointer select-none"
              >
                <strong className="text-[var(--text-primary)]">Authorization Attestation (SEC-1 Required):</strong> I confirm that I am authorized to test this target URL and that this run operates in a controlled non-production environment.
              </label>
            </div>

            {/* Submit Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[var(--border-subtle)]">
              <div className="flex items-center gap-2 font-mono text-xs text-[var(--text-muted)]">
                <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
                <span>Chromium Engine: Ready &bull; Isolated Contexts: Ready</span>
              </div>

              <button
                type="submit"
                id="start-run-btn"
                disabled={loading}
                className="btn-primary flex items-center gap-2 px-7 py-3 text-sm cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                    <span>Initializing Pipeline S1...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current" />
                    <span>Launch Autonomous QA Run</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* =========================================================================
          FEATURE PILLARS: WHY DRISHTI IS DIFFERENT
          ========================================================================= */}
      <section className="mx-auto max-w-7xl px-6 py-16 border-t border-[var(--border-subtle)]">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl mb-3">
            Engineered for Precision & Zero Flakiness
          </h2>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed sm:text-sm">
            Deterministic state graph exploration combined with grounded assertion planning.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6 transition-all hover:border-[var(--border-strong)]">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
              <Compass className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2">
              1. Deterministic Frontier Crawler
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Explores routes, links, and forms with DOM fingerprinting. Maps actual interactive elements without hallucinated paths.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6 transition-all hover:border-[var(--border-strong)]">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
              <RotateCcw className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2">
              2. 3&times; Replay Verification
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Every failure must reproduce across 3 consecutive fresh browser contexts before being confirmed, eliminating false alarms.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6 transition-all hover:border-[var(--border-strong)]">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
              <Code2 className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2">
              3. Pytest Regression Codegen
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Translates verified user journeys into standalone, runnable <code>pytest-playwright</code> test scripts that integrate directly into CI/CD.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BENCHMARK PROOF BANNER
          ========================================================================= */}
      <section className="mx-auto max-w-7xl px-6 py-8 mb-12">
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/20 via-[var(--surface-primary)] to-[var(--surface-primary)] p-7 md:flex-row">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Standardized Benchmark Evaluation
            </h3>
            <p className="max-w-xl text-xs text-[var(--text-secondary)]">
              Evaluated against standardized planted defect benchmarks with ground-truth verification.
            </p>
          </div>

          <Link
            href="/benchmarks"
            className="btn-primary flex items-center gap-2 px-4 py-2 text-xs font-semibold whitespace-nowrap"
          >
            <span>View Benchmark Scorecard</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
