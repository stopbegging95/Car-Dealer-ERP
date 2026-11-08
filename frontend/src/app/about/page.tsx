"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FiAward,
  FiShield,
  FiMapPin,
  FiUsers,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui";

export default function AboutPage() {
  const [selectedShowroom, setSelectedShowroom] = useState<"lagos" | "abuja">("lagos");

  const showrooms = {
    lagos: {
      name: "Victoria Island Flagship Showroom",
      address: "Plot 1240, Ahmadu Bello Way, Victoria Island, Lagos",
      capacity: "45 Executive Vehicles on Display",
      features: ["VIP Lounge & Bar", "Private Delivery Bay", "Diagnostic Service Center"],
      phone: "+234 (0) 800 123 4567",
      hours: "Mon - Sat: 8:00 AM - 7:00 PM",
    },
    abuja: {
      name: "Maitama Executive Suite",
      address: "Gana Street, Maitama Diplomatic Zone, Abuja FCT",
      capacity: "25 Supercars & Armored SUVs",
      features: ["Diplomatic Protocol Liaison", "Secure Armor Vault", "Executive Conference Suite"],
      phone: "+234 (0) 800 987 6543",
      hours: "Mon - Sat: 9:00 AM - 6:00 PM",
    },
  };

  const currentShowroom = showrooms[selectedShowroom];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#2563EB] selection:text-[#FFFFFF]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Hero Section */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-xs font-bold">
            <FiAward className="w-3.5 h-3.5" />
            <span>Pioneering Automotive Luxury Since 2014</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0F172A] uppercase tracking-tight">
            Excellence In Motion
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
            Premier Auto Motors is West Africa&apos;s leading dealership for curated executive luxury vehicles, bespoke international vehicle sourcing, and end-to-end customs clearance.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-2 hover:border-[#2563EB] hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB]">
              <FiShield className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#0F172A]">150-Point Inspection</h4>
            <p className="text-xs text-[#475569]">
              Every vehicle undergoes comprehensive mechanical, electrical, and structural diagnostics before catalog listing.
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-2 hover:border-[#2563EB] hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB]">
              <FiAward className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#0F172A]">Clean Title Guarantee</h4>
            <p className="text-xs text-[#475569]">
              Guaranteed clean Carfax/AutoDNA records, verified non-salvage pedigree, and 100% official customs duty clearance.
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-2 hover:border-[#2563EB] hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB]">
              <FiUsers className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#0F172A]">Dedicated Concierge</h4>
            <p className="text-xs text-[#475569]">
              Personalized VIP service tailored to executive clients, high-net-worth collectors, and corporate fleets.
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-2 hover:border-[#2563EB] hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB]">
              <FiClock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#0F172A]">24-Hour Clearance</h4>
            <p className="text-xs text-[#475569]">
              Proprietary terminal logistics pipeline enabling fast-track import release at Tin Can Island & Apapa.
            </p>
          </div>
        </div>

        {/* Showrooms Interactive Switcher */}
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#0F172A] uppercase tracking-tight">
                Our Executive Showrooms
              </h3>
              <p className="text-xs text-[#475569]">
                Experience physical viewings and private test drives at our flagship locations.
              </p>
            </div>

            <div className="flex items-center bg-[#F1F5F9] p-1 rounded-xl border border-[#CBD5E1]">
              <Button
                variant={selectedShowroom === "lagos" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setSelectedShowroom("lagos")}
              >
                Lagos Flagship
              </Button>
              <Button
                variant={selectedShowroom === "abuja" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setSelectedShowroom("abuja")}
              >
                Abuja Executive Suite
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] block">
                  Location Profile
                </span>
                <h4 className="text-xl font-bold text-[#0F172A]">{currentShowroom.name}</h4>
                <p className="text-xs text-[#475569] mt-1 flex items-center gap-1.5">
                  <FiMapPin className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                  <span>{currentShowroom.address}</span>
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="text-[#334155] font-mono">
                  Capacity: <span className="font-bold text-[#1D4ED8]">{currentShowroom.capacity}</span>
                </div>
                <div className="space-y-1">
                  {currentShowroom.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[#334155]">
                      <FiCheckCircle className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
                <div className="text-[#64748B] pt-1">
                  Operating Hours: <span className="text-[#0F172A] font-semibold">{currentShowroom.hours}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://wa.me/2348001234567"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<FaWhatsapp className="w-4 h-4" />}
                  >
                    Chat with Showroom Concierge
                  </Button>
                </a>
              </div>
            </div>

            <div className="relative w-full h-64 rounded-xl overflow-hidden bg-[#F1F5F9] border border-[#CBD5E1] shadow-sm">
              <Image
                src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80"
                alt={currentShowroom.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
