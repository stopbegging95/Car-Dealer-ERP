import mongoose from "mongoose";
import { User } from "../models/User.js";
import { MasterData } from "../models/MasterData.js";
import { Vehicle } from "../models/Vehicle.js";
import { Order } from "../models/Order.js";
import { Procurement } from "../models/Procurement.js";
import { InspectionQA } from "../models/InspectionQA.js";
import { ServiceWorkshop } from "../models/ServiceWorkshop.js";
import { PartsInventory } from "../models/PartsInventory.js";
import { Financing } from "../models/Financing.js";
import { ReconDetailing } from "../models/ReconDetailing.js";
import { ImportLogistics } from "../models/ImportLogistics.js";
import { TradeInSwap } from "../models/TradeInSwap.js";
import { CRMClient } from "../models/CRMClient.js";
import { HREmployee } from "../models/HREmployee.js";
import { AccountingInvoice } from "../models/AccountingInvoice.js";
import { BranchTransfer } from "../models/BranchTransfer.js";
import { DocumentVault } from "../models/DocumentVault.js";
import { CMSContent } from "../models/CMSContent.js";
import { AuditLog } from "../models/AuditLog.js";

export const seedDatabase = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn("⚠️ Skipping database seed: MongoDB Atlas connection not in connected state. Ensure your IP is whitelisted in Atlas Network Access.");
      return;
    }
    console.log("🌱 Starting Comprehensive CarDeals ERP Database Seeding Process...");

    // =========================================================================
    // 1. SEED ALL 17 STAFF & EXECUTIVE ACCOUNTS
    // =========================================================================
    const existingUsersCount = await User.countDocuments();
    if (existingUsersCount === 0) {
      console.log("Seeding strictly 1 authorized account per dashboard (14 accounts total)...");
      const staffAccounts = [
        // 01. Super Admin HQ Dashboard
        {
          name: "Chief Executive (Admin)",
          email: "admin@luxauto.dealers.com",
          password: "Password123!",
          role: "admin",
          department: "Executive Dealership Management",
          branch: "Victoria Island HQ, Lagos",
          phone: "+234 802 000 0001",
        },
        // 02. VIP Customer Portal Dashboard
        {
          name: "Chief Alexander Vance",
          email: "vance@luxuryinvest.com",
          password: "Password123!",
          role: "customer",
          department: "Private Client VIP Suite",
          branch: "Victoria Island HQ, Lagos",
          phone: "+234 803 111 2233",
        },
        // 03. Showroom Sales & Orders Dashboard
        {
          name: "Senior Sales Liaison",
          email: "sales.liaison@luxauto.dealers.com",
          password: "Password123!",
          role: "sales",
          department: "Showroom Floor Sales & Delivery",
          branch: "Victoria Island HQ, Lagos",
          phone: "+234 802 000 0005",
        },
        // 04. Service & Bay Workshop Dashboard
        {
          name: "Workshop Bay Supervisor",
          email: "workshop.lead@luxauto.dealers.com",
          password: "Password123!",
          role: "service",
          department: "Technical Service & Bay Operations",
          branch: "Victoria Island HQ, Lagos",
          phone: "+234 802 000 0006",
        },
        // 05. OEM Parts Depot Dashboard
        {
          name: "Warehouse Logistics Lead",
          email: "parts.specialist@luxauto.dealers.com",
          password: "Password123!",
          role: "parts",
          department: "OEM Parts & Warehouse Depot",
          branch: "Ikeja Central Logistics Depot",
          phone: "+234 802 000 0007",
        },
        // 06. Automotive Financing Dashboard
        {
          name: "Senior Loan Underwriter",
          email: "financing.officer@luxauto.dealers.com",
          password: "Password123!",
          role: "financing",
          department: "Automotive Financing & Bank Underwriting",
          branch: "Victoria Island HQ, Lagos",
          phone: "+234 802 000 0004",
        },
        // 07. Detailing & Recon Dashboard
        {
          name: "Detailing Center Lead",
          email: "recon.lead@luxauto.dealers.com",
          password: "Password123!",
          role: "recon",
          department: "Vehicle Detailing & Reconditioning",
          branch: "Ikeja Central Logistics Depot",
          phone: "+234 802 000 0008",
        },
        // 08. 150-Point QA Diagnostic Inspection Dashboard
        {
          name: "Lead Quality Inspector",
          email: "qa.lead@luxauto.dealers.com",
          password: "Password123!",
          role: "inspection",
          department: "Vehicle Inspection & Quality Assurance (QA)",
          branch: "Victoria Island HQ, Lagos",
          phone: "+234 802 000 0016",
        },
        // 09. Import Logistics & Port Customs Dashboard
        {
          name: "Port Operations Officer",
          email: "imports.clearing@luxauto.dealers.com",
          password: "Password123!",
          role: "imports",
          department: "Port Clearing & Inbound Maritime Freight",
          branch: "Tin Can Island Port Holding Bay",
          phone: "+234 802 000 0009",
        },
        // 10. Trade-In Appraisals & Vehicle Exchange Dashboard
        {
          name: "Lead Swap Appraiser",
          email: "tradein.valuer@luxauto.dealers.com",
          password: "Password123!",
          role: "trade-ins",
          department: "Trade-In & Vehicle Exchange Desk",
          branch: "Victoria Island HQ, Lagos",
          phone: "+234 802 000 0010",
        },
        // 11. VIP Client Relations & Concierge (CRM) Dashboard
        {
          name: "VIP Concierge Lead",
          email: "crm.concierge@luxauto.dealers.com",
          password: "Password123!",
          role: "crm",
          department: "Client Relationship Management & Concierge",
          branch: "Ikoyi VIP Lounge",
          phone: "+234 802 000 0011",
        },
        // 12. Human Resources & Talent Recruitment Dashboard
        {
          name: "Head of People & Culture",
          email: "hr.director@luxauto.dealers.com",
          password: "Password123!",
          role: "hr",
          department: "Human Resources & Talent Acquisition",
          branch: "Victoria Island HQ, Lagos",
          phone: "+234 802 000 0012",
        },
        // 13. Procurement & International Sourcing Dashboard
        {
          name: "Head of International Sourcing",
          email: "procurement.lead@luxauto.dealers.com",
          password: "Password123!",
          role: "procurement",
          department: "Procurement & International Sourcing",
          branch: "Victoria Island HQ, Lagos",
          phone: "+234 802 000 0013",
        },
        // 14. Accounting, General Ledger & Landed Margins Dashboard
        {
          name: "Dealership Chief Accountant",
          email: "chief.accountant@luxauto.dealers.com",
          password: "Password123!",
          role: "accounting",
          department: "Accounting, Tax & Audit Operations",
          branch: "Victoria Island HQ, Lagos",
          phone: "+234 802 000 0002",
        },
      ];

      for (const account of staffAccounts) {
        await User.create(account);
      }
      console.log(`✅ Exactly ${staffAccounts.length} dashboard accounts seeded (1 per dashboard).`);
    }

    // =========================================================================
    // 2. SEED ALL MASTER DATA TAXONOMY DROPDOWNS (12 CATEGORIES)
    // =========================================================================
    const masterDataCount = await MasterData.countDocuments();
    if (masterDataCount === 0) {
      console.log("Seeding all 12 master data taxonomy dropdown categories...");
      const taxonomies = [
        // Category 1: Showroom Hubs & Allocation Centers (hubs)
        { category: "hubs", code: "HUB_VI", label: "Victoria Island Flagship HQ (Lagos Showroom)", value: "Lagos Showroom", description: "Primary flagship showroom on Victoria Island", department: "operations", orderIndex: 1 },
        { category: "hubs", code: "HUB_ABJ", label: "Maitama Diplomatic Zone Suite (Abuja Showroom)", value: "Abuja Showroom", description: "Executive client suite in Maitama, Abuja", department: "operations", orderIndex: 2 },
        { category: "hubs", code: "HUB_IKY", label: "Ikoyi Private Client VIP Lounge (Lagos)", value: "Ikoyi VIP Lounge", description: "Private appointments and bespoke handovers", department: "operations", orderIndex: 3 },
        { category: "hubs", code: "HUB_LEK", label: "Lekki Phase 1 Performance Center (Lagos)", value: "Lekki Performance Center", description: "Service workshop, dyno tuning, and performance intake", department: "operations", orderIndex: 4 },
        { category: "hubs", code: "HUB_TCIT", label: "Tin Can Island Port Holding Bay (Port Transit)", value: "Port Transit", description: "Customs bonded staging terminal at Tin Can Port", department: "imports", orderIndex: 5 },
        { category: "hubs", code: "HUB_CEN", label: "Central Distribution Warehouse (Central Warehouse)", value: "Central Warehouse", description: "Covered multi-vehicle logistics compound", department: "operations", orderIndex: 6 },

        // Category 2: Vehicle Specification Classes (categories)
        { category: "categories", code: "CAT_EXEC", label: "Executive Class", value: "Executive Class", description: "Chauffeured luxury sedans and flagship models", department: "sales", orderIndex: 1 },
        { category: "categories", code: "CAT_SUV", label: "Premium SUVs", value: "Premium SUVs", description: "Luxury 4x4 SUVs with high clearance and bespoke cabins", department: "sales", orderIndex: 2 },
        { category: "categories", code: "CAT_SPORT", label: "Sport & Performance", value: "Sport & Performance", description: "High-horsepower supercars, coupes, and grand tourers", department: "sales", orderIndex: 3 },
        { category: "categories", code: "CAT_ARM", label: "Armored & Bulletproof", value: "Armored & Bulletproof", description: "B6/B7 ballistic armored security vehicles", department: "sales", orderIndex: 4 },
        { category: "categories", code: "CAT_SALOON", label: "Ultra-Luxury Saloons", value: "Ultra-Luxury Saloons", description: "Handcrafted extended-wheelbase limousines", department: "sales", orderIndex: 5 },
        { category: "categories", code: "CAT_EV", label: "Electric Vehicles (EV)", value: "Electric Vehicles", description: "Zero-emission performance battery electric vehicles", department: "sales", orderIndex: 6 },
        { category: "categories", code: "CAT_BUS", label: "Executive Buses & Vans", value: "Executive Buses", description: "Custom corporate sprinter and mobile boardroom vans", department: "sales", orderIndex: 7 },
        { category: "categories", code: "CAT_BIKE", label: "Power Bikes & Motorcycles", value: "Power Bikes", description: "High-capacity touring and sport motorcycles", department: "sales", orderIndex: 8 },

        // Category 3: Vehicle Manufacturers & Brands (makes)
        { category: "makes", code: "MK_MB", label: "Mercedes-Benz", value: "Mercedes-Benz", department: "sales", orderIndex: 1 },
        { category: "makes", code: "MK_MAYBACH", label: "Mercedes-Maybach", value: "Mercedes-Maybach", department: "sales", orderIndex: 2 },
        { category: "makes", code: "MK_AMG", label: "Mercedes-AMG", value: "Mercedes-AMG", department: "sales", orderIndex: 3 },
        { category: "makes", code: "MK_PORSCHE", label: "Porsche", value: "Porsche", department: "sales", orderIndex: 4 },
        { category: "makes", code: "MK_LR", label: "Land Rover / Range Rover", value: "Land Rover", department: "sales", orderIndex: 5 },
        { category: "makes", code: "MK_RR", label: "Rolls-Royce", value: "Rolls-Royce", department: "sales", orderIndex: 6 },
        { category: "makes", code: "MK_BENTLEY", label: "Bentley", value: "Bentley", department: "sales", orderIndex: 7 },
        { category: "makes", code: "MK_FERRARI", label: "Ferrari", value: "Ferrari", department: "sales", orderIndex: 8 },
        { category: "makes", code: "MK_LAMBO", label: "Lamborghini", value: "Lamborghini", department: "sales", orderIndex: 9 },
        { category: "makes", code: "MK_BMW", label: "BMW", value: "BMW", department: "sales", orderIndex: 10 },
        { category: "makes", code: "MK_AUDI", label: "Audi", value: "Audi", department: "sales", orderIndex: 11 },
        { category: "makes", code: "MK_LEXUS", label: "Lexus", value: "Lexus", department: "sales", orderIndex: 12 },
        { category: "makes", code: "MK_TOYOTA", label: "Toyota", value: "Toyota", department: "sales", orderIndex: 13 },

        // Category 4: Maritime Shipping Ports (ports)
        { category: "ports", code: "PORT_TCIT", label: "Tin Can Island Container Terminal (TCIT), Lagos", value: "Tin Can Island Container Terminal (TCIT), Lagos", description: "Discharge berth in Lagos", department: "imports", orderIndex: 1 },
        { category: "ports", code: "PORT_ANTWERP", label: "Port of Antwerp, Belgium", value: "Antwerp, Belgium", description: "European loading hub", department: "imports", orderIndex: 2 },
        { category: "ports", code: "PORT_HAMBURG", label: "Port of Hamburg, Germany", value: "Hamburg, Germany", description: "German automotive export hub", department: "imports", orderIndex: 3 },
        { category: "ports", code: "PORT_JAX", label: "JAXPORT (Jacksonville, Florida, USA)", value: "JAXPORT, Florida, USA", description: "US East Coast Ro-Ro port", department: "imports", orderIndex: 4 },
        { category: "ports", code: "PORT_JEBEL", label: "Jebel Ali Port (Dubai, UAE)", value: "Jebel Ali, Dubai, UAE", description: "Middle East container terminal", department: "imports", orderIndex: 5 },
        { category: "ports", code: "PORT_YOKO", label: "Port of Yokohama, Japan", value: "Yokohama, Japan", description: "Asia-Pacific automotive shipping", department: "imports", orderIndex: 6 },

        // Category 5: Ocean Shipping Carriers (carriers)
        { category: "carriers", code: "CARRIER_GRIM", label: "Grimaldi Lines (Ro-Ro)", value: "Grande Togo (Grimaldi Lines)", department: "imports", orderIndex: 1 },
        { category: "carriers", code: "CARRIER_MSC", label: "MSC (Mediterranean Shipping Company)", value: "MSC ALTAIR (MSC Lines)", department: "imports", orderIndex: 2 },
        { category: "carriers", code: "CARRIER_MAERSK", label: "Maersk Line (Containerized)", value: "Maersk Bintan (Maersk Line)", department: "imports", orderIndex: 3 },
        { category: "carriers", code: "CARRIER_CMA", label: "CMA CGM (Global Ro-Ro)", value: "CMA CGM Palais (CMA CGM)", department: "imports", orderIndex: 4 },
        { category: "carriers", code: "CARRIER_ONE", label: "Ocean Network Express (ONE)", value: "ONE Continuity (ONE Lines)", department: "imports", orderIndex: 5 },

        // Category 6: Suppliers & Auction Houses (suppliers)
        { category: "suppliers", code: "SUP_MANHEIM", label: "Manheim International Auto Auctions (USA)", value: "Manheim International Auto Auctions", department: "procurement", orderIndex: 1 },
        { category: "suppliers", code: "SUP_BCA", label: "BCA European Vehicle Auctions (Germany / UK)", value: "BCA European Vehicle Auctions", department: "procurement", orderIndex: 2 },
        { category: "suppliers", code: "SUP_STUTTGART", label: "Stuttgart Prime Dealer Group (Germany)", value: "Stuttgart Prime Dealer Group", department: "procurement", orderIndex: 3 },
        { category: "suppliers", code: "SUP_COPART", label: "Copart Certified Export Services (USA)", value: "Copart Certified Export Services", department: "procurement", orderIndex: 4 },
        { category: "suppliers", code: "SUP_EMIRATES", label: "Emirates Auction Group (Dubai)", value: "Emirates Auction Group", department: "procurement", orderIndex: 5 },
        { category: "suppliers", code: "SUP_ANTWERP", label: "Prestige Auto Brokers Antwerp (Belgium)", value: "Prestige Auto Brokers Antwerp", department: "procurement", orderIndex: 6 },

        // Category 7: Corporate Banks & Financing Partners (banks)
        { category: "banks", code: "BANK_ZENITH", label: "Zenith Bank Plc (Lagos Corporate HQ)", value: "Zenith Bank Plc", department: "financing", orderIndex: 1 },
        { category: "banks", code: "BANK_GTB", label: "Guaranty Trust Bank (GTBank) Plc", value: "Guaranty Trust Bank (GTBank) Plc", department: "financing", orderIndex: 2 },
        { category: "banks", code: "BANK_FBN", label: "First Bank of Nigeria (Customs SGD Escrow)", value: "First Bank of Nigeria", department: "financing", orderIndex: 3 },
        { category: "banks", code: "BANK_STANBIC", label: "Stanbic IBTC Bank (Asset Finance Facility)", value: "Stanbic IBTC Bank", department: "financing", orderIndex: 4 },
        { category: "banks", code: "BANK_ACCESS", label: "Access Bank Plc (Commercial Accounts)", value: "Access Bank Plc", department: "financing", orderIndex: 5 },

        // Category 8: Payment Channels & Remittance (payment_channels)
        { category: "payment_channels", code: "PAY_WIRE", label: "Direct Bank Wire Transfer (NIP / RTGS)", value: "Direct Bank Wire Transfer (NIP / RTGS)", department: "accounting", orderIndex: 1 },
        { category: "payment_channels", code: "PAY_ESCROW", label: "Corporate Treasury Escrow Account", value: "Corporate Treasury Escrow Account", department: "accounting", orderIndex: 2 },
        { category: "payment_channels", code: "PAY_NCS", label: "NCS Direct Remittance (Nigeria Customs Port Duty)", value: "NCS Direct Remittance", department: "accounting", orderIndex: 3 },
        { category: "payment_channels", code: "PAY_ASSET_FIN", label: "Commercial Bank Asset Finance Facility", value: "Bank Asset Finance Facility", department: "accounting", orderIndex: 4 },
        { category: "payment_channels", code: "PAY_DRAFT", label: "Certified Corporate Bank Draft", value: "Certified Corporate Bank Draft", department: "accounting", orderIndex: 5 },

        // Category 9: Diagnostic Inspection Centers & Bays (inspection_centers)
        { category: "inspection_centers", code: "IC_VI", label: "Victoria Island Flagship Showroom, Lagos", value: "Victoria Island Flagship Showroom, Lagos", department: "inspection", orderIndex: 1 },
        { category: "inspection_centers", code: "IC_IKY", label: "Ikoyi Private Client VIP Lounge, Lagos", value: "Ikoyi Private Client VIP Lounge, Lagos", department: "inspection", orderIndex: 2 },
        { category: "inspection_centers", code: "IC_ABJ", label: "Maitama Diplomatic Zone Suite, Abuja", value: "Maitama Diplomatic Zone Suite, Abuja", department: "inspection", orderIndex: 3 },
        { category: "inspection_centers", code: "IC_LEK", label: "Lekki Phase 1 Performance Center, Lagos", value: "Lekki Phase 1 Performance Center, Lagos", department: "inspection", orderIndex: 4 },
        { category: "inspection_centers", code: "IC_PORT", label: "Tin Can Port Intake Inspection Bay, Lagos", value: "Tin Can Port Intake Inspection Bay, Lagos", department: "inspection", orderIndex: 5 },

        // Category 10: International Sourcing Markets (sourcing_markets)
        { category: "sourcing_markets", code: "SM_GER", label: "Germany (Stuttgart / Munich / Frankfurt)", value: "Germany (Stuttgart / Munich)", department: "procurement", orderIndex: 1 },
        { category: "sourcing_markets", code: "SM_USA", label: "United States (California / Florida / Texas)", value: "United States (California / Florida)", department: "procurement", orderIndex: 2 },
        { category: "sourcing_markets", code: "SM_UAE", label: "United Arab Emirates (Dubai / Abu Dhabi)", value: "United Arab Emirates (Dubai)", department: "procurement", orderIndex: 3 },
        { category: "sourcing_markets", code: "SM_UK", label: "United Kingdom (London / Birmingham)", value: "United Kingdom (London)", department: "procurement", orderIndex: 4 },
        { category: "sourcing_markets", code: "SM_JPN", label: "Japan (Tokyo / Yokohama / Nagoya)", value: "Japan (Yokohama / Tokyo)", department: "procurement", orderIndex: 5 },
        { category: "sourcing_markets", code: "SM_BENELUX", label: "Belgium & Netherlands (Antwerp / Rotterdam)", value: "Belgium & Netherlands (Antwerp)", department: "procurement", orderIndex: 6 },

        // Category 11: CRM Dispute & Complaint Categories (dispute_categories)
        { category: "dispute_categories", code: "DISP_TIMELINE", label: "Vehicle Delivery & Logistics Timeline", value: "Delivery Timeline", department: "crm", orderIndex: 1 },
        { category: "dispute_categories", code: "DISP_DOCS", label: "Customs SGD Documentation & Title Transfer", value: "Documentation & Title", department: "crm", orderIndex: 2 },
        { category: "dispute_categories", code: "DISP_PAINT", label: "Paint, Exterior Ceramic or Trim Finish", value: "Paint & Exterior", department: "crm", orderIndex: 3 },
        { category: "dispute_categories", code: "DISP_MECH", label: "Mechanical, OBD Diagnostic or Sensor Calibration", value: "Mechanical & Diagnostic", department: "crm", orderIndex: 4 },
        { category: "dispute_categories", code: "DISP_PAY", label: "Payment Allocation, Invoice or Receipt Issuance", value: "Payment & Invoices", department: "crm", orderIndex: 5 },
        { category: "dispute_categories", code: "DISP_ACC", label: "Accessories, Wheels or Custom Pack Installation", value: "Accessories & Specs", department: "crm", orderIndex: 6 },
      ];

      await MasterData.insertMany(taxonomies);
      console.log(`✅ ${taxonomies.length} Master Data taxonomies seeded into database.`);
    }

    // =========================================================================
    // 3. SEED VEHICLE INVENTORY (ALL 8+ CORE FLEET VEHICLES)
    // =========================================================================
    const vehicleCount = await Vehicle.countDocuments();
    if (vehicleCount === 0) {
      console.log("Seeding core luxury vehicle inventory fleet into database...");
      const vehiclesList = [
        {
          stockId: "STK-2026-001",
          vin: "WDD2230631A987654",
          category: "Executive Class",
          bodyType: "Sedan",
          make: "Mercedes-Benz",
          modelName: "S-Class S580",
          trim: "4MATIC Maybach Executive",
          year: 2024,
          mileageKm: 4200,
          condition: "Brand New",
          transmission: "Automatic",
          fuelType: "Petrol",
          exteriorColor: "Obsidian Black",
          interiorColor: "Exclusive Nappa Gold",
          acquisitionCostNGN: 177000000,
          customsDutyNGN: 20250000,
          clearingCostNGN: 5250000,
          reconCostNGN: 1500000,
          listingPriceNGN: 247500000,
          minAcceptablePriceNGN: 240000000,
          status: "Showroom Ready",
          currentHub: "Lagos Showroom",
          bayNumber: "Showroom Bay 01",
          branchLocation: "Victoria Island Flagship Showroom",
          images: [
            "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80",
          ],
          thumbnail: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
          qaStatus: "Passed",
          inspectionScore: 99,
          titleStatus: "Original Customs SGD",
          customsDeclarationNumber: "CUS-2024-TCIT-98765",
          features: ["Burmester 4D Sound", "Rear Executive Recline", "Massage Seats", "Heads-Up Display", "Active Ambient Lighting"],
          specifications: { horsepower: 496, engine: "4.0L V8 Biturbo with EQ Boost" },
          notes: "The pinnacle of executive luxury motoring. Featuring first-class rear cabin seating and state-of-the-art chauffeur comfort systems.",
        },
        {
          stockId: "STK-2026-002",
          vin: "WP0AB2A93NS123456",
          category: "Sport & Performance",
          bodyType: "Coupe",
          make: "Porsche",
          modelName: "911 Turbo S",
          trim: "Coupe Lightweight Package",
          year: 2023,
          mileageKm: 8500,
          condition: "Foreign Used (Tokunbo)",
          transmission: "Dual-Clutch",
          fuelType: "Petrol",
          exteriorColor: "Jet Black Metallic",
          interiorColor: "Black with Gold Stitching",
          acquisitionCostNGN: 277500000,
          customsDutyNGN: 31500000,
          clearingCostNGN: 6000000,
          reconCostNGN: 2000000,
          listingPriceNGN: 367500000,
          minAcceptablePriceNGN: 355000000,
          status: "Showroom Ready",
          currentHub: "Abuja Showroom",
          bayNumber: "Showroom Bay 02",
          branchLocation: "Maitama Diplomatic Zone Suite",
          images: [
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80",
          ],
          thumbnail: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
          qaStatus: "Passed",
          inspectionScore: 98,
          titleStatus: "Original Customs SGD",
          customsDeclarationNumber: "CUS-2023-TCIT-12345",
          features: ["Carbon Ceramic Brakes (PCCB)", "Sport Chrono Package", "PASM Sport Suspension", "Front Axle Lift"],
          specifications: { horsepower: 640, engine: "3.7L Twin-Turbo Flat-6" },
          notes: "Iconic supercar performance meeting daily drivability. 0-100 km/h in 2.6 seconds.",
        },
        {
          stockId: "STK-2026-003",
          vin: "SALWR2V44PA998877",
          category: "Premium SUVs",
          bodyType: "SUV",
          make: "Land Rover",
          modelName: "Range Rover Autobiography",
          trim: "Long Wheelbase P530",
          year: 2024,
          mileageKm: 1800,
          condition: "Brand New",
          transmission: "Automatic",
          fuelType: "Petrol",
          exteriorColor: "Santorini Black",
          interiorColor: "Perlino Semi-Aniline Leather",
          acquisitionCostNGN: 255000000,
          customsDutyNGN: 29700000,
          clearingCostNGN: 7300000,
          reconCostNGN: 1500000,
          listingPriceNGN: 352500000,
          minAcceptablePriceNGN: 340000000,
          status: "Showroom Ready",
          currentHub: "Lagos Showroom",
          bayNumber: "Showroom Bay 03",
          branchLocation: "Victoria Island Flagship Showroom",
          images: [
            "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
          ],
          thumbnail: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80",
          qaStatus: "Passed",
          inspectionScore: 99,
          titleStatus: "Original Customs SGD",
          customsDeclarationNumber: "CUS-2024-TCIT-99887",
          features: ["All-Wheel Steering", "Executive Class Comfort Plus", "Electronic Air Suspension", "Meridian Signature Sound"],
          specifications: { horsepower: 523, engine: "4.4L Twin-Turbo V8" },
          notes: "Peerless refinement and supreme capability. Tailored for VIP transport and long-distance luxury touring.",
        },
        {
          stockId: "STK-2026-004",
          vin: "5YJSA1E28PF456789",
          category: "Electric Vehicles",
          bodyType: "Sedan",
          make: "Tesla",
          modelName: "Model S Plaid",
          trim: "Tri-Motor AWD",
          year: 2023,
          mileageKm: 11000,
          condition: "Foreign Used (Tokunbo)",
          transmission: "Direct-Drive EV",
          fuelType: "Electric",
          exteriorColor: "Solid Black",
          interiorColor: "Cream Carbon Trim",
          acquisitionCostNGN: 123000000,
          customsDutyNGN: 14400000,
          clearingCostNGN: 4600000,
          reconCostNGN: 1000000,
          listingPriceNGN: 172500000,
          minAcceptablePriceNGN: 165000000,
          status: "Showroom Ready",
          currentHub: "Abuja Showroom",
          bayNumber: "Showroom Bay 04",
          branchLocation: "Maitama Diplomatic Zone Suite",
          images: [
            "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80",
          ],
          thumbnail: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80",
          qaStatus: "Passed",
          inspectionScore: 97,
          titleStatus: "Original Customs SGD",
          customsDeclarationNumber: "CUS-2023-TCIT-45678",
          features: ["Full Self-Driving Capability", "Yoke Steering", "Tri-Zone Climate Control", "Gaming Computer Built-in"],
          specifications: { horsepower: 1020, engine: "Tri-Motor Electric Drive" },
          notes: "The fastest accelerating production sedan on earth with 600km real-world electric range.",
        },
        {
          stockId: "STK-2026-006",
          vin: "WDB9076531R445566",
          category: "Executive Buses",
          bodyType: "Van",
          make: "Mercedes-Benz",
          modelName: "Sprinter VIP Lounge",
          trim: "Executive Edition 9-Seater",
          year: 2024,
          mileageKm: 2500,
          condition: "Brand New",
          transmission: "Automatic",
          fuelType: "Diesel",
          exteriorColor: "Deep Obsidian Black",
          interiorColor: "Diamond Stitched Cream Nappa",
          acquisitionCostNGN: 217500000,
          customsDutyNGN: 25800000,
          clearingCostNGN: 7200000,
          reconCostNGN: 2000000,
          listingPriceNGN: 322500000,
          minAcceptablePriceNGN: 310000000,
          status: "Showroom Ready",
          currentHub: "Lagos Showroom",
          bayNumber: "Showroom Bay 05",
          branchLocation: "Victoria Island Flagship Showroom",
          images: [
            "https://images.unsplash.com/photo-1541348263662-e0c86437da1b?auto=format&fit=crop&w=1200&q=80",
          ],
          thumbnail: "https://images.unsplash.com/photo-1541348263662-e0c86437da1b?auto=format&fit=crop&w=1200&q=80",
          qaStatus: "Passed",
          inspectionScore: 98,
          titleStatus: "Original Customs SGD",
          customsDeclarationNumber: "CUS-2024-TCIT-44556",
          features: ["43-inch 4K Smart TV Partition", "Starlight Roof Ceiling", "Private Bar & Nespresso Station", "Intercom System", "Apple TV & High-Speed WiFi"],
          specifications: { horsepower: 211, engine: "2.0L 4-Cylinder Turbo Diesel OM654" },
          notes: "The ultimate private jet on wheels. Purpose-built for corporate executives, royalty, and high-profile delegations.",
        },
        {
          stockId: "STK-2026-007",
          vin: "WBA73AY09PC776655",
          category: "Executive Class",
          bodyType: "Sedan",
          make: "BMW",
          modelName: "7 Series 760i",
          trim: "xDrive M Sport",
          year: 2023,
          mileageKm: 14000,
          condition: "Foreign Used (Tokunbo)",
          transmission: "Automatic",
          fuelType: "Petrol",
          exteriorColor: "Black Sapphire",
          interiorColor: "Amarone Merino Leather",
          acquisitionCostNGN: 142500000,
          customsDutyNGN: 16800000,
          clearingCostNGN: 4700000,
          reconCostNGN: 1200000,
          listingPriceNGN: 207000000,
          minAcceptablePriceNGN: 200000000,
          status: "Reserved",
          currentHub: "Lagos Showroom",
          bayNumber: "Showroom Bay 06",
          branchLocation: "Victoria Island Flagship Showroom",
          images: [
            "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
          ],
          thumbnail: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
          qaStatus: "Passed",
          inspectionScore: 96,
          titleStatus: "Original Customs SGD",
          customsDeclarationNumber: "CUS-2023-TCIT-77665",
          features: ["31.3-inch 8K Theater Screen", "Bowers & Wilkins Diamond Surround", "BMW Crystal Headlights", "Automatic Doors"],
          specifications: { horsepower: 536, engine: "4.4L BMW M TwinPower Turbo V8" },
          notes: "Futuristic luxury with cinematic rear entertainment and expressive executive styling.",
        },
        {
          stockId: "STK-2026-008",
          vin: "ZFF90NFA8P0288991",
          category: "Sport & Performance",
          bodyType: "Coupe",
          make: "Ferrari",
          modelName: "296 GTB",
          trim: "Assetto Fiorano Package",
          year: 2023,
          mileageKm: 3900,
          condition: "Foreign Used (Tokunbo)",
          transmission: "Dual-Clutch",
          fuelType: "Hybrid",
          exteriorColor: "Nero Daytona",
          interiorColor: "Nero Alcantara",
          acquisitionCostNGN: 397500000,
          customsDutyNGN: 45750000,
          clearingCostNGN: 8250000,
          reconCostNGN: 3500000,
          listingPriceNGN: 540000000,
          minAcceptablePriceNGN: 520000000,
          status: "In-Transit",
          currentHub: "Port Transit",
          bayNumber: "Customs Holding Yard",
          branchLocation: "Tin Can Island Port Holding Bay",
          images: [
            "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80",
          ],
          thumbnail: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80",
          qaStatus: "Pending",
          inspectionScore: 95,
          titleStatus: "Pending Clearance",
          customsDeclarationNumber: "SGD-TRANSIT-28899",
          features: ["Multimatic Shock Absorbers", "Carbon Fiber Wheels", "Michelin Pilot Sport Cup 2 R Tires", "Titanium Exhaust"],
          specifications: { horsepower: 819, engine: "3.0L Twin-Turbo 120° V6 Hybrid" },
          notes: "Maranello's hybrid masterpiece combining intoxicating sound with razor-sharp track performance.",
        },
      ];

      for (const veh of vehiclesList) {
        await Vehicle.create(veh);
      }
      console.log(`✅ ${vehiclesList.length} Core fleet vehicles seeded into database.`);
    }

    // =========================================================================
    // 4. SEED SALES ORDERS
    // =========================================================================
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      console.log("Seeding verified sales orders into database...");
      const sampleVehicle = await Vehicle.findOne({ make: "Mercedes-Benz" });
      if (sampleVehicle) {
        const initialOrders = [
          {
            orderNumber: "ORD-2026-9912",
            customerName: "Alhaji Bello & Sons Ltd",
            customerEmail: "bello.holdings@nigeria.com",
            customerPhone: "+234 803 555 1234",
            customerAddress: "Plot 14 Victoria Island, Lagos",
            vehicleId: sampleVehicle._id,
            vehicleSummary: {
              vin: sampleVehicle.vin,
              stockId: sampleVehicle.stockId,
              make: sampleVehicle.make,
              modelName: sampleVehicle.modelName,
              year: sampleVehicle.year,
              listingPriceNGN: sampleVehicle.listingPriceNGN,
            },
            salesRepName: "Senior Sales Liaison",
            vehiclePriceNGN: sampleVehicle.listingPriceNGN,
            totalAmountNGN: sampleVehicle.listingPriceNGN,
            depositAmountNGN: 155000000,
            balanceDueNGN: Math.max(0, sampleVehicle.listingPriceNGN - 155000000),
            paymentStatus: "Partially Paid",
            paymentMethod: "Bank Wire / NIBSS",
            stage: "Ready for Handover",
            deliveryDetails: {
              hubLocation: "Victoria Island Flagship Showroom",
              scheduledDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
              handoverNotes: "Customer requested private showroom handover with champagne reception.",
            },
            notes: "FIRS VAT receipt issued. PDI completed with 99% score.",
          },
          {
            orderNumber: "ORD-2026-9910",
            customerName: "Dr. K. Somoye",
            customerEmail: "client@somoye.ng",
            customerPhone: "+234 802 888 9900",
            customerAddress: "Ikoyi Crescent, Lagos",
            vehicleId: sampleVehicle._id,
            vehicleSummary: {
              vin: "WP0AB2A93NS123456",
              stockId: "STK-2026-002",
              make: "Porsche",
              modelName: "911 Turbo S",
              year: 2023,
              listingPriceNGN: 367500000,
            },
            salesRepName: "Senior Sales Liaison",
            vehiclePriceNGN: 367500000,
            totalAmountNGN: 367500000,
            depositAmountNGN: 200000000,
            balanceDueNGN: 167500000,
            paymentStatus: "Partially Paid",
            paymentMethod: "Automotive Financing",
            stage: "Financing Approved",
            deliveryDetails: {
              hubLocation: "Abuja Showroom",
              scheduledDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            },
            notes: "Zenith Bank asset finance approved. Final inspection scheduled.",
          },
        ];

        for (const ord of initialOrders) {
          await Order.create(ord);
        }
        console.log(`✅ ${initialOrders.length} Sales orders seeded into database.`);
      }
    }

    // =========================================================================
    // 5. SEED PARTS DEPOT INVENTORY
    // =========================================================================
    const partsCount = await PartsInventory.countDocuments();
    if (partsCount === 0) {
      console.log("Seeding OEM parts depot inventory into database...");
      const partsItems = [
        {
          sku: "PRT-MB-9912",
          partName: "Maybach 22-Inch Forged Monoblock Wheel (Set)",
          category: "Body Panels",
          brand: "Mercedes-Maybach OEM",
          compatibleModels: ["Mercedes-Maybach S580", "Mercedes-Maybach GLS600"],
          quantityInStock: 3,
          minThresholdAlert: 1,
          costPriceNGN: 17500000,
          sellingPriceNGN: 22475000,
          aisleShelfLocation: "Aisle A-Wheel-01",
          supplier: "Stuttgart Prime Dealer Group",
          status: "In Stock",
        },
        {
          sku: "PRT-PO-8810",
          partName: "PCCB Carbon Ceramic Brake Rotor Kit",
          category: "Braking",
          brand: "Porsche Motorsport Genuine",
          compatibleModels: ["Porsche 911 Turbo S", "Porsche GT3 RS"],
          quantityInStock: 2,
          minThresholdAlert: 2,
          costPriceNGN: 26500000,
          sellingPriceNGN: 34100000,
          aisleShelfLocation: "Aisle B-Brake-04",
          supplier: "Porsche AG Parts Central",
          status: "Low Stock",
        },
        {
          sku: "PRT-RR-4401",
          partName: "Autobiography Deployable Side Steps",
          category: "Body Panels",
          brand: "Land Rover Genuine",
          compatibleModels: ["Range Rover Autobiography", "Range Rover SV"],
          quantityInStock: 5,
          minThresholdAlert: 2,
          costPriceNGN: 7200000,
          sellingPriceNGN: 9610000,
          aisleShelfLocation: "Aisle C-Exterior-02",
          supplier: "BCA European Wholesale",
          status: "In Stock",
        },
        {
          sku: "PRT-MB-3309",
          partName: "G63 AMG Night Package II Radiator Grille",
          category: "Body Panels",
          brand: "Mercedes-AMG",
          compatibleModels: ["Mercedes-AMG G63"],
          quantityInStock: 1,
          minThresholdAlert: 2,
          costPriceNGN: 4200000,
          sellingPriceNGN: 5890000,
          aisleShelfLocation: "Aisle A-Grille-03",
          supplier: "Stuttgart Prime Dealer Group",
          status: "Low Stock",
        },
      ];

      for (const p of partsItems) {
        await PartsInventory.create(p);
      }
      console.log(`✅ ${partsItems.length} OEM parts SKUs seeded into database.`);
    }

    // =========================================================================
    // 6. SEED SERVICE WORKSHOP JOB CARDS
    // =========================================================================
    const serviceCount = await ServiceWorkshop.countDocuments();
    if (serviceCount === 0) {
      console.log("Seeding workshop job cards into database...");
      const sampleVehicle = await Vehicle.findOne();
      if (sampleVehicle) {
        const jobCards = [
          {
            jobCardNumber: "JOB-2026-001",
            vehicleId: sampleVehicle._id,
            vin: sampleVehicle.vin,
            customerName: "Alhaji Bello & Sons Ltd",
            customerPhone: "+234 803 555 1234",
            assignedMechanicName: "Engr. Tunde B.",
            bayNumber: "Bay 1 (Master Dyno)",
            serviceCategory: "Periodic Maintenance",
            symptomsReported: ["150-Point Pre-Delivery Inspection", "ECU Firmware Update"],
            diagnosticFindings: "Engine compression and brake hydraulics within 100% factory specifications.",
            status: "In Repair",
            laborHours: 4,
            laborRatePerHourNGN: 25000,
            estimatedCompletionDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
          },
          {
            jobCardNumber: "JOB-2026-002",
            vehicleId: sampleVehicle._id,
            vin: "SALWR2V44PA998877",
            customerName: "Chief Vance",
            customerPhone: "+234 802 999 1122",
            assignedMechanicName: "Chinedu M.",
            bayNumber: "Bay 2 (Heavy Lift)",
            serviceCategory: "Braking System",
            symptomsReported: ["Air Suspension Calibration", "Brake Bleed"],
            diagnosticFindings: "Compressor valve seal recalibrated. Suspension height verified.",
            status: "Queued",
            laborHours: 6,
            laborRatePerHourNGN: 25000,
          },
        ];

        for (const job of jobCards) {
          await ServiceWorkshop.create(job);
        }
        console.log(`✅ ${jobCards.length} Workshop job cards seeded into database.`);
      }
    }

    // =========================================================================
    // 7. SEED HOMEPAGE CMS HERO SLIDES & PARTNERS (ALL 5 ARCHETYPES)
    // =========================================================================
    const cmsCount = await CMSContent.countDocuments();
    if (cmsCount === 0) {
      console.log("Seeding CMS homepage hero slides (all 5 archetypes) and brand partners...");
      const cmsItems = [
        {
          contentType: "Hero Slide",
          title: "Mercedes Premier Luxury Fleet",
          subtitle: "Explore our prestigious collection of luxury and executive vehicles. Hand-selected, fully certified, and delivered with VIP concierge excellence.",
          badgeText: "PREMIUM LUXURY CAR DEALERSHIP",
          ctaText: "View Inventory",
          ctaLink: "/inventory",
          secondaryCtaText: "Book a Test Drive",
          secondaryCtaLink: "/contact",
          imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1920&q=80",
          orderIndex: 1,
          isActive: true,
          metadata: {
            archetype: "text-image",
            headline: "DRIVE YOUR",
            highlightText: "DREAM CAR",
          },
        },
        {
          contentType: "Hero Slide",
          title: "The Pinnacle of Automotive Prestige",
          subtitle: "Premier Auto Motors redefines luxury vehicle ownership with verified provenance, bespoke international sourcing, zero-demurrage terminal logistics, and private showroom viewings across Lagos and Abuja.",
          badgeText: "THE PINNACLE OF AUTOMOTIVE PRESTIGE",
          ctaText: "Explore Auto Broker Desk",
          ctaLink: "/services/auto-brokers",
          secondaryCtaText: "About Dealership",
          secondaryCtaLink: "/about",
          imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80",
          orderIndex: 2,
          isActive: true,
          metadata: {
            archetype: "text-only",
            headline: "CRAFTED FOR THE EXCEPTIONAL.",
            highlightText: "UNCOMPROMISED LUXURY & POWER.",
          },
        },
        {
          contentType: "Hero Slide",
          title: "Exotic Supercar Collection",
          subtitle: "",
          badgeText: "EXOTIC MOTORSPORT",
          ctaText: "Explore Collection",
          ctaLink: "/inventory?category=sport-performance",
          imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80",
          orderIndex: 3,
          isActive: true,
          metadata: {
            archetype: "image-only",
            headline: "PURE EXOTIC PERFORMANCE",
            highlightText: "",
          },
        },
        // Brand Partners
        {
          contentType: "Brand Partner",
          title: "Mercedes-Benz",
          subtitle: "Official Luxury Partner",
          imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=400&q=80",
          orderIndex: 1,
          isActive: true,
          metadata: { make: "Mercedes-Benz" },
        },
        {
          contentType: "Brand Partner",
          title: "Porsche",
          subtitle: "Motorsport Specialist",
          imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80",
          orderIndex: 2,
          isActive: true,
          metadata: { make: "Porsche" },
        },
        {
          contentType: "Brand Partner",
          title: "Land Rover",
          subtitle: "All-Terrain Luxury",
          imageUrl: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=400&q=80",
          orderIndex: 3,
          isActive: true,
          metadata: { make: "Land Rover" },
        },
        // Announcement Ticker
        {
          contentType: "Announcement Ticker",
          title: "Tin Can Island Port Clearance Update",
          subtitle: "Three hand-crafted 2024 Mercedes-Maybach S580 sedans cleared through TCIT terminal with zero demurrage. Private viewings open at Victoria Island HQ.",
          badgeText: "Port Dispatch Active",
          ctaLink: "/inventory",
          imageUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80",
          orderIndex: 1,
          isActive: true,
        },
      ];

      for (const item of cmsItems) {
        await CMSContent.create(item);
      }
      console.log(`✅ ${cmsItems.length} CMS Homepage items seeded into database.`);
    }

    console.log("🌟 Comprehensive Database Seeding Finished Successfully!");
  } catch (error) {
    console.error("❌ Seeding failed with error:", error);
  }
};

if (process.argv[1] && process.argv[1].endsWith("seedData.ts")) {
  seedDatabase().then(() => {
    process.exit(0);
  });
}
