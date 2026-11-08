"use client";

import React from "react";
import { FiDownload } from "react-icons/fi";
import { Button, Card } from "@/components/ui";

export interface TaxCompliancePageProps {
  showToast: (msg: string) => void;
}

export const TaxCompliancePage: React.FC<TaxCompliancePageProps> = ({ showToast }) => {
  return (
    <Card className="space-y-4 shadow-xs p-4 sm:p-5">
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-[#E2E8F0] border-b">
        <div>
          <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
            Federal Inland Revenue Service (FIRS) 7.5% VAT Compliance
          </h3>
          <p className="text-[#64748B] text-[11px]">Real-time output VAT collected on retail sales vs input VAT deducted on clearing</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => showToast("FIRS Tax Clearance Docket PDF dispatched to secure download queue.")}
          leftIcon={<FiDownload className="w-3.5 h-3.5 text-[#2563EB]" />}
        >
          Download Tax Clearance Docket
        </Button>
      </div>

      <div className="gap-3 grid grid-cols-1 sm:grid-cols-3 text-xs">
        <div className="space-y-1 bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
          <span className="block text-[#64748B] text-[10px] uppercase">Gross Output VAT (7.5%)</span>
          <div className="font-mono font-bold text-[#0F172A] text-base">$256,500</div>
          <span className="block text-[#64748B] text-[10px]">Collected on $3.42M MTD Sales</span>
        </div>
        <div className="space-y-1 bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
          <span className="block text-[#64748B] text-[10px] uppercase">Input VAT Offset Credits</span>
          <div className="font-mono font-bold text-emerald-700 text-base">-$62,400</div>
          <span className="block text-[#64748B] text-[10px]">Paid at Port SGD Assessment</span>
        </div>
        <div className="space-y-1 bg-[#EFF6FF] p-3 border border-[#BFDBFE] rounded-md">
          <span className="block font-bold text-[#1D4ED8] text-[10px] uppercase">Net VAT Remittance Due</span>
          <div className="font-mono font-bold text-[#1D4ED8] text-base">$194,100</div>
          <span className="block text-[#1D4ED8] text-[10px]">Due: 21st of November, 2026</span>
        </div>
      </div>
    </Card>
  );
};

