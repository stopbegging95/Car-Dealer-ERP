"use client";

import React from "react";
import { FiShield } from "react-icons/fi";
import { Badge, Card } from "@/components/ui";

export interface SecuritySettingsTabProps {
  onReturnToOverview?: () => void;
}

export const SecuritySettingsTab: React.FC<SecuritySettingsTabProps> = () => {
  return (
    <Card className="space-y-6 shadow-sm p-6 sm:p-8">
      <div className="flex items-center gap-3.5 pb-4 border-b border-[#E2E8F0]">
        <div className="flex justify-center items-center bg-[#EFF6FF] border border-[#BFDBFE] rounded-full w-12 h-12 text-[#2563EB]">
          <FiShield className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-[#0F172A] text-base">VIP Diplomatic & KYC Verification</h3>
          <p className="text-[#64748B] text-xs">Profile status: Tier-3 Verified under LuxAuto Security Protocols.</p>
        </div>
      </div>

      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 text-xs">
        <div className="space-y-2 bg-[#F8FAFC] p-4 border border-[#E2E8F0] rounded-xl">
          <span className="block font-bold text-[#0F172A]">Identity Documents</span>
          <div className="flex justify-between items-center text-[#475569]">
            <span>Diplomatic Passport Verified:</span>
            <Badge variant="gold" size="sm">Active (2029)</Badge>
          </div>
          <div className="flex justify-between items-center text-[#475569]">
            <span>Proof of Address (Victoria Island):</span>
            <Badge variant="gold" size="sm">Verified</Badge>
          </div>
        </div>

        <div className="space-y-2 bg-[#F8FAFC] p-4 border border-[#E2E8F0] rounded-xl">
          <span className="block font-bold text-[#0F172A]">Security Protocols</span>
          <div className="flex justify-between items-center text-[#475569]">
            <span>Two-Factor Authentication:</span>
            <Badge variant="gold" size="sm">Enabled (SMS + App)</Badge>
          </div>
          <div className="flex justify-between items-center text-[#475569]">
            <span>Encrypted Vault Access:</span>
            <Badge variant="gold" size="sm">256-Bit SSL</Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};
