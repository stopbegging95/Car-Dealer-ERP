"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiArrowRight,
  FiArrowLeft,
  FiShield,
} from "react-icons/fi";
import { Button, Input, Dropdown } from "@/components/ui";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [preferredCurrency, setPreferredCurrency] = useState("USD");
  const [clientType, setClientType] = useState("Private Collector");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/portal");
    }, 700);
  };

  return (
    <div className="flex flex-col bg-[#F8FAFC] selection:bg-[#2563EB] min-h-screen font-sans text-[#0F172A] selection:text-[#FFFFFF]">
      {/* Header Strip */}
      <header className="flex justify-between items-center bg-[#FFFFFF] px-4 sm:px-8 py-3.5 border-[#E2E8F0] border-b">
        <Link href="/" className="group inline-flex items-center gap-2">
          <FiArrowLeft className="w-4 h-4 text-[#2563EB] transition-transform group-hover:-translate-x-0.5" />
          <span className="font-bold text-[#64748B] group-hover:text-[#2563EB] text-xs transition-colors">
            Return to Public Website
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[#64748B] text-[11px]">Already registered?</span>
          <Link
            href="/auth/login"
            className="bg-[#EFF6FF] hover:bg-[#2563EB] px-3 py-1 border border-[#BFDBFE] rounded-lg font-bold text-[#2563EB] hover:text-[#FFFFFF] text-xs transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Registration Canvas */}
      <main className="flex flex-1 justify-center items-center p-4 sm:p-6 lg:p-8">
        <div className="space-y-6 w-full max-w-lg">
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
              Create VIP Customer Account
            </h1>
            <p className="mx-auto max-w-sm text-[#64748B] text-xs">
              Register for exclusive access to live port clearance tracking, private vehicle sourcing briefs, and trade-in valuations.
            </p>
          </div>

          <div className="space-y-5 bg-[#FFFFFF] shadow-lg p-6 sm:p-8 border border-[#CBD5E1] rounded-2xl">
            <div className="flex items-center gap-3 bg-[#EFF6FF] p-3 border border-[#BFDBFE] rounded-xl text-[#2563EB] text-xs">
              <FiShield className="w-5 h-5 shrink-0" />
              <span>
                Complimentary VIP Tier membership: Free diagnostic seals and priority auto broker access.
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name / Corporate Title"
                placeholder="e.g. Chief Alexander Vance"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                leftIcon={<FiUser className="w-4 h-4 text-[#94A3B8]" />}
                required
              />

              <div className="gap-3.5 grid grid-cols-1 sm:grid-cols-2">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="alexander@vance.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<FiMail className="w-4 h-4 text-[#94A3B8]" />}
                  required
                />
                <Input
                  label="Phone / WhatsApp Number"
                  placeholder="+234 (0) 800 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  leftIcon={<FiPhone className="w-4 h-4 text-[#94A3B8]" />}
                  required
                />
              </div>

              <div className="gap-3.5 grid grid-cols-1 sm:grid-cols-2">
                <Dropdown
                  label="Client Profile Category"
                  value={clientType}
                  onChange={(v) => setClientType(String(v))}
                  options={[
                    { label: "Private Collector / Retail", value: "Private Collector" },
                    { label: "Corporate Fleet Buyer", value: "Corporate Fleet" },
                    { label: "Diplomatic Protocol", value: "Diplomatic Protocol" },
                    { label: "Independent Auto Broker", value: "Auto Broker" },
                  ]}
                />
                <Dropdown
                  label="Preferred Currency"
                  value={preferredCurrency}
                  onChange={(v) => setPreferredCurrency(String(v))}
                  options={[
                    { label: "$ USD - US Dollar", value: "USD" },
                    { label: "₦ NGN - Nigerian Naira", value: "NGN" },
                  ]}
                />
              </div>

              <Input
                label="Create Password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<FiLock className="w-4 h-4 text-[#94A3B8]" />}
                required
              />

              <div className="flex items-start gap-2 pt-1 text-[#64748B] text-xs">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-0.5 border-[#CBD5E1] rounded focus:ring-[#2563EB] text-[#2563EB] cursor-pointer"
                />
                <label htmlFor="terms" className="leading-tight cursor-pointer select-none">
                  I agree to the LuxAuto VIP Terms of Service and authorize confidential SMS and WhatsApp vehicle status updates.
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
                {isSubmitting ? "Creating VIP Profile..." : "Complete VIP Registration"}
              </Button>
            </form>
          </div>

          <div className="text-[#64748B] text-xs text-center">
            Need dealership staff or admin access?{" "}
            <Link href="/erp" className="font-bold text-[#2563EB] hover:underline">
              Dealership Staff ERP Console &rarr;
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

