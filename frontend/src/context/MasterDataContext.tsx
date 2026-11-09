"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { masterDataApi } from "@/lib/api";

export interface MasterOption {
  id: string;
  label: string;
  value: string;
  description?: string;
  isSystem?: boolean;
}

export interface MasterCategoryDef {
  key: string;
  name: string;
  description: string;
  allowInlineCreation: boolean;
  defaultOptions: MasterOption[];
}

export const MASTER_CATEGORIES: Record<string, MasterCategoryDef> = {
  hubs: {
    key: "hubs",
    name: "Showroom Hubs & Allocation Centers",
    description: "Physical facilities, delivery centers, port holding bays, and regional storage hubs.",
    allowInlineCreation: true,
    defaultOptions: [
      { id: "hub-1", label: "Victoria Island Flagship HQ (Lagos Showroom)", value: "Lagos Showroom", description: "Primary flagship showroom on Victoria Island" },
      { id: "hub-2", label: "Maitama Diplomatic Zone Suite (Abuja Showroom)", value: "Abuja Showroom", description: "Executive client suite in Maitama, Abuja" },
      { id: "hub-3", label: "Ikoyi Private Client VIP Lounge (Lagos)", value: "Ikoyi VIP Lounge", description: "Private appointments and bespoke handovers" },
      { id: "hub-4", label: "Lekki Phase 1 Performance Center (Lagos)", value: "Lekki Performance Center", description: "Service workshop, dyno tuning, and performance intake" },
      { id: "hub-5", label: "Tin Can Island Port Holding Bay (Port Transit)", value: "Port Transit", description: "Customs bonded staging terminal at Tin Can Port" },
      { id: "hub-6", label: "Central Distribution Warehouse (Central Warehouse)", value: "Central Warehouse", description: "Covered multi-vehicle logistics compound" },
    ],
  },
  categories: {
    key: "categories",
    name: "Vehicle Specification Classes",
    description: "Classification categories for vehicle fleet taxonomy and web showroom navigation.",
    allowInlineCreation: true,
    defaultOptions: [
      { id: "cat-1", label: "Executive Class", value: "Executive Class", description: "Chauffeured luxury sedans and flagship models" },
      { id: "cat-2", label: "Premium SUVs", value: "Premium SUVs", description: "Luxury 4x4 SUVs with high clearance and bespoke cabins" },
      { id: "cat-3", label: "Sport & Performance", value: "Sport & Performance", description: "High-horsepower supercars, coupes, and grand tourers" },
      { id: "cat-4", label: "Armored & Bulletproof", value: "Armored & Bulletproof", description: "B6/B7 ballistic armored security vehicles" },
      { id: "cat-5", label: "Ultra-Luxury Saloons", value: "Ultra-Luxury Saloons", description: "Handcrafted extended-wheelbase limousines" },
      { id: "cat-6", label: "Electric Vehicles (EV)", value: "Electric Vehicles", description: "Zero-emission performance battery electric vehicles" },
      { id: "cat-7", label: "Executive Buses & Vans", value: "Executive Buses", description: "Custom corporate sprinter and mobile boardroom vans" },
      { id: "cat-8", label: "Power Bikes & Motorcycles", value: "Power Bikes", description: "High-capacity touring and sport motorcycles" },
    ],
  },
  makes: {
    key: "makes",
    name: "Vehicle Manufacturers & Brands",
    description: "Automotive marques and certified OEM manufacturers represented in inventory.",
    allowInlineCreation: true,
    defaultOptions: [
      { id: "mk-1", label: "Mercedes-Benz", value: "Mercedes-Benz" },
      { id: "mk-2", label: "Mercedes-Maybach", value: "Mercedes-Maybach" },
      { id: "mk-3", label: "Mercedes-AMG", value: "Mercedes-AMG" },
      { id: "mk-4", label: "Porsche", value: "Porsche" },
      { id: "mk-5", label: "Land Rover / Range Rover", value: "Land Rover" },
      { id: "mk-6", label: "Rolls-Royce", value: "Rolls-Royce" },
      { id: "mk-7", label: "Bentley", value: "Bentley" },
      { id: "mk-8", label: "Ferrari", value: "Ferrari" },
      { id: "mk-9", label: "Lamborghini", value: "Lamborghini" },
      { id: "mk-10", label: "BMW", value: "BMW" },
      { id: "mk-11", label: "Audi", value: "Audi" },
      { id: "mk-12", label: "Lexus", value: "Lexus" },
      { id: "mk-13", label: "Toyota", value: "Toyota" },
    ],
  },
  ports: {
    key: "ports",
    name: "Maritime Shipping Ports",
    description: "International ports of origin, loading berths, and Nigerian discharge terminals.",
    allowInlineCreation: true,
    defaultOptions: [
      { id: "port-1", label: "Tin Can Island Container Terminal (TCIT), Lagos", value: "Tin Can Island Container Terminal (TCIT), Lagos", description: "Discharge berth in Lagos" },
      { id: "port-2", label: "Port of Antwerp, Belgium", value: "Antwerp, Belgium", description: "European loading hub" },
      { id: "port-3", label: "Port of Hamburg, Germany", value: "Hamburg, Germany", description: "German automotive export hub" },
      { id: "port-4", label: "JAXPORT (Jacksonville, Florida, USA)", value: "JAXPORT, Florida, USA", description: "US East Coast Ro-Ro port" },
      { id: "port-5", label: "Jebel Ali Port (Dubai, UAE)", value: "Jebel Ali, Dubai, UAE", description: "Middle East container terminal" },
      { id: "port-6", label: "Port of Yokohama, Japan", value: "Yokohama, Japan", description: "Asia-Pacific automotive shipping" },
    ],
  },
  carriers: {
    key: "carriers",
    name: "Ocean Shipping Carriers & Lines",
    description: "Maritime shipping lines contracted for ocean freight transit to Nigerian ports.",
    allowInlineCreation: true,
    defaultOptions: [
      { id: "cr-1", label: "Grimaldi Lines (Ro-Ro)", value: "Grande Togo (Grimaldi Lines)" },
      { id: "cr-2", label: "MSC (Mediterranean Shipping Company)", value: "MSC ALTAIR (MSC Lines)" },
      { id: "cr-3", label: "Maersk Line (Containerized)", value: "Maersk Bintan (Maersk Line)" },
      { id: "cr-4", label: "CMA CGM (Global Ro-Ro)", value: "CMA CGM Palais (CMA CGM)" },
      { id: "cr-5", label: "Ocean Network Express (ONE)", value: "ONE Continuity (ONE Lines)" },
    ],
  },
  suppliers: {
    key: "suppliers",
    name: "Suppliers & International Auction Desks",
    description: "Certified suppliers, wholesale buying desks, and overseas auction syndicates.",
    allowInlineCreation: true,
    defaultOptions: [
      { id: "sup-1", label: "Manheim International Auto Auctions (USA)", value: "Manheim International Auto Auctions" },
      { id: "sup-2", label: "BCA European Vehicle Auctions (Germany / UK)", value: "BCA European Vehicle Auctions" },
      { id: "sup-3", label: "Stuttgart Prime Dealer Group (Germany)", value: "Stuttgart Prime Dealer Group" },
      { id: "sup-4", label: "Copart Certified Export Services (USA)", value: "Copart Certified Export Services" },
      { id: "sup-5", label: "Emirates Auction Group (Dubai)", value: "Emirates Auction Group" },
      { id: "sup-6", label: "Prestige Auto Brokers Antwerp (Belgium)", value: "Prestige Auto Brokers Antwerp" },
    ],
  },
  banks: {
    key: "banks",
    name: "Corporate Banks & Settlement Accounts",
    description: "Authorized financial institutions holding dealership corporate and escrow accounts.",
    allowInlineCreation: true,
    defaultOptions: [
      { id: "bnk-1", label: "Zenith Bank Plc (Lagos Corporate HQ)", value: "Zenith Bank Plc" },
      { id: "bnk-2", label: "Guaranty Trust Bank (GTBank) Plc", value: "Guaranty Trust Bank (GTBank) Plc" },
      { id: "bnk-3", label: "First Bank of Nigeria (Customs SGD Escrow)", value: "First Bank of Nigeria" },
      { id: "bnk-4", label: "Stanbic IBTC Bank (Asset Finance Facility)", value: "Stanbic IBTC Bank" },
      { id: "bnk-5", label: "Access Bank Plc (Commercial Accounts)", value: "Access Bank Plc" },
    ],
  },
  payment_channels: {
    key: "payment_channels",
    name: "Payment Channels & Remittance Methods",
    description: "Settlement channels for sales deposits, supplier wires, and customs payments.",
    allowInlineCreation: true,
    defaultOptions: [
      { id: "pm-1", label: "Direct Bank Wire Transfer (NIP / RTGS)", value: "Direct Bank Wire Transfer (NIP / RTGS)" },
      { id: "pm-2", label: "Corporate Treasury Escrow Account", value: "Corporate Treasury Escrow Account" },
      { id: "pm-3", label: "NCS Direct Remittance (Nigeria Customs Port Duty)", value: "NCS Direct Remittance" },
      { id: "pm-4", label: "Commercial Bank Asset Finance Facility", value: "Bank Asset Finance Facility" },
      { id: "pm-5", label: "Certified Corporate Bank Draft", value: "Certified Corporate Bank Draft" },
    ],
  },
  inspection_centers: {
    key: "inspection_centers",
    name: "Diagnostic Inspection Centers & Bays",
    description: "Authorized facilities for 150-point PDI pre-delivery and trade-in appraisals.",
    allowInlineCreation: true,
    defaultOptions: [
      { id: "ic-1", label: "Victoria Island Flagship Showroom, Lagos", value: "Victoria Island Flagship Showroom, Lagos" },
      { id: "ic-2", label: "Ikoyi Private Client VIP Lounge, Lagos", value: "Ikoyi Private Client VIP Lounge, Lagos" },
      { id: "ic-3", label: "Maitama Diplomatic Zone Suite, Abuja", value: "Maitama Diplomatic Zone Suite, Abuja" },
      { id: "ic-4", label: "Lekki Phase 1 Performance Center, Lagos", value: "Lekki Phase 1 Performance Center, Lagos" },
      { id: "ic-5", label: "Tin Can Port Intake Inspection Bay, Lagos", value: "Tin Can Port Intake Inspection Bay, Lagos" },
    ],
  },
  sourcing_markets: {
    key: "sourcing_markets",
    name: "International Sourcing Markets",
    description: "Regional desks and private dealer networks for bespoke client sourcing briefs.",
    allowInlineCreation: true,
    defaultOptions: [
      { id: "sm-1", label: "Germany (Stuttgart / Munich / Frankfurt)", value: "Germany (Stuttgart / Munich)" },
      { id: "sm-2", label: "United States (California / Florida / Texas)", value: "United States (California / Florida)" },
      { id: "sm-3", label: "United Arab Emirates (Dubai / Abu Dhabi)", value: "United Arab Emirates (Dubai)" },
      { id: "sm-4", label: "United Kingdom (London / Birmingham)", value: "United Kingdom (London)" },
      { id: "sm-5", label: "Japan (Tokyo / Yokohama / Nagoya)", value: "Japan (Yokohama / Tokyo)" },
      { id: "sm-6", label: "Belgium & Netherlands (Antwerp / Rotterdam)", value: "Belgium & Netherlands (Antwerp)" },
    ],
  },
  departments: {
    key: "departments",
    name: "Dealership Departments & Desks",
    description: "Operational functional divisions, RBAC clearances, and reporting structures.",
    allowInlineCreation: true,
    defaultOptions: [
      { id: "dept-1", label: "Executive Management & Super Admin", value: "admin" },
      { id: "dept-2", label: "Showroom Orders & Sales Desk", value: "sales" },
      { id: "dept-3", label: "Procurement & International Sourcing", value: "procurement" },
      { id: "dept-4", label: "Technical Service & Workshop Bays", value: "service" },
      { id: "dept-5", label: "OEM Parts & Warehouse Depot", value: "parts" },
      { id: "dept-6", label: "Automotive Financing (F&I)", value: "financing" },
      { id: "dept-7", label: "Vehicle Inspection & Quality Assurance (QA)", value: "inspection" },
      { id: "dept-8", label: "Aesthetic Detailing & Reconditioning", value: "recon" },
      { id: "dept-9", label: "Importation & Customs Clearance Logistics", value: "imports" },
      { id: "dept-10", label: "Trade-In & Vehicle Swap Appraisals", value: "trade-ins" },
      { id: "dept-11", label: "Customer Relations Management (CRM)", value: "crm" },
      { id: "dept-12", label: "Finance & General Ledger Accounting", value: "accounting" },
      { id: "dept-13", label: "Human Resources & Talent Management", value: "hr" },
      { id: "dept-14", label: "Digital Content & CMS Marketing", value: "cms" },
    ],
  },
  dispute_categories: {
    key: "dispute_categories",
    name: "CRM Dispute & Complaint Categories",
    description: "Standard ticket classifications for customer dispute resolution and tracking.",
    allowInlineCreation: true,
    defaultOptions: [
      { id: "disp-1", label: "Vehicle Delivery & Logistics Timeline", value: "Delivery Timeline" },
      { id: "disp-2", label: "Customs SGD Documentation & Title Transfer", value: "Documentation & Title" },
      { id: "disp-3", label: "Paint, Exterior Ceramic or Trim Finish", value: "Paint & Exterior" },
      { id: "disp-4", label: "Mechanical, OBD Diagnostic or Sensor Calibration", value: "Mechanical & Diagnostic" },
      { id: "disp-5", label: "Payment Allocation, Invoice or Receipt Issuance", value: "Payment & Invoices" },
      { id: "disp-6", label: "Accessories, Wheels or Custom Pack Installation", value: "Accessories & Specs" },
    ],
  },
};

