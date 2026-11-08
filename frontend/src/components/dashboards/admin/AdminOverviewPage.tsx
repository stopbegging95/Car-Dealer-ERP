"use client";

import React, { useState } from "react";
import {
  FiUsers,
  FiShoppingCart,
  FiDollarSign,
  FiUserPlus,
  FiTrendingUp,
  FiShield,
  FiArrowRight,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiPackage,
  FiTruck,
  FiTool,
  FiRepeat,
  FiFileText,
  FiActivity,
  FiPercent,
  FiCheck,
  FiSliders,
  FiEye,
} from "react-icons/fi";
import { FaCar } from "react-icons/fa6";
import { Button, Badge, KPICard, Card, Table, Modal } from "@/components/ui";

export interface AdminOverviewPageProps {
  onOpenCreatePortalAccount?: () => void;
}

interface ExecutiveApprovalItem {
  id: string;
  type: string;
  title: string;
  department: string;
  amount: string;
  requester: string;
  status: "Pending Executive Review" | "Approved" | "Declined";
  date: string;
}

export const AdminOverviewPage: React.FC<AdminOverviewPageProps> = ({
  onOpenCreatePortalAccount,
}) => {
  const [growthTimeframe, setGrowthTimeframe] = useState("Monthly");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [widgetsConfig, setWidgetsConfig] = useState({
    kpis: true,
    portalBanner: true,
    operationsGrid: true,
    approvalsQueue: true,
    revenueChart: true,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Executive Management Approvals Queue (Section 3 of Dealership ERP Specification)
  const [approvals, setApprovals] = useState<ExecutiveApprovalItem[]>([
    {
      id: "APP-8812",
      type: "High-Value Acquisition",
      title: "2024 Mercedes-Maybach S580 (Antwerp Direct Import)",
      department: "Procurement & Logistics",
      amount: "₦220,100,000",
      requester: "Lead Sourcing Officer M. Vance",
      status: "Pending Executive Review",
      date: "Nov 08, 2026",
    },
    {
      id: "APP-8813",
      type: "Trade-In Valuation Exception",
      title: "2020 Mercedes-Benz E350 AMG (₦50,375,000 Approved Swap Credit)",
      department: "Trade-In & Vehicle Swap",
      amount: "₦50,375,000",
      requester: "Lead Appraiser D. Adeleke",
      status: "Pending Executive Review",
      date: "Nov 08, 2026",
    },
    {
      id: "APP-8814",
      type: "Diplomatic Fleet Rebate",
      title: "4.5% Diplomatic Mission Discount on 2 Armored Range Rover SVs",
      department: "Showroom Floor Sales",
      amount: "₦29,295,000",
      requester: "Senior Sales Liaison Emeka O.",
      status: "Pending Executive Review",
      date: "Nov 07, 2026",
    },
    {
      id: "APP-8815",
      type: "Emergency Workshop Overhaul",
      title: "OEM Dual-Clutch Gearbox & Transmission Assembly Rebuild",
      department: "Technical Service & Bays",
      amount: "₦22,010,000",
      requester: "Workshop Supervisor Babatunde",
      status: "Pending Executive Review",
      date: "Nov 06, 2026",
    },
  ]);

  const handleApprove = (id: string, title: string) => {
    setApprovals(
      approvals.map((item) =>
        item.id === id ? { ...item, status: "Approved" } : item
      )
    );
    showToast(`Executive approval granted for ${title}. Audit notification dispatched.`);
  };

  const handleDecline = (id: string, title: string) => {
    setApprovals(
      approvals.map((item) =>
        item.id === id ? { ...item, status: "Declined" } : item
      )
    );
    showToast(`Transaction ${id} put on hold / declined.`);
  };

  // Departmental Oversight Directory (Section 2 & 21 of ERP Specification)
  const departmentsOversight = [
    {
      name: "Showroom Floor Sales",
      module: "Orders & Sales",
      icon: <FiShoppingCart className="w-4 h-4 text-[#2563EB]" />,
      kpi: "94% Target Achieved",
      stat: "42 Deals Active (₦9.76B)",
      status: "On Target",
      statusVariant: "gold" as const,
      detail: "31.4% Lead-to-sale conversion rate across Lagos and Abuja nodes.",
    },
    {
      name: "Procurement & Sourcing",
      module: "Procurement",
      icon: <FiPackage className="w-4 h-4 text-[#D97706]" />,
      kpi: "18 Active Purchase Orders",
      stat: "₦7.44B Sourcing Pipeline",
      status: "Sourcing Active",
      statusVariant: "gold" as const,
      detail: "Antwerp, Bremerhaven, Dubai, Tokyo, and USA OEM direct procurement channels.",
    },
    {
      name: "Accounting & Margins",
      module: "Accounting",
      icon: <FiDollarSign className="w-4 h-4 text-[#16A34A]" />,
      kpi: "FIRS VAT Verified",
      stat: "₦1.86B Inbound Escrow",
      status: "Audit Clean",
      statusVariant: "gold" as const,
      detail: "Landed cost formulas reconciled; gross vehicle profit at 18.5%.",
    },
    {
      name: "Invoices & Payments",
      module: "Invoices & Payments",
      icon: <FiFileText className="w-4 h-4 text-[#2563EB]" />,
      kpi: "148 Invoices Issued",
      stat: "₦3.72B Collected (Nov)",
      status: "98% Reconciled",
      statusVariant: "gold" as const,
      detail: "Proforma quotes, commercial invoices, custom duty receipts, and bank wires.",
    },
    {
      name: "Automotive Financing",
      module: "Finance",
      icon: <FiPercent className="w-4 h-4 text-[#7C3AED]" />,
      kpi: "18 Active Loan Apps",
      stat: "4 Tier-1 Partner Banks",
      status: "Active Underwriting",
      statusVariant: "gold" as const,
      detail: "8.5% prime interest rate tenor options with bank loan underwriting.",
    },
    {
      name: "Technical Service & Bays",
      module: "Service & Workshop",
      icon: <FiTool className="w-4 h-4 text-[#D97706]" />,
      kpi: "Bays 1-6 100% Utilized",
      stat: "14 Active Job Cards",
      status: "Full Capacity",
      statusVariant: "charcoal" as const,
      detail: "98.4% first-time diagnostic fix rate and 150-point PDI seals issued.",
    },
    {
      name: "OEM Parts & Depot",
      module: "Parts & Inventory",
      icon: <FiPackage className="w-4 h-4 text-[#0284C7]" />,
      kpi: "8,420 Active SKUs",
      stat: "3 Low-Stock Alerts",
      status: "Depot Restocked",
      statusVariant: "gold" as const,
      detail: "₦651,000,000 spares inventory value across OEM filters, brakes, and ECUs.",
    },
    {
      name: "Detailing & Recon",
      module: "Detailing & Recon",
      icon: <FiActivity className="w-4 h-4 text-[#EA580C]" />,
      kpi: "8 Cars in 5-Stage Recon",
      stat: "3.2 Days Turnaround",
      status: "Stage 3 & 4 Active",
      statusVariant: "gold" as const,
      detail: "Paint depth measurement, multi-stage compound, and ceramic coating.",
    },
    {
      name: "Importation & Logistics",
      module: "Import Logistics",
      icon: <FiTruck className="w-4 h-4 text-[#2563EB]" />,
      kpi: "14 Vessel Shipments",
      stat: "₦0 Demurrage Paid",
      status: "Port Berth Scheduled",
      statusVariant: "gold" as const,
      detail: "4 vessels in Atlantic transit; 2 berthing at TCIT & Apapa container terminals.",
    },
    {
      name: "Trade-In & Vehicle Swap",
      module: "Trade-In & Swap",
      icon: <FiRepeat className="w-4 h-4 text-[#059669]" />,
      kpi: "36 Swap Requests Active",
      stat: "₦2.86B Trade Equity",
      status: "6 Pending Appraisals",
      statusVariant: "gold" as const,
      detail: "Automatic trade-in differential calculation with 150-point inspection.",
    },
    {
      name: "VIP Client CRM Desk",
      module: "CRM Pipeline & 360",
      icon: <FiUsers className="w-4 h-4 text-[#4338CA]" />,
      kpi: "142 HNI Collectors",
      stat: "₦19.84B Pipeline Value",
      status: "VIP Tier Active",
      statusVariant: "gold" as const,
      detail: "29 foreign diplomatic missions and corporate executive fleet buyers.",
    },
    {
      name: "Reports & Analytics",
      module: "Reports & Analytics",
      icon: <FiTrendingUp className="w-4 h-4 text-[#059669]" />,
      kpi: "38.4 Days Avg in Stock",
      stat: "8.2x Inventory Turnover",
      status: "Optimized Velocity",
      statusVariant: "gold" as const,
      detail: "Category sales velocity, stock aging analysis, margin ratios, and exportable reports.",
    },
    {
      name: "People Operations & HR",
      module: "HR & Recruitment",
      icon: <FiUserPlus className="w-4 h-4 text-[#DB2777]" />,
      kpi: "84 Total Employees",
      stat: "98.2% Present Today",
      status: "4 Open Vacancies",
      statusVariant: "gold" as const,
      detail: "Staff directory, commissions, payroll, and recruitment applicant pipeline.",
    },
  ];

  return (
    <div className="space-y-4">
      {toastMessage && (
        <div className="flex items-center gap-2 bg-[#EFF6FF] border border-[#2563EB] text-[#1E40AF] px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs animate-in fade-in duration-200">
          <FiCheckCircle className="w-4 h-4 text-[#2563EB] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Overview Cockpit Header & Customize Widgets Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#FFFFFF] p-3 rounded-md border border-[#E2E8F0] shadow-xs">
        <div>
          <h2 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider flex items-center gap-2">
            <FiActivity className="w-4 h-4 text-[#2563EB]" />
            Executive Management Cockpit
          </h2>
          <p className="text-[#64748B] text-[11px]">
            Dealership telemetry, executive authorization queues, and multi-department operations
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-xs gap-1.5"
          onClick={() => setIsCustomizeModalOpen(true)}
        >
          <FiSliders className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Customize Widgets</span>
        </Button>
      </div>

      {/* 1. Executive Multi-Metric KPI Overview Strip (Section 3 of ERP Specification) */}
      {widgetsConfig.kpis && (
        <div className="gap-3 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total Vehicles Managed"
            value="1,248"
            change="942 Available • 184 Transit"
            icon={<FaCar className="w-5 h-5 text-[#2563EB]" />}
          />
          <KPICard
            title="Total Sales Revenue (YTD)"
            value="₦74.7B"
            change="+21.0% vs last mo"
            icon={<FiDollarSign className="w-5 h-5 text-[#2563EB]" />}
          />
          <KPICard
            title="Gross Profit / Net Margin"
            value="₦13.8B"
            change="18.5% Margin (₦8.37B Net)"
            icon={<FiTrendingUp className="w-5 h-5 text-[#16A34A]" />}
          />
          <KPICard
            title="Outstanding Receivables"
            value="₦3.72B"
            change="18 customer wire balances"
            icon={<FiClock className="w-5 h-5 text-[#D97706]" />}
          />
        </div>
      )}

      {/* 2. Admin Quick Action Banner: Create Department Portals */}
      {widgetsConfig.portalBanner && (
        <Card className="space-y-3 bg-gradient-to-r from-[#0F172A] to-[#1E293B] shadow-md p-4 sm:p-5 border-0 text-white">
          <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-[#2563EB] p-1.5 rounded text-white">
                  <FiShield className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-white text-sm uppercase tracking-wider">
                  Department Portals & Staff Accounts Management
                </h3>
              </div>
              <p className="text-[#94A3B8] text-[11px]">
                Provision isolated dashboards for Accounting, Sales, Workshop, Logistics, HR & VIP Client desks with strictly scoped RBAC permissions.
              </p>
            </div>
            <div className="flex items-center self-start sm:self-auto gap-2 shrink-0">
              {onOpenCreatePortalAccount && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onOpenCreatePortalAccount}
                  leftIcon={<FiUserPlus className="w-3.5 h-3.5 text-white" />}
                >
                  + Provision Staff Account
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* 3. Executive Multi-Department Oversight Matrix (Tabular Form) */}
      {widgetsConfig.operationsGrid && (
        <Card className="space-y-3 shadow-xs p-4 sm:p-5">
          <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-[#E2E8F0] border-b">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">
                  Departmental Oversight & Central Operations Grid
                </h3>
                <Badge variant="gold" size="sm">{departmentsOversight.length} Departments Monitored</Badge>
              </div>
              <p className="text-[#64748B] text-[11px]">
                Super Admin real-time oversight matrix across all operational departments. Use the sidebar to switch workspaces.
              </p>
            </div>
          </div>

          <Table
            data={departmentsOversight}
            keyExtractor={(dept) => dept.name}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "name",
                header: "Department Desk",
                sortable: true,
                render: (dept) => (
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-[#EFF6FF] border border-[#BFDBFE] shrink-0">
                      {dept.icon}
                    </div>
                    <div>
                      <span className="font-bold text-[#0F172A] text-xs block">{dept.name}</span>
                      <span className="text-[10px] text-[#64748B] font-mono">{dept.module}</span>
                    </div>
                  </div>
                ),
              },
              {
                key: "kpi",
                header: "Core Operational KPI",
                sortable: true,
                render: (dept) => (
                  <span className="font-bold text-[#0F172A] text-xs">{dept.kpi}</span>
                ),
              },
              {
                key: "stat",
                header: "Financial / Volumetric Metric",
                sortable: true,
                render: (dept) => (
                  <span className="font-mono text-[#2563EB] text-xs font-semibold">{dept.stat}</span>
                ),
              },
              {
                key: "status",
                header: "Operational Health",
                sortable: true,
                render: (dept) => (
                  <Badge variant={dept.statusVariant} size="sm">
                    {dept.status}
                  </Badge>
                ),
              },
              {
                key: "detail",
                header: "Super Admin Direct Scope",
                render: (dept) => (
                  <span className="text-[#64748B] text-xs line-clamp-1">{dept.detail}</span>
                ),
              },
            ]}
          />
        </Card>
      )}

      {/* 4. Executive Authorization & Approvals Queue (Tabular Form) */}
      {widgetsConfig.approvalsQueue && (
        <Card className="space-y-3 shadow-xs p-4 sm:p-5">
          <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-[#E2E8F0] border-b">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">
                  Executive Authorization & High-Value Approvals Queue
                </h3>
                <Badge variant="gold" size="sm">
                  {approvals.filter((a) => a.status === "Pending Executive Review").length} Pending Review
                </Badge>
              </div>
              <p className="text-[#64748B] text-[11px]">
                Authorizations for high-value vehicle purchases, trade-in valuations, diplomatic discounts, and workshop emergency orders.
              </p>
            </div>
          </div>

          <Table
            data={approvals}
            keyExtractor={(item) => item.id}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "id",
                header: "Approval ID",
                sortable: true,
                render: (item) => (
                  <span className="font-mono font-bold text-[#2563EB]">{item.id}</span>
                ),
              },
              {
                key: "title",
                header: "Transaction Scope",
                sortable: true,
                render: (item) => (
                  <div>
                    <div className="font-bold text-[#0F172A] text-xs">{item.title}</div>
                    <div className="text-[10px] text-[#64748B] font-mono">{item.type}</div>
                  </div>
                ),
              },
              {
                key: "department",
                header: "Department",
                sortable: true,
                render: (item) => <span className="text-[#475569]">{item.department}</span>,
              },
              {
                key: "requester",
                header: "Submitted By",
                render: (item) => <span className="text-[#475569]">{item.requester}</span>,
              },
              {
                key: "amount",
                header: "Monetary Value",
                sortable: true,
                render: (item) => (
                  <span className="font-mono font-bold text-[#0F172A] text-xs">{item.amount}</span>
                ),
              },
              {
                key: "status",
                header: "Authorization Decision",
                sortable: true,
                render: (item) =>
                  item.status === "Pending Executive Review" ? (
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="primary"
                        size="sm"
                        className="h-7 px-2.5 text-[11px]"
                        onClick={() => handleApprove(item.id, item.title)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-7 px-2 text-[11px]"
                        onClick={() => handleDecline(item.id, item.title)}
                      >
                        Decline
                      </Button>
                    </div>
                  ) : (
                    <Badge variant={item.status === "Approved" ? "gold" : "charcoal"} size="sm">
                      {item.status}
                    </Badge>
                  ),
              },
            ]}
          />
        </Card>
      )}

      {/* 5. Dealership P&L Expense Structure & Sales Trends */}
      {widgetsConfig.revenueChart && (
        <div className="gap-4 grid grid-cols-1 lg:grid-cols-3">
          {/* Dealership Sales Trend */}
          <div className="space-y-4 lg:col-span-2 bg-[#FFFFFF] shadow-xs p-4 sm:p-5 border border-[#E2E8F0] rounded-md">
            <div className="flex justify-between items-center pb-3 border-[#E2E8F0] border-b">
              <div>
                <h3 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">
                  Monthly Audited Revenue & Landed Margins
                </h3>
                <p className="text-[#64748B] text-[11px]">Consolidated P&L across Lagos Victoria Island & Abuja Diplomatic suites</p>
              </div>
              <Badge variant="gold" size="sm">FY 2026 Audited</Badge>
            </div>

            <div className="flex items-end gap-2 sm:gap-3 px-1 pt-4 h-44 sm:h-48">
              {[
                { month: "Jan", height: "45%", val: "₦4.3B" },
                { month: "Feb", height: "55%", val: "₦5.3B" },
                { month: "Mar", height: "50%", val: "₦4.8B" },
                { month: "Apr", height: "65%", val: "₦6.4B" },
                { month: "May", height: "60%", val: "₦6.0B" },
                { month: "Jun", height: "75%", val: "₦7.4B" },
                { month: "Jul", height: "70%", val: "₦7.0B" },
                { month: "Aug", height: "80%", val: "₦8.1B" },
                { month: "Sep", height: "68%", val: "₦6.7B" },
                { month: "Oct", height: "85%", val: "₦9.0B" },
                { month: "Nov", height: "92%", val: "₦9.8B" },
                { month: "Dec", height: "78%", val: "₦7.7B" },
              ].map((col) => (
                <div key={col.month} className="group relative flex flex-col flex-1 justify-end items-center h-full">
                  <div className="-top-8 absolute bg-[#0F172A] opacity-0 group-hover:opacity-100 px-1.5 py-0.5 rounded font-mono font-bold text-[9px] text-white transition-opacity pointer-events-none">
                    {col.val}
                  </div>
                  <div
                    style={{ height: col.height }}
                    className="bg-[#2563EB] group-hover:bg-[#1D4ED8] rounded-t-sm w-full transition-all"
                  />
                  <span className="mt-2 text-[#64748B] text-[10px]">{col.month}</span>
                </div>
              ))}
            </div>

            {/* Dealership Cost Structure Progress (Section 10 Requirement) */}
            <div className="pt-3 border-t border-[#E2E8F0] space-y-2">
              <span className="text-[11px] font-bold text-[#0F172A] uppercase tracking-wider block">
                Dealership Cost Structure Breakdown (% of Gross Revenue)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="bg-[#F8FAFC] p-2 rounded border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[10px]">Vehicle Acquisition</span>
                  <span className="font-mono font-bold text-[#0F172A]">71.0% (₦53.0B)</span>
                </div>
                <div className="bg-[#F8FAFC] p-2 rounded border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[10px]">Freight & Port Duty</span>
                  <span className="font-mono font-bold text-[#2563EB]">8.5% (₦6.35B)</span>
                </div>
                <div className="bg-[#F8FAFC] p-2 rounded border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[10px]">Workshop PDI & Recon</span>
                  <span className="font-mono font-bold text-[#D97706]">2.1% (₦1.55B)</span>
                </div>
                <div className="bg-[#F8FAFC] p-2 rounded border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[10px]">Net Dealership Profit</span>
                  <span className="font-mono font-bold text-emerald-600">12.2% (₦9.15B)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Client Growth & Inquiries */}
          <div className="space-y-4 bg-[#FFFFFF] shadow-xs p-4 sm:p-5 border border-[#E2E8F0] rounded-md">
            <div className="flex justify-between items-center pb-3 border-[#E2E8F0] border-b">
              <div>
                <h3 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">Client Demographics</h3>
                <p className="text-[#64748B] text-[11px]">New VIP leads & verified accounts</p>
              </div>
              <div className="flex gap-1">
                {(["Weekly", "Monthly"] as const).map((t) => (
                  <Button
                    key={t}
                    type="button"
                    variant={growthTimeframe === t ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setGrowthTimeframe(t)}
                    className="px-2 py-0.5 text-[10px] font-semibold"
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex justify-between items-center bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
                <div>
                  <span className="block text-[#64748B] text-[11px]">Private VIP Collectors</span>
                  <span className="font-mono font-bold text-[#0F172A] text-base">142 Clients</span>
                </div>
                <span className="flex items-center gap-1 font-mono font-bold text-[#1D4ED8] text-xs">
                  <FiTrendingUp className="w-3.5 h-3.5" /> +18.4%
                </span>
              </div>

              <div className="flex justify-between items-center bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
                <div>
                  <span className="block text-[#64748B] text-[11px]">Corporate Fleet Buyers</span>
                  <span className="font-mono font-bold text-[#0F172A] text-base">48 Entities</span>
                </div>
                <span className="flex items-center gap-1 font-mono font-bold text-[#1D4ED8] text-xs">
                  <FiTrendingUp className="w-3.5 h-3.5" /> +12.0%
                </span>
              </div>

              <div className="flex justify-between items-center bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
                <div>
                  <span className="block text-[#64748B] text-[11px]">Diplomatic Protocol</span>
                  <span className="font-mono font-bold text-[#0F172A] text-base">29 Embassies</span>
                </div>
                <span className="flex items-center gap-1 font-mono font-bold text-[#1D4ED8] text-xs">
                  <FiTrendingUp className="w-3.5 h-3.5" /> +6.5%
                </span>
              </div>

              <div className="bg-[#EFF6FF] p-3 rounded-md border border-[#BFDBFE] space-y-1">
                <span className="text-[10px] font-bold text-[#1E40AF] uppercase tracking-wider block">
                  Executive Audit Notice
                </span>
                <p className="text-[11px] text-[#2563EB] leading-tight">
                  All customer transactions & contracts adhere to 2-factor management sign-off and Nigerian Custom SGD validation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMIZE WIDGETS MODAL */}
      <Modal
        isOpen={isCustomizeModalOpen}
        onClose={() => setIsCustomizeModalOpen(false)}
        title="Customize Executive Overview Widgets"
        footer={
          <div className="flex justify-between items-center w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setWidgetsConfig({
                  kpis: true,
                  portalBanner: true,
                  operationsGrid: true,
                  approvalsQueue: true,
                  revenueChart: true,
                })
              }
            >
              Reset to Default
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsCustomizeModalOpen(false);
                showToast("Overview dashboard widget layout saved.");
              }}
            >
              Save Layout
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs">
          <p className="text-[#64748B]">
            Pin, toggle, or hide operational widgets to tailor your executive dashboard view:
          </p>
          <div className="space-y-2 border border-[#E2E8F0] p-3 rounded-md bg-[#F8FAFC]">
            {[
              {
                key: "kpis",
                label: "Executive Multi-Metric KPI Strip",
                desc: "Total vehicles, revenue, margins, and receivables",
              },
              {
                key: "portalBanner",
                label: "Department Portals Quick Access Banner",
                desc: "Super Admin account provisioning shortcut",
              },
              {
                key: "operationsGrid",
                label: "Departmental Oversight & Central Operations Grid",
                desc: "Multi-department tabular performance matrix",
              },
              {
                key: "approvalsQueue",
                label: "Executive Authorization Approvals Queue",
                desc: "High-value purchase, discount & workshop approval queue",
              },
              {
                key: "revenueChart",
                label: "Consolidated Revenue & Cost Structure Breakdown",
                desc: "Monthly revenue bars and dealership expense percentage distribution",
              },
            ].map((w) => (
              <label
                key={w.key}
                className="flex items-center justify-between p-2 rounded bg-white border border-[#CBD5E1] cursor-pointer hover:border-[#2563EB]"
              >
                <div>
                  <span className="font-bold text-[#0F172A] block">{w.label}</span>
                  <span className="text-[11px] text-[#64748B]">{w.desc}</span>
                </div>
                <input
                  type="checkbox"
                  checked={widgetsConfig[w.key as keyof typeof widgetsConfig]}
                  onChange={(e) =>
                    setWidgetsConfig((prev) => ({
                      ...prev,
                      [w.key]: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-[#2563EB] rounded focus:ring-[#2563EB]"
                />
              </label>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};
