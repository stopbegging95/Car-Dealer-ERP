"use client";

import React, { useState } from "react";
import { FiPlus, FiCheck } from "react-icons/fi";
import { Button, Badge, Card, Modal, Input, Dropdown, MasterDropdown, Table } from "@/components/ui";
import { partsApi } from "@/lib/api";

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
    { sku: "PRT-MB-9912", name: "Maybach 22-Inch Forged Monoblock Wheel (Set)", oem: "Mercedes-Benz OEM", qty: "3 Sets in Stock", price: "₦22,475,000", status: "In Stock" },
    { sku: "PRT-PO-8810", name: "PCCB Carbon Ceramic Brake Rotor Kit", oem: "Porsche Motorsport", qty: "2 Kits Left", price: "₦34,100,000", status: "Low Stock Alert" },
    { sku: "PRT-RR-4401", name: "Autobiography Deployable Side Steps", oem: "Land Rover Genuine", qty: "5 Sets in Stock", price: "₦9,610,000", status: "In Stock" },
    { sku: "PRT-MB-3309", name: "G63 AMG Night Package II Radiator Grille", oem: "Mercedes-AMG", qty: "1 Unit Left", price: "₦5,890,000", status: "Reorder Triggered" },
  ]);

  // Fetch live parts inventory from MongoDB API
  React.useEffect(() => {
    let isMounted = true;
    partsApi.getAll().then((res) => {
      if (res.success && res.data?.parts && Array.isArray(res.data.parts) && res.data.parts.length > 0) {
        if (isMounted) {
          const apiParts: PartCatalogItem[] = res.data.parts.map((p: any) => ({
            sku: p.partNumber || p.sku || `PRT-${Date.now().toString().slice(-4)}`,
            name: p.partName || p.name,
            oem: p.brand || p.oem || "Genuine OEM",
            qty: `${p.quantityInStock || 0} Units in Stock`,
            price: `₦${(p.unitPriceNGN || 0).toLocaleString()}`,
            status: (p.quantityInStock || 0) > 3 ? "In Stock" : (p.quantityInStock || 0) > 0 ? "Low Stock Alert" : "Out of Stock",
          }));
          setParts(apiParts);
        }
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [oem, setOem] = useState("Mercedes-AMG Genuine");
  const [qty, setQty] = useState("5");
  const [price, setPrice] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    const priceNum = Number(price.replace(/[^0-9]/g, "") || 0);
    const generatedSku = sku || `PRT-GEN-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEntry: PartCatalogItem = {
      sku: generatedSku,
      name,
      oem,
      qty: `${qty} Units in Stock`,
      price: `₦${priceNum.toLocaleString()}`,
      status: "In Stock",
    };

    // Save to Database
    partsApi.create({
      partNumber: generatedSku,
      partName: name,
      brand: oem,
      quantityInStock: Number(qty) || 1,
      unitPriceNGN: priceNum,
      category: "OEM Accessories",
    }).catch(() => {});

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
            <MasterDropdown
              category="makes"
              label="OEM Brand / Manufacturer"
              value={oem}
              onChange={(val) => setOem(String(val))}
              required
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
              label="Selling Price (₦ NGN)"
              type="text"
              placeholder="e.g. 13,500,000"
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

      <Table
        data={parts}
        keyExtractor={(part) => part.sku}
        pageSize={15}
        showSerialNumber={true}
        columns={[
          {
            key: "sku",
            header: "SKU / Part Code",
            sortable: true,
            render: (part) => (
              <span className="font-mono font-bold text-[#2563EB]">{part.sku}</span>
            ),
          },
          {
            key: "name",
            header: "Part Description & Spec",
            sortable: true,
            render: (part) => <span className="font-bold text-[#0F172A]">{part.name}</span>,
          },
          {
            key: "oem",
            header: "OEM Manufacturer",
            sortable: true,
            render: (part) => <span className="text-xs text-[#475569]">{part.oem}</span>,
          },
          {
            key: "qty",
            header: "Warehouse Stock",
            sortable: true,
            render: (part) => (
              <span className="font-mono text-xs font-semibold text-[#0F172A]">{part.qty}</span>
            ),
          },
          {
            key: "price",
            header: "Retail Price (₦ NGN)",
            sortable: true,
            render: (part) => (
              <span className="font-mono font-bold text-[#1D4ED8]">{part.price}</span>
            ),
          },
          {
            key: "status",
            header: "Inventory Status",
            align: "right",
            render: (part) => (
              <Badge
                variant={
                  part.status === "In Stock"
                    ? "gold"
                    : part.status.includes("Low")
                    ? "charcoal"
                    : "warmGold"
                }
                size="sm"
              >
                {part.status}
              </Badge>
            ),
          },
        ]}
      />
    </Card>
  );
};

