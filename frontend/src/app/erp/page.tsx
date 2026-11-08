"use client";

import React, { Suspense } from "react";
import { ERPConsoleContent } from "@/components/ERPConsoleContent";

export default function ERPConsolePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]" />}>
      <ERPConsoleContent />
    </Suspense>
  );
}
