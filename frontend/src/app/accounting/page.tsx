"use client";

import React, { Suspense } from "react";
import { ERPConsoleContent } from "@/components/ERPConsoleContent";

export default function AccountingPage() {
  return (
    <Suspense fallback={<div className="bg-[#F8FAFC] min-h-screen" />}>
      <ERPConsoleContent initialRole="finance" initialModule="Accounting & Finance" />
    </Suspense>
  );
}

