"use client";

import React from "react";
import {
  FiUsers,
  FiClock,
  FiFileText,
  FiCheckCircle,
} from "react-icons/fi";
import { KPICard } from "@/components/ui";

export interface CRMPipelinePageProps {
  showToast?: (msg: string) => void;
}

export const CRMPipelinePage: React.FC<CRMPipelinePageProps> = () => {
  return (
    <div className="space-y-4">
      <div className="gap-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Stage 1: Inbound Lead"
          value="14 Prospects"
          change="Website & WhatsApp Concierge"
          icon={<FiUsers className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Stage 2: VIP Test Drive"
          value="6 Scheduled"
          change="Showroom & Chauffeur Delivery"
          icon={<FiClock className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Stage 3: Quote Review"
          value="4 Active Quotes"
          change="Pending Executive Sign-off"
          icon={<FiFileText className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Stage 4: Won / Delivery"
          value="8 Closed ($1.8M)"
          change="Handover Inspection Ready"
          icon={<FiCheckCircle className="w-5 h-5 text-[#2563EB]" />}
        />
      </div>
    </div>
  );
};

