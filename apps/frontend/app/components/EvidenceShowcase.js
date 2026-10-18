"use client";

import { useState } from "react";
import {
  Bug,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  FileCode2,
  Terminal,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Copy,
  Check,
} from "lucide-react";

export default function EvidenceShowcase() {
  const [activeTab, setActiveTab] = useState("dossier"); // "dossier" | "trace" | "pytest"
  const [copied, setCopied] = useState(false);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const samplePytest = `import pytest
from playwright.sync_api import Page, expect

def test_auth_signup_malformed_email_handled(page: Page):
    """
    Regression Test: Ensures signup endpoint returns 400 Bad Request
    instead of unhandled 500 Internal Server Error when email is malformed.
    """
    page.goto("https://www.mywealthwise.in/auth/signup")
    page.wait_for_selector("#signup-form")
    
    # Fill inputs with edge-case malformed email
    page.fill("input#full-name", "Autonomous QA Runner")
    page.fill("input#email", "qa.runner@@unhandled-domain..com")
    page.fill("input#password", "SecureP@ss123!")
    page.click("button[type=submit]")
    
    # Invariant: Must display client validation or return 400, never 500 crash
    expect(page.locator(".toast-error-banner")).to_be_visible(timeout=5000)
    expect(page.locator(".toast-error-banner")).not_to_contain_text("500")`;

  return (
    <section className="py-20 lg:py-28 bg-[#FAFAF9] border-t border-[#E5E5E5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Narrative */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-white text-[#737373] border border-[#E5E5E5] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]"></span>
              <span>Evidence & Bug Reporting</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#171717] tracking-tight">
              Actionable bug reports backed by undeniable evidence.
            </h2>
            <p className="mt-4 text-base text-[#737373] leading-relaxed">
              Engineers don&apos;t need vague AI summaries saying &quot;there might be a bug.&quot; DRISHTI delivers complete, reproducible dossiers: step-by-step reproduction traces, console logs, network payloads, 3× fresh browser replay confirmation, and exportable pytest regression tests.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-white border border-[#E5E5E5] flex items-center justify-center text-[#F97316] shrink-0 mt-0.5">
                  <RotateCcw className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#171717]">3× Fresh Replay Proof</h4>
                  <p className="text-xs text-[#737373] mt-0.5">
                    Every defect is tested in 3 fresh, isolated browser instances to eliminate false positives and transient flakiness.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-white border border-[#E5E5E5] flex items-center justify-center text-[#F97316] shrink-0 mt-0.5">
                  <Terminal className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#171717]">Deep Browser Telemetry</h4>
                  <p className="text-xs text-[#737373] mt-0.5">
                    Captures console stack traces, network response payloads, DOM snapshot diffs, and exact timestamped interaction timings.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-white border border-[#E5E5E5] flex items-center justify-center text-[#F97316] shrink-0 mt-0.5">
                  <FileCode2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#171717]">Drop-in Pytest File</h4>
                  <p className="text-xs text-[#737373] mt-0.5">
                    Converts the validated defect into a self-contained test file ready for immediate integration into your pull requests.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Realistic Defect Dossier Card */}
          <div className="lg:col-span-7 bg-white border border-[#E5E5E5] rounded-xl shadow-xs overflow-hidden">
            {/* Dossier Header */}
            <div className="p-5 border-b border-[#E5E5E5] bg-[#FAFAF9]/80">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
                    <ShieldAlert className="w-3 h-3" />
                    Confirmed Defect
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    3/3 Replays Confirmed
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#A3A3A3]">ID: BUG-8429</span>
              </div>
              <h3 className="text-base font-semibold text-[#171717] tracking-tight">
                Unhandled 500 Server Error on Registration with Malformed Email
              </h3>
              <div className="flex items-center gap-4 text-xs text-[#737373] mt-2 font-mono">
                <span>Target: /auth/signup</span>
                <span>&bull;</span>
                <span>Method: POST /api/v1/users</span>
                <span>&bull;</span>
                <span className="text-red-600 font-semibold">HTTP 500 Internal Server Error</span>
              </div>
            </div>

            {/* Dossier Tabs */}
            <div className="flex border-b border-[#E5E5E5] px-5 bg-white text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("dossier")}
                className={`py-3 px-3 font-medium border-b-2 transition-all ${
                  activeTab === "dossier"
                    ? "border-[#171717] text-[#171717]"
                    : "border-transparent text-[#737373] hover:text-[#171717]"
                }`}
              >
                Reproduction & Telemetry
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("trace")}
                className={`py-3 px-3 font-medium border-b-2 transition-all ${
                  activeTab === "trace"
                    ? "border-[#171717] text-[#171717]"
                    : "border-transparent text-[#737373] hover:text-[#171717]"
                }`}
              >
                3× Replay Evidence
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("pytest")}
                className={`py-3 px-3 font-medium border-b-2 transition-all ${
                  activeTab === "pytest"
                    ? "border-[#171717] text-[#171717]"
                    : "border-transparent text-[#737373] hover:text-[#171717]"
                }`}
              >
                Generated Pytest Suite
              </button>
            </div>

            {/* Dossier Content */}
            <div className="p-5">
              {activeTab === "dossier" && (
                <div className="space-y-4 text-xs">
                  <div>
                    <h5 className="font-semibold text-[#171717] mb-1.5">Reproduction Sequence</h5>
                    <ol className="list-decimal list-inside space-y-1 text-[#525252] bg-[#FAFAF9] p-3 rounded-lg border border-[#E5E5E5] font-mono text-[11px]">
                      <li>Navigate to <span className="text-[#171717] font-semibold">https://target.app/auth/signup</span></li>
                      <li>Fill <span className="text-[#171717] font-semibold">input#full-name</span> with &quot;Autonomous QA Runner&quot;</li>
                      <li>Fill <span className="text-[#171717] font-semibold">input#email</span> with &quot;qa.runner@@unhandled-domain..com&quot;</li>
                      <li>Dispatch submit event to <span className="text-[#171717] font-semibold">button[type=submit]</span></li>
                      <li>Observe unhandled HTTP 500 error page with raw server stack trace leaked to DOM.</li>
                    </ol>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-[#FAFAF9] rounded-lg border border-[#E5E5E5]">
                      <div className="text-[10px] uppercase font-mono text-[#A3A3A3] mb-1">Expected Behavior</div>
                      <p className="text-[#525252] text-xs leading-relaxed">
                        Form validates email formatting client-side or backend returns HTTP 400 Bad Request with actionable validation message.
                      </p>
                    </div>
                    <div className="p-3 bg-red-50/50 rounded-lg border border-red-200">
                      <div className="text-[10px] uppercase font-mono text-red-600 mb-1">Actual Behavior</div>
                      <p className="text-red-900 text-xs leading-relaxed">
                        Backend uncaught TypeError in regex parser, crashing worker and leaking Python stack trace to user browser.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "trace" && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-[#FAFAF9] rounded-lg border border-[#E5E5E5] space-y-2">
                    <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-[#E5E5E5]">
                      <span className="font-semibold text-[#171717]">Replay 1 &bull; Fresh Incognito Context</span>
                      <span className="text-red-600 font-bold">REPRODUCED (500)</span>
                    </div>
                    <p className="text-[11px] text-[#737373]">
                      Clean cookies, fresh viewport 1280x800. Clicked submit at t=1.2s. Status: 500 Internal Server Error.
                    </p>
                  </div>

                  <div className="p-3 bg-[#FAFAF9] rounded-lg border border-[#E5E5E5] space-y-2">
                    <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-[#E5E5E5]">
                      <span className="font-semibold text-[#171717]">Replay 2 &bull; Isolated Storage State</span>
                      <span className="text-red-600 font-bold">REPRODUCED (500)</span>
                    </div>
                    <p className="text-[11px] text-[#737373]">
                      Zero localStorage, network throttle disabled. Clicked submit at t=1.4s. Status: 500 Internal Server Error.
                    </p>
                  </div>

                  <div className="p-3 bg-[#FAFAF9] rounded-lg border border-[#E5E5E5] space-y-2">
                    <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-[#E5E5E5]">
                      <span className="font-semibold text-[#171717]">Replay 3 &bull; Sandbox Headless Process</span>
                      <span className="text-red-600 font-bold">REPRODUCED (500)</span>
                    </div>
                    <p className="text-[11px] text-[#737373]">
                      Fresh chromium pid. Clicked submit at t=1.1s. Status: 500 Internal Server Error.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "pytest" && (
                <div className="relative">
                  <div className="flex items-center justify-between pb-2 mb-2 text-xs text-[#737373]">
                    <span className="font-mono text-[11px]">tests/regression/test_auth_signup.py</span>
                    <button
                      type="button"
                      onClick={() => copyCode(samplePytest)}
                      className="flex items-center gap-1.5 text-xs text-[#171717] hover:text-[#F97316] font-medium"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copied" : "Copy Suite"}</span>
                    </button>
                  </div>
                  <pre className="p-4 bg-[#171717] text-zinc-200 rounded-lg font-mono text-[11px] leading-relaxed overflow-x-auto max-h-72">
                    {samplePytest}
                  </pre>
                </div>
              )}
            </div>

            {/* Dossier Footer */}
            <div className="p-3 bg-[#FAFAF9] border-t border-[#E5E5E5] flex items-center justify-between text-[11px] text-[#737373]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Deterministic artifact verified by DRISHTI Engine
              </span>
              <span className="font-mono">Format: Pytest 8.x + Playwright</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
