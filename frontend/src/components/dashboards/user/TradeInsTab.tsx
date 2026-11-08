"use client";

import React from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { Button, Badge } from "@/components/ui";

export const TradeInsTab: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-4 bg-[#FFFFFF] shadow-sm p-4 sm:p-5 border border-[#E2E8F0] rounded-2xl">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3">
          <div>
            <h3 className="font-bold text-[#0F172A] text-base uppercase tracking-tight">
              Active Trade-In / Swap Valuations
            </h3>
            <p className="text-[#64748B] text-xs">Digital 150-point valuation appraisal and equity settlement.</p>
          </div>
          <Link href="/services/sell-or-swap">
            <Button variant="primary" size="sm">
              + Start New Vehicle Swap
            </Button>
          </Link>
        </div>

        {/* Trade-In Card Details */}
        <div className="space-y-3 bg-[#F8FAFC] p-4 border border-[#CBD5E1] rounded-xl">
          <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <span className="font-bold font-mono text-[#2563EB] text-xs">SWP-4401</span>
              <h4 className="font-bold text-[#0F172A] text-sm">Trade-In & Upgrade Agreement</h4>
            </div>
            <Badge variant="gold" size="sm">Appraisal Approved</Badge>
          </div>

          <div className="gap-3 grid grid-cols-1 sm:grid-cols-3 text-xs">
            <div className="space-y-1 bg-[#FFFFFF] p-3 border border-[#E2E8F0] rounded-xl">
              <span className="block font-bold text-[#64748B] text-[10px] uppercase">Trade-In Vehicle</span>
              <div className="font-bold text-[#0F172A]">2020 Mercedes-Benz E350 AMG</div>
              <span className="text-[#64748B] text-[11px]">Mileage: 42,000 KM &bull; Non-Accident</span>
            </div>

            <div className="space-y-1 bg-[#FFFFFF] p-3 border border-[#E2E8F0] rounded-xl">
              <span className="block font-bold text-[#64748B] text-[10px] uppercase">Target Showroom Model</span>
              <div className="font-bold text-[#0F172A]">2024 Mercedes-Maybach S580</div>
              <span className="font-bold font-mono text-[#1D4ED8] text-[11px]">Price: $165,000 USD</span>
            </div>

            <div className="space-y-1 bg-[#EFF6FF] p-3 border border-[#BFDBFE] rounded-xl">
              <span className="block font-bold text-[#2563EB] text-[10px] uppercase">Certified Swap Equity</span>
              <div className="font-bold font-mono text-[#1D4ED8] text-sm">$32,500 Approved</div>
              <span className="block font-bold text-[#1D4ED8] text-[11px]">
                Balance Due: $132,500 (₦198,750,000)
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 text-xs">
            <span className="text-[#64748B]">
              Status: <strong className="text-[#0F172A]">Two-Factor Director Approval Signed. Physical Handover Scheduled Nov 18.</strong>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => alert("Downloading signed swap quotation...")}
              rightIcon={<FiArrowRight className="w-3 h-3" />}
              className="px-0 text-[#2563EB]"
            >
              Download Agreement PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

