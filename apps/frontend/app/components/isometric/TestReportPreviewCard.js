"use client";

import { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  FileCode2,
  ShieldCheck,
  Terminal,
  Clock,
  Sparkles,
} from "lucide-react";
import { Badge } from "../ui/badge";

export default function TestReportPreviewCard() {
  const [activeTab, setActiveTab] = useState("overview");

  const journeys = [
    {
      name: "Checkout Funnel Validation",
      route: "/checkout/payment",
      status: "3x Replay Verified",
      flakiness: "0.0%",
      time: "1.2s",
      passed: true,
    },
    {
      name: "User Registration Edge-Cases",
      route: "/auth/signup",
      status: "3x Replay Verified",
      flakiness: "0.0%",
      time: "0.8s",
      passed: true,
    },
    {
      name: "Cart State Boundary Mutator",
      route: "/cart/coupon",
      status: "Anomaly Caught",
      flakiness: "100% Repro",
      time: "1.4s",
      passed: false,
    },
  ];

  return (
    <div className="w-full rounded-2xl border border-[#e6e9ee] bg-white p-6 sm:p-8 shadow-xs">
      {/* Top Header of Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#f0f0f0] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            <h4 className="text-sm font-semibold text-[#000000]">
              PR #142 · Autonomous Verification Run
            </h4>
          </div>
          <p className="text-xs text-[#737373]">
            Target: <code className="font-mono text-[#0b7ee6]">https://app.production.net</code> · Commit <code className="font-mono text-[#262626]">#a8f902b</code>
          </p>
        </div>

        {/* Status Pill Matrix */}
        <div className="flex items-center gap-2">
          <Badge variant="success" className="text-[10px]">
            <CheckCircle2 className="h-3 w-3" />
            14 Journeys Verified
          </Badge>
          <Badge variant="subtle" className="text-[10px]">
            <RotateCcw className="h-3 w-3" />
            3× Clean Replays
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 pt-4 pb-4 border-b border-[#f0f0f0] text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-medium ${
            activeTab === "overview"
              ? "bg-[#f4f4f5] text-[#000000]"
              : "text-[#737373] hover:text-[#000000]"
          }`}
        >
          Journeys &amp; Invariants
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("pytest")}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-medium ${
            activeTab === "pytest"
              ? "bg-[#f4f4f5] text-[#000000]"
              : "text-[#737373] hover:text-[#000000]"
          }`}
        >
          Pytest Codegen
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("replay")}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-medium ${
            activeTab === "replay"
              ? "bg-[#f4f4f5] text-[#000000]"
              : "text-[#737373] hover:text-[#000000]"
          }`}
        >
          3× Replay Proof
        </button>
      </div>

      {/* Tab Content 1: Overview Journeys */}
      {activeTab === "overview" && (
        <div className="pt-4 divide-y divide-[#f0f0f0]">
          {journeys.map((j, i) => (
            <div
              key={i}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-3">
                {j.passed ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-[#c2453a] shrink-0" />
                )}
                <div>
                  <span className="font-medium text-[#262626]">{j.name}</span>
                  <span className="ml-2 font-mono text-[11px] text-[#737373]">
                    {j.route}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[11px] font-mono text-[#525252]">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-[#a3a3a3]" />
                  {j.time}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full ${
                    j.passed
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-[#c2453a]/10 text-[#c2453a]"
                  }`}
                >
                  {j.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content 2: Pytest Codegen */}
      {activeTab === "pytest" && (
        <div className="pt-4">
          <div className="rounded-xl bg-[#000000] p-4 font-mono text-xs text-zinc-300 leading-relaxed overflow-x-auto">
            <span className="text-zinc-500"># Generated standalone pytest-playwright suite</span>
            <br />
            <span className="text-[#2D9FFE]">import</span> pytest
            <br />
            <span className="text-[#2D9FFE]">from</span> playwright.sync_api <span className="text-[#2D9FFE]">import</span> Page, expect
            <br /><br />
            <span className="text-emerald-400">def test_checkout_idempotent_replay</span>(page: Page):
            <br />
            &nbsp;&nbsp;page.goto(<span className="text-amber-300">&quot;https://app.production.net/checkout&quot;</span>)
            <br />
            &nbsp;&nbsp;page.fill(<span className="text-amber-300">&quot;input[name=&apos;card_number&apos;]&quot;</span>, <span className="text-amber-300">&quot;424242424242&quot;</span>)
            <br />
            &nbsp;&nbsp;page.click(<span className="text-amber-300">&quot;button[type=&apos;submit&apos;]&quot;</span>)
            <br />
            &nbsp;&nbsp;expect(page.locator(<span className="text-amber-300">&quot;.order-confirmation&quot;</span>)).to_be_visible()
          </div>
        </div>
      )}

      {/* Tab Content 3: 3x Replay Proof */}
      {activeTab === "replay" && (
        <div className="pt-4 space-y-3 text-xs">
          <div className="p-3 rounded-xl border border-[#e6e9ee] bg-[#f8fafc] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">1</span>
              <span className="font-medium text-[#262626]">Context Iteration #1 (Clean Incognito Cache)</span>
            </div>
            <span className="font-mono text-emerald-600 text-[11px] font-semibold">100% Match</span>
          </div>

          <div className="p-3 rounded-xl border border-[#e6e9ee] bg-[#f8fafc] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">2</span>
              <span className="font-medium text-[#262626]">Context Iteration #2 (Fresh User Agent &amp; Storage)</span>
            </div>
            <span className="font-mono text-emerald-600 text-[11px] font-semibold">100% Match</span>
          </div>

          <div className="p-3 rounded-xl border border-[#e6e9ee] bg-[#f8fafc] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">3</span>
              <span className="font-medium text-[#262626]">Context Iteration #3 (Simulated Latency &amp; Cookies)</span>
            </div>
            <span className="font-mono text-emerald-600 text-[11px] font-semibold">100% Match</span>
          </div>
        </div>
      )}

      {/* Bottom Proof Note */}
      <div className="mt-6 pt-4 border-t border-[#f0f0f0] flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#737373] gap-2 font-mono">
        <span className="flex items-center gap-1.5 text-emerald-600">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Zero False Positives Guaranteed</span>
        </span>
        <span>Flakiness: 0.00% across 1,420 runs</span>
      </div>
    </div>
  );
}
