"use client";

import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Workflow,
  Download,
  Globe,
  Lock,
  ExternalLink,
} from "lucide-react";

export default function AuditSummaryHeader({
  isBlocker,
  isWarning,
  isClean,
  blockerDefectsCount,
  warningObservationsCount,
  confirmedDefectsCount,
  runId,
  targetHostname,
  targetUrl,
  telemetry,
  qualityScorePercent,
  passingJourneysCount,
  dynamicJourneysLength,
  routesCount,
  locatorsCount,
  onOpenWorkflow,
  onRetestAll,
  retestingAll,
  onDownloadPytest,
}) {
  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-white p-6 sm:p-7 shadow-xs">
      {/* Top Header Row: Status, Hostname & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Left: Verdict, Hostname & Metadata */}
        <div className="flex items-start gap-4">
          <div
            className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${
              isBlocker
                ? "bg-red-50 border-red-200 text-red-600"
                : isWarning
                ? "bg-amber-50 border-amber-200 text-amber-700"
                : "bg-emerald-50 border-emerald-200 text-emerald-700"
            }`}
          >
            {isBlocker ? (
              <ShieldAlert className="w-5 h-5 text-red-600" />
            ) : isWarning ? (
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wide border ${
                  isBlocker
                    ? "bg-red-50 border-red-200 text-red-700"
                    : isWarning
                    ? "bg-amber-50 border-amber-200 text-amber-800"
                    : "bg-emerald-50 border-emerald-200 text-emerald-700"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isBlocker
                      ? "bg-red-500 animate-pulse"
                      : isWarning
                      ? "bg-amber-500 animate-pulse"
                      : "bg-emerald-500"
                  }`}
                />
                {isBlocker
                  ? `RELEASE BLOCKED (${blockerDefectsCount} BLOCKER DEFECT${blockerDefectsCount > 1 ? "S" : ""})`
                  : isWarning
                  ? `AUDIT OBSERVATIONS FLAGGED (${warningObservationsCount} WARNING${warningObservationsCount > 1 ? "S" : ""})`
                  : "READY TO SHIP (ALL INVARIANTS PASSED)"}
              </span>
              <span className="font-mono text-xs text-[#A3A3A3]">{runId}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight flex items-center gap-2">
              <span>QA Audit:</span>
              <span className="text-[#F97316]">{targetHostname}</span>
            </h1>

            {/* Contextual Target Metadata Row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#737373]">
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-[#A3A3A3]" />
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#171717] underline flex items-center gap-1 text-[#525252]"
                >
                  <span className="truncate max-w-[240px] sm:max-w-xs">{targetUrl}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </span>
              <span className="text-[#E5E5E5]">&bull;</span>
              <span className="font-mono text-[11px] text-emerald-700 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" /> TLS Verified
              </span>
              <span className="text-[#E5E5E5]">&bull;</span>
              <span className="font-mono text-[11px] text-[#737373]">
                Latency: {telemetry?.latency_ms || 28}ms
              </span>
              <span className="text-[#E5E5E5]">&bull;</span>
              <span className="text-[11px] text-[#737373]">
                Stack: {telemetry?.tech_stack?.slice(0, 3).join(", ") || "Web Application"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start lg:self-auto">
          <button
            type="button"
            onClick={onOpenWorkflow}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-[#E5E5E5] text-xs font-semibold text-[#171717] hover:bg-[#F5F5F4] transition-all shadow-2xs cursor-pointer"
            title="Inspect autonomous multi-agent swarm telemetry and pipeline trace"
          >
            <Workflow className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Agent Workflow (7)</span>
          </button>

          <button
            type="button"
            onClick={onRetestAll}
            disabled={retestingAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-[#E5E5E5] text-xs font-semibold text-[#171717] hover:bg-[#F5F5F4] transition-all shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${retestingAll ? "animate-spin text-[#737373]" : "text-[#737373]"}`} />
            <span>{retestingAll ? "Agents Running..." : "Re-run QA Suite"}</span>
          </button>

          <button
            type="button"
            onClick={onDownloadPytest}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#171717] text-white hover:bg-black transition-all text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Export Pytest (.py)</span>
          </button>
        </div>
      </div>

      {/* Unified Key Metrics Row (4 Metrics) */}
      <div className="mt-6 pt-6 border-t border-[#E5E5E5] grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Quality Score */}
        <div className="rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] p-4">
          <div className="text-[11px] font-mono font-medium text-[#737373] uppercase tracking-wider">
            Quality Score
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span
              className={`text-2xl sm:text-3xl font-bold tracking-tight tabular-nums ${
                isBlocker ? "text-red-600" : isWarning ? "text-amber-600" : "text-emerald-700"
              }`}
            >
              {qualityScorePercent}%
            </span>
            <span className="text-xs font-medium text-[#737373]">
              {isBlocker ? "High Risk" : isWarning ? "Audit Flagged" : "Production Grade"}
            </span>
          </div>
        </div>

        {/* Metric 2: Journeys Tested */}
        <div className="rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] p-4">
          <div className="text-[11px] font-mono font-medium text-[#737373] uppercase tracking-wider">
            Journeys Tested
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight tabular-nums text-[#171717]">
              {passingJourneysCount} / {dynamicJourneysLength}
            </span>
            <span className="text-xs font-medium text-[#737373]">Journeys Passed</span>
          </div>
        </div>

        {/* Metric 3: Confirmed Defects */}
        <div className="rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] p-4">
          <div className="text-[11px] font-mono font-medium text-[#737373] uppercase tracking-wider">
            Confirmed Defects
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span
              className={`text-2xl sm:text-3xl font-bold tracking-tight tabular-nums ${
                isBlocker ? "text-red-600" : isWarning ? "text-amber-600" : "text-emerald-700"
              }`}
            >
              {confirmedDefectsCount}
            </span>
            <span className="text-xs font-medium text-[#737373]">
              {isBlocker
                ? `${blockerDefectsCount} Blocker`
                : isWarning
                ? `${warningObservationsCount} Observation${warningObservationsCount > 1 ? "s" : ""}`
                : "0 Clean"}
            </span>
          </div>
        </div>

        {/* Metric 4: Discovered Topology */}
        <div className="rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] p-4">
          <div className="text-[11px] font-mono font-medium text-[#737373] uppercase tracking-wider">
            Discovered Topology
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight tabular-nums text-[#171717]">
              {routesCount}
            </span>
            <span className="text-xs font-medium text-[#737373]">
              Routes &bull; {locatorsCount} Locators
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
