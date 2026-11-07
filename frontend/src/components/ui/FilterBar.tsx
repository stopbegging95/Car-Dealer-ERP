"use client";

import React, { useState } from "react";
import { FiSearch, FiStar, FiTag, FiLayers, FiChevronDown } from "react-icons/fi";
import { Dropdown } from "./Dropdown";

export interface FilterState {
  type: "all" | "new" | "used";
  make: string;
  model: string;
  minYear: string;
  maxYear: string;
  minPrice: string;
  maxPrice: string;
  category?: string;
  transmission?: string;
  fuel?: string;
}

export interface FilterBarProps {
  onSearch: (filters: FilterState) => void;
  makes?: string[];
  modelsByMake?: Record<string, string[]>;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onSearch,
  makes = ["Mercedes-Benz", "Porsche", "Land Rover", "Tesla", "BMW", "Ferrari", "Ducati"],
  modelsByMake = {
    "Mercedes-Benz": ["S-Class S580", "C300 AMG Line", "Sprinter VIP Lounge"],
    Porsche: ["911 Turbo S", "Taycan GTS", "Cayenne Turbo"],
    "Land Rover": ["Range Rover Autobiography", "Defender 110", "Range Rover Sport"],
    Tesla: ["Model S Plaid", "Model X", "Cybertruck"],
    BMW: ["7 Series 760i", "X3 xDrive20d", "M4 Competition"],
    Ferrari: ["296 GTB", "SF90 Stradale", "Purosangue"],
    Ducati: ["Panigale V4 S", "Diavel V4", "Multistrada V4"],
  },
  className = "",
}) => {
  const [filters, setFilters] = useState<FilterState>({
    type: "all",
    make: "",
    model: "",
    minYear: "",
    maxYear: "",
    minPrice: "",
    maxPrice: "",
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const availableModels = filters.make && modelsByMake[filters.make]
    ? modelsByMake[filters.make]
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    const resetState: FilterState = {
      type: "all",
      make: "",
      model: "",
      minYear: "",
      maxYear: "",
      minPrice: "",
      maxPrice: "",
    };
    setFilters(resetState);
    onSearch(resetState);
  };

  return (
    <div
      className={`relative z-30 overflow-visible rounded-lg border border-white/20 shadow-2xl transition-all duration-300 px-4 sm:px-6 py-3 sm:py-3.5 text-[#FFFFFF] ${className}`}
    >
      {/* Transparent Overlay Background Stack as in Banner Slider */}
      <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none -z-10 bg-[#0F172A]/75 backdrop-blur-xl border border-white/15 shadow-2xl">
        {/* Directional Transparent Atmospheric Gradient Overlays (Banner Slider Style) */}
        <div className="absolute inset-0 bg-[#0F172A]/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/60 to-transparent sm:w-4/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 via-[#0F172A]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/40 via-transparent to-[#0F172A]/60" />
        {/* Subtle Cobalt Accent Ambient Sheen (matches banner) */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#2563EB]/15 blur-3xl pointer-events-none" />
      </div>

      {/* Top Type Switcher Tabs (Active = Black, Non-active = White per user specification) */}
      <div className="flex items-center gap-2 mb-2.5 overflow-x-auto sm:overflow-visible pb-1">
        <button
          type="button"
          onClick={() => setFilters({ ...filters, type: "all" })}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-bold transition-all duration-200 select-none shrink-0 cursor-pointer ${
            filters.type === "all"
              ? "bg-[#000000] text-[#FFFFFF] shadow-lg font-black border-2 border-white/20"
              : "bg-[#FFFFFF] text-[#0F172A] font-bold border border-white/20 hover:bg-[#F1F5F9] shadow-xs"
          }`}
        >
          <FiLayers className="w-3.5 h-3.5" />
          All Vehicles
        </button>

        <button
          type="button"
          onClick={() => setFilters({ ...filters, type: "new" })}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-bold transition-all duration-200 select-none shrink-0 cursor-pointer ${
            filters.type === "new"
              ? "bg-[#000000] text-[#FFFFFF] shadow-lg font-black border-2 border-white/20"
              : "bg-[#FFFFFF] text-[#0F172A] font-bold border border-white/20 hover:bg-[#F1F5F9] shadow-xs"
          }`}
        >
          <FiStar className="w-3.5 h-3.5" />
          New Cars
        </button>

        <button
          type="button"
          onClick={() => setFilters({ ...filters, type: "used" })}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-bold transition-all duration-200 select-none shrink-0 cursor-pointer ${
            filters.type === "used"
              ? "bg-[#000000] text-[#FFFFFF] shadow-lg font-black border-2 border-white/20"
              : "bg-[#FFFFFF] text-[#0F172A] font-bold border border-white/20 hover:bg-[#F1F5F9] shadow-xs"
          }`}
        >
          <FiTag className="w-3.5 h-3.5" />
          Used Cars
        </button>
      </div>

      {/* Main Filter Inputs Grid */}
      <form onSubmit={handleSearch} className="space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          {/* Make Dropdown */}
          <Dropdown
            label="Make"
            labelClassName="text-xs sm:text-sm font-bold text-[#FFFFFF]"
            placeholder="Select Make"
            value={filters.make}
            onChange={(val) => setFilters({ ...filters, make: String(val), model: "" })}
            options={[
              { label: "All Makes", value: "" },
              ...makes.map((m) => ({ label: m, value: m })),
            ]}
          />

          {/* Model Dropdown */}
          <Dropdown
            label="Model"
            labelClassName="text-xs sm:text-sm font-bold text-[#FFFFFF]"
            placeholder={filters.make ? "Select Model" : "Select Make first"}
            disabled={!filters.make}
            value={filters.model}
            onChange={(val) => setFilters({ ...filters, model: String(val) })}
            options={[
              { label: "All Models", value: "" },
              ...availableModels.map((m) => ({ label: m, value: m })),
            ]}
          />

          {/* Year Range */}
          <div className="flex flex-col gap-1">
            <label className="text-xs sm:text-sm font-bold text-[#FFFFFF]">
              Year Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min Year"
                value={filters.minYear}
                onChange={(e) => setFilters({ ...filters, minYear: e.target.value })}
                className="w-full rounded-md bg-[#FFFFFF] text-[#0F172A] placeholder-[#64748B] text-xs py-1.5 sm:py-2 px-2.5 outline-none border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all shadow-xs"
              />
              <input
                type="number"
                placeholder="Max Year"
                value={filters.maxYear}
                onChange={(e) => setFilters({ ...filters, maxYear: e.target.value })}
                className="w-full rounded-md bg-[#FFFFFF] text-[#0F172A] placeholder-[#64748B] text-xs py-1.5 sm:py-2 px-2.5 outline-none border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Price Range */}
          <div className="flex flex-col gap-1">
            <label className="text-xs sm:text-sm font-bold text-[#FFFFFF]">
              Price Range ($)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                className="w-full rounded-md bg-[#FFFFFF] text-[#0F172A] placeholder-[#64748B] text-xs py-1.5 sm:py-2 px-2.5 outline-none border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all shadow-xs"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                className="w-full rounded-md bg-[#FFFFFF] text-[#0F172A] placeholder-[#64748B] text-xs py-1.5 sm:py-2 px-2.5 outline-none border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Search Button */}
          <div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-1.5 sm:py-2 px-3 rounded-md text-xs sm:text-sm font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-[#FFFFFF] transition-all shadow-lg shadow-[#2563EB]/25 border border-[#2563EB] cursor-pointer"
            >
              <FiSearch className="w-4 h-4 text-[#FFFFFF]" />
              <span>Search Vehicles</span>
            </button>
          </div>
        </div>

        {/* Collapsible Advanced Filters Row */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all border select-none cursor-pointer ${
              showAdvanced
                ? "bg-[#000000] text-[#FFFFFF] border-2 border-white/20 shadow-md"
                : "bg-[#FFFFFF] text-[#0F172A] border border-white/20 hover:bg-[#F1F5F9] shadow-xs"
            }`}
          >
            <span>{showAdvanced ? "Hide Advanced Filters" : "More Filters (Fuel, Transmission, Category)"}</span>
            <FiChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                showAdvanced ? "rotate-180 text-[#FFFFFF]" : "text-[#0F172A]"
              }`}
            />
          </button>

          {(filters.make || filters.model || filters.minYear || filters.minPrice || filters.category || filters.fuel || filters.transmission) && (
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-md text-xs font-bold bg-[#FFFFFF] text-[#0F172A] hover:bg-[#F1F5F9] border border-white/20 transition-all select-none cursor-pointer shadow-xs"
            >
              Clear All Filters
            </button>
          )}
        </div>

        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/10 animate-in fade-in duration-200">
            <Dropdown
              label="Vehicle Category"
              labelClassName="text-xs sm:text-sm font-bold text-[#FFFFFF]"
              placeholder="All Categories"
              value={filters.category || ""}
              onChange={(val) => setFilters({ ...filters, category: String(val) })}
              options={[
                { label: "All Categories", value: "" },
                { label: "Executive Class", value: "Executive Class" },
                { label: "Sport & Performance", value: "Sport & Performance" },
                { label: "Premium SUVs", value: "Premium SUVs" },
                { label: "Electric Vehicles", value: "Electric Vehicles" },
                { label: "Power Bikes", value: "Power Bikes" },
                { label: "Executive Buses", value: "Executive Buses" },
              ]}
            />

            <Dropdown
              label="Fuel Type"
              labelClassName="text-xs sm:text-sm font-bold text-[#FFFFFF]"
              placeholder="Any Fuel Type"
              value={filters.fuel || ""}
              onChange={(val) => setFilters({ ...filters, fuel: String(val) })}
              options={[
                { label: "Any Fuel", value: "" },
                { label: "Petrol", value: "Petrol" },
                { label: "Diesel", value: "Diesel" },
                { label: "Electric", value: "Electric" },
                { label: "Hybrid", value: "Hybrid" },
              ]}
            />

            <Dropdown
              label="Transmission"
              labelClassName="text-xs sm:text-sm font-bold text-[#FFFFFF]"
              placeholder="Any Transmission"
              value={filters.transmission || ""}
              onChange={(val) => setFilters({ ...filters, transmission: String(val) })}
              options={[
                { label: "Any Transmission", value: "" },
                { label: "Automatic", value: "Automatic" },
                { label: "Manual", value: "Manual" },
                { label: "Dual-Clutch", value: "Dual-Clutch" },
              ]}
            />
          </div>
        )}
      </form>
    </div>
  );
};
