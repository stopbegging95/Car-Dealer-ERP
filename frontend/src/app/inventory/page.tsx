"use client";

import React, { useState } from "react";
import { FiSearch, FiSliders, FiGrid, FiList, FiCheck, FiX } from "react-icons/fi";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Tabs, Dropdown, VehicleCard, Modal, Input, DatePicker, Button } from "@/components/ui";
import { VEHICLES, Vehicle, VEHICLE_CATEGORIES } from "@/data/vehicles";

export default function InventoryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("price-desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const currency: "USD" | "NGN" = "USD";

  // Modal
  const [isTestDriveOpen, setIsTestDriveOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [testDriveDate, setTestDriveDate] = useState("2026-11-20");
  const [testDriveLocation, setTestDriveLocation] = useState("Lagos Showroom");

  // Filtered vehicles logic
  const filteredVehicles = VEHICLES.filter((v) => {
    const matchesCat =
      selectedCategory === "all" ||
      v.category.toLowerCase().replace(/[\s&]+/g, "-") === selectedCategory;
    const matchesSearch =
      v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.stockId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === "price-asc") return a.priceUSD - b.priceUSD;
    if (sortBy === "price-desc") return b.priceUSD - a.priceUSD;
    if (sortBy === "year-desc") return b.year - a.year;
    if (sortBy === "mileage-asc") return a.mileage - b.mileage;
    return 0;
  });

  const openTestDrive = (v: Vehicle) => {
    setSelectedVehicle(v);
    setIsTestDriveOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#2563EB] selection:text-[#FFFFFF]">
      <Navbar onBookTestDrive={() => openTestDrive(VEHICLES[0])} />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-0.5 bg-[#2563EB]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Approved Dealership Stock
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0F172A] uppercase tracking-tight">
              Vehicle Inventory
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-xl">
              Browse our verified collection of luxury and executive automobiles available for immediate delivery.
            </p>
          </div>
        </div>

        {/* Category Filter Pills (from requirements) */}
        <div>
          <Tabs
            variant="pills"
            activeTab={selectedCategory}
            onChange={setSelectedCategory}
            tabs={VEHICLE_CATEGORIES.map((c) => ({
              id: c.slug,
              label: c.name,
              badge: c.count,
            }))}
          />
        </div>

        {/* Search, Sort, and View Controls Strip */}
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-3 sm:p-3.5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3 flex-1 min-w-[240px]">
            <div className="relative w-full max-w-md">
              <FiSearch className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2 sm:top-2.5" />
              <input
                type="text"
                placeholder="Search by make, model, category, stock ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8FAFC] text-xs sm:text-sm text-[#0F172A] placeholder-[#94A3B8] rounded-md pl-9 pr-3.5 py-1.5 sm:py-2 border border-[#CBD5E1] focus:border-[#2563EB] outline-none shadow-xs"
              />
            </div>
            <span className="text-xs text-[#64748B] whitespace-nowrap hidden sm:inline">
              Showing <span className="text-[#2563EB] font-bold">{filteredVehicles.length}</span> vehicles
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="w-44">
              <Dropdown
                value={sortBy}
                onChange={(val) => setSortBy(String(val))}
                options={[
                  { label: "Price: High to Low", value: "price-desc" },
                  { label: "Price: Low to High", value: "price-asc" },
                  { label: "Year: Newest First", value: "year-desc" },
                  { label: "Mileage: Lowest First", value: "mileage-asc" },
                ]}
              />
            </div>

            {/* Grid / List Toggle */}
            <div className="flex items-center bg-[#F8FAFC] p-1 rounded-md border border-[#CBD5E1]">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded transition-colors cursor-pointer ${viewMode === "grid" ? "bg-[#2563EB] text-[#FFFFFF] shadow-xs" : "text-[#64748B] hover:text-[#0F172A]"}`}
                title="Grid View"
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded transition-colors cursor-pointer ${viewMode === "list" ? "bg-[#2563EB] text-[#FFFFFF] shadow-xs" : "text-[#64748B] hover:text-[#0F172A]"}`}
                title="List View"
              >
                <FiList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Vehicle Catalog Listing */}
        {filteredVehicles.length === 0 ? (
          <div className="py-20 text-center bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-8 shadow-sm">
            <FiSliders className="w-10 h-10 text-[#2563EB] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#0F172A]">No matching vehicles found</h3>
            <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
              Try adjusting your filter criteria or explore our Auto Broker service to source this vehicle directly.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.stockId}
                vehicle={vehicle}
                currency={currency}
                viewMode={viewMode}
                onBookTestDrive={() => openTestDrive(vehicle)}
                onViewDetails={() => openTestDrive(vehicle)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Book a Test Drive Modal */}
      <Modal
        isOpen={isTestDriveOpen}
        onClose={() => setIsTestDriveOpen(false)}
        size="lg"
        title={
          selectedVehicle ? (
            <span>
              VIP Test Drive: <span className="text-[#2563EB]">{selectedVehicle.make} {selectedVehicle.model}</span>
            </span>
          ) : (
            "Book a Test Drive"
          )
        }
        description="Schedule a private VIP test drive appointment at one of our luxury showrooms."
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTestDriveOpen(false)}
              leftIcon={<FiX className="w-3.5 h-3.5 text-[#64748B]" />}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                alert("VIP appointment scheduled successfully!");
                setIsTestDriveOpen(false);
              }}
              leftIcon={<FiCheck className="w-3.5 h-3.5 text-[#FFFFFF]" />}
            >
              Confirm Appointment
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Full Name" placeholder="e.g. Chief Alexander Vance" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Email Address" type="email" placeholder="alexander@company.com" />
            <Input label="Phone Number" placeholder="+234 (0) 800 123 4567" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DatePicker
              label="Preferred Date"
              value={testDriveDate}
              onChange={setTestDriveDate}
            />
            <Dropdown
              label="Showroom Location"
              value={testDriveLocation}
              onChange={(val) => setTestDriveLocation(String(val))}
              options={[
                { label: "Lagos Showroom (Victoria Island)", value: "Lagos Showroom" },
                { label: "Abuja Showroom (Maitama)", value: "Abuja Showroom" },
              ]}
            />
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
