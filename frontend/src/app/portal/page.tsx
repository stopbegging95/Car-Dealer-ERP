"use client";

import React, { Suspense } from "react";
import { CustomerPortalContent } from "@/components/CustomerPortalContent";

export default function CustomerPortalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]" />}>
      <CustomerPortalContent initialTab="Overview" />
    </Suspense>
  );
}
