"use client";

import {
  Check,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Camera,
  Maximize2,
} from "lucide-react";

export default function JourneysTab({
  dynamicJourneys = [],
  passingJourneysCount,
  expandedJourney,
  setExpandedJourney,
  getWorkflowScreens,
  setFullImageModal,
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E5E5]">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-[#171717] tracking-tight">
            Audited User Journeys &amp; Invariant Tests
          </h2>
          <p className="text-xs text-[#737373] mt-1">
            Autonomous scenario formulation tested against live authentication gateways and interactive targets
          </p>
        </div>
        <span className="font-mono text-xs text-[#525252] bg-[#FAFAF9] border border-[#E5E5E5] px-3 py-1 rounded-lg">
          {passingJourneysCount} of {dynamicJourneys.length} Passed
        </span>
      </div>

      {/* Accordion Journey Cards */}
      <div className="space-y-3">
        {dynamicJourneys.map((j) => {
          const isExpanded = expandedJourney === j.id;
          const isDefect = j.status === "DEFECT DETECTED";
          const isWarning = j.status === "POLICY WARNING";

          return (
            <div
              key={j.id}
              className="rounded-xl border border-[#E5E5E5] bg-white overflow-hidden transition-all hover:border-[#D4D4D4] shadow-xs"
            >
              {/* Accordion Trigger */}
              <div
                onClick={() => setExpandedJourney(isExpanded ? null : j.id)}
                className="flex items-center justify-between p-4 sm:p-5 cursor-pointer hover:bg-[#FAFAF9]/60 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      isDefect
                        ? "bg-red-50 text-red-600 border border-red-200"
                        : isWarning
                        ? "bg-amber-50 text-amber-600 border border-amber-200"
                        : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    }`}
                  >
                    {isDefect || isWarning ? (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-semibold text-[#171717]">{j.title}</h3>
                      <span className="text-[10px] text-[#737373] font-mono bg-[#FAFAF9] border border-[#E5E5E5] px-1.5 py-0.5 rounded">
                        {j.category}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[#737373] mt-0.5 block">
                      Target: {j.target}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`rounded-md px-2.5 py-0.5 font-mono text-[10px] font-bold ${
                      isDefect
                        ? "border border-red-200 bg-red-50 text-red-700"
                        : isWarning
                        ? "border border-amber-200 bg-amber-50 text-amber-800"
                        : "border border-emerald-200 bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {j.status}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#A3A3A3]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#A3A3A3]" />
                  )}
                </div>
              </div>

              {/* Accordion Expanded Detail Panel */}
              {isExpanded && (
                <div className="border-t border-[#E5E5E5] bg-[#FAFAF9]/80 p-5 text-xs font-mono space-y-4">
                  <div className="text-xs text-[#525252] font-sans leading-relaxed">{j.details}</div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#737373] block mb-2 font-mono">
                      Executed Playwright Invariant Assertions:
                    </span>
                    <div className="space-y-1.5">
                      {j.assertions.map((ast, i) => (
                        <div
                          key={i}
                          className="text-[#262626] text-[11px] bg-white p-2.5 rounded-lg border border-[#E5E5E5] shadow-2xs font-mono"
                        >
                          &gt; {ast}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Workflow Screenshot Trace */}
                  {(() => {
                    const screens = getWorkflowScreens(j);
                    return (
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#737373] block mb-2 flex items-center gap-1.5 font-mono">
                          <Camera className="w-3.5 h-3.5 text-[#F97316]" />
                          <span>Workflow Step Screenshot Capture:</span>
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                          {/* Pre-Action Render */}
                          <div className="rounded-xl border border-[#E5E5E5] bg-white p-3.5 space-y-2 shadow-xs">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-semibold text-[#171717] flex items-center gap-1.5">
                                <Camera className="w-3 h-3 text-[#A3A3A3]" />
                                <span>Pre-Action State Screenshot</span>
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-emerald-700 font-mono font-bold text-[9px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                  {screens.pre.badge}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setFullImageModal({
                                      src: screens.pre.src,
                                      title: `${j.title} — Pre-Action`,
                                      route: screens.pre.target,
                                      description: screens.pre.caption,
                                    })
                                  }
                                  className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#FAFAF9] hover:bg-[#F5F5F4] text-[#525252] font-mono text-[9px] border border-[#E5E5E5] transition-colors cursor-pointer"
                                  title="View Full Page Screenshot"
                                >
                                  <Maximize2 className="w-2.5 h-2.5" />
                                  <span>Expand</span>
                                </button>
                              </div>
                            </div>
                            <div className="rounded-lg overflow-hidden border border-[#E5E5E5] bg-zinc-100">
                              <div className="flex items-center justify-between px-2 py-1 bg-[#FAFAF9] border-b border-[#E5E5E5] text-[9px] font-mono text-[#737373]">
                                <div className="flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F56]"></span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFBD2E]"></span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#27C93F]"></span>
                                </div>
                                <span className="truncate max-w-[200px]">{screens.pre.target}</span>
                              </div>
                              <div className="max-h-[340px] overflow-y-auto bg-white">
                                {screens.pre.isImage ? (
                                  <img
                                    src={screens.pre.src}
                                    alt={screens.pre.caption}
                                    className="w-full h-auto block select-none"
                                  />
                                ) : (
                                  <iframe
                                    src={screens.pre.src}
                                    title={`Pre-Action Screenshot for ${j.id}`}
                                    sandbox="allow-same-origin allow-forms"
                                    className="w-full h-[320px] border-0 pointer-events-none select-none bg-white"
                                    loading="lazy"
                                  />
                                )}
                              </div>
                            </div>
                            <div className="text-[10px] text-[#737373] font-mono truncate px-1">
                              {screens.pre.caption}
                            </div>
                          </div>

                          {/* Post-Interaction Render */}
                          <div className="rounded-xl border border-[#E5E5E5] bg-white p-3.5 space-y-2 shadow-xs">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-semibold text-[#171717] flex items-center gap-1.5">
                                <Camera className="w-3 h-3 text-[#A3A3A3]" />
                                <span>Post-Interaction State Screenshot</span>
                              </span>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-mono font-bold text-[9px] px-1.5 py-0.5 rounded border ${
                                    isDefect
                                      ? "text-red-700 bg-red-50 border-red-200"
                                      : "text-emerald-700 bg-emerald-50 border-emerald-200"
                                  }`}
                                >
                                  {screens.post.badge}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setFullImageModal({
                                      src: screens.post.src,
                                      title: `${j.title} — Post-Action`,
                                      route: screens.post.target,
                                      description: screens.post.caption,
                                    })
                                  }
                                  className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#FAFAF9] hover:bg-[#F5F5F4] text-[#525252] font-mono text-[9px] border border-[#E5E5E5] transition-colors cursor-pointer"
                                  title="View Full Page Screenshot"
                                >
                                  <Maximize2 className="w-2.5 h-2.5" />
                                  <span>Expand</span>
                                </button>
                              </div>
                            </div>
                            <div className="rounded-lg overflow-hidden border border-[#E5E5E5] bg-zinc-100">
                              <div className="flex items-center justify-between px-2 py-1 bg-[#FAFAF9] border-b border-[#E5E5E5] text-[9px] font-mono text-[#737373]">
                                <div className="flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F56]"></span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFBD2E]"></span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#27C93F]"></span>
                                </div>
                                <span className="truncate max-w-[200px]">{screens.post.target}</span>
                              </div>
                              <div className="max-h-[340px] overflow-y-auto bg-white">
                                {screens.post.isImage ? (
                                  <img
                                    src={screens.post.src}
                                    alt={screens.post.caption}
                                    className="w-full h-auto block select-none"
                                  />
                                ) : (
                                  <iframe
                                    src={screens.post.src}
                                    title={`Post-Action Screenshot for ${j.id}`}
                                    sandbox="allow-same-origin allow-forms"
                                    className="w-full h-[320px] border-0 pointer-events-none select-none bg-white"
                                    loading="lazy"
                                  />
                                )}
                              </div>
                            </div>
                            <div className="text-[10px] text-[#737373] font-mono truncate px-1">
                              {screens.post.caption}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
