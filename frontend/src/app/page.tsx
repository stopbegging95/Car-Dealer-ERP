"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiCalendar,
  FiShield,
  FiClock,
  FiDollarSign,
  FiChevronLeft,
  FiChevronRight,
  FiArrowRight,
  FiCompass,
  FiCheck,
  FiX,
  FiVideo,
} from "react-icons/fi";
import { FaCar } from "react-icons/fa6";
import {
  Button,
  Modal,
  FilterBar,
  FilterState,
  VehicleCard,
  Input,
  Dropdown,
} from "@/components/ui";
import { VEHICLES, Vehicle } from "@/data/vehicles";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Official vector logos for the dealership's flagship brand partners
const BRAND_LOGOS = [
  {
    name: "BMW",
    make: "BMW",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg",
    width: 38,
    height: 38,
  },
  {
    name: "Mercedes-Benz",
    make: "Mercedes-Benz",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg",
    width: 40,
    height: 40,
  },
  {
    name: "Audi",
    make: "Audi",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg",
    width: 56,
    height: 28,
  },
  {
    name: "Toyota",
    make: "Toyota",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Toyota.svg",
    width: 44,
    height: 32,
  },
  {
    name: "Lexus",
    make: "Lexus",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Lexus_division_emblem.svg",
    width: 46,
    height: 32,
  },
  {
    name: "Porsche",
    make: "Porsche",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Porsche_Wordmark_Logo_Black.svg",
    width: 78,
    height: 22,
  },
  {
    name: "Land Rover",
    make: "Land Rover",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Land_Rover_2023.svg",
    width: 72,
    height: 32,
  },
];

