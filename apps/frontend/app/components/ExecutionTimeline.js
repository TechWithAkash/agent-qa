"use client";

import { useState } from "react";
import {
  Compass,
  GitBranch,
  Play,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCode2,
  ExternalLink,
  ChevronRight,
  Terminal,
} from "lucide-react";

const TIMELINE_STEPS = [
  {
    id: "discovery",
    num: "01",
    name: "Frontier Crawl",
    status: "passed",
    statusLabel: "Completed",
    meta: "34 routes · 18 forms mapped",
    detail: "Extracted full DOM tree, computed interactive accessibility anchors, and mapped route topology without synthetic hallucination.",
    evidence: {
      type: "DOM Topology",
      entries: ["/auth/signin", "/auth/signup", "/dashboard/metrics", "/api/v1/auth"],
    },
  },
  {
    id: "planning",
    num: "02",
    name: "Assertion Synthesis",
    status: "passed",
    statusLabel: "Synthesized",
    meta: "4 core journeys planned",
    detail: "Synthesized grounded assertion contracts: Sign-up RFC-5322 email enforcement, idempotent session cookies, and balance calculation.",
    evidence: {
      type: "DSL Contracts",
      entries: [
        "assert(status === 400 when email_invalid)",
        "assert(dashboard_balance >= 0)",
        "assert(session_cookie.SameSite === 'Strict')",
      ],
    },
  },
  {
    id: "execution",
    num: "03",
    name: "Browser Action",
    status: "passed",
    statusLabel: "Executed",
    meta: "12 actions · 240ms latency",
    detail: "Dispatched deterministic Playwright keyboard and click events into headless Chromium sandbox with network-idle synchronizers.",
    evidence: {
      type: "Trace Logs",
      entries: [
        "click(input#email) -> type('test@@invalid')",
        "click(button[type=submit])",
        "HTTP 500 Internal Server Error received",
      ],
    },
  },
  {
    id: "replay",
    num: "04",
    name: "3× Clean Replay",
    status: "verified",
    statusLabel: "3/3 Confirmed Defect",
    meta: "Isolated fresh browser contexts",
    detail: "Replayed the exact failure sequence across 3 completely fresh, isolated browser instances to eliminate test flakiness.",
    evidence: {
      type: "Deterministic Verification",
      entries: [
        "Context 1 (incognito): 500 Uncaught TypeError (PASS replay)",
        "Context 2 (clean storage): 500 Uncaught TypeError (PASS replay)",
        "Context 3 (isolated sandbox): 500 Uncaught TypeError (PASS replay)",
      ],
    },
  },
  {
    id: "codegen",
    num: "05",
    name: "Pytest Codegen",
    status: "ready",
    statusLabel: "Artifact Ready",
    meta: "test_auth_validation.py",
    detail: "Emitted standalone, runnable pytest-playwright regression test suite with deterministic locators and assertions for CI/CD.",
    evidence: {
      type: "Generated Test File",
      entries: [
        "def test_auth_invalid_email_boundary(page: Page):",
        "    page.goto('/auth/signup')",
        "    page.fill('input#email', 'test@@invalid')",
        "    expect(page.locator('.error')).to_be_visible()",
      ],
    },
  },
];

export default function ExecutionTimeline() {
  const [selectedStep, setSelectedStep] = useState(TIMELINE_STEPS[3]); // default to 3x replay

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-6 border-b border-[#E5E5E5]">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[#F5F5F4] text-[#737373] border border-[#E5E5E5]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]"></span>
              Illustrative Execution Pipeline
            </span>
            <span className="text-xs text-[#737373]">Deterministic Verification Guarantee</span>
          </div>
          <h3 className="text-lg font-semibold text-[#171717] mt-1.5 tracking-tight">
            From Frontier Exploration to Verified Regression Suite
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#737373]">
          <span className="font-mono text-[11px] bg-[#FAFAF9] px-2 py-1 rounded border border-[#E5E5E5]">
            Engine: Chromium Headless
          </span>
        </div>
      </div>

      {/* Horizontal timeline on desktop, vertical on mobile */}
      <div className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 relative">
          {TIMELINE_STEPS.map((step, idx) => {
            const isSelected = selectedStep.id === step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setSelectedStep(step)}
                className={`relative text-left p-3.5 rounded-lg border transition-all text-xs group ${
                  isSelected
                    ? "bg-[#FAFAF9] border-[#171717] ring-1 ring-[#171717]/10"
                    : "bg-white border-[#E5E5E5] hover:border-[#D4D4D4] hover:bg-[#FAFAF9]/60"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="font-mono text-[10px] text-[#A3A3A3] font-semibold">{step.num}</span>
                  {step.status === "verified" ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-300">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      Defect 3×
                    </span>
                  ) : step.status === "passed" ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Pass
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#171717]">
                      <FileCode2 className="w-3 h-3 text-[#F97316]" />
                      Pytest
                    </span>
                  )}
                </div>
                <div className="font-medium text-[#171717] group-hover:text-black tracking-tight">
                  {step.name}
                </div>
                <div className="text-[11px] text-[#737373] mt-1 truncate">{step.meta}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Step Detail Panel */}
        <div className="mt-4 p-5 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] text-xs">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-xs font-bold text-[#F97316]">{selectedStep.num}</span>
                <span className="font-semibold text-sm text-[#171717]">{selectedStep.name}</span>
                <span className="text-[11px] text-[#737373]">&bull; {selectedStep.statusLabel}</span>
              </div>
              <p className="text-[#737373] leading-relaxed max-w-2xl">{selectedStep.detail}</p>
            </div>

            <div className="w-full md:w-80 bg-white border border-[#E5E5E5] rounded-md p-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#737373] pb-2 border-b border-[#F5F5F4] mb-2">
                <span className="font-semibold text-[#171717] flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-[#737373]" />
                  {selectedStep.evidence.type}
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  Verified
                </span>
              </div>
              <div className="font-mono text-[11px] space-y-1 text-[#404040]">
                {selectedStep.evidence.entries.map((item, i) => (
                  <div key={i} className="flex items-start gap-1.5 truncate">
                    <span className="text-[#A3A3A3] select-none">&rsaquo;</span>
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
