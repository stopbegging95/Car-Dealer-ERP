"use client";

import React, { useState } from "react";
import {
  FiUsers,
  FiShoppingCart,
  FiDollarSign,
  FiUserPlus,
  FiTrendingUp,
  FiShield,
  FiArrowRight,
} from "react-icons/fi";
import { FaCar } from "react-icons/fa6";
import { Button, Badge, KPICard, Card } from "@/components/ui";

export interface AdminOverviewPageProps {
  onNavigateModule?: (module: string) => void;
  onOpenCreatePortalAccount?: () => void;
}

export const AdminOverviewPage: React.FC<AdminOverviewPageProps> = ({
  onNavigateModule,
  onOpenCreatePortalAccount,
}) => {
  const [growthTimeframe, setGrowthTimeframe] = useState("Monthly");

  return (
    <div className="space-y-4">
      {/* Executive KPI Cards */}
      <div className="gap-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Cars Listed"
          value="1,248"
          change="+12.4% vs last mo"
          icon={<FaCar className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Active Users"
          value="8,432"
          change="+8.1% vs last mo"
          icon={<FiUsers className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Total Transactions"
          value="412"
          change="+14.2% vs last mo"
          icon={<FiShoppingCart className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Total Revenue ($)"
          value="$48.2M"
          change="+21.0% vs last mo"
          icon={<FiDollarSign className="w-5 h-5 text-[#2563EB]" />}
        />
      </div>

      {/* Admin Quick Action Banner: Create Department Portals */}
      <Card className="space-y-3 bg-gradient-to-r from-[#0F172A] to-[#1E293B] shadow-md p-4 sm:p-5 border-0 text-white">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-[#2563EB] p-1.5 rounded text-white">
                <FiShield className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">
                Department Portals & Staff Accounts Management
              </h3>
            </div>
            <p className="text-[#94A3B8] text-[11px]">
              Provision isolated dashboards for Accounting, Sales, Workshop, Logistics, HR & VIP Client desks with strictly scoped RBAC permissions.
            </p>
          </div>
          <div className="flex items-center self-start sm:self-auto gap-2 shrink-0">
            {onOpenCreatePortalAccount && (
              <Button
                variant="primary"
                size="sm"
                onClick={onOpenCreatePortalAccount}
                leftIcon={<FiUserPlus className="w-3.5 h-3.5 text-white" />}
              >
                + Provision Staff Account
              </Button>
            )}
            {onNavigateModule && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigateModule("Department Portals & Accounts")}
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
                rightIcon={<FiArrowRight className="w-3.5 h-3.5" />}
              >
                Manage Portals
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="gap-4 grid grid-cols-1 lg:grid-cols-3">
        {/* Dealership Sales Trend */}
        <div className="space-y-4 lg:col-span-2 bg-[#FFFFFF] shadow-xs p-4 sm:p-5 border border-[#E2E8F0] rounded-md">
          <div className="flex justify-between items-center pb-3 border-[#E2E8F0] border-b">
            <div>
              <h3 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">Monthly Dealership Sales Trend</h3>
              <p className="text-[#64748B] text-[11px]">Audited revenue across Lagos & Abuja showrooms</p>
            </div>
            <Badge variant="gold" size="sm">FY 2026</Badge>
          </div>

          <div className="flex items-end gap-2 sm:gap-3 px-1 pt-4 h-44 sm:h-48">
            {[
              { month: "Jan", height: "45%", val: "$2.8M" },
              { month: "Feb", height: "55%", val: "$3.4M" },
              { month: "Mar", height: "50%", val: "$3.1M" },
              { month: "Apr", height: "65%", val: "$4.1M" },
              { month: "May", height: "60%", val: "$3.9M" },
              { month: "Jun", height: "75%", val: "$4.8M" },
              { month: "Jul", height: "70%", val: "$4.5M" },
              { month: "Aug", height: "80%", val: "$5.2M" },
              { month: "Sep", height: "68%", val: "$4.3M" },
              { month: "Oct", height: "85%", val: "$5.8M" },
              { month: "Nov", height: "92%", val: "$6.3M" },
              { month: "Dec", height: "78%", val: "$5.0M" },
            ].map((col) => (
              <div key={col.month} className="group relative flex flex-col flex-1 justify-end items-center h-full">
                <div className="-top-8 absolute bg-[#0F172A] opacity-0 group-hover:opacity-100 px-1.5 py-0.5 rounded font-mono font-bold text-[9px] text-white transition-opacity pointer-events-none">
                  {col.val}
                </div>
                <div
                  style={{ height: col.height }}
                  className="bg-[#2563EB] group-hover:bg-[#1D4ED8] rounded-t-sm w-full transition-all"
                />
                <span className="mt-2 text-[#64748B] text-[10px]">{col.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Client Growth & Inquiries */}
        <div className="space-y-4 bg-[#FFFFFF] shadow-xs p-4 sm:p-5 border border-[#E2E8F0] rounded-md">
          <div className="flex justify-between items-center pb-3 border-[#E2E8F0] border-b">
            <div>
              <h3 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">Client Growth</h3>
              <p className="text-[#64748B] text-[11px]">New VIP leads & private buyers</p>
            </div>
            <div className="flex gap-1">
              {(["Weekly", "Monthly"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setGrowthTimeframe(t)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                    growthTimeframe === t
                      ? "bg-[#2563EB] text-[#FFFFFF]"
                      : "bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex justify-between items-center bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
              <div>
                <span className="block text-[#64748B] text-[11px]">Verified HNIs</span>
                <span className="font-mono font-bold text-[#0F172A] text-base">142 Clients</span>
              </div>
              <span className="flex items-center gap-1 font-mono font-bold text-[#1D4ED8] text-xs">
                <FiTrendingUp className="w-3.5 h-3.5" /> +18.4%
              </span>
            </div>

            <div className="flex justify-between items-center bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
              <div>
                <span className="block text-[#64748B] text-[11px]">Corporate Accounts</span>
                <span className="font-mono font-bold text-[#0F172A] text-base">48 Entities</span>
              </div>
              <span className="flex items-center gap-1 font-mono font-bold text-[#1D4ED8] text-xs">
                <FiTrendingUp className="w-3.5 h-3.5" /> +12.0%
              </span>
            </div>

            <div className="flex justify-between items-center bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
              <div>
                <span className="block text-[#64748B] text-[11px]">Diplomatic Corps</span>
                <span className="font-mono font-bold text-[#0F172A] text-base">29 Embassies</span>
              </div>
              <span className="flex items-center gap-1 font-mono font-bold text-[#1D4ED8] text-xs">
                <FiTrendingUp className="w-3.5 h-3.5" /> +6.5%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

