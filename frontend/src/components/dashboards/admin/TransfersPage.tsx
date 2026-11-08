"use client";

import React from "react";
import { FiNavigation } from "react-icons/fi";
import { Button, Badge, Card } from "@/components/ui";

export interface TransfersPageProps {
  onOpenTransferModal: () => void;
}

export const TransfersPage: React.FC<TransfersPageProps> = ({ onOpenTransferModal }) => {
  return (
    <div className="space-y-4">
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3 bg-[#FFFFFF] shadow-xs p-4 border border-[#E2E8F0] rounded-md">
        <div>
          <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">Inter-Showroom Branch Logistics</h3>
          <p className="text-[#64748B] text-[11px]">Real-time transit manifests between Lagos HQ and Abuja Diplomatic Suite</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={onOpenTransferModal}
          leftIcon={<FiNavigation className="w-4 h-4 text-[#FFFFFF]" />}
        >
          Dispatch New Carrier
        </Button>
      </div>

      <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
        <Card className="space-y-3 shadow-xs p-4">
          <div className="flex justify-between items-center">
            <span className="font-mono font-bold text-[#2563EB] text-xs">TRF-2026-088</span>
            <Badge variant="gold" size="sm">En Route (Express Hauler)</Badge>
          </div>
          <div className="space-y-1">
            <div className="font-bold text-[#0F172A] text-sm">Mercedes-Benz Maybach S580</div>
            <div className="text-[#64748B] text-xs">Origin: Lagos Victoria Island &rarr; Dest: Abuja Maitama Suite</div>
            <div className="text-[#64748B] text-[11px]">Carrier: Direct Luxury Flatbed #04 &bull; Driver: Musa Danladi (+234 803 111 2222)</div>
          </div>
          <div className="bg-[#F1F5F9] rounded-full w-full h-2 overflow-hidden">
            <div className="bg-[#2563EB] rounded-full w-3/4 h-full" />
          </div>
          <div className="flex justify-between font-mono text-[#64748B] text-[10px]">
            <span>Dispatched: Nov 04, 06:00 AM</span>
            <span className="font-bold text-[#2563EB]">ETA: Today, 08:30 PM</span>
          </div>
        </Card>

        <Card className="space-y-3 shadow-xs p-4">
          <div className="flex justify-between items-center">
            <span className="font-mono font-bold text-[#2563EB] text-xs">TRF-2026-089</span>
            <Badge variant="charcoal" size="sm">Staged for Departure</Badge>
          </div>
          <div className="space-y-1">
            <div className="font-bold text-[#0F172A] text-sm">Porsche 911 Turbo S (Guards Red)</div>
            <div className="text-[#64748B] text-xs">Origin: Tin Can Port Bonded Yard &rarr; Dest: Lagos Victoria Island HQ</div>
            <div className="text-[#64748B] text-[11px]">Carrier: Secure Enclosed Transporter #01 &bull; Driver: T. Balogun</div>
          </div>
          <div className="bg-[#F1F5F9] rounded-full w-full h-2 overflow-hidden">
            <div className="bg-[#64748B] rounded-full w-1/4 h-full" />
          </div>
          <div className="flex justify-between font-mono text-[#64748B] text-[10px]">
            <span>Clearance Pass: NCS-SGD-8819</span>
            <span className="font-bold text-[#0F172A]">Departure: Tomorrow, 07:00 AM</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

