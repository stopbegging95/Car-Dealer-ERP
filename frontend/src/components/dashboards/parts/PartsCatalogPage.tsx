"use client";

import React, { useState } from "react";
import { FiPlus, FiCheck } from "react-icons/fi";
import { Button, Badge, Card, Modal, Input, Dropdown } from "@/components/ui";

export interface PartCatalogItem {
  sku: string;
  name: string;
  oem: string;
  qty: string;
  price: string;
  status: string;
}

export interface PartsCatalogPageProps {
  showToast: (msg: string) => void;
}

export const PartsCatalogPage: React.FC<PartsCatalogPageProps> = ({ showToast }) => {
  const [parts, setParts] = useState<PartCatalogItem[]>([
    { sku: "PRT-MB-9912", name: "Maybach 22-Inch Forged Monoblock Wheel (Set)", oem: "Mercedes-Benz OEM", qty: "3 Sets in Stock", price: "$14,500", status: "In Stock" },
    { sku: "PRT-PO-8810", name: "PCCB Carbon Ceramic Brake Rotor Kit", oem: "Porsche Motorsport", qty: "2 Kits Left", price: "$22,000", status: "Low Stock Alert" },
    { sku: "PRT-RR-4401", name: "Autobiography Deployable Side Steps", oem: "Land Rover Genuine", qty: "5 Sets in Stock", price: "$6,200", status: "In Stock" },
    { sku: "PRT-MB-3309", name: "G63 AMG Night Package II Radiator Grille", oem: "Mercedes-AMG", qty: "1 Unit Left", price: "$3,800", status: "Reorder Triggered" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [oem, setOem] = useState("Mercedes-AMG Genuine");
  const [qty, setQty] = useState("5");
  const [price, setPrice] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    const newEntry: PartCatalogItem = {
      sku: sku || `PRT-GEN-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      oem,
      qty: `${qty} Units in Stock`,
      price: `$${Number(price.replace(/[^0-9]/g, "") || 0).toLocaleString()}`,
      status: "In Stock",
    };
    setParts([newEntry, ...parts]);
    setIsModalOpen(false);
    showToast(`Registered SKU ${newEntry.sku} (${name}) into parts inventory.`);
    setName("");
    setPrice("");
    setSku("");
  };

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
          onClick={() => setIsModalOpen(true)}
          leftIcon={<FiPlus className="w-3.5 h-3.5 text-[#FFFFFF]" />}
        >
          Register Part SKU
        </Button>
      </div>

      {/* Modal for Registering New Part SKU */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New OEM Part / Accessory in Stock"
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-3">
          <Input
            label="Part Description & Specification"
            placeholder="e.g. Maybach 22-Inch Forged Wheel Set"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="SKU / Part Code"
              placeholder="e.g. PRT-MB-9915"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
            <Dropdown
              label="OEM Brand"
              options={[
                { label: "Mercedes-Benz OEM", value: "Mercedes-Benz OEM" },
                { label: "Mercedes-AMG Genuine", value: "Mercedes-AMG Genuine" },
                { label: "Porsche Motorsport", value: "Porsche Motorsport" },
                { label: "Land Rover Genuine", value: "Land Rover Genuine" },
                { label: "Brembo Racing", value: "Brembo Racing" },
              ]}
              value={oem}
              onChange={(val) => setOem(String(val))}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Intake Stock Quantity"
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              required
            />
            <Input
              label="Selling Price ($)"
              type="text"
              placeholder="e.g. 8,500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" leftIcon={<FiCheck />}>
              Add to Catalog & Warehouse Bin
            </Button>
          </div>
        </form>
      </Modal>

      <div className="space-y-2 text-xs">
        {parts.map((part, pi) => (
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

