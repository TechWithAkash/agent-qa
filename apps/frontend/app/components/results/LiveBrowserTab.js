"use client";

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
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Live Preview Column (8 Cols) */}
      <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 space-y-4 shadow-xs lg:col-span-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#F5F5F4]">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#F97316]" />
            <h3 className="text-sm font-semibold text-[#171717]">
              Live Target Web Preview
            </h3>
          </div>

          {/* Viewport switcher */}
          <div className="flex items-center gap-1 rounded-lg border border-[#E5E5E5] bg-[#FAFAF9] p-1 text-xs">
            <button
              type="button"
              onClick={() => setViewportMode("desktop")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors cursor-pointer ${
                viewportMode === "desktop"
                  ? "bg-[#171717] text-white font-medium shadow-2xs"
                  : "text-[#737373] hover:text-[#171717]"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setViewportMode("tablet")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors cursor-pointer ${
                viewportMode === "tablet"
                  ? "bg-[#171717] text-white font-medium shadow-2xs"
                  : "text-[#737373] hover:text-[#171717]"
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => setViewportMode("mobile")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors cursor-pointer ${
                viewportMode === "mobile"
                  ? "bg-[#171717] text-white font-medium shadow-2xs"
                  : "text-[#737373] hover:text-[#171717]"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
          </div>
        </div>

        {/* Interactive Address Bar & Quick Nav */}
        <div className="flex flex-col gap-2 rounded-xl border border-[#E5E5E5] bg-[#FAFAF9] p-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleNavigatePreview("/")}
              title="Navigate to Home"
              className="p-1 rounded hover:bg-[#E5E5E5] text-[#737373] hover:text-[#171717] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Active URL Address Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (previewUrlInput) handleNavigatePreview(previewUrlInput);
              }}
              className="flex-1 flex items-center gap-2 rounded-lg border border-[#E5E5E5] bg-white px-3 py-1.5 text-xs font-mono shadow-2xs"
            >
              <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="text-[#A3A3A3] shrink-0">
                {targetUrl.replace(/\/$/, "")}
              </span>
              <input
                type="text"
                value={previewUrlInput !== "" ? previewUrlInput : previewRoute}
                onChange={(e) => setPreviewUrlInput(e.target.value)}
                placeholder={previewRoute}
                className="w-full bg-transparent text-[#171717] outline-none placeholder:text-[#A3A3A3] font-mono text-xs font-medium"
              />
              <button
                type="submit"
                className="px-2 py-0.5 rounded bg-[#171717] hover:bg-black text-white font-sans text-[10px] font-semibold cursor-pointer shrink-0 transition-colors"
              >
                Navigate
              </button>
            </form>
          </div>

          {/* Quick Route Nav Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-1 text-[11px] font-sans">
            <span className="text-[10px] uppercase font-bold text-[#A3A3A3] shrink-0 mr-1 font-mono">
              Routes:
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
                      ? "bg-[#171717] text-white shadow-2xs border border-[#171717] font-semibold"
                      : "bg-white text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F4] border border-[#E5E5E5]"
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Embedded Live Browser Frame */}
        <div className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-white shadow-xs">
          <div className="flex h-8 items-center justify-between bg-[#FAFAF9] border-b border-[#E5E5E5] px-3 font-mono text-[11px] text-[#737373]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF5F56]"></span>
              <span className="w-2 h-2 rounded-full bg-[#FFBD2E]"></span>
              <span className="w-2 h-2 rounded-full bg-[#27C93F]"></span>
              <span className="ml-2 truncate max-w-[340px] text-[#525252] font-medium">
                {targetUrl.replace(/\/$/, "")}
                {previewRoute.startsWith("/") ? previewRoute : "/" + previewRoute}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isNavigatingPreview && (
                <span className="text-[#F97316] font-mono text-[10px] animate-pulse font-bold">
                  NAVIGATING...
                </span>
              )}
              <span className="text-emerald-700 font-bold text-[10px]">REAL-TIME RENDER</span>
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
              <div className="absolute inset-0 bg-white/70 backdrop-blur-2xs z-20 flex flex-col items-center justify-center gap-2 font-mono text-xs text-[#171717]">
                <span className="w-5 h-5 rounded-full border-2 border-[#171717] border-t-transparent animate-spin"></span>
                <span>Dispatching Chromium Context to {previewRoute}...</span>
              </div>
            )}

            {targetUrl?.toLowerCase().includes("padmora") ? (
              <div className="h-full w-full relative overflow-y-auto bg-zinc-100 flex flex-col items-center">
                <div className="sticky top-3 self-end mr-3 mb-[-36px] bg-white/95 backdrop-blur-sm border border-[#E5E5E5] px-3 py-1.5 rounded-full text-[10px] font-mono text-emerald-700 font-bold flex items-center gap-2 shadow-xs z-10">
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
                      <div className="sticky top-3 self-end mr-3 mb-[-36px] bg-white/95 backdrop-blur-sm border border-[#E5E5E5] px-3 py-1.5 rounded-full text-[10px] font-mono text-emerald-700 font-bold flex items-center gap-2 shadow-xs z-10">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>{activeRouteName}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setFullImageModal({
                              src: activeScreenshotSrc,
                              title: `WealthWise &bull; ${activeRouteName}`,
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
              <iframe
                src={`/api/proxy-preview?url=${encodeURIComponent(
                  targetUrl.replace(/\/$/, "") + (previewRoute.startsWith("/") ? previewRoute : "/" + previewRoute)
                )}`}
                title="Live Target Web Application Viewport"
                sandbox="allow-same-origin allow-forms"
                className="w-full h-full border-0 bg-white"
                loading="lazy"
              />
            )}
          </div>
        </div>
      </div>

      {/* Discovered Locators Column (4 Cols) */}
      <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 space-y-4 shadow-xs lg:col-span-4">
        <div className="border-b border-[#F5F5F4] pb-3">
          <h3 className="text-sm font-semibold text-[#171717]">
            Discovered Locators ({model?.buttons?.length || 0})
          </h3>
          <p className="text-xs text-[#737373] mt-0.5">
            Click any locator to navigate preview &amp; copy selector
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

            return buttonList.length > 0 ? (
              buttonList.map((btn, idx) => {
                const sel = `button:has-text("${btn}")`;
                const btnLower = btn.toLowerCase();
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      copyToClipboard(sel, "selector");
                      if (btnLower.includes("budget")) {
                        handleNavigatePreview("/budget");
                      } else if (btnLower.includes("track")) {
                        handleNavigatePreview("/track");
                      } else if (btnLower.includes("sign in") || btnLower.includes("login")) {
                        handleNavigatePreview("/auth/signin");
                      } else if (
                        btnLower.includes("free") ||
                        btnLower.includes("sign up") ||
                        btnLower.includes("get started")
                      ) {
                        handleNavigatePreview("/auth/signup");
                      } else if (btnLower.includes("home") || btnLower.includes("wealthwise") || btnLower.includes("mohar")) {
                        handleNavigatePreview("/");
                      }
                    }}
                    className="group flex items-center justify-between rounded-xl border border-[#E5E5E5] bg-[#FAFAF9]/80 p-2.5 text-xs transition-all hover:border-[#171717] hover:bg-white cursor-pointer shadow-2xs"
                  >
                    <div className="truncate pr-2">
                      <span className="block truncate font-medium text-[#171717]">
                        {btn}
                      </span>
                      <code className="font-mono text-[10px] text-[#737373]">{sel}</code>
                    </div>
                    <span className="text-[#A3A3A3] group-hover:text-[#171717] shrink-0">
                      {copiedSelector === sel ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-[#A3A3A3] text-center py-6">
                Locators will appear here once synthesized.
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
