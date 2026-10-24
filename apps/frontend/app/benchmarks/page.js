"use client";

import { useState } from "react";
import Link from "next/link";
import WorkspaceLayout from "../components/workspace/WorkspaceLayout";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Layers,
  Activity,
  FileCheck2,
  Bug,
  Sparkles,
  Search,
  Filter,
  Check,
  ExternalLink,
} from "lucide-react";

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
    strategy: "RFC 5322 regex boundary verification on email input control",
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
    strategy: "Network intercept listener checks response.status < 500",
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
    strategy: "Case-insensitive normalization comparison against user credential store",
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
    strategy: "Crawler route traversal validates all internal href anchor status codes",
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
    strategy: "Input boundary test appends whitespace and asserts results count > 0",
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
    strategy: "Negative integer boundary check asserts input rejects <= 0 values",
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
    strategy: "Mathematical invariant formula asserts single application of discount promo",
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
    strategy: "Page error listener monitors unhandled exceptions in browser window context",
  },
];

export default function BenchmarksPage() {
  const [filterGate, setFilterGate] = useState("all"); // "all" | "gate" | "extended"
  const [filterSeverity, setFilterSeverity] = useState("all"); // "all" | "High" | "Medium" | "Low"
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const filteredBugs = BENCHMARK_BUGS.filter((b) => {
    if (filterGate === "gate" && !b.stage2_gate) return false;
    if (filterGate === "extended" && b.stage2_gate) return false;
    if (filterSeverity !== "all" && b.severity !== filterSeverity) return false;
    if (
      searchQuery.trim() &&
      !b.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !b.journey.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !b.expected.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !b.faulty.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <WorkspaceLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e6e9ee]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2D9FFE]"></span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#000000]">
                Benchmark Scorecard &mdash; ShopLite
              </h1>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                100% Recall
              </span>
            </div>
            <p className="text-xs text-[#525252] mt-1">
              Standardized ground-truth defect evaluation framework validating autonomous recall and precision.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2D9FFE] hover:bg-[#0b7ee6] text-white text-xs font-bold transition-all shadow-xs group"
          >
            <span>Run Benchmark Against Target</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4 Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-[#e6e9ee] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2">
            <span className="text-[10px] font-mono uppercase text-[#737373] font-bold block">
              Stage 2 Recall (B1–B4)
            </span>
            <div className="font-mono text-3xl font-bold text-emerald-600">100%</div>
            <div className="text-[11px] text-[#737373]">4 of 4 planted defects caught</div>
          </div>

          <div className="rounded-2xl border border-[#e6e9ee] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2">
            <span className="text-[10px] font-mono uppercase text-[#737373] font-bold block">
              Report Precision
            </span>
            <div className="font-mono text-3xl font-bold text-emerald-600">100%</div>
            <div className="text-[11px] text-[#737373]">0 false alarms on control build</div>
          </div>

          <div className="rounded-2xl border border-[#e6e9ee] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2">
            <span className="text-[10px] font-mono uppercase text-[#737373] font-bold block">
              3× Replay Reproducibility
            </span>
            <div className="font-mono text-3xl font-bold text-[#2D9FFE]">100%</div>
            <div className="text-[11px] text-[#737373]">3/3 replay consistency on fresh contexts</div>
          </div>

          <div className="rounded-2xl border border-[#e6e9ee] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2">
            <span className="text-[10px] font-mono uppercase text-[#737373] font-bold block">
              Safety Policy Violations
            </span>
            <div className="font-mono text-3xl font-bold text-[#000000]">0</div>
            <div className="text-[11px] text-emerald-600">Class D actions strictly contained</div>
          </div>
        </div>

        {/* Ground Truth Planted Defects Table */}
        <div className="rounded-2xl border border-[#e6e9ee] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f0f0f0]">
            <div className="flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-[#2D9FFE]" />
              <h2 className="text-sm font-bold text-[#000000]">
                Planted Defects Manifest (bugs.manifest.json)
              </h2>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-bold">
                {filteredBugs.length} of {BENCHMARK_BUGS.length} Scenarios
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              <div className="flex items-center gap-1 p-0.5 rounded-full bg-[#f4f4f5] border border-[#e6e9ee] text-[11px]">
                <button
                  type="button"
                  onClick={() => setFilterGate("all")}
                  className={`px-2.5 py-1 rounded-full cursor-pointer transition-all font-medium ${
                    filterGate === "all"
                      ? "bg-white text-[#000000] font-semibold shadow-2xs"
                      : "text-[#737373] hover:text-[#000000]"
                  }`}
                >
                  All (8)
                </button>
                <button
                  type="button"
                  onClick={() => setFilterGate("gate")}
                  className={`px-2.5 py-1 rounded-full cursor-pointer transition-all font-medium ${
                    filterGate === "gate"
                      ? "bg-white text-[#2D9FFE] font-semibold shadow-2xs"
                      : "text-[#737373] hover:text-[#000000]"
                  }`}
                >
                  Stage 2 Gate (4)
                </button>
                <button
                  type="button"
                  onClick={() => setFilterGate("extended")}
                  className={`px-2.5 py-1 rounded-full cursor-pointer transition-all font-medium ${
                    filterGate === "extended"
                      ? "bg-white text-zinc-800 font-semibold shadow-2xs"
                      : "text-[#737373] hover:text-[#000000]"
                  }`}
                >
                  Extended (4)
                </button>
              </div>

              {/* Severity Filter */}
              <div className="flex items-center gap-1 p-0.5 rounded-full bg-[#f4f4f5] border border-[#e6e9ee] text-[11px]">
                {["all", "High", "Medium", "Low"].map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setFilterSeverity(sev)}
                    className={`px-2 py-1 rounded-full cursor-pointer transition-all font-medium capitalize ${
                      filterSeverity === sev
                        ? "bg-white text-[#000000] font-semibold shadow-2xs"
                        : "text-[#737373] hover:text-[#000000]"
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#a3a3a3] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter benchmark defects by ID, journey, expected behavior..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#e6e9ee] bg-[#fafafa] text-xs font-mono placeholder-[#a3a3a3] focus:bg-white focus:border-[#2D9FFE] focus:outline-hidden"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e6e9ee] text-[#737373] font-medium font-mono text-[11px]">
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Journey</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Expected Behavior</th>
                  <th className="py-2.5 px-3">Faulty Symptom</th>
                  <th className="py-2.5 px-3">Verification Signal</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6e9ee]">
                {filteredBugs.map((b) => {
                  const isExpanded = expandedId === b.id;
                  return (
                    <tr
                      key={b.id}
                      onClick={() => setExpandedId(isExpanded ? null : b.id)}
                      className="hover:bg-[#fafafa] transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-3 font-mono font-bold text-[#000000]">
                        <div className="flex items-center gap-1.5">
                          <span>{b.id}</span>
                          {b.stage2_gate && (
                            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-sky-50 text-sky-700 border border-sky-200">
                              Gate
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-medium text-[#000000]">{b.journey}</td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                            b.severity === "High"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : b.severity === "Medium"
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : "bg-zinc-100 text-zinc-700 border border-zinc-200"
                          }`}
                        >
                          {b.type} ({b.severity})
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-[#525252] max-w-xs">{b.expected}</td>
                      <td className="py-3.5 px-3 text-rose-600 font-semibold max-w-xs">{b.faulty}</td>
                      <td className="py-3.5 px-3 font-mono text-[11px] text-[#737373]">{b.detected_via}</td>
                      <td className="py-3.5 px-3 text-right">
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                          <CheckCircle2 className="h-3 w-3 stroke-[2.5]" />
                          <span>CONFIRMED</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
