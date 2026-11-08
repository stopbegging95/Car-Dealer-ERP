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
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiMapPin,
  FiDollarSign,
} from "react-icons/fi";
import { FaCar } from "react-icons/fa6";
import { Button, Input, Dropdown, Checkbox, Badge, Modal } from "@/components/ui";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [preferredCurrency, setPreferredCurrency] = useState("USD");
  const [clientType, setClientType] = useState("Private Collector");
  const [showroomHub, setShowroomHub] = useState("VI");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [receiveAlerts, setReceiveAlerts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Password strength score
  const getPasswordStrength = () => {
    if (!password) return { text: "None", color: "bg-slate-200", percent: 0 };
    let score = 0;
    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;

    if (score <= 25) return { text: "Weak", color: "bg-red-500", percent: 25 };
    if (score <= 50) return { text: "Moderate", color: "bg-amber-500", percent: 50 };
    if (score <= 75) return { text: "Good", color: "bg-blue-500", percent: 75 };
    return { text: "Strong", color: "bg-emerald-500", percent: 100 };
  };

  const strength = getPasswordStrength();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!firstName || !lastName || !email || !phone || !password) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify your password entry.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters in length.");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("You must accept the terms of service to create your VIP account.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 800);
  };

  const handleEnterDashboard = () => {
    setShowSuccessModal(false);
    router.push("/portal");
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
          <span className="font-mono text-[#64748B] text-[11px]">Already have an account?</span>
          <Link
            href="/auth/login"
            className="bg-[#EFF6FF] hover:bg-[#2563EB] px-3.5 py-1 border border-[#BFDBFE] rounded-lg font-bold text-[#2563EB] hover:text-[#FFFFFF] text-xs transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Registration Canvas */}
      <main className="flex flex-1 justify-center items-center p-4 sm:p-6 lg:p-8">
        <div className="space-y-6 w-full max-w-xl">
          {/* Header Brand */}
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
            <p className="mx-auto max-w-md text-[#64748B] text-xs">
              Register for exclusive access to live port customs tracking, private vehicle sourcing briefs, and trade-in valuations.
            </p>
          </div>

          {/* Registration Form Card */}
          <div className="space-y-5 bg-[#FFFFFF] shadow-xl p-6 sm:p-8 border border-[#CBD5E1] rounded-2xl">
            {/* VIP Tier Badge Header */}
            <div className="flex items-center justify-between bg-[#EFF6FF] p-3 border border-[#BFDBFE] rounded-xl text-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#2563EB] text-white">
                  <FiShield className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#1E40AF] block">Complimentary VIP Black Tier Access</span>
                  <span className="text-[#3B82F6] text-[11px]">Free 150-point diagnostic reports and auto broker priority</span>
                </div>
              </div>
              <Badge variant="gold" size="sm">Active Tier</Badge>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 bg-[#FEF2F2] p-3 border border-[#FCA5A5] rounded-xl text-[#B91C1C] text-xs">
                <FiAlertCircle className="w-4 h-4 shrink-0 text-[#EF4444]" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Grid */}
              <div className="gap-3.5 grid grid-cols-1 sm:grid-cols-2">
                <Input
                  label="First Name"
                  placeholder="e.g. Alexander"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  leftIcon={<FiUser className="w-4 h-4 text-[#94A3B8]" />}
                  required
                />
                <Input
                  label="Last Name / Title"
                  placeholder="e.g. Vance"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  leftIcon={<FiUser className="w-4 h-4 text-[#94A3B8]" />}
                  required
                />
              </div>

              {/* Contact Info */}
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
                  label="WhatsApp / Phone Number"
                  type="tel"
                  placeholder="+234 (0) 800 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  leftIcon={<FiPhone className="w-4 h-4 text-[#94A3B8]" />}
                  required
                />
              </div>

              {/* Client Type & Preferred Showroom */}
              <div className="gap-3.5 grid grid-cols-1 sm:grid-cols-2">
                <Dropdown
                  label="Client Profile Category"
                  value={clientType}
                  onChange={(v) => setClientType(String(v))}
                  options={[
                    { label: "Private Collector / Luxury Buyer", value: "Private Collector" },
                    { label: "Corporate Fleet Buyer / Executive", value: "Corporate Fleet" },
                    { label: "Diplomatic Protocol & Embassies", value: "Diplomatic Protocol" },
                    { label: "Independent Auto Broker", value: "Auto Broker" },
                  ]}
                />

                <Dropdown
                  label="Preferred Delivery Hub"
                  value={showroomHub}
                  onChange={(v) => setShowroomHub(String(v))}
                  options={[
                    { label: "Victoria Island Flagship Showroom, Lagos", value: "VI" },
                    { label: "Maitama Diplomatic Zone Suite, Abuja", value: "Abuja" },
                    { label: "White-Glove Doorstep Delivery", value: "Home" },
                  ]}
                />
              </div>

              {/* Preferred Currency */}
              <div>
                <Dropdown
                  label="Preferred Currency Valuation"
                  value={preferredCurrency}
                  onChange={(v) => setPreferredCurrency(String(v))}
                  options={[
                    { label: "$ USD - United States Dollar (International Invoices & Escrow)", value: "USD" },
                    { label: "₦ NGN - Nigerian Naira (Local Port Clearing & Showroom Wires)", value: "NGN" },
                  ]}
                />
              </div>

              {/* Password Fields */}
              <div className="gap-3.5 grid grid-cols-1 sm:grid-cols-2">
                <div className="relative">
                  <Input
                    label="Create Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    leftIcon={<FiLock className="w-4 h-4 text-[#94A3B8]" />}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="top-8 right-3 absolute text-[#94A3B8] hover:text-[#0F172A]"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>

                <Input
                  label="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  leftIcon={<FiLock className="w-4 h-4 text-[#94A3B8]" />}
                  required
                />
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-[#64748B]">
                    <span>Password Strength: <strong className="text-[#0F172A]">{strength.text}</strong></span>
                    <span>Min 8 characters, capital & number</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: `${strength.percent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Agreements */}
              <div className="pt-1 space-y-2 text-[#64748B] text-xs">
                <Checkbox
                  checked={agreeTerms}
                  onChange={setAgreeTerms}
                  label="I agree to the LuxAuto VIP Terms of Service, Confidentiality Protocol, and Data Privacy Charter."
                />
                <Checkbox
                  checked={receiveAlerts}
                  onChange={setReceiveAlerts}
                  label="Send me encrypted WhatsApp and SMS notifications for port clearing milestones and new exotic car arrivals."
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                disabled={isSubmitting}
                rightIcon={<FiArrowRight className="w-4 h-4 text-[#FFFFFF]" />}
                className="py-2.5 font-bold"
              >
                {isSubmitting ? "Activating VIP Profile..." : "Complete VIP Customer Registration"}
              </Button>
            </form>
          </div>

          {/* Department Staff Login Callout */}
          <div className="space-y-1.5 text-xs text-center p-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl">
            <p className="text-[#64748B] font-medium">
              Are you a Dealership Staff Member, Director, or Accountant?
            </p>
            <p className="text-[#94A3B8] text-[11px]">
              Department staff portals are restricted and provisioned by the Super Admin.
            </p>
            <div className="pt-1">
              <Link
                href="/auth/dashboard-login"
                className="font-bold text-[#2563EB] hover:underline inline-flex items-center gap-1.5"
              >
                <FiShield className="w-3.5 h-3.5" />
                <span>Go to Dealership Department Dashboard Login &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Success Registration Welcome Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleEnterDashboard}
        size="md"
        title="Welcome to LuxAuto VIP Membership"
        description="Your customer profile has been securely created and verified."
      >
        <div className="space-y-4 py-2 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <FiCheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-lg text-[#0F172A]">
              VIP Black Tier Activated
            </h3>
            <p className="text-xs text-[#64748B]">
              Welcome, <strong className="text-[#0F172A]">{firstName} {lastName}</strong>. Your private customer garage and tracking dashboard are now accessible.
            </p>
          </div>

          <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] text-xs text-left space-y-1 font-mono">
            <div><span className="text-[#64748B]">Client ID:</span> <strong className="text-[#2563EB]">LUX-{Math.floor(10000 + Math.random() * 90000)}</strong></div>
            <div><span className="text-[#64748B]">Registered Email:</span> {email}</div>
            <div><span className="text-[#64748B]">Preferred Currency:</span> {preferredCurrency}</div>
            <div><span className="text-[#64748B]">Showroom Hub:</span> {showroomHub === "VI" ? "Victoria Island, Lagos" : "Maitama, Abuja"}</div>
          </div>

          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={handleEnterDashboard}
            rightIcon={<FiArrowRight className="w-4 h-4" />}
          >
            Enter Customer Dashboard Now
          </Button>
        </div>
      </Modal>
    </div>
  );
}
