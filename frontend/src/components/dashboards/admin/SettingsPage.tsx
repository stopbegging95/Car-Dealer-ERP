"use client";

import React from "react";
import { Button, Badge, Input, Card } from "@/components/ui";

export interface SettingsPageProps {
  showToast: (msg: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ showToast }) => {
  return (
    <div className="space-y-4">
      <Card className="space-y-3 shadow-xs p-4 sm:p-5">
        <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">Platform & Branch Configurations</h3>
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 text-xs">
          <div className="space-y-2 bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
            <span className="block font-bold text-[#0F172A]">Financial Parameters</span>
            <Input label="USD to NGN Exchange Rate" defaultValue="1500" />
            <Input label="VAT / Sales Tax (%)" defaultValue="7.5" />
            <Input label="Reservation Deposit Lockout (Hours)" defaultValue="48" />
          </div>
          <div className="space-y-2 bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
            <span className="block font-bold text-[#0F172A]">Showroom Hubs</span>
            <div className="space-y-1.5 text-[#475569] text-[11px]">
              <div className="flex justify-between bg-[#FFFFFF] shadow-xs p-2 border border-[#E2E8F0] rounded-md">
                <span>Lagos Victoria Island (HQ Flagship)</span>
                <Badge variant="gold" size="sm">Active</Badge>
              </div>
              <div className="flex justify-between bg-[#FFFFFF] shadow-xs p-2 border border-[#E2E8F0] rounded-md">
                <span>Abuja Maitama Diplomatic Suite</span>
                <Badge variant="gold" size="sm">Active</Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-2">
          <Button variant="primary" size="sm" onClick={() => showToast("Settings saved successfully!")}>
            Save System Parameters
          </Button>
        </div>
      </Card>
    </div>
  );
};

