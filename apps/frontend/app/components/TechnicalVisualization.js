"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  CheckCircle2,
  Cpu,
  Layers,
  RotateCcw,
  Search,
  ShieldCheck,
  Terminal,
  Zap,
} from "lucide-react";

export default function TechnicalVisualization() {
  const [activeStep, setActiveStep] = useState(2);
  const [pulseIndex, setPulseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % 4);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const pipelineStages = [
    {
      id: "S1",
      name: "Frontier Crawler",
      label: "State Graph Explorer",
      icon: Search,
      metrics: "34 routes • 12 forms mapped",
      status: "COMPLETED",
    },
    {
      id: "S2",
      name: "Assertion DSL",
      label: "Semantic Invariant Planner",
      icon: Layers,
      metrics: "6 core journeys synthesized",
      status: "COMPLETED",
    },
    {
      id: "S3",
      name: "3× Clean Replay",
      label: "Deterministic Browser Engine",
      icon: RotateCcw,
      metrics: "3/3 fresh contexts matched",
      status: "ACTIVE",
    },
    {
      id: "S4",
      name: "Pytest Codegen",
      label: "CI/CD Test Artifact",
      icon: Terminal,
      metrics: "test_suite_v1.py generated",
      status: "READY",
    },
  ];

  return (
    <div className="relative w-full rounded-2xl border border-[#e4e4e7] bg-white p-6 shadow-sm backdrop-blur-md overflow-hidden">
      {/* Top Header & Telemetry */}
      <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="font-mono text-xs font-semibold tracking-wider text-zinc-600 uppercase">
            Execution Engine Telemetry
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-zinc-500">
          <span>LATENCY: <strong className="text-zinc-900">18ms</strong></span>
          <span className="hidden sm:inline">&bull;</span>
          <span className="hidden sm:inline">ENGINE: <strong className="text-zinc-900 font-semibold">Chromium headless</strong></span>
        </div>
      </div>

      {/* Interactive Execution Flow Graph */}
      <div className="mt-5 space-y-3">
        {pipelineStages.map((stage, idx) => {
          const Icon = stage.icon;
          const isSelected = activeStep === idx;
          const isPulsing = pulseIndex === idx;

          return (
            <div
              key={stage.id}
              onClick={() => setActiveStep(idx)}
              className={`group relative flex items-center justify-between rounded-xl border p-3.5 transition-all cursor-pointer ${
                isSelected
                  ? "border-[#000000] bg-zinc-50 shadow-xs"
                  : "border-[#e4e4e7] bg-white hover:border-zinc-400 hover:bg-zinc-50/50"
              }`}
            >
              {/* Left stage indicator & info */}
              <div className="flex items-center gap-3.5">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border font-mono text-xs font-bold transition-all ${
                    isSelected
                      ? "border-black bg-black text-white"
                      : "border-[#e4e4e7] bg-zinc-100 text-zinc-600 group-hover:text-zinc-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-[#FF9500]">
                      {stage.id}
                    </span>
                    <span className="text-xs font-bold text-zinc-900">
                      {stage.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 hidden sm:inline font-mono">
                      &mdash; {stage.label}
                    </span>
                  </div>
                  <div className="mt-0.5 font-mono text-[11px] text-zinc-500">
                    {stage.metrics}
                  </div>
                </div>
              </div>

              {/* Right badge */}
              <div className="flex items-center gap-2">
                {stage.status === "ACTIVE" ? (
                  <span className="flex items-center gap-1.5 rounded-full border border-orange-300 bg-orange-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-orange-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF9500] animate-ping"></span>
                    VERIFYING
                  </span>
                ) : stage.status === "COMPLETED" ? (
                  <span className="flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    PASS
                  </span>
                ) : (
                  <span className="rounded-full border border-zinc-200 bg-zinc-100 px-2 py-0.5 font-mono text-[10px] text-zinc-500">
                    STANDBY
                  </span>
                )}
              </div>

              {/* Subtle active border glow */}
              {isPulsing && (
                <div className="absolute inset-0 rounded-xl border border-black/20 pointer-events-none animate-pulse"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Terminal Live Trace Output */}
      <div className="mt-5 rounded-xl border border-zinc-800 bg-[#0c0d12] p-3.5 font-mono text-[11px] leading-relaxed text-zinc-300 shadow-inner">
        <div className="flex items-center justify-between text-[10px] text-zinc-400 pb-2 mb-2 border-b border-zinc-800">
          <span className="flex items-center gap-1.5 text-orange-400 font-semibold">
            <Terminal className="h-3 w-3" />
            <span>LIVE_EXPLORATION_TRACE</span>
          </span>
          <span className="text-[10px] text-emerald-400 font-mono font-medium">0 REPLAY FLAKES</span>
        </div>
        <div className="space-y-1">
          <div className="text-zinc-400">
            <span className="text-[#FF9500]">[00:01.12]</span> DISPATCH: Navigation &rarr; Target DOM root
          </div>
          <div className="text-zinc-400">
            <span className="text-[#FF9500]">[00:01.38]</span> FINGERPRINT: 18 interactive controls extracted
          </div>
          <div className="text-emerald-400 font-medium">
            <span className="text-[#FF9500]">[00:01.89]</span> INVARIANT: Clean replay pass 1/3, 2/3, 3/3 confirmed
          </div>
          <div className="text-white font-medium">
            <span className="text-emerald-400">&gt;</span> Ready to export Pytest specification
          </div>
        </div>
      </div>
    </div>
  );
}
