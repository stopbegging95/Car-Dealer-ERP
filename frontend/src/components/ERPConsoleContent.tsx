"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  FiLayers,
  FiShoppingCart,
  FiUsers,
  FiDollarSign,
  FiFileText,
  FiMessageSquare,
  FiSettings,
  FiShield,
  FiPlus,
  FiTruck,
  FiRepeat,
  FiEdit3,
  FiDownload,
  FiClock,
  FiAnchor,
  FiBriefcase,
  FiNavigation,
  FiTool,
  FiBox,
  FiActivity,
  FiCheckSquare,
  FiCheckCircle,
  FiEye,
  FiUser,
  FiMapPin,
  FiMail,
  FiLock,
  FiSearch,
  FiCheck,
  FiX,
  FiShoppingBag,
  FiPercent,
  FiUserPlus,
  FiKey,
  FiAlertCircle,
} from "react-icons/fi";
import { FaCar } from "react-icons/fa6";
import {
  Button,
  Badge,
  KPICard,
  Table,
  Modal,
  Input,
  Dropdown,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui";
import { DashboardLayout } from "@/components/DashboardLayout";
import { VEHICLES, Vehicle } from "@/data/vehicles";
import {
  DEALERSHIP_ROLES,
  getRoleById,
  isModuleAllowedForRole,
  StaffAccount,
  INITIAL_STAFF_ACCOUNTS,
} from "@/data/roles";
import { AccessRestrictedGuard } from "@/components/AccessRestrictedGuard";
import { INITIAL_SESSION_LOGS, SessionAuditLog } from "@/data/sessionAuditLogs";
import { downloadOrderAsPdf, downloadVaultDocumentPdf } from "@/utils/pdfGenerator";

interface OrderItem {
  id: string;
  client: string;
  car: string;
  amount: string;
  status: string;
  stage: string;
  rep: string;
  vin?: string;
  deposit?: string;
  balance?: string;
  deliveryDate?: string;
}

const SALES_ORDERS: OrderItem[] = [
  {
    id: "ORD-9912",
    client: "Alhaji Bello & Sons Ltd",
    car: "2024 Mercedes-Maybach S580 (Dual-Tone)",
    amount: "$165,000",
    status: "Delivery Inspection",
    stage: "Ready for Handover",
    rep: "Emeka O.",
    vin: "WDD223...001",
    deposit: "$100,000",
    balance: "$65,000",
    deliveryDate: "2026-11-12",
  },
  {
    id: "ORD-9910",
    client: "Dr. K. Somoye",
    car: "2024 Porsche 911 Turbo S (Guards Red)",
    amount: "$225,000",
    status: "Payment Confirmed",
    stage: "Registration & Armor",
    rep: "Aisha M.",
    vin: "WP0AD2...002",
    deposit: "$225,000",
    balance: "$0 (Paid in Full)",
    deliveryDate: "2026-11-15",
  },
  {
    id: "ORD-9908",
    client: "Zenith Capital Partners",
    car: "2023 Range Rover Autobiography LWB",
    amount: "$195,000",
    status: "Customs Clearance",
    stage: "Tin Can Discharge",
    rep: "Tariq K.",
    vin: "SALWR2...003",
    deposit: "$80,000",
    balance: "$115,000",
    deliveryDate: "2026-11-20",
  },
  {
    id: "ORD-9904",
    client: "Senator Godswill O.",
    car: "2024 Mercedes-AMG G63 Magno Black",
    amount: "$240,000",
    status: "Quotation Approved",
    stage: "Bank Wire Verification",
    rep: "Emeka O.",
    vin: "W1N9G8...007",
    deposit: "$120,000",
    balance: "$120,000",
    deliveryDate: "2026-11-25",
  },
];

export function ERPConsoleContent({
  initialModule = "Dashboard",
  initialRole = "admin",
}: {
  initialModule?: string;
  initialRole?: string;
}) {
  const searchParams = useSearchParams();
  const roleFromUrl = searchParams?.get("role") || initialRole;
  const moduleFromUrl = searchParams?.get("module") || initialModule;

  const [activeRoleId, setActiveRoleId] = useState<string>(roleFromUrl);
  const activeRole = useMemo(() => getRoleById(activeRoleId), [activeRoleId]);

  const [activeModule, setActiveModule] = useState<string>(() => {
    const role = getRoleById(roleFromUrl);
    if (role.allowedModules.includes(moduleFromUrl)) {
      return moduleFromUrl;
    }
    return role.defaultModule;
  });

  const [growthTimeframe, setGrowthTimeframe] = useState<string>("Weekly");
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState<boolean>(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState<boolean>(false);
  const [tableSearch, setTableSearch] = useState<string>("");

  // Modals for Sales, Car Management, and Inspections
  const [selectedOrderForPreview, setSelectedOrderForPreview] = useState<OrderItem | null>(null);
  const [selectedOrderForInspection, setSelectedOrderForInspection] = useState<OrderItem | null>(null);
  const [selectedVehicleForPreview, setSelectedVehicleForPreview] = useState<Vehicle | null>(null);
  const [selectedTradeInForInspection, setSelectedTradeInForInspection] = useState<{
    id: string;
    client: string;
    carOffered: string;
    target: string;
    valuation: string;
    diff: string;
    status: string;
  } | null>(null);
  const [selectedSessionForInspection, setSelectedSessionForInspection] = useState<SessionAuditLog | null>(null);

  // Session History Search & Filtering
  const [sessionFilter, setSessionFilter] = useState<"all" | "active" | "terminated">("all");
  const [sessionSearch, setSessionSearch] = useState<string>("");

  // In-app Action Feedback Toast (replaces window.alert)
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  // Staff & Dashboard Accounts Management (Admin Provisions Department Accounts)
  const [staffAccounts, setStaffAccounts] = useState<StaffAccount[]>(INITIAL_STAFF_ACCOUNTS);
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState<boolean>(false);
  const [newStaffName, setNewStaffName] = useState<string>("");
  const [newStaffEmail, setNewStaffEmail] = useState<string>("");
  const [newStaffDept, setNewStaffDept] = useState<string>("finance");
  const [newStaffPassword, setNewStaffPassword] = useState<string>("Pass#2026@Lux");
  const [newStaffBranch, setNewStaffBranch] = useState<string>("Victoria Island Flagship Showroom");
  const [newStaffClearance, setNewStaffClearance] = useState<
    "Department Head / Director" | "Senior Specialist / Closer" | "Associate Specialist / Auditor"
  >("Department Head / Director");

  // Accounting Department Dashboard State
  const [accountingTab, setAccountingTab] = useState<"margins" | "payables" | "receivables" | "tax">("margins");
  const [fiscalPeriodLocked, setFiscalPeriodLocked] = useState<boolean>(false);
  const [selectedVoucherForAudit, setSelectedVoucherForAudit] = useState<{
    stockId: string;
    model: string;
    fob: string;
    freight: string;
    duty: string;
    recon: string;
    landedCost: string;
    soldPrice: string;
    netMargin: string;
    marginPct: string;
    client: string;
    soldDate: string;
    status: string;
  } | null>(null);

  // Accounts Payable State with live Disburse action
  const [payablesList, setPayablesList] = useState([
    {
      id: "AP-2026-081",
      payee: "Grimaldi Deep Sea Shipping Lines",
      purpose: "Container Ro-Ro Sea Freight (4 Vehicles)",
      amount: "$34,800",
      dueDate: "2026-11-12",
      status: "Pending Wire Authorization",
    },
    {
      id: "AP-2026-082",
      payee: "Nigeria Customs Service (Tin Can Area Command)",
      purpose: "SGD Duty & Port Inspection Levies",
      amount: "$51,200",
      dueDate: "2026-11-10",
      status: "Approved for Wire Transfer",
    },
    {
      id: "AP-2026-083",
      payee: "Mercedes-Benz Central Parts AG",
      purpose: "OEM Ceramic Rotors & Consumable Spares",
      amount: "$26,400",
      dueDate: "2026-11-15",
      status: "Pending Wire Authorization",
    },
    {
      id: "AP-2026-084",
      payee: "Ceramic Pro Middle East FZE",
      purpose: "9H Diamond Nanotech Coating Stock",
      amount: "$14,800",
      dueDate: "2026-11-18",
      status: "Pending Wire Authorization",
    },
  ]);

  // Accounts Receivable State with live Verify action
  const [receivablesList, setReceivablesList] = useState([
    {
      id: "AR-2026-041",
      client: "Chief Alexander Vance",
      car: "2024 Mercedes-Maybach S580",
      balance: "$120,000",
      bank: "GTBank Plc",
      wireRef: "GTB-WIR-99120",
      status: "Wire Received - Verification Required",
    },
    {
      id: "AR-2026-042",
      client: "Dr. K. Somoye",
      car: "2024 S580 Maybach (Trade-In Settlement)",
      balance: "$97,000",
      bank: "Zenith Bank Plc",
      wireRef: "ZEN-TX-44021",
      status: "Wire Received - Verification Required",
    },
    {
      id: "AR-2026-043",
      client: "Senator B. Adeleke",
      car: "2024 Bentley Continental GT",
      balance: "$165,000",
      bank: "First Bank of Nigeria",
      wireRef: "FBN-WIRE-88194",
      status: "Escrow Pending Clearance",
    },
  ]);

  const handleCreateStaffAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffEmail.trim()) {
      showToast("Please provide staff name and work email.");
      return;
    }
    const targetRole = getRoleById(newStaffDept);
    const newAccount: StaffAccount = {
      id: `USR-0${staffAccounts.length + 1}`,
      name: newStaffName,
      email: newStaffEmail,
      departmentId: targetRole.id,
      departmentName: targetRole.department,
      dashboardModule: targetRole.defaultModule,
      branch: newStaffBranch,
      accessLevel: newStaffClearance,
      status: "Active",
      createdAt: "2026-11-08",
      lastLogin: "Never (Pending Initial Login)",
    };
    setStaffAccounts((prev) => [newAccount, ...prev]);
    setIsCreateAccountModalOpen(false);
    setNewStaffName("");
    setNewStaffEmail("");
    showToast(`Account for ${newAccount.name} provisioned successfully for ${targetRole.name}! Credentials dispatched.`);
  };

  const toggleStaffStatus = (accountId: string) => {
    setStaffAccounts((prev) =>
      prev.map((acc) =>
        acc.id === accountId
          ? { ...acc, status: acc.status === "Active" ? "Suspended" : "Active" }
          : acc
      )
    );
    showToast("Staff account access status updated.");
  };

  const filteredSessions = useMemo(() => {
    return INITIAL_SESSION_LOGS.filter((s) => {
      const matchesSearch =
        s.id.toLowerCase().includes(sessionSearch.toLowerCase()) ||
        s.userName.toLowerCase().includes(sessionSearch.toLowerCase()) ||
        s.ipAddress.toLowerCase().includes(sessionSearch.toLowerCase()) ||
        s.email.toLowerCase().includes(sessionSearch.toLowerCase());
      if (sessionFilter === "active") return matchesSearch && !s.logoutTime;
      if (sessionFilter === "terminated") return matchesSearch && !!s.logoutTime;
      return matchesSearch;
    });
  }, [sessionSearch, sessionFilter]);

  const handleDownloadOrderPdf = (order: OrderItem) => {
    downloadOrderAsPdf({
      orderId: order.id,
      clientName: order.client,
      vehicleName: order.car,
      amount: order.amount,
      status: order.status,
      stage: order.stage,
      salesRep: order.rep,
      vin: order.vin,
      date: order.deliveryDate,
    });
  };

  // Role permissions check
  const isAllowed = useMemo(() => {
    return isModuleAllowedForRole(activeRole.id, activeModule);
  }, [activeRole.id, activeModule]);

  const handleRoleChange = (newRoleId: string) => {
    setActiveRoleId(newRoleId);
    const newRole = getRoleById(newRoleId);
    if (!newRole.allowedModules.includes(activeModule)) {
      setActiveModule(newRole.defaultModule);
    }
  };

  // Master stock filtering
  const filteredStock = VEHICLES.filter(
    (v) =>
      v.make.toLowerCase().includes(tableSearch.toLowerCase()) ||
      v.model.toLowerCase().includes(tableSearch.toLowerCase()) ||
      v.stockId.toLowerCase().includes(tableSearch.toLowerCase()) ||
      v.category.toLowerCase().includes(tableSearch.toLowerCase())
  );

  const mainMenuItems = useMemo(
    () => [
      { name: "Dashboard", icon: <FiLayers className="w-4 h-4 shrink-0" /> },
      { name: "Car Management", icon: <FaCar className="w-4 h-4 shrink-0" />, badge: `${filteredStock.length}` },
      { name: "Orders & Sales", icon: <FiShoppingCart className="w-4 h-4 shrink-0" />, badge: "8" },
      { name: "Service & Workshop", icon: <FiTool className="w-4 h-4 shrink-0" />, badge: "6 Bays" },
      { name: "Parts & Inventory", icon: <FiBox className="w-4 h-4 shrink-0" />, badge: "4 Low" },
      { name: "Finance & Insurance", icon: <FiActivity className="w-4 h-4 shrink-0" />, badge: "6 Pending" },
      { name: "Detailing & Recon", icon: <FiCheckSquare className="w-4 h-4 shrink-0" />, badge: "4 Ready" },
      { name: "Branch Transfers", icon: <FiNavigation className="w-4 h-4 shrink-0" />, badge: "2 Active" },
      { name: "Import Logistics", icon: <FiTruck className="w-4 h-4 shrink-0" />, badge: "3 Vessels" },
      { name: "Trade-In & Swap", icon: <FiRepeat className="w-4 h-4 shrink-0" />, badge: "3" },
      { name: "CRM Pipeline & 360", icon: <FiMessageSquare className="w-4 h-4 shrink-0" />, badge: "14" },
      { name: "Accounting & Finance", icon: <FiDollarSign className="w-4 h-4 shrink-0" /> },
      { name: "HR & Recruitment", icon: <FiBriefcase className="w-4 h-4 shrink-0" />, badge: "5 Apps" },
    ],
    [filteredStock.length]
  );

  const systemMenuItems = useMemo(
    () => [
      { name: "Roles & RBAC", icon: <FiShield className="w-4 h-4 shrink-0" /> },
      { name: "Document Vault", icon: <FiFileText className="w-4 h-4 shrink-0" /> },
      { name: "CMS Manager", icon: <FiEdit3 className="w-4 h-4 shrink-0" /> },
      { name: "Settings", icon: <FiSettings className="w-4 h-4 shrink-0" /> },
    ],
    []
  );

  // Filter menu items strictly according to role permissions
  const filteredMainMenuItems = useMemo(() => {
    return mainMenuItems.filter((item) => activeRole.allowedModules.includes(item.name));
  }, [mainMenuItems, activeRole.allowedModules]);

  const filteredSystemMenuItems = useMemo(() => {
    return systemMenuItems.filter((item) => activeRole.allowedModules.includes(item.name));
  }, [systemMenuItems, activeRole.allowedModules]);

  return (
    <DashboardLayout
      title={activeModule}
      activeModule={activeModule}
      onSelectModule={setActiveModule}
      mainMenuItems={filteredMainMenuItems}
      systemMenuItems={filteredSystemMenuItems}
      branchName={activeRole.branchName}
      userRole={activeRole.badge}
      userName={activeRole.userName}
      userEmail={activeRole.email}
      userInitials={activeRole.userInitials}
      departmentName={activeRole.department}
      availableRoles={DEALERSHIP_ROLES.map((r) => ({
        id: r.id,
        name: r.name,
        badge: r.badge,
        department: r.department,
      }))}
      activeRoleId={activeRoleId}
      onSelectRole={handleRoleChange}
      onSearch={setTableSearch}
    >
      {!isAllowed ? (
        <AccessRestrictedGuard
          attemptedModule={activeModule}
          activeRole={activeRole}
          onReturnToAllowedModule={setActiveModule}
          onSwitchRole={handleRoleChange}
        />
      ) : (
        <div className="space-y-4">
          {/* Department Desk Operational Banner (if not Super Admin) */}
          {activeRole.id !== "admin" && (
            <div className="p-3 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs text-xs animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <FiShield className="w-4 h-4 text-[#2563EB] shrink-0" />
                <div>
                  <span className="font-bold text-[#0F172A]">{activeRole.department}</span>
                  <span className="text-[#64748B] ml-2 hidden sm:inline">&bull; {activeRole.description}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] text-[#2563EB] font-bold shrink-0">
                <span className="bg-white px-2 py-0.5 rounded border border-[#BFDBFE]">
                  {activeRole.allowedModules.length} Workspaces Authorized
                </span>
              </div>
            </div>
          )}
        {/* ================================================================= */}
        {/* MODULE 1: DASHBOARD & EXECUTIVE ANALYTICS [ERP-01]                */}
        {/* ================================================================= */}
        {activeModule === "Dashboard" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <KPICard
                title="Total Cars Listed"
                value="1,248"
                change="+12.4% vs last mo"
                icon={<FaCar className="w-5 h-5 text-[#2563EB]" />}
              />
              <KPICard
                title="Active Users"
                value="8,432"
                change="+8.1% vs last mo"
                icon={<FiUsers className="w-5 h-5 text-[#2563EB]" />}
              />
              <KPICard
                title="Total Transactions"
                value="412"
                change="+14.2% vs last mo"
                icon={<FiShoppingCart className="w-5 h-5 text-[#2563EB]" />}
              />
              <KPICard
                title="Total Revenue ($)"
                value="$48.2M"
                change="+21.0% vs last mo"
                icon={<FiDollarSign className="w-5 h-5 text-[#2563EB]" />}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 sm:p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">Monthly Dealership Sales Trend</h3>
                    <p className="text-[11px] text-[#64748B]">Audited revenue across Lagos & Abuja showrooms</p>
                  </div>
                  <Badge variant="gold" size="sm">FY 2026</Badge>
                </div>

                <div className="h-44 sm:h-48 flex items-end gap-2 sm:gap-3 pt-4 px-1">
                  {[
                    { month: "Jan", height: "45%", val: "$2.8M" },
                    { month: "Feb", height: "55%", val: "$3.4M" },
                    { month: "Mar", height: "50%", val: "$3.1M" },
                    { month: "Apr", height: "65%", val: "$4.1M" },
                    { month: "May", height: "60%", val: "$3.9M" },
                    { month: "Jun", height: "75%", val: "$4.8M" },
                    { month: "Jul", height: "70%", val: "$4.5M" },
                    { month: "Aug", height: "80%", val: "$5.2M" },
                    { month: "Sep", height: "85%", val: "$5.6M" },
                    { month: "Oct", height: "90%", val: "$6.1M" },
                    { month: "Nov", height: "100%", val: "$6.8M", active: true },
                    { month: "Dec", height: "92%", val: "$6.2M" },
                  ].map((bar) => (
                    <div key={bar.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-mono font-bold text-[#2563EB] bg-[#EFF6FF] px-1 rounded">
                        {bar.val}
                      </div>
                      <div
                        style={{ height: bar.height }}
                        className={`w-full rounded-t transition-all ${
                          bar.active
                            ? "bg-[#2563EB] shadow-md shadow-[#2563EB]/30"
                            : "bg-[#CBD5E1] hover:bg-[#94A3B8]"
                        }`}
                      />
                      <span className="text-[10px] text-[#64748B] font-mono font-medium">{bar.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 sm:p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">Client Growth</h3>
                  <div className="flex items-center gap-1 bg-[#F1F5F9] p-0.5 rounded-md text-[10px]">
                    {["Weekly", "Monthly"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setGrowthTimeframe(t)}
                        className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                          growthTimeframe === t
                            ? "bg-[#2563EB] text-[#FFFFFF]"
                            : "text-[#64748B] hover:text-[#0F172A]"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    { label: "VIP Retail Buyers", count: "1,240", pct: 68 },
                    { label: "Corporate Fleet Clients", count: "480", pct: 45 },
                    { label: "Auto Broker Network", count: "312", pct: 32 },
                  ].map((cat) => (
                    <div key={cat.label} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-[#475569]">{cat.label}</span>
                        <span className="text-[#0F172A] font-mono">{cat.count}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                        <div
                          style={{ width: `${cat.pct}%` }}
                          className="h-full bg-[#2563EB] rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE 2: CAR MANAGEMENT & MASTER INVENTORY [ERP-02, ERP-03]       */}
        {/* ================================================================= */}
        {activeModule === "Car Management" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFFFF] p-4 rounded-md border border-[#E2E8F0] shadow-xs">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">Master Vehicle Fleet Control</h3>
                <p className="text-[11px] text-[#64748B]">Real-time VIN audit, showroom allocations, and status toggles</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAddVehicleOpen(true)}
                leftIcon={<FiPlus className="w-4 h-4 text-[#FFFFFF]" />}
              >
                Add New Vehicle to Stock
              </Button>
            </div>

            <Table
              data={filteredStock}
              keyExtractor={(item) => item.stockId}
              columns={[
                { key: "stockId", header: "Stock ID", sortable: true },
                {
                  key: "make",
                  header: "Make & Model",
                  sortable: true,
                  render: (row) => (
                    <div>
                      <div className="font-bold text-[#0F172A]">{row.make} {row.model}</div>
                      <div className="text-[10px] text-[#64748B] font-mono">VIN: {row.vin}</div>
                    </div>
                  ),
                },
                { key: "year", header: "Year", sortable: true },
                { key: "location", header: "Showroom Hub", sortable: true },
                {
                  key: "priceUSD",
                  header: "Retail Price ($)",
                  sortable: true,
                  render: (row) => (
                    <span className="font-mono font-bold text-[#1D4ED8]">${row.priceUSD.toLocaleString()}</span>
                  ),
                },
                {
                  key: "status",
                  header: "Status",
                  sortable: true,
                  render: (row) => (
                    <Badge variant="gold" size="sm" dot>
                      {row.status}
                    </Badge>
                  ),
                },
                {
                  key: "actions",
                  header: "Actions",
                  align: "right",
                  render: (row) => (
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedVehicleForPreview(row)}
                        className="px-2.5 py-1 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] hover:bg-[#2563EB] hover:text-[#FFFFFF] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                        title="Preview Vehicle Specification Dossier"
                      >
                        <FiEye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE 3: ORDERS & SALES MANAGEMENT [ERP-06, ERP-07]              */}
        {/* ================================================================= */}
        {activeModule === "Orders & Sales" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
              <KPICard
                title="Open Purchase Orders"
                value="8 Pending"
                change="$1.4M Committed"
                icon={<FiShoppingBag className="w-5 h-5 text-[#2563EB]" />}
              />
              <KPICard
                title="Completed Deliveries"
                value="48 Units"
                change="This Quarter"
                icon={<FiTruck className="w-5 h-5 text-[#2563EB]" />}
              />
              <KPICard
                title="Showroom Target"
                value="84% Achieved"
                change="M-o-M Growth +12%"
                icon={<FiActivity className="w-5 h-5 text-[#2563EB]" />}
              />
              <KPICard
                title="Handover Fulfillment"
                value="96.2%"
                change="On-Time Delivery Rate"
                icon={<FiCheckCircle className="w-5 h-5 text-[#2563EB]" />}
              />
            </div>

            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E2E8F0]">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">Active Sales Pipeline & Concurrency Control</h3>
                  <p className="text-[11px] text-[#64748B]">Preview contract details, inspect 150-point PDI certifications, or download official sales PDFs</p>
                </div>
                <Badge variant="gold" size="sm">5-Stage Concurrency Guard</Badge>
              </div>

              <div className="space-y-2.5 text-xs">
                {SALES_ORDERS.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3.5 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-[#BFDBFE] transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#2563EB]">{ord.id}</span>
                        <span className="font-bold text-[#0F172A]">{ord.client}</span>
                        <Badge variant="gold" size="sm">{ord.status}</Badge>
                      </div>
                      <div className="text-[#64748B] text-[11px] flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="font-medium text-[#0F172A]">{ord.car}</span>
                        <span>&bull;</span>
                        <span>Stage: <strong className="text-[#0F172A]">{ord.stage}</strong></span>
                        <span>&bull;</span>
                        <span>Sales Rep: {ord.rep}</span>
                        {ord.vin && (
                          <>
                            <span>&bull;</span>
                            <span className="font-mono">VIN: {ord.vin}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-[#E2E8F0]">
                      <div className="text-left md:text-right mr-1">
                        <span className="font-mono font-bold text-[#1D4ED8] text-sm block">{ord.amount}</span>
                        <span className="text-[10px] text-[#64748B] font-mono">Deposit: {ord.deposit || "$50,000"}</span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* 1. PREVIEW BUTTON (Opens Modal - No Page Redirection) */}
                        <button
                          type="button"
                          onClick={() => setSelectedOrderForPreview(ord)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] hover:bg-[#2563EB] hover:text-[#FFFFFF] text-xs font-semibold transition-colors cursor-pointer"
                          title="Preview Order Dossier in Modal"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>

                        {/* 2. INSPECT BUTTON (Opens Modal - No window.alert) */}
                        <button
                          type="button"
                          onClick={() => setSelectedOrderForInspection(ord)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] hover:bg-[#2563EB] hover:text-[#FFFFFF] text-xs font-semibold transition-colors cursor-pointer"
                          title="Inspect 150-Point PDI & Condition Sheet in Modal"
                        >
                          <FiCheckSquare className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>

                        {/* 3. DOWNLOAD BUTTON (Downloads Sales Order PDF) */}
                        <button
                          type="button"
                          onClick={() => handleDownloadOrderPdf(ord)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#2563EB] text-[#FFFFFF] hover:bg-[#1D4ED8] text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                          title="Download Official Dealership Bill of Sale as PDF"
                        >
                          <FiDownload className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* DEPARTMENT: SERVICE & WORKSHOP (AFTER-SALES & PDI)                */}
        {/* ================================================================= */}
        {activeModule === "Service & Workshop" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
              <KPICard title="Bays In Operation" value="6 / 8 Bays" change="75% Capacity" icon={<FiTool className="w-4 h-4" />} />
              <KPICard title="PDI Completed" value="18 Vehicles" change="This Month" icon={<FiCheckCircle className="w-4 h-4" />} />
              <KPICard title="Mean Diagnosis" value="2.4 Hours" change="OBD-II Certified" icon={<FiClock className="w-4 h-4" />} />
              <KPICard title="Customer CSAT" value="98.5%" change="After-sales Rating" icon={<FiUsers className="w-4 h-4" />} />
            </div>

            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">Active Workshop Bay Job Cards & PDI Diagnostics</h3>
                  <p className="text-[11px] text-[#64748B]">Pre-delivery inspections, factory recalls, and master mechanical sign-offs</p>
                </div>
                <Button variant="primary" size="sm" leftIcon={<FiPlus className="w-3.5 h-3.5 text-[#FFFFFF]" />}>
                  Create Workshop Job Card
                </Button>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { id: "JOB-2026-441", bay: "Bay 1 (Master Diagnostic)", car: "2024 Mercedes-Maybach S580", vin: "WDD223...001", type: "150-Point PDI & Suspension Calibration", tech: "Engr. Tunde B. (Lead Tech)", status: "In Inspection" },
                  { id: "JOB-2026-438", bay: "Bay 3 (Mechanical Bay)", car: "2024 Porsche 911 Turbo S", vin: "WP0AD2...002", type: "Carbon-Ceramic Brake Bedding & Fluids", tech: "Engr. Klaus M. (Exotic Specialist)", status: "Diagnostic Passed" },
                  { id: "JOB-2026-435", bay: "Bay 4 (Electrical & ECU)", car: "2024 Lexus LX 600 VIP", vin: "JTJHY7...004", type: "Software ECU Update & Radar Recalibration", tech: "Engr. David K. (Electronics)", status: "In Inspection" },
                  { id: "JOB-2026-429", bay: "Bay 2 (PDI Express)", car: "2023 Range Rover Autobiography", vin: "SALWR2...003", type: "Pre-Handover Verification & Seal Sign-off", tech: "Engr. Tunde B. (Lead Tech)", status: "Sign-Off Complete" },
                ].map((job) => (
                  <div key={job.id} className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#2563EB]">{job.id}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] font-bold">{job.bay}</span>
                        <span className="font-bold text-[#0F172A]">{job.car}</span>
                      </div>
                      <span className="text-[#64748B] text-[11px] block mt-0.5">
                        {job.type} &bull; Tech: {job.tech} &bull; VIN: {job.vin}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 self-end sm:self-auto">
                      <Badge variant="gold" size="sm">{job.status}</Badge>
                      <button
                        onClick={() => showToast(`Opening Job Card ${job.id} diagnostics report.`)}
                        className="px-2.5 py-1 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] hover:bg-[#2563EB] hover:text-[#FFFFFF] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Job Card
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* DEPARTMENT: PARTS & LUXURY ACCESSORIES                            */}
        {/* ================================================================= */}
        {activeModule === "Parts & Inventory" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
              <KPICard title="Total Parts SKUs" value="1,840 SKUs" change="98% Catalog Coverage" icon={<FiBox className="w-4 h-4" />} />
              <KPICard title="Warehouse Valuation" value="$420,500" change="Cost Value" icon={<FiDollarSign className="w-4 h-4" />} />
              <KPICard title="Re-order Threshold" value="4 SKUs Low" change="Automated Supplier Trigger" icon={<FiClock className="w-4 h-4" />} />
              <KPICard title="Fastest Moving" value="Ceramic Kits & Pads" change="Top Turn-rate" icon={<FiCheckCircle className="w-4 h-4" />} />
            </div>

            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">Parts & Accessories Master Catalog</h3>
                  <p className="text-[11px] text-[#64748B]">OEM genuine parts, styling packages, and consumable inventory</p>
                </div>
                <Button variant="primary" size="sm" leftIcon={<FiPlus className="w-3.5 h-3.5 text-[#FFFFFF]" />}>
                  Register Part SKU
                </Button>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { sku: "PRT-BRK-992", name: "Brembo Carbon-Ceramic Brake Kit (Porsche 992)", category: "Brake & Friction", stock: "8 Sets", cost: "$4,200", retail: "$5,850", status: "In Stock" },
                  { sku: "ACC-CER-9HPRO", name: "9H Diamond Graphene Ceramic Coating Kit (500ml)", category: "Detailing Chemical", stock: "45 Kits", cost: "$120", retail: "$290", status: "In Stock" },
                  { sku: "PRT-SUS-W223", name: "AIRMATIC Air Suspension Strut Assembly (S-Class)", category: "Suspension", stock: "2 Units", cost: "$1,850", retail: "$2,450", status: "Low Stock Alert" },
                  { sku: "ACC-WHL-22AMG", name: "22-Inch Forged Cross-Spoke Monoblock Wheels", category: "Wheels & Rims", stock: "4 Sets", cost: "$3,800", retail: "$5,400", status: "In Stock" },
                ].map((part) => (
                  <div key={part.sku} className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#2563EB]">{part.sku}</span>
                        <span className="font-bold text-[#0F172A]">{part.name}</span>
                      </div>
                      <span className="text-[#64748B] text-[11px] block mt-0.5">
                        Category: {part.category} &bull; Cost: {part.cost} &bull; Retail: {part.retail}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <span className="font-mono font-bold text-[#0F172A]">{part.stock}</span>
                      <Badge variant="gold" size="sm">{part.status}</Badge>
                      <button
                        onClick={() => showToast(`Generating stock requisition for ${part.sku}`)}
                        className="px-2.5 py-1 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] hover:bg-[#2563EB] hover:text-[#FFFFFF] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Re-Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* DEPARTMENT: FINANCE & INSURANCE (F&I DESK)                        */}
        {/* ================================================================= */}
        {activeModule === "Finance & Insurance" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
              <KPICard title="Financed Portfolio" value="$14.8M" change="Year-to-date" icon={<FiDollarSign className="w-4 h-4" />} />
              <KPICard title="Bank Partners" value="5 Prime Banks" change="Direct API Integration" icon={<FiShield className="w-4 h-4" />} />
              <KPICard title="Pending Pre-Approvals" value="6 Applications" change="Average 4-Hour Decision" icon={<FiClock className="w-4 h-4" />} />
              <KPICard title="Active Policies" value="142 Policies" change="Comprehensive Cover" icon={<FiFileText className="w-4 h-4" />} />
            </div>

            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">F&I Deals Pipeline, Auto Leasing & Insurance Underwriting</h3>
                  <p className="text-[11px] text-[#64748B]">Bank facilities, chattel mortgages, and comprehensive motor insurance underwriting</p>
                </div>
                <Button variant="primary" size="sm" leftIcon={<FiPlus className="w-3.5 h-3.5 text-[#FFFFFF]" />}>
                  New Financing Application
                </Button>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { id: "FIN-2026-102", client: "Alhaji Aliyu Bello", vehicle: "2024 Mercedes-Maybach S580", bank: "Stanbic IBTC Auto Finance", facility: "$150,000", underwriter: "Leadway Assurance (Comprehensive)", status: "Pre-Approved" },
                  { id: "FIN-2026-098", client: "Dr. Kemi Adeyemi", vehicle: "2024 Porsche 911 Turbo S", bank: "Zenith Bank Auto Lease", facility: "$180,000", underwriter: "AXA Mansard Motor Guard", status: "Underwriter Review" },
                  { id: "FIN-2026-095", client: "Oakwood Global Logistics Ltd", vehicle: "2024 Lexus LX 600 VIP", bank: "Access Bank Prime Auto", facility: "₦220,000,000", underwriter: "AIICO Comprehensive Motor", status: "Disbursement Pending" },
                ].map((deal) => (
                  <div key={deal.id} className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#2563EB]">{deal.id}</span>
                        <span className="font-bold text-[#0F172A]">{deal.client}</span>
                        <span className="text-[#64748B]">({deal.vehicle})</span>
                      </div>
                      <span className="text-[#64748B] text-[11px] block mt-0.5">
                        Bank: {deal.bank} &bull; Underwriter: {deal.underwriter}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <span className="font-mono font-bold text-[#1D4ED8]">{deal.facility}</span>
                      <Badge variant="gold" size="sm">{deal.status}</Badge>
                      <button
                        onClick={() => showToast(`Reviewing F&I dossier for ${deal.client}`)}
                        className="px-2.5 py-1 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] hover:bg-[#2563EB] hover:text-[#FFFFFF] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Review Terms
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* DEPARTMENT: DETAILING, PAINT & RECON                              */}
        {/* ================================================================= */}
        {activeModule === "Detailing & Recon" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
              <KPICard title="Cars In Detailing" value="4 Vehicles" change="In Progress" icon={<FiCheckSquare className="w-4 h-4" />} />
              <KPICard title="Ceramic Applied" value="28 This Month" change="9H Diamond Coating" icon={<FiShield className="w-4 h-4" />} />
              <KPICard title="Inspection Pass Rate" value="100%" change="Zero Imperfection" icon={<FiCheckCircle className="w-4 h-4" />} />
              <KPICard title="Average Cycle" value="18 Hours" change="Complete Paint Prep" icon={<FiClock className="w-4 h-4" />} />
            </div>

            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">5-Stage Aesthetic Recon & Delivery Handover Pipeline</h3>
                  <p className="text-[11px] text-[#64748B]">Paint correction, interior deep steam, ceramic seal & white-glove readiness</p>
                </div>
                <Badge variant="gold" size="sm">Detailing Bay Status</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs pt-1">
                <div className="p-2.5 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] text-center">
                  <span className="font-bold text-[#0F172A] block">Stage 1: Wash</span>
                  <span className="text-[10px] text-[#64748B]">Chemical Decontamination</span>
                </div>
                <div className="p-2.5 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] text-center">
                  <span className="font-bold text-[#0F172A] block">Stage 2: Paint Meter</span>
                  <span className="text-[10px] text-[#64748B]">Micron Thickness Audit</span>
                </div>
                <div className="p-2.5 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] text-center">
                  <span className="font-bold text-[#0F172A] block">Stage 3: Leather Care</span>
                  <span className="text-[10px] text-[#64748B]">Nappa Conditioning & Steam</span>
                </div>
                <div className="p-2.5 bg-[#EFF6FF] rounded-md border border-[#BFDBFE] text-center">
                  <span className="font-bold text-[#1D4ED8] block">Stage 4: 9H Ceramic</span>
                  <span className="text-[10px] text-[#1D4ED8]">Infrared Curing Booth</span>
                </div>
                <div className="p-2.5 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] text-center">
                  <span className="font-bold text-[#0F172A] block">Stage 5: Handover</span>
                  <span className="text-[10px] text-[#64748B]">White Glove Seal Sign-off</span>
                </div>
              </div>

              <div className="space-y-2 text-xs pt-2">
                {[
                  { vehicle: "2024 Mercedes-Maybach S580 [STK-2026-001]", stage: "Stage 4: 9H Ceramic Coating", progress: "85%", specialist: "Tariq K. (Master Detailer)", status: "Curing Booth Active" },
                  { vehicle: "2024 Porsche 911 Turbo S [STK-2026-002]", stage: "Stage 5: Final Handover Check", progress: "100%", specialist: "Chidi N. (QC Specialist)", status: "Showroom Ready" },
                  { vehicle: "2023 Range Rover Autobiography [STK-2026-003]", stage: "Stage 2: 2-Step Paint Correction", progress: "45%", specialist: "Tariq K. (Master Detailer)", status: "Compound & Polish" },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <span className="font-bold text-[#0F172A]">{item.vehicle}</span>
                      <span className="text-[#64748B] text-[11px] block mt-0.5">
                        Current: {item.stage} &bull; Specialist: {item.specialist}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <span className="font-mono font-bold text-[#2563EB]">{item.progress}</span>
                      <Badge variant="gold" size="sm">{item.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE: BRANCH TRANSFERS & CARRIER DISPATCH [ERP-05]              */}
        {/* ================================================================= */}
        {activeModule === "Branch Transfers" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFFFF] p-4 rounded-md border border-[#E2E8F0] shadow-xs">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">Inter-Showroom Branch Logistics</h3>
                <p className="text-[11px] text-[#64748B]">Real-time transit manifests between Lagos HQ and Abuja Diplomatic Suite</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsTransferModalOpen(true)}
                leftIcon={<FiNavigation className="w-4 h-4 text-[#FFFFFF]" />}
              >
                Dispatch New Carrier
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#FFFFFF] rounded-md border border-[#CBD5E1] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#2563EB]">TRF-2026-088</span>
                  <Badge variant="gold" size="sm">En Route (Express Hauler)</Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-[#0F172A]">Mercedes-Benz Maybach S580</div>
                  <div className="text-xs text-[#64748B]">Origin: Lagos Victoria Island &rarr; Dest: Abuja Maitama Suite</div>
                  <div className="text-[11px] text-[#64748B]">Carrier: Direct Luxury Flatbed #04 &bull; Driver: Musa Danladi (+234 803 111 2222)</div>
                </div>
                <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#2563EB] h-full w-3/4 rounded-full" />
                </div>
                <div className="flex justify-between text-[10px] text-[#64748B] font-mono">
                  <span>Dispatched: Nov 04, 06:00 AM</span>
                  <span className="font-bold text-[#2563EB]">ETA: Today, 08:30 PM</span>
                </div>
              </div>

              <div className="p-4 bg-[#FFFFFF] rounded-md border border-[#CBD5E1] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#2563EB]">TRF-2026-089</span>
                  <Badge variant="gold" size="sm">Pre-Trip PDI Check</Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-[#0F172A]">Porsche 911 Turbo S</div>
                  <div className="text-xs text-[#64748B]">Origin: Abuja Maitama &rarr; Dest: Lagos Showroom</div>
                  <div className="text-[11px] text-[#64748B]">Carrier: Secure Enclosed Transporter #01 &bull; Driver: Emeka Eze</div>
                </div>
                <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#2563EB] h-full w-1/4 rounded-full" />
                </div>
                <div className="flex justify-between text-[10px] text-[#64748B] font-mono">
                  <span>Inspection: Passed</span>
                  <span className="font-bold text-[#2563EB]">Dispatching Tomorrow 05:00 AM</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE: IMPORT LOGISTICS & PORT CLEARING [ERP-08, ERP-09]         */}
        {/* ================================================================= */}
        {activeModule === "Import Logistics" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
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

            {/* Ocean Bills of Lading & Port Manifest Directory */}
            <Card className="p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#E2E8F0]">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB] flex items-center gap-2">
                    <FiAnchor className="w-4 h-4 text-[#2563EB]" />
                    <span>Ocean Bills of Lading (B/L) & Port Customs Manifests</span>
                  </h3>
                  <p className="text-[11px] text-[#64748B]">Real-time tracking of luxury vehicle containers, customs SGD declarations, and port terminal gate release</p>
                </div>
                <Badge variant="gold" size="sm">Tin Can & Onne Port Terminals</Badge>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  {
                    bl: "BL-2026-MSC-88192",
                    vehicle: "2024 Mercedes-Maybach S580 (Dual-Tone)",
                    vin: "WDD223...001",
                    carrier: "MSC Laurence (Mediterranean Shipping Co)",
                    route: "Bremerhaven Port (DE) → Tin Can Island Terminal (Lagos)",
                    container: "MSKU-991204-1 (40ft High Cube)",
                    sgd: "SGD-2026-NCS-9912",
                    formM: "MF20260019482",
                    freeTime: "14 Days Remaining",
                    status: "Gate-Out Release Authorized",
                    linkedRef: "Accounting Voucher #LND-9912 (Customs Escrow Disbursed)",
                  },
                  {
                    bl: "BL-2026-MAEU-77312",
                    vehicle: "2024 Porsche 911 Turbo S (Guards Red)",
                    vin: "WP0AD2...002",
                    carrier: "Maersk Mc-Kinney (Maersk Ocean Line)",
                    route: "Port of Antwerp (BE) → Tin Can Island Terminal (Lagos)",
                    container: "MRKU-440219-8 (Dedicated Auto Carrier)",
                    sgd: "SGD-2026-NCS-9910",
                    formM: "MF20260019478",
                    freeTime: "12 Days Remaining",
                    status: "Customs Physical Examination Passed",
                    linkedRef: "Duty Assessment Approved by Lead Comptroller",
                  },
                  {
                    bl: "BL-2026-GRM-66109",
                    vehicle: "2024 Lexus LX 600 VIP (Manganese Luster)",
                    vin: "JTJHY7...004",
                    carrier: "Grande Nigeria (Grimaldi Ro-Ro)",
                    route: "Jebel Ali Port (UAE) → Onne Deep Seaport (Rivers)",
                    container: "Ro-Ro Weather-Deck Berth 4",
                    sgd: "SGD-2026-NCS-9908",
                    formM: "MF20260019460",
                    freeTime: "Transit In Progress",
                    status: "Atlantic Ocean Transit (ETA: Nov 14)",
                    linkedRef: "Pre-Arrival Assessment Report (PAAR) Generated",
                  },
                ].map((shipment) => (
                  <div key={shipment.bl} className="p-3.5 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-2 hover:border-[#BFDBFE] transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#2563EB] text-sm">{shipment.bl}</span>
                        <Badge variant="gold" size="sm">{shipment.status}</Badge>
                      </div>
                      <div className="font-mono text-[11px] text-[#475569]">
                        Container: <strong className="text-[#0F172A]">{shipment.container}</strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <div className="font-bold text-[#0F172A] text-xs">{shipment.vehicle}</div>
                        <span className="text-[#64748B]">VIN: <span className="font-mono">{shipment.vin}</span> &bull; Carrier: {shipment.carrier}</span>
                      </div>
                      <div>
                        <span className="text-[#64748B] block">Transit Corridor:</span>
                        <span className="font-medium text-[#0F172A]">{shipment.route}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#E2E8F0] text-[11px]">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[#0F172A]">SGD: <strong>{shipment.sgd}</strong></span>
                        <span className="text-[#64748B]">&bull;</span>
                        <span className="font-mono text-[#0F172A]">Form M: {shipment.formM}</span>
                        <span className="text-[#64748B]">&bull;</span>
                        <span className="text-emerald-700 font-semibold">{shipment.freeTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-[#EFF6FF] text-[#1D4ED8] px-2 py-0.5 rounded border border-[#BFDBFE] font-medium">
                          {shipment.linkedRef}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => showToast(`Tracking AIS Satellite telemetry for ${shipment.bl}`)}
                          className="text-[11px] py-0.5 px-2 text-[#2563EB]"
                        >
                          AIS Track
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Department Separation Notice */}
            <Card className="p-3.5 bg-[#EFF6FF] border border-[#BFDBFE] shadow-xs text-xs space-y-1">
              <div className="flex items-center gap-2 text-[#2563EB] font-bold">
                <FiShield className="w-4 h-4 shrink-0" />
                <span>Department Isolation Notice: Financial Ledgers Linked, Not Embedded</span>
              </div>
              <p className="text-[11px] text-[#475569]">
                Customs Single Goods Declaration (SGD) duty payment wires and total vehicle landed cost accounting ledgers are maintained strictly by the <strong>Accounting & Treasury Department</strong>. Port clearing logistics personnel manage manifest tracking, customs documentation, and terminal container gate releases without access to wholesale dealership profit margins.
              </p>
            </Card>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE: TRADE-IN & SWAP QUEUE [ERP-10]                            */}
        {/* ================================================================= */}
        {activeModule === "Trade-In & Swap" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <KPICard
                title="Active Appraisals"
                value="3 In Progress"
                change="Laser Paint & OBD Queue"
                icon={<FiRepeat className="w-5 h-5 text-[#2563EB]" />}
              />
              <KPICard
                title="Total Appraised Equity"
                value="$121,500"
                change="Trade-In Credit Offered"
                icon={<FiDollarSign className="w-5 h-5 text-[#2563EB]" />}
              />
              <KPICard
                title="Customer Settlement Gap"
                value="$348,500"
                change="Balance Due via Wire"
                icon={<FiClock className="w-5 h-5 text-[#2563EB]" />}
              />
              <KPICard
                title="Appraisal Approval Rate"
                value="100% Passed"
                change="Clean Structural Title"
                icon={<FiCheckCircle className="w-5 h-5 text-[#2563EB]" />}
              />
            </div>

            <Card className="p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-2.5">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB] flex items-center gap-2">
                    <FiRepeat className="w-4 h-4 text-[#2563EB]" />
                    <span>Customer Trade-In & Swap Appraisal Queue</span>
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    150-Point mechanical diagnostic valuation & Director approval triggers for client swaps
                  </p>
                </div>
                <Badge variant="gold" size="sm">Appraisal Desk Active</Badge>
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  {
                    id: "SWP-2026-14",
                    client: "Dr. K. Somoye",
                    carOffered: "2021 Mercedes-Benz E350 (64,000 km)",
                    target: "2024 Mercedes-Maybach S580 (Dual-Tone)",
                    valuation: "$32,500",
                    diff: "$132,500 Balance",
                    status: "Director Approval Required",
                    linkedStock: "Linked Target: STK-2026-001 (Showroom Stock)",
                  },
                  {
                    id: "SWP-2026-12",
                    client: "Barrister Tony O.",
                    carOffered: "2020 Toyota Land Cruiser Prado (88,000 km)",
                    target: "2023 Range Rover Autobiography LWB",
                    valuation: "$48,000",
                    diff: "$97,000 Balance",
                    status: "Inspection Completed",
                    linkedStock: "Linked Target: STK-2026-003 (Showroom Stock)",
                  },
                  {
                    id: "SWP-2026-09",
                    client: "Hajia Fatima G.",
                    carOffered: "2022 Lexus RX 350 (32,000 km)",
                    target: "2024 Lexus LX 600 VIP",
                    valuation: "$41,000",
                    diff: "$119,000 Balance",
                    status: "Valuation Approved",
                    linkedStock: "Linked Target: STK-2026-004 (Showroom Stock)",
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#BFDBFE] transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#2563EB]">{item.id}</span>
                        <span className="font-bold text-[#0F172A]">{item.client}</span>
                        <Badge variant="gold" size="sm">{item.status}</Badge>
                      </div>
                      <div className="text-[#64748B] text-[11px]">
                        Offered: <strong className="text-[#0F172A]">{item.carOffered}</strong> &rarr; Target: <strong className="text-[#0F172A]">{item.target}</strong>
                      </div>
                      <span className="text-[10px] text-[#2563EB] font-mono bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE] inline-block">
                        {item.linkedStock}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div className="text-right">
                        <span className="font-mono font-bold text-[#1D4ED8] text-sm block">{item.valuation}</span>
                        <span className="text-[10px] text-[#64748B] font-mono">{item.diff}</span>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setSelectedTradeInForInspection(item)}
                        leftIcon={<FiCheckSquare className="w-3.5 h-3.5 text-white" />}
                      >
                        Inspect Sheet
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE: CRM PIPELINE & CUSTOMER 360 [ERP-11, ERP-12]              */}
        {/* ================================================================= */}
        {activeModule === "CRM Pipeline & 360" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
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
        )}

        {/* ================================================================= */}
        {/* MODULE: ACCOUNTING & FINANCIAL TREASURY DASHBOARD [ERP-13, ERP-14] */}
        {/* ================================================================= */}
        {activeModule === "Accounting & Finance" && (
          <div className="space-y-4">
            {/* Top Accounting KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <KPICard
                title="Gross Realized Turnover"
                value="$3,420,000"
                change="18 Luxury Units MTD"
                icon={<FiDollarSign className="w-5 h-5 text-[#2563EB]" />}
              />
              <KPICard
                title="Net Realized Margin"
                value="$642,800"
                change="+18.8% Blended Margin"
                icon={<FiPercent className="w-5 h-5 text-[#2563EB]" />}
              />
              <KPICard
                title="Accounts Receivable"
                value="$210,000"
                change={`${receivablesList.filter((r) => r.status.includes("Pending") || r.status.includes("Required")).length} Wires Awaiting Receipt`}
                icon={<FiClock className="w-5 h-5 text-[#2563EB]" />}
              />
              <KPICard
                title="Accounts Payable"
                value="$145,200"
                change={`${payablesList.filter((p) => p.status.includes("Pending") || p.status.includes("Approved")).length} Vendor Invoices Due`}
                icon={<FiShield className="w-5 h-5 text-[#2563EB]" />}
              />
            </div>

            {/* Treasury & Commercial Bank Liquidity Balances */}
            <Card className="p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-2.5">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB] flex items-center gap-2">
                    <FiDollarSign className="w-4 h-4 text-[#2563EB]" />
                    <span>Commercial Treasury & Liquid Operating Balances</span>
                  </h3>
                  <p className="text-[11px] text-[#64748B]">Real-time synchronized corporate bank reserves across commercial clearing nodes</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#0F172A]">
                    Total Liquidity: <span className="text-[#1D4ED8]">$2,700,000 USD Equiv.</span>
                  </span>
                  <Badge variant="gold" size="sm">Audited Balances</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-1">
                  <div className="flex justify-between items-center text-[11px] text-[#64748B]">
                    <span>First Bank of Nigeria (FBN)</span>
                    <Badge variant="gold" size="sm">Operating</Badge>
                  </div>
                  <div className="text-base font-bold font-mono text-[#0F172A]">$1,240,000</div>
                  <span className="text-[10px] text-[#64748B] block">Acct: 2048991208 &bull; Client Wires & Showroom OpEx</span>
                </div>

                <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-1">
                  <div className="flex justify-between items-center text-[11px] text-[#64748B]">
                    <span>Guaranty Trust Bank (GTBank)</span>
                    <Badge variant="gold" size="sm">Customs Escrow</Badge>
                  </div>
                  <div className="text-base font-bold font-mono text-[#0F172A]">$610,000</div>
                  <span className="text-[10px] text-[#64748B] block">Acct: 0192847731 &bull; Port Clearing & Sea Freight Dedicated</span>
                </div>

                <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-1">
                  <div className="flex justify-between items-center text-[11px] text-[#64748B]">
                    <span>Zenith Bank Plc</span>
                    <Badge variant="gold" size="sm">Reserve Capital</Badge>
                  </div>
                  <div className="text-base font-bold font-mono text-[#0F172A]">$850,000</div>
                  <span className="text-[10px] text-[#64748B] block">Acct: 1018449204 &bull; Strategic Capital & Vendor Hedging</span>
                </div>
              </div>
            </Card>

            {/* Accounting Sub-Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-[#FFFFFF] p-2.5 rounded-md border border-[#E2E8F0] shadow-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Button
                  variant={accountingTab === "margins" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setAccountingTab("margins")}
                  leftIcon={<FiPercent className="w-3.5 h-3.5" />}
                >
                  Vehicle Landed Margins Ledger
                </Button>
                <Button
                  variant={accountingTab === "payables" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setAccountingTab("payables")}
                  leftIcon={<FiShield className="w-3.5 h-3.5" />}
                >
                  Accounts Payable & Disbursements ({payablesList.filter((p) => !p.status.includes("Disbursed")).length})
                </Button>
                <Button
                  variant={accountingTab === "receivables" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setAccountingTab("receivables")}
                  leftIcon={<FiClock className="w-3.5 h-3.5" />}
                >
                  Accounts Receivable & Inbound Wires ({receivablesList.filter((r) => !r.status.includes("Reconciled")).length})
                </Button>
                <Button
                  variant={accountingTab === "tax" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setAccountingTab("tax")}
                  leftIcon={<FiFileText className="w-3.5 h-3.5" />}
                >
                  Tax & 7.5% VAT Remittance
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => showToast("Exporting General Ledger to CSV...")}
                  leftIcon={<FiDownload className="w-3.5 h-3.5 text-[#2563EB]" />}
                >
                  Export CSV Ledger
                </Button>
                <Button
                  variant={fiscalPeriodLocked ? "secondary" : "primary"}
                  size="sm"
                  onClick={() => {
                    setFiscalPeriodLocked(!fiscalPeriodLocked);
                    showToast(
                      fiscalPeriodLocked
                        ? "Fiscal Period November 2026 unlocked for adjustments."
                        : "Fiscal Period November 2026 locked & cryptographically sealed."
                    );
                  }}
                  leftIcon={<FiLock className="w-3.5 h-3.5" />}
                >
                  {fiscalPeriodLocked ? "Unlock Period" : "Lock Fiscal Period"}
                </Button>
              </div>
            </div>

            {/* TAB 1: VEHICLE REALIZED LANDED MARGINS LEDGER */}
            {accountingTab === "margins" && (
              <Card className="p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-2">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">
                      Vehicle Landed Cost & Realized Margins Ledger
                    </h3>
                    <p className="text-[11px] text-[#64748B]">
                      Full landed cost variance reconciliation: FOB acquisition + sea freight + customs SGD duty + aesthetic prep vs. realized sales price
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    Net Landed Margin: +$642,800
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {[
                    {
                      stockId: "STK-2026-001",
                      model: "Mercedes-Benz S580 Maybach",
                      client: "Chief Alexander Vance",
                      fob: "$118,500",
                      freight: "$4,200",
                      duty: "$15,500",
                      recon: "$2,500",
                      landedCost: "$140,700",
                      soldPrice: "$165,000",
                      netMargin: "+$24,300",
                      marginPct: "14.7%",
                      soldDate: "2026-11-04",
                      status: "Reconciled & Audited",
                    },
                    {
                      stockId: "STK-2026-002",
                      model: "Porsche 911 Turbo S",
                      client: "Barrister Tony O.",
                      fob: "$162,000",
                      freight: "$4,800",
                      duty: "$19,200",
                      recon: "$2,400",
                      landedCost: "$188,400",
                      soldPrice: "$220,000",
                      netMargin: "+$31,600",
                      marginPct: "14.4%",
                      soldDate: "2026-11-02",
                      status: "Reconciled & Audited",
                    },
                    {
                      stockId: "STK-2026-003",
                      model: "Range Rover Autobiography",
                      client: "Dr. K. Somoye",
                      fob: "$128,000",
                      freight: "$4,500",
                      duty: "$16,800",
                      recon: "$2,700",
                      landedCost: "$152,000",
                      soldPrice: "$179,000",
                      netMargin: "+$27,000",
                      marginPct: "15.1%",
                      soldDate: "2026-10-29",
                      status: "Reconciled & Audited",
                    },
                    {
                      stockId: "STK-2026-004",
                      model: "Rolls-Royce Ghost Extended",
                      client: "Senator B. Adeleke",
                      fob: "$285,000",
                      freight: "$6,500",
                      duty: "$34,500",
                      recon: "$4,000",
                      landedCost: "$330,000",
                      soldPrice: "$395,000",
                      netMargin: "+$65,000",
                      marginPct: "16.5%",
                      soldDate: "2026-10-24",
                      status: "Pending Duty Reconciliation",
                    },
                  ].map((row) => (
                    <Card
                      key={row.stockId}
                      className="p-3 bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#2563EB] shadow-none flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#2563EB]">{row.stockId}</span>
                          <span className="font-bold text-[#0F172A]">{row.model}</span>
                          <Badge variant={row.status.includes("Reconciled") ? "gold" : "outline"} size="sm">
                            {row.status}
                          </Badge>
                        </div>
                        <div className="text-[#64748B] text-[11px] flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          <span>Buyer: <strong className="text-[#0F172A]">{row.client}</strong></span>
                          <span>&bull;</span>
                          <span>FOB: {row.fob}</span>
                          <span>&bull;</span>
                          <span>Freight: {row.freight}</span>
                          <span>&bull;</span>
                          <span>Customs Duty: {row.duty}</span>
                          <span>&bull;</span>
                          <span>Prep: {row.recon}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-4 self-end md:self-auto">
                        <div className="text-right font-mono">
                          <div className="text-[11px] text-[#64748B]">
                            Landed: <strong className="text-[#0F172A]">{row.landedCost}</strong> &rarr; Sold: <strong className="text-[#0F172A]">{row.soldPrice}</strong>
                          </div>
                          <div className="text-sm font-bold text-[#1D4ED8]">
                            Net Margin: {row.netMargin} ({row.marginPct})
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedVoucherForAudit(row)}
                          title="Inspect Itemized Accounting Audit Voucher"
                          leftIcon={<FiEye className="w-3.5 h-3.5" />}
                        >
                          Audit Voucher
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            )}

            {/* TAB 2: ACCOUNTS PAYABLE (VENDOR DISBURSEMENTS) */}
            {accountingTab === "payables" && (
              <Card className="p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-2">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">
                      Accounts Payable & Vendor Disbursements Queue
                    </h3>
                    <p className="text-[11px] text-[#64748B]">
                      Authorized commercial vendor payables: shipping carriers, customs authorities, and OEM parts distributors
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#0F172A]">
                    Total Pending Payables: <strong className="text-[#1D4ED8]">$127,200</strong>
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {payablesList.map((item) => (
                    <Card
                      key={item.id}
                      className="p-3 bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#2563EB] shadow-none flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#2563EB]">{item.id}</span>
                          <span className="font-bold text-[#0F172A]">{item.payee}</span>
                        </div>
                        <span className="text-[#64748B] text-[11px] block">
                          Purpose: {item.purpose} &bull; Due Date: <strong className="text-[#0F172A]">{item.dueDate}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <span className="font-mono font-bold text-[#0F172A] text-sm">{item.amount}</span>
                        <Badge variant={item.status.includes("Disbursed") ? "gold" : "outline"} size="sm">
                          {item.status}
                        </Badge>
                        {item.status !== "Disbursed / Wire Transferred" ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setPayablesList((prev) =>
                                prev.map((p) =>
                                  p.id === item.id ? { ...p, status: "Disbursed / Wire Transferred" } : p
                                )
                              );
                              showToast(`Wire transfer of ${item.amount} to ${item.payee} authorized.`);
                            }}
                            leftIcon={<FiCheck className="w-3.5 h-3.5" />}
                          >
                            Authorize Wire
                          </Button>
                        ) : (
                          <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                            Disbursed
                          </span>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            )}

            {/* TAB 3: ACCOUNTS RECEIVABLE (INBOUND WIRES) */}
            {accountingTab === "receivables" && (
              <Card className="p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-2">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">
                      Accounts Receivable & Inbound Bank Wire Verification
                    </h3>
                    <p className="text-[11px] text-[#64748B]">
                      Verified client deposits, bank auto financing facility releases, and trade-in top-up wires
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#0F172A]">
                    Total Outstanding Receivables: <strong className="text-[#1D4ED8]">$382,000</strong>
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {receivablesList.map((rec) => (
                    <Card
                      key={rec.id}
                      className="p-3 bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#2563EB] shadow-none flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#2563EB]">{rec.id}</span>
                          <span className="font-bold text-[#0F172A]">{rec.client}</span>
                        </div>
                        <span className="text-[#64748B] text-[11px] block">
                          Vehicle Allocation: <strong className="text-[#0F172A]">{rec.car}</strong> &bull; Bank: {rec.bank} &bull; Wire Ref: <span className="font-mono">{rec.wireRef}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <span className="font-mono font-bold text-[#1D4ED8] text-sm">{rec.balance}</span>
                        <Badge variant={rec.status.includes("Reconciled") ? "gold" : "outline"} size="sm">
                          {rec.status}
                        </Badge>
                        {rec.status !== "Reconciled to General Ledger" ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setReceivablesList((prev) =>
                                prev.map((r) =>
                                  r.id === rec.id ? { ...r, status: "Reconciled to General Ledger" } : r
                                )
                              );
                              showToast(`Inbound wire ${rec.wireRef} (${rec.balance}) confirmed and posted to General Ledger.`);
                            }}
                            leftIcon={<FiCheckCircle className="w-3.5 h-3.5" />}
                          >
                            Verify Wire
                          </Button>
                        ) : (
                          <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                            Reconciled to GL
                          </span>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            )}

            {/* TAB 4: TAX & 7.5% VAT COMPLIANCE */}
            {accountingTab === "tax" && (
              <Card className="p-4 sm:p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-2">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">
                      Federal Tax, 7.5% VAT Remittance & Withholding Compliance
                    </h3>
                    <p className="text-[11px] text-[#64748B]">
                      Statutory tax deductions, VAT input-output offsets, and Federal Inland Revenue Service (FIRS) filing schedule
                    </p>
                  </div>
                  <Badge variant="gold" size="sm">FIRS Tax Clearance Active</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0]">
                    <span className="text-[#64748B] block text-[10px] uppercase">Taxable Sales Turnover</span>
                    <div className="text-base font-bold font-mono text-[#0F172A] mt-0.5">$3,420,000</div>
                    <span className="text-[10px] text-[#2563EB]">18 Luxury Units</span>
                  </div>
                  <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0]">
                    <span className="text-[#64748B] block text-[10px] uppercase">Output VAT (7.5%)</span>
                    <div className="text-base font-bold font-mono text-[#0F172A] mt-0.5">$256,500</div>
                    <span className="text-[10px] text-[#2563EB]">Customer Invoices</span>
                  </div>
                  <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0]">
                    <span className="text-[#64748B] block text-[10px] uppercase">Input VAT Offset</span>
                    <div className="text-base font-bold font-mono text-[#0F172A] mt-0.5">-$82,400</div>
                    <span className="text-[10px] text-emerald-600">Port & Supplier Claims</span>
                  </div>
                  <div className="p-3 bg-[#EFF6FF] rounded-md border border-[#BFDBFE]">
                    <span className="text-[#1D4ED8] block text-[10px] uppercase font-bold">Net VAT Due FIRS</span>
                    <div className="text-base font-bold font-mono text-[#1D4ED8] mt-0.5">$174,100</div>
                    <span className="text-[10px] text-[#1D4ED8] font-bold">Remittance Approved</span>
                  </div>
                </div>

                <div className="p-3.5 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-[#0F172A] block">FIRS Electronic Tax Filing Docket: FIRS-TX-2026-NOV-8810</span>
                    <span className="text-[11px] text-[#64748B]">
                      Tax Clearance Certificate No: TCC-2026-NIG-098 &bull; Withholding Tax (WHT) Deducted: $18,400
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => showToast("Downloading FIRS Tax Schedule & VAT Remittance PDF...")}
                    leftIcon={<FiDownload className="w-3.5 h-3.5 text-[#2563EB]" />}
                  >
                    Download Tax Schedule (PDF)
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE: HR, STAFF & APPLICANT TRACKER [ERP-15]                    */}
        {/* ================================================================= */}
        {activeModule === "HR & Recruitment" && (
          <div className="space-y-4">
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E2E8F0]">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">
                    Public Career Applications & Recruitment Pipeline
                  </h3>
                  <p className="text-[11px] text-[#64748B]">Direct applicants submitted through the public /careers job board</p>
                </div>
                <Badge variant="gold" size="sm">5 Candidates Under Review</Badge>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { name: "Chibuike Okafor", role: "Senior VIP Luxury Sales Executive", appliedDate: "2026-11-04", exp: "8 Years Auto Sales", status: "Interview Scheduled", resume: "Chibuike_CV.pdf" },
                  { name: "Fatima Al-Hassan", role: "Customs & Port Logistics Specialist", appliedDate: "2026-11-03", exp: "5 Years Tin Can Clearing", status: "Shortlisted", resume: "Fatima_Resume.pdf" },
                  { name: "Tariq Danladi", role: "Senior Master Certified Technician", appliedDate: "2026-11-01", exp: "12 Years Porsche/Mercedes Diagnostic", status: "Technical Assessment", resume: "Tariq_Certificates.pdf" },
                  { name: "Grace Adebayo", role: "Digital Automotive Marketing Lead", appliedDate: "2026-10-29", exp: "6 Years Automotive Content", status: "Application Received", resume: "Grace_Portfolio.pdf" },
                ].map((cand, ci) => (
                  <div key={ci} className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <div className="font-bold text-[#0F172A] text-sm">{cand.name}</div>
                      <span className="text-[#2563EB] font-semibold">{cand.role}</span>
                      <span className="text-[#64748B] text-[11px] block">Applied: {cand.appliedDate} &bull; Experience: {cand.exp}</span>
                    </div>
                    <div className="flex items-center gap-2.5 self-end sm:self-auto">
                      <button
                        onClick={() => showToast(`Reviewing resume: ${cand.resume}`)}
                        className="px-2.5 py-1 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] hover:bg-[#2563EB] hover:text-[#FFFFFF] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        View CV
                      </button>
                      <Badge variant="gold" size="sm">{cand.status}</Badge>
                      <button
                        onClick={() => showToast(`Interview link dispatched to ${cand.name}`)}
                        className="px-2.5 py-1 rounded-md bg-[#2563EB] text-white hover:bg-[#1D4ED8] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Schedule Interview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE: ROLES & RBAC [ERP-16]                                     */}
        {/* ================================================================= */}
        {activeModule === "Roles & RBAC" && (
          <div className="space-y-4">
            {/* Top Provisioning Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
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
                value="Admin Auth Only"
                change="Zero Public Self-Registration"
                icon={<FiLock className="w-5 h-5 text-[#2563EB]" />}
              />
            </div>

            {/* Department Accounts Directory & Creation Console */}
            <Card className="p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">
                      Department Staff Account Provisioning Console
                    </h3>
                    <Badge variant="gold" size="sm">Admin Provisioned Only</Badge>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    Super Admin master directory: Create department accounts, issue isolated credentials, and audit department access boundaries.
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsCreateAccountModalOpen(true)}
                  leftIcon={<FiUserPlus className="w-4 h-4 text-white" />}
                >
                  + Create Department Account
                </Button>
              </div>

              {/* Staff Accounts Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-[10px] uppercase font-bold text-[#64748B] border-b border-[#E2E8F0]">
                    <tr>
                      <th className="py-2.5 px-3">Staff Identity</th>
                      <th className="py-2.5 px-3">Authorized Department</th>
                      <th className="py-2.5 px-3">Showroom / Facility Node</th>
                      <th className="py-2.5 px-3">Clearance Tier</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {staffAccounts.map((account) => (
                      <tr key={account.id} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center font-bold text-[#2563EB] text-xs shrink-0">
                              {account.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <div className="font-bold text-[#0F172A]">{account.name}</div>
                              <div className="text-[11px] font-mono text-[#64748B]">{account.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-[#2563EB]">{account.departmentName}</span>
                          <span className="text-[10px] text-[#64748B] block font-mono">Module: {account.dashboardModule}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-[#475569]">{account.branch}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-mono text-[10px] text-[#0F172A] font-semibold bg-[#F1F5F9] px-2 py-0.5 rounded border border-[#E2E8F0]">
                            {account.accessLevel}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <Badge variant={account.status === "Active" ? "gold" : "charcoal"} size="sm">
                            {account.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                handleRoleChange(account.departmentId);
                                setActiveModule(account.dashboardModule);
                                showToast(`Admin context switched to ${account.name} (${account.departmentName}).`);
                              }}
                              className="text-[11px] py-1 px-2.5"
                            >
                              Open Dashboard
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleStaffStatus(account.id)}
                              className="text-[11px] py-1 px-2 text-[#64748B] hover:text-[#DC2626]"
                            >
                              {account.status === "Active" ? "Suspend" : "Activate"}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Department Isolation Policy Matrix */}
            <Card className="p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB] flex items-center gap-2">
                    <FiShield className="w-4 h-4 text-[#2563EB]" />
                    <span>Cross-Department Isolation & Need-to-Know Boundary Matrix</span>
                  </h3>
                  <p className="text-[11px] text-[#64748B]">Automated cryptographic boundary: no department dashboard may access or display unauthorized domain data.</p>
                </div>
                <Badge variant="gold" size="sm">Strict Separation</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {[
                  {
                    dept: "Accounting & Treasury",
                    scope: "FOB Landed margins, Wire audits, AP disbursements, 7.5% VAT compliance.",
                    restricted: "NO workshop bay assignments, NO customer lead notes.",
                  },
                  {
                    dept: "Showroom Sales & Orders",
                    scope: "Quotes, invoices, test drives, order delivery handover, deposit tracking.",
                    restricted: "NO wholesale purchase landed cost, NO mechanic repair orders.",
                  },
                  {
                    dept: "Master Workshop & Service",
                    scope: "Repair orders, 150-point PDI checklists, bay scheduling, technician hours.",
                    restricted: "NO customer bank wires, NO executive P&L, NO sales commissions.",
                  },
                  {
                    dept: "Spare Parts & Inventory",
                    scope: "OEM part numbers, bin storage racks, stock levels, workshop requisitions.",
                    restricted: "NO car sales contracts, NO customer credit ratings.",
                  },
                  {
                    dept: "Import Logistics & Customs",
                    scope: "Bill of lading, shipping lines, Tin Can port SGD duty declarations, VIN clearing.",
                    restricted: "NO retail vehicle margins, NO workshop maintenance checklists.",
                  },
                  {
                    dept: "Trade-In & Appraisals",
                    scope: "Offered vehicle condition, paint depth gauge, OBD scan, balance settlement.",
                    restricted: "NO company bank treasury balances, NO payroll or HR records.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-1.5">
                    <div className="font-bold text-[#0F172A] flex items-center justify-between">
                      <span>{item.dept}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Authorized Scope:</span>
                      <p className="text-[11px] text-[#475569]">{item.scope}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">Strictly Excluded:</span>
                      <p className="text-[11px] text-[#94A3B8] font-mono">{item.restricted}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE: DOCUMENT VAULT [ERP-17]                                   */}
        {/* ================================================================= */}
        {activeModule === "Document Vault" && (
          <div className="space-y-4">
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E2E8F0]">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">Dealership Document Vault</h3>
                  <p className="text-[11px] text-[#64748B]">Cryptographically watermarked titles, customs SGDs, and delivery inspection sheets</p>
                </div>
                <Button variant="outline" size="sm" leftIcon={<FiDownload className="w-3.5 h-3.5 text-[#2563EB]" />}>
                  Upload Document
                </Button>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { name: "Single Goods Declaration (SGD) - Port of Lagos Release", car: "Maybach S580 (VIN: WDD223...)", type: "Customs Duty Certificate", date: "2026-11-02", size: "2.1 MB PDF" },
                  { name: "150-Point Pre-Delivery Inspection (PDI) Health Seal", car: "Porsche 911 Turbo S (VIN: WP0AD2...)", type: "Diagnostic Inspection", date: "2026-11-01", size: "3.4 MB PDF" },
                  { name: "Certificate of Ownership & Title Registration", car: "Range Rover Autobiography (VIN: SALWR2...)", type: "Title Document", date: "2026-10-28", size: "1.9 MB PDF" },
                  { name: "Marine Cargo Bill of Lading (B/L) - Antwerp Discharge", car: "Ferrari 296 GTB (VIN: ZFF88...)", type: "Bill of Lading", date: "2026-10-24", size: "1.6 MB PDF" },
                ].map((doc, di) => (
                  <div key={di} className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB]">
                        <FiFileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-[#0F172A]">{doc.name}</div>
                        <span className="text-[10px] text-[#64748B] block">{doc.car} &bull; {doc.type} &bull; {doc.size}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        downloadVaultDocumentPdf({
                          title: doc.name,
                          reference: doc.car,
                          classification: "Dealership Restricted Vault",
                          date: doc.date,
                          details: `${doc.type} • File Size: ${doc.size}`,
                          author: "Compliance & Legal Records Division",
                        })
                      }
                      className="px-3 py-1.5 rounded-md bg-[#2563EB] text-[#FFFFFF] hover:bg-[#1D4ED8] text-xs font-semibold self-start sm:self-auto transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <FiDownload className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE: CONTENT MANAGEMENT SYSTEM (CMS) [ERP-18]                  */}
        {/* ================================================================= */}
        {activeModule === "CMS Manager" && (
          <div className="space-y-4">
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 sm:p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">Website Content & Promotions Manager</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-2">
                  <span className="font-bold text-[#0F172A] block">Homepage Hero Headline</span>
                  <Input defaultValue="DRIVE YOUR DREAM CAR" />
                  <Button variant="primary" size="sm">Update Hero</Button>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-2">
                  <span className="font-bold text-[#0F172A] block">Featured Showcase Cars</span>
                  <Dropdown
                    label="Pinned Vehicle"
                    options={[
                      { label: "Mercedes Maybach S580", value: "STK-2026-001" },
                      { label: "Porsche 911 Turbo S", value: "STK-2026-002" },
                    ]}
                    onChange={() => {}}
                  />
                  <Button variant="outline" size="sm">Pin to Featured</Button>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-2">
                  <span className="font-bold text-[#0F172A] block">Publish Announcement</span>
                  <Input placeholder="Headline..." />
                  <Button variant="primary" size="sm">Publish to News</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE: SETTINGS & BRANCH CONFIG                                  */}
        {/* ================================================================= */}
        {activeModule === "Settings" && (
          <div className="space-y-4">
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 sm:p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#2563EB]">Platform & Branch Configurations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-2">
                  <span className="font-bold text-[#0F172A] block">Financial Parameters</span>
                  <Input label="USD to NGN Exchange Rate" defaultValue="1500" />
                  <Input label="VAT / Sales Tax (%)" defaultValue="7.5" />
                  <Input label="Reservation Deposit Lockout (Hours)" defaultValue="48" />
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-2">
                  <span className="font-bold text-[#0F172A] block">Showroom Hubs</span>
                  <div className="space-y-1.5 text-[11px] text-[#475569]">
                    <div className="p-2 bg-[#FFFFFF] rounded-md border border-[#E2E8F0] flex justify-between shadow-xs">
                      <span>Lagos Victoria Island (HQ Flagship)</span>
                      <Badge variant="gold" size="sm">Active</Badge>
                    </div>
                    <div className="p-2 bg-[#FFFFFF] rounded-md border border-[#E2E8F0] flex justify-between shadow-xs">
                      <span>Abuja Maitama Diplomatic Suite</span>
                      <Badge variant="gold" size="sm">Active</Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <Button variant="primary" size="sm" onClick={() => showToast("Settings saved successfully!")}>
                  Save System Parameters
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE: MY PROFILE & CREDENTIALS                                   */}
        {/* ================================================================= */}
        {activeModule === "My Profile" && (
          <div className="space-y-4">
            {/* Header Profile Summary Card */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#EFF6FF] border-2 border-[#BFDBFE] flex items-center justify-center font-bold text-[#2563EB] text-xl shadow-xs">
                    {activeRole.userInitials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-[#0F172A]">{activeRole.userName}</h3>
                      <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Online & Verified
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] flex items-center gap-1.5 mt-0.5">
                      <FiMail className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>{activeRole.email}</span>
                      <span>&bull;</span>
                      <span className="font-mono text-[#2563EB] font-bold">{activeRole.badge}</span>
                    </p>
                    <p className="text-[11px] text-[#94A3B8] mt-1">
                      Assigned Department: <strong className="text-[#475569]">{activeRole.department}</strong> &bull; {activeRole.branchName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-stretch sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setActiveModule("Session History")}
                    className="flex-1 sm:flex-none px-3 py-1.5 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] hover:bg-[#2563EB] hover:text-[#FFFFFF] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FiClock className="w-3.5 h-3.5" />
                    <span>View Session History</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Grid Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Personnel Dossier */}
              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-2">
                    <FiUser className="w-4 h-4 text-[#2563EB]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Dealership Personnel Dossier</h4>
                  </div>
                  <Badge variant="gold" size="sm">Active Staff</Badge>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-[#F1F5F9]">
                    <span className="text-[#64748B]">Full Staff Name</span>
                    <span className="font-bold text-[#0F172A]">{activeRole.userName}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#F1F5F9]">
                    <span className="text-[#64748B]">Work Email Address</span>
                    <span className="font-mono font-medium text-[#2563EB]">{activeRole.email}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#F1F5F9]">
                    <span className="text-[#64748B]">Assigned Department</span>
                    <span className="font-semibold text-[#0F172A]">{activeRole.department}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#F1F5F9]">
                    <span className="text-[#64748B]">Showroom Flagship Hub</span>
                    <span className="font-medium text-[#0F172A]">{activeRole.branchName}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#F1F5F9]">
                    <span className="text-[#64748B]">Internal Telephone Ext.</span>
                    <span className="font-mono text-[#0F172A]">+234 1 888 2000 (Ext. 402)</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-[#64748B]">Authorized Modules</span>
                    <span className="font-mono font-bold text-[#1D4ED8] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                      {activeRole.allowedModules.length} Modules Authorized
                    </span>
                  </div>
                </div>
              </div>

              {/* Security & Multi-Factor Authentication */}
              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-2">
                    <FiLock className="w-4 h-4 text-[#2563EB]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Security, MFA & Access Controls</h4>
                  </div>
                  <Badge variant="gold" size="sm">MFA Enforced</Badge>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9]">
                    <div>
                      <div className="font-semibold text-[#0F172A]">Two-Factor Authentication (2FA)</div>
                      <div className="text-[10px] text-[#64748B]">FIDO2 WebAuthn & Hardware Security Key</div>
                    </div>
                    <span className="font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[10px]">
                      Enabled & Verified
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9]">
                    <div>
                      <div className="font-semibold text-[#0F172A]">Credential Rotation</div>
                      <div className="text-[10px] text-[#64748B]">Last updated 14 days ago (90-day cycle)</div>
                    </div>
                    <span className="font-mono text-[10px] text-[#2563EB] font-bold">Compliant</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9]">
                    <div>
                      <div className="font-semibold text-[#0F172A]">Session Encryption Protocol</div>
                      <div className="text-[10px] text-[#64748B]">TLS 1.3 / AES-256-GCM / Strict-Transport</div>
                    </div>
                    <span className="font-mono text-[10px] text-[#1D4ED8] bg-[#EFF6FF] px-1.5 py-0.5 rounded font-bold">
                      AES-256
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5">
                    <div>
                      <div className="font-semibold text-[#0F172A]">Compliance Audit Trail</div>
                      <div className="text-[10px] text-[#64748B]">WORM Storage with SHA-256 integrity seal</div>
                    </div>
                    <span className="font-mono text-[10px] text-emerald-600 font-bold">WORM Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODULE: IMMUTABLE LOGIN & LOGOUT SESSION AUDIT HISTORY (WORM)     */}
        {/* ================================================================= */}
        {activeModule === "Session History" && (
          <div className="space-y-4">
            {/* Header Description & WORM Notice */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-4 sm:p-5 shadow-xs space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB]">
                    <FiClock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">
                      Immutable Login & Logout Session Audit Ledger
                    </h3>
                    <p className="text-[11px] text-[#64748B]">
                      Write-Once-Read-Many (WORM) cryptographic audit trail. Records cannot be edited, tampered with, or erased.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  <span className="px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-bold flex items-center gap-1.5">
                    <FiShield className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WORM Enforced &bull; Read-Only</span>
                  </span>
                </div>
              </div>
            </div>

            {/* KPI Cards for Session Telemetry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <KPICard
                title="Total Recorded Sessions"
                value={`${INITIAL_SESSION_LOGS.length} Logged`}
                change="All dealership roles"
                icon={<FiLayers className="w-4 h-4" />}
              />
              <KPICard
                title="Active Sessions Now"
                value={`${INITIAL_SESSION_LOGS.filter((s) => !s.logoutTime).length} Live`}
                change="Authenticated TLS 1.3"
                icon={<FiUsers className="w-4 h-4" />}
              />
              <KPICard
                title="MFA Verification"
                value="100%"
                change="Hardware & FIDO2 enforced"
                icon={<FiLock className="w-4 h-4" />}
              />
              <KPICard
                title="Integrity Verification"
                value="SHA-256"
                change="Zero tampering detected"
                icon={<FiCheckCircle className="w-4 h-4" />}
              />
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md p-3.5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 bg-[#F8FAFC] px-3 py-1.5 border border-[#CBD5E1] rounded-md flex-1 max-w-md focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB]">
                <FiSearch className="w-3.5 h-3.5 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Filter by Session ID, staff, IP, email..."
                  value={sessionSearch}
                  onChange={(e) => setSessionSearch(e.target.value)}
                  className="bg-transparent outline-none text-xs text-[#0F172A] placeholder-[#94A3B8] w-full"
                />
              </div>

              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                {(["all", "active", "terminated"] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setSessionFilter(filter)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold capitalize transition-all cursor-pointer ${
                      sessionFilter === filter
                        ? "bg-[#2563EB] text-[#FFFFFF]"
                        : "bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]"
                    }`}
                  >
                    {filter === "all" ? "All Sessions" : filter === "active" ? "Active Now" : "Terminated"}
                  </button>
                ))}
              </div>
            </div>

            {/* Session Ledger Table - Well-arranged columns, no broken text, horizontal scroll support */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-md shadow-xs overflow-hidden">
              <div className="w-full overflow-x-auto scrollbar-thin">
                <table className="min-w-full text-left text-xs border-collapse">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#64748B]">
                    <tr>
                      <th className="py-3.5 px-4 whitespace-nowrap">Session & SHA-256</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">Staff User & Role</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">Network IP & Location</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">Device & Browser</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">Login / Logout</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">Duration</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">MFA Status</th>
                      <th className="py-3.5 px-4 whitespace-nowrap text-right">Telemetry</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {filteredSessions.map((session) => (
                      <tr key={session.id} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-mono font-bold text-[#2563EB]">{session.id}</div>
                          <div className="font-mono text-[9px] text-[#94A3B8] truncate max-w-[130px]" title={session.checksum}>
                            {session.checksum.substring(0, 16)}...
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-bold text-[#0F172A]">{session.userName}</div>
                          <div className="text-[10px] text-[#64748B] font-mono">{session.email}</div>
                          <div className="text-[9px] font-mono font-bold text-[#1D4ED8] mt-0.5">{session.role}</div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-mono font-semibold text-[#0F172A] flex items-center gap-1">
                            <FiMapPin className="w-3 h-3 text-[#2563EB] shrink-0" />
                            <span>{session.ipAddress}</span>
                          </div>
                          <div className="text-[10px] text-[#64748B]">{session.location}</div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-semibold text-[#0F172A]">{session.device}</div>
                          <div className="text-[10px] text-[#64748B]">{session.browser}</div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px]">
                          <div className="text-[#0F172A]">In: {session.loginTime}</div>
                          {session.logoutTime ? (
                            <div className="text-[#64748B]">Out: {session.logoutTime}</div>
                          ) : (
                            <div className="text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Active Session
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] font-bold text-[#475569]">
                          {session.duration}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {session.mfaMethod ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded" title={session.mfaMethod}>
                              <FiCheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                              FIDO2 Verified
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#94A3B8]">Standard</span>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedSessionForInspection(session)}
                            className="px-2.5 py-1 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] hover:bg-[#2563EB] hover:text-[#FFFFFF] text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
                            title="Inspect Complete Audit Telemetry Dossier"
                          >
                            <FiEye className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
      )}

      {/* Add New Vehicle Modal */}
      <Modal
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
        size="lg"
        title="Register New Vehicle to Stock"
        description="Add a new luxury vehicle to inventory for internal valuation and public listing."
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddVehicleOpen(false)}
              leftIcon={<FiX className="w-3.5 h-3.5 text-[#64748B]" />}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                showToast("New vehicle submitted to Inventory Master Table with 'Draft Inspection' status.");
                setIsAddVehicleOpen(false);
              }}
              leftIcon={<FiCheck className="w-3.5 h-3.5 text-[#FFFFFF]" />}
            >
              Save Vehicle Record
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input label="Make (Brand)" placeholder="e.g. Mercedes-Benz" required />
            <Input label="Model & Trim" placeholder="e.g. S580 4MATIC Maybach" required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <Input label="Model Year" placeholder="2026" required />
            <Input label="Chassis / VIN" placeholder="WDD223..." required />
            <Input label="Mileage (KM)" placeholder="1,500" required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input label="FOB Purchase Price ($)" placeholder="118500" required />
            <Input label="Target Showroom Price ($)" placeholder="165000" required />
          </div>
          <Dropdown
            label="Initial Allocation Hub"
            options={[
              { label: "Victoria Island HQ Flagship, Lagos", value: "Lagos" },
              { label: "Maitama Diplomatic Zone, Abuja", value: "Abuja" },
              { label: "Tin Can Port Transit Holding Bay", value: "Tin Can" },
            ]}
            onChange={() => {}}
          />
        </div>
      </Modal>

      {/* Dispatch Branch Transfer Modal */}
      <Modal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        size="lg"
        title="Dispatch Inter-Branch Carrier"
        description="Create an authorized vehicle carrier transport manifest between showroom locations."
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTransferModalOpen(false)}
              leftIcon={<FiX className="w-3.5 h-3.5 text-[#64748B]" />}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                showToast("Carrier dispatch authorized. Tracking number assigned.");
                setIsTransferModalOpen(false);
              }}
              leftIcon={<FiTruck className="w-3.5 h-3.5 text-[#FFFFFF]" />}
            >
              Authorize Carrier Dispatch
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Dropdown
            label="Select Vehicle from Stock"
            options={VEHICLES.map((v) => ({ label: `${v.stockId} - ${v.make} ${v.model}`, value: v.stockId }))}
            onChange={() => {}}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Dropdown
              label="Source Showroom"
              options={[
                { label: "Lagos Victoria Island HQ", value: "Lagos" },
                { label: "Abuja Maitama Diplomatic Suite", value: "Abuja" },
              ]}
              onChange={() => {}}
            />
            <Dropdown
              label="Destination Showroom"
              options={[
                { label: "Abuja Maitama Diplomatic Suite", value: "Abuja" },
                { label: "Lagos Victoria Island HQ", value: "Lagos" },
              ]}
              onChange={() => {}}
            />
          </div>
          <Input label="Assigned Carrier / Hauler Service" placeholder="e.g. Swift Luxury Flatbed Logistics" required />
          <Input label="Driver Name & Contact Number" placeholder="e.g. Musa Danladi (+234 803 111 2222)" required />
        </div>
      </Modal>

      {/* 1. Order Preview Modal (Direct Modal - No Redirect, Spacious Size) */}
      {selectedOrderForPreview && (
        <Modal
          isOpen={!!selectedOrderForPreview}
          onClose={() => setSelectedOrderForPreview(null)}
          size="xl"
          title={`Order Dossier: ${selectedOrderForPreview.id}`}
          description="Customer Sales Contract & Showroom Allocation"
          footer={
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const ord = selectedOrderForPreview;
                  setSelectedOrderForPreview(null);
                  setSelectedOrderForInspection(ord);
                }}
                leftIcon={<FiCheckSquare className="w-3.5 h-3.5 text-[#2563EB]" />}
              >
                Inspect 150-Point PDI
              </Button>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleDownloadOrderPdf(selectedOrderForPreview)}
                  leftIcon={<FiDownload className="w-3.5 h-3.5 text-[#FFFFFF]" />}
                >
                  Download Sales PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOrderForPreview(null)}
                  leftIcon={<FiX className="w-3.5 h-3.5 text-[#64748B]" />}
                >
                  Close
                </Button>
              </div>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#2563EB] text-base">{selectedOrderForPreview.id}</span>
                <Badge variant="gold" size="sm">{selectedOrderForPreview.status}</Badge>
              </div>
              <div className="text-[#0F172A] font-bold text-base">{selectedOrderForPreview.car}</div>
              <div className="text-xs text-[#64748B] font-mono flex flex-wrap gap-x-3 gap-y-1">
                <span>VIN: <strong className="text-[#0F172A]">{selectedOrderForPreview.vin || "WDD223847291001"}</strong></span>
                <span>&bull;</span>
                <span>Stage: <strong className="text-[#0F172A]">{selectedOrderForPreview.stage}</strong></span>
                <span>&bull;</span>
                <span>Rep: <strong className="text-[#0F172A]">{selectedOrderForPreview.rep}</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#FFFFFF] rounded-md border border-[#E2E8F0] space-y-2 shadow-xs">
                <span className="font-bold text-[#0F172A] block uppercase text-[10px] tracking-wider text-[#64748B]">Buyer Information</span>
                <div className="font-bold text-[#0F172A] text-sm">{selectedOrderForPreview.client}</div>
                <div className="text-xs text-[#64748B] flex justify-between">
                  <span>Assigned Specialist:</span>
                  <strong className="text-[#0F172A]">{selectedOrderForPreview.rep}</strong>
                </div>
                <div className="text-xs text-[#64748B] flex justify-between">
                  <span>Estimated Delivery Date:</span>
                  <span className="font-mono font-bold text-[#0F172A]">{selectedOrderForPreview.deliveryDate || "2026-11-20"}</span>
                </div>
              </div>

              <div className="p-4 bg-[#FFFFFF] rounded-md border border-[#E2E8F0] space-y-2 shadow-xs">
                <span className="font-bold text-[#0F172A] block uppercase text-[10px] tracking-wider text-[#64748B]">Financial Breakdown</span>
                <div className="flex justify-between text-xs">
                  <span className="text-[#64748B]">Agreed Retail Price:</span>
                  <span className="font-mono font-bold text-[#1D4ED8] text-sm">{selectedOrderForPreview.amount}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#64748B]">Committed Escrow Deposit:</span>
                  <span className="font-mono font-semibold text-[#0F172A]">{selectedOrderForPreview.deposit || "$50,000"}</span>
                </div>
                <div className="flex justify-between border-t border-[#E2E8F0] pt-1.5 text-xs">
                  <span className="text-[#64748B] font-semibold">Remaining Balance Due:</span>
                  <span className="font-mono font-bold text-[#0F172A]">{selectedOrderForPreview.balance || "$0"}</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#1D4ED8]">
              <strong>Dealership Escrow Security:</strong> Funds verified under Central Bank AML guidelines. Physical vehicle release authorized following lead technician PDI sign-off.
            </div>
          </div>
        </Modal>
      )}

      {/* 2. Order 150-Point Inspection Modal (Direct Modal - Spacious 2-Column Grid) */}
      {selectedOrderForInspection && (
        <Modal
          isOpen={!!selectedOrderForInspection}
          onClose={() => setSelectedOrderForInspection(null)}
          size="xl"
          title={`150-Point PDI Inspection Sheet: ${selectedOrderForInspection.id}`}
          description={`Master Mechanical & Diagnostic Certification for ${selectedOrderForInspection.car}`}
          footer={
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 w-full">
              <span className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-md font-bold">
                PDI Status: 100% Certified Pass
              </span>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleDownloadOrderPdf(selectedOrderForInspection)}
                  leftIcon={<FiDownload className="w-3.5 h-3.5 text-[#FFFFFF]" />}
                >
                  Download Certified PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOrderForInspection(null)}
                  leftIcon={<FiX className="w-3.5 h-3.5 text-[#64748B]" />}
                >
                  Close
                </Button>
              </div>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-mono font-bold text-[#2563EB] text-sm">{selectedOrderForInspection.id}</span>
                <span className="font-bold text-[#0F172A] text-sm ml-2">{selectedOrderForInspection.car}</span>
                <span className="text-xs text-[#64748B] block mt-0.5">
                  VIN: {selectedOrderForInspection.vin || "WDD223...001"} &bull; Inspector: <strong>Engr. Tunde B. (Lead Master Diagnostic Tech)</strong>
                </span>
              </div>
              <Badge variant="gold" size="sm">Score: 99.4 / 100</Badge>
            </div>

            <div className="space-y-2.5">
              <span className="font-bold text-[#0F172A] block uppercase text-[10px] tracking-wider text-[#64748B]">
                Key Diagnostic Checkpoints (150-Point Factory Standard)
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { title: "Powertrain & Dual-Clutch Transmission", desc: "Zero stored DTC error codes, fluid pressure verified, dyno shift timing nominal.", status: "PASSED" },
                  { title: "Dynamic Air Suspension & Leveling", desc: "4-corner air struts calibrated to OEM ride height tolerances at 100km/h simulation.", status: "PASSED" },
                  { title: "Carbon-Ceramic & High-Performance ABS", desc: "Pad thickness 98.5%, brake line pressure verified, zero rotor runout.", status: "PASSED" },
                  { title: "ECU Firmware & Radar ADAS Calibration", desc: "Level-2+ driver assistance cameras and radar sensors laser aligned.", status: "PASSED" },
                  { title: "360-Degree Paint Depth & Coating", desc: "Laser micrometer: 114 - 128 microns throughout. 9H ceramic topcoat verified.", status: "PASSED" },
                  { title: "Cabin Sanitization & Leather Conditioning", desc: "Ozone purification complete, Nappa leather nourished, zero cabin blemishes.", status: "PASSED" },
                ].map((pt, idx) => (
                  <div key={idx} className="p-3 bg-[#FFFFFF] rounded-md border border-[#E2E8F0] flex items-center justify-between gap-2.5 shadow-xs">
                    <div>
                      <div className="font-bold text-[#0F172A] text-xs">{pt.title}</div>
                      <div className="text-[11px] text-[#64748B] mt-0.5">{pt.desc}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 shrink-0">
                      {pt.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* 3. Vehicle Specification Dossier Preview Modal (Spacious Side-by-Side) */}
      {selectedVehicleForPreview && (
        <Modal
          isOpen={!!selectedVehicleForPreview}
          onClose={() => setSelectedVehicleForPreview(null)}
          size="xl"
          title={`Vehicle Specification Dossier: ${selectedVehicleForPreview.stockId}`}
          description={`${selectedVehicleForPreview.year} ${selectedVehicleForPreview.make} ${selectedVehicleForPreview.model}`}
          footer={
            <div className="flex items-center justify-between w-full">
              <Link href={`/inventory/${selectedVehicleForPreview.stockId}`}>
                <Button variant="outline" size="sm" leftIcon={<FiEye className="w-3.5 h-3.5 text-[#2563EB]" />}>
                  Open Full Showroom VDP
                </Button>
              </Link>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedVehicleForPreview(null)}
                leftIcon={<FiX className="w-3.5 h-3.5 text-white" />}
              >
                Close Preview
              </Button>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Left Column: Vehicle Image & Badges */}
            <div className="space-y-3">
              <div className="relative h-56 w-full rounded-md overflow-hidden border border-[#CBD5E1] bg-[#0F172A]">
                <Image
                  src={selectedVehicleForPreview.image}
                  alt={selectedVehicleForPreview.model}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2.5 right-2.5">
                  <Badge variant="gold" size="sm" dot>
                    {selectedVehicleForPreview.status}
                  </Badge>
                </div>
                <div className="absolute bottom-2.5 left-2.5 bg-[#0F172A]/90 backdrop-blur-xs text-[#FFFFFF] px-3 py-1.5 rounded text-xs font-mono font-bold">
                  ${selectedVehicleForPreview.priceUSD.toLocaleString()} USD &bull; ₦{selectedVehicleForPreview.priceNGN.toLocaleString()} NGN
                </div>
              </div>

              <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">Chassis & VIN Verification</span>
                <div className="font-mono text-xs text-[#0F172A] font-bold">VIN: {selectedVehicleForPreview.vin || "W1N9G8EJ6PA...041"}</div>
                <div className="text-[11px] text-[#64748B]">Showroom Hub: {selectedVehicleForPreview.location}</div>
              </div>
            </div>

            {/* Right Column: Technical Specifications & Highlights */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 bg-[#F8FAFC] rounded-md border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[9px] uppercase font-bold">Year</span>
                  <span className="font-bold text-[#0F172A] text-xs">{selectedVehicleForPreview.year}</span>
                </div>
                <div className="p-2.5 bg-[#F8FAFC] rounded-md border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[9px] uppercase font-bold">Mileage</span>
                  <span className="font-bold text-[#0F172A] text-xs font-mono">{selectedVehicleForPreview.mileage.toLocaleString()} KM</span>
                </div>
                <div className="p-2.5 bg-[#F8FAFC] rounded-md border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[9px] uppercase font-bold">Transmission</span>
                  <span className="font-bold text-[#0F172A] text-xs">{selectedVehicleForPreview.transmission}</span>
                </div>
                <div className="p-2.5 bg-[#F8FAFC] rounded-md border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[9px] uppercase font-bold">Fuel Type</span>
                  <span className="font-bold text-[#0F172A] text-xs">{selectedVehicleForPreview.fuel}</span>
                </div>
                <div className="p-2.5 bg-[#F8FAFC] rounded-md border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[9px] uppercase font-bold">Exterior Color</span>
                  <span className="font-bold text-[#0F172A] text-xs">{selectedVehicleForPreview.exteriorColor}</span>
                </div>
                <div className="p-2.5 bg-[#F8FAFC] rounded-md border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[9px] uppercase font-bold">Interior Trim</span>
                  <span className="font-bold text-[#0F172A] text-xs">{selectedVehicleForPreview.interiorColor}</span>
                </div>
                <div className="p-2.5 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] col-span-2">
                  <span className="text-[#64748B] block text-[9px] uppercase font-bold">Engine & Output</span>
                  <span className="font-bold text-[#0F172A] text-xs truncate block">{selectedVehicleForPreview.engine}</span>
                </div>
              </div>

              {/* Key Features */}
              <div className="space-y-1.5">
                <span className="font-bold text-[#0F172A] block uppercase text-[10px] tracking-wider text-[#64748B]">Equipment Highlights</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedVehicleForPreview.features.slice(0, 8).map((f) => (
                    <span key={f} className="px-2 py-0.5 rounded text-[10px] bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] font-medium">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* 4. Trade-In Appraisal & Condition Sheet Modal */}
      {selectedTradeInForInspection && (
        <Modal
          isOpen={!!selectedTradeInForInspection}
          onClose={() => setSelectedTradeInForInspection(null)}
          size="lg"
          title={`Trade-In Appraisal & Condition Sheet: ${selectedTradeInForInspection.id}`}
          description={`Customer Trade-In Evaluation for ${selectedTradeInForInspection.client}`}
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-mono text-[#2563EB] font-bold">
                Valuation: {selectedTradeInForInspection.valuation}
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedTradeInForInspection(null)}
                leftIcon={<FiX className="w-3.5 h-3.5 text-white" />}
              >
                Close Appraisal Sheet
              </Button>
            </div>
          }
        >
          <div className="space-y-3.5 text-xs">
            <div className="p-3.5 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#2563EB] text-sm">{selectedTradeInForInspection.id}</span>
                <Badge variant="gold" size="sm">{selectedTradeInForInspection.status}</Badge>
              </div>
              <div className="text-[#0F172A] font-bold text-sm">
                Offered Vehicle: {selectedTradeInForInspection.carOffered}
              </div>
              <div className="text-xs text-[#64748B]">
                Target Acquisition: <strong className="text-[#0F172A]">{selectedTradeInForInspection.target}</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-3.5 bg-[#FFFFFF] rounded-md border border-[#E2E8F0] shadow-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">Appraised Trade-In Value</span>
                <div className="font-mono font-bold text-[#1D4ED8] text-base">{selectedTradeInForInspection.valuation}</div>
                <div className="text-[11px] text-[#64748B]">Based on verified auction comps & condition score</div>
              </div>

              <div className="p-3.5 bg-[#FFFFFF] rounded-md border border-[#E2E8F0] shadow-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">Balance Settlement Required</span>
                <div className="font-mono font-bold text-[#0F172A] text-base">{selectedTradeInForInspection.diff}</div>
                <div className="text-[11px] text-[#64748B]">Payable by bank wire before vehicle release</div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-[#0F172A] block uppercase text-[10px] tracking-wider text-[#64748B]">
                Physical & Mechanical Verification Points
              </span>
              {[
                { title: "Structural Frame & Chassis", status: "100% Uncompromised (Zero Accident History)" },
                { title: "Laser Paint Depth Gauge", status: "115 - 128 microns (Factory Original Paint)" },
                { title: "OBD-II Engine & Transmission Scan", status: "Zero Stored Faults, Clean Catalyst" },
                { title: "Tire Tread & Braking System", status: "Front: 7.2mm, Rear: 6.8mm, Rotors Clean" },
              ].map((pt, idx) => (
                <div key={idx} className="p-2.5 bg-[#FFFFFF] rounded-md border border-[#E2E8F0] flex justify-between items-center text-xs">
                  <span className="font-medium text-[#475569]">{pt.title}</span>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                    {pt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* 5. Session Audit Telemetry Modal */}
      {selectedSessionForInspection && (
        <Modal
          isOpen={!!selectedSessionForInspection}
          onClose={() => setSelectedSessionForInspection(null)}
          size="xl"
          title={`Session Audit Telemetry: ${selectedSessionForInspection.id}`}
          description={`Cryptographic WORM Audit Record for ${selectedSessionForInspection.userName}`}
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md font-bold">
                Status: Tamper-Evident SHA-256 Validated
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedSessionForInspection(null)}
                leftIcon={<FiX className="w-3.5 h-3.5 text-white" />}
              >
                Close Audit Record
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#2563EB] text-sm">{selectedSessionForInspection.id}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  !selectedSessionForInspection.logoutTime
                    ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                    : "text-[#64748B] bg-[#F1F5F9] border border-[#CBD5E1]"
                }`}>
                  {!selectedSessionForInspection.logoutTime ? "Live Active Session" : "Terminated Session"}
                </span>
              </div>
              <div className="font-bold text-[#0F172A] text-sm">{selectedSessionForInspection.userName}</div>
              <div className="text-xs text-[#64748B]">
                {selectedSessionForInspection.email} &bull; <strong className="text-[#2563EB]">{selectedSessionForInspection.role}</strong> &bull; {selectedSessionForInspection.department}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-3.5 bg-[#FFFFFF] rounded-md border border-[#E2E8F0] shadow-xs space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">Network & Geolocation</span>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">IP Address:</span>
                  <span className="font-mono font-bold text-[#0F172A]">{selectedSessionForInspection.ipAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Location:</span>
                  <span className="font-medium text-[#0F172A]">{selectedSessionForInspection.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">WORM Record Seal:</span>
                  <span className="font-mono text-emerald-600 font-bold">
                    {selectedSessionForInspection.immutableSeal ? "Immutable WORM" : "Verified"}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-[#FFFFFF] rounded-md border border-[#E2E8F0] shadow-xs space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">Device Architecture</span>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Operating System:</span>
                  <span className="font-medium text-[#0F172A]">{selectedSessionForInspection.device}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Browser:</span>
                  <span className="text-[#0F172A]">{selectedSessionForInspection.browser}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">MFA Protocol:</span>
                  <span className="font-mono font-bold text-emerald-600 text-[10px]">
                    {selectedSessionForInspection.mfaMethod}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-[#FFFFFF] rounded-md border border-[#E2E8F0] shadow-xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">Session Timestamps & Duration</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                <div className="p-2.5 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[9px] uppercase">Login Authenticated</span>
                  <span className="font-bold text-[#0F172A]">{selectedSessionForInspection.loginTime}</span>
                </div>
                <div className="p-2.5 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[9px] uppercase">Session Terminated</span>
                  <span className="font-bold text-[#0F172A]">{selectedSessionForInspection.logoutTime || "Active"}</span>
                </div>
                <div className="p-2.5 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                  <span className="text-[#64748B] block text-[9px] uppercase">Total Duration</span>
                  <span className="font-bold text-[#1D4ED8]">{selectedSessionForInspection.duration}</span>
                </div>
              </div>
            </div>

            {/* SHA-256 Tamper-Proof Cryptographic Hash */}
            <div className="p-3.5 bg-[#0F172A] rounded-md text-[#FFFFFF] space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-[#94A3B8]">
                <span className="uppercase tracking-wider font-bold">SHA-256 WORM Cryptographic Seal</span>
                <span className="text-emerald-400 font-mono font-bold">Immutable Audit Lock</span>
              </div>
              <div className="font-mono text-[11px] text-[#BFDBFE] break-all select-all p-2 bg-[#000000]/50 rounded border border-[#1E293B]">
                {selectedSessionForInspection.checksum}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* 6. Admin Provision Department Staff Account Modal */}
      {isCreateAccountModalOpen && (
        <Modal
          isOpen={isCreateAccountModalOpen}
          onClose={() => setIsCreateAccountModalOpen(false)}
          size="lg"
          title="Provision Department Staff Account"
          description="Super Admin authorization: Provision an isolated department dashboard account, allocate branch clearance, and generate one-time credentials."
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCreateAccountModalOpen(false)}
                leftIcon={<FiX className="w-3.5 h-3.5 text-[#64748B]" />}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleCreateStaffAccount}
                leftIcon={<FiUserPlus className="w-3.5 h-3.5 text-white" />}
              >
                Provision & Activate Account
              </Button>
            </div>
          }
        >
          <form onSubmit={handleCreateStaffAccount} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Staff Full Name"
                placeholder="e.g. Olumide Adeleke"
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
                required
              />
              <Input
                label="Staff Work Email"
                type="email"
                placeholder="e.g. o.adeleke@luxauto.dealers.com"
                value={newStaffEmail}
                onChange={(e) => setNewStaffEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Dropdown
                label="Authorized Department Dashboard"
                options={[
                  { label: "Accounting & Treasury (Desk #13)", value: "finance" },
                  { label: "Showroom Sales & Orders (Desk #03)", value: "sales" },
                  { label: "Master Workshop & Service (Desk #04)", value: "service" },
                  { label: "Spare Parts & Accessories (Desk #05)", value: "parts" },
                  { label: "Finance & Insurance Underwriting (Desk #06)", value: "financing" },
                  { label: "Detailing, Paint & Recon (Desk #07)", value: "recon" },
                  { label: "Import Logistics & Customs (Desk #08)", value: "imports" },
                  { label: "Trade-In & Swap Appraisals (Desk #10)", value: "trade-ins" },
                  { label: "VIP CRM & Retention (Desk #11)", value: "crm" },
                  { label: "People Operations & HR (Desk #15)", value: "hr" },
                  { label: "Digital Content & CMS (Desk #18)", value: "cms" },
                ]}
                value={newStaffDept}
                onChange={(val) => setNewStaffDept(String(val))}
              />

              <Dropdown
                label="Showroom / Facility Node"
                options={[
                  { label: "Victoria Island Flagship Showroom", value: "Victoria Island Flagship Showroom" },
                  { label: "Ikoyi Private Client Lounge", value: "Ikoyi Private Client Lounge" },
                  { label: "Abuja Central Showroom & Hub", value: "Abuja Central Showroom & Hub" },
                  { label: "Lekki Service Center & Recon Facility", value: "Lekki Service Center & Recon Facility" },
                  { label: "Tin Can Port Logistics Depot", value: "Tin Can Port Logistics Depot" },
                ]}
                value={newStaffBranch}
                onChange={(val) => setNewStaffBranch(String(val))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Dropdown
                label="Security Clearance Tier"
                options={[
                  { label: "Department Head / Director", value: "Department Head / Director" },
                  { label: "Senior Specialist / Closer", value: "Senior Specialist / Closer" },
                  { label: "Associate Specialist / Auditor", value: "Associate Specialist / Auditor" },
                ]}
                value={newStaffClearance}
                onChange={(val) => setNewStaffClearance(val as any)}
              />

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-[#0F172A]">Temporary Provisioning Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
                      let pwd = "";
                      for (let i = 0; i < 14; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
                      setNewStaffPassword(pwd);
                      showToast("New secure cryptographic password generated.");
                    }}
                    className="text-[#2563EB] hover:underline font-bold text-[11px]"
                  >
                    Generate Strong Key
                  </button>
                </div>
                <Input
                  type="text"
                  value={newStaffPassword}
                  onChange={(e) => setNewStaffPassword(e.target.value)}
                  leftIcon={<FiKey className="w-4 h-4 text-[#94A3B8]" />}
                  required
                />
              </div>
            </div>

            <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-md text-[11px] text-[#1D4ED8] space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <FiShield className="w-3.5 h-3.5" />
                <span>Strict Department Isolation Enforced</span>
              </div>
              <p className="text-[#475569]">
                This account will have strictly scoped access exclusively to the authorized department dashboard. Cross-department operational actions are enforced via RBAC isolation protocols.
              </p>
            </div>
          </form>
        </Modal>
      )}

      {/* 7. Accounting Landed Margin Audit Voucher Modal */}
      {selectedVoucherForAudit && (
        <Modal
          isOpen={!!selectedVoucherForAudit}
          onClose={() => setSelectedVoucherForAudit(null)}
          size="lg"
          title={`Vehicle Landed Margin Audit Voucher: ${selectedVoucherForAudit.stockId}`}
          description={`Financial Ledger Audit & Landed Cost Breakdown for ${selectedVoucherForAudit.model}`}
          footer={
            <div className="flex items-center justify-between w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => showToast(`Audit Voucher ${selectedVoucherForAudit.stockId} dispatched to secure PDF print spooler.`)}
                leftIcon={<FiDownload className="w-3.5 h-3.5 text-[#2563EB]" />}
              >
                Print Landed Voucher
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedVoucherForAudit(null)}
                leftIcon={<FiX className="w-3.5 h-3.5 text-white" />}
              >
                Close Audit Voucher
              </Button>
            </div>
          }
        >
          <div className="space-y-3.5 text-xs">
            <div className="p-3.5 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#2563EB] text-sm">{selectedVoucherForAudit.stockId}</span>
                <Badge variant="gold" size="sm">{selectedVoucherForAudit.status}</Badge>
              </div>
              <div className="text-[#0F172A] font-bold text-sm">
                Vehicle: {selectedVoucherForAudit.model}
              </div>
              <div className="text-xs text-[#64748B]">
                Purchased Client: <strong className="text-[#0F172A]">{selectedVoucherForAudit.client}</strong> &bull; Sold Date: {selectedVoucherForAudit.soldDate}
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-[#0F172A] block uppercase text-[10px] tracking-wider text-[#64748B]">
                Itemized Realized Landed Cost Stack (COGS)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-2.5 bg-[#FFFFFF] rounded-md border border-[#E2E8F0] shadow-xs">
                  <span className="text-[10px] text-[#64748B] block">Supplier FOB</span>
                  <div className="font-mono font-bold text-[#0F172A] text-sm">{selectedVoucherForAudit.fob}</div>
                </div>
                <div className="p-2.5 bg-[#FFFFFF] rounded-md border border-[#E2E8F0] shadow-xs">
                  <span className="text-[10px] text-[#64748B] block">Sea Freight</span>
                  <div className="font-mono font-bold text-[#0F172A] text-sm">{selectedVoucherForAudit.freight}</div>
                </div>
                <div className="p-2.5 bg-[#FFFFFF] rounded-md border border-[#E2E8F0] shadow-xs">
                  <span className="text-[10px] text-[#64748B] block">Customs SGD Duty</span>
                  <div className="font-mono font-bold text-[#0F172A] text-sm">{selectedVoucherForAudit.duty}</div>
                </div>
                <div className="p-2.5 bg-[#FFFFFF] rounded-md border border-[#E2E8F0] shadow-xs">
                  <span className="text-[10px] text-[#64748B] block">Recon & Prep</span>
                  <div className="font-mono font-bold text-[#0F172A] text-sm">{selectedVoucherForAudit.recon}</div>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-[#0F172A] text-white rounded-md grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] text-[#94A3B8] uppercase block">Total Landed Cost</span>
                <div className="text-base font-mono font-bold text-white">{selectedVoucherForAudit.landedCost}</div>
              </div>
              <div>
                <span className="text-[10px] text-[#94A3B8] uppercase block">Realized Selling Price</span>
                <div className="text-base font-mono font-bold text-[#60A5FA]">{selectedVoucherForAudit.soldPrice}</div>
              </div>
              <div className="sm:text-right">
                <span className="text-[10px] text-[#38BDF8] uppercase font-bold block">Net Landed Margin</span>
                <div className="text-base font-mono font-bold text-[#38BDF8]">
                  {selectedVoucherForAudit.netMargin} ({selectedVoucherForAudit.marginPct})
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-1 text-[11px]">
              <span className="font-bold text-[#0F172A] block uppercase text-[10px] tracking-wider text-[#64748B]">
                General Ledger Posting Validation
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 font-mono text-[10px] text-[#475569]">
                <div>Debit COGS: <strong>5010-LANDED-COST</strong></div>
                <div>Credit Revenue: <strong>4100-VEHICLE-SALES</strong></div>
                <div>Net Margin: <strong>3100-REALIZED-EQUITY</strong></div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}
