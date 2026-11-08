"use client";

import React, { Suspense, useMemo } from "react";
import { useParams } from "next/navigation";
import { ERPConsoleContent } from "@/components/ERPConsoleContent";

const ADMIN_PAGE_MAPPING: Record<string, string> = {
  dashboard: "Dashboard",
  overview: "Dashboard",
  portals: "Department Portals & Accounts",
  "department-portals": "Department Portals & Accounts",
  accounts: "Department Portals & Accounts",
  roles: "Department Portals & Accounts",
  inventory: "Car Management",
  cars: "Car Management",
  transfers: "Branch Transfers",
  documents: "Document Vault",
  vault: "Document Vault",
  cms: "CMS Manager",
  settings: "Settings",
  profile: "My Profile",
  sessions: "Session History",
  "session-history": "Session History",
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

