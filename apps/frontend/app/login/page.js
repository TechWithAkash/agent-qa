"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Zap,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleDemoLoginParas = () => {
    setDemoLoading(true);
    setErrorMsg("");

    const demoUser = {
      id: "usr_paras_lead",
      name: "Paras",
      email: "paras@drishti.ai",
      role: "Team Lead / Staff QA Architect",
      team: "Refactor (iMocha IM-02)",
      avatar: "P",
      permissions: ["admin", "execute_swarm", "pytest_export", "self_healing"],
      loggedInAt: new Date().toISOString(),
    };

    setTimeout(() => {
      try {
        localStorage.setItem("drishti_user", JSON.stringify(demoUser));
        window.dispatchEvent(new Event("drishti_auth_change"));
        setSuccessMsg("Welcome back, Paras! Redirecting to Autonomous QA console...");
        setTimeout(() => {
          router.push("/");
        }, 800);
      } catch (err) {
        setErrorMsg("Failed to write session to localStorage.");
        setDemoLoading(false);
      }
    }, 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please provide both email and password.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      try {
        // Check if there is an existing registered user list in localStorage
        const registeredUsersStr = localStorage.getItem("drishti_registered_users");
        const registeredUsers = registeredUsersStr ? JSON.parse(registeredUsersStr) : [];
        const existing = registeredUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );

        const authenticatedUser = existing || {
          id: `usr_${Date.now()}`,
          name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          email: email,
          role: "QA Engineer",
          team: "Engineering",
          avatar: email[0].toUpperCase(),
          loggedInAt: new Date().toISOString(),
        };

        localStorage.setItem("drishti_user", JSON.stringify(authenticatedUser));
        window.dispatchEvent(new Event("drishti_auth_change"));
        setSuccessMsg(`Authenticated successfully as ${authenticatedUser.name}!`);

        setTimeout(() => {
          router.push("/");
        }, 800);
      } catch (err) {
        setErrorMsg("Storage error occurred while authenticating.");
        setLoading(false);
      }
    }, 700);
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#FAFAF9]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-200 bg-orange-50/80 text-orange-800 text-xs font-semibold mb-4 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
          <span>DRISHTI AI Console Access</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
          Sign in to your account
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#737373] max-w-sm mx-auto">
          Access autonomous multi-agent QA swarms, telemetry streams, and self-healing test matrices.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 border border-[#E5E5E5] rounded-2xl shadow-xs space-y-6">
          {/* Quick 1-Click Demo Login Button for Paras */}
          <div className="rounded-xl border border-orange-200 bg-orange-50/50 p-4 transition-all hover:bg-orange-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-orange-900 font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#F97316] fill-[#F97316]" />
                Instant Evaluator Access
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-200/70 text-orange-900 font-semibold">
                Demo Profile
              </span>
            </div>

            <p className="text-xs text-[#737373] mb-3">
              One-click evaluation session configured for team lead &amp; judge reviews.
            </p>

            <button
              type="button"
              onClick={handleDemoLoginParas}
              disabled={demoLoading || loading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer group disabled:opacity-50"
            >
              <div className="w-4 h-4 rounded-full bg-white text-[#F97316] flex items-center justify-center text-[10px] font-extrabold">
                P
              </div>
              <span>
                {demoLoading ? "Authenticating Paras..." : "1-Click Demo Login as Paras (Team Lead)"}
              </span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5E5E5]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-[#A3A3A3] font-mono text-[11px]">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="p-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Standard Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A3A3A3]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="paras@drishti.ai or your email"
                  required
                  className="w-full pl-9 pr-3.5 py-2 text-xs font-mono rounded-xl border border-[#E5E5E5] bg-[#FAFAF9] text-[#171717] placeholder-[#A3A3A3] focus:outline-hidden focus:border-[#171717] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#171717]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert("For evaluation demo, any password or the 1-Click Paras Demo button works!")}
                  className="text-[11px] font-medium text-[#F97316] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A3A3A3]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-9 pr-10 py-2 text-xs font-mono rounded-xl border border-[#E5E5E5] bg-[#FAFAF9] text-[#171717] placeholder-[#A3A3A3] focus:outline-hidden focus:border-[#171717] focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#A3A3A3] hover:text-[#171717] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#737373]">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-[#E5E5E5] text-[#171717] focus:ring-0"
                />
                <span>Remember session for 30 days</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || demoLoading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#171717] hover:bg-black text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? "Verifying Credentials..." : "Sign In to Platform"}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F97316]" />
            </button>
          </form>

          {/* Security & Transport Footer Badge */}
          <div className="pt-2 border-t border-[#F5F5F4] flex items-center justify-between text-[11px] text-[#A3A3A3] font-mono">
            <span className="flex items-center gap-1.5 text-emerald-600">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>TLS 1.3 Handshake</span>
            </span>
            <span>Zero-Knowledge Storage</span>
          </div>
        </div>

        {/* Bottom Registration Link */}
        <p className="mt-6 text-center text-xs text-[#737373]">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#171717] hover:text-[#F97316] underline underline-offset-4 transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
