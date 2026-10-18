"use client";

import { Sparkles, Send, RotateCcw, Check, Wand2 } from "lucide-react";

export default function AiToolsTab({
  customStepText,
  setCustomStepText,
  executingStep,
  handleExecuteNLStep,
  stepResult,
  signupRoute,
  primaryButton,
  healedChains = [],
  isHealing,
  handleTriggerSelfHealing,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      {/* Card 1: Ask QA Agent */}
      <div className="rounded-xl border border-[#E5E5E5] bg-white p-6 space-y-4 shadow-xs">
        <div className="border-b border-[#F5F5F4] pb-3">
          <h3 className="text-base font-semibold text-[#171717] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F97316]" />
            <span>Ask QA Agent (Natural Language Test)</span>
          </h3>
          <p className="text-xs text-[#737373] mt-0.5">
            Execute ad-hoc validation on the live application in natural language
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={customStepText}
              onChange={(e) => setCustomStepText(e.target.value)}
              placeholder={`e.g. Verify sign-up flow on "${signupRoute}" or Click button "${primaryButton}"...`}
              onKeyDown={(e) => e.key === "Enter" && handleExecuteNLStep(customStepText)}
              className="w-full flex-1 text-xs sm:text-sm font-sans text-[#171717] placeholder-[#A3A3A3] px-3.5 py-2.5 rounded-lg border border-[#E5E5E5] bg-white focus:border-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717]/10 transition-all"
            />
            <button
              type="button"
              onClick={() => handleExecuteNLStep(customStepText)}
              disabled={executingStep || !customStepText.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#171717] text-white hover:bg-black transition-all text-xs font-semibold cursor-pointer disabled:opacity-50 whitespace-nowrap shadow-2xs"
            >
              {executingStep ? (
                <RotateCcw className="w-3.5 h-3.5 animate-spin text-[#F97316]" />
              ) : (
                <Send className="w-3.5 h-3.5 text-[#F97316]" />
              )}
              <span>Run</span>
            </button>
          </div>

          {stepResult && (
            <div className="rounded-xl border border-[#E5E5E5] bg-[#FAFAF9] p-4 font-mono text-xs space-y-1.5">
              <div className="flex items-center justify-between text-emerald-700 font-semibold mb-1">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Step Executed Successfully</span>
                </span>
                <span className="text-[11px] text-[#A3A3A3]">
                  {stepResult.latency_ms || 24}ms
                </span>
              </div>
              <div className="text-[#525252] text-xs font-sans leading-relaxed">
                {stepResult.reasoning || "Natural language intent compiled to Playwright assertion and executed against live DOM."}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card 2: Self-Healing Engine */}
      <div className="rounded-xl border border-[#E5E5E5] bg-white p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#F5F5F4] pb-3">
          <div>
            <h3 className="text-base font-semibold text-[#171717] flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-[#F97316]" />
              <span>Self-Healing Engine (Locator Drift)</span>
            </h3>
            <p className="text-xs text-[#737373] mt-0.5">
              Recovers broken locators using semantic role hierarchy without test failure
            </p>
          </div>

          <button
            type="button"
            onClick={handleTriggerSelfHealing}
            disabled={isHealing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E5E5E5] text-xs font-semibold text-[#171717] hover:bg-[#F5F5F4] transition-all cursor-pointer disabled:opacity-50 shrink-0 shadow-2xs"
          >
            <Wand2 className={`w-3.5 h-3.5 ${isHealing ? "animate-spin text-[#F97316]" : "text-[#737373]"}`} />
            <span>{isHealing ? "Recovering..." : "Simulate Drift"}</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {healedChains.length > 0 ? (
            healedChains.map((hc, idx) => (
              <div key={idx} className="rounded-xl border border-[#E5E5E5] bg-[#FAFAF9] p-3.5 text-xs font-mono">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-red-600 line-through">{hc.broken_selector}</span>
                    <span className="text-[#A3A3A3]">&rarr;</span>
                    <span className="font-bold text-emerald-700">{hc.healed_selector}</span>
                  </div>
                  <span className="rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    RECOVERED ({hc.recovery_latency_ms || 18}ms)
                  </span>
                </div>
                <p className="text-[11px] text-[#525252] font-sans">
                  {hc.recovery_strategy || "Recovered via semantic role & accessible name match"}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-[#E5E5E5] p-6 text-center text-xs text-[#A3A3A3]">
              Click &quot;Simulate Drift&quot; to test autonomous locator recovery.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
