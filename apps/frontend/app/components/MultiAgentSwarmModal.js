"use client";

import { useEffect, useRef } from "react";
import {
  Workflow,
  X,
  Check,
  CheckCircle2,
  RotateCcw,
  Terminal,
  ArrowRight,
  ShieldCheck,
  Globe,
  Cpu,
  Sparkles,
  Play,
  AlertTriangle,
  FileCode2,
} from "lucide-react";

export default function MultiAgentSwarmModal({
  isOpen,
  onClose,
  targetHostname,
  targetUrl,
  pipeline,
  currentAgentIndex,
  displayAgentIdx,
  setInspectedAgentIdx,
  isAllAgentsComplete,
  activeAgent,
  events = [],
  liveReplayStep,
}) {
  const telemetryEndRef = useRef(null);

  // Auto-scroll telemetry to bottom when new events arrive
  useEffect(() => {
    if (telemetryEndRef.current) {
      telemetryEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [events.length]);

  if (!isOpen) return null;

  const ActiveAgentIcon = activeAgent?.icon || Workflow;
  const progressPercent = isAllAgentsComplete
    ? 100
    : Math.min(100, Math.round(((displayAgentIdx + 1) / 7) * 100));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="swarm-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-[#E5E5E5] bg-white shadow-2xl overflow-hidden my-auto text-[#171717]">
        {/* Subtle Top Progress Track */}
        <div className="w-full bg-[#F5F5F4] h-1.5 overflow-hidden">
          <div
            className="h-full bg-[#F97316] transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Modal Scrollable Inner Body */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-1">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-center text-[#171717] shrink-0 shadow-2xs mt-0.5">
                <Workflow className="w-5 h-5 text-[#F97316]" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2
                    id="swarm-modal-title"
                    className="text-lg sm:text-xl font-semibold text-[#171717] tracking-tight"
                  >
                    Autonomous Multi-Agent Swarm
                  </h2>
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-[#F5F5F4] text-[#737373] border border-[#E5E5E5]">
                    7 Agents
                  </span>
                </div>
                <p className="text-xs text-[#737373] mt-1 flex items-center gap-1.5">
                  <span>Auditing target:</span>
                  <span
                    className="font-medium text-[#171717] truncate max-w-xs sm:max-w-md"
                    title={targetUrl || targetHostname}
                  >
                    {targetHostname}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-[#737373] hidden sm:inline-block">
                {isAllAgentsComplete
                  ? "7 of 7 Agents Complete"
                  : `Agent ${Math.min(displayAgentIdx + 1, 7)} of 7`}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F4] transition-colors cursor-pointer"
                title="Close modal"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 7-Stage Refined Stepper Timeline */}
          <div className="bg-[#FAFAF9] border border-[#E5E5E5] rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#737373] mb-4 pb-2 border-b border-[#E5E5E5]">
              <span>PIPELINE ORCHESTRATION TIMELINE</span>
              <span>
                {isAllAgentsComplete
                  ? "All Stages Verified"
                  : `Active Stage: ${displayAgentIdx + 1}/7`}
              </span>
            </div>

            {/* Stepper Nodes */}
            <div className="relative">
              <div className="grid grid-cols-7 gap-1 sm:gap-2 relative z-10">
                {pipeline.map((ag, idx) => {
                  const isPast =
                    (isAllAgentsComplete && liveReplayStep === null) || currentAgentIndex > idx;
                  const isCurrent = !isAllAgentsComplete && currentAgentIndex === idx;
                  const isSelected = displayAgentIdx === idx;

                  return (
                    <button
                      key={ag.key}
                      type="button"
                      onClick={() => setInspectedAgentIdx(idx)}
                      className={`flex flex-col items-center gap-2 group transition-all text-center focus:outline-none ${
                        isSelected ? "scale-[1.02]" : "opacity-80 hover:opacity-100"
                      }`}
                    >
                      {/* Node Circle */}
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-mono text-xs font-semibold transition-all ${
                          isPast
                            ? "bg-emerald-50 border border-emerald-300 text-emerald-700 shadow-2xs"
                            : isCurrent
                            ? "bg-[#171717] border-2 border-[#171717] text-white ring-4 ring-[#F97316]/20 shadow-xs"
                            : "bg-white border border-[#E5E5E5] text-[#A3A3A3]"
                        }`}
                      >
                        {isPast ? <Check className="w-4 h-4 text-emerald-600" /> : idx + 1}
                      </div>

                      {/* Label */}
                      <span
                        className={`text-[11px] sm:text-xs tracking-tight truncate w-full ${
                          isSelected
                            ? "text-[#171717] font-semibold"
                            : isPast
                            ? "text-emerald-800 font-medium"
                            : "text-[#737373]"
                        }`}
                      >
                        {ag.shortLabel || ag.tag.split(" ")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Agent Spotlight Panel */}
          <div className="rounded-xl border border-[#E5E5E5] bg-[#FAFAF9] p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-white border border-[#E5E5E5] flex items-center justify-center text-[#171717] shrink-0 shadow-2xs">
                  <ActiveAgentIcon className="w-5 h-5 text-[#F97316]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#737373] font-semibold bg-white border border-[#E5E5E5] px-2 py-0.5 rounded">
                      {activeAgent.tag}
                    </span>
                    <span className="text-[11px] text-[#A3A3A3] font-mono">
                      Agent {displayAgentIdx + 1} of 7
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#171717] tracking-tight">
                    {activeAgent.name}
                  </h3>
                  <p className="text-xs text-[#737373] mt-0.5">{activeAgent.role}</p>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="shrink-0 self-start">
                {isAllAgentsComplete ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 font-mono text-[11px] font-semibold text-emerald-700 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>VERIFIED</span>
                  </span>
                ) : currentAgentIndex === displayAgentIdx ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#171717] text-white font-mono text-[11px] font-semibold shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse"></span>
                    <span>ACTIVE</span>
                  </span>
                ) : currentAgentIndex > displayAgentIdx ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 font-mono text-[11px] font-medium text-emerald-700">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>COMPLETED</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#F5F5F4] border border-[#E5E5E5] font-mono text-[11px] text-[#A3A3A3]">
                    STANDBY
                  </span>
                )}
              </div>
            </div>

            {/* Current Autonomous Action Box */}
            <div className="rounded-lg bg-white border border-[#E5E5E5] p-4 text-xs shadow-2xs">
              <span className="font-mono text-[10px] uppercase font-bold text-[#A3A3A3] tracking-wider block mb-1">
                CURRENT ACTION
              </span>
              <p className="text-[#525252] leading-relaxed text-xs sm:text-sm">
                {activeAgent.actionSummary
                  ? activeAgent.actionSummary(targetHostname)
                  : activeAgent.description}
              </p>
            </div>
          </div>

          {/* Live Telemetry Stream */}
          <div className="rounded-xl border border-[#27272A] bg-[#0E1015] p-4 sm:p-5 font-mono shadow-inner">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 mb-3 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#F97316]" />
                <span className="text-zinc-200 font-semibold">Live Sandbox Telemetry Stream</span>
              </div>
              <span className="text-emerald-400 flex items-center gap-1.5 text-[11px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Streaming ({events.length})</span>
              </span>
            </div>

            <div className="max-h-[175px] overflow-y-auto space-y-2 pr-1 font-mono text-xs">
              {events.length > 0 ? (
                events.slice(-8).map((ev, i) => (
                  <div key={ev.seq || i} className="flex items-start gap-2.5 leading-relaxed">
                    <span className="text-zinc-500 shrink-0 text-[11px]">
                      {ev.ts ? new Date(ev.ts).toLocaleTimeString() : "--:--:--"}
                    </span>
                    <span className="rounded bg-zinc-800/80 border border-zinc-700/60 px-1.5 py-0.2 text-[10px] font-semibold text-amber-300 shrink-0">
                      [{ev.stage || "S1"}]
                    </span>
                    <span className="text-zinc-200 font-normal break-words leading-relaxed text-[11px] sm:text-xs">
                      {ev.message}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-zinc-500 text-center py-4 text-xs">
                  Initializing isolated browser sandbox and preflight probe...
                </div>
              )}
              <div ref={telemetryEndRef} />
            </div>
          </div>

          {/* Bottom Action Area */}
          <div className="pt-2">
            {isAllAgentsComplete ? (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-4 rounded-lg bg-[#171717] text-white hover:bg-black transition-all text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>View Executive QA Report &amp; Flaws</span>
                <ArrowRight className="w-4 h-4 text-[#F97316]" />
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#737373]">
                  <RotateCcw className="w-3.5 h-3.5 animate-spin text-[#F97316]" />
                  <span>Executing sequential agent audits across isolated browser sandboxes...</span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-[#171717] font-semibold hover:underline cursor-pointer self-start sm:self-auto"
                >
                  Peek at Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
