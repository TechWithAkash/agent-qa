"use client";

import { useState } from "react";
import {
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
  Lock,
  Maximize2,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  Info,
  Compass,
} from "lucide-react";

export default function LiveBrowserTab({
  viewportMode,
  setViewportMode,
  previewRoute,
  setPreviewRoute,
  previewUrlInput,
  setPreviewUrlInput,
  isNavigatingPreview,
  handleNavigatePreview,
  targetUrl,
  model,
  copiedSelector,
  copyToClipboard,
  setFullImageModal,
  persona = "pm",
}) {
  const [iframeError, setIframeError] = useState(false);

  const cleanBaseUrl = targetUrl ? targetUrl.replace(/\/$/, "") : "https://app";
  const currentFullPath = cleanBaseUrl + (previewRoute.startsWith("/") ? previewRoute : "/" + previewRoute);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Live Preview Column (8 Cols) */}
      <div className="rounded-2xl border border-[#e6e9ee] bg-white p-5 sm:p-6 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] lg:col-span-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#f0f0f0]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2D9FFE]"></span>
            <Eye className="w-4 h-4 text-[#2D9FFE]" />
            <h3 className="text-sm font-bold text-[#000000]">
              Live Application Viewport &amp; Route Explorer
            </h3>
          </div>

          {/* Viewport switcher */}
          <div className="flex items-center gap-1 rounded-xl border border-[#e6e9ee] bg-[#fafafa] p-1 text-xs">
            <button
              type="button"
              onClick={() => setViewportMode("desktop")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition-colors cursor-pointer ${
                viewportMode === "desktop"
                  ? "bg-white text-[#000000] font-semibold shadow-2xs border border-[#e6e9ee]"
                  : "text-[#737373] hover:text-[#000000]"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setViewportMode("tablet")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition-colors cursor-pointer ${
                viewportMode === "tablet"
                  ? "bg-white text-[#000000] font-semibold shadow-2xs border border-[#e6e9ee]"
                  : "text-[#737373] hover:text-[#000000]"
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => setViewportMode("mobile")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition-colors cursor-pointer ${
                viewportMode === "mobile"
                  ? "bg-white text-[#000000] font-semibold shadow-2xs border border-[#e6e9ee]"
                  : "text-[#737373] hover:text-[#000000]"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
          </div>
        </div>

        {/* Interactive Address Bar & Quick Nav */}
        <div className="flex flex-col gap-2 rounded-xl border border-[#e6e9ee] bg-[#fafafa] p-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleNavigatePreview("/")}
              title="Navigate to Home"
              className="p-2 rounded-lg hover:bg-[#e6e9ee] text-[#737373] hover:text-[#000000] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Active URL Address Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (previewUrlInput) handleNavigatePreview(previewUrlInput);
              }}
              className="flex-1 flex items-center gap-2 rounded-lg border border-[#e6e9ee] bg-white px-3 py-1.5 text-xs font-mono shadow-2xs"
            >
              <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="text-[#a3a3a3] shrink-0">
                {cleanBaseUrl}
              </span>
              <input
                type="text"
                value={previewUrlInput !== "" ? previewUrlInput : previewRoute}
                onChange={(e) => setPreviewUrlInput(e.target.value)}
                placeholder={previewRoute}
                className="w-full bg-transparent text-[#000000] outline-none placeholder:text-[#a3a3a3] font-mono text-xs font-medium"
              />
              <button
                type="submit"
                className="px-3 py-1 rounded-md bg-[#2D9FFE] hover:bg-[#0b7ee6] text-white font-sans text-[11px] font-semibold cursor-pointer shrink-0 transition-colors"
              >
                Navigate
              </button>
            </form>

            {/* External Tab Opener */}
            <a
              href={currentFullPath}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#e6e9ee] bg-white text-xs font-semibold text-[#000000] hover:bg-[#fafafa] transition-all shadow-2xs shrink-0 cursor-pointer"
              title="Open full interactive site in dedicated browser tab"
            >
              <span>Open Tab</span>
              <ExternalLink className="w-3 h-3 text-[#737373]" />
            </a>
          </div>

          {/* Quick Route Nav Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-1 text-[11px] font-sans">
            <span className="text-[10px] uppercase font-bold text-[#a3a3a3] shrink-0 mr-1 font-mono flex items-center gap-1">
              <Compass className="w-3 h-3" />
              <span>Discovered Routes:</span>
            </span>
            {(targetUrl?.toLowerCase().includes("padmora")
              ? [
                  { label: "Storefront (/)", route: "/" },
                  { label: "Mohar Collection", route: "/collections/mohar" },
                  { label: "All Sarees", route: "/collections/all" },
                  { label: "Shop by Weave", route: "/#weaves" },
                  { label: "Sarees in Motion", route: "/#motion" },
                ]
              : [
                  { label: "Home (/)", route: "/" },
                  { label: "Sign-Up (/auth/signup)", route: "/auth/signup" },
                  { label: "Sign-In (/auth/signin)", route: "/auth/signin" },
                  { label: "Budget View", route: "/budget" },
                  { label: "Track View", route: "/track" },
                ]
            ).map((tab, idx) => {
              const isActive =
                previewRoute === tab.route ||
                (tab.route !== "/" && previewRoute.includes(tab.route.replace(/^\//, "")));
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPreviewUrlInput(tab.route);
                    handleNavigatePreview(tab.route);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                    isActive
                      ? "bg-[#000000] text-white shadow-2xs border border-[#000000] font-semibold"
                      : "bg-white text-[#525252] hover:text-[#000000] hover:bg-[#fafafa] border border-[#e6e9ee]"
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Embedded Viewport Frame */}
        <div className="overflow-hidden rounded-2xl border border-[#e6e9ee] bg-white shadow-xs">
          <div className="flex h-8 items-center justify-between bg-[#fafafa] border-b border-[#e6e9ee] px-3 font-mono text-[11px] text-[#737373]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ff5f56]"></span>
              <span className="w-2 h-2 rounded-full bg-[#ffbd2e]"></span>
              <span className="w-2 h-2 rounded-full bg-[#27c93f]"></span>
              <span className="ml-2 truncate max-w-[340px] text-[#525252] font-medium">
                {currentFullPath}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isNavigatingPreview && (
                <span className="text-[#0b7ee6] font-mono text-[10px] animate-pulse font-bold">
                  NAVIGATING...
                </span>
              )}
              <span className="text-emerald-700 font-bold text-[10px]">CHROMIUM CAPTURE</span>
            </div>
          </div>

          <div
            className={`transition-all duration-300 mx-auto relative ${
              viewportMode === "desktop"
                ? "w-full h-[520px]"
                : viewportMode === "tablet"
                ? "w-[85%] h-[520px]"
                : "w-[55%] h-[520px]"
            }`}
          >
            {isNavigatingPreview && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-2xs z-20 flex flex-col items-center justify-center gap-2 font-mono text-xs text-[#000000]">
                <span className="w-5 h-5 rounded-full border-2 border-[#2D9FFE] border-t-transparent animate-spin"></span>
                <span>Dispatching Chromium Context to {previewRoute}...</span>
              </div>
            )}

            {/* Padmora Viewport Render */}
            {targetUrl?.toLowerCase().includes("padmora") ? (
              <div className="h-full w-full relative overflow-y-auto bg-zinc-100 flex flex-col items-center">
                <div className="sticky top-3 self-end mr-3 mb-[-36px] bg-white/95 backdrop-blur-sm border border-[#e6e9ee] px-3 py-1.5 rounded-full text-[10px] font-mono text-emerald-700 font-bold flex items-center gap-2 shadow-xs z-10">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>STOREFRONT: PADMORA SAREES (MOHAR COLLECTION)</span>
                  <button
                    type="button"
                    onClick={() =>
                      setFullImageModal({
                        src: "/screenshots/padmora-home.png",
                        title: "Padmora Sarees by Yashi | Storefront",
                        route: "https://padmorasarees.com/",
                        description: "Full High-Resolution Storefront Viewport (Mohar Collection)",
                      })
                    }
                    className="ml-1 p-0.5 hover:bg-zinc-100 rounded text-zinc-600 transition-colors cursor-pointer"
                    title="Expand Full Page"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>
                </div>
                <img
                  src="/screenshots/padmora-home.png"
                  alt="Padmora Sarees Storefront Render"
                  className="w-full h-auto block select-none shadow-xs"
                />
              </div>
            ) : (!targetUrl || targetUrl.includes("wealthwise") || targetUrl.includes("mywealthwise")) ? (
              /* WealthWise Viewport Render */
              <div className="h-full w-full relative overflow-y-auto bg-zinc-100 flex flex-col items-center">
                {(() => {
                  const activeScreenshotSrc =
                    previewRoute.includes("signup")
                      ? "/screenshots/wealthwise-signup.png"
                      : previewRoute.includes("signin") || previewRoute.includes("login")
                      ? "/screenshots/wealthwise-auth.png"
                      : previewRoute.includes("budget")
                      ? "/screenshots/wealthwise-budget.png"
                      : previewRoute.includes("track")
                      ? "/screenshots/wealthwise-track.png"
                      : "/screenshots/wealthwise-home.png";
                  const activeRouteName =
                    previewRoute.includes("signup")
                      ? "ROUTE: /auth/signup (SIGN-UP FORM)"
                      : previewRoute.includes("signin") || previewRoute.includes("login")
                      ? "ROUTE: /auth/signin (SIGN-IN PORTAL)"
                      : previewRoute.includes("budget")
                      ? "FEATURE: BUDGET DASHBOARD"
                      : previewRoute.includes("track")
                      ? "FEATURE: EXPENSE TRACKER"
                      : "ROUTE: / (HOMEPAGE HERO)";
                  return (
                    <>
                      <div className="sticky top-3 self-end mr-3 mb-[-36px] bg-white/95 backdrop-blur-sm border border-[#e6e9ee] px-3 py-1.5 rounded-full text-[10px] font-mono text-emerald-700 font-bold flex items-center gap-2 shadow-xs z-10">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>{activeRouteName}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setFullImageModal({
                              src: activeScreenshotSrc,
                              title: `WealthWise • ${activeRouteName}`,
                              route: previewRoute,
                              description: "High-Resolution Target Viewport Render",
                            })
                          }
                          className="ml-1 p-0.5 hover:bg-zinc-100 rounded text-zinc-600 transition-colors cursor-pointer"
                          title="Expand Full Page"
                        >
                          <Maximize2 className="w-3 h-3" />
                        </button>
                      </div>
                      <img
                        src={activeScreenshotSrc}
                        alt="WealthWise Target Render"
                        className="w-full h-auto block select-none shadow-xs"
                      />
                    </>
                  );
                })()}
              </div>
            ) : (
              /* External Arbitrary Target with Fallback Protection */
              <div className="w-full h-full relative">
                <iframe
                  src={`/api/proxy-preview?url=${encodeURIComponent(currentFullPath)}`}
                  title="Live Target Web Application Viewport"
                  sandbox="allow-same-origin allow-forms"
                  onError={() => setIframeError(true)}
                  className="w-full h-full border-0 bg-white"
                  loading="lazy"
                />

                {/* CSP / X-Frame-Options Advisory Banner */}
                <div className="absolute bottom-3 inset-x-3 bg-white/95 backdrop-blur-md border border-[#e6e9ee] p-3 rounded-xl flex items-center justify-between text-xs shadow-md">
                  <div className="flex items-center gap-2 text-[#525252]">
                    <Info className="w-4 h-4 text-[#2D9FFE] shrink-0" />
                    <span>
                      Viewing external target. If blocked by target CSP (<code className="font-mono text-zinc-800">frame-ancestors</code>), use dedicated tab.
                    </span>
                  </div>
                  <a
                    href={currentFullPath}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2D9FFE] hover:bg-[#0b7ee6] text-white font-medium text-[11px] transition-colors shrink-0 cursor-pointer"
                  >
                    <span>Open External Site ↗</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Discovered Locators Column (4 Cols) */}
      <div className="rounded-2xl border border-[#e6e9ee] bg-white p-5 sm:p-6 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] lg:col-span-4">
        <div className="border-b border-[#f0f0f0] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2D9FFE]"></span>
            <h3 className="text-sm font-bold text-[#000000]">
              Discovered Locators ({model?.buttons?.length || 0})
            </h3>
          </div>
          <p className="text-xs text-[#737373] mt-0.5">
            Click any semantic element to navigate and copy selector
          </p>
        </div>

        <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
          {(() => {
            const isPadmoraSite = targetUrl?.toLowerCase().includes("padmora");
            const buttonList =
              model?.buttons && model.buttons.length > 0
                ? model.buttons
                : isPadmoraSite
                ? ["EXPLORE MOHAR", "Shop by Weave", "Maheshwari", "Banarasi", "VIEW ALL SAREES", "FIND MY SAREE"]
                : [];

            if (buttonList.length === 0) {
              return (
                <div className="p-6 text-center text-xs text-[#a3a3a3] font-mono border border-dashed border-[#e6e9ee] rounded-xl">
                  Discovering accessible controls...
                </div>
              );
            }

            return buttonList.map((btn, idx) => {
              const selectorStr = `button:has-text("${btn}")`;
              const isCopied = copiedSelector === selectorStr;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    copyToClipboard(selectorStr);
                    if (isPadmoraSite && btn.includes("MOHAR")) {
                      handleNavigatePreview("/collections/mohar");
                    }
                  }}
                  className="group flex items-center justify-between p-3 rounded-xl border border-[#e6e9ee] bg-[#fafafa]/80 hover:bg-white hover:border-[#2D9FFE] hover:shadow-2xs transition-all cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    <span className="font-semibold text-[#000000] truncate">{btn}</span>
                  </div>

                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-mono text-[#737373] bg-white border border-[#e6e9ee] px-1.5 py-0.5 rounded">
                      {isCopied ? "Copied" : "Copy"}
                    </span>
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-[#737373]" />
                    )}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
}
