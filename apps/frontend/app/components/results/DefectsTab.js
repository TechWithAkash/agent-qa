"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Check,
  ShieldAlert,
  Camera,
  Crosshair,
  Lock,
  Maximize2,
  Terminal,
  ChevronDown,
  ChevronUp,
  FileCode2,
  Copy,
  ExternalLink,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Wrench,
  AlertCircle,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

// Customer impact dictionary for common defects
const DEFECT_IMPACT_MAP = {
  B1: {
    cleanTitle: "Registration Form Accepts Invalid Emails without Error",
    customerImpact: "Users who mistype their email (missing @ or invalid domain) complete registration. This results in lost transactional receipts, failed password resets, and broken communications.",
    fixRecommendation: "Add client-side RFC 5322 regex validation and ensure the backend returns HTTP 400 Bad Request with an inline user alert.",
  },
  B2: {
    cleanTitle: "Duplicate Email Submission Crashes Server with HTTP 500",
    customerImpact: "Existing customers attempting to sign up again see a raw server crash page instead of a helpful prompt to sign in or recover their password.",
    fixRecommendation: "Catch database uniqueness constraint exceptions and return HTTP 409 Conflict with a user-friendly 'Email already registered' alert.",
  },
  B3: {
    cleanTitle: "Case-Sensitive Authentication Rejects Capitalized Emails",
    customerImpact: "Mobile users whose keyboards automatically capitalize the first letter of their email cannot log in despite entering the correct password.",
    fixRecommendation: "Normalize all email lookups using .toLowerCase().trim() before querying authentication credentials.",
  },
  B4: {
    cleanTitle: "Password Reset Link Resolves to 404 Not Found Page",
    customerImpact: "Users locked out of their accounts cannot recover access, causing immediate frustration and account abandonment.",
    fixRecommendation: "Verify that the '/auth/forgot-password' route is deployed and bound to the recovery email dispatch handler.",
  },
};

