"use client";

import React, { Suspense } from "react";
import { ERPConsoleContent } from "@/components/ERPConsoleContent";

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="bg-[#F8FAFC] min-h-screen" />}>
      <ERPConsoleContent initialRole="admin" initialModule="Dashboard" />
    </Suspense>
  );
}

