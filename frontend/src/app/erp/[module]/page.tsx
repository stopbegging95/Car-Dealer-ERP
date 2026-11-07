"use client";

import React, { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ERPConsoleContent } from "../page";

const MODULE_MAPPING: Record<string, string> = {
  dashboard: "Dashboard",
  inventory: "Car Management",
  transfers: "Branch Transfers",
  sales: "Orders & Sales",
  service: "Service & Workshop",
  workshop: "Service & Workshop",
  parts: "Parts & Inventory",
  financing: "Finance & Insurance",
  recon: "Detailing & Recon",
  detailing: "Detailing & Recon",
  imports: "Import Logistics",
  "trade-ins": "Trade-In & Swap",
  crm: "CRM Pipeline & 360",
  finance: "Accounting & Finance",
  hr: "HR & Recruitment",
  roles: "Roles & RBAC",
  documents: "Document Vault",
  cms: "CMS Manager",
  settings: "Settings",
  profile: "My Profile",
  sessions: "Session History",
  "session-history": "Session History",
};

const MODULE_TO_ROLE: Record<string, string> = {
  dashboard: "admin",
  inventory: "admin",
  transfers: "parts",
  sales: "sales",
  service: "service",
  workshop: "service",
  parts: "parts",
  financing: "financing",
  recon: "recon",
  detailing: "recon",
  imports: "imports",
  "trade-ins": "trade-ins",
  crm: "crm",
  finance: "finance",
  hr: "hr",
  roles: "admin",
  documents: "admin",
  cms: "cms",
  settings: "admin",
  profile: "admin",
  sessions: "admin",
  "session-history": "admin",
};

export default function ERPConsoleModulePage() {
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
