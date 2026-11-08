export type VehicleCategory =
  | "Executive Class"
  | "Sport & Performance"
  | "Premium SUVs"
  | "Electric Vehicles"
  | "Hybrid Vehicles"
  | "Luxury Sedans"
  | "Commercial Vehicles"
  | "Trucks & Heavy Vehicles"
  | "Classic & Vintage Cars"
  | "Economy Vehicles"
  | "Exotic & Supercars"
  | "Buses & Minivans"
  | "Power Bikes"
  | "Executive Buses";

export type VehicleStatus =
  | "Draft"
  | "Awaiting Approval"
  | "Purchased"
  | "In Transit"
  | "Customs Clearance"
  | "Awaiting Inspection"
  | "Under Repair"
  | "Available"
  | "Reserved"
  | "Sold"
  | "Delivered"
  | "Returned"
  | "Written Off"
  | "Inspection"
  | "Clearance";

export interface Vehicle {
  stockId: string;
  vin: string;
  category: VehicleCategory;
  make: string;
  model: string;
  trim: string;
  year: number;
  mileage: number; // in KM
  condition: "Brand-new" | "Foreign-used" | "Locally-used";
  transmission: "Automatic" | "Manual" | "Dual-Clutch" | "Direct-Drive";
  fuel: "Petrol" | "Diesel" | "Electric" | "Hybrid";
  exteriorColor: string;
  interiorColor: string;
  purchaseCost: number; // USD
  landedCost: number; // USD
  priceUSD: number;
  priceNGN: number;
  status: VehicleStatus;
  location: "Lagos Showroom" | "Abuja Showroom" | "Port Transit" | "Central Warehouse" | (string & {});
  image: string;
  gallery: string[];
  features: string[];
  horsepower: number;
  engine: string;
  description: string;
  featured?: boolean;
  daysInStock?: number;
  inspectionApproved?: boolean;
  conditionRating?: "Grade A (Pristine)" | "Grade B (Minor Wear)" | "Grade C (Recon Req)" | "Grade D (Major Repair)";
  assignedInspector?: string;
  videoUrl?: string;
}

