"use client";

import React from "react";
import { FiLock, FiShield, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { RoleDefinition } from "@/data/roles";

export interface AccessRestrictedGuardProps {
  attemptedModule: string;
  activeRole: RoleDefinition;
  onReturnToAllowedModule: (module: string) => void;
  onSwitchRole?: (roleId: string) => void;
}

export const AccessRestrictedGuard: React.FC<AccessRestrictedGuardProps> = ({
  attemptedModule,
  activeRole,
  onReturnToAllowedModule,
  onSwitchRole,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] p-6 max-w-2xl mx-auto text-center animate-in fade-in zoom-in-95 duration-200">
      {/* Icon Shield with Lock */}
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] border-2 border-[#BFDBFE] flex items-center justify-center text-[#2563EB] shadow-lg shadow-[#2563EB]/15">
          <FiLock className="w-8 h-8" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0F172A] border-2 border-white flex items-center justify-center text-white">
          <FiShield className="w-3 h-3 text-[#38BDF8]" />
        </div>
      </div>

      {/* Role Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#F1F5F9] border border-[#CBD5E1] text-[#0F172A] text-xs font-mono font-bold mb-3">
        <span>Active Role:</span>
        <span className="text-[#2563EB]">{activeRole.name}</span>
      </div>

      {/* Heading */}
      <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight uppercase mb-2">
        Access Restricted &mdash; Clearance Level Insufficient
      </h2>

      {/* Explanation */}
      <p className="text-xs sm:text-sm text-[#64748B] max-w-lg mb-6 leading-relaxed">
        Your current credentials for <strong className="text-[#0F172A]">{activeRole.department}</strong> do not have clearance to access the <strong className="text-[#2563EB]">&ldquo;{attemptedModule}&rdquo;</strong> workspace. This department workspace is restricted to authorized personnel in accordance with dealership internal compliance controls.
      </p>

      {/* Allowed Modules Card */}
      <div className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 text-left shadow-xs mb-6">
        <div className="text-xs font-bold text-[#0F172A] mb-2 flex items-center justify-between">
          <span>Authorized Workspaces for {activeRole.badge}:</span>
          <span className="text-[10px] text-[#64748B] font-mono">{activeRole.allowedModules.length} Modules Granted</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {activeRole.allowedModules.map((mod) => (
            <button
              key={mod}
              onClick={() => onReturnToAllowedModule(mod)}
              className="flex items-center justify-between p-2 rounded-md bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#E2E8F0] hover:border-[#2563EB] text-xs font-semibold text-[#0F172A] hover:text-[#2563EB] transition-all cursor-pointer text-left"
            >
              <span className="flex items-center gap-1.5 truncate">
                <FiCheckCircle className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                <span className="truncate">{mod}</span>
              </span>
              <FiArrowRight className="w-3 h-3 text-[#64748B] shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => onReturnToAllowedModule(activeRole.defaultModule)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-md text-xs sm:text-sm font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-[#FFFFFF] shadow-md shadow-[#2563EB]/25 transition-all cursor-pointer"
        >
          <span>Return to Primary Desk ({activeRole.defaultModule})</span>
          <FiArrowRight className="w-4 h-4" />
        </button>

        {onSwitchRole && (
          <button
            onClick={() => onSwitchRole("admin")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-md text-xs sm:text-sm font-bold bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#0F172A] border border-[#CBD5E1] shadow-xs transition-all cursor-pointer"
          >
            <FiShield className="w-4 h-4 text-[#2563EB]" />
            <span>Elevate to Super Admin</span>
          </button>
        )}
      </div>
    </div>
  );
};

