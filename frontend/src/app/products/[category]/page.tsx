"use client";

import React, { useMemo, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { VehicleCard, PageBanner, Button } from "@/components/ui";
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

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <PageBanner
          badge={`PORTFOLIO: ${categoryMeta.name.toUpperCase()}`}
          title={categoryMeta.name}
          subtitle="Verified luxury and performance vehicles available for private delivery, bespoke customization, and showroom viewings."
          backgroundImage={categoryVehicles[0]?.image || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80"}
          breadcrumbs={[
            { label: "Vehicle Portfolios", href: "/products" },
            { label: categoryMeta.name },
          ]}
          stats={[
            { value: `${categoryVehicles.length || VEHICLES.length} Units`, label: "Vehicles In Class" },
            { value: "0 km - 25k km", label: "Mileage Envelope" },
            { value: "Immediate", label: "Showroom Delivery" },
          ]}
          actions={
            <Link href="/products">
              <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/20" leftIcon={<FiArrowLeft />}>
                All Categories
              </Button>
            </Link>
          }
        />

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
