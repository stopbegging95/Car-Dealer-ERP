"use client";

import React, { useState } from "react";
import { FiSearch, FiStar, FiTag, FiLayers, FiX } from "react-icons/fi";
import { Dropdown } from "./Dropdown";
import { Button } from "./Button";

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

interface StepperInputProps {
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  min?: number;
  max?: number;
  step?: number;
  defaultIncrementStart?: number;
}

/**
 * High-precision numeric input with permanently visible increase & decrease stepper buttons.
 * Guarantees identical h-10 (40px) height and seamless user interaction without relying on hover-only browser spinners.
 */
const StepperNumberInput: React.FC<StepperInputProps> = ({
  placeholder,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  defaultIncrementStart,
}) => {
  const handleIncrement = () => {
    let nextVal: number;
    if (!value && defaultIncrementStart !== undefined) {
      nextVal = defaultIncrementStart;
    } else {
      const current = value ? parseInt(value, 10) : min;
      nextVal = current + step;
    }
    if (max !== undefined && nextVal > max) nextVal = max;
    onChange(String(nextVal));
  };

  const handleDecrement = () => {
    let nextVal: number;
    if (!value && defaultIncrementStart !== undefined) {
      nextVal = defaultIncrementStart;
    } else {
      const current = value ? parseInt(value, 10) : min;
      nextVal = Math.max(min, current - step);
    }
    onChange(String(nextVal));
  };

  return (
    <div className="relative flex items-center w-full h-10 bg-[#FFFFFF] border border-[#CBD5E1] rounded-md shadow-xs focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-all overflow-hidden">
      <input
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-full pl-2.5 pr-7 bg-transparent text-[#0F172A] placeholder-[#64748B] text-xs sm:text-sm font-semibold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      {/* Permanently visible increase and decrease stepper buttons */}
      <div className="absolute right-0 inset-y-0 w-6 flex flex-col border-l border-[#CBD5E1] bg-[#F8FAFC]">
        <button
          type="button"
          onClick={handleIncrement}
          aria-label={`Increase ${placeholder}`}
          className="flex-1 flex items-center justify-center hover:bg-[#EFF6FF] text-[#2563EB] hover:text-[#1D4ED8] transition-colors border-b border-[#E2E8F0] cursor-pointer"
        >
          <svg
            className="w-2.5 h-2.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
        <button
          type="button"
          onClick={handleDecrement}
          aria-label={`Decrease ${placeholder}`}
          className="flex-1 flex items-center justify-center hover:bg-[#EFF6FF] text-[#2563EB] hover:text-[#1D4ED8] transition-colors cursor-pointer"
        >
          <svg
            className="w-2.5 h-2.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>
    </div>
  );
};

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
    category: "",
    fuel: "",
    transmission: "",
  });

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
      category: "",
      fuel: "",
      transmission: "",
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
        <div className="absolute inset-0 bg-[#0F172A]/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/60 to-transparent sm:w-4/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 via-[#0F172A]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/40 via-transparent to-[#0F172A]/60" />
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#2563EB]/15 blur-3xl pointer-events-none" />
      </div>

      {/* Top Type Switcher Tabs (Active = Black, Non-active = White per user specification) */}
      <div className="flex items-center gap-2 mb-3 overflow-x-auto sm:overflow-visible pb-1">
        <Button
          type="button"
          onClick={() => setFilters({ ...filters, type: "all" })}
          variant={filters.type === "all" ? "primary" : "secondary"}
          size="sm"
          leftIcon={<FiLayers className="w-3.5 h-3.5" />}
          className={
            filters.type === "all"
              ? "!bg-[#000000] !text-[#FFFFFF] shadow-lg font-black border-2 border-white/20"
              : "!bg-[#FFFFFF] !text-[#0F172A] font-bold border border-white/20 hover:!bg-[#F1F5F9] shadow-xs"
          }
        >
          All Vehicles
        </Button>

        <Button
          type="button"
          onClick={() => setFilters({ ...filters, type: "new" })}
          variant={filters.type === "new" ? "primary" : "secondary"}
          size="sm"
          leftIcon={<FiStar className="w-3.5 h-3.5" />}
          className={
            filters.type === "new"
              ? "!bg-[#000000] !text-[#FFFFFF] shadow-lg font-black border-2 border-white/20"
              : "!bg-[#FFFFFF] !text-[#0F172A] font-bold border border-white/20 hover:!bg-[#F1F5F9] shadow-xs"
          }
        >
          New Cars
        </Button>

        <Button
          type="button"
          onClick={() => setFilters({ ...filters, type: "used" })}
          variant={filters.type === "used" ? "primary" : "secondary"}
          size="sm"
          leftIcon={<FiTag className="w-3.5 h-3.5" />}
          className={
            filters.type === "used"
              ? "!bg-[#000000] !text-[#FFFFFF] shadow-lg font-black border-2 border-white/20"
              : "!bg-[#FFFFFF] !text-[#0F172A] font-bold border border-white/20 hover:!bg-[#F1F5F9] shadow-xs"
          }
        >
          Used Cars
        </Button>
      </div>

      {/* Main Filter Inputs: All Dropdowns & Range Inputs Visible By Default (No Toggle Button) */}
      <form onSubmit={handleSearch} className="space-y-3">
        {/* Row 1: All 5 Primary Dropdowns Visible with Identical h-10 Height */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 items-end">
          {/* Make Dropdown */}
          <Dropdown
            label="Make"
            labelClassName="h-5 flex items-center text-xs sm:text-sm font-bold text-[#FFFFFF]"
            placeholder="All Makes"
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
            labelClassName="h-5 flex items-center text-xs sm:text-sm font-bold text-[#FFFFFF]"
            placeholder={filters.make ? "All Models" : "Select Make first"}
            disabled={!filters.make}
            value={filters.model}
            onChange={(val) => setFilters({ ...filters, model: String(val) })}
            options={[
              { label: "All Models", value: "" },
              ...availableModels.map((m) => ({ label: m, value: m })),
            ]}
          />

          {/* Vehicle Category Dropdown */}
          <Dropdown
            label="Category"
            labelClassName="h-5 flex items-center text-xs sm:text-sm font-bold text-[#FFFFFF]"
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

          {/* Fuel Type Dropdown */}
          <Dropdown
            label="Fuel Type"
            labelClassName="h-5 flex items-center text-xs sm:text-sm font-bold text-[#FFFFFF]"
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

          {/* Transmission Dropdown */}
          <Dropdown
            label="Transmission"
            labelClassName="h-5 flex items-center text-xs sm:text-sm font-bold text-[#FFFFFF]"
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

        {/* Row 2: Range Inputs with Visible Steppers + Action Buttons (Exact Same h-10 Height) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
          {/* Year Range with Always-Visible Increase/Decrease Steppers */}
          <div className="flex flex-col gap-1">
            <label className="h-5 flex items-center text-xs sm:text-sm font-bold text-[#FFFFFF]">
              Year Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <StepperNumberInput
                placeholder="Min Year"
                value={filters.minYear}
                onChange={(val) => setFilters({ ...filters, minYear: val })}
                min={2010}
                max={2026}
                step={1}
                defaultIncrementStart={2020}
              />
              <StepperNumberInput
                placeholder="Max Year"
                value={filters.maxYear}
                onChange={(val) => setFilters({ ...filters, maxYear: val })}
                min={2010}
                max={2026}
                step={1}
                defaultIncrementStart={2026}
              />
            </div>
          </div>

          {/* Price Range with Always-Visible Increase/Decrease Steppers */}
          <div className="flex flex-col gap-1">
            <label className="h-5 flex items-center text-xs sm:text-sm font-bold text-[#FFFFFF]">
              Price Range (₦)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <StepperNumberInput
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(val) => setFilters({ ...filters, minPrice: val })}
                min={0}
                step={5000000}
                defaultIncrementStart={50000000}
              />
              <StepperNumberInput
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(val) => setFilters({ ...filters, maxPrice: val })}
                min={0}
                step={5000000}
                defaultIncrementStart={500000000}
              />
            </div>
          </div>

          {/* Clear Filters Button (Matching h-10 Height) */}
          <div>
            <div className="h-5" />
            <button
              type="button"
              onClick={handleReset}
              className="w-full h-10 flex items-center justify-center gap-1.5 px-3 rounded-md text-xs sm:text-sm font-bold bg-[#FFFFFF] hover:bg-[#F1F5F9] text-[#0F172A] border border-white/20 transition-all shadow-xs cursor-pointer select-none"
            >
              <FiX className="w-4 h-4 text-[#64748B]" />
              <span>Clear Filters</span>
            </button>
          </div>

          {/* Search Vehicles Button (Matching h-10 Height) */}
          <div>
            <div className="h-5" />
            <button
              type="submit"
              className="w-full h-10 flex items-center justify-center gap-2 px-3 rounded-md text-xs sm:text-sm font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-[#FFFFFF] transition-all shadow-lg shadow-[#2563EB]/25 border border-[#2563EB] cursor-pointer select-none"
            >
              <FiSearch className="w-4 h-4 text-[#FFFFFF]" />
              <span>Search Vehicles</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
