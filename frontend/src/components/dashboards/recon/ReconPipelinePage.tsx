"use client";

import React from "react";
import { Badge, Card } from "@/components/ui";

export interface ReconPipelinePageProps {
  showToast?: (msg: string) => void;
}

export const ReconPipelinePage: React.FC<ReconPipelinePageProps> = () => {
  return (
    <Card className="space-y-3 shadow-xs p-4 sm:p-5">
      <div className="flex justify-between items-center pb-2.5 border-[#E2E8F0] border-b">
        <div>
          <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">5-Stage Aesthetic Recon & Delivery Handover Pipeline</h3>
          <p className="text-[#64748B] text-[11px]">Paint correction, interior deep steam, ceramic seal & white-glove readiness</p>
        </div>
        <Badge variant="gold" size="sm">Detailing Bay Status</Badge>
      </div>

      <div className="gap-2 grid grid-cols-1 sm:grid-cols-5 pt-1 text-xs">
        <div className="bg-[#F8FAFC] p-2.5 border border-[#E2E8F0] rounded-md text-center">
          <span className="block font-bold text-[#0F172A]">Stage 1: Wash</span>
          <span className="text-[#64748B] text-[10px]">Chemical Decontamination</span>
        </div>
        <div className="bg-[#F8FAFC] p-2.5 border border-[#E2E8F0] rounded-md text-center">
          <span className="block font-bold text-[#0F172A]">Stage 2: Paint Cut</span>
          <span className="text-[#64748B] text-[10px]">3-Step Machine Polish</span>
        </div>
        <div className="bg-[#EFF6FF] p-2.5 border border-[#BFDBFE] rounded-md text-center">
          <span className="block font-bold text-[#1D4ED8]">Stage 3: Ceramic</span>
          <span className="text-[#2563EB] text-[10px]">9H Graphene Cure Booth</span>
        </div>
        <div className="bg-[#F8FAFC] p-2.5 border border-[#E2E8F0] rounded-md text-center">
          <span className="block font-bold text-[#0F172A]">Stage 4: Interior</span>
          <span className="text-[#64748B] text-[10px]">Ozone Sanitization</span>
        </div>
        <div className="bg-[#F8FAFC] p-2.5 border border-[#E2E8F0] rounded-md text-center">
          <span className="block font-bold text-[#0F172A]">Stage 5: VIP Seal</span>
          <span className="text-[#64748B] text-[10px]">White-Glove Handover Ready</span>
        </div>
      </div>

      <div className="space-y-2 pt-2 text-xs">
        {[
          { stock: "STK-2026-001", car: "Mercedes-Maybach S580", currentStage: "Stage 5: Final White-Glove Seal", tech: "Sola O. (Master Detailer)", finish: "9H Ceramic Cured (Pass)", status: "Ready for Delivery" },
          { stock: "STK-2026-002", car: "Porsche 911 Turbo S", currentStage: "Stage 3: 9H Ceramic Cure Booth", tech: "K. Alabi", finish: "Infrared Curing (1 hr left)", status: "In Curing Booth" },
          { stock: "STK-2026-007", car: "Mercedes-AMG G63 Magno", currentStage: "Stage 2: 3-Step Paint Cut", tech: "Sola O.", finish: "Magno Matte Treatment", status: "In Progress" },
        ].map((car, ci) => (
          <div key={ci} className="flex sm:flex-row flex-col justify-between sm:items-center gap-2.5 bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#2563EB]">{car.stock}</span>
                <span className="font-bold text-[#0F172A]">{car.car}</span>
              </div>
              <span className="block mt-0.5 text-[#64748B] text-[11px]">
                {car.currentStage} &bull; Specialist: <strong className="text-[#0F172A]">{car.tech}</strong>
              </span>
            </div>
            <div className="flex items-center self-end sm:self-auto gap-3">
              <span className="font-mono text-[#64748B] text-xs">{car.finish}</span>
              <Badge variant={car.status.includes("Ready") ? "gold" : "charcoal"} size="sm">
                {car.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

