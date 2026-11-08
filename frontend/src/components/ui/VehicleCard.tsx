"use client";

import React from "react";
import Image from "next/image";
import { FiMapPin, FiBarChart2 } from "react-icons/fi";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Vehicle } from "@/data/vehicles";

export interface VehicleCardProps {
  vehicle: Vehicle;
  currency?: "USD" | "NGN";
  onViewDetails?: (vehicle: Vehicle) => void;
  onBookTestDrive?: (vehicle: Vehicle) => void;
  onCompareToggle?: (vehicle: Vehicle) => void;
  isCompared?: boolean;
  viewMode?: "grid" | "list";
  className?: string;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  currency = "USD",
  onViewDetails,
  onBookTestDrive,
  onCompareToggle,
  isCompared = false,
  viewMode = "grid",
  className = "",
}) => {
  const formattedPrice =
    currency === "USD"
      ? `$ ${vehicle.priceUSD.toLocaleString()}`
      : `₦ ${vehicle.priceNGN.toLocaleString()}`;

  const statusVariantMap: Record<string, "gold" | "dark" | "light"> = {
    Available: "gold",
    Reserved: "dark",
    Sold: "dark",
    "In Transit": "light",
    Inspection: "light",
    Clearance: "gold",
  };

  if (viewMode === "list") {
    return (
      <div
        className={`bg-[#0F172A]/85 backdrop-blur-xl border border-white/15 hover:border-[#2563EB] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row gap-4 p-3.5 sm:p-5 group text-[#FFFFFF] ${className}`}
      >
        {/* Thumbnail with Year Badge */}
        <div className="relative w-full md:w-64 h-44 sm:h-48 md:h-auto rounded-xl overflow-hidden shrink-0 bg-[#000000] border border-white/10">
          <Image
            src={vehicle.image}
            alt={`${vehicle.make} ${vehicle.model}`}
            fill
            sizes="(max-width: 768px) 100vw, 256px"
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute top-2.5 left-2.5">
            <span className="px-2.5 py-0.5 rounded-md bg-[#000000]/85 backdrop-blur-md text-[#FFFFFF] font-mono text-[11px] font-bold border border-white/20 shadow-xs">
              {vehicle.year}
            </span>
          </div>
          <div className="absolute top-2.5 right-2.5">
            <Badge variant={statusVariantMap[vehicle.status] || "gold"} size="sm" dot>
              {vehicle.status}
            </Badge>
          </div>
        </div>

        {/* Content Details (Side below/next to image with Transparent Banner Slider Overlay) */}
        <div className="flex-1 flex flex-col justify-between relative bg-[#0F172A]/75 backdrop-blur-md p-3.5 sm:p-5 overflow-hidden rounded-xl border border-white/10">
          {/* Transparent Banner Slider-Style Overlay Stack */}
          <div className="absolute inset-0 bg-[#0F172A]/45 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/60 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-36 h-36 rounded-full bg-[#2563EB]/15 blur-2xl pointer-events-none group-hover:bg-[#2563EB]/25 transition-all duration-500" />

          <div className="relative z-10">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                {vehicle.category}
              </span>
              <span className="text-xs text-[#94A3B8] font-medium flex items-center gap-1.5">
                <FiMapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                {vehicle.location}
              </span>
            </div>

            <h4 className="text-sm sm:text-base md:text-lg font-black text-[#FFFFFF] group-hover:text-[#60A5FA] mt-1 transition-colors">
              {vehicle.make} {vehicle.model}
            </h4>
            <p className="text-xs text-[#94A3B8] font-medium line-clamp-1">{vehicle.trim}</p>

            {/* Spec Strip */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-[10px] sm:text-xs font-mono font-medium">
              <span className="bg-white/5 text-[#E2E8F0] border border-white/10 px-2.5 py-0.5 rounded-md">
                {vehicle.mileage.toLocaleString()} KM
              </span>
              <span className="text-white/20">•</span>
              <span className="bg-white/5 text-[#E2E8F0] border border-white/10 px-2.5 py-0.5 rounded-md">
                {vehicle.transmission}
              </span>
              <span className="text-white/20">•</span>
              <span className="bg-white/5 text-[#E2E8F0] border border-white/10 px-2.5 py-0.5 rounded-md">
                {vehicle.fuel}
              </span>
              <span className="text-white/20">•</span>
              <span className="bg-[#2563EB]/20 text-[#60A5FA] border border-[#2563EB]/40 px-2.5 py-0.5 rounded-md font-bold">
                {vehicle.horsepower} HP
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-white/10 relative z-10">
            <div>
              <span className="text-[10px] text-[#94A3B8] font-medium uppercase tracking-wider block">Selling Price</span>
              <span className="text-base sm:text-lg md:text-xl font-black font-mono text-[#FFFFFF]">
                {formattedPrice}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {onCompareToggle && (
                <Button
                  variant={isCompared ? "primary" : "secondary"}
                  size="icon"
                  onClick={() => onCompareToggle(vehicle)}
                  title="Compare Vehicle"
                  className={!isCompared ? "bg-white/10 text-white border-white/20 hover:border-[#2563EB] hover:text-[#60A5FA]" : ""}
                >
                  <FiBarChart2 className="w-4 h-4" />
                </Button>
              )}
              {onBookTestDrive && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onBookTestDrive(vehicle)}
                  className="bg-[#FFFFFF] text-[#0F172A] hover:bg-slate-100"
                >
                  Book Test Drive
                </Button>
              )}
              {onViewDetails && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onViewDetails(vehicle)}
                >
                  Details
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default Grid View (Card bottom side below image in #0F172A)
  return (
    <div
      className={`bg-[#0F172A]/85 backdrop-blur-xl border border-white/15 hover:border-[#2563EB] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col group text-[#FFFFFF] ${className}`}
    >
      {/* Photo with Overlay Badges (Top Side) */}
      <div className="relative w-full h-44 sm:h-52 bg-[#000000] overflow-hidden border-b border-white/10">
        <Image
          src={vehicle.image}
          alt={`${vehicle.make} ${vehicle.model}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 rounded-md bg-[#000000]/85 backdrop-blur-md text-[#FFFFFF] font-mono text-[11px] font-bold border border-white/20 shadow-xs">
            {vehicle.year}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-[#000000]/85 backdrop-blur-md text-[#FFFFFF] text-[10px] font-bold uppercase tracking-wider border border-white/20 shadow-xs">
            {vehicle.condition}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <Badge variant={statusVariantMap[vehicle.status] || "gold"} size="sm" dot>
            {vehicle.status}
          </Badge>
        </div>
      </div>

      {/* Card Body (Bottom Side below the image with Transparent Banner Slider Overlay) */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between relative bg-[#0F172A]/75 backdrop-blur-md text-[#FFFFFF] overflow-hidden">
        {/* Transparent Banner Slider-Style Overlay Stack */}
        <div className="absolute inset-0 bg-[#0F172A]/45 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/60 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/30 to-[#0F172A]/60 pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-36 h-36 rounded-full bg-[#2563EB]/15 blur-2xl pointer-events-none group-hover:bg-[#2563EB]/25 transition-all duration-500" />

        <div className="relative z-10">
          <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 text-[#2563EB]">
            {vehicle.category}
          </div>
          <h4 className="text-sm sm:text-base font-black text-[#FFFFFF] group-hover:text-[#60A5FA] transition-colors truncate">
            {vehicle.make} {vehicle.model}
          </h4>
          <p className="text-xs text-[#94A3B8] font-medium truncate mt-0.5">{vehicle.trim}</p>

          {/* Spec Strip */}
          <div className="mt-3.5 pt-3 border-t border-white/10 text-[10px] sm:text-xs font-mono font-medium text-[#CBD5E1] flex items-center justify-between">
            <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
              {vehicle.mileage.toLocaleString()} KM
            </span>
            <span className="text-white/20">•</span>
            <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
              {vehicle.transmission}
            </span>
            <span className="text-white/20">•</span>
            <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
              {vehicle.fuel}
            </span>
          </div>
        </div>

        {/* Price & Actions Footer */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2 relative z-10">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-[#94A3B8] font-medium block">Price</span>
            <span className="text-sm sm:text-base font-black font-mono text-[#FFFFFF]">
              {formattedPrice}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {onCompareToggle && (
              <Button
                variant={isCompared ? "primary" : "secondary"}
                size="icon"
                onClick={() => onCompareToggle(vehicle)}
                title="Compare Vehicle"
                className={!isCompared ? "bg-white/10 text-white border-white/20 hover:border-[#2563EB] hover:text-[#60A5FA]" : ""}
              >
                <FiBarChart2 className="w-3.5 h-3.5" />
              </Button>
            )}
            {onViewDetails && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onViewDetails(vehicle)}
              >
                Details
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
