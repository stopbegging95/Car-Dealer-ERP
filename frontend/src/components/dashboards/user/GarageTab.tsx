"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Badge } from "@/components/ui";
import { Vehicle } from "@/data/vehicles";

export interface GarageTabProps {
  savedVehicles: Vehicle[];
}

export const GarageTab: React.FC<GarageTabProps> = ({ savedVehicles }) => {
  return (
    <div className="space-y-4">
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3 bg-[#FFFFFF] shadow-sm p-4 border border-[#E2E8F0] rounded-2xl">
        <div>
          <h3 className="font-bold text-[#0F172A] text-base uppercase tracking-tight">
            My Saved Garage ({savedVehicles.length})
          </h3>
          <p className="text-[#64748B] text-xs">Bookmarked models with real-time price monitoring and comparison.</p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/services/compare">
            <Button variant="outline" size="sm">
              Compare All {savedVehicles.length} Vehicles
            </Button>
          </Link>
          <Link href="/inventory">
            <Button variant="primary" size="sm">
              Browse More Cars
            </Button>
          </Link>
        </div>
      </div>

      <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
        {savedVehicles.map((car) => (
          <div
            key={car.stockId}
            className="flex flex-col justify-between bg-[#FFFFFF] shadow-sm hover:shadow-md border hover:border-[#2563EB] border-[#E2E8F0] rounded-2xl overflow-hidden transition-all"
          >
            <div>
              <div className="relative bg-[#0F172A] w-full h-44">
                <Image
                  src={car.image}
                  alt={car.model}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  unoptimized
                  className="object-cover"
                />
                <div className="top-2.5 left-2.5 absolute">
                  <span className="bg-[#000000]/85 px-2 py-0.5 border border-white/20 rounded font-bold font-mono text-[10px] text-white">
                    {car.stockId}
                  </span>
                </div>
                <div className="top-2.5 right-2.5 absolute">
                  <Badge variant="gold" size="sm">
                    {car.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1.5 p-4">
                <div className="font-bold text-[#2563EB] text-[10px] uppercase tracking-wider">
                  {car.category}
                </div>
                <h4 className="font-bold text-[#0F172A] text-sm truncate">
                  {car.make} {car.model}
                </h4>
                <p className="text-[#64748B] text-xs truncate">{car.trim}</p>

                <div className="flex justify-between items-center pt-2 border-t border-[#E2E8F0] font-bold font-mono text-[#1D4ED8] text-xs">
                  <span>${car.priceUSD.toLocaleString()}</span>
                  <span className="font-normal text-[#64748B] text-[11px]">{car.year} &bull; {car.mileage.toLocaleString()} KM</span>
                </div>
              </div>
            </div>

            <div className="gap-2 grid grid-cols-2 p-4 pt-0">
              <Link href={`/inventory/${car.stockId}`} className="w-full">
                <Button variant="primary" size="sm" fullWidth>
                  Details
                </Button>
              </Link>
              <Link href={`/services/loan-calculator?price=${car.priceUSD}`} className="w-full">
                <Button variant="outline" size="sm" fullWidth>
                  Finance
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

