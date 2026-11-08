"use client";

import React from "react";
import {
  FiRepeat,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
import { KPICard } from "@/components/ui";
import { TradeInsAppraisalsPage, TradeInItem } from "./TradeInsAppraisalsPage";

export type { TradeInItem };

export interface TradeInsDashboardProps {
  onInspectTradeIn: (item: TradeInItem) => void;
}

export const TradeInsDashboard: React.FC<TradeInsDashboardProps> = ({ onInspectTradeIn }) => {
  return (
    <div className="space-y-4">
      <div className="gap-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Active Appraisals"
          value="3 In Progress"
          change="Laser Paint & OBD Queue"
          icon={<FiRepeat className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Total Appraised Equity"
          value="$121,500"
          change="Trade-In Credit Offered"
          icon={<FiDollarSign className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Customer Settlement Gap"
          value="$348,500"
          change="Balance Due via Wire"
          icon={<FiClock className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Appraisal Approval Rate"
          value="100% Passed"
          change="Zero Hidden Structural Defects"
          icon={<FiCheckCircle className="w-5 h-5 text-[#2563EB]" />}
        />
      </div>

      <TradeInsAppraisalsPage onInspectTradeIn={onInspectTradeIn} />
    </div>
  );
};

