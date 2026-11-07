"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
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
};

export default function ERPConsoleModulePage() {
  const params = useParams();
  const moduleSlug = typeof params?.module === "string" ? params.module : "dashboard";

  const resolvedModule = useMemo(() => {
    return MODULE_MAPPING[moduleSlug] || "Dashboard";
  }, [moduleSlug]);

  return <ERPConsoleContent key={resolvedModule} initialModule={resolvedModule} />;
}

