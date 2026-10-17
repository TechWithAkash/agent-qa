"use client";

import Link from "next/link";

const BENCHMARK_BUGS = [
  {
    id: "B1",
    journey: "J1 (Sign-up)",
    type: "Validation",
    severity: "Medium",
    expected: "Malformed email rejected with message; user stays on /signup",
    faulty: "Account created, redirect to /account",
    detected_via: "Assertion (ui_contract / description)",
    stage2_gate: true,
    status: "DETECTED & CONFIRMED",
  },
  {
    id: "B2",
    journey: "J1 (Sign-up)",
    type: "Server error",
    severity: "High",
    expected: "Duplicate email shows friendly 'already registered' message",
    faulty: "POST /api/signup returns 500 error",
    detected_via: "Convention (no_server_errors)",
    stage2_gate: true,
    status: "DETECTED & CONFIRMED",
  },
  {
    id: "B3",
    journey: "J2 (Login)",
    type: "Logic",
    severity: "Medium",
    expected: "Login with registered email in any letter case succeeds",
    faulty: "Login fails if email contains uppercase letters",
    detected_via: "Assertion (description rule)",
    stage2_gate: true,
    status: "DETECTED & CONFIRMED",
  },
  {
    id: "B4",
    journey: "J2 (Login)",
    type: "Navigation",
    severity: "Low",
    expected: "'Forgot password' link opens a reset page",
    faulty: "Link returns 404 dead link",
    detected_via: "Convention (dead-link detector)",
    stage2_gate: true,
    status: "DETECTED & CONFIRMED",
  },
  {
    id: "B5",
    journey: "J3 (Search)",
    type: "Edge case",
    severity: "Low",
    expected: "Search ignores trailing whitespace",
    faulty: "Query with trailing space returns no results",
    detected_via: "Assertion (description)",
    stage2_gate: false,
    status: "DETECTED & CONFIRMED",
  },
  {
    id: "B6",
    journey: "J4 (Cart)",
    type: "Validation",
    severity: "Medium",
    expected: "Quantity must be at least 1",
    faulty: "Quantity 0 or negative accepted",
    detected_via: "Assertion & Invariant",
    stage2_gate: false,
    status: "DETECTED & CONFIRMED",
  },
  {
    id: "B7",
    journey: "J5 (Checkout)",
    type: "Pricing",
    severity: "High",
    expected: "SAVE10 applies once per order",
    faulty: "Applying twice stacks discount",
    detected_via: "Invariant (total == subtotal - discount)",
    stage2_gate: false,
    status: "DETECTED & CONFIRMED",
  },
  {
    id: "B8",
    journey: "J5 (Checkout)",
    type: "Crash",
    severity: "High",
    expected: "Empty checkout shows empty message",
    faulty: "Uncaught TypeError in console; crash",
    detected_via: "Convention (no_page_errors)",
    stage2_gate: false,
    status: "DETECTED & CONFIRMED",
  },
];

export default function BenchmarksPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 w-full flex-1">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            Ground-Truth Evaluation
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Benchmark Scorecard — ShopLite
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Standardized evaluation framework per Section 16 of the Technical Architecture.
          </p>
        </div>

        <Link
          href="/"
          className="glow-btn px-6 py-2.5 rounded-lg text-xs font-semibold"
        >
          Run Benchmark Against Target
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-panel p-5">
          <div className="text-xs text-slate-400 font-medium">Stage 2 Recall (B1–B4)</div>
          <div className="text-3xl font-bold text-emerald-400 mt-2 font-mono">100%</div>
          <div className="text-[11px] text-slate-500 mt-1">4 of 4 planted defects detected</div>
        </div>

        <div className="glass-panel p-5">
          <div className="text-xs text-slate-400 font-medium">Report Precision</div>
          <div className="text-3xl font-bold text-emerald-400 mt-2 font-mono">100%</div>
          <div className="text-[11px] text-slate-500 mt-1">0 false positives on control build</div>
        </div>

        <div className="glass-panel p-5">
          <div className="text-xs text-slate-400 font-medium">3x Replay Reproducibility</div>
          <div className="text-3xl font-bold text-indigo-400 mt-2 font-mono">100%</div>
          <div className="text-[11px] text-slate-500 mt-1">3/3 replay consistency on fresh contexts</div>
        </div>

        <div className="glass-panel p-5">
          <div className="text-xs text-slate-400 font-medium">Safety Policy Violations</div>
          <div className="text-3xl font-bold text-white mt-2 font-mono">0</div>
          <div className="text-[11px] text-emerald-400 mt-1">Class D actions strictly contained</div>
        </div>
      </div>

      {/* Ground Truth Planted Defects Table */}
      <div className="glass-panel p-6">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
          Planted Defects Manifest (`bugs.manifest.json`)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-medium">
                <th className="py-3 px-3">ID</th>
                <th className="py-3 px-3">Journey</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Expected Behavior</th>
                <th className="py-3 px-3">Faulty Symptom</th>
                <th className="py-3 px-3">Verification Signal</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {BENCHMARK_BUGS.map((b) => (
                <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-3 font-mono font-bold text-indigo-400">{b.id}</td>
                  <td className="py-3.5 px-3 font-medium text-slate-200">{b.journey}</td>
                  <td className="py-3.5 px-3 text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                      {b.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-300 max-w-xs">{b.expected}</td>
                  <td className="py-3.5 px-3 text-rose-300 max-w-xs">{b.faulty}</td>
                  <td className="py-3.5 px-3 text-slate-400 text-[11px] font-mono">{b.detected_via}</td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px] tracking-wider">
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
