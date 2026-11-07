"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiMail,
  FiLock,
  FiArrowRight,
  FiShield,
  FiArrowLeft,
  FiCheckCircle,
} from "react-icons/fi";
import { FaCar } from "react-icons/fa6";
import { Button, Input } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<"client" | "staff">("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (accountType === "staff") {
        router.push("/erp");
      } else {
        router.push("/portal");
      }
    }, 600);
  };

  return (
    <div className="flex flex-col bg-[#F8FAFC] selection:bg-[#2563EB] min-h-screen font-sans text-[#0F172A] selection:text-[#FFFFFF]">
      {/* Top Header Strip */}
      <header className="flex justify-between items-center bg-[#FFFFFF] px-4 sm:px-8 py-3.5 border-[#E2E8F0] border-b">
        <Link href="/" className="group inline-flex items-center gap-2">
          <FiArrowLeft className="w-4 h-4 text-[#2563EB] transition-transform group-hover:-translate-x-0.5" />
          <span className="font-bold text-[#64748B] group-hover:text-[#2563EB] text-xs transition-colors">
            Return to Public Website
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="bg-[#16A34A] rounded-full w-2 h-2 animate-pulse" />
          <span className="font-mono font-bold text-[#64748B] text-[11px]">
            256-Bit SSL Encrypted Portal
          </span>
        </div>
      </header>

      {/* Main Login Canvas */}
      <main className="flex flex-1 justify-center items-center p-4 sm:p-6 lg:p-8">
        <div className="space-y-6 w-full max-w-md">
          {/* Brand Header */}
          <div className="space-y-2 text-center">
            <Link href="/" className="inline-block">
              <div className="flex flex-col items-center">
                <svg className="w-10 h-5 text-[#2563EB]" viewBox="0 0 60 20" fill="currentColor">
                  <path d="M5 15 C 15 2, 45 2, 55 15 C 45 12, 15 12, 5 15 Z" />
                </svg>
                <div className="font-black text-[#0F172A] text-lg uppercase tracking-widest">
                  PREMIER
                </div>
                <div className="-mt-0.5 font-bold text-[#2563EB] text-[9px] uppercase tracking-widest">
                  AUTO MOTORS
                </div>
              </div>
            </Link>

            <h1 className="font-black text-[#0F172A] text-xl sm:text-2xl uppercase tracking-tight">
              Sign In to Your Account
            </h1>
            <p className="text-[#64748B] text-xs">
              Access your VIP garage, track live orders, or log in to the dealership ERP console.
            </p>
          </div>

          {/* Account Type Toggle */}
          <div className="gap-1.5 grid grid-cols-2 bg-[#FFFFFF] shadow-xs p-1 border border-[#CBD5E1] rounded-lg">
            <button
              type="button"
              onClick={() => setAccountType("client")}
              className={`flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
                accountType === "client"
                  ? "bg-[#000000] text-[#FFFFFF] shadow-md shadow-black/20"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <FaCar className="w-3.5 h-3.5" />
              <span>Customer Portal</span>
            </button>

            <button
              type="button"
              onClick={() => setAccountType("staff")}
              className={`flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
                accountType === "staff"
                  ? "bg-[#000000] text-[#FFFFFF] shadow-md shadow-black/20"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <FiShield className="w-3.5 h-3.5" />
              <span>Dealership ERP</span>
            </button>
          </div>

          {/* Auth Card */}
          <div className="space-y-5 bg-[#FFFFFF] shadow-lg p-6 sm:p-7 border border-[#CBD5E1] rounded-2xl">
            <div className="flex items-center gap-2 bg-[#EFF6FF] p-2.5 border border-[#BFDBFE] rounded-xl font-semibold text-[#2563EB] text-xs">
              <FiCheckCircle className="w-4 h-4 shrink-0" />
              <span>
                {accountType === "client"
                  ? "Client Portal: View saved vehicles, test drive bookings, and customs tracking."
                  : "ERP Back-Office: Super Admin & Staff inventory, sales, and accounting console."}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder={accountType === "client" ? "alexander@vance.com" : "admin@luxauto.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<FiMail className="w-4 h-4 text-[#94A3B8]" />}
                required
              />

              <div className="space-y-1">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<FiLock className="w-4 h-4 text-[#94A3B8]" />}
                  required
                />
                <div className="flex justify-end pt-1">
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Password reset OTP instructions sent to your registered email.");
                    }}
                    className="font-semibold text-[#2563EB] text-[11px] hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[#64748B] text-xs">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="border-[#CBD5E1] rounded focus:ring-[#2563EB] text-[#2563EB] cursor-pointer"
                />
                <label htmlFor="remember" className="cursor-pointer select-none">
                  Remember my session on this device
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                disabled={isSubmitting}
                rightIcon={<FiArrowRight className="w-4 h-4 text-[#FFFFFF]" />}
              >
                {isSubmitting
                  ? "Authenticating..."
                  : accountType === "staff"
                  ? "Launch ERP Console"
                  : "Enter Customer Portal"}
              </Button>
            </form>

            {/* Quick Demo Pre-fills */}
            <div className="flex justify-between items-center pt-3 border-[#E2E8F0] border-t text-[#64748B] text-[11px]">
              <span>Demo Quick Sign-In:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAccountType("client");
                    setEmail("alexander@vance.com");
                    setPassword("password123");
                  }}
                  className="font-mono text-[#2563EB] hover:underline cursor-pointer"
                >
                  Client Demo
                </button>
                <span>&bull;</span>
                <button
                  type="button"
                  onClick={() => {
                    setAccountType("staff");
                    setEmail("admin@luxauto.com");
                    setPassword("admin123");
                  }}
                  className="font-mono text-[#2563EB] hover:underline cursor-pointer"
                >
                  ERP Staff Demo
                </button>
              </div>
            </div>
          </div>

          {/* Footer Registration Link */}
          <div className="text-[#64748B] text-xs text-center">
            Don&apos;t have an account yet?{" "}
            <Link href="/auth/register" className="font-bold text-[#2563EB] hover:underline">
              Register for VIP Access &rarr;
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

