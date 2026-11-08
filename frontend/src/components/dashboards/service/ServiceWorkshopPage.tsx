"use client";

import React from "react";
import { FiPlus } from "react-icons/fi";
import { Button, Badge, Card } from "@/components/ui";

export interface ServiceWorkshopPageProps {
  showToast: (msg: string) => void;
}

export const ServiceWorkshopPage: React.FC<ServiceWorkshopPageProps> = ({ showToast }) => {
  return (
    <Card className="space-y-3 shadow-xs p-4 sm:p-5">
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-[#E2E8F0] border-b">
        <div>
          <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">Active Workshop Bay Job Cards & PDI Diagnostics</h3>
          <p className="text-[#64748B] text-[11px]">Pre-delivery inspections, factory recalls, and master mechanical sign-offs</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => showToast("New Workshop Job Card draft generated for Bay 5.")}
          leftIcon={<FiPlus className="w-3.5 h-3.5 text-[#FFFFFF]" />}
        >
          Create Workshop Job Card
        </Button>
      </div>

      <div className="space-y-2 text-xs">
        {[
          { bay: "Bay 1 (Master Dyno)", car: "2024 Mercedes-Maybach S580", tech: "Engr. Tunde B.", task: "150-Point Delivery Certification & Software Flash", status: "In Progress (92%)", eta: "2 Hours" },
          { bay: "Bay 2 (Heavy Lift)", car: "2023 Range Rover Autobiography", tech: "Chinedu M.", task: "Air Suspension Calibration & Brake Bleed", status: "Awaiting Parts", eta: "Tomorrow" },
          { bay: "Bay 3 (Diagnostics)", car: "2024 Porsche 911 Turbo S", tech: "A. Danladi", task: "OBD-II Deep ECU Map Verification", status: "Complete (Signed Off)", eta: "Ready" },
          { bay: "Bay 4 (Tuning)", car: "2024 Mercedes-AMG G63 Magno", tech: "Engr. Tunde B.", task: "Exhaust Valve Solenoid Replacement", status: "In Progress (45%)", eta: "4 Hours" },
        ].map((job, idx) => (
          <div key={idx} className="flex sm:flex-row flex-col justify-between sm:items-center gap-2.5 bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#2563EB]">{job.bay}</span>
                <span className="font-bold text-[#0F172A]">{job.car}</span>
              </div>
              <span className="block mt-0.5 text-[#64748B] text-[11px]">
                {job.task} &bull; Lead Tech: <strong className="text-[#0F172A]">{job.tech}</strong>
              </span>
            </div>
            <div className="flex items-center self-end sm:self-auto gap-2.5">
              <span className="font-mono text-[#64748B] text-xs">ETA: {job.eta}</span>
              <Badge variant={job.status.includes("Complete") ? "gold" : "charcoal"} size="sm">
                {job.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

