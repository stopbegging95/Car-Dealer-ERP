"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { CustomerPortalContent } from "../page";

const TAB_MAPPING: Record<string, string> = {
  dashboard: "Overview",
  garage: "My Garage & Saved Cars",
  enquiries: "Active Test Drives",
  "swap-requests": "Trade-In & Swap Tracker",
  sourcing: "Auto Broker Sourcing",
  customs: "Customs Import Tracker",
  invoices: "Invoices & Receipts",
  profile: "KYC & Verification",
};

export default function CustomerPortalTabPage() {
  const params = useParams();
  const tabSlug = typeof params?.tab === "string" ? params.tab : "dashboard";

  const resolvedTab = useMemo(() => {
    return TAB_MAPPING[tabSlug] || "Overview";
  }, [tabSlug]);

  return <CustomerPortalContent key={resolvedTab} initialTab={resolvedTab} />;
}

