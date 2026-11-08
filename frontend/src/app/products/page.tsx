"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiLayers } from "react-icons/fi";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button, PageBanner } from "@/components/ui";
import { VEHICLE_CATEGORIES, VEHICLES } from "@/data/vehicles";

export default function ProductsPage() {
  return (
    <div className="flex flex-col selection:bg-[#2563EB] min-h-screen font-sans text-[#0F172A] selection:text-[#FFFFFF] bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 space-y-8 mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl">
        <PageBanner
          badge="CURATED AUTOMOTIVE PORTFOLIOS"
          title="VEHICLE"
          titleHighlight="CATEGORIES"
          subtitle="Explore our curated luxury collections tailored for executive chauffeuring, track performance, and family comfort."
          backgroundImage="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80"
          breadcrumbs={[{ label: "Vehicle Portfolios" }]}
          stats={[
            { value: `${VEHICLE_CATEGORIES.length - 1} Classes`, label: "Portfolio Categories" },
            { value: `${VEHICLES.length}+ Models`, label: "Available Fleet" },
            { value: "100%", label: "Inspection Guarantee" },
          ]}
        />

        <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {VEHICLE_CATEGORIES.filter((c) => c.slug !== "all").map((cat) => {
            const sampleCar = VEHICLES.find((v) => v.category === cat.name) || VEHICLES[0];
            return (
              <div
                key={cat.slug}
                className="group flex flex-col justify-between bg-[#FFFFFF] shadow-sm border border-[#E2E8F0] hover:border-[#2563EB] rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <div className="relative bg-[#0F172A] w-full h-48 border-b border-[#E2E8F0]">
                    <Image
                      src={sampleCar.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="top-3 right-3 absolute">
                      <span className="bg-[#0F172A]/85 backdrop-blur-md px-2.5 py-1 border border-white/20 rounded-md font-mono font-bold text-[#FFFFFF] text-xs shadow-xs">
                        {cat.count} Vehicles
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 p-5">
                    <h3 className="font-bold text-[#0F172A] group-hover:text-[#2563EB] text-lg transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[#64748B] text-xs leading-relaxed">
                      Approved luxury selections meeting highest inspection and documentation standards.
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link href={`/inventory?cat=${cat.slug}`}>
                    <Button variant="primary" size="sm" fullWidth rightIcon={<FiArrowRight className="w-3.5 h-3.5" />}>
                      Explore {cat.name}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

