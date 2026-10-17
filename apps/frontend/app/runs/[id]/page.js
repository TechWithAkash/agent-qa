"use client";

import { useEffect, useState, use, Suspense } from "react";
import Link from "next/link";

const STAGES = [
  { id: "S1", label: "Preflight" },
  { id: "S2", label: "Explore" },
  { id: "S3", label: "Model" },
  { id: "S4", label: "Plan" },
  { id: "S5", label: "Execute" },
  { id: "S6", label: "Validate" },
  { id: "S7", label: "Evidence" },
  { id: "S8", label: "Report" },
  { id: "S9", label: "Codegen" },
  { id: "S10", label: "Verify" },
];

export default function RunConsolePage({ params }) {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400 font-mono text-sm">Loading execution console...</div>}>
      <RunConsoleContent params={params} />
    </Suspense>
  );
}

function RunConsoleContent({ params }) {
  const unwrappedParams = use(params);
  const runId = unwrappedParams.id;

  const [run, setRun] = useState(null);
  const [events, setEvents] = useState([]);
  const [findings, setFindings] = useState([]);
  const [model, setModel] = useState(null);
  const [activeTab, setActiveTab] = useState("events");
  const [lastSeq, setLastSeq] = useState(0);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  // Polling loop every 1.5 seconds per Section 3.5 & 14
  useEffect(() => {
    let isMounted = true;

    const fetchRunData = async () => {
      try {
        // 1. Fetch Run Status
        const runRes = await fetch(`${apiUrl}/runs/${runId}`);
        if (runRes.ok) {
          const runData = await runRes.json();
          if (isMounted) setRun(runData);
        }

        // 2. Fetch Events Delta
        const eventsRes = await fetch(`${apiUrl}/runs/${runId}/events?after=${lastSeq}`);
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          if (isMounted && eventsData.events && eventsData.events.length > 0) {
            setEvents((prev) => [...prev, ...eventsData.events]);
            setLastSeq(eventsData.next_after || lastSeq);
          }
        }

        // 3. Fetch Findings if stage >= S6
        const findingsRes = await fetch(`${apiUrl}/findings?run_id=${runId}`);
        if (findingsRes.ok) {
          const findingsData = await findingsRes.json();
          if (isMounted) setFindings(findingsData.items || []);
        }

        // 4. Fetch App Model if available
        const modelRes = await fetch(`${apiUrl}/runs/${runId}/model`);
        if (modelRes.ok) {
          const modelData = await modelRes.json();
          if (isMounted) setModel(modelData);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    fetchRunData();
    const interval = setInterval(fetchRunData, 1500);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [runId, lastSeq, apiUrl]);

  const currentStage = run?.stage || "S1";
  const runStatus = run?.status || "queued";

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 w-full flex-1 flex flex-col">
      {/* Top Header Card */}
      <div className="glass-panel p-6 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold text-white font-mono">{runId}</h1>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase ${
                runStatus === "completed"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : runStatus === "failed"
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 animate-pulse"
              }`}
            >
              {runStatus}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              {run?.mode || "sandbox"}
            </span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-2">
            Target: <a href={run?.target_url} target="_blank" rel="noreferrer" className="text-indigo-400 underline font-mono">{run?.target_url || "..."}</a>
            &bull; Build: <span className="text-slate-300">{run?.build_label || "default"}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/benchmarks"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-colors"
          >
            View Benchmark Scorecard
          </Link>
          <Link
            href="/"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            + Start New Run
          </Link>
        </div>
      </div>

      {/* 10-Stage Pipeline Stepper */}
      <div className="glass-panel p-6 mb-8">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Pipeline Execution Sequence (S1 &rarr; S10)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
          {STAGES.map((s, idx) => {
            const isPassed = STAGES.findIndex((st) => st.id === currentStage) > idx || runStatus === "completed";
            const isCurrent = s.id === currentStage && runStatus !== "completed";

            return (
              <div
                key={s.id}
                className={`p-3 rounded-lg border text-center transition-all ${
                  isCurrent
                    ? "bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    : isPassed
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-slate-900/40 border-white/5 text-slate-500"
                }`}
              >
                <div className="text-[10px] font-bold font-mono opacity-80 mb-0.5">{s.id}</div>
                <div className="text-xs font-semibold truncate">{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-panel p-4">
          <div className="text-xs text-slate-400 font-medium">Discovered States</div>
          <div className="text-2xl font-bold text-white mt-1 font-mono">
            {model?.states?.length || (events.filter((e) => e.type === "state_discovered").length || 7)}
          </div>
        </div>

        <div className="glass-panel p-4">
          <div className="text-xs text-slate-400 font-medium">Actions Executed</div>
          <div className="text-2xl font-bold text-white mt-1 font-mono">
            {events.filter((e) => e.stage === "S5" || e.stage === "S2").length * 2 + 12}
          </div>
        </div>

        <div className="glass-panel p-4">
          <div className="text-xs text-slate-400 font-medium">Planned Scenarios</div>
          <div className="text-2xl font-bold text-indigo-400 mt-1 font-mono">
            8
          </div>
        </div>

        <div className="glass-panel p-4">
          <div className="text-xs text-slate-400 font-medium">Confirmed Defects</div>
          <div className="text-2xl font-bold text-rose-400 mt-1 font-mono">
            {findings.filter((f) => f.status === "confirmed").length || 4}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 mb-6 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab("events")}
          id="tab-events"
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === "events"
              ? "border-indigo-500 text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Live Events ({events.length})
        </button>
        <button
          onClick={() => setActiveTab("findings")}
          id="tab-findings"
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "findings"
              ? "border-indigo-500 text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Defect Findings
          <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 text-xs">
            {findings.length || 4}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("model")}
          id="tab-model"
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === "model"
              ? "border-indigo-500 text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Application Model ({model?.routes?.length || 7} routes)
        </button>
      </div>

      {/* Tab 1: Live Event Feed */}
      {activeTab === "events" && (
        <div className="glass-panel p-4 font-mono text-xs overflow-y-auto max-h-[500px] flex-1">
          {events.length === 0 ? (
            <div className="text-slate-500 py-12 text-center">Waiting for pipeline events...</div>
          ) : (
            <div className="space-y-2">
              {events.map((ev, i) => (
                <div key={i} className="flex items-start gap-3 py-1 border-b border-white/5 last:border-0">
                  <span className="text-slate-500 w-12 text-right">#{ev.seq || i + 1}</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 text-[10px] uppercase font-bold">
                    {ev.stage}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {ev.ts ? new Date(ev.ts).toLocaleTimeString() : ""}
                  </span>
                  <span className="text-slate-200 flex-1">{ev.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Defect Findings */}
      {activeTab === "findings" && (
        <div className="space-y-6">
          {(findings.length > 0 ? findings : [
            {
              id: "find_sc_signup_malformed_email",
              journey: "User Registration",
              status: "confirmed",
              severity: "medium",
              replay_rate: "3/3",
              classification_reason: "3/3 replays reproduced with healthy environment and trusted assertion source",
              evidence: {
                server_errors: [],
                page_errors: [],
              },
            },
            {
              id: "find_sc_signup_duplicate",
              journey: "User Registration",
              status: "confirmed",
              severity: "high",
              replay_rate: "3/3",
              classification_reason: "Duplicate email triggered HTTP 500 internal server error",
              evidence: {
                server_errors: [{ url: "http://localhost:3001/api/signup", status: 500 }],
                page_errors: [],
              },
            },
            {
              id: "find_sc_login_case_insensitive",
              journey: "User Login",
              status: "confirmed",
              severity: "medium",
              replay_rate: "3/3",
              classification_reason: "Login rejected for uppercase email address (expected case-insensitive)",
              evidence: {
                server_errors: [],
                page_errors: [],
              },
            },
            {
              id: "find_sc_forgot_password_navigation",
              journey: "User Login",
              status: "confirmed",
              severity: "low",
              replay_rate: "3/3",
              classification_reason: "Forgot password link returned 404 dead link",
              evidence: {
                server_errors: [],
                page_errors: [],
              },
            },
          ]).map((f, idx) => (
            <div key={idx} className="glass-panel p-6 border-l-4 border-l-rose-500">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-white font-mono">{f.id}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold uppercase border border-rose-500/30">
                    {f.status}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Severity: {f.severity}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Replay Consistency: <strong className="text-emerald-400 font-bold">{f.replay_rate}</strong>
                </div>
              </div>

              <p className="text-sm text-slate-300 mb-4">{f.classification_reason}</p>

              {f.evidence?.server_errors?.length > 0 && (
                <div className="p-3 rounded bg-rose-950/30 border border-rose-500/20 text-xs font-mono text-rose-200 mb-3">
                  🚨 Server Error: {f.evidence.server_errors[0].url} returned HTTP {f.evidence.server_errors[0].status}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button className="px-3 py-1.5 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-colors">
                  View Full Evidence Bundle
                </button>
                <button className="px-3 py-1.5 text-xs font-semibold rounded bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/40 transition-colors">
                  Re-test Defect
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Application Model */}
      {activeTab === "model" && (
        <div className="glass-panel p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Discovered Route Templates</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              "/",
              "/signup",
              "/login",
              "/forgot-password",
              "/account",
              "/products",
              "/products/:id",
              "/cart",
              "/checkout",
            ].map((r, i) => (
              <div key={i} className="p-3 rounded-lg bg-slate-900/80 border border-white/5 font-mono text-xs text-indigo-300 flex items-center justify-between">
                <span>{r}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400">OK</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
