"use client";

import React from "react";
import {
  FiUsers,
  FiActivity,
  FiShield,
  FiLock,
  FiUserPlus,
} from "react-icons/fi";
import { Button, Badge, KPICard, Card, Table } from "@/components/ui";
import { StaffAccount } from "@/data/roles";

export interface DepartmentPortalsPageProps {
  staffAccounts: StaffAccount[];
  onOpenCreateModal: () => void;
  onOpenDashboard?: (account: StaffAccount) => void;
  onToggleStatus: (accountId: string) => void;
}

export const DepartmentPortalsPage: React.FC<DepartmentPortalsPageProps> = ({
  staffAccounts,
  onOpenCreateModal,
  onToggleStatus,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Provisioning Metrics */}
      <div className="gap-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Provisioned Staff Desks"
          value={`${staffAccounts.length} Accounts`}
          change="11 Isolated Department Dashboards"
          icon={<FiUsers className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Active Department Sessions"
          value="3 Active"
          change="Encrypted via FIDO2 / WebAuthn"
          icon={<FiActivity className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Department Isolation"
          value="100% Strict"
          change="Cross-Dept Intrusion Blocked"
          icon={<FiShield className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Access Policy Protocol"
          value="RBAC Tier 1"
          change="Least-Privilege Role Model"
          icon={<FiLock className="w-5 h-5 text-[#2563EB]" />}
        />
      </div>

      {/* Primary Management Card */}
      <Card className="space-y-4 shadow-xs p-4 sm:p-5">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3 pb-3 border-b border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#EFF6FF] p-1.5 border border-[#BFDBFE] rounded text-[#2563EB]">
                <FiUsers className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">
                Dealership Department Portals & Staff Provisioning Console
              </h3>
            </div>
            <p className="mt-0.5 text-[11px] text-[#64748B]">
              Super Admin Control: Create and provision isolated dashboard accounts for every department under the company. Each department only accesses its designated operational data.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenCreateModal}
            leftIcon={<FiUserPlus className="w-3.5 h-3.5 text-white" />}
          >
            + Create Department Account
          </Button>
        </div>

        {/* Isolation Policy Matrix Notice */}
        <div className="gap-3 grid grid-cols-1 md:grid-cols-3 bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md text-xs">
          <div className="space-y-1">
            <span className="block font-bold text-[#0F172A]">Strict Data Isolation</span>
            <p className="text-[11px] text-[#64748B]">
              Workspaces are cryptographically isolated. Accounting staff cannot access CRM leads; workshop techs cannot view financial ledgers.
            </p>
          </div>
          <div className="space-y-1">
            <span className="block font-bold text-[#0F172A]">Branch Allocation</span>
            <p className="text-[11px] text-[#64748B]">
              Every provisioned user is assigned to a physical showroom node (Victoria Island, Ikoyi Lounge, Maitama Suite, Lekki Center, or Tin Can Port).
            </p>
          </div>
          <div className="space-y-1">
            <span className="block font-bold text-[#0F172A]">WORM Audit Trail</span>
            <p className="text-[11px] text-[#64748B]">
              All account creation, status toggling, and login sessions are recorded in the SHA-256 tamper-evident immutable log.
            </p>
          </div>
        </div>

        {/* Provisioned Department Accounts Table */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">
              Active Department Desks & Provisioned Staff ({staffAccounts.length})
            </h4>
            <span className="text-[10px] text-[#64748B]">Super Admin identity & RBAC authorization directory</span>
          </div>

          <Table
            data={staffAccounts}
            keyExtractor={(account) => account.id}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "name",
                header: "Staff Account",
                sortable: true,
                render: (account) => (
                  <div>
                    <div className="font-bold text-[#0F172A]">{account.name}</div>
                    <span className="font-mono text-[#64748B] text-[10px]">{account.email}</span>
                    <div className="font-mono text-[#2563EB] text-[9px]">{account.id}</div>
                  </div>
                ),
              },
              {
                key: "departmentName",
                header: "Department Workspace",
                sortable: true,
                render: (account) => (
                  <div>
                    <span className="font-bold text-[#1D4ED8]">{account.departmentName}</span>
                    <span className="block text-[10px] text-[#64748B]">
                      Module: <strong>{account.dashboardModule}</strong>
                    </span>
                  </div>
                ),
              },
              {
                key: "branch",
                header: "Branch Allocation",
                sortable: true,
                render: (account) => <span className="text-[11px] text-[#475569]">{account.branch}</span>,
              },
              {
                key: "accessLevel",
                header: "Clearance Tier",
                sortable: true,
                render: (account) => (
                  <Badge variant="charcoal" size="sm">
                    {account.accessLevel}
                  </Badge>
                ),
              },
              {
                key: "status",
                header: "Status",
                sortable: true,
                render: (account) => (
                  <Badge
                    variant={account.status === "Active" ? "gold" : "charcoal"}
                    size="sm"
                    dot
                  >
                    {account.status}
                  </Badge>
                ),
              },
              {
                key: "lastLogin",
                header: "Last Activity",
                render: (account) => (
                  <span className="font-mono text-[10px] text-[#64748B]">{account.lastLogin}</span>
                ),
              },
              {
                key: "action",
                header: "Actions",
                align: "right",
                render: (account) => (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleStatus(account.id)}
                    className="px-2.5 py-1 text-[11px]"
                  >
                    {account.status === "Active" ? "Suspend Access" : "Activate Access"}
                  </Button>
                ),
              },
            ]}
          />
        </div>
      </Card>
    </div>
  );
};

