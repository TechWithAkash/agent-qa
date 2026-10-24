"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Play,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Globe,
  AlertTriangle,
  Lock,
  ArrowRight,
  Sliders,
} from "lucide-react";
import { PRESET_TARGETS } from "../Launchpad";

export default function QuickLaunchModal({ isOpen, onClose }) {
  const router = useRouter();

  const [activePreset, setActivePreset] = useState("wealthwise");
  const [targetUrl, setTargetUrl] = useState("https://www.mywealthwise.in");
  const [description, setDescription] = useState(
    PRESET_TARGETS[0]?.description || ""
  );
  const [mode, setMode] = useState("sandbox");
  const [attestation, setAttestation] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handlePresetSelect = (presetId) => {
    setActivePreset(presetId);
    const selected = PRESET_TARGETS.find((p) => p.id === presetId);
    if (selected) {
      setTargetUrl(selected.url);
      setDescription(selected.description);
      setMode(selected.mode);
      setError(null);
    }
  };

  const handleLaunch = async (e) => {
    e.preventDefault();
    if (!targetUrl.trim()) {
      setError("Please provide a valid web application URL.");
      return;
    }
    if (!attestation) {
      setError("Authorization attestation must be confirmed.");
      return;
    }

    setLoading(true);
    setError(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

    try {
      const res = await fetch(`${apiUrl}/runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_url: targetUrl.trim(),
          description: description,
          mode: mode,
          authorization: {
            confirmed: true,
            statement:
              "I own or am authorized to test this target and it is a non-production environment.",
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.detail || data.error?.message || "Failed to start autonomous run"
        );
      }

      const data = await res.json();
      if (data?.run_id) {
        onClose();
        router.push(`/runs/${data.run_id}`);
      } else {
        onClose();
        router.push("/runs");
      }
    } catch (err) {
      setError(err.message || "Failed to initiate session");
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-[#e6e9ee] shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f0f0]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2D9FFE]/10 border border-[#2D9FFE]/20 flex items-center justify-center text-[#2D9FFE]">
              <Sparkles className="w-4 h-4 fill-[#2D9FFE]/20" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#000000] tracking-tight">
                Launch Autonomous Test Run
              </h3>
              <p className="text-xs text-[#737373]">
                Deploy the 7-agent swarm to crawl, plan assertions, and audit regressions.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#737373] hover:text-[#000000] hover:bg-[#fafafa] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleLaunch} className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-xs text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#737373] font-semibold">
              Select Preset Target:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_TARGETS.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePresetSelect(p.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer font-medium ${
                    activePreset === p.id
                      ? "bg-[#2D9FFE]/10 text-[#0b7ee6] border border-[#2D9FFE]/40 font-semibold"
                      : "bg-[#fafafa] border border-[#e6e9ee] text-[#525252] hover:text-[#000000] hover:bg-white"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Target URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#000000] flex items-center justify-between">
              <span>Target Application URL</span>
              <span className="text-[10px] font-mono text-[#737373]">HTTP / HTTPS</span>
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => {
                  setTargetUrl(e.target.value);
                  setActivePreset("custom");
                }}
                placeholder="https://app.example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e6e9ee] bg-[#fafafa] text-xs font-mono text-[#000000] placeholder-[#a3a3a3] focus:bg-white focus:border-[#2D9FFE] focus:ring-2 focus:ring-[#2D9FFE]/20 focus:outline-hidden transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Behavioral Rules / Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#000000] flex items-center justify-between">
              <span>Behavioral Invariant Instructions (Optional)</span>
              <span className="text-[10px] font-mono text-[#737373]">Markdown supported</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide user stories, credentials, or custom route priorities..."
              className="w-full p-3 rounded-xl border border-[#e6e9ee] bg-[#fafafa] text-xs font-mono text-[#000000] placeholder-[#a3a3a3] focus:bg-white focus:border-[#2D9FFE] focus:ring-2 focus:ring-[#2D9FFE]/20 focus:outline-hidden transition-all shadow-2xs resize-none"
            />
          </div>

          {/* Execution Mode */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-[#e6e9ee] bg-[#fafafa] text-xs">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#2D9FFE]" />
              <div>
                <span className="font-semibold text-[#000000] block">Isolated Sandbox Replay</span>
                <span className="text-[11px] text-[#737373]">3× headless cycles eliminate false positives</span>
              </div>
            </div>
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              0.0% Flake Guaranteed
            </span>
          </div>

          {/* Authorization Checkbox */}
          <label className="flex items-start gap-2.5 text-xs text-[#525252] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={attestation}
              onChange={(e) => setAttestation(e.target.checked)}
              className="mt-0.5 rounded border-[#cbd5e1] text-[#2D9FFE] focus:ring-[#2D9FFE] cursor-pointer"
            />
            <span>
              I attest that I have authorization to test this target application and that this is a staging, test, or non-destructive environment.
            </span>
          </label>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#f0f0f0]">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl border border-[#e6e9ee] bg-white text-xs font-semibold text-[#525252] hover:bg-[#fafafa] hover:text-[#000000] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !targetUrl.trim() || !attestation}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#2D9FFE] hover:bg-[#0b7ee6] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer group"
            >
              {loading ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>Initializing Swarm...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Start Autonomous Audit</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
