"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Compass,
  FileCode2,
  Workflow,
  Sparkles,
} from "lucide-react";

import HeroBrowserDemo from "./components/HeroBrowserDemo";
import Launchpad, { PRESET_TARGETS } from "./components/Launchpad";
import ExecutionTimeline from "./components/ExecutionTimeline";
import HowItWorks from "./components/HowItWorks";
import Differentiators from "./components/Differentiators";
import EvidenceShowcase from "./components/EvidenceShowcase";
import BenchmarkSection from "./components/BenchmarkSection";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

const DEFAULT_PRESET = PRESET_TARGETS[0];

export default function LandingPage() {
  const router = useRouter();

  // Primary operation form state
  const [activePreset, setActivePreset] = useState(DEFAULT_PRESET.id);
  const [targetUrl, setTargetUrl] = useState(DEFAULT_PRESET.url);
  const [description, setDescription] = useState(DEFAULT_PRESET.description);
  const [mode, setMode] = useState(DEFAULT_PRESET.mode);
  const [attestation, setAttestation] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePresetSelect = (presetId) => {
    setActivePreset(presetId);
    const selected = PRESET_TARGETS.find((p) => p.id === presetId);
    if (selected) {
      setTargetUrl(selected.url);
      setDescription(selected.description);
      setMode(selected.mode);
      setAttestation(true);
      setError(null);
    }
  };

  const scrollToWorkspace = () => {
    const el = document.getElementById("operation-workspace");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToHowItWorks = () => {
    const el = document.getElementById("how-it-works");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetUrl.trim()) {
      setError("Please enter a valid target URL to test.");
      return;
    }
    if (!attestation) {
      setError("Authorization Attestation (SEC-1) must be confirmed to run tests.");
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
            statement: "I own or am authorized to test this target and it is a non-production environment.",
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || data.error?.message || "Failed to create QA run");
      }

      const data = await res.json();
      if (data?.run_id) {
        window.location.href = `/runs/${data.run_id}`;
      } else {
        router.push("/runs");
      }
    } catch (err) {
      setError(err.message || "Failed to launch autonomous session");
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#FAFAF9] text-[#171717] min-h-screen">
      {/* =========================================================================
          HERO SECTION — Linear x Vercel Aesthetic (Asymmetric 2-Column Grid)
          ========================================================================= */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-18 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Headline, Value Proposition & Actions (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-white text-[#525252] border border-[#E5E5E5] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse"></span>
              <span className="font-semibold text-[#171717]">AUTONOMOUS QA ENGINE</span>
              <span className="text-[#A3A3A3]">&bull;</span>
              <span>IM-02 SPECIFICATION</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#171717] leading-[1.08]">
              Your next bug shouldn&apos;t reach production.
            </h1>

            {/* Supporting Statement */}
            <p className="text-base sm:text-lg text-[#525252] leading-relaxed max-w-2xl">
              DRISHTI autonomously explores your web application, models real user journeys, and verifies defects with reproducible browser evidence across 3× fresh contexts.
            </p>

            {/* Workflow Points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-[#525252]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero pre-scripted tests</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>3× clean replay verification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Pytest codegen for CI/CD</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={scrollToWorkspace}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#171717] text-white hover:bg-black transition-all text-xs sm:text-sm font-semibold shadow-xs group"
              >
                <Play className="w-3.5 h-3.5 fill-current text-[#F97316]" />
                <span>Launch a QA Run</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#A3A3A3] group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={scrollToHowItWorks}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white border border-[#E5E5E5] text-[#171717] hover:bg-[#F5F5F4] transition-all text-xs sm:text-sm font-medium shadow-2xs"
              >
                <span>Explore the Workflow</span>
              </button>
            </div>

            {/* Trust Line */}
            <div className="pt-3 text-[11px] text-[#A3A3A3] flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Browser-based execution
              </span>
              <span>&bull;</span>
              <span>Evidence-backed reports</span>
              <span>&bull;</span>
              <span>Reusable regression tests</span>
            </div>
          </div>

          {/* Right Column: Realistic Browser Exploration Simulation (5 Cols) */}
          <div className="lg:col-span-5">
            <HeroBrowserDemo />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: EXECUTION PIPELINE GUARANTEE (Timeline)
          ========================================================================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <ExecutionTimeline />
      </section>

      {/* =========================================================================
          SECTION 8: AUTONOMOUS QA LAUNCHPAD (Primary Product Workspace)
          ========================================================================= */}
      <Launchpad
        targetUrl={targetUrl}
        setTargetUrl={setTargetUrl}
        description={description}
        setDescription={setDescription}
        mode={mode}
        setMode={setMode}
        attestation={attestation}
        setAttestation={setAttestation}
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
        onPresetSelect={handlePresetSelect}
        activePreset={activePreset}
      />

      {/* =========================================================================
          SECTION 10: HOW IT WORKS (01 Discover, 02 Plan, 03 Verify, 04 Remember)
          ========================================================================= */}
      <HowItWorks />

      {/* =========================================================================
          SECTION 11: TECHNICAL DIFFERENTIATION (3-Column Architecture)
          ========================================================================= */}
      <Differentiators />

      {/* =========================================================================
          SECTION 12: EVIDENCE & BUG REPORTING SHOWCASE
          ========================================================================= */}
      <EvidenceShowcase />

      {/* =========================================================================
          SECTION 13: STANDARDIZED BENCHMARK EVALUATION (ShopLite Suite)
          ========================================================================= */}
      <BenchmarkSection />

      {/* =========================================================================
          SECTION 14: FINAL CALL TO ACTION
          ========================================================================= */}
      <FinalCTA onLaunchClick={scrollToWorkspace} />

      {/* =========================================================================
          SECTION 15: GLOBAL REDESIGNED FOOTER
          ========================================================================= */}
      <Footer onLaunchClick={scrollToWorkspace} />
    </div>
  );
}
