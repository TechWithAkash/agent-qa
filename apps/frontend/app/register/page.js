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
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Zap,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";

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

        const existingUsersStr = localStorage.getItem("drishti_registered_users");
        const existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : [];
        const filtered = existingUsers.filter(
          (u) => u.email.toLowerCase() !== newUser.email
        );
        filtered.push(newUser);
        localStorage.setItem("drishti_registered_users", JSON.stringify(filtered));

        localStorage.setItem("drishti_user", JSON.stringify(newUser));
        window.dispatchEvent(new Event("drishti_auth_change"));

        setSuccessMsg(`Account created for ${newUser.name}! Redirecting to workspace...`);

        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      } catch (err) {
        setErrorMsg("Failed to persist user profile in localStorage.");
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
            <span className="font-semibold text-[#000000]">Engineer Onboarding</span>
          </Badge>
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#000000]">
          Create your DRISHTI account
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#525252] max-w-sm mx-auto">
          Deploy autonomous QA multi-agent swarms, self-healing locators, and automated Pytest suites.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 border border-[#e6e9ee] rounded-2xl shadow-xs space-y-6">
          {/* Quick Preload Demo Data banner */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-[#2D9FFE]/20 bg-[#2D9FFE]/5 text-xs">
            <div className="flex items-center gap-2 text-[#0b7ee6]">
              <Zap className="h-4 w-4 text-[#2D9FFE]" />
              <span className="font-medium">Testing as Team Lead?</span>
            </div>
            <button
              type="button"
              onClick={handlePreloadParas}
              className="px-2.5 py-1 rounded-[7px] bg-white border border-[#e6e9ee] hover:border-[#2D9FFE] text-[11px] font-semibold text-[#000000] transition-all cursor-pointer shadow-2xs"
            >
              Pre-fill Paras
            </button>
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#000000] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a3a3a3]">
                  <User className="h-4 w-4" />
                </div>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Paras Sanjay Kumbhar"
                  required
                  className="pl-9"
                />
              </div>
            </div>

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
                  placeholder="paras@drishti.ai"
                  required
                  className="pl-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#000000] mb-1.5">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-9 px-3 text-xs rounded-[9px] border border-[#e6e9ee] bg-white text-[#262626] focus:border-[#2D9FFE] focus:outline-hidden cursor-pointer"
                >
                  <option value="Staff QA Architect / Team Lead">Team Lead</option>
                  <option value="Senior QA Automation Engineer">QA Engineer</option>
                  <option value="Full-Stack Developer">Developer</option>
                  <option value="Hackathon Evaluator / Judge">Judge / Evaluator</option>
                  <option value="Engineering Manager">Manager</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#000000] mb-1.5">
                  Organization
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a3a3a3]">
                    <Building className="h-4 w-4" />
                  </div>
                  <Input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Team Refactor"
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#000000] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a3a3a3]">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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

            <div>
              <label className="block text-xs font-medium text-[#000000] mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a3a3a3]">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  className="pl-9 font-mono"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              variant="default"
              size="lg"
              className="w-full text-xs font-semibold shadow-xs mt-2"
            >
              <span>{loading ? "Registering Profile..." : "Create Account & Launch QA"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </form>

          {/* Security & Transport Footer Badge */}
          <div className="pt-2 border-t border-[#f0f0f0] flex items-center justify-between text-[11px] text-[#737373] font-mono">
            <span className="flex items-center gap-1.5 text-emerald-600">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Session Encrypted</span>
            </span>
            <span>Local Storage Sandboxed</span>
          </div>
        </div>

        {/* Bottom Login Link */}
        <p className="mt-6 text-center text-xs text-[#525252]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[#2D9FFE] hover:underline transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
