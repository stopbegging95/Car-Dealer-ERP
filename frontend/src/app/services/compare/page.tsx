"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiColumns,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button, Toggle, Dropdown } from "@/components/ui";
import { VEHICLES, Vehicle } from "@/data/vehicles";

export default function CompareCarsPage() {
  // Selected vehicles to compare (default to first 3)
  const [selectedStockIds, setSelectedStockIds] = useState<string[]>([
    "STK-2026-001",
    "STK-2026-002",
    "STK-2026-003",
  ]);
  const [highlightDifferences, setHighlightDifferences] = useState<boolean>(true);

  const selectedVehicles: Vehicle[] = selectedStockIds
    .map((id) => VEHICLES.find((v) => v.stockId === id))
    .filter((v): v is Vehicle => Boolean(v));

  const availableToAdd = VEHICLES.filter(
    (v) => !selectedStockIds.includes(v.stockId)
  );

  const handleRemove = (stockId: string) => {
    if (selectedStockIds.length <= 1) return;
    setSelectedStockIds(selectedStockIds.filter((id) => id !== stockId));
  };

  const handleAddVehicle = (stockId: string) => {
    if (selectedStockIds.length >= 4) return;
    setSelectedStockIds([...selectedStockIds, stockId]);
  };

  const specRows = [
    { label: "Price (USD)", key: "priceUSD", format: (v: Vehicle) => `$${v.priceUSD.toLocaleString()}` },
    { label: "Year & Model", key: "year", format: (v: Vehicle) => `${v.year} ${v.model}` },
    { label: "Category", key: "category", format: (v: Vehicle) => v.category },
    { label: "Engine / Powertrain", key: "engine", format: (v: Vehicle) => v.engine },
    { label: "Horsepower", key: "horsepower", format: (v: Vehicle) => `${v.horsepower} HP` },
    { label: "Transmission", key: "transmission", format: (v: Vehicle) => v.transmission },
    { label: "Fuel Type", key: "fuel", format: (v: Vehicle) => v.fuel },
    { label: "Mileage", key: "mileage", format: (v: Vehicle) => `${v.mileage.toLocaleString()} KM` },
    { label: "Condition", key: "condition", format: (v: Vehicle) => v.condition },
    { label: "Exterior Color", key: "exteriorColor", format: (v: Vehicle) => v.exteriorColor },
    { label: "Interior Trim", key: "interiorColor", format: (v: Vehicle) => v.interiorColor },
    { label: "Location", key: "location", format: (v: Vehicle) => v.location },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#2563EB] selection:text-[#FFFFFF]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-xs font-bold mb-2">
              <FiColumns className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Multi-Vehicle Comparison Matrix</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0F172A] uppercase tracking-tight">
              Compare Vehicles Side-by-Side
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Review specifications, performance numbers, and features across up to 4 models simultaneously.
            </p>
          </div>

          {/* Controls Strip: Highlight Differences & Add vehicle */}
          <div className="flex flex-wrap items-center gap-4">
            <Toggle
              checked={highlightDifferences}
              onChange={setHighlightDifferences}
              label="Highlight Differences"
            />

            {selectedStockIds.length < 4 && availableToAdd.length > 0 && (
              <div className="w-56">
                <Dropdown
                  placeholder="+ Add Vehicle to Compare"
                  options={availableToAdd.map((v) => ({
                    label: `${v.make} ${v.model} (${v.year})`,
                    value: v.stockId,
                  }))}
                  onChange={(val) => handleAddVehicle(String(val))}
                />
              </div>
            )}
          </div>
        </div>

        {/* Comparison Matrix Table Card */}
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              {/* Header Row: Vehicle Cards with Image & Quick Actions */}
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="p-4 w-44 align-top text-xs uppercase font-bold text-[#2563EB]">
                    Selected Models ({selectedVehicles.length}/4)
                  </th>
                  {selectedVehicles.map((car) => (
                    <th key={car.stockId} className="p-4 align-top w-64 border-l border-[#E2E8F0]">
                      <div className="space-y-2.5">
                        <div className="relative w-full h-36 rounded-xl overflow-hidden bg-[#0F172A] border border-[#E2E8F0]">
                          <Image src={car.image} alt={car.model} fill sizes="(max-width: 768px) 100vw, 256px" className="object-cover" />
                          {selectedVehicles.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemove(car.stockId)}
                              aria-label="Remove vehicle"
                              className="absolute top-2 right-2 p-1 rounded-full bg-[#0F172A]/85 text-[#FFFFFF] hover:text-red-400 border border-white/20"
                            >
                              <FiX className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>

                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#2563EB] font-bold">
                            {car.stockId}
                          </span>
                          <h4 className="text-sm font-bold text-[#0F172A] truncate">
                            {car.make} {car.model}
                          </h4>
                          <div className="text-base font-extrabold font-mono text-[#1D4ED8]">
                            ${car.priceUSD.toLocaleString()}
                          </div>
                        </div>

                        <Link href={`/inventory/${car.stockId}`}>
                          <Button variant="primary" size="sm" fullWidth>
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Specification Comparison Rows */}
              <tbody className="divide-y divide-[#F1F5F9] text-xs">
                {specRows.map((spec) => {
                  // Determine if values differ across selected cars
                  const values = selectedVehicles.map((c) => spec.format(c));
                  const isDifferent = new Set(values).size > 1;

                  return (
                    <tr
                      key={spec.key}
                      className={`transition-colors ${
                        highlightDifferences && isDifferent
                          ? "bg-[#EFF6FF] font-semibold text-[#1D4ED8]"
                          : "hover:bg-[#F8FAFC]"
                      }`}
                    >
                      <td className="p-3.5 text-[#64748B] font-semibold">
                        {spec.label}
                      </td>
                      {selectedVehicles.map((car) => (
                        <td
                          key={car.stockId}
                          className="p-3.5 border-l border-[#E2E8F0] font-mono text-[#0F172A]"
                        >
                          {spec.format(car)}
                        </td>
                      ))}
                    </tr>
                  );
                })}

                {/* Features Row */}
                <tr className="hover:bg-[#F8FAFC]">
                  <td className="p-3.5 text-[#64748B] font-semibold align-top">
                    Standard Equipment
                  </td>
                  {selectedVehicles.map((car) => (
                    <td
                      key={car.stockId}
                      className="p-3.5 border-l border-[#E2E8F0] align-top text-xs space-y-1.5"
                    >
                      {car.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[#334155]">
                          <FiCheck className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                          <span className="text-[11px] font-medium">{feat}</span>
                        </div>
                      ))}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
