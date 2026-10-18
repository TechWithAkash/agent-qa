"use client";

import { FileCode2, Copy, Check, Download, Terminal } from "lucide-react";

export default function PytestTab({
  computedPlaywrightCode,
  targetHostname,
  copiedCode,
  copyToClipboard,
  downloadTestSuite,
}) {
  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-white p-6 sm:p-7 space-y-5 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#F5F5F4]">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-[#171717] flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-[#F97316]" />
            <span>Standalone Pytest-Playwright Test Suite</span>
          </h2>
          <p className="text-xs text-[#737373] mt-1">
            Self-contained executable Python test artifact generated with real target locators
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => copyToClipboard(computedPlaywrightCode, "code")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E5E5E5] text-xs font-medium text-[#171717] hover:bg-[#F5F5F4] transition-colors shadow-2xs cursor-pointer"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? "Copied" : "Copy Code"}</span>
          </button>

          <button
            type="button"
            onClick={downloadTestSuite}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#171717] text-white hover:bg-black transition-colors text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Download .py</span>
          </button>
        </div>
      </div>

      {/* Code container */}
      <div className="max-h-[500px] overflow-y-auto rounded-xl border border-[#27272A] bg-[#0E1015] p-4 sm:p-5 font-mono text-xs text-zinc-200 leading-relaxed shadow-inner">
        <pre className="whitespace-pre-wrap">{computedPlaywrightCode}</pre>
      </div>

      {/* Terminal Run Instructions */}
      <div className="rounded-xl border border-[#E5E5E5] bg-[#FAFAF9] p-4 font-mono text-xs text-[#171717] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 truncate">
          <span className="text-[#A3A3A3] select-none">$</span>
          <span className="font-semibold truncate">
            pytest -v test_{targetHostname.replace(/[^a-zA-Z0-9]/g, "_")}.py --headed
          </span>
        </div>
        <span className="text-[10px] text-[#737373] font-bold uppercase shrink-0">
          Run Locally
        </span>
      </div>
    </div>
  );
}
