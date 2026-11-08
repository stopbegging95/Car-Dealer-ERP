"use client";

import React, { useState } from "react";
import { FiSearch, FiSliders, FiGrid, FiList, FiCheck, FiX } from "react-icons/fi";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Tabs, Dropdown, VehicleCard, Modal, Input, DatePicker, Button, PageBanner } from "@/components/ui";
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
        {/* Public Inventory Hero Banner */}
        <PageBanner
          badge="APPROVED DEALERSHIP STOCK"
          title="LUXURY VEHICLE"
          titleHighlight="INVENTORY"
          subtitle="Browse our verified collection of luxury, armored, and executive automobiles available for immediate delivery across Lagos and Abuja showrooms."
          backgroundImage="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1920&q=80"
          breadcrumbs={[{ label: "Inventory" }]}
          stats={[
            { value: `${filteredVehicles.length} Units`, label: "In Stock" },
            { value: "100%", label: "Clean Titles" },
            { value: "150-Point", label: "Certified PDI" },
          ]}
        />

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
            <div className="w-full max-w-md">
              <Input
                placeholder="Search by make, model, category, stock ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<FiSearch className="w-4 h-4 text-[#94A3B8]" />}
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
            <div className="flex items-center bg-[#F8FAFC] p-1 rounded-md border border-[#CBD5E1] gap-1">
              <Button
                variant={viewMode === "grid" ? "primary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                aria-label="Grid View"
                className="w-8 h-8 p-1.5"
              >
                <FiGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "primary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                aria-label="List View"
                className="w-8 h-8 p-1.5"
              >
                <FiList className="w-4 h-4" />
              </Button>
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
