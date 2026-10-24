"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import IsometricHeroDevices from "./components/isometric/IsometricHeroDevices";
import IsometricFlowCluster from "./components/isometric/IsometricFlowCluster";
import IsometricEnvironmentCards from "./components/isometric/IsometricEnvironmentCards";
import IsometricPipeline from "./components/isometric/IsometricPipeline";
import TestReportPreviewCard from "./components/isometric/TestReportPreviewCard";
import Launchpad, { PRESET_TARGETS } from "./components/Launchpad";
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
    const el = document.getElementById("feature-flow");
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
      setError("Authorization Attestation must be confirmed to run tests.");
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
          data.detail || data.error?.message || "Failed to create QA run"
        );
      }

      const data = await res.json();
      if (data?.run_id) {
        router.push(`/runs/${data.run_id}`);
      } else {
        router.push("/runs");
      }
    } catch (err) {
      setError(err.message || "Failed to launch autonomous session");
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white text-[#262626] min-h-screen">
      {/* =========================================================================
          1. HERO SECTION — Clean, Expansive, Minimalist (Simulithic Aesthetic)
          ========================================================================= */}
      <section className="relative mx-auto max-w-[980px] px-4 sm:px-6 pt-36 sm:pt-44 lg:pt-48 pb-16 text-center flex flex-col items-center">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 top-0 h-[500px] w-full bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(45,159,254,0.08),transparent_70%)] pointer-events-none -z-10" />

        {/* Eyebrow Spec Pill */}
        <div className="inline-flex items-center gap-2 mb-6">
          <Badge variant="subtle" className="text-xs py-1.5 px-3.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2D9FFE] animate-pulse" />
            <span className="font-semibold text-[#000000]">Autonomous QA Platform</span>
            <span className="text-[#a3a3a3]">&bull;</span>
            <span className="text-[#525252]">IM-02 Specification</span>
          </Badge>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-semibold tracking-[-0.035em] text-[#000000] leading-[1.06] max-w-4xl mx-auto">
          End-to-end tests that write themselves.
        </h1>

        {/* Supporting Copy */}
        <p className="mt-5 text-base sm:text-lg text-[#525252] max-w-2xl mx-auto leading-relaxed font-normal">
          Powered by autonomous agents that explore, verify, and document your web application without manual test scripts.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            size="lg"
            onClick={scrollToWorkspace}
            className="w-full sm:w-auto text-xs sm:text-sm font-semibold shadow-md shadow-[#2D9FFE]/20 px-6 py-2.5 rounded-full"
          >
            <span>Start testing</span>
            <ArrowRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={scrollToHowItWorks}
            className="w-full sm:w-auto text-xs sm:text-sm font-medium px-6 py-2.5 rounded-full"
          >
            <span>Explore workflow</span>
          </Button>
        </div>

        {/* Isometric Vector Hero Devices Line-Art Graphic */}
        <div className="mt-14 sm:mt-18 w-full flex justify-center">
          <IsometricHeroDevices />
        </div>
      </section>

      {/* =========================================================================
          2. PROBLEM STATEMENT / EDITORIAL TRANSITION
          ========================================================================= */}
      <section className="mx-auto max-w-[980px] px-4 sm:px-6 py-24 sm:py-32 border-t border-[#e6e9ee]">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[#000000] leading-[1.18] space-y-2">
            <span className="block text-[#000000]">Writing every test takes time.</span>
            <span className="block text-[#525252]">Describing every flow takes foresight.</span>
            <span className="block text-[#a3a3a3]">Prod breaks on the one you missed.</span>
          </h2>
        </div>
      </section>

      {/* =========================================================================
          3. FEATURE 1: "Map every flow with one command"
          ========================================================================= */}
      <section id="feature-flow" className="mx-auto max-w-[980px] px-4 sm:px-6 py-20 sm:py-28 border-t border-[#e6e9ee] text-center">
        <div className="max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[#000000]">
            Map every flow with one command
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
            Autonomous agents explore your entire application, mapping user journeys and edge cases without writing a line of test code.
          </p>
        </div>

        <IsometricFlowCluster />
      </section>

      {/* =========================================================================
          4. FEATURE 2: "Every environment, verified."
          ========================================================================= */}
      <section className="mx-auto max-w-[980px] px-4 sm:px-6 py-20 sm:py-28 border-t border-[#e6e9ee]">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[#000000]">
            Every environment, verified.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
            Simulate real user journeys across web viewports, mobile devices, and varied network conditions.
          </p>
        </div>

        <IsometricEnvironmentCards />
      </section>

      {/* =========================================================================
          5. FEATURE 3: "Runs wherever you ship."
          ========================================================================= */}
      <section className="mx-auto max-w-[980px] px-4 sm:px-6 py-20 sm:py-28 border-t border-[#e6e9ee]">
        <div className="max-w-2xl mb-12">
          <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[#000000]">
            Runs wherever you ship.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
            Seamlessly integrate autonomous QA into your existing developer workflow and CI/CD pipelines.
          </p>
        </div>

        <IsometricPipeline />
      </section>

      {/* =========================================================================
          6. FEATURE 4: "Know what broke before you merge."
          ========================================================================= */}
      <section className="mx-auto max-w-[980px] px-4 sm:px-6 py-20 sm:py-28 border-t border-[#e6e9ee]">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[#000000]">
            Know what broke before you merge.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
            Deterministic defect reports with reproducible DOM selectors, network traces, and clean Pytest suites.
          </p>
        </div>

        <TestReportPreviewCard />
      </section>

      {/* =========================================================================
          7. PRIMARY WORKSPACE: AUTONOMOUS QA LAUNCHPAD (Live Execution Engine)
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
          8. STANDARDIZED BENCHMARK PROOF SECTION
          ========================================================================= */}
      <BenchmarkSection />

      {/* =========================================================================
          9. FINAL CALL TO ACTION
          ========================================================================= */}
      <FinalCTA onLaunchClick={scrollToWorkspace} />

      {/* =========================================================================
          10. MINIMALIST FOOTER
          ========================================================================= */}
      <Footer onLaunchClick={scrollToWorkspace} />
    </div>
  );
}
