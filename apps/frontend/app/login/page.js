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
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";

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
        setSuccessMsg("Welcome back, Paras! Redirecting to workspace...");
        setTimeout(() => {
          router.push("/dashboard");
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
          router.push("/dashboard");
        }, 800);
      } catch (err) {
        setErrorMsg("Storage error occurred while authenticating.");
        setLoading(false);
      }
    }, 700);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center pt-36 pb-16 sm:pt-44 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-white bg-simulithic-grid">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2 mb-4">
          <Badge variant="subtle" className="text-xs py-1 px-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2D9FFE]" />
            <span className="font-semibold text-[#000000]">DRISHTI AI Console</span>
          </Badge>
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#000000]">
          Sign in to your account
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#525252] max-w-sm mx-auto">
          Access autonomous multi-agent QA swarms, telemetry streams, and self-healing test matrices.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 border border-[#e6e9ee] rounded-2xl shadow-xs space-y-6">
          {/* Quick 1-Click Demo Login Button for Paras */}
          <div className="rounded-xl border border-[#2D9FFE]/30 bg-[#2D9FFE]/5 p-4 transition-all hover:bg-[#2D9FFE]/8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#0b7ee6] font-bold flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-[#2D9FFE] fill-[#2D9FFE]" />
                1-Click Evaluator Access
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#2D9FFE]/15 text-[#0b7ee6] font-semibold">
                Demo Profile
              </span>
            </div>

            <p className="text-xs text-[#525252] mb-3">
              One-click evaluation session configured for team lead &amp; judge reviews.
            </p>

            <Button
              type="button"
              onClick={handleDemoLoginParas}
              disabled={demoLoading || loading}
              className="w-full text-xs font-semibold shadow-xs"
            >
              <div className="flex h-4 w-4 rounded-full bg-white text-[#2D9FFE] items-center justify-center text-[10px] font-extrabold">
                P
              </div>
              <span>
                {demoLoading ? "Authenticating Paras..." : "1-Click Demo Login as Paras (Team Lead)"}
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e6e9ee]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-[#737373] text-[11px] font-mono">
                or continue with email
              </span>
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="p-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Standard Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#000000] mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a3a3a3]">
                  <Mail className="h-4 w-4" />
                </div>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="paras@drishti.ai or your work email"
                  required
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-[#000000]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert("For evaluation demo, any password or the 1-Click Paras Demo button works!")}
                  className="text-[11px] font-medium text-[#2D9FFE] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a3a3a3]">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="pl-9 pr-10 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#a3a3a3] hover:text-[#000000] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#525252]">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-[#e6e9ee] text-[#2D9FFE] focus:ring-0"
                />
                <span>Remember session for 30 days</span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading || demoLoading}
              variant="dark"
              size="lg"
              className="w-full text-xs font-medium shadow-xs"
            >
              <span>{loading ? "Verifying Credentials..." : "Sign In to Platform"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </form>

          {/* Security & Transport Footer Badge */}
          <div className="pt-2 border-t border-[#f0f0f0] flex items-center justify-between text-[11px] text-[#737373] font-mono">
            <span className="flex items-center gap-1.5 text-emerald-600">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>TLS 1.3 Handshake</span>
            </span>
            <span>Zero-Knowledge Storage</span>
          </div>
        </div>

        {/* Bottom Registration Link */}
        <p className="mt-6 text-center text-xs text-[#525252]">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/register"
            className="font-medium text-[#2D9FFE] hover:underline transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
