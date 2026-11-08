"use client";

import React from "react";
import {
  FiAnchor,
  FiTruck,
  FiClock,
  FiShield,
} from "react-icons/fi";
import { KPICard } from "@/components/ui";
import { ImportsLogisticsPage } from "./ImportsLogisticsPage";

export interface ImportsDashboardProps {
  showToast: (msg: string) => void;
}

export const ImportsDashboard: React.FC<ImportsDashboardProps> = ({ showToast }) => {
  return (
    <div className="space-y-4">
      <div className="gap-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Vessels in Atlantic Transit"
          value="3 Consignments"
          change="ETA 6-12 Days"
          icon={<FiAnchor className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Port Customs Discharges"
          value="2 Units at Tin Can"
          change="Physical Examination Cleared"
          icon={<FiTruck className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Average Clearance Cycle"
          value="4.8 Days"
          change="NCS Fast-Track Green Lane"
          icon={<FiClock className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Demurrage Free Time"
          value="100% Free Time"
          change="Zero Terminal Storage Fines"
          icon={<FiShield className="w-5 h-5 text-[#2563EB]" />}
        />
      </div>

      <ImportsLogisticsPage showToast={showToast} />
    </div>
  );
};

