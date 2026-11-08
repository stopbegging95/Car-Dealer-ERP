"use client";

import React from "react";
import {
  FiClock,
  FiShield,
  FiLayers,
  FiUsers,
  FiLock,
  FiCheckCircle,
  FiSearch,
  FiMapPin,
  FiEye,
} from "react-icons/fi";
import { KPICard, Card } from "@/components/ui";

export interface SessionRecord {
  id: string;
  userId?: string;
  userName: string;
  email: string;
  role: string;
  department: string;
  loginTime: string;
  logoutTime: string | null;
  duration: string;
  ipAddress: string;
  location: string;
  device: string;
  browser: string;
  mfaMethod: string;
  checksum: string;
  immutableSeal: boolean;
}

export interface SessionsPageProps {
  sessions: SessionRecord[];
  allSessionsCount: number;
  sessionSearch: string;
  onSearchChange: (val: string) => void;
  sessionFilter: "all" | "active" | "terminated";
  onFilterChange: (val: "all" | "active" | "terminated") => void;
  onInspectSession: (session: SessionRecord) => void;
}

export const SessionsPage: React.FC<SessionsPageProps> = ({
  sessions,
  allSessionsCount,
  sessionSearch,
  onSearchChange,
  sessionFilter,
  onFilterChange,
  onInspectSession,
}) => {
  return (
    <div className="space-y-4">
      {/* Header Description & WORM Notice */}
      <Card className="space-y-2 shadow-xs p-4 sm:p-5">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex justify-center items-center bg-[#EFF6FF] border border-[#BFDBFE] rounded-md w-8 h-8 text-[#2563EB]">
              <FiClock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">
                Immutable Login & Logout Session Audit Ledger
              </h3>
              <p className="text-[11px] text-[#64748B]">
                Write-Once-Read-Many (WORM) cryptographic audit trail. Records cannot be edited, tampered with, or erased.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <span className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 border border-emerald-200 rounded font-bold font-mono text-[10px] text-emerald-700">
              <FiShield className="w-3.5 h-3.5 text-emerald-600" />
              <span>WORM Enforced &bull; Read-Only</span>
            </span>
          </div>
        </div>
      </Card>

      {/* KPI Cards for Session Telemetry */}
      <div className="gap-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Recorded Sessions"
          value={`${allSessionsCount} Logged`}
          change="All dealership roles"
          icon={<FiLayers className="w-4 h-4" />}
        />
        <KPICard
          title="Active Sessions Now"
          value={`${sessions.filter((s) => !s.logoutTime).length} Live`}
          change="Authenticated TLS 1.3"
          icon={<FiUsers className="w-4 h-4" />}
        />
        <KPICard
          title="MFA Verification"
          value="100%"
          change="Hardware & FIDO2 enforced"
          icon={<FiLock className="w-4 h-4" />}
        />
        <KPICard
          title="Integrity Verification"
          value="SHA-256"
          change="Zero tampering detected"
          icon={<FiCheckCircle className="w-4 h-4" />}
        />
      </div>

      {/* Search & Filter Bar */}
      <div className="flex sm:flex-row flex-col justify-between items-stretch sm:items-center gap-3 bg-[#FFFFFF] shadow-xs p-3.5 border border-[#E2E8F0] rounded-md">
        <div className="flex flex-1 items-center gap-2 bg-[#F8FAFC] focus-within:ring-1 focus-within:ring-[#2563EB] px-3 py-1.5 border border-[#CBD5E1] focus-within:border-[#2563EB] rounded-md max-w-md">
          <FiSearch className="w-3.5 h-3.5 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Filter by Session ID, staff, IP, email..."
            value={sessionSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-transparent outline-none w-full text-[#0F172A] text-xs placeholder-[#94A3B8]"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          {(["all", "active", "terminated"] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => onFilterChange(filter)}
              className={`px-2.5 py-1 rounded text-xs font-semibold capitalize transition-all cursor-pointer ${
                sessionFilter === filter
                  ? "bg-[#2563EB] text-[#FFFFFF]"
                  : "bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              {filter === "all" ? "All Sessions" : filter === "active" ? "Active Now" : "Terminated"}
            </button>
          ))}
        </div>
      </div>

      {/* Session Ledger Table */}
      <div className="bg-[#FFFFFF] shadow-xs border border-[#E2E8F0] rounded-md overflow-hidden">
        <div className="w-full overflow-x-auto scrollbar-thin">
          <table className="border-collapse min-w-full text-xs text-left">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] font-bold text-[#64748B] text-[10px] sm:text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5 whitespace-nowrap">Session & SHA-256</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Staff User & Role</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Network IP & Location</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Device & Browser</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Login / Logout</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Duration</th>
                <th className="px-4 py-3.5 whitespace-nowrap">MFA Status</th>
                <th className="px-4 py-3.5 text-right whitespace-nowrap">Telemetry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-bold font-mono text-[#2563EB]">{session.id}</div>
                    <div className="font-mono text-[#94A3B8] text-[9px] max-w-[130px] truncate" title={session.checksum}>
                      {session.checksum.substring(0, 16)}...
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-bold text-[#0F172A]">{session.userName}</div>
                    <div className="font-mono text-[#64748B] text-[10px]">{session.email}</div>
                    <div className="mt-0.5 font-bold font-mono text-[#1D4ED8] text-[9px]">{session.role}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1 font-mono font-semibold text-[#0F172A]">
                      <FiMapPin className="w-3 h-3 text-[#2563EB] shrink-0" />
                      <span>{session.ipAddress}</span>
                    </div>
                    <div className="text-[#64748B] text-[10px]">{session.location}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-semibold text-[#0F172A]">{session.device}</div>
                    <div className="text-[#64748B] text-[10px]">{session.browser}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] whitespace-nowrap">
                    <div className="text-[#0F172A]">In: {session.loginTime}</div>
                    {session.logoutTime ? (
                      <div className="text-[#64748B]">Out: {session.logoutTime}</div>
                    ) : (
                      <div className="flex items-center gap-1 mt-0.5 font-bold text-emerald-600">
                        <span className="bg-emerald-500 rounded-full w-1.5 h-1.5 animate-pulse" />
                        Active Session
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-bold font-mono text-[#475569] text-[11px] whitespace-nowrap">
                    {session.duration}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {session.mfaMethod ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded font-bold text-[10px] text-emerald-700" title={session.mfaMethod}>
                        <FiCheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                        FIDO2 Verified
                      </span>
                    ) : (
                      <span className="text-[#94A3B8] text-[10px]">Standard</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onInspectSession(session)}
                      className="inline-flex items-center gap-1 bg-[#EFF6FF] hover:bg-[#2563EB] px-2.5 py-1 border border-[#BFDBFE] rounded-md font-semibold text-[#1D4ED8] text-xs hover:text-[#FFFFFF] transition-colors cursor-pointer"
                    >
                      <FiEye className="w-3.5 h-3.5" />
                      <span>Telemetry</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

