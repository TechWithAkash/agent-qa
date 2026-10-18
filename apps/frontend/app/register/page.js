"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Building,
  Briefcase,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Staff QA Architect / Team Lead");
  const [organization, setOrganization] = useState("Team Refactor");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handlePreloadParas = () => {
    setName("Paras");
    setEmail("paras@drishti.ai");
    setPassword("Refactor2026!QA");
    setConfirmPassword("Refactor2026!QA");
    setRole("Staff QA Architect / Team Lead");
    setOrganization("Team Refactor (iMocha IM-02)");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name || !email || !password) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      try {
        const newUser = {
          id: `usr_${Date.now()}`,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          role: role,
          organization: organization.trim() || "Independent Developer",
          avatar: name.trim()[0].toUpperCase(),
          registeredAt: new Date().toISOString(),
          permissions: ["all_features", "swarm_orchestrator", "healing_engine"],
        };

        // Save to registered users registry in localStorage
        const existingUsersStr = localStorage.getItem("drishti_registered_users");
        const existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : [];
        const filtered = existingUsers.filter(
          (u) => u.email.toLowerCase() !== newUser.email
        );
        filtered.push(newUser);
        localStorage.setItem("drishti_registered_users", JSON.stringify(filtered));

        // Set as active session
        localStorage.setItem("drishti_user", JSON.stringify(newUser));
        window.dispatchEvent(new Event("drishti_auth_change"));

        setSuccessMsg(`Account created for ${newUser.name}! Redirecting to workspace...`);

        setTimeout(() => {
          router.push("/");
        }, 800);
      } catch (err) {
        setErrorMsg("Failed to persist user profile in localStorage.");
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
          <span>New Engineer Onboarding</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
          Create your DRISHTI account
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#737373] max-w-sm mx-auto">
          Deploy autonomous QA multi-agent swarms, self-healing locators, and automated Pytest suites.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 border border-[#E5E5E5] rounded-2xl shadow-xs space-y-6">
          {/* Quick Preload Demo Data banner */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 bg-[#FAFAF9] text-xs">
            <div className="flex items-center gap-2 text-zinc-700">
              <Zap className="w-4 h-4 text-[#F97316]" />
              <span className="font-medium">Testing as Team Lead?</span>
            </div>
            <button
              type="button"
              onClick={handlePreloadParas}
              className="px-2.5 py-1 rounded-lg bg-white border border-[#E5E5E5] hover:border-[#171717] text-[11px] font-semibold text-[#171717] transition-all cursor-pointer shadow-2xs"
            >
              Pre-fill Paras Profile
            </button>
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A3A3A3]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Paras Sanjay Kumbhar"
                  required
                  className="w-full pl-9 pr-3.5 py-2 text-xs font-mono rounded-xl border border-[#E5E5E5] bg-[#FAFAF9] text-[#171717] placeholder-[#A3A3A3] focus:outline-hidden focus:border-[#171717] focus:bg-white transition-colors"
                />
              </div>
            </div>

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
                  placeholder="paras@drishti.ai"
                  required
                  className="w-full pl-9 pr-3.5 py-2 text-xs font-mono rounded-xl border border-[#E5E5E5] bg-[#FAFAF9] text-[#171717] placeholder-[#A3A3A3] focus:outline-hidden focus:border-[#171717] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                  Role / Specialization
                </label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#E5E5E5] bg-[#FAFAF9] text-[#171717] focus:outline-hidden focus:border-[#171717] focus:bg-white transition-colors cursor-pointer"
                  >
                    <option value="Staff QA Architect / Team Lead">Team Lead</option>
                    <option value="Senior QA Automation Engineer">QA Engineer</option>
                    <option value="Full-Stack Developer">Developer</option>
                    <option value="Hackathon Evaluator / Judge">Judge / Evaluator</option>
                    <option value="Engineering Manager">Manager</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                  Organization / Team
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A3A3A3]">
                    <Building className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Team Refactor"
                    className="w-full pl-9 pr-3.5 py-2 text-xs font-mono rounded-xl border border-[#E5E5E5] bg-[#FAFAF9] text-[#171717] placeholder-[#A3A3A3] focus:outline-hidden focus:border-[#171717] focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A3A3A3]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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

            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A3A3A3]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  className="w-full pl-9 pr-3.5 py-2 text-xs font-mono rounded-xl border border-[#E5E5E5] bg-[#FAFAF9] text-[#171717] placeholder-[#A3A3A3] focus:outline-hidden focus:border-[#171717] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#171717] hover:bg-black text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              <span>{loading ? "Registering Profile..." : "Create Account & Launch QA"}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F97316]" />
            </button>
          </form>

          {/* Security & Transport Footer Badge */}
          <div className="pt-2 border-t border-[#F5F5F4] flex items-center justify-between text-[11px] text-[#A3A3A3] font-mono">
            <span className="flex items-center gap-1.5 text-emerald-600">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Session Encrypted</span>
            </span>
            <span>Local Storage Sandboxed</span>
          </div>
        </div>

        {/* Bottom Login Link */}
        <p className="mt-6 text-center text-xs text-[#737373]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#171717] hover:text-[#F97316] underline underline-offset-4 transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
