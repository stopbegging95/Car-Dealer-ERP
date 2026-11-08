"use client";

import React from "react";
import { FiPlus, FiEye } from "react-icons/fi";
import { Button, Badge, Table, Card } from "@/components/ui";
import { Vehicle } from "@/data/vehicles";

export interface InventoryPageProps {
  vehicles: Vehicle[];
  onOpenAddVehicle: () => void;
  onPreviewVehicle: (vehicle: Vehicle) => void;
}

export const InventoryPage: React.FC<InventoryPageProps> = ({
  vehicles,
  onOpenAddVehicle,
  onPreviewVehicle,
}) => {
  return (
    <div className="space-y-4">
      <Card className="space-y-0 shadow-xs p-4">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3">
          <div>
            <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">Master Vehicle Fleet Control</h3>
            <p className="text-[#64748B] text-[11px]">Real-time VIN audit, showroom allocations, and status toggles</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenAddVehicle}
            leftIcon={<FiPlus className="w-4 h-4 text-[#FFFFFF]" />}
          >
            Add New Vehicle to Stock
          </Button>
        </div>
      </Card>

      <Table
        data={vehicles}
        keyExtractor={(item) => item.stockId}
        columns={[
          { key: "stockId", header: "Stock ID", sortable: true },
          {
            key: "make",
            header: "Make & Model",
            render: (v) => (
              <div>
                <span className="font-bold text-[#0F172A]">{v.year} {v.make} {v.model}</span>
                <span className="block text-[#64748B] text-[11px]">{v.category} &bull; {v.transmission}</span>
              </div>
            ),
          },
          {
            key: "priceUSD",
            header: "Price (USD)",
            sortable: true,
            render: (v) => (
              <div>
                <span className="font-mono font-bold text-[#0F172A]">${v.priceUSD.toLocaleString()}</span>
                <span className="block font-mono text-[#64748B] text-[10px]">₦{v.priceNGN.toLocaleString()}</span>
              </div>
            ),
          },
          {
            key: "mileage",
            header: "Mileage",
            sortable: true,
            render: (v) => <span className="font-mono text-xs">{v.mileage.toLocaleString()} KM</span>,
          },
          {
            key: "location",
            header: "Showroom Hub",
            render: (v) => <span className="text-xs">{v.location}</span>,
          },
          {
            key: "status",
            header: "Status",
            render: (v) => (
              <Badge variant="gold" size="sm" dot>
                {v.status}
              </Badge>
            ),
          },
          {
            key: "stockId",
            header: "Action",
            render: (v) => (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPreviewVehicle(v)}
                leftIcon={<FiEye className="w-3.5 h-3.5 text-[#2563EB]" />}
              >
                Inspect
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
};

