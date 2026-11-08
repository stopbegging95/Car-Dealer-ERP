"use client";

import React from "react";
import { Button, Input, Dropdown, Card } from "@/components/ui";

export interface CMSPageProps {
  showToast: (msg: string) => void;
}

export const CMSPage: React.FC<CMSPageProps> = ({ showToast }) => {
  return (
    <div className="space-y-4">
      <Card className="space-y-3 shadow-xs p-4 sm:p-5">
        <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">Website Content & Promotions Manager</h3>
        <div className="gap-3 grid grid-cols-1 sm:grid-cols-3 text-xs">
          <div className="space-y-2 bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
            <span className="block font-bold text-[#0F172A]">Homepage Hero Headline</span>
            <Input defaultValue="DRIVE YOUR DREAM CAR" />
            <Button variant="primary" size="sm" onClick={() => showToast("Hero headline updated successfully!")}>
              Update Hero
            </Button>
          </div>
          <div className="space-y-2 bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
            <span className="block font-bold text-[#0F172A]">Featured Showcase Cars</span>
            <Dropdown
              label="Pinned Vehicle"
              options={[
                { label: "Mercedes Maybach S580", value: "STK-2026-001" },
                { label: "Porsche 911 Turbo S", value: "STK-2026-002" },
              ]}
              onChange={() => {}}
            />
            <Button variant="outline" size="sm" onClick={() => showToast("Vehicle pinned to public featured showcase.")}>
              Pin to Featured
            </Button>
          </div>
          <div className="space-y-2 bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
            <span className="block font-bold text-[#0F172A]">Publish Announcement</span>
            <Input placeholder="Headline..." />
            <Button variant="primary" size="sm" onClick={() => showToast("Announcement published to live website news feed!")}>
              Publish to News
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

