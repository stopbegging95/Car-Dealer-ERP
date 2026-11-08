"use client";

import React from "react";
import {
  FiBox,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
import { KPICard } from "@/components/ui";
import { PartsCatalogPage } from "./PartsCatalogPage";

export interface PartsDashboardProps {
  showToast: (msg: string) => void;
}

export const PartsDashboard: React.FC<PartsDashboardProps> = ({ showToast }) => {
  return (
    <div className="space-y-4">
      <div className="gap-3.5 grid grid-cols-1 sm:grid-cols-4">
        <KPICard title="Total Parts SKUs" value="1,840 SKUs" change="98% Catalog Coverage" icon={<FiBox className="w-4 h-4" />} />
        <KPICard title="Warehouse Valuation" value="$420,500" change="Cost Value" icon={<FiDollarSign className="w-4 h-4" />} />
        <KPICard title="Re-order Threshold" value="4 SKUs Low" change="Automated Supplier Trigger" icon={<FiClock className="w-4 h-4" />} />
        <KPICard title="Fastest Moving" value="Ceramic Kits & Pads" change="Top Turn-rate" icon={<FiCheckCircle className="w-4 h-4" />} />
      </div>

      <PartsCatalogPage showToast={showToast} />
    </div>
  );
};

