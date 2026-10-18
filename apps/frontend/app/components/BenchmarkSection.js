"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight, ShieldCheck, Bug, RotateCcw, ExternalLink } from "lucide-react";

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
    <section className="py-20 lg:py-28 bg-white border-t border-[#E5E5E5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FAFAF9] text-[#737373] border border-[#E5E5E5] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]"></span>
              <span>Ground-Truth Verification</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#171717] tracking-tight">
              Measure the quality of autonomous testing.
            </h2>
            <p className="mt-3 text-base text-[#737373] leading-relaxed">
              Standardized benchmark evaluation measures whether an autonomous agent discovers planted defects, distinguishes reproducible bugs from flakiness, and generates executable regression tests.
            </p>
          </div>

          <Link
            href="/benchmarks"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#171717] text-white hover:bg-black transition-all text-xs font-medium shadow-xs shrink-0 self-start md:self-end"
          >
            <span>Explore the Benchmark Scorecard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Real Ground Truth Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-5 bg-[#FAFAF9] rounded-xl border border-[#E5E5E5]">
            <div className="text-[11px] font-mono text-[#737373] uppercase tracking-wider">
              Planted Defect Recall
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#171717] mt-1.5 tracking-tight">
              8 / 8
            </div>
            <div className="text-[11px] text-[#737373] mt-1">
              100% recall on ShopLite suite
            </div>
          </div>

          <div className="p-5 bg-[#FAFAF9] rounded-xl border border-[#E5E5E5]">
            <div className="text-[11px] font-mono text-[#737373] uppercase tracking-wider">
              Replay Verification Gate
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#171717] mt-1.5 tracking-tight">
              3× Isolated
            </div>
            <div className="text-[11px] text-[#737373] mt-1">
              Zero flaky reports accepted
            </div>
          </div>

          <div className="p-5 bg-[#FAFAF9] rounded-xl border border-[#E5E5E5]">
            <div className="text-[11px] font-mono text-[#737373] uppercase tracking-wider">
              False-Positive Rate
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-700 mt-1.5 tracking-tight">
              0.0%
            </div>
            <div className="text-[11px] text-[#737373] mt-1">
              Verified on clean target controls
            </div>
          </div>

          <div className="p-5 bg-[#FAFAF9] rounded-xl border border-[#E5E5E5]">
            <div className="text-[11px] font-mono text-[#737373] uppercase tracking-wider">
              Pytest Export Format
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#171717] mt-1.5 tracking-tight">
              CI/CD Native
            </div>
            <div className="text-[11px] text-[#737373] mt-1">
              pytest-playwright standard
            </div>
          </div>
        </div>

        {/* Benchmark Table Sample */}
        <div className="bg-[#FAFAF9] border border-[#E5E5E5] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#E5E5E5] flex items-center justify-between text-xs">
            <span className="font-semibold text-[#171717]">
              ShopLite Benchmark Suite &bull; Planted Defect Matrix
            </span>
            <span className="text-[#737373] font-mono text-[11px]">iMocha Track IM-02 Standard</span>
          </div>
          <div className="divide-y divide-[#E5E5E5] text-xs">
            {BENCHMARK_HIGHLIGHTS.map((bug) => (
              <div
                key={bug.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-white border border-[#E5E5E5] text-[#171717]">
                    {bug.id}
                  </span>
                  <div>
                    <span className="font-semibold text-[#171717]">{bug.type}</span>
                    <span className="text-[#737373] ml-2">({bug.journey})</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-[#737373] hidden md:inline truncate max-w-xs">
                    {bug.expected}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
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
