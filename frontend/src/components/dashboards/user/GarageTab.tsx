"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button, Badge, Table, Card, Modal } from "@/components/ui";
import { Vehicle } from "@/data/vehicles";
import { FiEye, FiCheck } from "react-icons/fi";

export interface GarageTabProps {
  savedVehicles: Vehicle[];
}

export const GarageTab: React.FC<GarageTabProps> = ({ savedVehicles }) => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  return (
    <div className="space-y-4">
      <Card className="shadow-xs p-4 sm:p-5">
        <div>
          <h3 className="font-bold text-[#0F172A] text-base uppercase tracking-tight">
            My Saved Garage ({savedVehicles.length})
          </h3>
          <p className="text-[#64748B] text-xs">Bookmarked models with real-time price monitoring and verified specifications.</p>
        </div>
      </Card>

      <Table
        data={savedVehicles}
        keyExtractor={(car) => car.stockId}
        pageSize={15}
        showSerialNumber={true}
        columns={[
          {
            key: "stockId",
            header: "Stock ID",
            sortable: true,
            render: (car) => <span className="font-mono font-bold text-[#2563EB] text-xs">{car.stockId}</span>,
          },
          {
            key: "make",
            header: "Make & Model",
            sortable: true,
            render: (car) => (
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-9 rounded-md overflow-hidden bg-[#0F172A] shrink-0 border border-[#E2E8F0]">
                  <Image src={car.image} alt={car.model} fill unoptimized className="object-cover" />
                </div>
                <div>
                  <span className="font-bold text-[#0F172A] text-xs">{car.year} {car.make} {car.model}</span>
                  <span className="block text-[#64748B] text-[10px]">{car.trim}</span>
                </div>
              </div>
            ),
          },
          {
            key: "category",
            header: "Category & Drivetrain",
            sortable: true,
            render: (car) => (
              <div>
                <span className="font-medium text-[#475569] text-xs">{car.category}</span>
                <span className="block text-[#64748B] text-[10px]">{car.transmission} &bull; {car.fuel}</span>
              </div>
            ),
          },
          {
            key: "priceNGN",
            header: "Price (₦ NGN)",
            sortable: true,
            render: (car) => (
              <span className="font-mono font-bold text-[#1D4ED8] text-xs">₦{car.priceNGN.toLocaleString()}</span>
            ),
          },
          {
            key: "mileage",
            header: "Mileage",
            sortable: true,
            render: (car) => <span className="font-mono text-[#475569] text-xs">{car.mileage.toLocaleString()} KM</span>,
          },
          {
            key: "location",
            header: "Showroom Hub",
            render: (car) => <span className="text-[#475569] text-xs">{car.location}</span>,
          },
          {
            key: "status",
            header: "Status",
            render: (car) => <Badge variant="gold" size="sm">{car.status}</Badge>,
          },
          {
            key: "actions",
            header: "Action",
            render: (car) => (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedVehicle(car)}
                leftIcon={<FiEye className="w-3.5 h-3.5 text-[#2563EB]" />}
              >
                Inspect
              </Button>
            ),
          },
        ]}
      />

      {/* In-Place Vehicle Inspection Modal */}
      {selectedVehicle && (
        <Modal
          isOpen={!!selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          size="lg"
          title={`${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`}
          description={`Stock ID: ${selectedVehicle.stockId} • Certified Showroom Inventory`}
        >
          <div className="space-y-4">
            <div className="relative w-full h-56 rounded-xl overflow-hidden bg-[#0F172A] border border-[#CBD5E1]">
              <Image
                src={selectedVehicle.image}
                alt={selectedVehicle.model}
                fill
                unoptimized
                className="object-cover"
              />
              <div className="top-3 left-3 absolute">
                <Badge variant="gold" size="sm">{selectedVehicle.status}</Badge>
              </div>
            </div>

            <div className="gap-3 grid grid-cols-1 sm:grid-cols-3 text-xs">
              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                <span className="block text-[10px] text-[#64748B] uppercase">Dealership Price (₦ NGN)</span>
                <span className="font-mono font-bold text-[#1D4ED8] text-sm">₦{selectedVehicle.priceNGN.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                <span className="block text-[10px] text-[#64748B] uppercase">Odometer</span>
                <span className="font-mono font-bold text-[#0F172A] text-sm">{selectedVehicle.mileage.toLocaleString()} KM</span>
              </div>
              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                <span className="block text-[10px] text-[#64748B] uppercase">Location</span>
                <span className="font-bold text-[#0F172A] text-xs truncate">{selectedVehicle.location}</span>
              </div>
            </div>

            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-2">
              <h5 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">Mechanical & Exterior Dossier</h5>
              <div className="grid grid-cols-2 gap-2 text-[#475569]">
                <div>Engine / Trim: <strong>{selectedVehicle.trim}</strong></div>
                <div>Category: <strong>{selectedVehicle.category}</strong></div>
                <div>Transmission: <strong>{selectedVehicle.transmission}</strong></div>
                <div>Fuel Type: <strong>{selectedVehicle.fuel}</strong></div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" onClick={() => setSelectedVehicle(null)}>
                Close Dossier
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
