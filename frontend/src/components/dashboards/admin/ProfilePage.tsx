"use client";

import React from "react";
import {
  FiMail,
  FiClock,
  FiUser,
  FiLock,
} from "react-icons/fi";
import { Badge, Card, Button } from "@/components/ui";
import { RoleDefinition } from "@/data/roles";

export interface ProfilePageProps {
  activeRole: RoleDefinition;
  onNavigateSessionHistory: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  activeRole,
  onNavigateSessionHistory,
}) => {
  return (
    <div className="space-y-4">
      {/* Header Profile Summary Card */}
      <Card className="shadow-xs p-5">
        <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex justify-center items-center bg-[#EFF6FF] shadow-xs border-[#BFDBFE] border-2 rounded-full w-16 h-16 font-bold text-[#2563EB] text-xl">
              {activeRole.userInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#0F172A] text-base sm:text-lg">{activeRole.userName}</h3>
                <span className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded-full font-bold text-[10px] text-emerald-600">
                  <span className="bg-emerald-500 rounded-full w-1.5 h-1.5 animate-pulse" />
                  Online & Verified
                </span>
              </div>
              <p className="flex items-center gap-1.5 mt-0.5 text-[#64748B] text-xs">
                <FiMail className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>{activeRole.email}</span>
                <span>&bull;</span>
                <span className="font-mono font-bold text-[#2563EB]">{activeRole.badge}</span>
              </p>
              <p className="mt-1 text-[#94A3B8] text-[11px]">
                Assigned Department: <strong className="text-[#475569]">{activeRole.department}</strong> &bull; {activeRole.branchName}
              </p>
            </div>
          </div>

          <div className="flex items-center self-end sm:self-auto gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onNavigateSessionHistory}
              leftIcon={<FiClock className="w-3.5 h-3.5" />}
            >
              View WORM Session Audit Trail
            </Button>
          </div>
        </div>
      </Card>

      {/* Grid of Profile Dossier Sections */}
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
        <Card className="space-y-3 shadow-xs p-5">
          <div className="flex items-center gap-2 pb-2 border-[#E2E8F0] border-b">
            <FiUser className="w-4 h-4 text-[#2563EB]" />
            <h4 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">Enterprise Identity Dossier</h4>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-[#F1F5F9] border-b">
              <span className="text-[#64748B]">Operational Clearance</span>
              <span className="font-mono font-bold text-[#0F172A]">{activeRole.badge}</span>
            </div>
            <div className="flex justify-between py-1 border-[#F1F5F9] border-b">
              <span className="text-[#64748B]">Department Node</span>
              <span className="font-semibold text-[#0F172A]">{activeRole.department}</span>
            </div>
            <div className="flex justify-between py-1 border-[#F1F5F9] border-b">
              <span className="text-[#64748B]">Showroom / Facility Base</span>
              <span className="text-[#0F172A]">{activeRole.branchName}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#64748B]">Default Workspace Desk</span>
              <span className="font-mono text-[#2563EB]">{activeRole.defaultModule}</span>
            </div>
          </div>
        </Card>

        <Card className="space-y-3 shadow-xs p-5">
          <div className="flex items-center gap-2 pb-2 border-[#E2E8F0] border-b">
            <FiLock className="w-4 h-4 text-[#2563EB]" />
            <h4 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">Security & Cryptographic MFA</h4>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-[#F1F5F9] border-b">
              <span className="text-[#64748B]">MFA Protocol</span>
              <Badge variant="gold" size="sm">FIDO2 WebAuthn Key Active</Badge>
            </div>
            <div className="flex justify-between py-1 border-[#F1F5F9] border-b">
              <span className="text-[#64748B]">TLS Encryption</span>
              <span className="font-mono font-bold text-[#0F172A]">TLS 1.3 / AES-256-GCM</span>
            </div>
            <div className="flex justify-between py-1 border-[#F1F5F9] border-b">
              <span className="text-[#64748B]">Audit Ledger Protocol</span>
              <span className="font-mono font-bold text-emerald-600">WORM SHA-256 Immutable</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#64748B]">Session Lockout Window</span>
              <span className="font-mono text-[#0F172A]">15 Minutes Inactivity</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

