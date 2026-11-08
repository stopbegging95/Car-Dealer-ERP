"use client";

import React from "react";
import { Badge, Card } from "@/components/ui";

export interface HRRecruitmentPageProps {
  showToast: (msg: string) => void;
}

export const HRRecruitmentPage: React.FC<HRRecruitmentPageProps> = ({ showToast }) => {
  return (
    <div className="space-y-4">
      <Card className="space-y-4 shadow-xs p-4 sm:p-5">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2 border-[#E2E8F0] border-b">
          <div>
            <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
              Public Career Applications & Recruitment Pipeline
            </h3>
            <p className="text-[#64748B] text-[11px]">Direct applicants submitted through the public /careers job board</p>
          </div>
          <Badge variant="gold" size="sm">5 Candidates Under Review</Badge>
        </div>

        <div className="space-y-2 text-xs">
          {[
            { name: "Chibuike Okafor", role: "Senior VIP Luxury Sales Executive", appliedDate: "2026-11-04", exp: "8 Years Auto Sales", status: "Interview Scheduled", resume: "Chibuike_CV.pdf" },
            { name: "Fatima Al-Hassan", role: "Customs & Port Logistics Specialist", appliedDate: "2026-11-03", exp: "5 Years Tin Can Clearing", status: "Shortlisted", resume: "Fatima_Resume.pdf" },
            { name: "Tariq Danladi", role: "Senior Master Certified Technician", appliedDate: "2026-11-01", exp: "12 Years Porsche/Mercedes Diagnostic", status: "Technical Assessment", resume: "Tariq_Certificates.pdf" },
            { name: "Grace Adebayo", role: "Digital Automotive Marketing Lead", appliedDate: "2026-10-29", exp: "6 Years Automotive Content", status: "Application Received", resume: "Grace_Portfolio.pdf" },
          ].map((cand, ci) => (
            <div key={ci} className="flex sm:flex-row flex-col justify-between sm:items-center gap-2.5 bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
              <div>
                <div className="font-bold text-[#0F172A] text-sm">{cand.name}</div>
                <span className="font-semibold text-[#2563EB]">{cand.role}</span>
                <span className="block text-[#64748B] text-[11px]">Applied: {cand.appliedDate} &bull; Experience: {cand.exp}</span>
              </div>
              <div className="flex items-center self-end sm:self-auto gap-2.5">
                <button
                  type="button"
                  onClick={() => showToast(`Reviewing resume: ${cand.resume}`)}
                  className="bg-[#EFF6FF] hover:bg-[#2563EB] px-2.5 py-1 border border-[#BFDBFE] rounded-md font-semibold text-[#1D4ED8] hover:text-[#FFFFFF] text-xs transition-colors cursor-pointer"
                >
                  View CV
                </button>
                <Badge variant="gold" size="sm">{cand.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

