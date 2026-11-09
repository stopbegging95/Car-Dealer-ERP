"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  FiLayers,
  FiShoppingCart,
  FiDollarSign,
  FiFileText,
  FiMessageSquare,
  FiSettings,
  FiShield,
  FiTruck,
  FiRepeat,
  FiEdit3,
  FiDownload,
  FiBriefcase,
  FiNavigation,
  FiTool,
  FiBox,
  FiActivity,
  FiCheckSquare,
  FiCheckCircle,
  FiEye,
  FiCheck,
  FiX,
  FiUserPlus,
  FiKey,
  FiTrendingUp,
  FiDatabase,
} from "react-icons/fi";
import { FaCar } from "react-icons/fa6";
import {
  Button,
  Badge,
  Modal,
  Input,
  Dropdown,
  MasterDropdown,
} from "@/components/ui";
import { DashboardLayout } from "@/components/DashboardLayout";
import { VEHICLES, Vehicle, VehicleCategory } from "@/data/vehicles";
import { vehiclesApi, ordersApi, transfersApi } from "@/lib/api";
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
import { BiometricFaceCaptureModal } from "@/components/BiometricFaceCaptureModal";
import {
  getActiveBiometricVerification,
  recordLoginBiometric,
  getAllSessionAuditLogs,
} from "@/utils/sessionAuditHelper";
import {
  AdminDashboard,
  DepartmentPortalsDashboard,
  AccountingDashboard,
  SalesDashboard,
  ServiceDashboard,
  PartsDashboard,
  FinancingDashboard,
  ReconDashboard,
  ImportsDashboard,
  TradeInsDashboard,
  CRMDashboard,
  HRDashboard,
  TransfersDashboard,
  InventoryDashboard,
  CMSDashboard,
  DocumentVaultDashboard,
  SettingsDashboard,
  ProfileDashboard,
  SessionsDashboard,
  ProcurementDashboard,
  InvoicesPaymentsDashboard,
  FinancialReportsDashboard,
  ReportsAnalyticsDashboard,
  InspectionQADashboard,
  PersonalStaffDashboard,
  StaffChatPage,
  OrderItem,
} from "@/components/dashboards";
import { MasterDataPage } from "@/components/dashboards/admin/MasterDataPage";

const SALES_ORDERS: OrderItem[] = [
  {
    id: "ORD-9912",
    client: "Alhaji Bello & Sons Ltd",
    car: "2024 Mercedes-Maybach S580 (Dual-Tone)",
    amount: "₦255,750,000",
    status: "Delivery Inspection",
    stage: "Ready for Handover",
    rep: "Emeka O.",
    vin: "WDD223...001",
    deposit: "₦155,000,000",
    balance: "₦100,750,000",
    deliveryDate: "2026-11-12",
  },
  {
    id: "ORD-9910",
    client: "Dr. K. Somoye",
    car: "2024 Porsche 911 Turbo S (Guards Red)",
    amount: "₦348,750,000",
    status: "Payment Confirmed",
    stage: "Registration & Armor",
    rep: "Aisha M.",
    vin: "WP0AD2...002",
    deposit: "₦348,750,000",
    balance: "₦0 (Paid in Full)",
    deliveryDate: "2026-11-15",
  },
  {
    id: "ORD-9908",
    client: "Zenith Capital Partners",
    car: "2023 Range Rover Autobiography LWB",
    amount: "₦302,250,000",
    status: "Customs Clearance",
    stage: "Tin Can Discharge",
    rep: "Tariq K.",
    vin: "SALWR2...003",
    deposit: "₦124,000,000",
    balance: "₦178,250,000",
    deliveryDate: "2026-11-20",
  },
  {
    id: "ORD-9904",
    client: "Senator Godswill O.",
    car: "2024 Mercedes-AMG G63 Magno Black",
    amount: "₦372,000,000",
    status: "Quotation Approved",
    stage: "Bank Wire Verification",
    rep: "Emeka O.",
    vin: "W1N9G8...007",
    deposit: "₦186,000,000",
    balance: "₦186,000,000",
    deliveryDate: "2026-11-25",
  },
];

export const MODULE_TO_SLUG: Record<string, string> = {
  "Dashboard": "dashboard",
  "Car Management": "inventory",
  "Vehicles & Inventory": "inventory",
  "Orders & Sales": "sales",
  "Sales & Orders": "sales",
  "Procurement": "procurement",
  "Service & Workshop": "service",
  "Parts & Inventory": "parts",
  "Finance": "financing",
  "Detailing & Recon": "recon",
  "Inspection & Quality": "inspection",
  "Import Logistics": "imports",
  "Trade-In & Swap": "trade-ins",
  "CRM Pipeline & 360": "crm",
  "Accounting": "accounting",
  "Invoices & Payments": "invoices",
  "Financial Reports": "financial-reports",
  "Branch Transfers": "transfers",
  "HR & Recruitment": "hr",
  "Department Portals & Accounts": "department-portals",
  "Document Vault": "documents",
  "Home Banner": "home-banner",
  "Home Banners": "home-banner",
  "CMS Manager": "home-banner",
  "Reports & Analytics": "reports",
  "Settings": "settings",
  "Master Data & Dropdowns": "master-data",
  "Personal Staff Dashboard": "staff",
  "My Profile": "profile",
  "Session History": "sessions",
  "Staff Team Chat": "chat",
  "Staff Chat": "chat",
  "Team Chat": "chat",
};

