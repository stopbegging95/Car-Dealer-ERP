"use client";

import React, { useMemo, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { VehicleCard } from "@/components/ui";
import { VEHICLES, VEHICLE_CATEGORIES, Vehicle } from "@/data/vehicles";

function CategoryProductsContent() {
  const params = useParams();
  const categorySlug = typeof params?.category === "string" ? params.category : "executive-class";

  const categoryMeta = useMemo(() => {
    return (
      VEHICLE_CATEGORIES.find((c) => c.slug === categorySlug) || {
        name: "Executive Class",
        slug: "executive-class",
        count: 8,
      }
    );
  }, [categorySlug]);

  const categoryVehicles: Vehicle[] = useMemo(() => {
    return VEHICLES.filter(
      (v) => v.category.toLowerCase() === categoryMeta.name.toLowerCase()
    );
  }, [categoryMeta]);

  return (
    <div className="min-h-screen text-[#0F172A] bg-[#F8FAFC] flex flex-col font-sans selection:bg-[#2563EB] selection:text-[#FFFFFF]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#2563EB] transition-colors font-semibold"
          >
            <FiArrowLeft className="w-4 h-4 text-[#2563EB]" />
            <span>All Categories</span>
          </Link>
          <span className="text-xs font-mono text-[#2563EB] font-bold">
            {categoryVehicles.length || VEHICLES.length} Units Available
          </span>
        </div>

        <div className="pb-4 border-b border-[#E2E8F0]">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0F172A] uppercase tracking-tight">
            {categoryMeta.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-xl">
            Verified luxury and performance vehicles available for private delivery and showroom viewings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(categoryVehicles.length > 0 ? categoryVehicles : VEHICLES).map((vehicle) => (
            <VehicleCard key={vehicle.stockId} vehicle={vehicle} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CategoryProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]" />}>
      <CategoryProductsContent />
    </Suspense>
  );
}
