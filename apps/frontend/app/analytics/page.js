"use client";

import { useState } from "react";
import WorkspaceLayout from "../components/workspace/WorkspaceLayout";
import {
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  BarChart3,
  PieChart,
  Activity,
  Check,
  Search,
  Filter,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
  Cpu,
} from "lucide-react";

export default function AnalyticsPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [journeyFilter, setJourneyFilter] = useState("all"); // "all" | "deterministic" | "flagged"
  const [searchQuery, setSearchQuery] = useState("");

  const defectCategories = [
    {
      id: "input",
      name: "Client Input Contracts",
      count: 2,
      share: 25,
      color: "#2D9FFE",
      textColor: "text-sky-600",
      bgColor: "bg-sky-50",
      borderColor: "border-sky-200",
      status: "Validated",
      description: "Boundary condition validation for RFC email format and required form inputs.",
    },
    {
      id: "server",
      name: "Server Error Invariants",
      count: 2,
      share: 25,
      color: "#f43f5e",
      textColor: "text-rose-600",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
      status: "Blocker Cleared",
      description: "Zero HTTP 500 Uncaught Server Exceptions permitted under concurrent load.",
    },
    {
      id: "nav",
      name: "Navigation & Dead Links (404)",
      count: 2,
      share: 25,
      color: "#f59e0b",
      textColor: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      status: "Identified",
      description: "Crawler verified internal routes and flagged unlinked / missing recovery endpoints.",
    },
    {
      id: "security",
      name: "Security & CSP Invariants",
      count: 2,
      share: 25,
      color: "#8b5cf6",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      status: "Policy Audited",
      description: "Audited Content-Security-Policy headers and transport encryption policies.",
    },
  ];

  const journeyPassRates = [
    {
      id: "J-01",
      code: "J-01",
      name: "Application Root Mount & Page Availability",
      category: "Infrastructure",
      rate: 100,
      duration: "182ms",
      runs: ["pass", "pass", "pass"],
      status: "100% Deterministic",
      assertion: "Root HTML mounted, HTTP 200 OK, DOM interactive < 500ms",
    },
    {
      id: "J-02",
      code: "J-02",
      name: "Critical Headline & Branding Viewport",
      category: "UI Contract",
      rate: 100,
      duration: "214ms",
      runs: ["pass", "pass", "pass"],
      status: "100% Deterministic",
      assertion: "H1 hero banner rendered above fold, logo visible, zero layout shift",
    },
    {
      id: "J-03",
      code: "J-03",
      name: "User Sign-Up Registration Gateway Flow",
      category: "Auth Gateway",
      rate: 88,
      duration: "420ms",
      runs: ["fail", "fail", "fail"],
      status: "Defect Flagged (B1/B2)",
      assertion: "Form accepts malformed email without error (B1) & 500 on duplicate (B2)",
    },
    {
      id: "J-04",
      code: "J-04",
      name: "User Sign-In & Authentication Session",
      category: "Auth Gateway",
      rate: 88,
      duration: "390ms",
      runs: ["fail", "fail", "fail"],
      status: "Defect Flagged (B3/B4)",
      assertion: "Case-sensitive email rejection (B3) & 404 password recovery link (B4)",
    },
    {
      id: "J-05",
      code: "J-05",
      name: "Interactive Action CTA & Conversion",
      category: "Conversion",
      rate: 100,
      duration: "265ms",
      runs: ["pass", "pass", "pass"],
      status: "100% Deterministic",
      assertion: "Primary CTA click dispatches correct navigation routing event",
    },
    {
      id: "J-06",
      code: "J-06",
      name: "Form Field Interaction Contract",
      category: "Forms",
      rate: 100,
      duration: "310ms",
      runs: ["pass", "pass", "pass"],
      status: "100% Deterministic",
      assertion: "All text inputs support standard typing, focus states, and blur events",
    },
    {
      id: "J-07",
      code: "J-07",
      name: "Internal Navigation & Link Graph",
      category: "Crawler",
      rate: 100,
      duration: "340ms",
      runs: ["pass", "pass", "pass"],
      status: "100% Deterministic",
      assertion: "Zero broken anchor tags on homepage, all links route to valid 200 URLs",
    },
    {
      id: "J-08",
      code: "J-08",
      name: "Transport Security & Console Invariants",
      category: "Security",
      rate: 95,
      duration: "195ms",
      runs: ["warn", "warn", "warn"],
      status: "Policy Warning (CSP)",
      assertion: "TLS 1.3 verified; 1 warning for unsafe-eval script policy",
    },
  ];

  const totalDefects = defectCategories.reduce((acc, cat) => acc + cat.count, 0);

  // Filter journeys
  const filteredJourneys = journeyPassRates.filter((j) => {
    if (journeyFilter === "deterministic" && j.rate < 100) return false;
    if (journeyFilter === "flagged" && j.rate === 100) return false;
    if (
      searchQuery.trim() &&
      !j.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !j.code.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Calculate SVG Donut chart segments
  // Circumference of radius 54 is 2 * PI * 54 = 339.29
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  const donutSlices = defectCategories.map((cat) => {
    const strokeDasharray = `${(cat.share / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedOffset;
    accumulatedOffset += (cat.share / 100) * circumference;
    return {
      ...cat,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const activeCategoryData = selectedCategory
    ? defectCategories.find((c) => c.id === selectedCategory)
    : null;

  return (
    <WorkspaceLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e6e9ee]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2D9FFE] animate-pulse"></span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#000000]">
                Quality Analytics &amp; Defect Density
              </h1>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                0.0% Flake Guaranteed
              </span>
            </div>
            <p className="text-xs text-[#525252] mt-1">
              Deterministic invariant execution, architectural layer defect distributions, and 3× replay reproducibility across all test suites.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#737373]">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#e6e9ee] bg-[#fafafa]">
              <RefreshCw className="w-3.5 h-3.5 text-[#2D9FFE]" />
              <span>Real-time Sync</span>
            </span>
          </div>
        </div>

        {/* 4 Interactive Visual KPI Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Aggregate Pass Rate */}
          <div className="p-5 rounded-2xl border border-[#e6e9ee] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#cbd5e1] transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-[#737373] font-bold tracking-wider">
                  Aggregate Pass Rate
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  8 Workflows
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-3xl font-bold font-mono text-[#000000]">88.2%</span>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5 font-mono">
                  <ArrowUpRight className="w-3 h-3" />
                  Deterministic
                </span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="mt-4 space-y-1.5">
              <div className="h-2 w-full bg-[#f4f4f5] rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500 rounded-l-full" style={{ width: "88.2%" }} />
                <div className="h-full bg-amber-400 rounded-r-full" style={{ width: "11.8%" }} />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-[#737373]">
                <span>7 Passed (88%)</span>
                <span>1 Attention (12%)</span>
              </div>
            </div>
          </div>

          {/* Card 2: Transient Flakiness */}
          <div className="p-5 rounded-2xl border border-[#e6e9ee] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#cbd5e1] transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-[#737373] font-bold tracking-wider">
                  Transient Flakiness
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                  Guaranteed
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-3xl font-bold font-mono text-emerald-600">0.0%</span>
                <span className="text-xs font-semibold text-[#0b7ee6] font-mono">
                  3× Replay Proven
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 p-2 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-emerald-800 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate font-sans">
                Zero false positive alerts across all test runs
              </span>
            </div>
          </div>

          {/* Card 3: Ground-Truth Recall */}
          <div className="p-5 rounded-2xl border border-[#e6e9ee] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#cbd5e1] transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-[#737373] font-bold tracking-wider">
                  Ground-Truth Recall
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  100% Score
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-3xl font-bold font-mono text-[#000000]">100%</span>
                <span className="text-xs font-semibold text-emerald-600 font-mono">
                  ShopLite Verified
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#525252]">
                <span className="font-bold text-emerald-600">4 / 4</span>
                <span>Planted Stage 2 defects caught</span>
              </div>
              <div className="h-2 w-full bg-emerald-500 rounded-full" />
            </div>
          </div>

          {/* Card 4: Mean Execution Latency */}
          <div className="p-5 rounded-2xl border border-[#e6e9ee] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#cbd5e1] transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-[#737373] font-bold tracking-wider">
                  Mean Replay Latency
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  Chromium 130
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-3xl font-bold font-mono text-[#000000]">872ms</span>
                <span className="text-xs font-semibold text-purple-600 font-mono">
                  Headless Run
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-[#737373] p-2 rounded-xl bg-[#fafafa] border border-[#e6e9ee]">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-purple-500" />
                <span>P95: 1.2s</span>
              </span>
              <span>Fast CI Feedback</span>
            </div>
          </div>
        </div>

        {/* Defect Distribution & Journey Invariant Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Defect Distribution with Interactive SVG Donut Chart (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl border border-[#e6e9ee] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
            <div className="border-b border-[#f0f0f0] pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#000000] flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-[#2D9FFE]" />
                  <span>Defects by Architectural Category</span>
                </h2>
                <p className="text-xs text-[#737373] mt-0.5">
                  Proportion of caught defects across invariant layers.
                </p>
              </div>
              {selectedCategory && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="text-[10px] font-mono text-[#2D9FFE] hover:underline cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {/* SVG Donut Chart */}
            <div className="flex flex-col items-center justify-center pt-2 pb-1">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
                  {/* Background Track */}
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    className="stroke-[#f4f4f5]"
                    strokeWidth="16"
                    fill="transparent"
                  />
                  {/* Slices */}
                  {donutSlices.map((slice) => {
                    const isSelected = selectedCategory === slice.id;
                    return (
                      <circle
                        key={slice.id}
                        cx="70"
                        cy="70"
                        r={radius}
                        stroke={slice.color}
                        strokeWidth={isSelected ? "20" : "16"}
                        strokeDasharray={slice.strokeDasharray}
                        strokeDashoffset={slice.strokeDashoffset}
                        fill="transparent"
                        className="cursor-pointer transition-all duration-300 hover:opacity-90"
                        onClick={() =>
                          setSelectedCategory(selectedCategory === slice.id ? null : slice.id)
                        }
                      />
                    );
                  })}
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  {activeCategoryData ? (
                    <>
                      <span className="text-2xl font-bold font-mono text-[#000000]">
                        {activeCategoryData.count}
                      </span>
                      <span className="text-[10px] font-mono uppercase font-bold text-[#737373] max-w-[90px] truncate">
                        {activeCategoryData.name.split(" ")[0]}
                      </span>
                      <span className={`text-[10px] font-mono font-bold ${activeCategoryData.textColor}`}>
                        {activeCategoryData.share}% Share
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl font-bold font-mono text-[#000000]">
                        {totalDefects}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#737373] font-semibold">
                        Defects Audited
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600 font-bold mt-0.5">
                        100% Caught
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Category Legend Cards */}
            <div className="space-y-2">
              {defectCategories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? "border-[#2D9FFE] bg-[#2D9FFE]/5 shadow-2xs"
                        : "border-[#e6e9ee] bg-[#fafafa] hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="font-semibold text-[#000000]">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-[#737373]">
                          {cat.count} flaws ({cat.share}%)
                        </span>
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${cat.bgColor} ${cat.textColor} ${cat.borderColor}`}
                        >
                          {cat.status}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <p className="mt-1.5 pt-1.5 border-t border-[#e6e9ee] text-[11px] text-[#525252] leading-relaxed">
                        {cat.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Ground Truth Policy Rule Card */}
            <div className="p-3.5 rounded-xl border border-[#e6e9ee] bg-[#fafafa] text-xs text-[#525252] space-y-1">
              <span className="font-bold text-[#000000] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero Flakiness Guarantee Rule:</span>
              </span>
              <p className="text-[11px] text-[#737373] leading-relaxed font-sans">
                Every flaw is verified across 3× fresh isolated Chromium browser sessions before being confirmed. No flaky failures are reported to engineering.
              </p>
            </div>
          </div>

          {/* User Journey Invariant Stability (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-[#e6e9ee] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
            {/* Header & Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f0f0f0]">
              <div>
                <h2 className="text-sm font-bold text-[#000000] flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#2D9FFE]" />
                  <span>End-to-End User Journey Pass Rates</span>
                </h2>
                <p className="text-xs text-[#737373] mt-0.5">
                  Verified across 3× fresh isolated sessions with zero false alarms.
                </p>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1 p-0.5 rounded-full bg-[#f4f4f5] border border-[#e6e9ee] text-[11px]">
                <button
                  type="button"
                  onClick={() => setJourneyFilter("all")}
                  className={`px-2.5 py-1 rounded-full cursor-pointer transition-all font-medium ${
                    journeyFilter === "all"
                      ? "bg-white text-[#000000] font-semibold shadow-2xs"
                      : "text-[#737373] hover:text-[#000000]"
                  }`}
                >
                  All ({journeyPassRates.length})
                </button>
                <button
                  type="button"
                  onClick={() => setJourneyFilter("deterministic")}
                  className={`px-2.5 py-1 rounded-full cursor-pointer transition-all font-medium ${
                    journeyFilter === "deterministic"
                      ? "bg-white text-emerald-700 font-semibold shadow-2xs"
                      : "text-[#737373] hover:text-[#000000]"
                  }`}
                >
                  100% Pass (6)
                </button>
                <button
                  type="button"
                  onClick={() => setJourneyFilter("flagged")}
                  className={`px-2.5 py-1 rounded-full cursor-pointer transition-all font-medium ${
                    journeyFilter === "flagged"
                      ? "bg-white text-amber-800 font-semibold shadow-2xs"
                      : "text-[#737373] hover:text-[#000000]"
                  }`}
                >
                  Attention (2)
                </button>
              </div>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#a3a3a3] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter user journeys by name or ID (e.g. J-03, Sign-Up)..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#e6e9ee] bg-[#fafafa] text-xs font-mono placeholder-[#a3a3a3] focus:bg-white focus:border-[#2D9FFE] focus:outline-hidden"
              />
            </div>

            {/* Journey List Cards */}
            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
              {filteredJourneys.map((j) => {
                const isPassed = j.rate === 100;
                return (
                  <div
                    key={j.id}
                    className="p-3.5 rounded-xl border border-[#e6e9ee] bg-[#fafafa] hover:bg-white hover:border-[#cbd5e1] transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-800 shrink-0">
                          {j.code}
                        </span>
                        <span className="font-semibold text-[#000000] truncate">{j.name}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* 3 Replay Dots */}
                        <div className="flex items-center gap-1 font-mono text-[9px] text-zinc-500" title="3× Replay Cycles">
                          {j.runs.map((r, rIdx) => (
                            <span
                              key={rIdx}
                              className={`w-2 h-2 rounded-full ${
                                r === "pass"
                                  ? "bg-emerald-500"
                                  : r === "warn"
                                  ? "bg-amber-400"
                                  : "bg-rose-500"
                              }`}
                            />
                          ))}
                        </div>

                        <span
                          className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isPassed
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-amber-100 text-amber-900 border border-amber-200"
                          }`}
                        >
                          {j.status}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar & Latency */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isPassed ? "bg-emerald-500" : "bg-amber-500"}`}
                          style={{ width: `${j.rate}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[#737373] shrink-0">
                        {j.duration}
                      </span>
                    </div>

                    {/* Assertion Detail */}
                    <p className="text-[11px] text-[#737373] truncate font-sans">
                      <span className="font-semibold text-zinc-600">Invariant:</span> {j.assertion}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3× Replay Determinism Matrix Visual */}
        <div className="rounded-2xl border border-[#e6e9ee] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0f0f0] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#000000] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#2D9FFE]" />
                <span>3× Isolated Chromium Context Replay Matrix</span>
              </h2>
              <p className="text-xs text-[#737373] mt-0.5">
                Every test journey is executed across 3 completely clean Chromium instances with isolated cache and storage.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Pass
              </span>
              <span className="flex items-center gap-1 text-amber-700">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span> Warning
              </span>
              <span className="flex items-center gap-1 text-rose-700">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Flagged
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#e6e9ee] text-[#737373] font-mono">
                  <th className="py-2.5 px-3">Journey ID</th>
                  <th className="py-2.5 px-3">Workflow Description</th>
                  <th className="py-2.5 px-3 text-center">Run #1 (Cold Cache)</th>
                  <th className="py-2.5 px-3 text-center">Run #2 (Isolated Incognito)</th>
                  <th className="py-2.5 px-3 text-center">Run #3 (Verification Pass)</th>
                  <th className="py-2.5 px-3 text-right">Determinism Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f0f0]">
                {journeyPassRates.map((j) => (
                  <tr key={j.id} className="hover:bg-[#fafafa] transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#000000]">{j.code}</td>
                    <td className="py-3 px-3 font-medium text-[#000000] truncate max-w-xs">{j.name}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-bold">
                        {j.runs[0] === "pass" ? "✓" : j.runs[0] === "warn" ? "!" : "✗"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-bold">
                        {j.runs[1] === "pass" ? "✓" : j.runs[1] === "warn" ? "!" : "✗"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-bold">
                        {j.runs[2] === "pass" ? "✓" : j.runs[2] === "warn" ? "!" : "✗"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">
                      100% Consistent
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
