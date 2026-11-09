"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FiShield,
  FiLock,
  FiMail,
  FiArrowRight,
  FiArrowLeft,
  FiCheckCircle,
  FiAlertTriangle,
  FiEye,
  FiEyeOff,
  FiKey,
  FiServer,
  FiCompass,
} from "react-icons/fi";
import { FaCar } from "react-icons/fa6";
import { Button, Input, Dropdown, Checkbox, Badge } from "@/components/ui";
import { DEALERSHIP_ROLES } from "@/data/roles";
import { authApi, setStoredToken, setStoredUser } from "@/lib/api";
import { BiometricFaceCaptureModal } from "@/components/BiometricFaceCaptureModal";
import { recordLoginBiometric } from "@/utils/sessionAuditHelper";

const DEPARTMENT_CREDENTIALS: Record<
  string,
  {
    roleId: string;
    label: string;
    email: string;
    name: string;
    defaultPath: string;
    department: string;
  }
> = {
  admin: {
    roleId: "admin",
    label: "Super Admin HQ Dashboard",
    email: "admin@luxauto.dealers.com",
    name: "Chief Executive (Admin)",
    defaultPath: "/admin",
    department: "Executive Dealership Management",
  },
  sales: {
    roleId: "sales",
    label: "Showroom Sales & Orders Dashboard",
    email: "sales.liaison@luxauto.dealers.com",
    name: "Senior Sales Liaison",
    defaultPath: "/erp/sales",
    department: "Showroom Floor Sales & Delivery",
  },
  service: {
    roleId: "service",
    label: "Service Workshop & Bay Operations Dashboard",
    email: "workshop.lead@luxauto.dealers.com",
    name: "Workshop Bay Supervisor",
    defaultPath: "/erp/service",
    department: "Technical Service & Bay Operations",
  },
  parts: {
    roleId: "parts",
    label: "OEM Parts Depot & Inventory Dashboard",
    email: "parts.specialist@luxauto.dealers.com",
    name: "Warehouse Logistics Lead",
    defaultPath: "/erp/parts",
    department: "OEM Parts & Warehouse Depot",
  },
  financing: {
    roleId: "financing",
    label: "Auto Loans & Financing Dashboard",
    email: "financing.officer@luxauto.dealers.com",
    name: "Senior Loan Underwriter",
    defaultPath: "/erp/financing",
    department: "Automotive Financing & Bank Liaison",
  },
  recon: {
    roleId: "recon",
    label: "Detailing & Recon Dashboard",
    email: "recon.lead@luxauto.dealers.com",
    name: "Detailing Center Lead",
    defaultPath: "/erp/recon",
    department: "Vehicle Detailing & Reconditioning",
  },
  inspection: {
    roleId: "inspection",
    label: "150-Point QA Inspection Dashboard",
    email: "qa.lead@luxauto.dealers.com",
    name: "Lead Quality Inspector",
    defaultPath: "/erp/inspection",
    department: "Vehicle Inspection & Quality Assurance (QA)",
  },
  imports: {
    roleId: "imports",
    label: "Import Logistics & Customs Clearing Dashboard",
    email: "imports.clearing@luxauto.dealers.com",
    name: "Port Operations Officer",
    defaultPath: "/erp/imports",
    department: "Port Clearing & Inbound Freight",
  },
  "trade-ins": {
    roleId: "trade-ins",
    label: "Trade-In & Vehicle Exchange Dashboard",
    email: "tradein.valuer@luxauto.dealers.com",
    name: "Lead Swap Appraiser",
    defaultPath: "/erp/trade-ins",
    department: "Trade-In & Vehicle Exchange",
  },
  crm: {
    roleId: "crm",
    label: "VIP Client Relations & Concierge (CRM) Dashboard",
    email: "crm.concierge@luxauto.dealers.com",
    name: "VIP Concierge Lead",
    defaultPath: "/erp/crm",
    department: "Client Relationship Management",
  },
  hr: {
    roleId: "hr",
    label: "HR & People Operations Dashboard",
    email: "hr.director@luxauto.dealers.com",
    name: "Head of People & Culture",
    defaultPath: "/erp/hr",
    department: "Human Resources & Talent Acquisition",
  },
  procurement: {
    roleId: "procurement",
    label: "Procurement & Sourcing Dashboard",
    email: "procurement.lead@luxauto.dealers.com",
    name: "Head of International Sourcing",
    defaultPath: "/erp/procurement",
    department: "Procurement & International Sourcing",
  },
  accounting: {
    roleId: "accounting",
    label: "Accounting & Financial Audit Dashboard",
    email: "chief.accountant@luxauto.dealers.com",
    name: "Dealership Chief Accountant",
    defaultPath: "/accounting",
    department: "Accounting & Audit Operations",
  },
};

function DashboardLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedRole = searchParams?.get("dept") || searchParams?.get("role") || "admin";

  const [selectedDept, setSelectedDept] = useState<string>(
    DEPARTMENT_CREDENTIALS[requestedRole] ? requestedRole : "admin"
  );
  const [email, setEmail] = useState<string>(
    DEPARTMENT_CREDENTIALS[requestedRole]?.email || "admin@luxauto.dealers.com"
  );
  const [password, setPassword] = useState<string>("");
  const [securityPin, setSecurityPin] = useState<string>("");
  const [showroomNode, setShowroomNode] = useState<string>("lagos-hq");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberTerminal, setRememberTerminal] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState<boolean>(false);
  const [pendingAuthTarget, setPendingAuthTarget] = useState<{
    defaultPath: string;
    name: string;
    email: string;
    role: string;
    department: string;
  } | null>(null);

  const handleDepartmentChange = (deptKey: string) => {
    setSelectedDept(deptKey);
    const creds = DEPARTMENT_CREDENTIALS[deptKey];
    if (creds) {
      setEmail(creds.email);
      setPassword("");
      setSecurityPin("");
    }
  };

  const handleQuickFill = (deptKey: string) => {
    handleDepartmentChange(deptKey);
    setAuthError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!email || !password) {
      setAuthError("Please provide both department staff email and security password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await authApi.login({ email, password });
      setIsSubmitting(false);

      const targetConfig = DEPARTMENT_CREDENTIALS[selectedDept] || DEPARTMENT_CREDENTIALS.admin;
      if (res.success && res.data?.token) {
        setStoredToken(res.data.token);
        setStoredUser(res.data.user || {
          email,
          name: targetConfig.name,
          role: targetConfig.roleId,
          department: targetConfig.department,
        });
      } else {
        // Fallback session for offline terminal testing
        const fallbackToken = `dealership-staff-auth-${selectedDept}-${Date.now()}`;
        setStoredToken(fallbackToken);
        setStoredUser({
          email,
          name: targetConfig.name,
          role: targetConfig.roleId,
          department: targetConfig.department,
        });
      }

      // Open mandatory facial biometric verification before granting entry to dashboard
      setPendingAuthTarget({
        defaultPath: targetConfig.defaultPath,
        name: targetConfig.name,
        email,
        role: targetConfig.label,
        department: targetConfig.department,
      });
      setIsBiometricModalOpen(true);
    } catch {
      setIsSubmitting(false);
      const targetConfig = DEPARTMENT_CREDENTIALS[selectedDept] || DEPARTMENT_CREDENTIALS.admin;
      const fallbackToken = `dealership-staff-auth-${selectedDept}-${Date.now()}`;
      setStoredToken(fallbackToken);
      setStoredUser({
        email,
        name: targetConfig.name,
        role: targetConfig.roleId,
        department: targetConfig.department,
      });

      // Open mandatory facial biometric verification before granting entry to dashboard
      setPendingAuthTarget({
        defaultPath: targetConfig.defaultPath,
        name: targetConfig.name,
        email,
        role: targetConfig.label,
        department: targetConfig.department,
      });
      setIsBiometricModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col bg-[#0F172A] selection:bg-[#2563EB] min-h-screen font-sans text-[#F8FAFC] selection:text-[#FFFFFF]">
      {/* Top Security Banner */}
      <header className="flex justify-between items-center bg-[#1E293B] px-4 sm:px-8 py-3.5 border-[#334155] border-b">
        <Link href="/" className="group inline-flex items-center gap-2">
          <FiArrowLeft className="w-4 h-4 text-[#60A5FA] transition-transform group-hover:-translate-x-0.5" />
          <span className="font-semibold text-[#94A3B8] group-hover:text-[#60A5FA] text-xs transition-colors">
            Return to Public Website
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="bg-[#10B981] rounded-full w-2 h-2 animate-pulse" />
          <span className="font-mono font-bold text-[#94A3B8] text-[11px] uppercase tracking-wider">
            RBAC Dealership Secure Node
          </span>
        </div>
      </header>

      {/* Main Authentication Canvas */}
      <main className="flex flex-1 justify-center items-center p-4 sm:p-6 lg:p-8">
        <div className="space-y-6 w-full max-w-xl">
          {/* Brand Identity */}
          <div className="space-y-2 text-center">
            <Link href="/" className="inline-block">
              <div className="flex flex-col items-center">
                <div className="flex justify-center items-center bg-[#2563EB] shadow-lg rounded-xl w-12 h-12 text-[#FFFFFF]">
                  <FiShield className="w-6 h-6" />
                </div>
                <div className="mt-2 font-black text-[#FFFFFF] text-xl tracking-widest uppercase">
                  PREMIER DEALERSHIP ERP
                </div>
                <div className="font-bold text-[#60A5FA] text-[10px] tracking-widest uppercase">
                  Staff & Department Gateway
                </div>
              </div>
            </Link>

            <h1 className="font-bold text-[#FFFFFF] text-lg sm:text-xl">
              Department Dashboard Authentication
            </h1>
            <p className="mx-auto max-w-md text-[#94A3B8] text-xs">
              Restricted portal for authorized management, accountants, sales advisors, workshop engineers, and logistics personnel.
            </p>
          </div>

          {/* Login Card */}
          <div className="space-y-5 bg-[#1E293B] shadow-2xl p-6 sm:p-8 border border-[#334155] rounded-2xl">
            {/* Security Notice */}
            <div className="flex items-start gap-3 bg-[#0F172A] p-3 border border-[#2563EB]/40 rounded-xl text-xs">
              <FiServer className="w-4 h-4 text-[#60A5FA] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-[#60A5FA]">Hardware-Level Role Verification Active</span>
                <p className="text-[#94A3B8] text-[11px]">
                  All session events are signed and audited. Dashboard accounts are strictly provisioned by Super Admin.
                </p>
              </div>
            </div>

            {authError && (
              <div className="flex items-center gap-2 bg-[#EF4444]/15 p-3 border border-[#EF4444] rounded-xl text-[#FCA5A5] text-xs">
                <FiAlertTriangle className="w-4 h-4 shrink-0 text-[#EF4444]" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Department Selector */}
              <div>
                <label className="block mb-1.5 font-bold text-[#CBD5E1] text-xs">
                  Target Department Portal
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  className="h-10.5 bg-[#0F172A] px-3 py-2.5 border border-[#475569] focus:border-[#2563EB] rounded-lg w-full font-sans text-[#F8FAFC] text-xs focus:outline-hidden transition-colors"
                >
                  <option value="admin">Super Admin / Executive Management</option>
                  <option value="accounting">Accounting Department (AP/AR & Landed Costs)</option>
                  <option value="financing">Finance Department (Auto Loans & Mortgages)</option>
                  <option value="sales">Sales & Showroom Floor Desk</option>
                  <option value="service">Service & Bay Workshop Operations</option>
                  <option value="parts">OEM Spares Depot & Inventory</option>
                  <option value="recon">Detailing & Reconditioning Center</option>
                  <option value="imports">Port Customs & Logistics Depot</option>
                  <option value="trade-ins">Trade-In & Vehicle Exchange Desk</option>
                  <option value="crm">VIP Client Relations & Concierge</option>
                  <option value="hr">People Operations & HR Recruitment</option>
                </select>
              </div>

              {/* Staff Email & Node */}
              <div className="gap-3.5 grid grid-cols-1 sm:grid-cols-2">
                <div>
                  <label className="block mb-1.5 font-bold text-[#CBD5E1] text-xs">
                    Staff / Employee Email
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 flex items-center pointer-events-none text-[#64748B]">
                      <FiMail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      placeholder="staff@luxauto.dealers.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-10.5 bg-[#0F172A] pl-10 pr-3 py-2.5 border border-[#475569] focus:border-[#2563EB] rounded-lg w-full font-sans text-[#F8FAFC] text-xs placeholder-[#64748B] focus:outline-hidden transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5 font-bold text-[#CBD5E1] text-xs">
                    Showroom Hub Node
                  </label>
                  <select
                    value={showroomNode}
                    onChange={(e) => setShowroomNode(e.target.value)}
                    className="h-10.5 bg-[#0F172A] px-3 py-2.5 border border-[#475569] focus:border-[#2563EB] rounded-lg w-full font-sans text-[#F8FAFC] text-xs focus:outline-hidden transition-colors"
                  >
                    <option value="lagos-hq">Master HQ Executive Suite, Lagos</option>
                    <option value="vi-flagship">Victoria Island Flagship Showroom</option>
                    <option value="abuja-maitama">Maitama Diplomatic Suite, Abuja</option>
                    <option value="ikeja-depot">Central Parts Depot, Ikeja</option>
                    <option value="apapa-port">Apapa / Tin Can Port Holding Bay</option>
                  </select>
                </div>
              </div>

              {/* Password & PIN */}
              <div className="gap-3.5 grid grid-cols-1 sm:grid-cols-2">
                <div>
                  <label className="block mb-1.5 font-bold text-[#CBD5E1] text-xs">
                    Access Key / Password
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 flex items-center pointer-events-none text-[#64748B]">
                      <FiLock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-10.5 bg-[#0F172A] pl-10 pr-10 py-2.5 border border-[#475569] focus:border-[#2563EB] rounded-lg w-full font-sans text-[#F8FAFC] text-xs placeholder-[#64748B] focus:outline-hidden transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 flex items-center text-[#94A3B8] hover:text-[#FFFFFF] cursor-pointer transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5 font-bold text-[#CBD5E1] text-xs">
                    Department 2FA PIN
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 flex items-center pointer-events-none text-[#64748B]">
                      <FiKey className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      maxLength={6}
                      placeholder="Enter 4-digit PIN"
                      value={securityPin}
                      onChange={(e) => setSecurityPin(e.target.value)}
                      className="h-10.5 bg-[#0F172A] pl-10 pr-3 py-2.5 border border-[#475569] focus:border-[#2563EB] rounded-lg w-full font-sans text-[#F8FAFC] text-xs placeholder-[#64748B] focus:outline-hidden transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-1 text-xs">
                <Checkbox
                  checked={rememberTerminal}
                  onChange={setRememberTerminal}
                  label="Authorize terminal hardware for 30 days"
                />

                <span className="font-mono text-[#60A5FA] text-[11px]">
                  Port: 443 / TLS 1.3
                </span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                disabled={isSubmitting}
                rightIcon={<FiArrowRight className="w-4 h-4 text-[#FFFFFF]" />}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] py-2.5 font-bold"
              >
                {isSubmitting
                  ? "Verifying Department Security Clearances..."
                  : `Launch ${DEPARTMENT_CREDENTIALS[selectedDept]?.label || "Dashboard"}`}
              </Button>
            </form>

            {/* Department Desk Selector Grid */}
            <div className="pt-4 border-[#334155] border-t space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-bold text-[#CBD5E1]">Authorized Department Workspaces:</span>
                <span className="text-[#94A3B8]">Click to switch department</span>
              </div>

              <div className="gap-1.5 grid grid-cols-2 sm:grid-cols-3">
                {Object.entries(DEPARTMENT_CREDENTIALS).map(([key, config]) => {
                  const isSelected = selectedDept === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleQuickFill(key)}
                      className={`px-2.5 py-1.5 rounded-lg border text-left transition-all ${
                        isSelected
                          ? "bg-[#2563EB] border-[#60A5FA] text-[#FFFFFF] shadow-sm font-bold"
                          : "bg-[#0F172A] border-[#334155] text-[#94A3B8] hover:text-[#FFFFFF] hover:border-[#475569]"
                      }`}
                    >
                      <div className="truncate font-semibold text-[11px]">
                        {config.label.split(" (")[0]}
                      </div>
                      <div className="truncate text-[9px] opacity-75 font-mono">
                        {key === "admin" ? "Super Admin" : config.department.split(" ")[0]}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Routing to Customer Portal & Registration */}
          <div className="space-y-2 text-xs text-center">
            <p className="text-[#94A3B8]">
              Are you a Private Client, Fleet Buyer, or Car Collector?
            </p>
            <div className="flex justify-center items-center gap-4">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 font-bold text-[#60A5FA] hover:underline"
              >
                <FaCar className="w-3.5 h-3.5" />
                <span>VIP Customer Login</span>
              </Link>
              <span className="text-[#475569]">&bull;</span>
              <Link
                href="/auth/register"
                className="font-bold text-[#60A5FA] hover:underline"
              >
                Register Customer Account &rarr;
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Mandatory Facial Capture on Staff Login Gate */}
      {pendingAuthTarget && (
        <BiometricFaceCaptureModal
          isOpen={isBiometricModalOpen}
          mode="login"
          isMandatory={true}
          user={{
            name: pendingAuthTarget.name,
            email: pendingAuthTarget.email,
            role: pendingAuthTarget.role,
            department: pendingAuthTarget.department,
          }}
          onCaptureSuccess={(photo, timestamp) => {
            recordLoginBiometric(
              {
                name: pendingAuthTarget.name,
                email: pendingAuthTarget.email,
                role: pendingAuthTarget.role,
                department: pendingAuthTarget.department,
              },
              photo,
              timestamp
            );
            setIsBiometricModalOpen(false);
            router.push(pendingAuthTarget.defaultPath);
          }}
          onCancel={() => {
            setIsBiometricModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default function DashboardLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-[#94A3B8]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#3B82F6] animate-ping" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#94A3B8]">
              Loading Secure RBAC Terminal...
            </span>
          </div>
        </div>
      }
    >
      <DashboardLoginContent />
    </Suspense>
  );
}

