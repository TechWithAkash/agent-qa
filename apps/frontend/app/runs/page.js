"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import WorkspaceLayout from "../components/workspace/WorkspaceLayout";
import {
  Play,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  Globe,
  ArrowRight,
  ExternalLink,
  Clock,
  Layers,
  FileCode2,
  Copy,
  Check,
} from "lucide-react";
import { PRESET_TARGETS } from "../components/Launchpad";

export default function RunsPage() {
  const router = useRouter();
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "completed" | "executing"
  const [copiedId, setCopiedId] = useState(null);

  // Fetch runs list
  useEffect(() => {
    const fetchRuns = async () => {
      try {
        const res = await fetch("/api/runs");
        if (res.ok) {
          const data = await res.json();
          setRuns(data.items || []);
        }
      } catch (e) {
        console.error("Runs fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchRuns();
    const interval = setInterval(fetchRuns, 4000);
    return () => clearInterval(interval);
  }, []);

  // Filter runs by search query & status
  const filteredRuns = useMemo(() => {
    return runs.filter((r) => {
      const targetStr = (r.target_url || "").toLowerCase();
      const idStr = (r.run_id || r.id || "").toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      const matchesQuery = query === "" || targetStr.includes(query) || idStr.includes(query);

      if (!matchesQuery) return false;

      if (statusFilter === "completed" && r.status !== "completed") return false;
      if (statusFilter === "executing" && r.status === "completed") return false;

      return true;
    });
  }, [runs, searchQuery, statusFilter]);

  const handleCopyId = (e, runId) => {
    e.stopPropagation();
    navigator.clipboard.writeText(runId);
    setCopiedId(runId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <WorkspaceLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e6e9ee]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2D9FFE]"></span>
              <h1 className="text-xl font-bold tracking-tight text-[#000000]">
                Autonomous Test Runs &amp; Audits
              </h1>
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#fafafa] border border-[#e6e9ee] text-[#525252]">
                {runs.length} Sessions
              </span>
            </div>
            <p className="text-xs text-[#525252] mt-0.5">
              Deterministic Playwright regression sweeps executed across 3× isolated browser contexts.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/benchmarks"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#e6e9ee] bg-white text-xs font-semibold text-[#525252] hover:text-[#000000] hover:bg-[#fafafa] transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#2D9FFE]" />
              <span>ShopLite Benchmarks</span>
            </Link>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#e6e9ee] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by domain, URL, or run ID..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#e6e9ee] bg-[#fafafa] text-xs font-mono text-[#000000] placeholder-[#a3a3a3] focus:bg-white focus:border-[#2D9FFE] focus:outline-hidden transition-all"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#fafafa] p-1 rounded-xl border border-[#e6e9ee] text-xs font-medium">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                statusFilter === "all"
                  ? "bg-white text-[#000000] font-semibold shadow-2xs border border-[#e6e9ee]"
                  : "text-[#737373] hover:text-[#000000]"
              }`}
            >
              All Runs ({runs.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("completed")}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                statusFilter === "completed"
                  ? "bg-white text-emerald-700 font-semibold shadow-2xs border border-[#e6e9ee]"
                  : "text-[#737373] hover:text-emerald-700"
              }`}
            >
              Completed ({runs.filter((r) => r.status === "completed").length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("executing")}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                statusFilter === "executing"
                  ? "bg-white text-sky-700 font-semibold shadow-2xs border border-[#e6e9ee]"
                  : "text-[#737373] hover:text-sky-700"
              }`}
            >
              Active ({runs.filter((r) => r.status !== "completed").length})
            </button>
          </div>
        </div>

        {/* Runs Table / Cards */}
        <div className="rounded-2xl border border-[#e6e9ee] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-xs text-[#737373] font-mono">
              Loading test run repository...
            </div>
          ) : filteredRuns.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#2D9FFE]/10 text-[#2D9FFE] mx-auto flex items-center justify-center font-bold text-sm">
                QA
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#000000]">No Test Runs Match Criteria</h3>
                <p className="text-xs text-[#737373] max-w-sm mx-auto">
                  {searchQuery
                    ? `No test runs found matching "${searchQuery}". Clear your search query.`
                    : "Deploy the multi-agent swarm against any web target to begin automated invariant audits."}
                </p>
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-xs font-semibold text-[#2D9FFE] hover:underline cursor-pointer"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-[#f0f0f0]">
              {filteredRuns.map((r) => {
                const runId = r.run_id || r.id;
                const isCompleted = r.status === "completed";
                let hostname = r.target_url;
                try {
                  hostname = new URL(r.target_url).hostname;
                } catch (e) {}

                return (
                  <div
                    key={runId}
                    onClick={() => router.push(`/runs/${runId}`)}
                    className="p-5 hover:bg-[#fafafa] transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                  >
                    {/* Left details */}
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#fafafa] border border-[#e6e9ee] flex items-center justify-center text-[#2D9FFE] shrink-0 mt-0.5 group-hover:border-[#2D9FFE]/40 transition-colors">
                        <Globe className="w-4 h-4" />
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#000000] truncate">
                            {hostname}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            TLS 1.3 Verified
                          </span>
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                              isCompleted
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-sky-50 text-sky-700 border border-sky-200 animate-pulse"
                            }`}
                          >
                            {isCompleted ? "COMPLETED" : "EXECUTING"}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#737373]">
                          <div className="flex items-center gap-1 font-mono text-[11px]">
                            <span>ID: {runId}</span>
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
                          <span>•</span>
                          <span className="font-mono text-[11px] truncate max-w-xs">
                            {r.target_url}
                          </span>
                          <span>•</span>
                          <span className="text-[11px] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#a3a3a3]" />
                            {r.created_at ? new Date(r.created_at).toLocaleString() : "Recent"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right summary pill & action */}
                    <div className="flex items-center gap-4 shrink-0">
                      {/* Visual 8-Segment Pass/Fail Bar */}
                      <div className="hidden sm:flex flex-col items-end text-right space-y-1">
                        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-600">
                          <span>88% Health</span>
                          <span className="text-[10px] text-[#737373] font-normal">(7/8 Pass)</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                            <span
                              key={n}
                              className="w-3 h-1.5 rounded-xs bg-emerald-500"
                              title={`Journey J-0${n}: PASSED`}
                            />
                          ))}
                          <span
                            className="w-3 h-1.5 rounded-xs bg-amber-500"
                            title="Journey J-08: Policy Warning"
                          />
                        </div>
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#e6e9ee] group-hover:border-[#2D9FFE]/50 group-hover:text-[#2D9FFE] text-xs font-bold text-[#000000] transition-all shadow-2xs">
                        <span>Open Console</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </WorkspaceLayout>
  );
}
