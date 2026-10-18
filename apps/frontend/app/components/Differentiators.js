"use client";

import { ScanSearch, ShieldCheck, FileCode2, CheckCircle2, ArrowRight } from "lucide-react";

const DIFFERENTIATORS = [
  {
    icon: ScanSearch,
    title: "Autonomous Exploration",
    headline: "Zero pre-scripted journeys required",
    description:
      "Traditional testing tools require humans to manually code click paths or record selectors. DRISHTI autonomously inspects your DOM, maps interactive route topologies, and builds targeted exploration plans based on domain intent.",
    highlights: [
      "DOM & accessibility tree extraction",
      "Dynamic SPA route traversal",
      "Actionable form & button discovery",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Evidence-Backed Verification",
    headline: "Eliminates flakiness with 3× fresh replay",
    description:
      "Most AI testing engines report noisy hallucinations. DRISHTI validates every potential defect by spinning up 3 completely independent, fresh browser sandboxes. Only reproducible defects are packaged into reports.",
    highlights: [
      "3× clean browser replay isolation",
      "Network HAR & console log extraction",
      "Full DOM trace & deterministic screenshot",
    ],
  },
  {
    icon: FileCode2,
    title: "Discovery-to-Regression",
    headline: "Turns findings into CI/CD pytest suites",
    description:
      "Finding bugs once is not enough. DRISHTI synthesizes clean, idiomatic pytest-playwright test files with robust locators, ready to be committed directly into your repository or executed in GitHub Actions.",
    highlights: [
      "Standard pytest-playwright syntax",
      "No vendor lock-in or proprietary runtime",
      "Direct GitHub Actions CI/CD compatibility",
    ],
  },
];

export default function Differentiators() {
  return (
    <section className="py-20 lg:py-28 bg-white border-t border-[#E5E5E5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FAFAF9] text-[#737373] border border-[#E5E5E5] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]"></span>
            <span>Technical Differentiation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#171717] tracking-tight">
            Finding a failure is not enough. Proving it matters.
          </h2>
          <p className="mt-3 text-base text-[#737373] leading-relaxed">
            DRISHTI is not a generic prompt wrapper. It is a deterministic testing engine engineered to explore real DOM state, eliminate flakiness through clean replay, and export regression suites.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DIFFERENTIATORS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-[#FAFAF9] border border-[#E5E5E5] rounded-xl p-6 sm:p-7 flex flex-col justify-between hover:border-[#D4D4D4] transition-all"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-white border border-[#E5E5E5] flex items-center justify-center text-[#171717] mb-4 shadow-xs">
                    <Icon className="w-4 h-4 text-[#F97316]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#171717] tracking-tight">
                    {item.title}
                  </h3>
                  <div className="text-xs font-medium text-[#F97316] mt-0.5 mb-3">
                    {item.headline}
                  </div>
                  <p className="text-xs text-[#737373] leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E5E5E5] space-y-2">
                  {item.highlights.map((highlight, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2 text-xs text-[#525252]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
