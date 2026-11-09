"use client";

import React, { Suspense, useMemo } from "react";
import { useParams } from "next/navigation";
import { ERPConsoleContent } from "@/components/ERPConsoleContent";

const ADMIN_PAGE_MAPPING: Record<string, string> = {
  dashboard: "Dashboard",
  overview: "Dashboard",
  admin: "Dashboard",
  inventory: "Car Management",
  cars: "Car Management",
  vehicles: "Car Management",
  "car-management": "Car Management",
  sales: "Orders & Sales",
  orders: "Orders & Sales",
  "sales-orders": "Orders & Sales",
  procurement: "Procurement",
  purchasing: "Procurement",
  sourcing: "Procurement",
  service: "Service & Workshop",
  workshop: "Service & Workshop",
  maintenance: "Service & Workshop",
  parts: "Parts & Inventory",
  accessories: "Parts & Inventory",
  financing: "Finance",
  fi: "Finance",
  recon: "Detailing & Recon",
  detailing: "Detailing & Recon",
  pdi: "Detailing & Recon",
  inspection: "Inspection & Quality",
  qa: "Inspection & Quality",
  imports: "Import Logistics",
  logistics: "Import Logistics",
  customs: "Import Logistics",
  "trade-ins": "Trade-In & Swap",
  "trade-in": "Trade-In & Swap",
  tradein: "Trade-In & Swap",
  crm: "CRM Pipeline & 360",
  clients: "CRM Pipeline & 360",
  customers: "CRM Pipeline & 360",
  accounting: "Accounting",
  finance: "Accounting",
  audit: "Accounting",
  invoices: "Invoices & Payments",
  payments: "Invoices & Payments",
  "financial-reports": "Financial Reports",
  pnl: "Financial Reports",
  reports: "Reports & Analytics",
  analytics: "Reports & Analytics",
  transfers: "Branch Transfers",
  branches: "Branch Transfers",
  yard: "Branch Transfers",
  hr: "HR & Recruitment",
  recruitment: "HR & Recruitment",
  staffing: "HR & Recruitment",
  portals: "Department Portals & Accounts",
  "department-portals": "Department Portals & Accounts",
  accounts: "Department Portals & Accounts",
  roles: "Department Portals & Accounts",
  documents: "Document Vault",
  vault: "Document Vault",
  legal: "Document Vault",
  "home-banner": "Home Banner",
  "home-banners": "Home Banner",
  banner: "Home Banner",
  banners: "Home Banner",
  cms: "Home Banner",
  marketing: "Home Banner",
  settings: "Settings",
  "master-data": "Master Data & Dropdowns",
  dropdowns: "Master Data & Dropdowns",
  taxonomies: "Master Data & Dropdowns",
  staff: "Personal Staff Dashboard",
  "staff-dashboard": "Personal Staff Dashboard",
  profile: "My Profile",
  sessions: "Session History",
  "session-history": "Session History",
  chat: "Staff Team Chat",
  "team-chat": "Staff Team Chat",
  "staff-chat": "Staff Team Chat",
};

function AdminSubPageContent() {
  const params = useParams();
  const pageSlug = typeof params?.page === "string" ? params.page : "dashboard";
  const resolvedModule = useMemo(() => ADMIN_PAGE_MAPPING[pageSlug] || "Dashboard", [pageSlug]);

  return (
    <ERPConsoleContent
      key={`admin-${resolvedModule}`}
      initialRole="admin"
      initialModule={resolvedModule}
    />
  );
}

export default function AdminSubPage() {
  return (
    <Suspense fallback={<div className="bg-[#F8FAFC] min-h-screen" />}>
      <AdminSubPageContent />
    </Suspense>
  );
}

