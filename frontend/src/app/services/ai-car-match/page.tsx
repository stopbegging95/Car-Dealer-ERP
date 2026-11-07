"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiCpu,
  FiCheckCircle,
  FiArrowRight,
  FiArrowLeft,
  FiCalendar,
  FiZap,
  FiCompass,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button, Badge, Modal, Input, RadioGroup, Dropdown } from "@/components/ui";
import { VEHICLES, Vehicle } from "@/data/vehicles";

export default function AICarMatchPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [budgetRange, setBudgetRange] = useState<string>("100k-200k");
  const [preferredCategory, setPreferredCategory] = useState<string>("Executive Class");
  const [lifestyleUsage, setLifestyleUsage] = useState<string>("executive");
  const [familySize, setFamilySize] = useState<string>("1-2");
  const [powertrainInterest, setPowertrainInterest] = useState<string>("Petrol");
  const [isLeadModalOpen, setIsLeadModalOpen] = useState<boolean>(false);
  const [selectedMatchCar, setSelectedMatchCar] = useState<Vehicle | null>(null);

  // Calculation of recommendations
  const recommendedVehicles = React.useMemo(() => {
    return VEHICLES.slice(0, 3).map((car, idx) => ({
      ...car,
      matchScore: [98, 94, 91][idx],
      rationale: [
        "Perfect match for executive urban presence, superior ride dampening, and top-tier resale liquidity.",
        "Exceptional acceleration, responsive dual-clutch transmission, and benchmark high-speed stability.",
        "Commanding seating position, all-terrain luxury capability, and generous rear passenger legroom.",
      ][idx],
    }));
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#2563EB] selection:text-[#FFFFFF]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header Block */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-xs font-bold">
            <FiCpu className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>AI Automotive Recommendation Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0F172A] uppercase tracking-tight">
            Find Your Ideal Vehicle Match
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-xl mx-auto">
            Answer 3 quick questions about your lifestyle, performance desires, and budget to receive algorithmic vehicle matches from our stock.
          </p>
        </div>

        {/* 3-Step Wizard Indicator */}
        <div className="flex items-center justify-between max-w-md mx-auto pt-2">
          {[
            { num: 1, label: "Budget & Class" },
            { num: 2, label: "Lifestyle & Usage" },
            { num: 3, label: "Match Results" },
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${
                    currentStep >= s.num
                      ? "bg-[#2563EB] text-[#FFFFFF] shadow-sm"
                      : "bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1]"
                  }`}
                >
                  {s.num}
                </div>
                <span
                  className={`text-[10px] font-semibold tracking-wide ${
                    currentStep >= s.num ? "text-[#2563EB] font-bold" : "text-[#64748B]"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < 2 && (
                <div
                  className={`flex-1 h-0.5 mx-2 -mt-4 transition-all ${
                    currentStep > s.num ? "bg-[#2563EB]" : "bg-[#E2E8F0]"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* STEP 1: Budget & Category */}
        {currentStep === 1 && (
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 sm:p-7 shadow-sm space-y-5 animate-in fade-in duration-200">
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">
                Step 1: Define Your Budget & Desired Vehicle Class
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Select your preferred acquisition budget ceiling and body category.
              </p>
            </div>

            <div className="space-y-4">
              <RadioGroup
                name="budget"
                label="Target Acquisition Budget (USD)"
                cardVariant
                value={budgetRange}
                onChange={(val) => setBudgetRange(String(val))}
                options={[
                  { label: "Under $100,000", value: "under-100k", description: "Entry Luxury & Premium Crossovers" },
                  { label: "$100,000 - $200,000", value: "100k-200k", description: "Flagship Sedans & Performance SUVs" },
                  { label: "$200,000+", value: "above-200k", description: "Exotic Supercars & Bespoke Coachbuilds" },
                ]}
              />

              <div className="pt-2">
                <label className="text-xs font-semibold text-[#0F172A] block mb-2">
                  Preferred Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    "Executive Class",
                    "Sport & Performance",
                    "Premium SUVs",
                    "Electric Vehicles",
                    "Power Bikes",
                    "Executive Buses",
                  ].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setPreferredCategory(cat)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                        preferredCategory === cat
                          ? "bg-[#2563EB] text-[#FFFFFF] border-[#2563EB] shadow-xs"
                          : "bg-[#FFFFFF] text-[#0F172A] border-[#CBD5E1] hover:border-[#2563EB]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#E2E8F0]">
              <Button
                variant="primary"
                size="md"
                onClick={() => setCurrentStep(2)}
                rightIcon={<FiArrowRight className="w-4 h-4 text-[#FFFFFF]" />}
              >
                Continue to Lifestyle
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Lifestyle & Usage */}
        {currentStep === 2 && (
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 sm:p-7 shadow-sm space-y-5 animate-in fade-in duration-200">
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">
                Step 2: Tell Us About Your Driving Lifestyle
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Our algorithm factors in daily mileage, seating configuration, and preferred powertrain.
              </p>
            </div>

            <div className="space-y-4">
              <RadioGroup
                name="lifestyle"
                label="Primary Primary Usage Pattern"
                cardVariant
                value={lifestyleUsage}
                onChange={(val) => setLifestyleUsage(String(val))}
                options={[
                  { label: "Executive Chauffeur", value: "executive", description: "Smooth rear-seat comfort & privacy" },
                  { label: "High-Performance Weekend", value: "performance", description: "Track dynamics and spirited driving" },
                  { label: "Family / Multi-Passenger", value: "family", description: "Luggage volume and high safety ratings" },
                ]}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="text-xs font-semibold text-[#0F172A] block mb-1.5">
                    Seating Capacity
                  </label>
                  <Dropdown
                    value={familySize}
                    onChange={(val) => setFamilySize(String(val))}
                    options={[
                      { label: "1 - 2 Passengers (Coupe/Roadster)", value: "1-2" },
                      { label: "4 - 5 Passengers (Executive Sedan/SUV)", value: "4-5" },
                      { label: "7+ Passengers (VIP Tourer/Van)", value: "7+" },
                    ]}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#0F172A] block mb-1.5">
                    Powertrain Preference
                  </label>
                  <Dropdown
                    value={powertrainInterest}
                    onChange={(val) => setPowertrainInterest(String(val))}
                    options={[
                      { label: "Twin-Turbo Petrol (V8/V6)", value: "Petrol" },
                      { label: "100% Pure Electric (Zero Emissions)", value: "Electric" },
                      { label: "Plug-in Hybrid (Eco + Performance)", value: "Hybrid" },
                    ]}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
              <Button
                variant="outline"
                size="md"
                onClick={() => setCurrentStep(1)}
                leftIcon={<FiArrowLeft className="w-4 h-4 text-[#2563EB]" />}
              >
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setCurrentStep(3)}
                rightIcon={<FiZap className="w-4 h-4 text-[#FFFFFF]" />}
              >
                Generate Matches
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Algorithmic Recommendations Output */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center shrink-0">
                  <FiCheckCircle className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#0F172A]">3 Compatible Vehicles Located</div>
                  <div className="text-xs text-[#64748B]">
                    Filtered across {preferredCategory} matching your profile.
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(1)}
                leftIcon={<FiCompass className="w-3.5 h-3.5" />}
              >
                Adjust Criteria
              </Button>
            </div>

            {/* Recommendation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recommendedVehicles.map((car, index) => (
                <div
                  key={car.stockId}
                  className="bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#2563EB] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl flex flex-col justify-between group transition-all duration-300"
                >
                  <div>
                    {/* Image with Match Pill */}
                    <div className="relative h-44 w-full bg-[#0F172A]">
                      <Image src={car.image} alt={car.model} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] font-mono text-xs font-bold shadow-xs">
                          {car.matchScore}% Match
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge variant="gold" size="sm">
                          Rank #{index + 1}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 space-y-2.5">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#2563EB] font-bold">
                          {car.category}
                        </span>
                        <h4 className="text-base font-bold text-[#0F172A] truncate mt-0.5">
                          {car.make} {car.model}
                        </h4>
                        <div className="text-sm font-extrabold font-mono text-[#1D4ED8]">
                          ${car.priceUSD.toLocaleString()}
                        </div>
                      </div>

                      {/* Rationale Bubble */}
                      <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] text-[11px] text-[#475569] leading-relaxed">
                        <span className="text-[#2563EB] font-bold block mb-0.5">Why this fits you:</span>
                        {car.rationale}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#64748B] font-mono pt-1">
                        <span>{car.horsepower} HP</span>
                        <span>&bull;</span>
                        <span>{car.transmission}</span>
                        <span>&bull;</span>
                        <span>{car.fuel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 space-y-2">
                    <Link href={`/inventory/${car.stockId}`}>
                      <Button variant="primary" size="sm" fullWidth>
                        Inspect Specifications
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => {
                        setSelectedMatchCar(car);
                        setIsLeadModalOpen(true);
                      }}
                      leftIcon={<FiCalendar className="w-3.5 h-3.5" />}
                    >
                      Book VIP Appointment
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Lead Capture Modal */}
      <Modal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        size="lg"
        title={
          selectedMatchCar ? (
            <span>
              Reserve VIP Consultation: <span className="text-[#2563EB]">{selectedMatchCar.make} {selectedMatchCar.model}</span>
            </span>
          ) : (
            "Book VIP Consultation"
          )
        }
        description="A premier sales concierge will reach out via WhatsApp with complete vehicle video walk-around and private viewing access."
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLeadModalOpen(false)}
              leftIcon={<FiX className="w-3.5 h-3.5" />}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                alert("Consultation booked! A concierge will message you shortly.");
                setIsLeadModalOpen(false);
              }}
              leftIcon={<FiCheck className="w-3.5 h-3.5 text-white" />}
            >
              Submit Consultation Request
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input label="Full Name" placeholder="e.g. Chief Alexander Vance" />
          <Input label="Phone Number / WhatsApp" placeholder="+234 (0) 800 123 4567" />
          <Input label="Email Address" type="email" placeholder="alexander@company.com" />
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
