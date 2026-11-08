"use client";

import React from "react";
import {
  FiDollarSign,
  FiShield,
  FiClock,
  FiFileText,
} from "react-icons/fi";
import { KPICard } from "@/components/ui";
import { FinancingUnderwritingPage } from "./FinancingUnderwritingPage";

export interface FinancingDashboardProps {
  showToast: (msg: string) => void;
}

export const FinancingDashboard: React.FC<FinancingDashboardProps> = ({ showToast }) => {
  return (
    <div className="space-y-4">
      <div className="gap-3.5 grid grid-cols-1 sm:grid-cols-4">
        <KPICard title="Financed Portfolio" value="₦22.9B" change="Year-to-date" icon={<FiDollarSign className="w-4 h-4" />} />
        <KPICard title="Bank Partners" value="5 Prime Banks" change="Direct API Integration" icon={<FiShield className="w-4 h-4" />} />
        <KPICard title="Pending Pre-Approvals" value="6 Applications" change="Average 4-Hour Decision" icon={<FiClock className="w-4 h-4" />} />
        <KPICard title="Active Policies" value="142 Policies" change="Comprehensive Cover" icon={<FiFileText className="w-4 h-4" />} />
      </div>

      <FinancingUnderwritingPage showToast={showToast} />
    </div>
  );
};

