"use client";

import React from "react";
import {
  FiTool,
  FiCheckCircle,
  FiClock,
  FiUsers,
} from "react-icons/fi";
import { KPICard } from "@/components/ui";
import { ServiceWorkshopPage } from "./ServiceWorkshopPage";

export interface ServiceDashboardProps {
  showToast: (msg: string) => void;
}

export const ServiceDashboard: React.FC<ServiceDashboardProps> = ({ showToast }) => {
  return (
    <div className="space-y-4">
      <div className="gap-3.5 grid grid-cols-1 sm:grid-cols-4">
        <KPICard title="Bays In Operation" value="6 / 8 Bays" change="75% Capacity" icon={<FiTool className="w-4 h-4" />} />
        <KPICard title="PDI Completed" value="18 Vehicles" change="This Month" icon={<FiCheckCircle className="w-4 h-4" />} />
        <KPICard title="Mean Diagnosis" value="2.4 Hours" change="OBD-II Certified" icon={<FiClock className="w-4 h-4" />} />
        <KPICard title="Customer CSAT" value="98.5%" change="After-sales Rating" icon={<FiUsers className="w-4 h-4" />} />
      </div>

      <ServiceWorkshopPage showToast={showToast} />
    </div>
  );
};

