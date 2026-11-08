"use client";

import React from "react";
import { FiPlus } from "react-icons/fi";
import { Button, Badge } from "@/components/ui";
import { ActiveRequestItem } from "./OverviewTab";

export interface SourcingBriefsTabProps {
  activeRequests: ActiveRequestItem[];
  onOpenNewBriefModal: () => void;
}

export const SourcingBriefsTab: React.FC<SourcingBriefsTabProps> = ({
  activeRequests,
  onOpenNewBriefModal,
}) => {
  return (
    <div className="space-y-4 bg-[#FFFFFF] shadow-sm p-4 sm:p-5 border border-[#E2E8F0] rounded-2xl">
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3">
        <div>
          <h3 className="font-bold text-[#0F172A] text-base uppercase tracking-tight">
            International Auto Broker Briefs
          </h3>
          <p className="text-[#64748B] text-xs">Active vehicle sourcing scans across German, Belgian, and UAE dealer networks.</p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={onOpenNewBriefModal}
          leftIcon={<FiPlus className="w-3.5 h-3.5" />}
        >
          + New Sourcing Brief
        </Button>
      </div>

      <div className="space-y-3">
        {activeRequests.map((req) => (
          <div key={req.id} className="space-y-2 bg-[#F8FAFC] p-4 border border-[#CBD5E1] rounded-xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#2563EB] text-xs">{req.id}</span>
                <span className="text-[#CBD5E1]">&bull;</span>
                <h4 className="font-bold text-[#0F172A] text-sm">{req.vehicle}</h4>
              </div>
              <Badge variant="gold" size="sm">{req.status}</Badge>
            </div>

            <div className="gap-2 grid grid-cols-1 sm:grid-cols-3 pt-2 border-[#E2E8F0] border-t text-[#475569] text-xs">
              <div><strong>Target Market:</strong> {req.market}</div>
              <div><strong>Budget Ceiling:</strong> <span className="font-mono font-bold text-[#1D4ED8]">{req.budget}</span></div>
              <div><strong>Broker Desk:</strong> {req.broker}</div>
            </div>

            <p className="pt-1 text-[#0F172A] text-xs">
              Current Milestone: <strong className="text-[#2563EB]">{req.stage}</strong> (Paint depth & engine ECU diagnostic certified).
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

