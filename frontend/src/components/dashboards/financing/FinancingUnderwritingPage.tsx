"use client";

import React from "react";
import { FiPlus } from "react-icons/fi";
import { Button, Badge, Card } from "@/components/ui";

export interface FinancingUnderwritingPageProps {
  showToast: (msg: string) => void;
}

export const FinancingUnderwritingPage: React.FC<FinancingUnderwritingPageProps> = ({ showToast }) => {
  return (
    <Card className="space-y-3 shadow-xs p-4 sm:p-5">
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-[#E2E8F0] border-b">
        <div>
          <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">F&I Deals Pipeline, Auto Leasing & Insurance Underwriting</h3>
          <p className="text-[#64748B] text-[11px]">Bank facilities, chattel mortgages, and comprehensive motor insurance underwriting</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => showToast("Opening F&I auto loan application form.")}
          leftIcon={<FiPlus className="w-3.5 h-3.5 text-[#FFFFFF]" />}
        >
          New Financing Application
        </Button>
      </div>

      <div className="space-y-2 text-xs">
        {[
          { app: "FIN-2026-441", client: "Dr. K. Somoye", car: "2024 Porsche 911 Turbo S", bank: "Zenith Bank Asset Finance", loan: "$135,000", tenor: "36 Mo @ 12.5%", status: "Pre-Approved" },
          { app: "FIN-2026-440", client: "Chief Vance", car: "2024 Mercedes-Maybach S580", bank: "Stanbic IBTC Private Banking", loan: "$100,000", tenor: "24 Mo @ 11.8%", status: "Documentation Review" },
          { app: "FIN-2026-438", client: "Apex Dynamics Ltd", car: "2024 Mercedes-AMG G63", bank: "First Bank of Nigeria", loan: "$160,000", tenor: "48 Mo @ 13.0%", status: "Approved & Funded" },
          { app: "INS-2026-102", client: "Senator Godswill O.", car: "2023 Range Rover Autobiography", bank: "Leadway Comprehensive Luxury", loan: "$195,000 Value", tenor: "Annual 2.8% Premium", status: "Cover Note Issued" },
        ].map((fin, fi) => (
          <div key={fi} className="flex sm:flex-row flex-col justify-between sm:items-center gap-2.5 bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#2563EB]">{fin.app}</span>
                <span className="font-bold text-[#0F172A]">{fin.client}</span>
              </div>
              <span className="block mt-0.5 text-[#64748B] text-[11px]">
                {fin.car} &bull; <strong className="text-[#0F172A]">{fin.bank}</strong> ({fin.tenor})
              </span>
            </div>
            <div className="flex items-center self-end sm:self-auto gap-3">
              <span className="font-mono font-bold text-[#0F172A] text-sm">{fin.loan}</span>
              <Badge variant={fin.status.includes("Approved") || fin.status.includes("Issued") ? "gold" : "charcoal"} size="sm">
                {fin.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

