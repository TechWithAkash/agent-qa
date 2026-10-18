"use client";

import { useState } from "react";
import {
  Compass,
  GitBranch,
  RotateCcw,
  FileCode2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Terminal,
  ScanSearch,
} from "lucide-react";

const STAGES = [
  {
    num: "01",
    title: "Discover",
    tagline: "Autonomous Frontier Crawl & Topology",
    description:
      "DRISHTI autonomously crawls your application without needing pre-recorded scripts. It parses accessibility trees, extracts actionable forms, computes interactive boundaries, and builds a deterministic route graph.",
    metrics: [
      { label: "Extraction", val: "DOM & A11y Trees" },
      { label: "Scope", val: "Forms, Buttons, Links" },
      { label: "Handling", val: "Dynamic SPAs & SSR" },
    ],
    codePreview: `// Frontier Graph Node Extracted
{
  "route": "/checkout/payment",
  "anchors": 14,
  "inputs": ["card_number", "exp_date", "cvc"],
  "actions": ["submit_payment", "apply_coupon"]
}`,
  },
  {
    num: "02",
    title: "Plan",
    tagline: "Grounded Assertion Synthesis",
    description:
      "Rather than blindly clicking random elements, DRISHTI synthesizes logical user journeys guided by your test rules. It models invariants, expected HTTP status codes, validation boundaries, and idempotent session states.",
    metrics: [
      { label: "Technique", val: "Assertion DSL" },
      { label: "Coverage", val: "Happy & Edge Paths" },
      { label: "Context", val: "Domain Constraints" },
    ],
    codePreview: `// Grounded Assertion Contract
journey("User Registration Edge Case") {
  navigate("/auth/signup")
  fill("input[name=email]", "invalid-email")
  submit()
  expect(status).toBe(400) // Catches unhandled 500s
}`,
  },
  {
    num: "03",
    title: "Verify",
    tagline: "3× Deterministic Browser Replay",
    description:
      "The #1 problem in automated QA is flakiness. DRISHTI verifies every detected failure by executing 3 deterministic replays across completely fresh, isolated browser contexts. Only failures that reproduce 3 out of 3 times are confirmed.",
    metrics: [
      { label: "Replay Isolation", val: "3 Fresh Contexts" },
      { label: "False Positive Proof", val: "Zero Flakiness" },
      { label: "Evidence", val: "Traces + HAR + Shots" },
    ],
    codePreview: `// 3x Deterministic Verification Result
Context 1 (incognito): 500 Uncaught Exception [REPRODUCED]
Context 2 (clean storage): 500 Uncaught Exception [REPRODUCED]
Context 3 (fresh sandbox): 500 Uncaught Exception [REPRODUCED]
Verdict: CONFIRMED DEFECT (3/3 Reproducible)`,
  },
  {
    num: "04",
    title: "Remember",
    tagline: "Standalone Pytest-Playwright Codegen",
    description:
      "Discovered defects and validated journeys are automatically compiled into clean, maintainable pytest-playwright regression test suites. Run them locally or drop them straight into your GitHub Actions CI/CD pipeline.",
    metrics: [
      { label: "Output Format", val: "pytest-playwright" },
      { label: "Integration", val: "CI/CD & Pre-commit" },
      { label: "Maintenance", val: "Self-healing locators" },
    ],
    codePreview: `# test_regression_auth.py (Generated Suite)
import pytest
from playwright.sync_api import Page, expect

def test_signup_malformed_email(page: Page):
    page.goto("https://target.app/auth/signup")
    page.locator("#email").fill("bad_email_test")
    page.locator("#submit-btn").click()
    expect(page.locator(".error-banner")).to_be_visible()`,
  },
];

export default function HowItWorks() {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <section id="how-it-works" className="py-20 lg:py-28 border-t border-[#E5E5E5] bg-[#FAFAF9]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-white text-[#737373] border border-[#E5E5E5] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]"></span>
            <span>How It Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#171717] tracking-tight">
            From application exploration to verified regression tests.
          </h2>
          <p className="mt-3 text-base text-[#737373] leading-relaxed">
            Testing should discover problems, prove they exist without flakiness, and generate runnable code to prevent them from ever returning.
          </p>
        </div>

        {/* 4 Stage Interactive Stepper Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Stage Selector Tabs (Left 5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            {STAGES.map((stage, idx) => {
              const isActive = activeStage === idx;
              return (
                <button
                  key={stage.num}
                  type="button"
                  onClick={() => setActiveStage(idx)}
                  className={`w-full text-left p-5 rounded-xl border transition-all ${
                    isActive
                      ? "bg-white border-[#171717] shadow-xs ring-1 ring-[#171717]/10"
                      : "bg-white/60 border-[#E5E5E5] hover:bg-white hover:border-[#D4D4D4]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                          isActive
                            ? "bg-[#171717] text-white"
                            : "bg-[#F5F5F4] text-[#737373]"
                        }`}
                      >
                        {stage.num}
                      </span>
                      <span className="font-semibold text-base text-[#171717]">
                        {stage.title}
                      </span>
                    </div>
                    {isActive && (
                      <span className="text-[11px] font-medium text-[#F97316] flex items-center gap-1">
                        Active Stage
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-xs font-medium text-[#737373]">
                    {stage.tagline}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Stage Preview Card (Right 7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-[#E5E5E5] rounded-xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-[#F97316]">
                  {STAGES[activeStage].num}
                </span>
                <span className="text-sm font-semibold text-[#171717]">
                  {STAGES[activeStage].title} — {STAGES[activeStage].tagline}
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#737373] bg-[#F5F5F4] px-2 py-0.5 rounded border border-[#E5E5E5]">
                Stage {activeStage + 1} of 4
              </span>
            </div>

            <p className="text-sm text-[#525252] leading-relaxed mb-6">
              {STAGES[activeStage].description}
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 mb-6 p-3 bg-[#FAFAF9] rounded-lg border border-[#E5E5E5]">
              {STAGES[activeStage].metrics.map((m, i) => (
                <div key={i}>
                  <div className="text-[10px] text-[#A3A3A3] uppercase tracking-wider font-mono">
                    {m.label}
                  </div>
                  <div className="text-xs font-semibold text-[#171717] mt-0.5 truncate">
                    {m.val}
                  </div>
                </div>
              ))}
            </div>

            {/* Code / Artifact Spec Preview */}
            <div className="rounded-lg bg-[#171717] text-white p-4 font-mono text-xs overflow-x-auto">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[10px] text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-[#F97316]" />
                  Internal Execution Output
                </span>
                <span>Deterministic</span>
              </div>
              <pre className="text-zinc-200 text-[11px] leading-relaxed overflow-x-auto">
                {STAGES[activeStage].codePreview}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
