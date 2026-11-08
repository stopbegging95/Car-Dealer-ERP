"use client";

import React from "react";
import {
  FiCompass,
  FiRepeat,
  FiCalendar,
  FiTruck,
  FiHeart,
  FiFileText,
  FiPlus,
  FiArrowRight,
} from "react-icons/fi";
import { Button, Badge, KPICard } from "@/components/ui";
import { Vehicle } from "@/data/vehicles";

export interface ActiveRequestItem {
  id: string;
  type: string;
  vehicle: string;
  stage: string;
  status: string;
  date: string;
  market: string;
  budget: string;
  broker: string;
}

export interface OverviewTabProps {
  savedVehicles: Vehicle[];
  activeRequests: ActiveRequestItem[];
  documentsCount: number;
  onOpenNewBriefModal: () => void;
  onNavigateTab: (tab: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  savedVehicles,
  activeRequests,
  documentsCount,
  onOpenNewBriefModal,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="gap-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Active Acquisitions"
          value="2 Units"
          change="1 En Route to Lagos"
          icon={<FiCompass className="w-4 h-4" />}
        />
        <KPICard
          title="Trade-In Equity Approved"
          value="$45,000"
          change="Locked for 14 Days"
          icon={<FiRepeat className="w-4 h-4" />}
        />
        <KPICard
          title="Test Drives Scheduled"
          value="1 Booking"
          change="Nov 15, Victoria Island"
          icon={<FiCalendar className="w-4 h-4" />}
        />
        <KPICard
          title="Customs Duty Status"
          value="SGD Cleared"
          change="Tin Can Berth Discharged"
          icon={<FiTruck className="w-4 h-4" />}
        />
      </div>

      {/* Live Vehicle Order & Sourcing Timeline */}
      <div className="space-y-3 bg-[#FFFFFF] shadow-sm p-4 sm:p-5 border border-[#E2E8F0] rounded-2xl">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
              Active Acquisition & Sourcing Status
            </h3>
            <p className="text-[#64748B] text-[11px]">Real-time logistics, inspection, and delivery timeline</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenNewBriefModal}
            leftIcon={<FiPlus className="w-3.5 h-3.5" />}
          >
            New Sourcing Brief
          </Button>
        </div>

        <div className="space-y-2.5">
          {activeRequests.map((req) => (
            <div
              key={req.id}
              className="flex sm:flex-row flex-col justify-between sm:items-center gap-3 bg-[#F8FAFC] p-3.5 border border-[#E2E8F0] rounded-xl"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#2563EB] text-xs">{req.id}</span>
                  <span className="text-[#CBD5E1]">&bull;</span>
                  <span className="font-bold text-[#0F172A] text-xs">{req.vehicle}</span>
                </div>
                <span className="block mt-0.5 text-[#64748B] text-[11px]">
                  Stage: <strong className="text-[#0F172A]">{req.stage}</strong> &bull; Broker: {req.broker} &bull; Budget: {req.budget}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="gold" size="sm" dot>
                  {req.status}
                </Badge>
                <span className="font-mono text-[#64748B] text-[10px]">{req.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Cards Grid */}
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-3">
        <div className="space-y-2 bg-[#FFFFFF] shadow-sm p-4 border border-[#E2E8F0] rounded-2xl">
          <div className="flex justify-center items-center bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl w-9 h-9 text-[#2563EB]">
            <FiHeart className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-[#0F172A] text-sm">Saved Garage Vehicles</h4>
          <p className="text-[#64748B] text-xs">
            Review your {savedVehicles.length} bookmarked showroom models and run loan estimations.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigateTab("My Garage & Saved Cars")}
            rightIcon={<FiArrowRight className="w-3 h-3" />}
            className="px-0 pt-1 text-[#2563EB]"
          >
            View Saved Garage
          </Button>
        </div>

        <div className="space-y-2 bg-[#FFFFFF] shadow-sm p-4 border border-[#E2E8F0] rounded-2xl">
          <div className="flex justify-center items-center bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl w-9 h-9 text-[#2563EB]">
            <FiTruck className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-[#0F172A] text-sm">Port Customs Tracking</h4>
          <p className="text-[#64748B] text-xs">
            Live single goods declaration status and vessel progress for your imported models.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigateTab("Customs Import Tracker")}
            rightIcon={<FiArrowRight className="w-3 h-3" />}
            className="px-0 pt-1 text-[#2563EB]"
          >
            Track Shipments
          </Button>
        </div>

        <div className="space-y-2 bg-[#FFFFFF] shadow-sm p-4 border border-[#E2E8F0] rounded-2xl">
          <div className="flex justify-center items-center bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl w-9 h-9 text-[#2563EB]">
            <FiFileText className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-[#0F172A] text-sm">Vault Documents</h4>
          <p className="text-[#64748B] text-xs">
            Download encrypted purchase contracts, PDI health certificates, and customs tax receipts ({documentsCount} files).
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigateTab("Document Vault")}
            rightIcon={<FiArrowRight className="w-3 h-3" />}
            className="px-0 pt-1 text-[#2563EB]"
          >
            Open Vault
          </Button>
        </div>
      </div>
    </div>
  );
};