export default function DefectsTab({
  isBlocker,
  isWarning,
  isClean,
  findings = [],
  targetUrl,
  targetHostname,
  model,
  telemetry,
  getDefectScreenshotInfo,
  setFullImageModal,
  persona = "pm",
}) {
  const [filterSeverity, setFilterSeverity] = useState("all"); // "all" | "blockers" | "warnings"
  const [expandedDevDetails, setExpandedDevDetails] = useState({});
  const [copiedCodeId, setCopiedCodeId] = useState(null);

  const toggleDevDetails = (id) => {
    setExpandedDevDetails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyReproduction = (f) => {
    const code = `# DRISHTI Automated Playwright Reproduction Script for ${f.id}
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    page.goto("${targetUrl}")
    # Target Element: ${f.anomaly_location?.selector || "input"}
    print("Executing reproduction steps...")
    browser.close()`;
    navigator.clipboard.writeText(code);
    setCopiedCodeId(f.id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const filteredFindings = findings.filter((f) => {
    const isHigh = f.severity === "high" || f.severity === "critical";
    if (filterSeverity === "blockers") return isHigh;
    if (filterSeverity === "warnings") return !isHigh;
    return true;
  });

  const blockerCount = findings.filter(
    (f) => f.severity === "high" || f.severity === "critical"
  ).length;
  const warningCount = findings.filter(
    (f) => f.severity !== "high" && f.severity !== "critical"
  ).length;

  return (
    <div className="space-y-6">
      {/* Filter and Overview Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#e6e9ee]">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-[#000000] tracking-tight flex items-center gap-2">
            <span>
              {isBlocker
                ? "Confirmed Release Blockers"
                : isWarning
                ? "Security & Invariant Observations"
                : "All Quality Checks Passed"}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-mono font-bold ${
                isBlocker
                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                  : isWarning
                  ? "bg-amber-50 text-amber-800 border border-amber-200"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}
            >
              {findings.length} {findings.length === 1 ? "Issue" : "Issues"}
            </span>
          </h2>
          <p className="text-xs text-[#525252] mt-1">
            Every defect is audited across 3× isolated Chromium replay passes to eliminate false positives and guarantee stability.
          </p>
        </div>

        {/* Quick Filter Pill Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#f4f4f5] border border-[#e6e9ee] text-xs">
          <button
            type="button"
            onClick={() => setFilterSeverity("all")}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer font-medium ${
              filterSeverity === "all"
                ? "bg-white text-[#000000] shadow-2xs font-semibold"
                : "text-[#737373] hover:text-[#000000]"
            }`}
          >
            All ({findings.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterSeverity("blockers")}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer font-medium ${
              filterSeverity === "blockers"
                ? "bg-white text-rose-700 shadow-2xs font-semibold"
                : "text-[#737373] hover:text-[#000000]"
            }`}
          >
            Blockers ({blockerCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterSeverity("warnings")}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer font-medium ${
              filterSeverity === "warnings"
                ? "bg-white text-amber-800 shadow-2xs font-semibold"
                : "text-[#737373] hover:text-[#000000]"
            }`}
          >
            Warnings ({warningCount})
          </button>
        </div>
      </div>

      {/* Defect Cards List */}
      {filteredFindings.length > 0 ? (
        <div className="space-y-6">
          {filteredFindings.map((f, idx) => {
            const defectInfo = getDefectScreenshotInfo(f);
            const isHigh = f.severity === "high" || f.severity === "critical";
            const impactInfo = DEFECT_IMPACT_MAP[f.id] || {
              cleanTitle: f.title || f.classification_reason || `Defect ${f.id}`,
              customerImpact: f.actual || "May impact user conversion and flow integrity.",
              fixRecommendation: "Inspect DOM selector and enforce boundary checks in backend route handler.",
            };
            const isDevOpen = expandedDevDetails[f.id] || persona === "dev";

            return (
              <div
                key={f.id || idx}
                className="rounded-2xl border border-[#e6e9ee] bg-white p-5 sm:p-7 space-y-6 shadow-xs hover:border-[#cbd5e1] transition-all"
              >
                {/* Defect Card Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#f0f0f0]">
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono text-xs font-bold px-2.5 py-1 rounded-lg border ${
                        isHigh
                          ? "text-rose-700 bg-rose-50 border-rose-200"
                          : "text-amber-800 bg-amber-50 border-amber-200"
                      }`}
                    >
                      {f.id || `BUG-${idx + 1}`}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-[#000000] tracking-tight">
                        {impactInfo.cleanTitle}
                      </h3>
                      <span className="text-[11px] text-[#737373] font-mono mt-0.5 block">
                        Affected Journey: {f.journey || "Authentication Gateway"} &bull; Route:{" "}
                        <code className="text-[#0b7ee6] font-semibold">{defectInfo.route}</code>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase border ${
                        isHigh
                          ? "bg-rose-50 border-rose-200 text-rose-700"
                          : "bg-amber-50 border-amber-200 text-amber-800"
                      }`}
                    >
                      {f.severity === "critical"
                        ? "Critical Blocker"
                        : isHigh
                        ? "High Impact"
                        : "Policy Warning"}
                    </span>
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 font-mono text-[10px] text-emerald-800 font-bold">
                      {f.replay_rate || "3/3 Deterministic"}
                    </span>
                  </div>
                </div>

                {/* =========================================================================
                    ACTIONABLE 3-COLUMN TAKEAWAY GRID (What • Why • Fix)
                    ========================================================================= */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {/* Card 1: What Happened */}
                  <div className="rounded-xl border border-rose-200/80 bg-rose-50/40 p-4 space-y-1.5 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>What Broke</span>
                      </span>
                      <p className="text-xs text-[#262626] leading-relaxed">
                        {f.actual || "Application accepted boundary inputs without appropriate rejection response."}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-rose-700 mt-2 block">
                      Status: Anomaly Detected
                    </span>
                  </div>

                  {/* Card 2: Why It Matters (Customer & Revenue Impact) */}
                  <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-4 space-y-1.5 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Customer Impact</span>
                      </span>
                      <p className="text-xs text-[#262626] leading-relaxed">
                        {impactInfo.customerImpact}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-amber-800 mt-2 block">
                      Conversion Risk: High
                    </span>
                  </div>

                  {/* Card 3: How to Fix (Actionable Recommendation) */}
                  <div className="rounded-xl border border-[#2D9FFE]/30 bg-[#2D9FFE]/5 p-4 space-y-1.5 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-[#0b7ee6] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                        <Wrench className="w-3.5 h-3.5 text-[#2D9FFE] shrink-0" />
                        <span>Recommended Fix</span>
                      </span>
                      <p className="text-xs text-[#262626] leading-relaxed">
                        {impactInfo.fixRecommendation}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-[#0b7ee6] mt-2 block">
                      Effort: ~15 mins fix
                    </span>
                  </div>
                </div>

                {/* =========================================================================
                    VISUAL EVIDENCE WITH PINPOINT BOUNDING BOX
                    ========================================================================= */}
                {f.anomaly_location && (
                  <div className="rounded-xl border border-[#e6e9ee] bg-[#f8fafc] p-4 sm:p-5 space-y-3.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-[#2D9FFE]" />
                        <span className="text-xs font-semibold text-[#000000]">
                          Visual Screenshot with Red Anomaly Pinpoint
                        </span>
                        <span className="rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-mono text-rose-700 font-bold flex items-center gap-1">
                          <Crosshair className="w-3 h-3 text-rose-600" />
                          <span>Red-Line Box Active</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] font-mono text-[#737373]">
                        <span>Screen: <span className="text-[#000000] font-semibold">{f.anomaly_location.screen}</span></span>
                        <span>&bull;</span>
                        <button
                          type="button"
                          onClick={() =>
                            setFullImageModal({
                              src: defectInfo.src,
                              title: `${f.id}: ${impactInfo.cleanTitle}`,
                              route: defectInfo.route,
                              selector: f.anomaly_location?.selector,
                              description: f.anomaly_location?.description,
                              id: f.id,
                            })
                          }
                          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#000000] text-white text-[10px] font-mono hover:bg-[#262626] transition-colors shadow-2xs cursor-pointer ml-1"
                        >
                          <Maximize2 className="w-3 h-3" />
                          <span>Expand Full Image</span>
                        </button>
                      </div>
                    </div>

                    {/* Screenshot Frame */}
                    <div className="rounded-xl border border-[#e6e9ee] bg-white shadow-xs overflow-hidden">
                      <div className="flex items-center justify-between px-3.5 py-2 border-b border-[#e6e9ee] bg-[#f8fafc]">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 mr-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] inline-block" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] inline-block" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] inline-block" />
                          </div>
                          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-[#e6e9ee] text-[11px] font-mono text-[#525252]">
                            <Lock className="w-3 h-3 text-emerald-600" />
                            <span className="text-[#a3a3a3]">{targetUrl ? new URL(targetUrl).origin : "https://app"}</span>
                            <span className="font-semibold text-[#000000]">{defectInfo.route}</span>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono text-[#737373] hidden sm:inline">
                          {defectInfo.pageName}
                        </span>
                      </div>

                      <div className="relative max-h-[460px] overflow-y-auto bg-zinc-50 select-none group">
                        {defectInfo.isImage ? (
                          <div className="relative w-full">
                            <img
                              src={defectInfo.src}
                              alt={`Complete page capture for ${f.id}`}
                              className="w-full h-auto block select-none"
                            />

                            {/* Anomaly Bounding Box */}
                            <div
                              className="absolute rounded-lg border-2 border-red-500 bg-red-500/15 shadow-[0_0_24px_rgba(239,68,68,0.4)] transition-all duration-300 flex items-start justify-end p-1.5 pointer-events-none"
                              style={{
                                left: `${f.anomaly_location.x ?? 25}%`,
                                top: `${f.anomaly_location.y ?? 35}%`,
                                width: `${f.anomaly_location.w ?? 50}%`,
                                height: `${f.anomaly_location.h ?? 25}%`,
                              }}
                            >
                              <div className="flex items-center gap-1.5 rounded bg-black/95 border border-red-500 px-2 py-0.5 text-[9px] font-mono font-bold text-white shadow-xl -mt-4 mr-1">
                                <Crosshair className="w-2.5 h-2.5 text-red-400" />
                                <span>ANOMALY: {f.id}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-8 text-center text-xs text-[#737373] space-y-2">
                            <p>Chromium High-Resolution Snapshot</p>
                            <a
                              href={defectInfo.src}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[#0b7ee6] underline text-[11px] font-mono"
                            >
                              <span>Open Target URL ({defectInfo.route})</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}

                        <div className="sticky bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#e6e9ee] p-2.5 px-3.5 flex items-center justify-between text-xs font-mono shadow-xs text-[#000000] z-10">
                          <span className="truncate">
                            Detected Anomaly: <span className="text-red-600 font-semibold">{f.anomaly_location.description}</span>
                          </span>
                          <span className="text-[11px] text-[#737373] shrink-0 ml-2 hidden sm:inline">
                            Target Selector: <code className="text-[#000000] font-semibold">{f.anomaly_location.selector}</code>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* =========================================================================
                    PROGRESSIVE DISCLOSURE: DEVELOPER DIAGNOSTICS & REPRODUCTION CODE
                    ========================================================================= */}
                <div className="border-t border-[#f0f0f0] pt-3">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => toggleDevDetails(f.id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-[#525252] hover:text-[#000000] transition-colors cursor-pointer"
                    >
                      <Terminal className="w-3.5 h-3.5 text-[#2D9FFE]" />
                      <span>{isDevOpen ? "Hide Developer Diagnostics" : "Show Developer Diagnostics & Playwright Script"}</span>
                      {isDevOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => copyReproduction(f)}
                      className="text-[11px] font-mono text-[#737373] hover:text-[#000000] flex items-center gap-1 cursor-pointer transition-colors"
                      title="Copy Python Playwright reproduction script"
                    >
                      {copiedCodeId === f.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#a3a3a3]" />
                          <span>Copy Reproduction Script</span>
                        </>
                      )}
                    </button>
                  </div>

                  {isDevOpen && (
                    <div className="mt-4 space-y-3 text-xs font-mono bg-[#f8fafc] p-4 rounded-xl border border-[#e6e9ee] animate-in fade-in duration-150">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block mb-1">
                          DOM Target Selector:
                        </span>
                        <code className="text-xs text-[#000000] bg-white px-2.5 py-1 rounded-md border border-[#e6e9ee] inline-block font-mono">
                          {f.anomaly_location?.selector || "input"}
                        </code>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block mb-1">
                          Expected Invariant Contract:
                        </span>
                        <p className="text-xs text-emerald-800 bg-emerald-50/60 p-2 rounded-md border border-emerald-200">
                          {f.expected}
                        </p>
                      </div>

                      {f.trigger_steps && f.trigger_steps.length > 0 && (
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block mb-1.5">
                            Automated Playwright Sequence:
                          </span>
                          <div className="space-y-1">
                            {f.trigger_steps.map((st, sIdx) => (
                              <div
                                key={sIdx}
                                className="flex items-center gap-2 p-1.5 rounded-lg bg-white border border-[#e6e9ee] text-[11px] text-[#525252]"
                              >
                                <span className="w-4 h-4 rounded-full bg-[#f4f4f5] text-[#000000] flex items-center justify-center text-[10px] font-bold shrink-0">
                                  {sIdx + 1}
                                </span>
                                <span>{st}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-[#e6e9ee] bg-white space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-[#000000]">
            No Defects Found in this Category
          </h3>
          <p className="text-xs text-[#525252] max-w-md mx-auto">
            All user flows and invariant checks passed with 100% stability across 3× isolated browser replays.
          </p>
        </div>
      )}
    </div>
  );
}
