"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type SlideArchetype = "text-image" | "text-only" | "image-only" | "text-video" | "video-only";

export interface HomePageSlide {
  id: string;
  title: string;
  archetype: SlideArchetype;
  badge: string;
  headline: string;
  highlightText: string;
  description: string;
  mediaUrl: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  order: number;
  active: boolean;
  features?: Array<{ title: string; subtitle: string }>;
}

export interface BrandPartner {
  id: string;
  name: string;
  make: string;
  logo: string;
  width: number;
  height: number;
  active: boolean;
}

export interface PromoBanner {
  enabled: boolean;
  badge: string;
  message: string;
  linkText: string;
  linkUrl: string;
}

export interface HomePageContentData {
  slides: HomePageSlide[];
  brands: BrandPartner[];
  promoBanner: PromoBanner;
}

export const INITIAL_SLIDES: HomePageSlide[] = [
  {
    id: "SLIDE-001",
    title: "Mercedes Premier Luxury Fleet",
    archetype: "text-image",
    badge: "PREMIUM LUXURY CAR DEALERSHIP",
    headline: "DRIVE YOUR",
    highlightText: "DREAM CAR",
    description:
      "Explore our prestigious collection of luxury and executive vehicles. Hand-selected, fully certified, and delivered with VIP concierge excellence.",
    mediaUrl:
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1920&q=80",
    primaryCtaText: "View Inventory",
    primaryCtaLink: "#inventory-section",
    secondaryCtaText: "Book a Test Drive",
    secondaryCtaLink: "test-drive-modal",
    order: 1,
    active: true,
  },
  {
    id: "SLIDE-002",
    title: "The Pinnacle of Automotive Prestige",
    archetype: "text-only",
    badge: "THE PINNACLE OF AUTOMOTIVE PRESTIGE",
    headline: "CRAFTED FOR THE EXCEPTIONAL.",
    highlightText: "UNCOMPROMISED LUXURY & POWER.",
    description:
      "Premier Auto Motors redefines luxury vehicle ownership with verified provenance, bespoke international sourcing, zero-demurrage terminal logistics, and private showroom viewings across Lagos and Abuja.",
    mediaUrl: "",
    primaryCtaText: "Explore Auto Broker Desk",
    primaryCtaLink: "/services/auto-brokers",
    secondaryCtaText: "About Dealership",
    secondaryCtaLink: "/about",
    order: 2,
    active: true,
    features: [
      { title: "150-Point", subtitle: "Diagnostics Seal" },
      { title: "24 Hours", subtitle: "Port Clearance" },
      { title: "100% Clean", subtitle: "Carfax & Title" },
      { title: "White-Glove", subtitle: "Doorstep Delivery" },
    ],
  },
  {
    id: "SLIDE-003",
    title: "Exotic Supercar Collection",
    archetype: "image-only",
    badge: "EXOTIC MOTORSPORT",
    headline: "PURE EXOTIC PERFORMANCE",
    highlightText: "",
    description: "",
    mediaUrl:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80",
    primaryCtaText: "",
    primaryCtaLink: "",
    secondaryCtaText: "",
    secondaryCtaLink: "",
    order: 3,
    active: true,
  },
  {
    id: "SLIDE-004",
    title: "Live Performance Video Experience",
    archetype: "text-video",
    badge: "LIVE PERFORMANCE EXPERIENCE",
    headline: "FEEL EVERY",
    highlightText: "HEARTBEAT",
    description:
      "Raw power, precision engineering, and unrivalled driving dynamics — experience our fleet before you even set foot in the showroom.",
    mediaUrl: "https://www.youtube-nocookie.com/embed/YAFUyPp_238",
    primaryCtaText: "Browse Performance Fleet",
    primaryCtaLink: "#inventory-section",
    secondaryCtaText: "Book Track Experience",
    secondaryCtaLink: "test-drive-modal",
    order: 4,
    active: true,
  },
  {
    id: "SLIDE-005",
    title: "Cinematic Supercar Video Showcase",
    archetype: "video-only",
    badge: "4K CINEMATIC",
    headline: "CINEMATIC TRACK SHOWCASE",
    highlightText: "",
    description: "",
    mediaUrl: "https://www.youtube-nocookie.com/embed/YAFUyPp_238",
    primaryCtaText: "",
    primaryCtaLink: "",
    secondaryCtaText: "",
    secondaryCtaLink: "",
    order: 5,
    active: true,
  },
];

export const INITIAL_BRANDS: BrandPartner[] = [
  {
    id: "BRD-001",
    name: "BMW",
    make: "BMW",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg",
    width: 38,
    height: 38,
    active: true,
  },
  {
    id: "BRD-002",
    name: "Mercedes-Benz",
    make: "Mercedes-Benz",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg",
    width: 40,
    height: 40,
    active: true,
  },
  {
    id: "BRD-003",
    name: "Audi",
    make: "Audi",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg",
    width: 56,
    height: 28,
    active: true,
  },
  {
    id: "BRD-004",
    name: "Toyota",
    make: "Toyota",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Toyota.svg",
    width: 44,
    height: 32,
    active: true,
  },
  {
    id: "BRD-005",
    name: "Lexus",
    make: "Lexus",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Lexus_division_emblem.svg",
    width: 46,
    height: 32,
    active: true,
  },
  {
    id: "BRD-006",
    name: "Porsche",
    make: "Porsche",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Porsche_Wordmark_Logo_Black.svg",
    width: 78,
    height: 22,
    active: true,
  },
  {
    id: "BRD-007",
    name: "Land Rover",
    make: "Land Rover",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Land_Rover_2023.svg",
    width: 72,
    height: 32,
    active: true,
  },
];

