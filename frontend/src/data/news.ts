export interface NewsArticle {
  id: string;
  slug: string;
  category: "arrivals" | "events" | "market";
  title: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
  summary: string;
  content: string[];
  highlights: string[];
  gallery: string[];
}

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: "news-001",
    slug: "2024-mercedes-maybach-s580-fleet-lagos",
    category: "arrivals",
    title: "2024 Mercedes-Maybach S580 Executive Fleet Touches Down in Lagos",
    date: "Nov 02, 2026",
    readTime: "3 min read",
    author: "Tariq K. - Head of Acquisitions",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
    summary:
      "Premier Auto Motors welcomes an exclusive consignment of three bespoke Maybach S580 sedans equipped with first-class rear executive suites and VIP armor options.",
    content: [
      "Our logistics team at the Tin Can Island terminal has concluded fast-track customs clearance for three hand-crafted 2024 Mercedes-Maybach S580 sedans. Fresh from Sindelfingen, Germany, these ultra-luxury flagships have been meticulously checked and prepared for immediate delivery to private clients across Nigeria.",
      "Each vehicle is finished in dual-tone obsidian metallic with exclusive nappa leather upholstery. Key specifications include electrically operated comfort rear doors, champagne refrigeration chambers, Burmester High-End 4D surround sound, and active road noise compensation for unmatched tranquility.",
      "In addition to their standard appointments, two of the units feature certified B6 ballistic armor protection engineered discreetly into the chassis, meeting the highest diplomatic and corporate executive transport requirements."
    ],
    highlights: [
      "4.0L V8 Biturbo with EQ Boost (496 hp + 20 hp electric)",
      "First-Class rear suite with folding executive tables and heated calf rests",
      "Official Nigerian Customs Single Goods Declaration (SGD) cleared with zero demurrage",
      "Available for confidential private viewing at our Victoria Island flagship"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: "news-002",
    slug: "annual-supercar-executive-gala-2026",
    category: "events",
    title: "Annual Supercar & Executive Concierge Gala 2026 Announced",
    date: "Oct 28, 2026",
    readTime: "4 min read",
    author: "Aisha M. - VIP Client Relations",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80",
    summary:
      "Join fellow collectors, diplomats, and business leaders at our Victoria Island showroom for an invitation-only exhibition of 25 rare performance vehicles.",
    content: [
      "Premier Auto Motors is thrilled to announce the 2026 edition of our Luxury Concierge & Supercar Gala. Scheduled for November 28th at our Victoria Island showroom, this private evening brings together automotive connoisseurs, corporate fleet directors, and private collectors for an intimate showcase.",
      "The exhibition will feature over 25 hand-picked performance cars, including limited-edition Porsche RS models, coachbuilt Ferraris, and bespoke armored SUVs. Attendees will have the opportunity to engage with international broker specialists and participate in closed-circuit test runs.",
      "Attendance is by private invitation. Registered VIP Black and Diplomatic tier clients can confirm their attendance and reserve private briefing slots directly through the Customer Portal."
    ],
    highlights: [
      "25+ exotic sports cars and luxury armored vehicles on private display",
      "Direct consultations with European and US auto broker desks",
      "VIP private lounge catering and concierge networking",
      "Exclusive first-access reservation allocations for 2027 allocations"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: "news-003",
    slug: "ncs-2026-import-duty-cet-clearance-revisions",
    category: "market",
    title: "Understanding NCS 2026 Import Duty & CET Clearance Revisions",
    date: "Oct 15, 2026",
    readTime: "5 min read",
    author: "Babatunde E. - Lead Customs Clearance Officer",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    summary:
      "A comprehensive legal breakdown of new vehicle tariff valuations, Single Goods Declarations (SGD), and port clearance schedules for imported luxury vehicles.",
    content: [
      "Navigating international vehicle procurement into Nigerian ports requires strict adherence to current Nigeria Customs Service (NCS) regulations and Common External Tariff (CET) guidelines. This advisory provides our clients with essential insights into duty computations and terminal discharge procedures.",
      "Recent regulatory updates place increased emphasis on electronic valuation benchmarks based on VIN verification and age-of-vehicle schedules. Understanding these parameters ensures our clients avoid port demurrage, unwarranted penalties, or document discrepancies.",
      "At Premier Auto Motors, all client vehicle consignments undergo end-to-end clearing managed by our dedicated in-house logistics officers, ensuring every vehicle arrives at your residence with 100% verified customs receipts and unencumbered title documentation."
    ],
    highlights: [
      "Clear overview of CET import tariffs across luxury and executive segments",
      "Step-by-step guidance on Pre-Arrival Assessment Report (PAAR) verification",
      "Critical documentation: Bill of Lading, SGD, and assessment receipts",
      "Zero-demurrage guarantee supported by bonded carrier escort directly to showroom"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80"
    ]
  }
];

