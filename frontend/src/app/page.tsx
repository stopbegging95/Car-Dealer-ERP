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
import { VEHICLES, Vehicle, VehicleCategory } from "@/data/vehicles";
import { vehiclesApi } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  useHomePageContent,
  INITIAL_SLIDES,
  INITIAL_BRANDS,
} from "@/context/HomePageContext";

export default function App() {
  // Currency state
  const currency: "NGN" = "NGN";

  // Modal states
  const [isTestDriveOpen, setIsTestDriveOpen] = useState(false);
  const [isTestDriveConfirmModalOpen, setIsTestDriveConfirmModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [testDriveDate, setTestDriveDate] = useState("2026-11-15");
  const [testDriveLocation, setTestDriveLocation] = useState("Lagos Showroom");

  // Filter state for public page
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(VEHICLES);

  // Load live vehicle inventory from MongoDB
  useEffect(() => {
    let isMounted = true;
    vehiclesApi.getAll().then((res) => {
      if (res.success && res.data?.vehicles && Array.isArray(res.data.vehicles) && res.data.vehicles.length > 0) {
        if (isMounted) {
          const apiVehicles: Vehicle[] = res.data.vehicles.map((v: any) => ({
            stockId: v.stockId,
            vin: v.vin,
            category: (v.category || "Executive Class") as VehicleCategory,
            make: v.make,
            model: v.modelName || v.model,
            trim: v.trim || "",
            year: v.year,
            mileage: v.mileageKm || 0,
            condition: (v.condition === "Brand New" ? "Brand-new" : v.condition?.includes("Foreign") ? "Foreign-used" : "Locally-used") as any,
            transmission: v.transmission,
            fuel: v.fuelType,
            exteriorColor: v.exteriorColor,
            interiorColor: v.interiorColor,
            purchaseCost: Math.round(v.acquisitionCostNGN / 1550),
            landedCost: Math.round(v.landedCostNGN / 1550),
            priceUSD: Math.round(v.listingPriceNGN / 1550),
            priceNGN: v.listingPriceNGN,
            status: (v.status === "Showroom Ready" ? "Available" : v.status) as any,
            location: (v.currentHub || "Lagos Showroom") as any,
            image: v.thumbnail || v.images?.[0] || "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
            gallery: v.images || [],
            features: v.features || [],
            horsepower: v.specifications?.horsepower || 500,
            engine: v.engineCapacity || "4.0L V8 Bi-Turbo",
            description: v.notes || `${v.year} ${v.make} ${v.modelName}`,
          }));
          setFilteredVehicles(apiVehicles);
        }
      }
    }).catch(() => {});

    return () => { isMounted = false; };
  }, []);
  const [activeCategoryTab, setActiveCategoryTab] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const brandsRef = useRef<HTMLDivElement>(null);

  // Consume dynamic homepage configuration from Admin CMS Context
  const { activeSlides, activeBrands, promoBanner } = useHomePageContent();

  const slidesToRender = activeSlides && activeSlides.length > 0 ? activeSlides : INITIAL_SLIDES;
  const brandsToRender = activeBrands && activeBrands.length > 0 ? activeBrands : INITIAL_BRANDS;
  const TOTAL_SLIDES = slidesToRender.length;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Safe clamped index in case slides were modified in admin
  const safeSlideIndex = currentSlide >= TOTAL_SLIDES ? 0 : currentSlide;

  useEffect(() => {
    if (isPaused || TOTAL_SLIDES <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % TOTAL_SLIDES);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, TOTAL_SLIDES]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % TOTAL_SLIDES);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + TOTAL_SLIDES) % TOTAL_SLIDES);

  const getEmbedUrl = (url: string, isCurrent: boolean): string => {
    if (!isCurrent || !url) return "about:blank";
    let videoId = "";
    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1]?.split("&")[0] || "";
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
    } else if (url.includes("/embed/")) {
      videoId = url.split("/embed/")[1]?.split("?")[0] || "";
    }

    if (videoId) {
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1`;
    }
    if (url.includes("autoplay=1")) return url;
    return url.includes("?") ? `${url}&autoplay=1&mute=1&controls=0` : `${url}?autoplay=1&mute=1&controls=0`;
  };

  const handleCtaClick = (link: string) => {
    if (!link) return;
    if (link.startsWith("#")) {
      const el = document.getElementById(link.replace("#", ""));
      el?.scrollIntoView({ behavior: "smooth" });
    } else if (link === "test-drive-modal") {
      openTestDriveModal();
    } else {
      window.location.href = link;
    }
  };

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
      result = result.filter((v) => v.priceNGN >= parseInt(filters.minPrice, 10));
    }
    if (filters.maxPrice) {
      result = result.filter((v) => v.priceNGN <= parseInt(filters.maxPrice, 10));
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

      {/* Dynamic Top Announcement Ticker (Managed via Admin CMS) */}
      {promoBanner?.enabled && promoBanner.message && (
        <aside aria-label="dealership-announcement" className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white border-b border-[#334155] px-4 py-2 sm:py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
              {promoBanner.badge && (
                <span className="bg-[#2563EB] text-white text-[10px] sm:text-xs font-bold uppercase px-2 py-0.5 rounded shadow-xs shrink-0">
                  {promoBanner.badge}
                </span>
              )}
              <span className="text-[#E2E8F0] font-medium truncate">{promoBanner.message}</span>
            </div>
            {promoBanner.linkText && (
              <Link
                href={promoBanner.linkUrl || "#"}
                className="inline-flex items-center gap-1 text-[#60A5FA] hover:text-[#93C5FD] font-semibold text-xs shrink-0 underline underline-offset-2 transition-colors"
              >
                {promoBanner.linkText}
                <FiArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </aside>
      )}

      {/* 2. HERO SLIDER BANNER SECTION */}
      <main className="flex-1 flex flex-col">
        <section className="relative overflow-visible pt-1 sm:pt-2 pb-5 sm:pb-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#F1F5F9] border-b border-[#E2E8F0]">
          {/* Main Slider Container */}
          <div
            className="max-w-7xl mx-auto w-full relative h-[420px] sm:h-[480px] md:h-[520px] lg:h-[540px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-[#CBD5E1] bg-[#0F172A] group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Dynamic Archetype Slide Renderer */}
            {slidesToRender.map((slide, index) => {
              const isCurrent = safeSlideIndex === index;

              // Archetype 1: Text + Image
              if (slide.archetype === "text-image") {
                return (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      isCurrent
                        ? "opacity-100 z-10 pointer-events-auto"
                        : "opacity-0 z-0 pointer-events-none"
                    }`}
                  >
                    <Image
                      src={
                        slide.mediaUrl ||
                        "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1920&q=80"
                      }
                      alt={slide.title}
                      fill
                      sizes="100vw"
                      unoptimized
                      className="object-cover object-center"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/75 to-transparent sm:w-4/5 md:w-3/4" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 via-transparent to-transparent" />

                    <div className="relative h-full flex flex-col justify-center px-6 sm:px-12 md:px-16 max-w-2xl space-y-4 sm:space-y-5 text-white z-10">
                      {slide.badge && (
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/25 backdrop-blur-md border border-[#BFDBFE]/30 w-fit transition-all duration-700 ease-out transform ${
                            isCurrent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-[#60A5FA] animate-pulse" />
                          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#EFF6FF]">
                            {slide.badge}
                          </span>
                        </div>
                      )}

                      <h1
                        className={`text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-tight text-white drop-shadow-sm transition-all duration-700 delay-150 ease-out transform ${
                          isCurrent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                      >
                        {slide.headline} <br />
                        {slide.highlightText && (
                          <span className="bg-gradient-to-r from-[#60A5FA] via-[#93C5FD] to-[#FFFFFF] bg-clip-text text-transparent">
                            {slide.highlightText}
                          </span>
                        )}
                      </h1>

                      {slide.description && (
                        <p
                          className={`text-xs sm:text-sm md:text-base text-[#E2E8F0] leading-relaxed max-w-lg drop-shadow transition-all duration-700 delay-300 ease-out transform ${
                            isCurrent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                          }`}
                        >
                          {slide.description}
                        </p>
                      )}

                      <div
                        className={`flex flex-wrap items-center gap-3 pt-2 transition-all duration-700 delay-450 ease-out transform ${
                          isCurrent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                      >
                        {slide.primaryCtaText && (
                          <Button
                            variant="primary"
                            size="md"
                            onClick={() => handleCtaClick(slide.primaryCtaLink || "#inventory-section")}
                            rightIcon={<FiArrowRight className="w-4 h-4 text-white" />}
                          >
                            {slide.primaryCtaText}
                          </Button>
                        )}

                        {slide.secondaryCtaText && (
                          <Button
                            variant="secondary"
                            size="md"
                            onClick={() => handleCtaClick(slide.secondaryCtaLink || "test-drive-modal")}
                            leftIcon={<FiCalendar className="w-4 h-4 text-[#2563EB]" />}
                          >
                            {slide.secondaryCtaText}
                          </Button>
                        )}
                      </div>

                      <div
                        className={`flex items-center gap-4 text-[11px] text-[#CBD5E1] pt-1 font-medium transition-all duration-700 delay-500 ease-out transform ${
                          isCurrent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
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
                );
              }

              // Archetype 2: Text Only (Editorial Prestige)
              if (slide.archetype === "text-only") {
                return (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      isCurrent
                        ? "opacity-100 z-10 pointer-events-auto"
                        : "opacity-0 z-0 pointer-events-none"
                    }`}
                  >
                    <div className="h-full w-full bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0B1120] text-white flex flex-col justify-center px-6 sm:px-12 md:px-16 py-8 relative overflow-hidden">
                      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#2563EB]/15 blur-3xl pointer-events-none" />
                      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#0284C7]/15 blur-3xl pointer-events-none" />

                      <div className="relative z-10 max-w-3xl space-y-4 sm:space-y-5">
                        {slide.badge && (
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/20 border border-[#38BDF8]/30 w-fit transition-all duration-700 ease-out transform ${
                              isCurrent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                          >
                            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#38BDF8]">
                              {slide.badge}
                            </span>
                          </div>
                        )}

                        <h2
                          className={`text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight text-white transition-all duration-700 delay-150 ease-out transform ${
                            isCurrent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                          }`}
                        >
                          {slide.headline} <br />
                          {slide.highlightText && (
                            <span className="bg-gradient-to-r from-[#38BDF8] via-[#60A5FA] to-[#93C5FD] bg-clip-text text-transparent">
                              {slide.highlightText}
                            </span>
                          )}
                        </h2>

                        {slide.description && (
                          <p
                            className={`text-xs sm:text-sm md:text-base text-[#94A3B8] leading-relaxed max-w-2xl transition-all duration-700 delay-300 ease-out transform ${
                              isCurrent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                          >
                            {slide.description}
                          </p>
                        )}

                        <div
                          className={`grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2 transition-all duration-700 delay-450 ease-out transform ${
                            isCurrent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                          }`}
                        >
                          {(slide.features && slide.features.length > 0
                            ? slide.features
                            : [
                                { title: "150-Point", subtitle: "Diagnostics Seal" },
                                { title: "24 Hours", subtitle: "Port Clearance" },
                                { title: "100% Clean", subtitle: "Carfax & Title" },
                                { title: "White-Glove", subtitle: "Doorstep Delivery" },
                              ]
                          ).map((feat, fIdx) => (
                            <div key={fIdx} className="bg-[#FFFFFF]/5 border border-white/10 rounded-md p-3 backdrop-blur-xs">
                              <div className="text-base sm:text-lg font-black text-[#38BDF8]">{feat.title}</div>
                              <div className="text-[10px] sm:text-xs text-[#CBD5E1]">{feat.subtitle}</div>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          {slide.primaryCtaText && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleCtaClick(slide.primaryCtaLink || "/services/auto-brokers")}
                              rightIcon={<FiArrowRight className="w-4 h-4 text-white" />}
                            >
                              {slide.primaryCtaText}
                            </Button>
                          )}
                          {slide.secondaryCtaText && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleCtaClick(slide.secondaryCtaLink || "/about")}
                            >
                              {slide.secondaryCtaText}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // Archetype 3: Image Only (Exotic Supercar)
              if (slide.archetype === "image-only") {
                return (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      isCurrent
                        ? "opacity-100 z-10 pointer-events-auto"
                        : "opacity-0 z-0 pointer-events-none"
                    }`}
                  >
                    <Image
                      src={
                        slide.mediaUrl ||
                        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80"
                      }
                      alt={slide.title}
                      fill
                      sizes="100vw"
                      unoptimized
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-[#0F172A]/25" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/55 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/15 via-transparent to-transparent" />
                  </div>
                );
              }

              // Archetype 4: Text + Video
              if (slide.archetype === "text-video") {
                return (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      isCurrent
                        ? "opacity-100 z-10 pointer-events-auto"
                        : "opacity-0 z-0 pointer-events-none"
                    }`}
                  >
                    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none bg-[#0F172A]">
                      <iframe
                        src={getEmbedUrl(slide.mediaUrl, isCurrent)}
                        title={slide.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; compute-pressure"
                        loading="lazy"
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340%] h-[340%] sm:w-[175%] sm:h-[175%] min-w-full min-h-full pointer-events-none border-0"
                        tabIndex={-1}
                      />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/75 to-transparent sm:w-4/5 md:w-3/4" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/30 via-transparent to-transparent" />

                    <div className="relative h-full flex flex-col justify-center px-6 sm:px-12 md:px-16 max-w-2xl space-y-4 sm:space-y-5 text-white z-10">
                      {slide.badge && (
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/25 backdrop-blur-md border border-[#BFDBFE]/30 w-fit transition-all duration-700 ease-out transform ${
                            isCurrent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                          }`}
                        >
                          <FiVideo className="w-3 h-3 text-[#60A5FA] animate-pulse" />
                          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#EFF6FF]">
                            {slide.badge}
                          </span>
                        </div>
                      )}

                      <h2
                        className={`text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-tight text-white drop-shadow-sm transition-all duration-700 delay-150 ease-out transform ${
                          isCurrent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                      >
                        {slide.headline} <br />
                        {slide.highlightText && (
                          <span className="bg-gradient-to-r from-[#60A5FA] via-[#93C5FD] to-[#FFFFFF] bg-clip-text text-transparent">
                            {slide.highlightText}
                          </span>
                        )}
                      </h2>

                      {slide.description && (
                        <p
                          className={`text-xs sm:text-sm md:text-base text-[#E2E8F0] leading-relaxed max-w-lg drop-shadow transition-all duration-700 delay-300 ease-out transform ${
                            isCurrent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                          }`}
                        >
                          {slide.description}
                        </p>
                      )}

                      <div
                        className={`flex flex-wrap items-center gap-3 pt-2 transition-all duration-700 delay-450 ease-out transform ${
                          isCurrent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                      >
                        {slide.primaryCtaText && (
                          <Button
                            variant="primary"
                            size="md"
                            onClick={() => handleCtaClick(slide.primaryCtaLink || "#inventory-section")}
                            rightIcon={<FiArrowRight className="w-4 h-4 text-white" />}
                          >
                            {slide.primaryCtaText}
                          </Button>
                        )}

                        {slide.secondaryCtaText && (
                          <Button
                            variant="secondary"
                            size="md"
                            onClick={() => handleCtaClick(slide.secondaryCtaLink || "test-drive-modal")}
                            leftIcon={<FiCalendar className="w-4 h-4 text-[#2563EB]" />}
                          >
                            {slide.secondaryCtaText}
                          </Button>
                        )}
                      </div>

                      <div
                        className={`flex items-center gap-4 text-[11px] text-[#CBD5E1] pt-1 font-medium transition-all duration-700 delay-500 ease-out transform ${
                          isCurrent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
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
                );
              }

              // Archetype 5: Video Only (Pure Live Performance Footage)
              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    isCurrent
                      ? "opacity-100 z-10 pointer-events-auto"
                      : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <div className="absolute inset-0 overflow-hidden pointer-events-none select-none bg-[#0F172A]">
                    <iframe
                      src={getEmbedUrl(slide.mediaUrl, isCurrent)}
                      title={slide.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; compute-pressure"
                      loading="lazy"
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340%] h-[340%] sm:w-[175%] sm:h-[175%] min-w-full min-h-full pointer-events-none border-0"
                      tabIndex={-1}
                    />
                  </div>
                  <div className="absolute inset-0 bg-[#0F172A]/20 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/50 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/20 via-transparent to-transparent pointer-events-none" />
                </div>
              );
            })}

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
              {slidesToRender.map((_, idx) => (
                <Button
                  key={idx}
                  variant="ghost"
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`!h-2 sm:!h-2.5 !p-0 !min-w-0 rounded-full transition-all duration-300 ${
                    safeSlideIndex === idx
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
              {brandsToRender.map((brand) => {
                const isSelected = selectedBrand?.toLowerCase() === brand.make.toLowerCase();
                return (
                  <Button
                    key={brand.id || brand.name}
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
                setIsTestDriveOpen(false);
                setIsTestDriveConfirmModalOpen(true);
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
                <span className="text-xs font-mono font-bold text-[#1D4ED8]">₦{selectedVehicle.priceNGN.toLocaleString()} NGN</span>
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

      {/* Test Drive Scheduled Confirmation Modal */}
      <Modal
        isOpen={isTestDriveConfirmModalOpen}
        onClose={() => setIsTestDriveConfirmModalOpen(false)}
        title="VIP Test Drive Scheduled"
        description="Private viewing and test drive confirmed."
        size="sm"
        footer={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsTestDriveConfirmModalOpen(false)}
            leftIcon={<FiCheck className="w-3.5 h-3.5 text-white" />}
          >
            Acknowledge & Close
          </Button>
        }
      >
        <div className="space-y-3 text-xs text-[#475569]">
          <p>
            VIP Test Drive scheduled for <strong className="text-[#0F172A]">{selectedVehicle?.make} {selectedVehicle?.model}</strong> on <span className="text-[#2563EB] font-bold">{testDriveDate}</span> at the <span className="font-semibold text-[#0F172A]">{testDriveLocation}</span>.
          </p>
          <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg text-[11px] text-[#1D4ED8]">
            Our private concierge liaison will contact you via phone or WhatsApp 24 hours prior to confirm your private suite and gate access clearance.
          </div>
        </div>
      </Modal>
    </div>
  );
}
