"use client";

import { useEffect, useState } from "react";
import WorkspaceLayout from "../components/workspace/WorkspaceLayout";
import AiToolsTab from "../components/results/AiToolsTab";
import {
  Sparkles,
  Wand2,
  Cpu,
  Globe,
  ChevronDown,
  Layers,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function AiToolsPage() {
  const [runs, setRuns] = useState([]);
  const [selectedRunId, setSelectedRunId] = useState("");
  const [customStepText, setCustomStepText] = useState("");
  const [executingStep, setExecutingStep] = useState(false);
  const [stepResult, setStepResult] = useState(null);
  const [healedChains, setHealedChains] = useState([]);
  const [isHealing, setIsHealing] = useState(false);
  const [selectedRun, setSelectedRun] = useState(null);

  // Fetch runs to populate target context
  useEffect(() => {
    const fetchRuns = async () => {
      try {
        const res = await fetch("/api/runs");
        if (res.ok) {
          const data = await res.json();
          const items = data.items || [];
          setRuns(items);
          if (items.length > 0) {
            setSelectedRunId(items[0].run_id || items[0].id);
            setSelectedRun(items[0]);
          }
        }
      } catch (e) {
        console.error("AI tools fetch runs error:", e);
      }
    };
    fetchRuns();
  }, []);

  // Fetch memory / healed chains when run changes
  useEffect(() => {
    if (!selectedRunId) return;
    const fetchMemory = async () => {
      try {
        const res = await fetch(`/api/runs/${selectedRunId}/memory`);
        if (res.ok) {
          const data = await res.json();
          if (data.healed_chains) setHealedChains(data.healed_chains);
        }
      } catch (e) {}
    };
    fetchMemory();
  }, [selectedRunId]);

  const handleExecuteNLStep = async (stepText) => {
    if (!stepText?.trim()) return;
    setExecutingStep(true);
    try {
      const activeId = selectedRunId || (runs[0]?.run_id || runs[0]?.id || "run_demo");
      const res = await fetch(`/api/runs/${activeId}/step`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step_text: stepText }),
      });
      if (res.ok) {
        const data = await res.json();
        setStepResult(data);
      }
    } catch (e) {
      console.error("Step execution error:", e);
    } finally {
      setExecutingStep(false);
    }
  };

  const handleTriggerSelfHealing = async (brokenSelector) => {
    setIsHealing(true);
    try {
      const activeId = selectedRunId || (runs[0]?.run_id || runs[0]?.id || "run_demo");
      const res = await fetch(`/api/runs/${activeId}/heal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ broken_selector: brokenSelector }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.healed_chain) {
          setHealedChains((prev) => [data.healed_chain, ...prev]);
        }
      }
    } catch (e) {
      console.error("Self-healing trigger error:", e);
    } finally {
      setIsHealing(false);
    }
  };

  let targetHostname = "www.mywealthwise.in";
  if (selectedRun?.target_url) {
    try {
      targetHostname = new URL(selectedRun.target_url).hostname;
    } catch (e) {}
  }

  return (
    <WorkspaceLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e6e9ee]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2D9FFE]"></span>
              <h1 className="text-xl font-bold tracking-tight text-[#000000]">
                AI QA Agent &amp; Self-Healing Engine
              </h1>
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#2D9FFE]/10 text-[#0b7ee6] border border-[#2D9FFE]/20">
                Interactive Console
              </span>
            </div>
            <p className="text-xs text-[#525252] mt-0.5">
              Live compiler for prompt-to-Playwright actions and autonomous semantic locator recovery.
            </p>
          </div>

          {/* Target Context Selector */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#e6e9ee] shadow-2xs text-xs">
            <Globe className="w-3.5 h-3.5 text-[#2D9FFE]" />
            <span className="text-[#737373]">Target Context:</span>
            <span className="font-semibold text-[#000000]">{targetHostname}</span>
          </div>
        </div>

        {/* Dedicated AI Tools Tab Content */}
        <AiToolsTab
          customStepText={customStepText}
          setCustomStepText={setCustomStepText}
          executingStep={executingStep}
          handleExecuteNLStep={handleExecuteNLStep}
          stepResult={stepResult}
          signupRoute="/auth/signup"
          primaryButton="Get Started"
          h1Text="Autonomous QA Engine"
          targetHostname={targetHostname}
          targetUrl={selectedRun?.target_url || "https://www.mywealthwise.in"}
          model={{ routes: ["/", "/auth/signup", "/auth/signin", "/budget"] }}
          healedChains={healedChains}
          isHealing={isHealing}
          handleTriggerSelfHealing={handleTriggerSelfHealing}
          copyToClipboard={(text) => navigator.clipboard.writeText(text)}
        />
      </div>
    </WorkspaceLayout>
  );
}
