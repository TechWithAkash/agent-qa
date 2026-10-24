"use client";

import { useEffect, useRef, useState } from "react";
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
  Copy,
  ExternalLink,
  Layers,
  Activity,
  Maximize2,
  Lock,
  Compass,
  Zap,
} from "lucide-react";

export default function MultiAgentSwarmModal({
  isOpen,
  onClose,
  targetHostname,
  targetUrl,
  pipeline = [],
  currentAgentIndex = 0,
  displayAgentIdx = 0,
  setInspectedAgentIdx,
  isAllAgentsComplete = false,
  activeAgent,
  events = [],
  liveReplayStep = null,
}) {
  const telemetryEndRef = useRef(null);
  const [copiedLog, setCopiedLog] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto-scroll telemetry to bottom when new events arrive
  useEffect(() => {
    if (autoScroll && telemetryEndRef.current) {
      telemetryEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [events.length, autoScroll]);

  if (!isOpen) return null;

  const ActiveAgentIcon = activeAgent?.icon || Workflow;
  const totalStages = pipeline.length > 0 ? pipeline.length : 7;
  const progressPercent = isAllAgentsComplete
    ? 100
    : Math.min(100, Math.round(((displayAgentIdx + 1) / totalStages) * 100));

  const handleCopyLogs = () => {
    const text = events.map((e) => `[${e.stage || "AGENT"}] ${e.message}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  // Agent color palettes for stage identification
  const getStageColor = (idx) => {
    const colors = [
      "from-emerald-500 to-teal-500 text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      "from-blue-500 to-cyan-500 text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
      "from-[#2D9FFE] to-blue-600 text-sky-400 bg-[#2D9FFE]/10 border-[#2D9FFE]/30",
      "from-violet-500 to-purple-500 text-purple-400 bg-purple-500/10 border-purple-500/30",
      "from-amber-500 to-orange-500 text-amber-400 bg-amber-500/10 border-amber-500/30",
      "from-rose-500 to-red-500 text-rose-400 bg-rose-500/10 border-rose-500/30",
      "from-indigo-500 to-[#0055FF] text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
    ];
    return colors[idx % colors.length];
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="swarm-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      {/* High-Tech Ambient Backdrop Blur */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Glass Deck Container */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border border-[#e6e9ee] bg-white shadow-[0_25px_70px_-15px_rgba(0,0,0,0.25)] overflow-hidden my-auto text-[#000000] z-10 animate-in zoom-in-95 duration-200">
        
        {/* Top Smooth Electric Blue Pulse Track */}
        <div className="w-full bg-[#f4f4f5] h-1.5 overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-[#2D9FFE] via-[#0055FF] to-[#2D9FFE] transition-all duration-500 ease-out shadow-[0_0_12px_rgba(45,159,254,0.8)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Modal Scrollable Inner Body */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6">
          
          {/* =========================================================================
              1. HEADER: BRAND, SWARM STATUS & AUDIT TARGET
              ========================================================================= */}
          <div className="flex items-start justify-between gap-4 pb-2 border-b border-[#f0f0f0]">
            <div className="flex items-start gap-3.5">
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2D9FFE] to-[#0055FF] flex items-center justify-center text-white shrink-0 shadow-[0_4px_16px_rgba(45,159,254,0.35)] mt-0.5">
                <Workflow className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white border-2 border-[#2D9FFE]"></span>
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2
                    id="swarm-modal-title"
                    className="text-lg sm:text-xl font-bold text-[#000000] tracking-tight"
                  >
                    Autonomous Multi-Agent Swarm
                  </h2>
                  <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#2D9FFE]/10 text-[#0b7ee6] border border-[#2D9FFE]/20">
                    7 Agents Live
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#525252] mt-1">
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Globe className="w-3.5 h-3.5 text-[#2D9FFE]" />
                    <span className="text-[#000000] font-semibold">{targetHostname}</span>
                  </span>
                  <span>•</span>
                  <span className="text-emerald-700 font-mono text-[11px] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    TLS 1.3 Verified
                  </span>
                  <span>•</span>
                  <span className="text-[11px] text-[#737373] font-mono">
                    Chromium 130 Engine
                  </span>
                </div>
              </div>
            </div>

            {/* Right Stage & Close Controls */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:flex flex-col items-end text-right">
                <span className="text-xs font-mono font-bold text-[#000000]">
                  {isAllAgentsComplete ? "Verification 100%" : `Stage ${displayAgentIdx + 1} of 7`}
                </span>
                <span className="text-[10px] font-mono text-[#737373]">
                  {isAllAgentsComplete ? "All Invariants Proven" : `${progressPercent}% Orchestrated`}
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-[#fafafa] hover:bg-[#f0f0f0] border border-[#e6e9ee] flex items-center justify-center text-[#737373] hover:text-[#000000] transition-colors cursor-pointer"
                title="Minimize Swarm"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* =========================================================================
              2. ENGINEERED PIPELINE ORCHESTRATION TRACK (CONNECTED STEPPER)
              ========================================================================= */}
          <div className="bg-gradient-to-b from-[#fafafa] to-white border border-[#e6e9ee] rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#737373]">
              <span className="flex items-center gap-1.5 uppercase font-bold tracking-wider">
                <Activity className="w-3.5 h-3.5 text-[#2D9FFE]" />
                <span>PIPELINE ORCHESTRATION TIMELINE</span>
              </span>
              <span className="font-semibold text-[#000000]">
                {isAllAgentsComplete
                  ? "7 of 7 Agents Complete"
                  : `Active Stage: ${displayAgentIdx + 1}/7`}
              </span>
            </div>

            {/* Visual Connected Pipeline Stepper */}
            <div className="relative pt-1 pb-1">
              {/* Connecting background rail */}
              <div className="absolute top-5 inset-x-4 h-0.5 bg-[#e6e9ee] -translate-y-1/2 z-0 hidden sm:block" />
              
              {/* Connected active progress rail */}
              <div
                className="absolute top-5 left-4 h-0.5 bg-[#2D9FFE] -translate-y-1/2 z-0 hidden sm:block transition-all duration-500"
                style={{
                  width: `${Math.max(0, Math.min(100, (displayAgentIdx / 6) * 100))}%`,
                }}
              />

              <div className="grid grid-cols-7 gap-1 sm:gap-2 relative z-10">
                {pipeline.map((ag, idx) => {
                  const isPast =
                    (isAllAgentsComplete && liveReplayStep === null) || currentAgentIndex > idx;
                  const isCurrent = !isAllAgentsComplete && currentAgentIndex === idx;
                  const isSelected = displayAgentIdx === idx;

                  return (
                    <button
                      key={ag.key || idx}
                      type="button"
                      onClick={() => setInspectedAgentIdx && setInspectedAgentIdx(idx)}
                      className={`flex flex-col items-center gap-2 group transition-all text-center focus:outline-hidden cursor-pointer select-none ${
                        isSelected ? "scale-105" : "hover:scale-102 opacity-85 hover:opacity-100"
                      }`}
                      title={`Agent ${idx + 1}: ${ag.name}`}
                    >
                      {/* Node Circle */}
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all relative ${
                          isPast
                            ? "bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.35)]"
                            : isCurrent
                            ? "bg-[#2D9FFE] text-white ring-4 ring-[#2D9FFE]/25 shadow-[0_0_18px_rgba(45,159,254,0.45)]"
                            : isSelected
                            ? "bg-white text-[#000000] border-2 border-[#2D9FFE] shadow-sm"
                            : "bg-white border border-[#e6e9ee] text-[#a3a3a3]"
                        }`}
                      >
                        {isPast ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : isCurrent ? (
                          <span className="relative flex items-center justify-center">
                            <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-white opacity-40"></span>
                            <span>{idx + 1}</span>
                          </span>
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>

                      {/* Label & Status */}
                      <div className="space-y-0.5 w-full">
                        <span
                          className={`text-[10px] sm:text-xs tracking-tight truncate block ${
                            isCurrent || isSelected
                              ? "text-[#000000] font-bold"
                              : isPast
                              ? "text-emerald-700 font-semibold"
                              : "text-[#737373]"
                          }`}
                        >
                          {ag.shortLabel || ag.name.split(" ")[0]}
                        </span>
                        <span className="text-[9px] font-mono text-[#a3a3a3] hidden sm:block">
                          {isPast ? "Verified" : isCurrent ? "Active" : "Standby"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* =========================================================================
              3. ACTIVE AGENT SPOTLIGHT COMMAND DECK (HERO INTELLIGENCE CARD)
              ========================================================================= */}
          <div className="rounded-2xl border border-[#2D9FFE]/30 bg-gradient-to-br from-white via-[#f0f7ff]/40 to-white p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(45,159,254,0.12)] space-y-4 relative overflow-hidden">
            {/* Ambient Background Accent Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(45,159,254,0.08)_0%,transparent_70%)] pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#2D9FFE]/30 flex items-center justify-center text-[#2D9FFE] shrink-0 shadow-[0_2px_10px_rgba(45,159,254,0.2)]">
                  <ActiveAgentIcon className="w-6 h-6 text-[#2D9FFE]" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#0b7ee6] font-bold bg-[#2D9FFE]/10 border border-[#2D9FFE]/20 px-2 py-0.5 rounded-full">
                      {activeAgent.tag || "DOM MODELING"}
                    </span>
                    <span className="text-[11px] text-[#737373] font-mono">
                      Stage {displayAgentIdx + 1} of 7
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#000000] tracking-tight">
                    {activeAgent.name}
                  </h3>
                  <p className="text-xs text-[#525252] mt-0.5">{activeAgent.role}</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="shrink-0 self-start">
                {isAllAgentsComplete ? (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 font-mono text-[11px] font-bold text-emerald-700 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>VERIFIED &amp; FLAKE-FREE</span>
                  </span>
                ) : currentAgentIndex === displayAgentIdx ? (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#000000] text-white font-mono text-[11px] font-bold shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-[#2D9FFE] animate-ping"></span>
                    <span>ACTIVE AGENT RUNNING</span>
                  </span>
                ) : currentAgentIndex > displayAgentIdx ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 font-mono text-[11px] font-semibold text-emerald-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>COMPLETED</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-[#e6e9ee] font-mono text-[11px] text-[#a3a3a3]">
                    STANDBY IN QUEUE
                  </span>
                )}
              </div>
            </div>

            {/* Current Autonomous Action Callout */}
            <div className="rounded-xl bg-white border border-[#e6e9ee] p-4 text-xs shadow-2xs space-y-1.5 relative z-10">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#737373]">
                <span className="font-bold uppercase tracking-wider text-[#0b7ee6] flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#2D9FFE]" />
                  <span>CURRENT AUTONOMOUS ACTION</span>
                </span>
                <span className="text-emerald-700 font-semibold">Live Sandbox #3</span>
              </div>
              <p className="text-[#262626] leading-relaxed text-xs sm:text-sm font-sans font-medium">
                {activeAgent.actionSummary
                  ? activeAgent.actionSummary(targetHostname)
                  : activeAgent.description}
              </p>
            </div>
          </div>

          {/* =========================================================================
              4. LIVE SANDBOX TELEMETRY TERMINAL (IDE / TERMINAL POLISH)
              ========================================================================= */}
          <div className="rounded-2xl border border-[#2d333b] bg-[#0d1117] overflow-hidden shadow-2xl font-mono text-xs">
            {/* Terminal Header Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-[#2d333b] text-zinc-400">
              <div className="flex items-center gap-3">
                {/* macOS control dots */}
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-semibold text-zinc-200">
                  <Terminal className="w-3.5 h-3.5 text-[#2D9FFE]" />
                  <span>Live Sandbox Telemetry Stream</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Streaming ({events.length} events)</span>
                </span>

                <button
                  type="button"
                  onClick={handleCopyLogs}
                  className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer text-[10px] flex items-center gap-1"
                >
                  {copiedLog ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Logs</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Terminal Log Lines */}
            <div
              className="max-h-[220px] overflow-y-auto p-4 sm:p-5 space-y-2 text-zinc-200 leading-relaxed font-mono text-[11px] sm:text-xs"
              onMouseEnter={() => setAutoScroll(false)}
              onMouseLeave={() => setAutoScroll(true)}
            >
              {events.length > 0 ? (
                events.map((ev, i) => {
                  const stageCode = ev.stage || "S1";
                  return (
                    <div
                      key={ev.seq || i}
                      className="flex items-start gap-2.5 hover:bg-white/5 p-1 rounded transition-colors group"
                    >
                      <span className="text-zinc-500 shrink-0 select-none text-[10px] sm:text-[11px]">
                        {ev.ts ? new Date(ev.ts).toLocaleTimeString() : "--:--:--"}
                      </span>
                      <span className="rounded px-1.5 py-0.2 text-[10px] font-bold shrink-0 bg-[#2D9FFE]/15 text-[#38bdf8] border border-[#2D9FFE]/30">
                        [{stageCode}]
                      </span>
                      <span className="text-zinc-200 font-normal break-words leading-relaxed flex-1">
                        {ev.message}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-zinc-500 text-center py-6 space-y-1">
                  <p>Initializing headless Chromium browser sandbox...</p>
                  <p className="text-[10px] text-zinc-600">Performing preflight TLS handshake &amp; DNS probe</p>
                </div>
              )}
              <div ref={telemetryEndRef} />
            </div>
          </div>

          {/* =========================================================================
              5. BOTTOM ACTION FOOTER
              ========================================================================= */}
          <div className="pt-2">
            {isAllAgentsComplete ? (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#2D9FFE] text-white hover:bg-[#0b7ee6] transition-all text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(45,159,254,0.35)] cursor-pointer group"
              >
                <span>View Full Executive QA Report &amp; Flaws</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-[#fafafa] p-3 rounded-2xl border border-[#e6e9ee]">
                <div className="flex items-center gap-2.5 text-[#525252]">
                  <RotateCcw className="w-4 h-4 animate-spin text-[#2D9FFE] shrink-0" />
                  <span className="truncate">
                    Dispatching 3× isolated browser replay context passes across Chromium sandboxes...
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#e6e9ee] hover:bg-[#f0f0f0] text-[#000000] font-semibold transition-colors cursor-pointer shrink-0"
                >
                  Peek at Report Behind
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
