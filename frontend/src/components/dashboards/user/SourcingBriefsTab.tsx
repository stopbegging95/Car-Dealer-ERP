"use client";

import React from "react";
import { FiPlus } from "react-icons/fi";
import { Button, Badge, Table, Card } from "@/components/ui";
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
    <div className="space-y-4">
      <Card className="shadow-xs p-4 sm:p-5">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3">
          <div>
            <h3 className="font-bold text-[#0F172A] text-base uppercase tracking-tight">
              International Auto Broker Briefs ({activeRequests.length})
            </h3>
            <p className="text-[#64748B] text-xs">
              Active vehicle sourcing scans across German, Belgian, and UAE dealer networks.
            </p>
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
      </Card>

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
            header: "Target Vehicle Spec",
            sortable: true,
            render: (req) => (
              <div>
                <span className="font-bold text-[#0F172A] text-xs">{req.vehicle}</span>
                <span className="block text-[#64748B] text-[10px]">{req.type}</span>
              </div>
            ),
          },
          {
            key: "market",
            header: "Target Market",
            sortable: true,
            render: (req) => <span className="text-[#475569] text-xs">{req.market}</span>,
          },
          {
            key: "budget",
            header: "Budget Ceiling",
            sortable: true,
            render: (req) => <span className="font-mono font-bold text-[#1D4ED8] text-xs">{req.budget}</span>,
          },
          {
            key: "broker",
            header: "Assigned Broker Desk",
            render: (req) => <span className="font-medium text-[#0F172A] text-xs">{req.broker}</span>,
          },
          {
            key: "stage",
            header: "Current Milestone",
            render: (req) => <span className="text-[#475569] text-xs">{req.stage}</span>,
          },
          {
            key: "status",
            header: "Status",
            render: (req) => <Badge variant="gold" size="sm">{req.status}</Badge>,
          },
        ]}
      />
    </div>
  );
};