const STORAGE_KEY = "cardeals_master_options_store_v1";

interface MasterDataContextType {
  categories: MasterCategoryDef[];
  getCategoryDef: (categoryKey: string) => MasterCategoryDef | undefined;
  getOptions: (categoryKey: string) => { label: string; value: string; id: string; description?: string }[];
  getOptionLabel: (categoryKey: string, value: string) => string;
  addOption: (categoryKey: string, option: { label: string; value?: string; description?: string }) => MasterOption;
  updateOption: (categoryKey: string, id: string, updates: Partial<Omit<MasterOption, "id">>) => boolean;
  deleteOption: (categoryKey: string, id: string) => boolean;
  resetCategory: (categoryKey: string) => void;
  resetAll: () => void;
  isLoaded: boolean;
}

const MasterDataContext = createContext<MasterDataContextType | null>(null);

function getInitialStore(): Record<string, MasterOption[]> {
  const store: Record<string, MasterOption[]> = {};
  Object.keys(MASTER_CATEGORIES).forEach((key) => {
    store[key] = [...MASTER_CATEGORIES[key].defaultOptions];
  });
  return store;
}

export const MasterDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [store, setStore] = useState<Record<string, MasterOption[]>>(getInitialStore);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from backend API with localStorage backup
  useEffect(() => {
    let isMounted = true;
    const fetchRemoteData = async () => {
      try {
        const res = await masterDataApi.getAll();
        if (res.success && res.data?.items && Array.isArray(res.data.items) && res.data.items.length > 0) {
          const remoteStore: Record<string, MasterOption[]> = getInitialStore();
          res.data.items.forEach((item: any) => {
            const cat = item.category?.toLowerCase();
            if (cat) {
              if (!remoteStore[cat]) remoteStore[cat] = [];
              remoteStore[cat].push({
                id: item._id || item.id,
                label: item.label,
                value: item.value,
                description: item.description,
                isSystem: false,
              });
            }
          });
          if (isMounted) {
            setStore(remoteStore);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteStore));
            } catch {}
          }
          return;
        }
      } catch (err) {
        console.warn("Backend API not reachable for master data, falling back to local store:", err);
      }

      // Fallback to local storage if API is offline
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && isMounted) {
          const parsed = JSON.parse(saved);
          const merged: Record<string, MasterOption[]> = { ...getInitialStore(), ...parsed };
          setStore(merged);
        }
      } catch (e) {
        console.warn("Failed to read master data from localStorage:", e);
      } finally {
        if (isMounted) setIsLoaded(true);
      }
    };

    fetchRemoteData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Save to localStorage on state change
  const saveStore = useCallback((newStore: Record<string, MasterOption[]>) => {
    setStore(newStore);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));
    } catch (e) {
      console.warn("Failed to persist master data to localStorage:", e);
    }
  }, []);

  const getCategoryDef = useCallback((categoryKey: string) => {
    return MASTER_CATEGORIES[categoryKey];
  }, []);

  const getOptions = useCallback(
    (categoryKey: string) => {
      const list = store[categoryKey] || MASTER_CATEGORIES[categoryKey]?.defaultOptions || [];
      return list.map((opt) => ({
        id: opt.id,
        label: opt.label,
        value: opt.value,
        description: opt.description,
      }));
    },
    [store]
  );

  const getOptionLabel = useCallback(
    (categoryKey: string, value: string): string => {
      const list = store[categoryKey] || MASTER_CATEGORIES[categoryKey]?.defaultOptions || [];
      const match = list.find((o) => o.value === value || o.label === value);
      return match ? match.label : value;
    },
    [store]
  );

  const addOption = useCallback(
    (categoryKey: string, option: { label: string; value?: string; description?: string }): MasterOption => {
      const cleanLabel = option.label.trim();
      const cleanValue = (option.value && option.value.trim()) || cleanLabel;
      const currentList = store[categoryKey] || MASTER_CATEGORIES[categoryKey]?.defaultOptions || [];

      // Avoid exact duplicates
      const existing = currentList.find(
        (o) => o.value.toLowerCase() === cleanValue.toLowerCase() || o.label.toLowerCase() === cleanLabel.toLowerCase()
      );
      if (existing) {
        return existing;
      }

      const newOption: MasterOption = {
        id: `${categoryKey}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        label: cleanLabel,
        value: cleanValue,
        description: option.description?.trim(),
        isSystem: false,
      };

      const updatedList = [newOption, ...currentList];
      const updatedStore = {
        ...store,
        [categoryKey]: updatedList,
      };

      saveStore(updatedStore);

      // Async write to backend API
      masterDataApi.createOption({
        category: categoryKey.toLowerCase().trim(),
        code: cleanValue.toUpperCase().replace(/\s+/g, "_").trim(),
        label: cleanLabel,
        value: cleanValue,
        description: option.description?.trim(),
        department: "general",
      }).catch((e) => console.warn("Could not sync option to backend:", e));

      return newOption;
    },
    [store, saveStore]
  );

  const updateOption = useCallback(
    (categoryKey: string, id: string, updates: Partial<Omit<MasterOption, "id">>): boolean => {
      const currentList = store[categoryKey] || MASTER_CATEGORIES[categoryKey]?.defaultOptions || [];
      const idx = currentList.findIndex((o) => o.id === id || o.value === id);
      if (idx === -1) return false;

      const updatedList = [...currentList];
      updatedList[idx] = {
        ...updatedList[idx],
        ...updates,
        label: updates.label ? updates.label.trim() : updatedList[idx].label,
        value: updates.value ? updates.value.trim() : updatedList[idx].value,
      };

      saveStore({
        ...store,
        [categoryKey]: updatedList,
      });

      // Async sync update to backend API
      masterDataApi.updateOption(id, {
        label: updates.label,
        value: updates.value,
        description: updates.description,
      }).catch((e) => console.warn("Could not sync update to backend:", e));

      return true;
    },
    [store, saveStore]
  );

  const deleteOption = useCallback(
    (categoryKey: string, id: string): boolean => {
      const currentList = store[categoryKey] || MASTER_CATEGORIES[categoryKey]?.defaultOptions || [];
      const filtered = currentList.filter((o) => o.id !== id && o.value !== id);
      if (filtered.length === currentList.length) return false;

      saveStore({
        ...store,
        [categoryKey]: filtered,
      });

      // Async sync delete to backend API
      masterDataApi.deleteOption(id).catch((e) => console.warn("Could not sync delete to backend:", e));
      return true;
    },
    [store, saveStore]
  );

  const resetCategory = useCallback(
    (categoryKey: string) => {
      const defaults = MASTER_CATEGORIES[categoryKey]?.defaultOptions || [];
      saveStore({
        ...store,
        [categoryKey]: [...defaults],
      });
    },
    [store, saveStore]
  );

  const resetAll = useCallback(() => {
    saveStore(getInitialStore());
  }, [saveStore]);

  const categoriesList = useMemo(() => Object.values(MASTER_CATEGORIES), []);

  const value = useMemo(
    () => ({
      categories: categoriesList,
      getCategoryDef,
      getOptions,
      getOptionLabel,
      addOption,
      updateOption,
      deleteOption,
      resetCategory,
      resetAll,
      isLoaded,
    }),
    [
      categoriesList,
      getCategoryDef,
      getOptions,
      getOptionLabel,
      addOption,
      updateOption,
      deleteOption,
      resetCategory,
      resetAll,
      isLoaded,
    ]
  );

  return <MasterDataContext.Provider value={value}>{children}</MasterDataContext.Provider>;
};

export function useMasterData(): MasterDataContextType {
  const context = useContext(MasterDataContext);
  if (!context) {
    throw new Error("useMasterData must be used within a MasterDataProvider");
  }
  return context;
}

