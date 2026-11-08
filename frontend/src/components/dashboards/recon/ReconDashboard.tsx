"use client";

import React from "react";
import {
  FiCheckSquare,
  FiShield,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import { KPICard } from "@/components/ui";
import { ReconPipelinePage } from "./ReconPipelinePage";

export interface ReconDashboardProps {
  showToast?: (msg: string) => void;
}

export const ReconDashboard: React.FC<ReconDashboardProps> = ({ showToast }) => {
  return (
    <div className="space-y-4">
      <div className="gap-3.5 grid grid-cols-1 sm:grid-cols-4">
        <KPICard title="Cars In Detailing" value="4 Vehicles" change="In Progress" icon={<FiCheckSquare className="w-4 h-4" />} />
        <KPICard title="Ceramic Applied" value="28 This Month" change="9H Diamond Coating" icon={<FiShield className="w-4 h-4" />} />
        <KPICard title="Inspection Pass Rate" value="100%" change="Zero Imperfection" icon={<FiCheckCircle className="w-4 h-4" />} />
        <KPICard title="Average Cycle" value="18 Hours" change="Complete Paint Prep" icon={<FiClock className="w-4 h-4" />} />
      </div>

      <ReconPipelinePage showToast={showToast} />
    </div>
  );
};

