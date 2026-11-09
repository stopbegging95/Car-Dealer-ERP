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
import { Button, Input, Checkbox, Modal } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<"client" | "staff">("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (accountType === "staff") {
        const lowerEmail = email.toLowerCase();
        let targetRole = "admin";
        if (lowerEmail.includes("accountant") || lowerEmail.includes("accounting")) {
          targetRole = "accounting";
        } else if (lowerEmail.includes("finance") || lowerEmail.includes("underwriting")) {
          targetRole = "financing";
        } else if (lowerEmail.includes("sales")) {
          targetRole = "sales";
        } else if (lowerEmail.includes("service") || lowerEmail.includes("workshop")) {
          targetRole = "service";
        } else if (lowerEmail.includes("parts")) {
          targetRole = "parts";
        } else if (lowerEmail.includes("import") || lowerEmail.includes("logistics")) {
          targetRole = "imports";
        } else if (lowerEmail.includes("trade") || lowerEmail.includes("swap") || lowerEmail.includes("appraisal")) {
          targetRole = "trade-ins";
        } else if (lowerEmail.includes("recon") || lowerEmail.includes("detail")) {
          targetRole = "recon";
        } else if (lowerEmail.includes("crm")) {
          targetRole = "crm";
        } else if (lowerEmail.includes("hr")) {
          targetRole = "hr";
        } else if (lowerEmail.includes("cms")) {
          targetRole = "cms";
        }
        router.push(`/erp?role=${targetRole}`);
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
            <Button
              type="button"
              variant={accountType === "client" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setAccountType("client")}
              leftIcon={<FaCar className="w-3.5 h-3.5" />}
              className="justify-center"
            >
              Customer Portal
            </Button>

            <Button
              type="button"
              variant={accountType === "staff" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setAccountType("staff")}
              leftIcon={<FiShield className="w-3.5 h-3.5" />}
              className="justify-center"
            >
              Dealership ERP
            </Button>
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
                      setIsForgotModalOpen(true);
                    }}
                    className="font-semibold text-[#2563EB] text-[11px] hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <div className="flex items-center text-[#64748B] text-xs">
                <Checkbox
                  checked={rememberMe}
                  onChange={setRememberMe}
                  label="Remember my session on this device"
                />
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
            <div className="pt-3 border-[#E2E8F0] border-t text-[#64748B] text-[11px] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[#0F172A]">Demo Quick Sign-In:</span>
                <span className="text-[10px] text-[#64748B]">Auto-provisions department desk</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setAccountType("client");
                    setEmail("alexander@vance.com");
                    setPassword("password123");
                  }}
                  className="font-mono text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] px-2 py-0.5 text-[10px]"
                >
                  VIP Client
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setAccountType("staff");
                    setEmail("admin@luxauto.dealers.com");
                    setPassword("admin123");
                  }}
                  className="font-mono text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] px-2 py-0.5 text-[10px]"
                >
                  Super Admin
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setAccountType("staff");
                    setEmail("chief.accountant@luxauto.dealers.com");
                    setPassword("finance123");
                  }}
                  className="font-mono text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] px-2 py-0.5 text-[10px]"
                >
                  Accounting Dept
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setAccountType("staff");
                    setEmail("finance@luxauto.dealers.com");
                    setPassword("finance123");
                  }}
                  className="font-mono text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] px-2 py-0.5 text-[10px]"
                >
                  Finance Dept
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setAccountType("staff");
                    setEmail("sales.director@luxauto.dealers.com");
                    setPassword("sales123");
                  }}
                  className="font-mono text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] px-2 py-0.5 text-[10px]"
                >
                  Sales Desk
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setAccountType("staff");
                    setEmail("service.manager@luxauto.dealers.com");
                    setPassword("service123");
                  }}
                  className="font-mono text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] px-2 py-0.5 text-[10px]"
                >
                  Workshop Desk
                </Button>
              </div>
            </div>
          </div>

          {/* Footer Registration & Staff Dashboard Links */}
          <div className="space-y-2 text-[#64748B] text-xs text-center">
            <div>
              Don&apos;t have a customer account yet?{" "}
              <Link href="/auth/register" className="font-bold text-[#2563EB] hover:underline">
                Register as a VIP Customer &rarr;
              </Link>
            </div>
            <div>
              Dealership Staff, Accountant or Director?{" "}
              <Link href="/auth/dashboard-login" className="font-bold text-[#0F172A] hover:text-[#2563EB] transition-colors underline">
                Enterprise Dashboard Login &rarr;
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Password Reset Confirmation Modal */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="Password Reset Instructions"
        description="Secure credentials recovery for authorized client & staff accounts."
        size="sm"
        footer={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsForgotModalOpen(false)}
            leftIcon={<FiCheckCircle className="w-3.5 h-3.5" />}
          >
            Acknowledge & Close
          </Button>
        }
      >
        <div className="space-y-3 text-xs text-[#475569]">
          <p>
            A secure one-time password (OTP) reset link and verification instructions have been dispatched to your registered email address.
          </p>
          <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg text-[11px] text-[#1D4ED8] flex items-start gap-2">
            <FiShield className="w-4 h-4 shrink-0 text-[#2563EB] mt-0.5" />
            <span>If you do not see the email within 2 minutes, please verify your spam folder or contact Dealership IT Concierge.</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}

