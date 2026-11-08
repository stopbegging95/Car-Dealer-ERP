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
} from "react-icons/fi";
import { Button, Badge, KPICard, Card, Table } from "@/components/ui";
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
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  savedVehicles,
  activeRequests,
  documentsCount,
  onOpenNewBriefModal,
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
          value="₦69,750,000"
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

      {/* Live Vehicle Order & Sourcing Timeline Table */}
      <Card className="space-y-4 shadow-xs p-4 sm:p-5">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3">
          <div>
            <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
              Active Acquisition & Sourcing Status ({activeRequests.length})
            </h3>
            <p className="text-[#64748B] text-[11px]">Real-time logistics, inspection, and delivery timeline</p>
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

        <Table
          data={activeRequests}
          keyExtractor={(item) => item.id}
          pageSize={15}
          showSerialNumber={true}
          columns={[
            {
              key: "id",
              header: "Dossier ID",
              sortable: true,
              render: (req) => <span className="font-mono font-bold text-[#2563EB] text-xs">{req.id}</span>,
            },
            {
              key: "vehicle",
              header: "Vehicle Spec",
              sortable: true,
              render: (req) => (
                <div>
                  <span className="font-bold text-[#0F172A] text-xs">{req.vehicle}</span>
                  <span className="block text-[#64748B] text-[10px]">{req.type}</span>
                </div>
              ),
            },
            {
              key: "stage",
              header: "Operational Milestone",
              render: (req) => <span className="font-medium text-[#0F172A] text-xs">{req.stage}</span>,
            },
            {
              key: "broker",
              header: "Desk Broker",
              render: (req) => <span className="text-[#475569] text-xs">{req.broker}</span>,
            },
            {
              key: "budget",
              header: "Budget Allocation",
              sortable: true,
              render: (req) => <span className="font-mono font-bold text-[#1D4ED8] text-xs">{req.budget}</span>,
            },
            {
              key: "date",
              header: "Last Updated",
              render: (req) => <span className="font-mono text-[#64748B] text-xs">{req.date}</span>,
            },
            {
              key: "status",
              header: "Status",
              render: (req) => (
                <Badge variant="gold" size="sm" dot>
                  {req.status}
                </Badge>
              ),
            },
          ]}
        />
      </Card>

      {/* Operational Overview Cards */}
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-3">
        <Card className="space-y-2 shadow-xs p-4">
          <div className="flex justify-center items-center bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl w-9 h-9 text-[#2563EB]">
            <FiHeart className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-[#0F172A] text-sm">Saved Garage Vehicles</h4>
          <p className="text-[#64748B] text-xs">
            Review your {savedVehicles.length} bookmarked showroom models and run loan estimations via the sidebar.
          </p>
        </Card>

        <Card className="space-y-2 shadow-xs p-4">
          <div className="flex justify-center items-center bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl w-9 h-9 text-[#2563EB]">
            <FiTruck className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-[#0F172A] text-sm">Port Customs Tracking</h4>
          <p className="text-[#64748B] text-xs">
            Live single goods declaration status and vessel progress for your imported models.
          </p>
        </Card>

        <Card className="space-y-2 shadow-xs p-4">
          <div className="flex justify-center items-center bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl w-9 h-9 text-[#2563EB]">
            <FiFileText className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-[#0F172A] text-sm">Vault Documents</h4>
          <p className="text-[#64748B] text-xs">
            Download encrypted purchase contracts, PDI health certificates, and customs tax receipts ({documentsCount} files).
          </p>
        </Card>
      </div>
    </div>
  );
};
