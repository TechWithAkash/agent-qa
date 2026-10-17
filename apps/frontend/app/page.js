"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
- Checkout: Accessing checkout with an empty cart displays a prompt instructing the user to add items. Promo coupon SAVE10 provides a 10% discount on cart subtotal and does not stack.`;

export default function StartRunPage() {
  const router = useRouter();
  const [targetUrl, setTargetUrl] = useState("http://localhost:3001");
  const [description, setDescription] = useState(SHOPLITE_DESCRIPTION);
  const [buildLabel, setBuildLabel] = useState("shoplite-dev-v1");
  const [mode, setMode] = useState("sandbox");
  const [attestation, setAttestation] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePresetShopLite = () => {
    setTargetUrl("http://localhost:3001");
    setDescription(SHOPLITE_DESCRIPTION);
    setBuildLabel("shoplite-planted-b1-b4");
    setMode("sandbox");
    setAttestation(true);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!attestation) {
      setError("You must confirm authorization before initiating a test run.");
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
    <div className="max-w-5xl mx-auto px-6 py-12 w-full">
      {/* Hero header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
          Autonomous QA Testing Pipeline
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
          Explore. Plan. Replay. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Verify.</span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
          DRISHTI AI autonomously explores your web application, builds an interaction model, formulates grounded test scenarios, validates failures via 3x replay, and outputs regression tests.
        </p>
      </div>

      {/* Preset Banner */}
      <div className="glass-panel p-4 mb-8 flex items-center justify-between border-indigo-500/30 bg-indigo-950/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xl">
            🎯
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Quick Benchmark Target: ShopLite</h3>
            <p className="text-xs text-slate-400">Pre-configured with ground-truth planted defects B1–B4 (IM-02 Stage 2).</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handlePresetShopLite}
          id="btn-preset-shoplite"
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 transition-colors"
        >
          Load ShopLite Target
        </button>
      </div>

      {/* Main Configuration Form */}
      <div className="glass-panel p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="target-url" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Target Web Application URL
              </label>
              <input
                id="target-url"
                type="url"
                required
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="http://localhost:3001"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900/90 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="build-label" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Build Tag / Label
              </label>
              <input
                id="build-label"
                type="text"
                value={buildLabel}
                onChange={(e) => setBuildLabel(e.target.value)}
                placeholder="v1.0.0-rc1"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900/90 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="mode-select" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Execution Mode
              </label>
              <select
                id="mode-select"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900/90 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="sandbox">Sandbox (Full Exploration, Mutations, Synthetic Accounts)</option>
                <option value="safe">Safe Mode (Read-Only Navigation Only)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Destructive Allowlist
              </label>
              <input
                type="text"
                disabled
                value="Place order (Fake checkout allowlisted)"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900/40 border border-white/5 text-slate-400 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="target-description" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Application Rules & Description (Ground Truth Context)
              </label>
              <span className="text-xs text-slate-500">{description.length} characters</span>
            </div>
            <textarea
              id="target-description"
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the application features, login rules, constraints, etc..."
              className="w-full px-4 py-3 rounded-lg bg-slate-900/90 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Authorization Attestation Checkbox (SEC-1) */}
          <div className="p-4 rounded-lg bg-slate-900/60 border border-white/5 flex items-start gap-3">
            <input
              id="attestation-check"
              type="checkbox"
              checked={attestation}
              onChange={(e) => setAttestation(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-white/20 bg-slate-800"
            />
            <label htmlFor="attestation-check" className="text-xs text-slate-300 leading-relaxed cursor-pointer">
              <strong className="text-white">Authorization Attestation (SEC-1):</strong> I confirm that I own or am authorized to test this target application and that this execution runs in a controlled non-production environment.
            </label>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              id="start-run-btn"
              disabled={loading}
              className="glow-btn px-8 py-3 rounded-lg text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Initiating Run...
                </>
              ) : (
                <>
                  <span>🚀</span> Launch Autonomous QA Run
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