export function ERPConsoleContent({
  initialModule = "Dashboard",
  initialRole = "admin",
}: {
  initialModule?: string;
  initialRole?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
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

  // Authentication Guard: Ensure user has valid session token
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("cardeals_auth_token");
      const hasCookieToken =
        document.cookie.includes("cardeals_auth_token=") ||
        document.cookie.includes("token=");
      if (!token && !hasCookieToken) {
        router.push("/auth/dashboard-login");
      }
    }
  }, [router]);

  // Biometric Facial Security Gate Check for Staff (Customer is exempted)
  const [isBiometricGateOpen, setIsBiometricGateOpen] = useState<boolean>(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const isCustomer = activeRoleId === "customer" || activeRoleId === "user";
      if (!isCustomer) {
        const verified = getActiveBiometricVerification();
        if (!verified || !verified.verified) {
          setIsBiometricGateOpen(true);
        }
      }
    }
  }, [activeRoleId]);

  // Keep activeModule in sync if initialModule changes
  React.useEffect(() => {
    if (initialModule && initialModule !== activeModule) {
      setActiveModule(initialModule);
    }
  }, [initialModule]);

  // Synchronize browser URL whenever module is selected so route equals page name
  const handleSelectModule = (moduleName: string) => {
    setActiveModule(moduleName);
    const slug = MODULE_TO_SLUG[moduleName] || "dashboard";
    const isUnderAdmin = pathname ? pathname.startsWith("/admin") : activeRoleId === "admin";
    const basePath = isUnderAdmin ? "/admin" : "/erp";
    const targetUrl = slug === "dashboard" ? basePath : `${basePath}/${slug}`;
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", targetUrl);
    }
  };

  const [stockList, setStockList] = useState<Vehicle[]>(VEHICLES);

  // Fetch live inventory from MongoDB API
  React.useEffect(() => {
    let isMounted = true;
    vehiclesApi.getAll().then((res) => {
      if (res.success && res.data?.vehicles && Array.isArray(res.data.vehicles) && res.data.vehicles.length > 0) {
        if (isMounted) {
          const apiVehicles: Vehicle[] = res.data.vehicles.map((v: any) => ({
            stockId: v.stockId,
            vin: v.vin,
            category: (v.category || "Executive Class") as VehicleCategory,
            make: v.make,
            model: v.modelName || v.model,
            trim: v.trim || "",
            year: v.year,
            mileage: v.mileageKm || 0,
            condition: (v.condition === "Brand New" ? "Brand-new" : v.condition?.includes("Foreign") ? "Foreign-used" : "Locally-used") as any,
            transmission: v.transmission,
            fuel: v.fuelType,
            exteriorColor: v.exteriorColor,
            interiorColor: v.interiorColor,
            purchaseCost: Math.round(v.acquisitionCostNGN / 1550),
            landedCost: Math.round(v.landedCostNGN / 1550),
            priceUSD: Math.round(v.listingPriceNGN / 1550),
            priceNGN: v.listingPriceNGN,
            status: (v.status === "Showroom Ready" ? "Available" : v.status) as any,
            location: (v.currentHub || "Lagos Showroom") as any,
            image: v.thumbnail || v.images?.[0] || "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
            gallery: v.images || [],
            features: v.features || [],
            horsepower: v.specifications?.horsepower || 500,
            engine: v.engineCapacity || "4.0L V8 Bi-Turbo",
            description: v.notes || `${v.year} ${v.make} ${v.modelName}`,
          }));
          setStockList(apiVehicles);
        }
      }
    }).catch(() => {});

    return () => { isMounted = false; };
  }, []);

  const [ordersList, setOrdersList] = useState<OrderItem[]>(SALES_ORDERS);

  // Fetch live sales orders from MongoDB API
  React.useEffect(() => {
    let isMounted = true;
    ordersApi.getAll().then((res) => {
      if (res.success && res.data?.orders && Array.isArray(res.data.orders) && res.data.orders.length > 0) {
        if (isMounted) {
          const apiOrders: OrderItem[] = res.data.orders.map((o: any) => ({
            id: o.orderNumber || o._id,
            client: o.clientName,
            car: o.vehicleDetails || o.vehicleTitle,
            amount: `₦${(o.finalPriceNGN || o.totalAmountNGN || 0).toLocaleString()}`,
            status: o.status || "Payment Confirmed",
            stage: o.workflowStage || "Registration & Armor",
            rep: o.salesRep || "Emeka O.",
            vin: o.vin || "VIN-PENDING",
            deposit: `₦${(o.depositPaidNGN || 0).toLocaleString()}`,
            balance: `₦${(o.balanceDueNGN || 0).toLocaleString()}`,
            deliveryDate: o.estimatedDeliveryDate ? new Date(o.estimatedDeliveryDate).toISOString().split("T")[0] : "2026-11-20",
          }));
          setOrdersList(apiOrders);
        }
      }
    }).catch(() => {});

    return () => { isMounted = false; };
  }, []);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState<boolean>(false);
  const [newVehMake, setNewVehMake] = useState<string>("");
  const [newVehModel, setNewVehModel] = useState<string>("");
  const [newVehYear, setNewVehYear] = useState<string>("2026");
  const [newVehVin, setNewVehVin] = useState<string>("");
  const [newVehPriceNGN, setNewVehPriceNGN] = useState<string>("");
  const [newVehLocation, setNewVehLocation] = useState<string>("Lagos Showroom");
  const [isTransferModalOpen, setIsTransferModalOpen] = useState<boolean>(false);
  const [transferSource, setTransferSource] = useState<string>("Lagos Showroom");
  const [transferDest, setTransferDest] = useState<string>("Abuja Showroom");
  const [transferCarrier, setTransferCarrier] = useState<string>("Swift Luxury Flatbed Logistics");
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
  const [newStaffPassword, setNewStaffPassword] = useState<string>("Password123!");
  const [newStaffBranch, setNewStaffBranch] = useState<string>("Victoria Island Flagship Showroom");
  const [newStaffClearance, setNewStaffClearance] = useState<
    "Department Head / Director" | "Senior Specialist / Closer" | "Associate Specialist / Auditor"
  >("Department Head / Director");

  // Accounting Department Dashboard State
  const [accountingTab, setAccountingTab] = useState<"margins" | "payables" | "receivables" | "tax" | "taxonomies">("margins");
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
      vendor: "Grimaldi Deep Sea Shipping Lines",
      type: "Container Ro-Ro Sea Freight (4 Vehicles)",
      ref: "GRI-SEA-88102",
      amount: "₦53,940,000",
      dueDate: "2026-11-12",
      status: "Pending Wire Authorization",
    },
    {
      id: "AP-2026-082",
      vendor: "Nigeria Customs Service (Tin Can Area Command)",
      type: "SGD Duty & Port Inspection Levies",
      ref: "NCS-SGD-99410",
      amount: "₦79,360,000",
      dueDate: "2026-11-10",
      status: "Approved for Wire Transfer",
    },
    {
      id: "AP-2026-083",
      vendor: "Mercedes-Benz Central Parts AG",
      type: "OEM Ceramic Rotors & Consumable Spares",
      ref: "MB-GER-33411",
      amount: "₦40,920,000",
      dueDate: "2026-11-15",
      status: "Pending Wire Authorization",
    },
    {
      id: "AP-2026-084",
      vendor: "Ceramic Pro Middle East FZE",
      type: "9H Diamond Nanotech Coating Stock",
      ref: "CP-DXB-55219",
      amount: "₦22,940,000",
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
      balance: "₦186,000,000",
      bank: "GTBank Plc",
      wireRef: "GTB-WIR-99120",
      status: "Wire Received - Verification Required",
    },
    {
      id: "AR-2026-042",
      client: "Dr. K. Somoye",
      car: "2024 S580 Maybach (Trade-In Settlement)",
      balance: "₦150,350,000",
      bank: "Zenith Bank Plc",
      wireRef: "ZEN-TX-44021",
      status: "Wire Received - Verification Required",
    },
    {
      id: "AR-2026-043",
      client: "Senator B. Adeleke",
      car: "2024 Bentley Continental GT",
      balance: "₦255,750,000",
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

  const [sessionLogs, setSessionLogs] = useState<SessionAuditLog[]>(() => getAllSessionAuditLogs());

  // Refresh session logs when entering session module or on interval
  React.useEffect(() => {
    if (activeModule === "Session History") {
      setSessionLogs(getAllSessionAuditLogs());
    }
  }, [activeModule]);

  const filteredSessions = useMemo(() => {
    return sessionLogs.filter((s) => {
      const matchesSearch =
        s.id.toLowerCase().includes(sessionSearch.toLowerCase()) ||
        s.userName.toLowerCase().includes(sessionSearch.toLowerCase()) ||
        s.ipAddress.toLowerCase().includes(sessionSearch.toLowerCase()) ||
        s.email.toLowerCase().includes(sessionSearch.toLowerCase());
      if (sessionFilter === "active") return matchesSearch && !s.logoutTime;
      if (sessionFilter === "terminated") return matchesSearch && !!s.logoutTime;
      return matchesSearch;
    });
  }, [sessionLogs, sessionSearch, sessionFilter]);

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
  const filteredStock = stockList.filter(
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
      { name: "Procurement", icon: <FiBox className="w-4 h-4 shrink-0" />, badge: "18 POs" },
      { name: "Import Logistics", icon: <FiTruck className="w-4 h-4 shrink-0" />, badge: "3 Vessels" },
      { name: "Service & Workshop", icon: <FiTool className="w-4 h-4 shrink-0" />, badge: "6 Bays" },
      { name: "Parts & Inventory", icon: <FiLayers className="w-4 h-4 shrink-0" />, badge: "4 Low" },
      { name: "Finance", icon: <FiActivity className="w-4 h-4 shrink-0" />, badge: "6 Pending" },
      { name: "Inspection & Quality", icon: <FiCheckCircle className="w-4 h-4 shrink-0" />, badge: "5 PDI" },
      { name: "Detailing & Recon", icon: <FiCheckSquare className="w-4 h-4 shrink-0" />, badge: "4 Ready" },
      { name: "Branch Transfers", icon: <FiNavigation className="w-4 h-4 shrink-0" />, badge: "2 Active" },
      { name: "Trade-In & Swap", icon: <FiRepeat className="w-4 h-4 shrink-0" />, badge: "3" },
      { name: "CRM Pipeline & 360", icon: <FiMessageSquare className="w-4 h-4 shrink-0" />, badge: "14" },
      { name: "Accounting", icon: <FiDollarSign className="w-4 h-4 shrink-0" /> },
      { name: "Invoices & Payments", icon: <FiFileText className="w-4 h-4 shrink-0" />, badge: "12 Open" },
      { name: "Financial Reports", icon: <FiTrendingUp className="w-4 h-4 shrink-0" /> },
      { name: "HR & Recruitment", icon: <FiBriefcase className="w-4 h-4 shrink-0" />, badge: "5 Apps" },
    ],
    [filteredStock.length]
  );

  const systemMenuItems = useMemo(
    () => [
      { name: "Department Portals & Accounts", icon: <FiUserPlus className="w-4 h-4 shrink-0" />, badge: "Admin" },
      { name: "Reports & Analytics", icon: <FiTrendingUp className="w-4 h-4 shrink-0" /> },
      { name: "Document Vault", icon: <FiFileText className="w-4 h-4 shrink-0" /> },
      { name: "Home Banner", icon: <FiEdit3 className="w-4 h-4 shrink-0" /> },
      { name: "Roles & RBAC", icon: <FiShield className="w-4 h-4 shrink-0" /> },
      { name: "Master Data & Dropdowns", icon: <FiDatabase className="w-4 h-4 shrink-0" /> },
      { name: "Settings", icon: <FiSettings className="w-4 h-4 shrink-0" /> },
    ],
    []
  );

  // Filter menu items strictly according to role permissions and aliases
  const filteredMainMenuItems = useMemo(() => {
    return mainMenuItems.filter((item) => isModuleAllowedForRole(activeRole.id, item.name));
  }, [mainMenuItems, activeRole.id]);

  const filteredSystemMenuItems = useMemo(() => {
    return systemMenuItems.filter((item) => isModuleAllowedForRole(activeRole.id, item.name));
  }, [systemMenuItems, activeRole.id]);

  return (
    <DashboardLayout
      title={activeModule}
      activeModule={activeModule}
      onSelectModule={handleSelectModule}
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
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0F172A] text-white px-4 py-3 rounded-lg shadow-xl border border-[#334155] flex items-center gap-3 animate-in slide-in-from-bottom-2 fade-in duration-200">
          <FiCheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[#94A3B8] hover:text-white transition-colors cursor-pointer ml-2"
          >
            <FiX className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {!isAllowed ? (
        <AccessRestrictedGuard
          attemptedModule={activeModule}
          activeRole={activeRole}
          onReturnToAllowedModule={handleSelectModule}
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
          {/* MODULAR DASHBOARD VIEWS DISPATCHED BY ACTIVE MODULE               */}
          {/* ================================================================= */}

          {activeModule === "Dashboard" && (
            <AdminDashboard
              onOpenCreatePortalAccount={() => setIsCreateAccountModalOpen(true)}
            />
          )}

          {(activeModule === "Department Portals & Accounts" || activeModule === "Roles & RBAC" || activeModule === "Users & Permissions") && (
            <DepartmentPortalsDashboard
              staffAccounts={staffAccounts}
              onOpenCreateModal={() => setIsCreateAccountModalOpen(true)}
              onOpenDashboard={(acc) => {
                handleRoleChange(acc.departmentId);
                handleSelectModule(acc.dashboardModule);
                showToast(`Switched into ${acc.departmentName} session for ${acc.name}.`);
              }}
              onToggleStatus={toggleStaffStatus}
            />
          )}

          {(activeModule === "Car Management" || activeModule === "Vehicles & Inventory") && (
            <InventoryDashboard
              vehicles={filteredStock}
              onOpenAddVehicle={() => setIsAddVehicleOpen(true)}
              onPreviewVehicle={(v) => setSelectedVehicleForPreview(v)}
            />
          )}

          {(activeModule === "Orders & Sales" || activeModule === "Sales & Orders") && (
            <SalesDashboard
              orders={ordersList}
              onPreviewOrder={(order) => setSelectedOrderForPreview(order)}
              onInspectOrder={(order) => setSelectedOrderForInspection(order)}
              onDownloadPdf={handleDownloadOrderPdf}
            />
          )}

          {(activeModule === "Procurement" || activeModule === "Procurement & Purchasing") && (
            <ProcurementDashboard showToast={showToast} />
          )}

          {(activeModule === "Service & Workshop" || activeModule === "Service & Maintenance") && (
            <ServiceDashboard showToast={showToast} />
          )}

          {(activeModule === "Parts & Inventory" || activeModule === "Parts & Accessories") && (
            <PartsDashboard showToast={showToast} />
          )}

          {activeModule === "Finance" && (
            <FinancingDashboard showToast={showToast} />
          )}

          {activeModule === "Inspection & Quality" && (
            <InspectionQADashboard showToast={showToast} />
          )}

          {activeModule === "Detailing & Recon" && (
            <ReconDashboard showToast={showToast} />
          )}

          {(activeModule === "Branch Transfers" || activeModule === "Branches & Operations") && (
            <TransfersDashboard onOpenTransferModal={() => setIsTransferModalOpen(true)} />
          )}

          {(activeModule === "Import Logistics" || activeModule === "Importation & Logistics") && (
            <ImportsDashboard showToast={showToast} />
          )}

          {(activeModule === "Trade-In & Swap" || activeModule === "Trade-In & Valuation") && (
            <TradeInsDashboard
              onInspectTradeIn={(item) =>
                setSelectedTradeInForInspection({
                  id: item.id,
                  client: item.client,
                  carOffered: item.carOffered,
                  target: item.target,
                  valuation: `₦${(((item as any).valuationNGN ?? item.valuationUSD ?? 0)).toLocaleString()}`,
                  diff: `₦${(((item as any).payableDiffNGN ?? item.payableDiffUSD ?? 0)).toLocaleString()}`,
                  status: item.status,
                })
              }
            />
          )}

          {(activeModule === "CRM Pipeline & 360" || activeModule === "Customers & CRM" || activeModule === "CRM & Client 360") && (
            <CRMDashboard showToast={showToast} />
          )}

          {activeModule === "Accounting" && (
            <AccountingDashboard
              payablesList={payablesList}
              receivablesList={receivablesList}
              accountingTab={accountingTab}
              onTabChange={setAccountingTab}
              onAuditVoucher={(voucher) => setSelectedVoucherForAudit(voucher)}
              onDisburse={(id) => {
                setPayablesList((prev) =>
                  prev.map((p) => (p.id === id ? { ...p, status: "Settled via Wire" } : p))
                );
                showToast(`Wire transfer disbursement authorized for voucher ${id}.`);
              }}
              onVerifyWire={(id) => {
                setReceivablesList((prev) =>
                  prev.map((r) =>
                    r.id === id ? { ...r, status: "Verified & Reconciled to GL" } : r
                  )
                );
                showToast(`Inbound wire ${id} verified and reconciled to General Ledger.`);
              }}
              onLockPeriod={() => {
                setFiscalPeriodLocked(!fiscalPeriodLocked);
                showToast(
                  fiscalPeriodLocked
                    ? "FY 2026 Q4 Fiscal Period unlocked for adjustments."
                    : "FY 2026 Q4 Fiscal Period cryptographically LOCKED."
                );
              }}
              fiscalPeriodLocked={fiscalPeriodLocked}
              showToast={showToast}
            />
          )}

          {activeModule === "Invoices & Payments" && (
            <InvoicesPaymentsDashboard showToast={showToast} />
          )}

          {activeModule === "Financial Reports" && (
            <FinancialReportsDashboard showToast={showToast} />
          )}

          {activeModule === "Reports & Analytics" && (
            <ReportsAnalyticsDashboard showToast={showToast} />
          )}

          {(activeModule === "HR & Recruitment" || activeModule === "HR & Employees" || activeModule === "HR & Staffing") && (
            <HRDashboard showToast={showToast} />
          )}

          {(activeModule === "Document Vault" || activeModule === "Legal & Compliance") && (
            <DocumentVaultDashboard
              onDownloadDoc={(doc) => {
                downloadVaultDocumentPdf({
                  title: doc.name,
                  reference: doc.car,
                  classification: doc.type,
                  date: doc.date,
                  details: `File size: ${doc.size}. Watermarked title deeds and official customs clearance documents certified under deal escrow.`,
                  author: "Dealership Legal & Document Registrar",
                });
                showToast(`Generating certified PDF for ${doc.name}...`);
              }}
            />
          )}

          {(activeModule === "Home Banner" || activeModule === "Home Banners" || activeModule === "CMS Manager" || activeModule === "Marketing & Media") && (
            <CMSDashboard showToast={showToast} />
          )}

          {activeModule === "Settings" && (
            <SettingsDashboard showToast={showToast} />
          )}

          {(activeModule === "Master Data & Dropdowns" || activeModule === "Master Data" || activeModule === "Master Data & Taxonomies") && (
            <MasterDataPage showToast={showToast} />
          )}

          {activeModule === "Personal Staff Dashboard" && (
            <PersonalStaffDashboard showToast={showToast} />
          )}

          {activeModule === "My Profile" && (
            <ProfileDashboard
              activeRole={activeRole}
            />
          )}

          {activeModule === "Session History" && (
            <SessionsDashboard
              sessions={filteredSessions}
              allSessionsCount={sessionLogs.length}
              sessionSearch={sessionSearch}
              onSearchChange={setSessionSearch}
              sessionFilter={sessionFilter}
              onFilterChange={setSessionFilter}
              onInspectSession={(session) => setSelectedSessionForInspection(session as any)}
            />
          )}

          {(activeModule === "Staff Team Chat" || activeModule === "Staff Chat" || activeModule === "Team Chat") && (
            <StaffChatPage
              currentStaff={{
                name: activeRole.userName,
                email: activeRole.email,
                role: activeRole.name,
                department: activeRole.department,
                initials: activeRole.userInitials,
              }}
            />
          )}
        </div>
      )}

      {/* Add New Vehicle Modal */}
      <Modal
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
        size="lg"
        title="Register New Vehicle to Stock (Product Intake)"
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
                if (!newVehMake || !newVehModel) {
                  showToast("Please enter vehicle make and model.");
                  return;
                }
                const newStockId = `STK-2026-${String(stockList.length + 1).padStart(3, "0")}`;
                const priceNGN = Number(newVehPriceNGN.replace(/[^0-9]/g, "") || 250000000);
                const newVeh: Vehicle = {
                  stockId: newStockId,
                  vin: newVehVin || `WDD223${Date.now().toString().slice(-10)}`,
                  category: "Executive Class",
                  make: newVehMake,
                  model: newVehModel,
                  trim: "Executive Edition",
                  year: parseInt(newVehYear, 10) || 2026,
                  mileage: 1200,
                  condition: "Brand-new",
                  transmission: "Automatic",
                  fuel: "Petrol",
                  exteriorColor: "Obsidian Black",
                  interiorColor: "Nappa Leather Black",
                  purchaseCost: Math.round(priceNGN * 0.78),
                  landedCost: Math.round(priceNGN * 0.88),
                  priceUSD: Math.round(priceNGN / 1550),
                  priceNGN: priceNGN,
                  status: "Available",
                  location: newVehLocation,
                  image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80",
                  gallery: [
                    "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
                  ],
                  features: ["VIP Lounge Seating", "360 Surround View", "Active Lane Assist"],
                  horsepower: 503,
                  engine: "4.0L V8 Biturbo",
                  description: `${newVehMake} ${newVehModel} registered for showroom stock. Fully inspected and authenticated.`,
                };
                setStockList([newVeh, ...stockList]);
                setIsAddVehicleOpen(false);
                showToast(`New vehicle product ${newStockId} (${newVehMake} ${newVehModel}) added to showroom stock!`);

                // Persist to MongoDB backend
                vehiclesApi.create({
                  vin: newVehVin || `VIN-${Date.now()}`,
                  stockId: newStockId,
                  make: newVehMake,
                  modelName: newVehModel,
                  year: parseInt(newVehYear, 10) || 2026,
                  listingPriceNGN: priceNGN,
                  acquisitionCostNGN: Math.round(priceNGN * 0.78),
                  currentHub: newVehLocation,
                  features: ["VIP Lounge Seating", "360 Surround View", "Active Lane Assist"],
                }).catch((e) => console.warn("Could not sync vehicle to backend:", e));

                setNewVehMake("");
                setNewVehModel("");
                setNewVehVin("");
                setNewVehPriceNGN("");
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
            <MasterDropdown
              category="makes"
              label="Make (Brand)"
              value={newVehMake}
              onChange={(val) => setNewVehMake(String(val))}
              required
            />
            <Input
              label="Model & Trim"
              placeholder="e.g. S580 4MATIC Maybach"
              value={newVehModel}
              onChange={(e) => setNewVehModel(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <Input
              label="Model Year"
              placeholder="2026"
              value={newVehYear}
              onChange={(e) => setNewVehYear(e.target.value)}
              required
            />
            <Input
              label="Chassis / VIN"
              placeholder="WDD223..."
              value={newVehVin}
              onChange={(e) => setNewVehVin(e.target.value)}
              required
            />
            <Input
              label="Mileage (KM)"
              placeholder="1,500"
              defaultValue="1,200"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="FOB Purchase Cost (₦)"
              placeholder="185,000,000"
              defaultValue="185,000,000"
            />
            <Input
              label="Target Showroom Price (₦ NGN)"
              placeholder="250,000,000"
              value={newVehPriceNGN}
              onChange={(e) => setNewVehPriceNGN(e.target.value)}
              required
            />
          </div>
          <MasterDropdown
            category="hubs"
            label="Initial Allocation Hub"
            value={newVehLocation}
            onChange={(val) => setNewVehLocation(String(val))}
            required
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
                transfersApi.create({
                  vehicleId: "660000000000000000000001",
                  vin: "WDD2230631A987654",
                  sourceHub: transferSource,
                  destinationHub: transferDest,
                  carrierDriverName: "Musa Danladi",
                  carrierDriverPhone: "+234 803 111 2222",
                  truckPlateNumber: "LAG-882-AB",
                }).catch((e) => console.warn("Could not sync transfer to backend:", e));
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
            options={stockList.map((v) => ({ label: `${v.stockId} - ${v.make} ${v.model}`, value: v.stockId }))}
            onChange={() => {}}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MasterDropdown
              category="hubs"
              label="Source Showroom"
              value={transferSource}
              onChange={(val) => setTransferSource(String(val))}
              required
            />
            <MasterDropdown
              category="hubs"
              label="Destination Showroom"
              value={transferDest}
              onChange={(val) => setTransferDest(String(val))}
              required
            />
          </div>
          <MasterDropdown
            category="carriers"
            label="Assigned Carrier / Hauler Service"
            value={transferCarrier}
            onChange={(val) => setTransferCarrier(String(val))}
            required
          />
          <Input label="Driver Name & Contact Number" placeholder="e.g. Musa Danladi (+234 803 111 2222)" required />
        </div>
      </Modal>

      {/* 1. Order Preview Modal */}
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
                <span className="font-bold block uppercase text-[10px] tracking-wider text-[#64748B]">Buyer Information</span>
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
                <span className="font-bold block uppercase text-[10px] tracking-wider text-[#64748B]">Financial Breakdown</span>
                <div className="flex justify-between text-xs">
                  <span className="text-[#64748B]">Agreed Retail Price:</span>
                  <span className="font-mono font-bold text-[#1D4ED8] text-sm">{selectedOrderForPreview.amount}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#64748B]">Committed Escrow Deposit:</span>
                  <span className="font-mono font-semibold text-[#0F172A]">{selectedOrderForPreview.deposit || "₦77,500,000"}</span>
                </div>
                <div className="flex justify-between border-t border-[#E2E8F0] pt-1.5 text-xs">
                  <span className="text-[#64748B] font-semibold">Remaining Balance Due:</span>
                  <span className="font-mono font-bold text-[#0F172A]">{selectedOrderForPreview.balance || "₦0"}</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#1D4ED8]">
              <strong>Dealership Escrow Security:</strong> Funds verified under Central Bank AML guidelines. Physical vehicle release authorized following lead technician PDI sign-off.
            </div>
          </div>
        </Modal>
      )}

      {/* 2. Order 150-Point Inspection Modal */}
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

      {/* 3. Vehicle Specification Dossier Preview Modal */}
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
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute top-2.5 right-2.5">
                  <Badge variant="gold" size="sm" dot>
                    {selectedVehicleForPreview.status}
                  </Badge>
                </div>
                <div className="absolute bottom-2.5 left-2.5 bg-[#0F172A]/90 backdrop-blur-xs text-[#FFFFFF] px-3 py-1.5 rounded text-xs font-mono font-bold">
                  ₦{selectedVehicleForPreview.priceNGN.toLocaleString()} NGN
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

            {/* Biometric Facial Telemetry (Login & Logout Snapshots) */}
            <div className="p-3.5 bg-[#FFFFFF] rounded-md border border-[#E2E8F0] shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                  <FiShield className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Biometric Facial Telemetry &bull; Ingress &amp; Egress Pictures</span>
                </span>
                <span className="text-[9px] font-mono bg-blue-50 text-[#2563EB] font-bold px-1.5 py-0.5 rounded border border-blue-200">
                  Checkpoint Verified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Login Biometric Snapshot */}
                <div className="p-2.5 bg-[#F8FAFC] rounded border border-[#CBD5E1] space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#0F172A] flex items-center gap-1">
                      <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Login Verification Picture
                    </span>
                    <span className="font-mono text-[9px] text-[#64748B]">INGRESS</span>
                  </div>
                  {selectedSessionForInspection.loginFaceSnapshot ? (
                    <div className="relative aspect-4/3 w-full rounded overflow-hidden bg-black border border-[#94A3B8]">
                      <img
                        src={selectedSessionForInspection.loginFaceSnapshot}
                        alt="Staff Login Biometric Capture"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur-xs p-1 text-[9px] font-mono text-emerald-400 truncate">
                        {selectedSessionForInspection.loginTime}
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-4/3 w-full rounded bg-slate-100 border border-dashed border-[#CBD5E1] flex flex-col items-center justify-center text-center p-2 text-[10px] text-[#64748B]">
                      <FiShield className="w-6 h-6 text-[#94A3B8] mb-1" />
                      <span>Standard Credential Clearance (Pre-Biometric Record)</span>
                    </div>
                  )}
                  <div className="text-[10px] text-[#475569] font-mono">
                    Timestamp: <strong className="text-[#0F172A]">{selectedSessionForInspection.loginTime}</strong>
                  </div>
                </div>

                {/* Logout Biometric Snapshot */}
                <div className="p-2.5 bg-[#F8FAFC] rounded border border-[#CBD5E1] space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#0F172A] flex items-center gap-1">
                      {selectedSessionForInspection.logoutTime ? (
                        <FiCheckCircle className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                      Logout Verification Picture
                    </span>
                    <span className="font-mono text-[9px] text-[#64748B]">EGRESS</span>
                  </div>
                  {selectedSessionForInspection.logoutFaceSnapshot ? (
                    <div className="relative aspect-4/3 w-full rounded overflow-hidden bg-black border border-[#94A3B8]">
                      <img
                        src={selectedSessionForInspection.logoutFaceSnapshot}
                        alt="Staff Logout Biometric Capture"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur-xs p-1 text-[9px] font-mono text-blue-400 truncate">
                        {selectedSessionForInspection.logoutTime}
                      </div>
                    </div>
                  ) : selectedSessionForInspection.logoutTime ? (
                    <div className="aspect-4/3 w-full rounded bg-slate-100 border border-dashed border-[#CBD5E1] flex flex-col items-center justify-center text-center p-2 text-[10px] text-[#64748B]">
                      <FiCheckCircle className="w-6 h-6 text-slate-400 mb-1" />
                      <span>Terminated Normally</span>
                    </div>
                  ) : (
                    <div className="aspect-4/3 w-full rounded bg-emerald-50/60 border border-dashed border-emerald-300 flex flex-col items-center justify-center text-center p-2 text-[10px] text-emerald-800">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping mb-2" />
                      <span className="font-bold">Active Live Session</span>
                      <span className="text-[9px] text-emerald-600 mt-1">
                        Camera capture will execute upon clicking Sign Out
                      </span>
                    </div>
                  )}
                  <div className="text-[10px] text-[#475569] font-mono">
                    Timestamp:{" "}
                    <strong className="text-[#0F172A]">
                      {selectedSessionForInspection.logoutTime || "Session In Progress"}
                    </strong>
                  </div>
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
                  { label: "Accounting (Desk #13)", value: "accounting" },
                  { label: "Showroom Sales & Orders (Desk #03)", value: "sales" },
                  { label: "Master Workshop & Service (Desk #04)", value: "service" },
                  { label: "Spare Parts & Accessories (Desk #05)", value: "parts" },
                  { label: "Finance (Desk #06)", value: "financing" },
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

              <MasterDropdown
                category="hubs"
                label="Showroom / Facility Node"
                value={newStaffBranch}
                onChange={(val) => setNewStaffBranch(String(val))}
                required
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

      {/* Staff Mandatory Login Biometric Face Capture Security Gate */}
      <BiometricFaceCaptureModal
        isOpen={isBiometricGateOpen}
        mode="login"
        isMandatory={true}
        user={{
          name: activeRole.userName,
          email: activeRole.email,
          role: activeRole.name,
          department: activeRole.department,
        }}
        onCaptureSuccess={(photo, timestamp) => {
          recordLoginBiometric(
            {
              name: activeRole.userName,
              email: activeRole.email,
              role: activeRole.name,
              department: activeRole.department,
            },
            photo,
            timestamp
          );
          setIsBiometricGateOpen(false);
          setSessionLogs(getAllSessionAuditLogs());
          showToast("Biometric facial verification confirmed. Dashboard access authorized.");
        }}
      />
    </DashboardLayout>
  );
}
