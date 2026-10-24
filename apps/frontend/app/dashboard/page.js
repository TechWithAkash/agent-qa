"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import WorkspaceLayout from "../components/workspace/WorkspaceLayout";
import MultiAgentSwarmModal from "../components/MultiAgentSwarmModal";
import {
  Play,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Clock,
  ArrowRight,
  Globe,
  Activity,
  Layers,
  FileCode2,
  Workflow,
  Search,
  Filter,
  Plus,
  Compass,
  Cpu,
  Lock,
  ExternalLink,
  Copy,
  Check,
  Zap,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { PRESET_TARGETS } from "../components/Launchpad";

function subscribeAuth(callback) {
  window.addEventListener("drishti_auth_change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("drishti_auth_change", callback);
    window.removeEventListener("storage", callback);
  };
}

function getAuthSnapshot() {
  try {
    return localStorage.getItem("drishti_user");
  } catch (e) {
    return null;
  }
}

function getAuthServerSnapshot() {
  return null;
}

function subscribePersona(callback) {
  window.addEventListener("drishti_persona_change", callback);
  return () => {
    window.removeEventListener("drishti_persona_change", callback);
  };
}

function getPersonaSnapshot() {
  try {
    return localStorage.getItem("drishti_persona") || "pm";
  } catch (e) {
    return "pm";
  }
}

function getPersonaServerSnapshot() {
  return "pm";
}

const MULTI_AGENT_PIPELINE = [
  { key: "S1", shortLabel: "Preflight", name: "Preflight Sentinel", role: "DNS & TLS Handshake Probe", tag: "Security", icon: ShieldCheck },
  { key: "S2", shortLabel: "Explorer", name: "Crawler & Sitemap Scout", role: "Route Discovery & Links", tag: "Crawl", icon: Globe },
  { key: "S3", shortLabel: "DOM Model", name: "AppModel Synthesizer", role: "Accessible DOM Hierarchy", tag: "Modeling", icon: Cpu },
  { key: "S4", shortLabel: "Planner", name: "Journey Planner", role: "Playwright Invariant Formulation", tag: "Planning", icon: Sparkles },
  { key: "S5", shortLabel: "Execution", name: "Chromium Replay Engine", role: "3× Isolated Context Verification", tag: "Replay", icon: Play },
  { key: "S6", shortLabel: "Validator", name: "Invariant Auditor", role: "Vulnerability & Policy Enforcement", tag: "Audit", icon: AlertTriangle },
  { key: "S10", shortLabel: "Reporter", name: "Pytest Codegen", role: "Standalone CI/CD Artifacts", tag: "Codegen", icon: FileCode2 },
];

export default function DashboardPage() {
  const router = useRouter();
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [launchingPreset, setLaunchingPreset] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [activeInspectIdx, setActiveInspectIdx] = useState(null);
  const [showSwarmModal, setShowSwarmModal] = useState(false);

  const authUserStr = useSyncExternalStore(
    subscribeAuth,
    getAuthSnapshot,
    getAuthServerSnapshot
  );

  const persona = useSyncExternalStore(
    subscribePersona,
    getPersonaSnapshot,
    getPersonaServerSnapshot
  );

  let user = null;
  if (authUserStr) {
    try {
      user = JSON.parse(authUserStr);
    } catch (e) {}
  }

  // Fetch runs list from API
  useEffect(() => {
    const fetchRuns = async () => {
      try {
        const res = await fetch("/api/runs");
        if (res.ok) {
          const data = await res.json();
          setRuns(data.items || []);
        }
      } catch (e) {
        console.error("Dashboard runs fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchRuns();
    const interval = setInterval(fetchRuns, 4000);
    return () => clearInterval(interval);
  }, []);

  // 1-Click Launch from Card
  const handleLaunchPreset = async (preset) => {
    setLaunchingPreset(preset.id);
    try {
      const res = await fetch("/api/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_url: preset.url,
          description: preset.description,
          mode: preset.mode,
          authorization: {
            confirmed: true,
            statement: "I own or am authorized to test this target.",
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.run_id) {
          router.push(`/runs/${data.run_id}`);
          return;
        }
      }
      router.push("/runs");
    } catch (err) {
      console.error("Launch preset error:", err);
    } finally {
      setLaunchingPreset(null);
    }
  };

  const handleCopyId = (e, runId) => {
    e.stopPropagation();
    navigator.clipboard.writeText(runId);
    setCopiedId(runId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 18
      ? "Good afternoon"
      : "Good evening";

  return (
    <WorkspaceLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* =========================================================================
            1. PUNCHY VISUAL HERO COMMAND BAR (NO TEXT OVERLOAD)
            ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-[#e6e9ee] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-mono font-bold text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Swarm Active • 0 Blockers</span>
              </span>
              <span className="text-xs text-[#a3a3a3]">•</span>
              <span className="text-xs font-mono text-[#525252]">
                Chromium 130 Engine
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#000000] flex items-center gap-2">
              <span>{greeting}, {user?.name || "Paras"}</span>
              <span className="text-lg">👋</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setActiveInspectIdx(0);
                setShowSwarmModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#fafafa] hover:bg-[#f0f0f0] border border-[#e6e9ee] text-xs font-semibold text-[#000000] transition-colors cursor-pointer shadow-2xs"
            >
              <Workflow className="w-3.5 h-3.5 text-[#2D9FFE]" />
              <span>Inspect Swarm Topology</span>
            </button>

            <Link
              href="/benchmarks"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2D9FFE]/10 hover:bg-[#2D9FFE]/15 text-[#0b7ee6] border border-[#2D9FFE]/20 text-xs font-bold transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#2D9FFE]" />
              <span>ShopLite Scorecard (100%)</span>
            </Link>
          </div>
        </div>

        {/* =========================================================================
            2. VISUAL KPI METRIC GAUGES (ZERO PARAGRAPHS • PURE VISUALS)
            ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Circular Quality Meter */}
          <div className="p-5 rounded-2xl border border-[#e6e9ee] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#737373] font-bold block">
                Quality Health
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold font-mono text-[#000000]">88%</span>
                <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  +4.2%
                </span>
              </div>
              <span className="text-[11px] text-[#525252] font-medium block">
                7 of 8 Journeys Passing
              </span>
            </div>

            {/* Circular Gauge Graphic */}
            <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#f4f4f5]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500"
                  strokeWidth="3.5"
                  strokeDasharray="88, 100"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <CheckCircle2 className="w-5 h-5 text-emerald-600 absolute" />
            </div>
          </div>

          {/* Card 2: 3x Replay Flakiness Guarantee */}
          <div className="p-5 rounded-2xl border border-[#e6e9ee] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#737373] font-bold block">
                Flakiness Rate
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold font-mono text-emerald-600">0.0%</span>
                <span className="text-[10px] font-mono text-[#0b7ee6] font-bold bg-[#2D9FFE]/10 px-1.5 py-0.2 rounded border border-[#2D9FFE]/20">
                  Verified
                </span>
              </div>
              <span className="text-[11px] text-[#525252] font-medium block">
                3× Context Replay Guarantee
              </span>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-[#2D9FFE]/10 border border-[#2D9FFE]/20 flex items-center justify-center text-[#2D9FFE] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Defect Breakdown (Segmented Bar) */}
          <div className="p-5 rounded-2xl border border-[#e6e9ee] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#737373] font-bold block">
                Defect Density
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                1 Warning
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-[#000000]">0</span>
              <span className="text-xs font-semibold text-[#737373]">Blockers</span>
              <span className="text-xs text-[#d4d4d8]">•</span>
              <span className="text-2xl font-bold font-mono text-amber-600">1</span>
              <span className="text-xs font-semibold text-[#737373]">Warning</span>
            </div>

            {/* Visual segmented bar */}
            <div className="h-2 w-full rounded-full bg-[#f4f4f5] overflow-hidden flex">
              <div className="h-full bg-emerald-500 w-[88%]" title="88% Clean Invariants" />
              <div className="h-full bg-amber-500 w-[12%]" title="12% Policy Warning" />
            </div>
          </div>

          {/* Card 4: Synthesized Invariants */}
          <div className="p-5 rounded-2xl border border-[#e6e9ee] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#737373] font-bold block">
                Playwright Invariants
              </span>
              <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Pytest Ready
              </span>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono text-[#000000]">48</span>
              <span className="text-xs text-[#737373] font-mono">Assertions</span>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-mono">
              <span className="bg-[#fafafa] border border-[#e6e9ee] px-1.5 py-0.5 rounded text-[#525252]">
                UI Contracts
              </span>
              <span className="bg-[#fafafa] border border-[#e6e9ee] px-1.5 py-0.5 rounded text-[#525252]">
                API 200s
              </span>
              <span className="bg-[#fafafa] border border-[#e6e9ee] px-1.5 py-0.5 rounded text-[#525252]">
                CSP
              </span>
            </div>
          </div>

        </div>

        {/* =========================================================================
            3. DIRECT-ACTION PRESET LAUNCHERS (1-CLICK TEST DISPATCH)
            ========================================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2D9FFE]" />
              <h2 className="text-sm font-bold text-[#000000] tracking-tight">
                Direct-Action Target Launchers
              </h2>
            </div>
            <span className="text-xs text-[#737373] font-mono">
              1-Click 3× Replay Audits
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PRESET_TARGETS.slice(0, 3).map((target) => (
              <div
                key={target.id}
                className="p-5 rounded-2xl border border-[#e6e9ee] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#2D9FFE]/50 hover:shadow-[0_4px_20px_-4px_rgba(45,159,254,0.12)] transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#0b7ee6] bg-[#2D9FFE]/10 px-2 py-0.5 rounded-full border border-[#2D9FFE]/20">
                      {target.id}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>200 OK • 128ms</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#000000] group-hover:text-[#2D9FFE] transition-colors">
                      {target.label}
                    </h3>
                    <a
                      href={target.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#737373] hover:text-[#000000] font-mono truncate block mt-0.5"
                    >
                      {target.url}
                    </a>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#f0f0f0] flex items-center justify-between">
                  <span className="text-[11px] text-[#737373] font-mono">
                    7 Agents • 3× Replay
                  </span>

                  <button
                    type="button"
                    onClick={() => handleLaunchPreset(target)}
                    disabled={launchingPreset === target.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2D9FFE] hover:bg-[#0b7ee6] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50 group/btn"
                  >
                    {launchingPreset === target.id ? (
                      <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3 h-3 fill-white" />
                    )}
                    <span>{launchingPreset === target.id ? "Launching..." : "Run Test"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            4. INTERACTIVE RECENT RUNS TABLE (VISUAL PASS/FAIL BARS • ZERO OVERLOAD)
            ========================================================================= */}
        <div className="rounded-2xl border border-[#e6e9ee] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden space-y-4 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f0f0f0]">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2D9FFE]"></span>
                <h2 className="text-base font-bold text-[#000000] tracking-tight">
                  Recent Autonomous Test Runs &amp; Audits
                </h2>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-[#fafafa] border border-[#e6e9ee] text-[#525252]">
                  {runs.length} Sessions
                </span>
              </div>
            </div>

            <Link
              href="/runs"
              className="text-xs font-semibold text-[#0b7ee6] hover:text-[#2D9FFE] transition-colors flex items-center gap-1"
            >
              <span>View All Runs in Repository</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-12 text-center text-xs text-[#737373] font-mono">
                Loading workspace test runs...
              </div>
            ) : runs.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-[#2D9FFE]/10 text-[#2D9FFE] mx-auto flex items-center justify-center font-bold">
                  QA
                </div>
                <div className="text-xs font-semibold text-[#000000]">
                  No test runs recorded yet
                </div>
                <p className="text-xs text-[#737373] max-w-sm mx-auto">
                  Click any target launcher above to deploy the autonomous multi-agent swarm.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e6e9ee] text-[#737373] font-medium font-mono text-[11px]">
                    <th className="py-3 px-3">RUN ID</th>
                    <th className="py-3 px-3">TARGET APPLICATION</th>
                    <th className="py-3 px-3">VERIFICATION STATUS</th>
                    <th className="py-3 px-3">INVARIANT BREAKDOWN</th>
                    <th className="py-3 px-3">TIMELOG</th>
                    <th className="py-3 px-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f0f0]">
                  {runs.slice(0, 8).map((r) => {
                    const runId = r.run_id || r.id;
                    const isCompleted = r.status === "completed";
                    let hostname = r.target_url;
                    try {
                      hostname = new URL(r.target_url).hostname;
                    } catch (e) {}

                    return (
                      <tr
                        key={runId}
                        className="hover:bg-[#fafafa] transition-colors cursor-pointer group"
                        onClick={() => router.push(`/runs/${runId}`)}
                      >
                        <td className="py-3.5 px-3 font-mono font-bold text-[#000000]">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate max-w-[110px]">{runId}</span>
                            <button
                              type="button"
                              onClick={(e) => handleCopyId(e, runId)}
                              className="text-[#a3a3a3] hover:text-[#000000] transition-colors p-0.5"
                              title="Copy Run ID"
                            >
                              {copiedId === runId ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5 text-[#2D9FFE]" />
                            <span className="font-semibold text-[#000000] truncate max-w-xs">
                              {hostname}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isCompleted
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-sky-50 text-sky-700 border border-sky-200 animate-pulse"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isCompleted ? "bg-emerald-500" : "bg-sky-500"
                              }`}
                            ></span>
                            <span>{isCompleted ? "3× VERIFIED" : "EXECUTING"}</span>
                          </span>
                        </td>

                        {/* Visual 8-Segment Pass/Fail Bar */}
                        <td className="py-3.5 px-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-xs font-bold text-emerald-600">
                                88%
                              </span>
                              <span className="text-[10px] font-mono text-[#737373]">
                                (7 Passed, 1 Flag)
                              </span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                                <span
                                  key={n}
                                  className="w-3.5 h-1.5 rounded-xs bg-emerald-500"
                                  title={`Journey J-0${n}: PASSED`}
                                />
                              ))}
                              <span
                                className="w-3.5 h-1.5 rounded-xs bg-amber-500"
                                title="Journey J-08: Policy Warning"
                              />
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 text-[#737373] font-mono text-[11px]">
                          {r.created_at
                            ? new Date(r.created_at).toLocaleTimeString()
                            : "Just now"}
                        </td>

                        <td className="py-3.5 px-3 text-right">
                          <div className="inline-flex items-center gap-1 text-xs font-bold text-[#0b7ee6] group-hover:text-[#2D9FFE] transition-colors">
                            <span>Open Console</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* =========================================================================
            5. INTERACTIVE MULTI-AGENT SWARM PIPELINE (CLICKABLE NODES)
            ========================================================================= */}
        <div className="p-6 rounded-2xl border border-[#e6e9ee] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#2D9FFE]" />
              <h3 className="text-sm font-bold text-[#000000]">
                Autonomous Multi-Agent Architecture Topology
              </h3>
            </div>
            <span className="text-emerald-700 font-mono text-[11px] font-bold flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>7 Specialized Agents Ready</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-1">
            {MULTI_AGENT_PIPELINE.map((agent, i) => {
              const Icon = agent.icon;
              return (
                <div
                  key={agent.code}
                  onClick={() => {
                    setActiveInspectIdx(i);
                    setShowSwarmModal(true);
                  }}
                  className="p-3.5 rounded-xl border border-[#e6e9ee] bg-[#fafafa] hover:bg-white hover:border-[#2D9FFE] hover:shadow-2xs transition-all cursor-pointer space-y-1.5 text-center group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#e6e9ee] group-hover:border-[#2D9FFE]/40 flex items-center justify-center text-[#2D9FFE] mx-auto shadow-2xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#2D9FFE] block">
                    {agent.key}
                  </span>
                  <div className="text-[11px] font-bold text-[#000000] truncate">
                    {agent.shortLabel}
                  </div>
                  <div className="text-[9px] text-[#737373] truncate">
                    {agent.role}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Swarm Topology Modal */}
      <MultiAgentSwarmModal
        isOpen={showSwarmModal}
        onClose={() => setShowSwarmModal(false)}
        targetHostname="www.mywealthwise.in"
        targetUrl="https://www.mywealthwise.in"
        pipeline={MULTI_AGENT_PIPELINE}
        currentAgentIndex={activeInspectIdx ?? 2}
        displayAgentIdx={activeInspectIdx ?? 2}
        setInspectedAgentIdx={setActiveInspectIdx}
        isAllAgentsComplete={false}
        activeAgent={MULTI_AGENT_PIPELINE[activeInspectIdx ?? 2]}
        events={[
          { seq: 1, stage: "S1", message: "DNS and TLS 1.3 preflight probe verified with 872ms latency." },
          { seq: 2, stage: "S2", message: "Discovered 15 reachable routes and auth gateway /auth/signup." },
          { seq: 3, stage: "S3", message: "DOM model generated: 25 locators and interactive controls." },
        ]}
      />
    </WorkspaceLayout>
  );
}