export const VEHICLES: Vehicle[] = [
  {
    stockId: "STK-2026-001",
    vin: "WDD2230631A987654",
    category: "Executive Class",
    make: "Mercedes-Benz",
    model: "S-Class S580",
    trim: "4MATIC Maybach Executive",
    year: 2024,
    mileage: 4200,
    condition: "Brand-new",
    transmission: "Automatic",
    fuel: "Petrol",
    exteriorColor: "Obsidian Black",
    interiorColor: "Exclusive Nappa Gold",
    purchaseCost: 118000,
    landedCost: 135000,
    priceUSD: 165000,
    priceNGN: 247500000,
    status: "Available",
    location: "Lagos Showroom",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80"
    ],
    features: ["Burmester 4D Sound", "Rear Executive Recline", "Massage Seats", "Heads-Up Display", "Active Ambient Lighting"],
    horsepower: 496,
    engine: "4.0L V8 Biturbo with EQ Boost",
    description: "The pinnacle of executive luxury motoring. Featuring first-class rear cabin seating and state-of-the-art chauffeur comfort systems.",
    featured: true,
  },
  {
    stockId: "STK-2026-002",
    vin: "WP0AB2A93NS123456",
    category: "Sport & Performance",
    make: "Porsche",
    model: "911 Turbo S",
    trim: "Coupe Lightweight Package",
    year: 2023,
    mileage: 8500,
    condition: "Foreign-used",
    transmission: "Dual-Clutch",
    fuel: "Petrol",
    exteriorColor: "Jet Black Metallic",
    interiorColor: "Black with Gold Stitching",
    purchaseCost: 185000,
    landedCost: 210000,
    priceUSD: 245000,
    priceNGN: 367500000,
    status: "Available",
    location: "Abuja Showroom",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80"
    ],
    features: ["Carbon Ceramic Brakes (PCCB)", "Sport Chrono Package", "PASM Sport Suspension", "Front Axle Lift"],
    horsepower: 640,
    engine: "3.7L Twin-Turbo Flat-6",
    description: "Iconic supercar performance meeting daily drivability. 0-100 km/h in 2.6 seconds.",
    featured: true,
  },
  {
    stockId: "STK-2026-003",
    vin: "SALWR2V44PA998877",
    category: "Premium SUVs",
    make: "Land Rover",
    model: "Range Rover Autobiography",
    trim: "Long Wheelbase P530",
    year: 2024,
    mileage: 1800,
    condition: "Brand-new",
    transmission: "Automatic",
    fuel: "Petrol",
    exteriorColor: "Santorini Black",
    interiorColor: "Perlino Semi-Aniline Leather",
    purchaseCost: 170000,
    landedCost: 198000,
    priceUSD: 235000,
    priceNGN: 352500000,
    status: "Available",
    location: "Lagos Showroom",
    image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80"
    ],
    features: ["All-Wheel Steering", "Executive Class Comfort Plus", "Electronic Air Suspension", "Meridian Signature Sound"],
    horsepower: 523,
    engine: "4.4L Twin-Turbo V8",
    description: "Peerless refinement and supreme capability. Tailored for VIP transport and long-distance luxury touring.",
    featured: true,
  },
  {
    stockId: "STK-2026-004",
    vin: "5YJSA1E28PF456789",
    category: "Electric Vehicles",
    make: "Tesla",
    model: "Model S Plaid",
    trim: "Tri-Motor AWD",
    year: 2023,
    mileage: 11000,
    condition: "Foreign-used",
    transmission: "Direct-Drive",
    fuel: "Electric",
    exteriorColor: "Solid Black",
    interiorColor: "Cream Carbon Trim",
    purchaseCost: 82000,
    landedCost: 96000,
    priceUSD: 115000,
    priceNGN: 172500000,
    status: "Available",
    location: "Abuja Showroom",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80",
    gallery: ["https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80"],
    features: ["Full Self-Driving Capability", "Yoke Steering", "Tri-Zone Climate Control", "Gaming Computer Built-in"],
    horsepower: 1020,
    engine: "Tri-Motor Electric Drive",
    description: "The fastest accelerating production sedan on earth with 600km real-world electric range.",
    featured: true,
  },
  {
    stockId: "STK-2026-005",
    vin: "ZD42E00A4NS112233",
    category: "Power Bikes",
    make: "Ducati",
    model: "Panigale V4 S",
    trim: "Corse Superbike Edition",
    year: 2024,
    mileage: 800,
    condition: "Brand-new",
    transmission: "Manual",
    fuel: "Petrol",
    exteriorColor: "Dark Stealth",
    interiorColor: "Alcantara Race Saddle",
    purchaseCost: 28000,
    landedCost: 33000,
    priceUSD: 42000,
    priceNGN: 63000000,
    status: "Available",
    location: "Lagos Showroom",
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80",
    gallery: ["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80"],
    features: ["Öhlins Smart EC 2.0 Suspension", "Ducati Quick Shift (DQS)", "Carbon Fiber Wings", "Brembo Stylema R Calipers"],
    horsepower: 215,
    engine: "1,103cc Desmosedici Stradale V4",
    description: "MotoGP engineering transformed into the supreme road legal superbike.",
    featured: false,
  },
  {
    stockId: "STK-2026-006",
    vin: "WDB9076531R445566",
    category: "Executive Buses",
    make: "Mercedes-Benz",
    model: "Sprinter VIP Lounge",
    trim: "Executive Edition 9-Seater",
    year: 2024,
    mileage: 2500,
    condition: "Brand-new",
    transmission: "Automatic",
    fuel: "Diesel",
    exteriorColor: "Deep Obsidian Black",
    interiorColor: "Diamond Stitched Cream Nappa",
    purchaseCost: 145000,
    landedCost: 172000,
    priceUSD: 215000,
    priceNGN: 322500000,
    status: "Available",
    location: "Lagos Showroom",
    image: "https://images.unsplash.com/photo-1541348263662-e0c86437da1b?auto=format&fit=crop&w=1200&q=80",
    gallery: ["https://images.unsplash.com/photo-1541348263662-e0c86437da1b?auto=format&fit=crop&w=1200&q=80"],
    features: ["43-inch 4K Smart TV Partition", "Starlight Roof Ceiling", "Private Bar & Nespresso Station", "Intercom System", "Apple TV & High-Speed WiFi"],
    horsepower: 211,
    engine: "2.0L 4-Cylinder Turbo Diesel OM654",
    description: "The ultimate private jet on wheels. Purpose-built for corporate executives, royalty, and high-profile delegations.",
    featured: true,
  },
  {
    stockId: "STK-2026-007",
    vin: "WBA73AY09PC776655",
    category: "Executive Class",
    make: "BMW",
    model: "7 Series 760i",
    trim: "xDrive M Sport",
    year: 2023,
    mileage: 14000,
    condition: "Foreign-used",
    transmission: "Automatic",
    fuel: "Petrol",
    exteriorColor: "Black Sapphire",
    interiorColor: "Amarone Merino Leather",
    purchaseCost: 95000,
    landedCost: 112000,
    priceUSD: 138000,
    priceNGN: 207000000,
    status: "Reserved",
    location: "Lagos Showroom",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
    gallery: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80"],
    features: ["31.3-inch 8K Theater Screen", "Bowers & Wilkins Diamond Surround", "BMW Crystal Headlights", "Automatic Doors"],
    horsepower: 536,
    engine: "4.4L BMW M TwinPower Turbo V8",
    description: "Futuristic luxury with cinematic rear entertainment and expressive executive styling.",
    featured: false,
  },
  {
    stockId: "STK-2026-008",
    vin: "ZFF90NFA8P0288991",
    category: "Sport & Performance",
    make: "Ferrari",
    model: "296 GTB",
    trim: "Assetto Fiorano Package",
    year: 2023,
    mileage: 3900,
    condition: "Foreign-used",
    transmission: "Dual-Clutch",
    fuel: "Hybrid",
    exteriorColor: "Nero Daytona",
    interiorColor: "Nero Alcantara",
    purchaseCost: 265000,
    landedCost: 305000,
    priceUSD: 360000,
    priceNGN: 540000000,
    status: "In Transit",
    location: "Port Transit",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80",
    gallery: ["https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80"],
    features: ["Multimatic Shock Absorbers", "Carbon Fiber Wheels", "Michelin Pilot Sport Cup 2 R Tires", "Titanium Exhaust"],
    horsepower: 819,
    engine: "3.0L Twin-Turbo 120° V6 Hybrid",
    description: "Maranello's hybrid masterpiece combining intoxicating sound with razor-sharp track performance.",
    featured: false,
  }
];

export const VEHICLE_CATEGORIES = [
  { id: "all", name: "All Inventory", slug: "all", count: 8 },
  { id: "executive-class", name: "Executive Class", slug: "executive-class", count: 2 },
  { id: "sport-performance", name: "Sport & Performance", slug: "sport-performance", count: 2 },
  { id: "premium-suvs", name: "Premium SUVs", slug: "premium-suvs", count: 1 },
  { id: "electric-vehicles", name: "Electric Vehicles", slug: "electric-vehicles", count: 1 },
  { id: "power-bikes", name: "Power Bikes", slug: "power-bikes", count: 1 },
  { id: "executive-buses", name: "Executive Buses", slug: "executive-buses", count: 1 },
];