export const INITIAL_PROMO: PromoBanner = {
  enabled: true,
  badge: "VIP INVENTORY ALERT",
  message: "New 2026 Mercedes-Maybach Night Series & 2024 Porsche 911 Turbo S just berthed at Lagos Port.",
  linkText: "View Stock",
  linkUrl: "/inventory",
};

const STORAGE_KEY = "luxauto_homepage_content_v1";

interface HomePageContextType {
  slides: HomePageSlide[];
  activeSlides: HomePageSlide[];
  brands: BrandPartner[];
  activeBrands: BrandPartner[];
  promoBanner: PromoBanner;
  createSlide: (slide: Omit<HomePageSlide, "id">) => HomePageSlide;
  updateSlide: (id: string, slide: Partial<HomePageSlide>) => void;
  deleteSlide: (id: string) => void;
  toggleSlideActive: (id: string) => void;
  createBrand: (brand: Omit<BrandPartner, "id">) => BrandPartner;
  updateBrand: (id: string, brand: Partial<BrandPartner>) => void;
  deleteBrand: (id: string) => void;
  toggleBrandActive: (id: string) => void;
  updatePromoBanner: (banner: Partial<PromoBanner>) => void;
  resetToDefaults: () => void;
}

const HomePageContext = createContext<HomePageContextType | undefined>(undefined);

export const HomePageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [slides, setSlides] = useState<HomePageSlide[]>(INITIAL_SLIDES);
  const [brands, setBrands] = useState<BrandPartner[]>(INITIAL_BRANDS);
  const [promoBanner, setPromoBanner] = useState<PromoBanner>(INITIAL_PROMO);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: HomePageContentData = JSON.parse(stored);
        if (Array.isArray(parsed.slides) && parsed.slides.length > 0) {
          setSlides(parsed.slides);
        }
        if (Array.isArray(parsed.brands) && parsed.brands.length > 0) {
          setBrands(parsed.brands);
        }
        if (parsed.promoBanner) {
          setPromoBanner(parsed.promoBanner);
        }
      }
    } catch {
      // Fallback to initial
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isInitialized) return;
    try {
      const payload: HomePageContentData = { slides, brands, promoBanner };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore quota errors
    }
  }, [slides, brands, promoBanner, isInitialized]);

  const activeSlides = slides.filter((s) => s.active).sort((a, b) => a.order - b.order);
  const activeBrands = brands.filter((b) => b.active);

  const createSlide = (newSlide: Omit<HomePageSlide, "id">): HomePageSlide => {
    const id = `SLIDE-${String(slides.length + 1).padStart(3, "0")}`;
    const created: HomePageSlide = { ...newSlide, id };
    setSlides((prev) => [...prev, created]);
    return created;
  };

  const updateSlide = (id: string, patch: Partial<HomePageSlide>) => {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const deleteSlide = (id: string) => {
    setSlides((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleSlideActive = (id: string) => {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
  };

  const createBrand = (newBrand: Omit<BrandPartner, "id">): BrandPartner => {
    const id = `BRD-${String(brands.length + 1).padStart(3, "0")}`;
    const created: BrandPartner = { ...newBrand, id };
    setBrands((prev) => [...prev, created]);
    return created;
  };

  const updateBrand = (id: string, patch: Partial<BrandPartner>) => {
    setBrands((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  };

  const deleteBrand = (id: string) => {
    setBrands((prev) => prev.filter((b) => b.id !== id));
  };

  const toggleBrandActive = (id: string) => {
    setBrands((prev) => prev.map((b) => (b.id === id ? { ...b, active: !b.active } : b)));
  };

  const updatePromoBanner = (patch: Partial<PromoBanner>) => {
    setPromoBanner((prev) => ({ ...prev, ...patch }));
  };

  const resetToDefaults = () => {
    setSlides(INITIAL_SLIDES);
    setBrands(INITIAL_BRANDS);
    setPromoBanner(INITIAL_PROMO);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  return (
    <HomePageContext.Provider
      value={{
        slides,
        activeSlides: activeSlides.length > 0 ? activeSlides : INITIAL_SLIDES,
        brands,
        activeBrands: activeBrands.length > 0 ? activeBrands : INITIAL_BRANDS,
        promoBanner,
        createSlide,
        updateSlide,
        deleteSlide,
        toggleSlideActive,
        createBrand,
        updateBrand,
        deleteBrand,
        toggleBrandActive,
        updatePromoBanner,
        resetToDefaults,
      }}
    >
      {children}
    </HomePageContext.Provider>
  );
};

export const useHomePageContent = () => {
  const context = useContext(HomePageContext);
  if (!context) {
    // Return graceful fallback if rendered outside provider
    return {
      slides: INITIAL_SLIDES,
      activeSlides: INITIAL_SLIDES,
      brands: INITIAL_BRANDS,
      activeBrands: INITIAL_BRANDS,
      promoBanner: INITIAL_PROMO,
      createSlide: (s: Omit<HomePageSlide, "id">) => ({ ...s, id: "TEMP" }),
      updateSlide: () => {},
      deleteSlide: () => {},
      toggleSlideActive: () => {},
      createBrand: (b: Omit<BrandPartner, "id">) => ({ ...b, id: "TEMP" }),
      updateBrand: () => {},
      deleteBrand: () => {},
      toggleBrandActive: () => {},
      updatePromoBanner: () => {},
      resetToDefaults: () => {},
    };
  }
  return context;
};

