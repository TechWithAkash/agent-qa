"use client";

import { useState } from "react";
import {
  FileCode2,
  Copy,
  Check,
  Download,
  Terminal,
  Layers,
  Play,
  CheckCircle2,
  Sparkles,
  GitBranch,
  Box,
} from "lucide-react";

export default function PytestTab({
  computedPlaywrightCode,
  targetHostname,
  copiedCode,
  copyToClipboard,
  downloadTestSuite,
}) {
  const [activeCodeView, setActiveCodeView] = useState("pytest"); // "pytest" | "github" | "docker"
  const [copiedCi, setCopiedCi] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const cleanHostTag = targetHostname.replace(/[^a-zA-Z0-9]/g, "_");

  const githubActionsYaml = `# .github/workflows/drishti-qa.yml
name: DRISHTI Autonomous Regression

on:
  push:
    branches: [ main, staging ]
  pull_request:
    branches: [ main ]

jobs:
  autonomous-qa:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up Python 3.12
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Install Playwright & Test Runner
        run: |
          pip install pytest pytest-playwright
          playwright install --with-deps chromium

      - name: Execute DRISHTI Regression Invariants
        run: |
          pytest -v test_${cleanHostTag}.py --browser chromium --screenshot only-on-failure
`;

  const dockerCommand = `# Run DRISHTI Test Suite in Isolated Container
docker run --rm -v $(pwd):/app -w /app mcr.microsoft.com/playwright/python:v1.50.0-noble \\
  pytest test_${cleanHostTag}.py -v`;

  const handleCopyCi = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCi(true);
    setTimeout(() => setCopiedCi(false), 2000);
  };

  const handleCopyCmd = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const currentCode =
    activeCodeView === "pytest"
      ? computedPlaywrightCode
      : activeCodeView === "github"
      ? githubActionsYaml
      : dockerCommand;

  const lineCount = currentCode ? currentCode.split("\n").length : 0;

  return (
    <div className="rounded-2xl border border-[#e6e9ee] bg-white p-6 sm:p-7 space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#f0f0f0]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2D9FFE]"></span>
            <h2 className="text-base sm:text-lg font-bold text-[#000000] flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-[#2D9FFE]" />
              <span>Standalone Regression Suite &amp; CI/CD Artifacts</span>
            </h2>
          </div>
          <p className="text-xs text-[#525252] mt-1">
            Zero-dependency Python Playwright test artifact compiled with real target locators and invariant assertions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() =>
              activeCodeView === "pytest"
                ? copyToClipboard(computedPlaywrightCode, "code")
                : handleCopyCi(activeCodeView === "github" ? githubActionsYaml : dockerCommand)
            }
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#e6e9ee] text-xs font-semibold text-[#000000] hover:bg-[#fafafa] hover:border-[#cbd5e1] transition-all shadow-2xs cursor-pointer"
          >
            {copiedCode || copiedCi ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-[#737373]" />
            )}
            <span>{copiedCode || copiedCi ? "Copied to Clipboard" : "Copy Code"}</span>
          </button>

          <button
            type="button"
            onClick={downloadTestSuite}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2D9FFE] hover:bg-[#0b7ee6] text-white transition-all text-xs font-bold shadow-xs cursor-pointer group"
          >
            <Download className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
            <span>Download .py Suite</span>
          </button>
        </div>
      </div>

      {/* View Switcher: Pytest Script vs GitHub Actions vs Docker */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6e9ee] pb-3 text-xs">
        <div className="flex items-center gap-1.5 bg-[#fafafa] p-1 rounded-xl border border-[#e6e9ee]">
          <button
            type="button"
            onClick={() => setActiveCodeView("pytest")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
              activeCodeView === "pytest"
                ? "bg-white text-[#000000] font-semibold shadow-2xs border border-[#e6e9ee]"
                : "text-[#737373] hover:text-[#000000]"
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5 text-[#2D9FFE]" />
            <span>test_{cleanHostTag}.py</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveCodeView("github")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
              activeCodeView === "github"
                ? "bg-white text-[#000000] font-semibold shadow-2xs border border-[#e6e9ee]"
                : "text-[#737373] hover:text-[#000000]"
            }`}
          >
            <GitBranch className="w-3.5 h-3.5 text-purple-600" />
            <span>GitHub Actions CI/CD (.yml)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveCodeView("docker")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
              activeCodeView === "docker"
                ? "bg-white text-[#000000] font-semibold shadow-2xs border border-[#e6e9ee]"
                : "text-[#737373] hover:text-[#000000]"
            }`}
          >
            <Box className="w-3.5 h-3.5 text-blue-500" />
            <span>Docker Container Run</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#737373] font-mono">
          <span>{lineCount} lines</span>
          <span>•</span>
          <span className="font-semibold text-[#000000]">
            {activeCodeView === "pytest" ? "Python 3.12" : activeCodeView === "github" ? "YAML" : "Bash"}
          </span>
        </div>
      </div>

      {/* Code Container */}
      <div className="rounded-xl border border-[#2d333b] bg-[#0d1117] overflow-hidden shadow-inner">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-[#2d333b] text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>
              {activeCodeView === "pytest"
                ? `test_${cleanHostTag}.py`
                : activeCodeView === "github"
                ? ".github/workflows/drishti-qa.yml"
                : "docker-run.sh"}
            </span>
          </div>
          <span className="text-[11px] text-zinc-500">UTF-8 • Unix (LF)</span>
        </div>
        <div className="max-h-[520px] overflow-y-auto p-4 sm:p-5 font-mono text-xs text-zinc-200 leading-relaxed">
          <pre className="whitespace-pre-wrap">
            {currentCode}
          </pre>
        </div>
      </div>

      {/* Terminal Run Quickstart */}
      <div className="rounded-xl border border-[#e6e9ee] bg-[#fafafa] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 min-w-0 font-mono">
          <Terminal className="w-4 h-4 text-[#2D9FFE] shrink-0" />
          <span className="text-[#a3a3a3] select-none">$</span>
          <span className="font-semibold text-[#000000] truncate">
            pytest -v test_{cleanHostTag}.py --headed
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleCopyCmd(`pytest -v test_${cleanHostTag}.py --headed`)}
            className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white border border-[#e6e9ee] hover:bg-[#f0f0f0] text-[#000000] font-semibold transition-colors cursor-pointer flex items-center gap-1"
          >
            {copiedCmd ? (
              <Check className="w-3 h-3 text-emerald-600" />
            ) : (
              <Copy className="w-3 h-3 text-[#737373]" />
            )}
            <span>{copiedCmd ? "Copied Command" : "Copy Command"}</span>
          </button>
          <span className="text-[10px] text-emerald-700 font-bold uppercase shrink-0 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
            Local Ready
          </span>
        </div>
      </div>
    </div>
  );
}
