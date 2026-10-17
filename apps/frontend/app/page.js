"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ShieldCheck,
  Bug,
  Sparkles,
  Layers,
  ArrowRight,
  Terminal,
  Activity,
  CheckCircle2,
  Code2,
  RotateCcw,
  Compass,
  FileCheck,
  Cpu,
  Lock,
} from "lucide-react";

// Dynamically import 3D Hero component with no SSR to ensure WebGL initializes cleanly on client
const Hero3D = dynamic(() => import("./components/Hero3D"), { ssr: false });

const SHOPLITE_DESCRIPTION = `# ShopLite — Application Description & Rules

## Authentication & User Accounts
- Sign-Up:
  - Requires a valid email address containing an @ symbol and a valid domain format.
  - Requires a secure password with a minimum length of 8 characters.
  - Duplicate registration with an already registered email must be rejected with a user-friendly message.
  - Upon successful registration, the user is redirected to the /account dashboard.
- Login:
  - Requires registered email and password.
  - Email addresses are strictly case-insensitive (user@example.com and USER@example.com refer to the same account).
  - Failed logins should display "Invalid email or password".
  - "Forgot password?" link on the login page directs to /forgot-password to allow password recovery.

## Catalog & Search
- Customers can search for items by name or category.
- Search queries ignore leading and trailing whitespace.
- Clicking any product displays the item detail page with full description and quantity selector.

## Shopping Cart & Checkout
- Cart: Product quantities in cart must always be positive integers (minimum quantity: 1).
- Checkout: Accessing checkout with an empty cart displays a prompt instructing the user to add items. Promo coupon SAVE10 provides a 10% discount on cart subtotal and does not stack upon multiple submissions.`;

