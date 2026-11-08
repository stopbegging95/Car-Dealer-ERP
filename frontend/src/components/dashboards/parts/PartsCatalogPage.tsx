"use client";

import React from "react";
import { FiPlus } from "react-icons/fi";
import { Button, Badge, Card } from "@/components/ui";

export interface PartsCatalogPageProps {
  showToast: (msg: string) => void;
}

export const PartsCatalogPage: React.FC<PartsCatalogPageProps> = ({ showToast }) => {
  return (
    <Card className="space-y-3 shadow-xs p-4 sm:p-5">
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-[#E2E8F0] border-b">
        <div>
          <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">Parts & Accessories Master Catalog</h3>
          <p className="text-[#64748B] text-[11px]">OEM genuine parts, styling packages, and consumable inventory</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => showToast("Opening SKU intake registration dialog.")}
          leftIcon={<FiPlus className="w-3.5 h-3.5 text-[#FFFFFF]" />}
        >
          Register Part SKU
        </Button>
      </div>

      <div className="space-y-2 text-xs">
        {[
          { sku: "PRT-MB-9912", name: "Maybach 22-Inch Forged Monoblock Wheel (Set)", oem: "Mercedes-Benz OEM", qty: "3 Sets in Stock", price: "$14,500", status: "In Stock" },
          { sku: "PRT-PO-8810", name: "PCCB Carbon Ceramic Brake Rotor Kit", oem: "Porsche Motorsport", qty: "2 Kits Left", price: "$22,000", status: "Low Stock Alert" },
          { sku: "PRT-RR-4401", name: "Autobiography Deployable Side Steps", oem: "Land Rover Genuine", qty: "5 Sets in Stock", price: "$6,200", status: "In Stock" },
          { sku: "PRT-MB-3309", name: "G63 AMG Night Package II Radiator Grille", oem: "Mercedes-AMG", qty: "1 Unit Left", price: "$3,800", status: "Reorder Triggered" },
        ].map((part, pi) => (
          <div key={pi} className="flex sm:flex-row flex-col justify-between sm:items-center gap-2.5 bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#2563EB]">{part.sku}</span>
                <span className="font-bold text-[#0F172A]">{part.name}</span>
              </div>
              <span className="block mt-0.5 text-[#64748B] text-[11px]">
                {part.oem} &bull; <strong className="text-[#0F172A]">{part.qty}</strong>
              </span>
            </div>
            <div className="flex items-center self-end sm:self-auto gap-3">
              <span className="font-mono font-bold text-[#0F172A] text-sm">{part.price}</span>
              <Badge variant={part.status === "In Stock" ? "gold" : "charcoal"} size="sm">
                {part.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

