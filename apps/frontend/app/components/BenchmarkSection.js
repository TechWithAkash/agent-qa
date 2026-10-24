"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const BENCHMARK_HIGHLIGHTS = [
  {
    id: "B1",
    journey: "J1 (Sign-up)",
    type: "Validation Bypass",
    expected: "Malformed email rejected with HTTP 400",
    result: "Detected & 3× Replay Confirmed",
  },
  {
    id: "B2",
    journey: "J1 (Sign-up)",
    type: "Unhandled 500 Crash",
    expected: "Duplicate email shows user friendly message",
    result: "Detected & 3× Replay Confirmed",
  },
  {
    id: "B3",
    journey: "J2 (Authentication)",
    type: "Case Sensitivity Defect",
    expected: "Case-insensitive email login allowed",
    result: "Detected & 3× Replay Confirmed",
  },
  {
    id: "B4",
    journey: "J2 (Navigation)",
    type: "Dead Link (HTTP 404)",
    expected: "Forgot password link resolves 200 OK",
    result: "Detected & 3× Replay Confirmed",
  },
];

export default function BenchmarkSection() {
  return (
    <section className="py-20 lg:py-28 bg-white border-t border-[#e6e9ee]">
      <div className="mx-auto max-w-[980px] px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <Badge variant="subtle" className="mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D9FFE]" />
              <span>Ground-Truth Verification</span>
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#000000] tracking-tight">
              Measure the quality of autonomous testing.
            </h2>
            <p className="mt-3 text-sm text-[#525252] leading-relaxed">
              Standardized benchmark evaluation measures whether an autonomous agent discovers planted defects, distinguishes reproducible bugs from flakiness, and generates executable regression tests.
            </p>
          </div>

          <Link href="/benchmarks">
            <Button
              variant="outline"
              size="default"
              className="group shrink-0 font-medium"
            >
              <span>Explore Benchmark Suite</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </div>

        {/* Ground Truth Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-5 bg-white rounded-2xl border border-[#e6e9ee] shadow-2xs">
            <div className="text-[11px] font-mono text-[#737373] uppercase tracking-wider">
              Planted Defect Recall
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#000000] mt-1.5 tracking-tight">
              8 / 8
            </div>
            <div className="text-[11px] text-[#737373] mt-1">
              100% recall on ShopLite suite
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-[#e6e9ee] shadow-2xs">
            <div className="text-[11px] font-mono text-[#737373] uppercase tracking-wider">
              Replay Isolation Gate
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#000000] mt-1.5 tracking-tight">
              3× Isolated
            </div>
            <div className="text-[11px] text-[#737373] mt-1">
              Zero flaky reports accepted
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-[#e6e9ee] shadow-2xs">
            <div className="text-[11px] font-mono text-[#737373] uppercase tracking-wider">
              False-Positive Rate
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-1.5 tracking-tight">
              0.0%
            </div>
            <div className="text-[11px] text-[#737373] mt-1">
              Verified on clean target controls
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-[#e6e9ee] shadow-2xs">
            <div className="text-[11px] font-mono text-[#737373] uppercase tracking-wider">
              Pytest Export Format
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#000000] mt-1.5 tracking-tight">
              CI/CD Native
            </div>
            <div className="text-[11px] text-[#737373] mt-1">
              pytest-playwright standard
            </div>
          </div>
        </div>

        {/* Benchmark Table Sample */}
        <div className="bg-white border border-[#e6e9ee] rounded-2xl overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-[#e6e9ee] bg-[#f8fafc] flex items-center justify-between text-xs">
            <span className="font-semibold text-[#000000]">
              ShopLite Benchmark Suite &bull; Defect Matrix
            </span>
            <span className="text-[#737373] font-mono text-[11px]">IM-02 Standard</span>
          </div>
          <div className="divide-y divide-[#f0f0f0] text-xs">
            {BENCHMARK_HIGHLIGHTS.map((bug) => (
              <div
                key={bug.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#fafafa] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-[6px] bg-white border border-[#e6e9ee] text-[#000000]">
                    {bug.id}
                  </span>
                  <div>
                    <span className="font-semibold text-[#000000]">{bug.type}</span>
                    <span className="text-[#737373] ml-2">({bug.journey})</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-[#737373] hidden md:inline truncate max-w-xs font-mono text-[11px]">
                    {bug.expected}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    {bug.result}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