export default function LandingPage() {
  const router = useRouter();

  // Operation form states
  const [targetUrl, setTargetUrl] = useState("http://localhost:3001");
  const [description, setDescription] = useState(SHOPLITE_DESCRIPTION);
  const [buildLabel, setBuildLabel] = useState("shoplite-planted-b1-b4");
  const [mode, setMode] = useState("sandbox");
  const [attestation, setAttestation] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePreset = (type) => {
    if (type === "shoplite-buggy") {
      setTargetUrl("http://localhost:3001");
      setDescription(SHOPLITE_DESCRIPTION);
      setBuildLabel("shoplite-planted-b1-b4");
      setMode("sandbox");
      setAttestation(true);
      setError(null);
    } else if (type === "shoplite-clean") {
      setTargetUrl("http://localhost:3001");
      setDescription(SHOPLITE_DESCRIPTION);
      setBuildLabel("shoplite-control-clean");
      setMode("sandbox");
      setAttestation(true);
      setError(null);
    } else {
      setTargetUrl("https://example.com");
      setDescription("# Application Rules\n\n- Public landing page with navigation links.");
      setBuildLabel("custom-target-v1");
      setMode("safe");
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
    if (!attestation) {
      setError("Authorization Attestation (SEC-1) must be confirmed to run tests.");
      return;
    }

    setLoading(true);
    setError(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

    try {
      const res = await fetch(`${apiUrl}/runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_url: targetUrl,
          description: description,
          mode: mode,
          build_label: buildLabel,
          authorization: {
            confirmed: true,
            statement: "I own or am authorized to test this target and it is a non-production environment.",
          },
          limits: {
            max_pages: 30,
            max_actions: 150,
            max_scenarios: 25,
            explore_minutes: 10,
          },
          destructive_allowlist: ["Place order", "place-order"],
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
    <div className="relative overflow-hidden w-full">
      {/* Background radial gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-indigo-600/15 via-purple-600/5 to-transparent blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-[800px] -left-48 w-96 h-96 bg-cyan-600/10 blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-[1200px] -right-48 w-96 h-96 bg-indigo-600/10 blur-3xl pointer-events-none -z-10"></div>

      {/* =========================================================================
          HERO SECTION with 3D ELEMENT
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-20 lg:pt-16 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Autonomous AI QA Engineer &bull; Track IM-02</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Autonomous Testing. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400">
                Zero Scripting. Proven Bugs.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              DRISHTI AI autonomously explores your web application, models user journeys, plans grounded scenarios using an Assertion DSL, and validates real defects through <strong>3x clean browser replay</strong>.
            </p>

            {/* Hero CTA buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={scrollToWorkspace}
                className="glow-btn px-7 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>Launch Test Operation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  handlePreset("shoplite-buggy");
                  scrollToWorkspace();
                }}
                className="px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-indigo-500/40 transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md"
              >
                <Bug className="w-4 h-4 text-rose-400" />
                <span>ShopLite Benchmark Preset</span>
              </button>
            </div>

            {/* Quick Metrics Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-lg mx-auto lg:mx-0">
              <div>
                <div className="text-2xl font-black text-white font-mono">100%</div>
                <div className="text-xs text-slate-400 font-medium">B1–B4 Recall</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-400 font-mono">0%</div>
                <div className="text-xs text-slate-400 font-medium">False Positives</div>
              </div>
              <div>
                <div className="text-2xl font-black text-indigo-400 font-mono">3×</div>
                <div className="text-xs text-slate-400 font-medium">Replay Precision</div>
              </div>
            </div>
          </div>

          {/* Right 3D Interactive Element */}
          <div className="lg:col-span-5 relative">
            <Hero3D />
          </div>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE OPERATION WORKSPACE (Where the user performs the operation)
          ========================================================================= */}
      <section id="operation-workspace" className="max-w-7xl mx-auto px-6 py-16 scroll-mt-20">
        <div className="glass-panel-glow p-8 md:p-10 relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Autonomous QA Launchpad
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Configure your target application, define behavioral rules, and trigger the 10-stage testing pipeline.
              </p>
            </div>

            {/* Preset Selector Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Presets:</span>
              <button
                type="button"
                onClick={() => handlePreset("shoplite-buggy")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  buildLabel === "shoplite-planted-b1-b4"
                    ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/30"
                    : "bg-slate-900/60 text-slate-300 border-white/10 hover:border-white/20"
                }`}
              >
                ShopLite (B1–B4 Bugs)
              </button>
              <button
                type="button"
                onClick={() => handlePreset("shoplite-clean")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  buildLabel === "shoplite-control-clean"
                    ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/30"
                    : "bg-slate-900/60 text-slate-300 border-white/10 hover:border-white/20"
                }`}
              >
                Control Build (Clean)
              </button>
              <button
                type="button"
                onClick={() => handlePreset("custom")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  buildLabel === "custom-target-v1"
                    ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/30"
                    : "bg-slate-900/60 text-slate-300 border-white/10 hover:border-white/20"
                }`}
              >
                Custom URL
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-sm flex items-center gap-3">
                <span className="text-lg">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8 space-y-2">
                <label htmlFor="target-url" className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Target Application URL</span>
                </label>
                <input
                  id="target-url"
                  type="url"
                  required
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="http://localhost:3001"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="md:col-span-4 space-y-2">
                <label htmlFor="build-label" className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Build Tag / Artifact Label</span>
                </label>
                <input
                  id="build-label"
                  type="text"
                  value={buildLabel}
                  onChange={(e) => setBuildLabel(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="mode-select" className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Execution Sandbox Mode</span>
                </label>
                <select
                  id="mode-select"
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
                >
                  <option value="sandbox">Sandbox Mode (Exploration, Synthetic Mutations, Reversible Actions)</option>
                  <option value="safe">Safe Mode (Read-Only Navigation Only)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Destructive Action Allowlist</span>
                </label>
                <input
                  type="text"
                  disabled
                  value="Place order (Simulated non-production payment)"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 text-slate-400 text-sm cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="target-description" className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <FileCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Application Rules & Constraints (Ground Truth Knowledge)</span>
                </label>
                <span className="text-xs text-slate-500 font-mono">{description.length} chars</span>
              </div>
              <textarea
                id="target-description"
                rows={9}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-slate-950/80 border border-white/10 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500 transition-all leading-relaxed"
              />
            </div>

            {/* SEC-1 Authorization Checkbox */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 flex items-start gap-3.5">
              <input
                id="attestation-check"
                type="checkbox"
                checked={attestation}
                onChange={(e) => setAttestation(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-white/20 bg-slate-900 cursor-pointer"
              />
              <label htmlFor="attestation-check" className="text-xs text-slate-300 leading-relaxed cursor-pointer select-none">
                <strong className="text-white">Authorization Attestation (SEC-1 Required):</strong> I confirm that I am authorized to test this target URL and that this run operates in a controlled non-production environment.
              </label>
            </div>

            {/* Submit Action Bar */}
            <div className="pt-3 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-slate-400 flex items-center gap-2 font-mono">
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Chromium Engine: Ready &bull; Isolated Contexts: Ready</span>
              </div>

              <button
                type="submit"
                id="start-run-btn"
                disabled={loading}
                className="glow-btn px-9 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2.5 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Initializing Pipeline S1...</span>
                  </>
                ) : (
                  <>
                    <span>🚀 Launch Autonomous QA Run</span>
                    <ArrowRight className="w-4 h-4" />
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
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">
            Engineered for Precision & Zero Flakiness
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Unlike generative agents that hallucinate clicks or brittle crawler scripts, DRISHTI AI combines deterministic graph exploration with grounded assertion planning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-7 hover:border-indigo-500/40 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">1. Deterministic Frontier Crawler (S2)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explores routes and forms with state fingerprinting and template capping. It constructs an Application Model without hallucinated paths.
            </p>
          </div>

          <div className="glass-panel p-7 hover:border-indigo-500/40 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-110 transition-transform">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">2. 3× Replay Verification (S6)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every failure must reproduce across 3 consecutive fresh browser contexts with before-and-after environment probes before earning <strong>confirmed</strong> status.
            </p>
          </div>

          <div className="glass-panel p-7 hover:border-indigo-500/40 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">3. Pytest Regression Codegen (S9)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Translates verified bug journeys and key paths into standalone, runnable <code>pytest-playwright</code> test scripts that integrate into CI pipelines.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BENCHMARK PROOF BANNER (ShopLite Ground Truth)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-6 py-12 mb-16">
        <div className="glass-panel p-8 bg-gradient-to-r from-indigo-950/30 via-slate-900/60 to-purple-950/30 border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-xs font-bold font-mono uppercase text-indigo-400 tracking-wider">
              Verification Scorecard
            </span>
            <h3 className="text-xl font-bold text-white">
              ShopLite Benchmark: 100% Stage 2 Gate Met
            </h3>
            <p className="text-xs text-slate-400 max-w-xl">
              All 4 planted defects (B1 Malformed Email, B2 500 Duplicate Error, B3 Case-Sensitive Login, B4 Forgot Password 404) are verified independently.
            </p>
          </div>

          <Link
            href="/benchmarks"
            className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center gap-2 whitespace-nowrap shadow-lg shadow-indigo-600/30"
          >
            <span>View Full Scorecard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
