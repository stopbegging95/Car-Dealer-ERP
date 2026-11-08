"use client";

import React, { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ERPConsoleContent } from "@/components/ERPConsoleContent";

const MODULE_MAPPING: Record<string, string> = {
  dashboard: "Dashboard",
  admin: "Dashboard",
  inventory: "Car Management",
  vehicles: "Car Management",
  "vehicles-inventory": "Car Management",
  sales: "Orders & Sales",
  orders: "Orders & Sales",
  "sales-orders": "Orders & Sales",
  procurement: "Procurement",
  purchasing: "Procurement",
  sourcing: "Procurement",
  "procurement-purchasing": "Procurement",
  service: "Service & Workshop",
  workshop: "Service & Workshop",
  maintenance: "Service & Workshop",
  "service-maintenance": "Service & Workshop",
  parts: "Parts & Inventory",
  accessories: "Parts & Inventory",
  "parts-accessories": "Parts & Inventory",
  financing: "Finance",
  fi: "Finance",
  insurance: "Finance",
  recon: "Detailing & Recon",
  detailing: "Detailing & Recon",
  pdi: "Detailing & Recon",
  inspection: "Inspection & Quality",
  qa: "Inspection & Quality",
  "inspection-qa": "Inspection & Quality",
  "inspection-quality": "Inspection & Quality",
  imports: "Import Logistics",
  logistics: "Import Logistics",
  customs: "Import Logistics",
  shipping: "Import Logistics",
  "importation-logistics": "Import Logistics",
  "trade-ins": "Trade-In & Swap",
  "trade-in": "Trade-In & Swap",
  tradein: "Trade-In & Swap",
  appraisal: "Trade-In & Swap",
  crm: "CRM Pipeline & 360",
  clients: "CRM Pipeline & 360",
  customers: "CRM Pipeline & 360",
  finance: "Accounting",
  accounting: "Accounting",
  audit: "Accounting",
  invoices: "Invoices & Payments",
  payments: "Invoices & Payments",
  "invoices-payments": "Invoices & Payments",
  "financial-reports": "Financial Reports",
  pnl: "Financial Reports",
  transfers: "Branch Transfers",
  branches: "Branch Transfers",
  operations: "Branch Transfers",
  yard: "Branch Transfers",
  "branches-operations": "Branch Transfers",
  hr: "HR & Recruitment",
  recruitment: "HR & Recruitment",
  staffing: "HR & Recruitment",
  employees: "HR & Recruitment",
  roles: "Department Portals & Accounts",
  portals: "Department Portals & Accounts",
  "department-portals": "Department Portals & Accounts",
  accounts: "Department Portals & Accounts",
  users: "Department Portals & Accounts",
  documents: "Document Vault",
  vault: "Document Vault",
  legal: "Document Vault",
  compliance: "Document Vault",
  cms: "CMS Manager",
  marketing: "CMS Manager",
  media: "CMS Manager",
  reports: "Reports & Analytics",
  analytics: "Reports & Analytics",
  "reports-analytics": "Reports & Analytics",
  settings: "Settings",
  "master-data": "Master Data & Dropdowns",
  dropdowns: "Master Data & Dropdowns",
  taxonomies: "Master Data & Dropdowns",
  profile: "My Profile",
  sessions: "Session History",
  "session-history": "Session History",
};

const MODULE_TO_ROLE: Record<string, string> = {
  dashboard: "admin",
  admin: "admin",
  inventory: "admin",
  vehicles: "admin",
  "vehicles-inventory": "admin",
  sales: "sales",
  orders: "sales",
  "sales-orders": "sales",
  procurement: "procurement",
  purchasing: "procurement",
  sourcing: "procurement",
  "procurement-purchasing": "procurement",
  service: "service",
  workshop: "service",
  maintenance: "service",
  "service-maintenance": "service",
  parts: "parts",
  accessories: "parts",
  "parts-accessories": "parts",
  financing: "financing",
  fi: "financing",
  insurance: "financing",
  recon: "recon",
  detailing: "recon",
  pdi: "recon",
  inspection: "recon",
  qa: "recon",
  "inspection-qa": "recon",
  "inspection-quality": "recon",
  imports: "imports",
  logistics: "imports",
  customs: "imports",
  shipping: "imports",
  "importation-logistics": "imports",
  "trade-ins": "trade-ins",
  "trade-in": "trade-ins",
  tradein: "trade-ins",
  appraisal: "trade-ins",
  crm: "crm",
  clients: "crm",
  customers: "crm",
  finance: "accounting",
  accounting: "accounting",
  audit: "accounting",
  invoices: "accounting",
  payments: "accounting",
  "invoices-payments": "accounting",
  "financial-reports": "accounting",
  pnl: "accounting",
  transfers: "parts",
  branches: "parts",
  operations: "parts",
  yard: "parts",
  "branches-operations": "parts",
  hr: "hr",
  recruitment: "hr",
  staffing: "hr",
  employees: "hr",
  roles: "admin",
  portals: "admin",
  "department-portals": "admin",
  accounts: "admin",
  users: "admin",
  documents: "admin",
  vault: "admin",
  legal: "admin",
  compliance: "admin",
  cms: "cms",
  marketing: "cms",
  media: "cms",
  reports: "admin",
  analytics: "admin",
  "reports-analytics": "admin",
  settings: "admin",
  "master-data": "admin",
  dropdowns: "admin",
  taxonomies: "admin",
  profile: "admin",
  sessions: "admin",
  "session-history": "admin",
};

function ERPConsoleModuleContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const moduleSlug = typeof params?.module === "string" ? params.module : "dashboard";
  const explicitRole = searchParams?.get("role");

  const resolvedModule = useMemo(() => {
    return MODULE_MAPPING[moduleSlug] || "Dashboard";
  }, [moduleSlug]);

  const resolvedRole = useMemo(() => {
    if (explicitRole) return explicitRole;
    return MODULE_TO_ROLE[moduleSlug] || "admin";
  }, [moduleSlug, explicitRole]);

  return (
    <ERPConsoleContent
      key={`${resolvedRole}-${resolvedModule}`}
      initialModule={resolvedModule}
      initialRole={resolvedRole}
    />
  );
}

export default function ERPConsoleModulePage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]" />}>
      <ERPConsoleModuleContent />
    </React.Suspense>
  );
}