export default function App() {
  // Currency state
  const currency: "USD" | "NGN" = "USD";

  // Modal states
  const [isTestDriveOpen, setIsTestDriveOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [testDriveDate, setTestDriveDate] = useState("2026-11-15");
  const [testDriveLocation, setTestDriveLocation] = useState("Lagos Showroom");

  // Filter state for public page
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(VEHICLES);
  const [activeCategoryTab, setActiveCategoryTab] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const brandsRef = useRef<HTMLDivElement>(null);

  // Banner Slider State (5 distinct luxury archetypes):
  // Slide 0: Text + Image (Mercedes fleet + headline & CTAs)
  // Slide 1: Text Only (Editorial prestige — gradient bg, no image)
  // Slide 2: Image Only (Exotic supercar — full-bleed, no text)
  // Slide 3: Text + Video (Autoplaying background video + animated overlay text, no pause/play controls)
  // Slide 4: Video Only (Autoplaying full-bleed performance video without text stacked on it)
  const TOTAL_SLIDES = 5;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % TOTAL_SLIDES);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % TOTAL_SLIDES);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + TOTAL_SLIDES) % TOTAL_SLIDES);

  const scrollBrands = (direction: "left" | "right") => {
    if (brandsRef.current) {
      const scrollAmount = direction === "left" ? -260 : 260;
      brandsRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleBrandClick = (make: string) => {
    if (selectedBrand === make) {
      setSelectedBrand(null);
      setFilteredVehicles(VEHICLES);
    } else {
      setSelectedBrand(make);
      const result = VEHICLES.filter((v) => v.make.toLowerCase() === make.toLowerCase());
      setFilteredVehicles(result.length > 0 ? result : VEHICLES);
    }
    const el = document.getElementById("inventory-section");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle Search on Public FilterBar
  const handleFilterSearch = (filters: FilterState) => {
    let result = [...VEHICLES];
    if (filters.make) {
      result = result.filter((v) => v.make.toLowerCase() === filters.make.toLowerCase());
    }
    if (filters.model) {
      result = result.filter((v) => v.model.toLowerCase().includes(filters.model.toLowerCase()));
    }
    if (filters.category) {
      result = result.filter((v) => v.category.toLowerCase() === filters.category!.toLowerCase());
    }
    if (filters.fuel) {
      result = result.filter((v) => v.fuel.toLowerCase() === filters.fuel!.toLowerCase());
    }
    if (filters.transmission) {
      result = result.filter((v) => v.transmission.toLowerCase().includes(filters.transmission!.toLowerCase()));
    }
    if (filters.minYear) {
      result = result.filter((v) => v.year >= parseInt(filters.minYear, 10));
    }
    if (filters.maxYear) {
      result = result.filter((v) => v.year <= parseInt(filters.maxYear, 10));
    }
    if (filters.minPrice) {
      result = result.filter((v) => v.priceUSD >= parseInt(filters.minPrice, 10));
    }
    if (filters.maxPrice) {
      result = result.filter((v) => v.priceUSD <= parseInt(filters.maxPrice, 10));
    }
    setFilteredVehicles(result);
  };

  const openTestDriveModal = (vehicle?: Vehicle) => {
    setSelectedVehicle(vehicle || VEHICLES[0]);
    setIsTestDriveOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#2563EB] selection:text-[#FFFFFF]">
      {/* 1. Global Navigation Bar */}
      <Navbar onBookTestDrive={() => openTestDriveModal()} />

      {/* 2. HERO SLIDER BANNER SECTION */}
      <main className="flex-1 flex flex-col">
        <section className="relative overflow-visible pt-1 sm:pt-2 pb-5 sm:pb-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#F1F5F9] border-b border-[#E2E8F0]">
          {/* Main Slider Container */}
          <div
            className="max-w-7xl mx-auto w-full relative h-[420px] sm:h-[480px] md:h-[520px] lg:h-[540px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-[#CBD5E1] bg-[#0F172A] group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* ── SLIDE 0: Text + Image (Mercedes Premier Fleet) ── */}
            <div
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                currentSlide === 0
                  ? "opacity-100 z-10 pointer-events-auto"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Image
                src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1920&q=80"
                alt="Premier Luxury Fleet"
                fill
                sizes="100vw"
                unoptimized
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/75 to-transparent sm:w-4/5 md:w-3/4" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 via-transparent to-transparent" />

              <div className="relative h-full flex flex-col justify-center px-6 sm:px-12 md:px-16 max-w-2xl space-y-4 sm:space-y-5 text-white z-10">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/25 backdrop-blur-md border border-[#BFDBFE]/30 w-fit transition-all duration-700 ease-out transform ${
                    currentSlide === 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#60A5FA] animate-pulse" />
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#EFF6FF]">
                    PREMIUM LUXURY CAR DEALERSHIP
                  </span>
                </div>

                <h1
                  className={`text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-tight text-white drop-shadow-sm transition-all duration-700 delay-150 ease-out transform ${
                    currentSlide === 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                >
                  DRIVE YOUR <br />
                  <span className="bg-gradient-to-r from-[#60A5FA] via-[#93C5FD] to-[#FFFFFF] bg-clip-text text-transparent">
                    DREAM CAR
                  </span>
                </h1>

                <p
                  className={`text-xs sm:text-sm md:text-base text-[#E2E8F0] leading-relaxed max-w-lg drop-shadow transition-all duration-700 delay-300 ease-out transform ${
                    currentSlide === 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                >
                  Explore our prestigious collection of luxury and executive vehicles. Hand-selected, fully certified, and delivered with VIP concierge excellence.
                </p>

                <div
                  className={`flex flex-wrap items-center gap-3 pt-2 transition-all duration-700 delay-450 ease-out transform ${
                    currentSlide === 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                >
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      const el = document.getElementById("inventory-section");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    rightIcon={<FiArrowRight className="w-4 h-4 text-white" />}
                  >
                    View Inventory
                  </Button>

                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => openTestDriveModal()}
                    leftIcon={<FiCalendar className="w-4 h-4 text-[#2563EB]" />}
                  >
                    Book a Test Drive
                  </Button>
                </div>

                <div
                  className={`flex items-center gap-4 text-[11px] text-[#CBD5E1] pt-1 font-medium transition-all duration-700 delay-500 ease-out transform ${
                    currentSlide === 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <FiShield className="w-3.5 h-3.5 text-[#60A5FA]" />
                    150-Point Certified
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1.5">
                    <FiClock className="w-3.5 h-3.5 text-[#60A5FA]" />
                    Fast-Track Port Clearance
                  </span>
                </div>
              </div>
            </div>

            {/* ── SLIDE 1: Text Only (Editorial Prestige — gradient bg, no image) ── */}
            <div
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                currentSlide === 1
                  ? "opacity-100 z-10 pointer-events-auto"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <div className="h-full w-full bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0B1120] text-white flex flex-col justify-center px-6 sm:px-12 md:px-16 py-8 relative overflow-hidden">
                {/* Decorative background ambient glows */}
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#2563EB]/15 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#0284C7]/15 blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-3xl space-y-4 sm:space-y-5">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/20 border border-[#38BDF8]/30 w-fit transition-all duration-700 ease-out transform ${
                      currentSlide === 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                  >
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#38BDF8]">
                      THE PINNACLE OF AUTOMOTIVE PRESTIGE
                    </span>
                  </div>

                  <h2
                    className={`text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight text-white transition-all duration-700 delay-150 ease-out transform ${
                      currentSlide === 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                  >
                    CRAFTED FOR THE EXCEPTIONAL. <br />
                    <span className="bg-gradient-to-r from-[#38BDF8] via-[#60A5FA] to-[#93C5FD] bg-clip-text text-transparent">
                      UNCOMPROMISED LUXURY &amp; POWER.
                    </span>
                  </h2>

                  <p
                    className={`text-xs sm:text-sm md:text-base text-[#94A3B8] leading-relaxed max-w-2xl transition-all duration-700 delay-300 ease-out transform ${
                      currentSlide === 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                  >
                    Premier Auto Motors redefines luxury vehicle ownership with verified provenance, bespoke international sourcing, zero-demurrage terminal logistics, and private showroom viewings across Lagos and Abuja.
                  </p>

                  {/* 4 Feature Value Highlights */}
                  <div
                    className={`grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2 transition-all duration-700 delay-450 ease-out transform ${
                      currentSlide === 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                  >
                    <div className="bg-[#FFFFFF]/5 border border-white/10 rounded-md p-3 backdrop-blur-xs">
                      <div className="text-base sm:text-lg font-black text-[#38BDF8]">150-Point</div>
                      <div className="text-[10px] sm:text-xs text-[#CBD5E1]">Diagnostics Seal</div>
                    </div>
                    <div className="bg-[#FFFFFF]/5 border border-white/10 rounded-md p-3 backdrop-blur-xs">
                      <div className="text-base sm:text-lg font-black text-[#38BDF8]">24 Hours</div>
                      <div className="text-[10px] sm:text-xs text-[#CBD5E1]">Port Clearance</div>
                    </div>
                    <div className="bg-[#FFFFFF]/5 border border-white/10 rounded-md p-3 backdrop-blur-xs">
                      <div className="text-base sm:text-lg font-black text-[#38BDF8]">100% Clean</div>
                      <div className="text-[10px] sm:text-xs text-[#CBD5E1]">Carfax &amp; Title</div>
                    </div>
                    <div className="bg-[#FFFFFF]/5 border border-white/10 rounded-md p-3 backdrop-blur-xs">
                      <div className="text-base sm:text-lg font-black text-[#38BDF8]">White-Glove</div>
                      <div className="text-[10px] sm:text-xs text-[#CBD5E1]">Doorstep Delivery</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link href="/services/auto-brokers">
                      <Button variant="primary" size="sm" rightIcon={<FiArrowRight className="w-4 h-4 text-white" />}>
                        Explore Auto Broker Desk
                      </Button>
                    </Link>
                    <Link href="/about">
                      <Button variant="secondary" size="sm">
                        About Dealership
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* ── SLIDE 2: Image Only (Exotic Supercar — full-bleed, no text) ── */}
            <div
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                currentSlide === 2
                  ? "opacity-100 z-10 pointer-events-auto"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Image
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80"
                alt="Exotic Supercar Collection"
                fill
                sizes="100vw"
                unoptimized
                className="object-cover object-center"
              />
              {/* Atmospheric overlays only — intentionally no text content */}
              <div className="absolute inset-0 bg-[#0F172A]/25" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/55 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/15 via-transparent to-transparent" />
            </div>

            {/* ── SLIDE 3: Text + Video (Autoplaying video background + animated overlay text, no pause/play controls) ── */}
            <div
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                currentSlide === 3
                  ? "opacity-100 z-10 pointer-events-auto"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* YouTube video background — autoplays automatically when slide is current, zero pause/play controls */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none select-none bg-[#0F172A]">
                <iframe
                  src={
                    currentSlide === 3
                      ? "https://www.youtube-nocookie.com/embed/YAFUyPp_238?autoplay=1&mute=1&loop=1&playlist=YAFUyPp_238&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1"
                      : "about:blank"
                  }
                  title="Luxury Fleet Video Experience"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; compute-pressure"
                  loading="lazy"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340%] h-[340%] sm:w-[175%] sm:h-[175%] min-w-full min-h-full pointer-events-none border-0"
                  tabIndex={-1}
                />
              </div>

              {/* Gradient overlays for legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/75 to-transparent sm:w-4/5 md:w-3/4" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/30 via-transparent to-transparent" />

              {/* Animated text overlay — same layout pattern as Text+Image slide */}
              <div className="relative h-full flex flex-col justify-center px-6 sm:px-12 md:px-16 max-w-2xl space-y-4 sm:space-y-5 text-white z-10">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/25 backdrop-blur-md border border-[#BFDBFE]/30 w-fit transition-all duration-700 ease-out transform ${
                    currentSlide === 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                >
                  <FiVideo className="w-3 h-3 text-[#60A5FA] animate-pulse" />
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#EFF6FF]">
                    LIVE PERFORMANCE EXPERIENCE
                  </span>
                </div>

                <h2
                  className={`text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-tight text-white drop-shadow-sm transition-all duration-700 delay-150 ease-out transform ${
                    currentSlide === 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                >
                  FEEL EVERY <br />
                  <span className="bg-gradient-to-r from-[#60A5FA] via-[#93C5FD] to-[#FFFFFF] bg-clip-text text-transparent">
                    HEARTBEAT
                  </span>
                </h2>

                <p
                  className={`text-xs sm:text-sm md:text-base text-[#E2E8F0] leading-relaxed max-w-lg drop-shadow transition-all duration-700 delay-300 ease-out transform ${
                    currentSlide === 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                >
                  Raw power, precision engineering, and unrivalled driving dynamics — experience our fleet before you even set foot in the showroom.
                </p>

                <div
                  className={`flex flex-wrap items-center gap-3 pt-2 transition-all duration-700 delay-450 ease-out transform ${
                    currentSlide === 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                >
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      const el = document.getElementById("inventory-section");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    rightIcon={<FiArrowRight className="w-4 h-4 text-white" />}
                  >
                    Browse Performance Fleet
                  </Button>

                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => openTestDriveModal()}
                    leftIcon={<FiCalendar className="w-4 h-4 text-[#2563EB]" />}
                  >
                    Book Track Experience
                  </Button>
                </div>

                {/* Sub-badge perks matching Text+Image Slide */}
                <div
                  className={`flex items-center gap-4 text-[11px] text-[#CBD5E1] pt-1 font-medium transition-all duration-700 delay-500 ease-out transform ${
                    currentSlide === 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <FiShield className="w-3.5 h-3.5 text-[#60A5FA]" />
                    Track-Tested &amp; Certified
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1.5">
                    <FiClock className="w-3.5 h-3.5 text-[#60A5FA]" />
                    Dynamic Launch Demonstration
                  </span>
                </div>
              </div>
            </div>

            {/* ── SLIDE 4: Video Only (Pure full-bleed live performance footage — zero text stacked) ── */}
            <div
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                currentSlide === 4
                  ? "opacity-100 z-10 pointer-events-auto"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Full-bleed YouTube video background — autoplays automatically once current, no text stacked */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none select-none bg-[#0F172A]">
                <iframe
                  src={
                    currentSlide === 4
                      ? "https://www.youtube-nocookie.com/embed/YAFUyPp_238?autoplay=1&mute=1&loop=1&playlist=YAFUyPp_238&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1"
                      : "about:blank"
                  }
                  title="Pure Supercar Performance Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; compute-pressure"
                  loading="lazy"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340%] h-[340%] sm:w-[175%] sm:h-[175%] min-w-full min-h-full pointer-events-none border-0"
                  tabIndex={-1}
                />
              </div>

              {/* Atmospheric subtle vignette overlay only — intentionally zero text content, pure video */}
              <div className="absolute inset-0 bg-[#0F172A]/20 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Slider Navigation Arrows */}
            <Button
              variant="ghost"
              size="icon"
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0F172A]/40 hover:bg-[#0F172A]/70 text-white border border-white/20 backdrop-blur-md shadow-md opacity-80 hover:opacity-100"
            >
              <FiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={nextSlide}
              aria-label="Next Slide"
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0F172A]/40 hover:bg-[#0F172A]/70 text-white border border-white/20 backdrop-blur-md shadow-md opacity-80 hover:opacity-100"
            >
              <FiChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>

            {/* Slide Pagination Indicators */}
            <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-2.5 bg-[#0F172A]/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
              {[0, 1, 2, 3, 4].map((idx) => (
                <Button
                  key={idx}
                  variant="ghost"
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`!h-2 sm:!h-2.5 !p-0 !min-w-0 rounded-full transition-all duration-300 ${
                    currentSlide === idx
                      ? "!w-7 sm:!w-8 bg-[#2563EB] shadow-xs shadow-[#2563EB]/50"
                      : "!w-2 sm:!w-2.5 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 4 Value Proposition Badges */}
          <div className="max-w-7xl mx-auto w-full mt-4 sm:mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="flex items-center gap-3.5 bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#2563EB] rounded-md p-3.5 sm:p-4 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center shrink-0">
                <FaCar className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-black text-[#0F172A]">200+</div>
                <div className="text-[10px] sm:text-xs text-[#64748B] font-semibold">Premium Vehicles</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#2563EB] rounded-md p-3.5 sm:p-4 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center shrink-0">
                <FiShield className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-black text-[#0F172A]">100%</div>
                <div className="text-[10px] sm:text-xs text-[#64748B] font-semibold">Quality Guaranteed</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#2563EB] rounded-md p-3.5 sm:p-4 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center shrink-0">
                <FiClock className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-black text-[#0F172A]">24/7</div>
                <div className="text-[10px] sm:text-xs text-[#64748B] font-semibold">Customer Support</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#2563EB] rounded-md p-3.5 sm:p-4 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center shrink-0">
                <FiDollarSign className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-black text-[#0F172A]">Easy Finance</div>
                <div className="text-[10px] sm:text-xs text-[#64748B] font-semibold">Flexible Options</div>
              </div>
            </div>
          </div>

          {/* Brand Logo Showcase Strip */}
          <div className="max-w-7xl mx-auto w-full mt-2.5 sm:mt-3 bg-[#FFFFFF] rounded-md py-2.5 px-3 sm:px-4 flex items-center justify-between text-[#0F172A] shadow-xs border border-[#CBD5E1]">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scrollBrands("left")}
              aria-label="Previous Brands"
              className="p-2 rounded-md bg-[#F1F5F9] hover:bg-[#EFF6FF] text-[#475569] hover:text-[#2563EB] shrink-0"
            >
              <FiChevronLeft className="w-4 h-4" />
            </Button>

            {/* Brand Logo Items Carousel */}
            <div
              ref={brandsRef}
              className="flex items-center justify-around flex-1 gap-2 sm:gap-4 overflow-x-auto scrollbar-none py-1 px-2 scroll-smooth"
            >
              {BRAND_LOGOS.map((brand) => {
                const isSelected = selectedBrand === brand.make;
                return (
                  <Button
                    key={brand.name}
                    variant={isSelected ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => handleBrandClick(brand.make)}
                    title={`Filter by ${brand.name}`}
                    className={`group shrink-0 flex flex-col items-center justify-center py-1.5 px-3 sm:px-4 rounded-md transition-all duration-200 ${
                      isSelected
                        ? "bg-[#EFF6FF] border border-[#2563EB] shadow-xs"
                        : "hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0]"
                    }`}
                  >
                    <div className="h-8 sm:h-9 w-18 sm:w-22 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={brand.logo}
                        alt={`${brand.name} official logo`}
                        className={`max-h-6 sm:max-h-7 max-w-[70px] sm:max-w-[80px] w-auto h-auto object-contain transition-all duration-300 ${
                          isSelected
                            ? "opacity-100 scale-105"
                            : "opacity-75 group-hover:opacity-100 group-hover:scale-105"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-[10px] font-bold tracking-tight transition-colors mt-0.5 ${
                        isSelected ? "text-[#2563EB]" : "text-[#64748B] group-hover:text-[#0F172A]"
                      }`}
                    >
                      {brand.name}
                    </span>
                  </Button>
                );
              })}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => scrollBrands("right")}
              aria-label="Next Brands"
              className="p-2 rounded-md bg-[#F1F5F9] hover:bg-[#EFF6FF] text-[#475569] hover:text-[#2563EB] shrink-0"
            >
              <FiChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Filter Component Bar */}
          <div className="max-w-7xl mx-auto w-full mt-2.5 sm:mt-3 z-30 relative overflow-visible">
            <FilterBar onSearch={handleFilterSearch} />
          </div>
        </section>

        {/* 3. VEHICLE INVENTORY SHOWCASE */}
        <section
          id="inventory-section"
          className="py-14 sm:py-18 px-4 sm:px-8 lg:px-12 bg-[#F8FAFC] border-b border-[#E2E8F0]"
        >
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-5 h-0.5 bg-[#2563EB]" />
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                    BROWSE OUR SHOWROOM SELECTION
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase text-[#0F172A] tracking-tight">
                  FIND YOUR PERFECT DRIVE
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <Link href="/inventory">
                  <Button
                    variant="primary"
                    size="md"
                    rightIcon={<FiArrowRight className="w-4 h-4 text-white" />}
                  >
                    VIEW ALL INVENTORY
                  </Button>
                </Link>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="mb-8 flex items-center gap-2 overflow-x-auto max-w-full pb-1">
              {[
                { id: "all", label: "All Categories" },
                { id: "executive-class", label: "Executive Class" },
                { id: "sport-performance", label: "Sport & Performance" },
                { id: "premium-suvs", label: "Premium SUVs" },
                { id: "electric-vehicles", label: "Electric Vehicles" },
                { id: "power-bikes", label: "Power Bikes" },
                { id: "executive-buses", label: "Executive Buses" },
              ].map((tab) => {
                const isActive = activeCategoryTab === tab.id;
                return (
                  <Button
                    key={tab.id}
                    variant={isActive ? "primary" : "outline"}
                    size="sm"
                    onClick={() => {
                      setActiveCategoryTab(tab.id);
                      if (tab.id === "all") {
                        setFilteredVehicles(VEHICLES);
                      } else {
                        setFilteredVehicles(
                          VEHICLES.filter(
                            (v) => v.category.toLowerCase().replace(/[\s&]+/g, "-") === tab.id
                          )
                        );
                      }
                    }}
                    className="whitespace-nowrap"
                  >
                    {tab.label}
                  </Button>
                );
              })}
            </div>

            {/* Vehicle Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.stockId}
                  vehicle={vehicle}
                  currency={currency}
                  onBookTestDrive={() => openTestDriveModal(vehicle)}
                  onViewDetails={() => openTestDriveModal(vehicle)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 4. Specialized Services Showcase Strip */}
        <section className="py-14 px-4 sm:px-8 lg:px-12 bg-[#FFFFFF] border-b border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">VIP Services</span>
                <h3 className="text-2xl font-black text-[#0F172A] uppercase tracking-tight">Interactive Automotive Suite</h3>
              </div>
              <Link href="/services/ai-car-match">
                <Button variant="secondary" size="sm" rightIcon={<FiArrowRight className="w-3.5 h-3.5 text-[#0F172A]" />}>
                  Explore All Services
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Link
                href="/services/ai-car-match"
                className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#2563EB] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB] mb-4 group-hover:scale-110 group-hover:bg-[#2563EB] group-hover:text-[#FFFFFF] transition-all">
                  <FiCompass className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">AI Car Match</h4>
                <p className="text-xs text-[#64748B] leading-relaxed mt-1.5">Smart preference recommendation wizard that matches your lifestyle to the ideal vehicle.</p>
              </Link>

              <Link
                href="/services/loan-calculator"
                className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#2563EB] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB] mb-4 group-hover:scale-110 group-hover:bg-[#2563EB] group-hover:text-[#FFFFFF] transition-all">
                  <FiDollarSign className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">Loan Financing Calculator</h4>
                <p className="text-xs text-[#64748B] leading-relaxed mt-1.5">Real-time amortization schedule with deposit slider, loan tenure, and instant bank pre-qualification.</p>
              </Link>

              <Link
                href="/services/sell-or-swap"
                className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#2563EB] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB] mb-4 group-hover:scale-110 group-hover:bg-[#2563EB] group-hover:text-[#FFFFFF] transition-all">
                  <FiShield className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">Sell or Swap Trade-In</h4>
                <p className="text-xs text-[#64748B] leading-relaxed mt-1.5">Instant trade-in equity appraisal and balance reconciliation calculator against any stock car.</p>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Book a Test Drive Modal */}
      <Modal
        isOpen={isTestDriveOpen}
        onClose={() => setIsTestDriveOpen(false)}
        size="lg"
        title={
          <div className="flex items-center gap-2">
            <FaCar className="w-5 h-5 text-[#2563EB]" />
            <span>Schedule a VIP Test Drive</span>
          </div>
        }
        description={`Experience the performance and comfort of the ${selectedVehicle?.make} ${selectedVehicle?.model}.`}
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
                alert(`VIP Test Drive scheduled for ${selectedVehicle?.make} ${selectedVehicle?.model} on ${testDriveDate} at ${testDriveLocation}. Our concierge will contact you.`);
                setIsTestDriveOpen(false);
              }}
              leftIcon={<FiCheck className="w-3.5 h-3.5 text-white" />}
            >
              Confirm VIP Booking
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {selectedVehicle && (
            <div className="p-3.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-3.5">
              <div className="relative w-24 h-16 rounded-md overflow-hidden shrink-0 bg-[#0F172A] border border-[#CBD5E1]">
                <Image src={selectedVehicle.image} alt={selectedVehicle.model} fill sizes="96px" className="object-cover" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#2563EB] font-bold">{selectedVehicle.stockId}</span>
                <h4 className="text-sm font-bold text-[#0F172A]">{selectedVehicle.make} {selectedVehicle.model}</h4>
                <span className="text-xs font-mono font-bold text-[#1D4ED8]">${selectedVehicle.priceUSD.toLocaleString()} USD</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input label="Full Name" placeholder="e.g. Chief Alexander Vance" required />
            <Input label="Phone Number" placeholder="+234 (0) 803 000 0000" required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Preferred Date"
              type="date"
              value={testDriveDate}
              onChange={(e) => setTestDriveDate(e.target.value)}
            />
            <Dropdown
              label="Showroom Location"
              value={testDriveLocation}
              onChange={(v) => setTestDriveLocation(String(v))}
              options={[
                { label: "Victoria Island HQ Flagship, Lagos", value: "Lagos Showroom" },
                { label: "Maitama Diplomatic Suite, Abuja", value: "Abuja Showroom" },
                { label: "VIP Private Concierge Residence Dispatch", value: "Home Delivery" },
              ]}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
