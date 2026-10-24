"use client";

import { useState } from "react";
import { Laptop, Smartphone, Monitor, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function IsometricHeroDevices() {
  const [selectedDevice, setSelectedDevice] = useState("all");

  const devices = [
    { id: "all", label: "All Environments" },
    { id: "ios", label: "iOS (Webview)" },
    { id: "android", label: "Android (Webview)" },
    { id: "macos", label: "macOS" },
    { id: "windows", label: "Windows" },
    { id: "linux", label: "Linux (Headless)" },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Device selection pills above illustration */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8 text-xs select-none">
        {devices.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setSelectedDevice(d.id)}
            className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
              selectedDevice === d.id
                ? "bg-[#000000] text-white shadow-xs"
                : "bg-white text-[#525252] border border-[#e6e9ee] hover:border-[#cbd5e1] hover:text-[#000000]"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Isometric Vector Art Stage */}
      <div className="relative w-full max-w-[880px] aspect-[16/9] sm:aspect-[2/1] flex items-center justify-center">
        <svg
          viewBox="0 0 920 460"
          className="w-full h-full overflow-visible drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2D9FFE" />
              <stop offset="100%" stopColor="#0b7ee6" />
            </linearGradient>

            <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#F8FAFC" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2D9FFE" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2D9FFE" stopOpacity="0" />
            </linearGradient>

            <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.04" />
            </filter>
          </defs>

          {/* =========================================================================
              ISOMETRIC PERSPECTIVE GRID MATRIX (Hairline Lines)
              ========================================================================= */}
          <g stroke="#E6E9EE" strokeWidth="1" strokeDasharray="3 3" opacity="0.85">
            {/* Isometric X-Axis Parallel Rays */}
            <line x1="80" y1="180" x2="680" y2="440" />
            <line x1="160" y1="140" x2="760" y2="400" />
            <line x1="240" y1="100" x2="840" y2="360" />
            <line x1="320" y1="60" x2="920" y2="320" />

            {/* Isometric Y-Axis Parallel Rays */}
            <line x1="20" y1="360" x2="480" y2="80" />
            <line x1="140" y1="420" x2="600" y2="140" />
            <line x1="260" y1="460" x2="720" y2="200" />
            <line x1="380" y1="480" x2="840" y2="260" />
          </g>

          {/* Solid Perspective Baseline Rails */}
          <g stroke="#D6DBE1" strokeWidth="1.2">
            <line x1="60" y1="280" x2="860" y2="280" opacity="0.3" />
            <line x1="100" y1="340" x2="820" y2="340" opacity="0.3" />
          </g>

          {/* =========================================================================
              DEVICE 0: CENTRAL RUNNER PLINTH (Leftmost Blue Anchor)
              ========================================================================= */}
          <g transform="translate(60, 160)">
            {/* Plinth Base Shadow */}
            <polygon points="60,90 120,60 180,90 120,120" fill="url(#glowGrad)" />

            {/* Isometric Box Base */}
            <polygon points="60,80 120,50 180,80 180,95 120,125 60,95" fill="#EEF2F6" stroke="#D6DBE1" strokeWidth="1" />
            {/* Top Plane */}
            <polygon points="60,80 120,50 180,80 120,110" fill="#FFFFFF" stroke="#D6DBE1" strokeWidth="1" />

            {/* Radiant Agent Diamond */}
            <polygon points="85,80 120,62 155,80 120,98" fill="url(#skyGrad)" stroke="#2D9FFE" strokeWidth="1.5" />
            {/* Icon inside diamond */}
            <path d="M115,74 L125,74 L127,80 L123,80 L121,85 L119,85 L119,74 Z" fill="#FFFFFF" />
            <circle cx="120" cy="80" r="1.5" fill="#FFFFFF" />

            {/* Connecting Circuit Trace to Laptops */}
            <path d="M180,95 L250,130 L290,130" stroke="#2D9FFE" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="290" cy="130" r="3" fill="#2D9FFE" />
          </g>

          {/* =========================================================================
              DEVICE 1: MACBOOK / LAPTOP (Primary Workstation on Isometric Plane)
              ========================================================================= */}
          <g transform="translate(200, 100)">
            {/* Pedestal / Acrylic Platform */}
            <polygon points="80,210 230,135 380,210 230,285" fill="#FFFFFF" stroke="#E6E9EE" strokeWidth="1.2" filter="url(#shadowFilter)" />

            {/* Inner Border Inset */}
            <polygon points="95,210 230,143 365,210 230,277" stroke="#F0F2F5" strokeWidth="1" />

            {/* Laptop Base Keyboard Deck */}
            <polygon points="120,205 230,150 340,205 230,260" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.2" />

            {/* Keyboard Well */}
            <polygon points="145,200 230,158 315,200 230,242" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="0.8" />
            {/* Trackpad */}
            <polygon points="210,244 230,234 250,244 230,254" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />

            {/* Angled Laptop Display Screen */}
            {/* Screen Bezel Outer */}
            <polygon points="140,195 140,75 320,115 320,205" fill="#000000" stroke="#000000" strokeWidth="1.5" rx="3" />
            {/* Active Display Panel (Screen Content) */}
            <polygon points="146,190 146,82 314,120 314,200" fill="#0F172A" />

            {/* Wireframe Web UI on Screen */}
            {/* Header bar */}
            <line x1="152" y1="94" x2="308" y2="128" stroke="#334155" strokeWidth="1" />
            {/* Status Indicator */}
            <circle cx="160" cy="93" r="2" fill="#10B981" />
            <circle cx="167" cy="95" r="2" fill="#2D9FFE" />

            {/* Active Autonomous Crawl Visuals */}
            <path d="M158,115 L220,130 L280,140" stroke="#2D9FFE" strokeWidth="1.2" />
            <circle cx="220" cy="130" r="3" fill="#2D9FFE" />
            <circle cx="280" cy="140" r="3" fill="#10B981" />

            {/* Synthetic DOM hierarchy lines on screen */}
            <line x1="158" y1="130" x2="200" y2="139" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
            <line x1="158" y1="145" x2="240" y2="162" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
            <line x1="158" y1="160" x2="270" y2="183" stroke="#2D9FFE" strokeWidth="2" strokeLinecap="round" />

            {/* Status tag pill above screen */}
            <g transform="translate(180, 48)">
              <rect x="0" y="0" width="105" height="22" rx="11" fill="#FFFFFF" stroke="#E6E9EE" strokeWidth="1" />
              <circle cx="12" cy="11" r="3" fill="#10B981" />
              <text x="22" y="15" fill="#262626" fontSize="9" fontFamily="system-ui" fontWeight="600">macOS Verified</text>
            </g>
          </g>

          {/* =========================================================================
              DEVICE 2: SECOND LAPTOP / TABLET (Middle-Right Viewport)
              ========================================================================= */}
          <g transform="translate(430, 140)">
            {/* Base Platform */}
            <polygon points="60,190 170,135 280,190 170,245" fill="#FFFFFF" stroke="#E6E9EE" strokeWidth="1.2" filter="url(#shadowFilter)" />

            {/* Keyboard Deck */}
            <polygon points="90,185 170,145 250,185 170,225" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />

            {/* Screen Bezel */}
            <polygon points="105,178 105,80 235,110 235,188" fill="#1E293B" stroke="#0F172A" strokeWidth="1.2" />
            {/* Screen Surface */}
            <polygon points="110,174 110,86 230,114 230,184" fill="#FFFFFF" />

            {/* Content Wireframe */}
            <line x1="118" y1="102" x2="222" y2="126" stroke="#E2E8F0" strokeWidth="1.5" />
            <rect x="122" y="112" width="40" height="20" fill="#F1F5F9" rx="2" transform="skewY(14)" />
            <rect x="172" y="124" width="40" height="20" fill="#EFF6FF" stroke="#2D9FFE" strokeWidth="0.8" rx="2" transform="skewY(14)" />
          </g>

          {/* =========================================================================
              DEVICE 3: MOBILE PHONE (Vertical Stand on Isometric Plinth)
              ========================================================================= */}
          <g transform="translate(610, 160)">
            {/* Stand Plinth Base */}
            <polygon points="40,165 95,138 150,165 95,192" fill="#FFFFFF" stroke="#E6E9EE" strokeWidth="1.2" filter="url(#shadowFilter)" />

            {/* Phone Chassis (Standing at ~75° angle) */}
            {/* Rear shadow body */}
            <polygon points="70,162 70,68 120,80 120,174" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
            {/* Front Screen Bezel */}
            <polygon points="68,160 68,66 118,78 118,172" fill="#000000" stroke="#000000" strokeWidth="1.2" rx="3" />
            {/* Display screen */}
            <polygon points="71,157 71,70 115,81 115,168" fill="#F8FAFC" />

            {/* Mobile App Header & Elements */}
            <line x1="75" y1="84" x2="111" y2="92" stroke="#2D9FFE" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="76" y="96" width="32" height="14" fill="#FFFFFF" stroke="#E2E8F0" rx="2" transform="skewY(14)" />
            <rect x="76" y="118" width="32" height="14" fill="#EFF6FF" stroke="#2D9FFE" strokeWidth="0.8" rx="2" transform="skewY(14)" />

            {/* Active Checkmark Pill on Phone */}
            <circle cx="95" cy="160" r="4" fill="#10B981" />
          </g>

          {/* =========================================================================
              DEVICE 4: COMPACT MOBILE 2 (Rightmost Viewport)
              ========================================================================= */}
          <g transform="translate(730, 190)">
            {/* Stand Plinth */}
            <polygon points="35,150 85,125 135,150 85,175" fill="#FFFFFF" stroke="#E6E9EE" strokeWidth="1" />

            {/* Phone Front */}
            <polygon points="60,146 60,62 105,73 105,157" fill="#000000" stroke="#000000" strokeWidth="1" rx="2" />
            <polygon points="63,143 63,65 102,75 102,153" fill="#FFFFFF" />

            {/* Screen UI */}
            <line x1="68" y1="78" x2="97" y2="85" stroke="#CBD5E1" strokeWidth="1.5" />
            <rect x="68" y="90" width="28" height="35" fill="#F8FAFC" stroke="#E2E8F0" rx="1.5" transform="skewY(14)" />
          </g>

          {/* Active Conduit Lines connecting all devices */}
          <g stroke="#2D9FFE" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.7">
            <path d="M350,230 L520,250 L700,270 L800,290" />
          </g>
        </svg>
      </div>
    </div>
  );
}
