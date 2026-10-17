import "./globals.css";

export const metadata = {
  title: "DRISHTI AI — Autonomous AI QA Engineer",
  description: "Autonomous AI QA testing agent: explores web apps, plans grounded scenarios, validates failures via 3x replay, and generates regression tests.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-2 text-white font-bold text-lg tracking-tight">
                <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 font-black">
                  D
                </span>
                <span>DRISHTI <span className="text-indigo-400">AI</span></span>
              </a>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20">
                Autonomous QA
              </span>
            </div>

            <nav className="flex items-center gap-6 text-sm font-medium">
              <a href="/" className="text-slate-200 hover:text-white transition-colors" id="nav-new-run">
                New Run
              </a>
              <a href="/benchmarks" className="text-slate-400 hover:text-white transition-colors" id="nav-benchmarks">
                Benchmarks
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Docs
              </a>
              <div className="flex items-center gap-2 pl-4 border-l border-white/10 text-xs text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Runner Ready
              </div>
            </nav>
          </div>
        </header>

        <main className="flex-1 flex flex-col">{children}</main>

        <footer className="border-t border-white/10 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>DRISHTI AI — Autonomous Web QA Engine | Team Refactor | iMocha Track IM-02</p>
            <p className="text-slate-600">Deterministic Exploration &bull; Grounded Planning &bull; 3x Replay Verification</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
