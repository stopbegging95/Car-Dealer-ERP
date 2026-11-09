"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FiPlus,
  FiCheck,
  FiTrendingUp,
  FiDollarSign,
  FiTarget,
  FiShare2,
  FiFileText,
  FiGlobe,
  FiEdit,
  FiTrash2,
  FiSliders,
  FiImage,
  FiVideo,
  FiRotateCcw,
  FiExternalLink,
  FiLayers,
  FiEye,
} from "react-icons/fi";
import { Button, Input, Dropdown, Card, Modal, Badge, Table, KPICard } from "@/components/ui";
import {
  useHomePageContent,
  HomePageSlide,
  SlideArchetype,
  BrandPartner,
} from "@/context/HomePageContext";

export interface MarketingCampaign {
  id: string;
  name: string;
  channel: "Google Search Ads" | "Meta / Instagram Ads" | "Out-of-Home Billboards" | "Private Gala Exhibits";
  budgetUSD: number;
  actualSpendUSD: number;
  leadsGenerated: number;
  salesClosed: number;
  revenueGeneratedUSD: number;
  cplUSD: number;
  roiPct: string;
  status: "Active & Scaling" | "Completed" | "In Review";
}

export interface EditorialArticle {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  status: string;
}

export interface CMSPageProps {
  showToast: (msg: string) => void;
}

export const CMSPage: React.FC<CMSPageProps> = ({ showToast }) => {
  const [activeTab, setActiveTab] = useState<
    "hero-slides" | "brand-partners" | "promotions" | "campaigns" | "articles"
  >("hero-slides");

  // Consume shared Homepage Content Context
  const {
    slides,
    brands,
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
  } = useHomePageContent();

  // ---------------------------------------------------------------------------
  // SLIDE MODAL STATE
  // ---------------------------------------------------------------------------
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [slideTitle, setSlideTitle] = useState("");
  const [slideArchetype, setSlideArchetype] = useState<SlideArchetype>("text-image");
  const [slideBadge, setSlideBadge] = useState("PREMIUM LUXURY CAR DEALERSHIP");
  const [slideHeadline, setSlideHeadline] = useState("DRIVE YOUR");
  const [slideHighlightText, setSlideHighlightText] = useState("DREAM CAR");
  const [slideDescription, setSlideDescription] = useState("");
  const [slideMediaUrl, setSlideMediaUrl] = useState("");
  const [slidePrimaryCtaText, setSlidePrimaryCtaText] = useState("View Inventory");
  const [slidePrimaryCtaLink, setSlidePrimaryCtaLink] = useState("#inventory-section");
  const [slideSecondaryCtaText, setSlideSecondaryCtaText] = useState("Book a Test Drive");
  const [slideSecondaryCtaLink, setSlideSecondaryCtaLink] = useState("test-drive-modal");
  const [slideOrder, setSlideOrder] = useState<number>(1);
  const [slideActive, setSlideActive] = useState(true);

  // Delete Slide Modal
  const [slideToDelete, setSlideToDelete] = useState<HomePageSlide | null>(null);

  // Reset Confirmation Modal
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // ---------------------------------------------------------------------------
  // BRAND MODAL STATE
  // ---------------------------------------------------------------------------
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
  const [brandName, setBrandName] = useState("");
  const [brandMake, setBrandMake] = useState("");
  const [brandLogo, setBrandLogo] = useState("");
  const [brandActive, setBrandActive] = useState(true);
  const [brandToDelete, setBrandToDelete] = useState<BrandPartner | null>(null);

  // ---------------------------------------------------------------------------
  // PROMO BANNER FORM STATE
  // ---------------------------------------------------------------------------
  const [promoEnabled, setPromoEnabled] = useState(promoBanner.enabled);
  const [promoBadge, setPromoBadge] = useState(promoBanner.badge);
  const [promoMessage, setPromoMessage] = useState(promoBanner.message);
  const [promoLinkText, setPromoLinkText] = useState(promoBanner.linkText);
  const [promoLinkUrl, setPromoLinkUrl] = useState(promoBanner.linkUrl);

  // ---------------------------------------------------------------------------
  // CAMPAIGNS & ARTICLES STATE (Retained from existing CMS)
  // ---------------------------------------------------------------------------
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([
    {
      id: "CMP-2026-01",
      name: "Q4 2026 Maybach & S-Class Executive Campaign",
      channel: "Google Search Ads",
      budgetUSD: 25000,
      actualSpendUSD: 21400,
      leadsGenerated: 142,
      salesClosed: 4,
      revenueGeneratedUSD: 660000,
      cplUSD: 150.7,
      roiPct: "+2,984%",
      status: "Active & Scaling",
    },
    {
      id: "CMP-2026-02",
      name: "Porsche 911 Turbo S & GT3 RS Digital Showcase",
      channel: "Meta / Instagram Ads",
      budgetUSD: 18000,
      actualSpendUSD: 16800,
      leadsGenerated: 198,
      salesClosed: 3,
      revenueGeneratedUSD: 735000,
      cplUSD: 84.8,
      roiPct: "+4,275%",
      status: "Active & Scaling",
    },
    {
      id: "CMP-2026-03",
      name: "Lekki-Ikoyi Link Bridge Digital Super-Structure Billboard",
      channel: "Out-of-Home Billboards",
      budgetUSD: 35000,
      actualSpendUSD: 35000,
      leadsGenerated: 86,
      salesClosed: 2,
      revenueGeneratedUSD: 440000,
      cplUSD: 406.9,
      roiPct: "+1,157%",
      status: "Active & Scaling",
    },
    {
      id: "CMP-2026-04",
      name: "Transcorp Hilton Abuja Diplomatic Private Gala",
      channel: "Private Gala Exhibits",
      budgetUSD: 30000,
      actualSpendUSD: 28500,
      leadsGenerated: 44,
      salesClosed: 3,
      revenueGeneratedUSD: 820000,
      cplUSD: 647.7,
      roiPct: "+2,777%",
      status: "Completed",
    },
  ]);

  const [articles, setArticles] = useState<EditorialArticle[]>([
    { id: "NEWS-001", title: "2026 Mercedes-Maybach Night Series Arrives in Lagos", category: "Showroom Arrivals", author: "Chief Automotive Editor", date: "Nov 06, 2026", status: "Published" },
    { id: "NEWS-002", title: "Private Gala: Unveiling the 2024 Porsche 911 Turbo S in Abuja", category: "Private Gala", author: "VIP Events Desk", date: "Nov 04, 2026", status: "Published" },
    { id: "NEWS-003", title: "Nigeria Customs HS Code 8703 Tariff Updates & Duty Advisory", category: "Customs News", author: "Maritime Liaison", date: "Nov 01, 2026", status: "Published" },
    { id: "NEWS-004", title: "Q4 2026 Ultra-Luxury Automotive Market Insights & Yields", category: "Market Insights", author: "Chief Financial Analyst", date: "Oct 28, 2026", status: "Published" },
  ]);

  // Campaign / Article Modals
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [headline, setHeadline] = useState("");
  const [category, setCategory] = useState("Showroom Press");
  const [summary, setSummary] = useState("");
  const [author, setAuthor] = useState("Chief Automotive Editor");
  const [campName, setCampName] = useState("");
  const [campChannel, setCampChannel] = useState<MarketingCampaign["channel"]>("Google Search Ads");
  const [campBudget, setCampBudget] = useState("31,000,000");

  // Open Create Slide Modal
  const handleOpenCreateSlide = () => {
    setEditingSlideId(null);
    setSlideTitle("");
    setSlideArchetype("text-image");
    setSlideBadge("PREMIUM LUXURY CAR DEALERSHIP");
    setSlideHeadline("DRIVE YOUR");
    setSlideHighlightText("DREAM CAR");
    setSlideDescription("Explore our prestigious collection of luxury and executive vehicles. Hand-selected, fully certified, and delivered with VIP concierge excellence.");
    setSlideMediaUrl("https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1920&q=80");
    setSlidePrimaryCtaText("View Inventory");
    setSlidePrimaryCtaLink("#inventory-section");
    setSlideSecondaryCtaText("Book a Test Drive");
    setSlideSecondaryCtaLink("test-drive-modal");
    setSlideOrder(slides.length + 1);
    setSlideActive(true);
    setIsSlideModalOpen(true);
  };

  // Open Edit Slide Modal
  const handleOpenEditSlide = (slide: HomePageSlide) => {
    setEditingSlideId(slide.id);
    setSlideTitle(slide.title);
    setSlideArchetype(slide.archetype);
    setSlideBadge(slide.badge);
    setSlideHeadline(slide.headline);
    setSlideHighlightText(slide.highlightText);
    setSlideDescription(slide.description);
    setSlideMediaUrl(slide.mediaUrl);
    setSlidePrimaryCtaText(slide.primaryCtaText);
    setSlidePrimaryCtaLink(slide.primaryCtaLink);
    setSlideSecondaryCtaText(slide.secondaryCtaText);
    setSlideSecondaryCtaLink(slide.secondaryCtaLink);
    setSlideOrder(slide.order);
    setSlideActive(slide.active);
    setIsSlideModalOpen(true);
  };

  // Submit Create / Edit Slide
  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideTitle.trim()) {
      showToast("Please provide a title for the homepage slide.");
      return;
    }

    if (editingSlideId) {
      updateSlide(editingSlideId, {
        title: slideTitle,
        archetype: slideArchetype,
        badge: slideBadge,
        headline: slideHeadline,
        highlightText: slideHighlightText,
        description: slideDescription,
        mediaUrl: slideMediaUrl,
        primaryCtaText: slidePrimaryCtaText,
        primaryCtaLink: slidePrimaryCtaLink,
        secondaryCtaText: slideSecondaryCtaText,
        secondaryCtaLink: slideSecondaryCtaLink,
        order: slideOrder,
        active: slideActive,
      });
      showToast(`Updated slide "${slideTitle}" live on public homepage.`);
    } else {
      createSlide({
        title: slideTitle,
        archetype: slideArchetype,
        badge: slideBadge,
        headline: slideHeadline,
        highlightText: slideHighlightText,
        description: slideDescription,
        mediaUrl: slideMediaUrl,
        primaryCtaText: slidePrimaryCtaText,
        primaryCtaLink: slidePrimaryCtaLink,
        secondaryCtaText: slideSecondaryCtaText,
        secondaryCtaLink: slideSecondaryCtaLink,
        order: slideOrder,
        active: slideActive,
      });
      showToast(`Created new slide "${slideTitle}" and published live to homepage!`);
    }

    setIsSlideModalOpen(false);
  };

  // Confirm Delete Slide
  const handleConfirmDeleteSlide = () => {
    if (!slideToDelete) return;
    deleteSlide(slideToDelete.id);
    showToast(`Removed slide "${slideToDelete.title}" from homepage.`);
    setSlideToDelete(null);
  };

  // ---------------------------------------------------------------------------
  // BRAND HANDLERS
  // ---------------------------------------------------------------------------
  const handleOpenCreateBrand = () => {
    setEditingBrandId(null);
    setBrandName("");
    setBrandMake("");
    setBrandLogo("https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg");
    setBrandActive(true);
    setIsBrandModalOpen(true);
  };

  const handleOpenEditBrand = (brand: BrandPartner) => {
    setEditingBrandId(brand.id);
    setBrandName(brand.name);
    setBrandMake(brand.make);
    setBrandLogo(brand.logo);
    setBrandActive(brand.active);
    setIsBrandModalOpen(true);
  };

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim() || !brandLogo.trim()) {
      showToast("Please provide brand name and logo URL.");
      return;
    }

    if (editingBrandId) {
      updateBrand(editingBrandId, {
        name: brandName,
        make: brandMake || brandName,
        logo: brandLogo,
        active: brandActive,
      });
      showToast(`Updated brand partner "${brandName}".`);
    } else {
      createBrand({
        name: brandName,
        make: brandMake || brandName,
        logo: brandLogo,
        width: 50,
        height: 35,
        active: brandActive,
      });
      showToast(`Added "${brandName}" to Homepage Brand Partners bar!`);
    }

    setIsBrandModalOpen(false);
  };

  const handleConfirmDeleteBrand = () => {
    if (!brandToDelete) return;
    deleteBrand(brandToDelete.id);
    showToast(`Deleted brand partner "${brandToDelete.name}".`);
    setBrandToDelete(null);
  };

  // ---------------------------------------------------------------------------
  // PROMO BANNER HANDLER
  // ---------------------------------------------------------------------------
  const handleSavePromoBanner = (e: React.FormEvent) => {
    e.preventDefault();
    updatePromoBanner({
      enabled: promoEnabled,
      badge: promoBadge,
      message: promoMessage,
      linkText: promoLinkText,
      linkUrl: promoLinkUrl,
    });
    showToast("Homepage Announcement Banner updated live!");
  };

  // Campaign / Article Handlers
  const handlePublishArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline) return;
    const newArticle: EditorialArticle = {
      id: `NEWS-00${articles.length + 1}`,
      title: headline,
      category,
      author,
      date: "Nov 09, 2026",
      status: "Published",
    };
    setArticles([newArticle, ...articles]);
    setIsArticleModalOpen(false);
    showToast(`Published article "${headline}" to public news editorial.`);
    setHeadline("");
    setSummary("");
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campName) return;
    const budgetNum = Number(campBudget.replace(/[^0-9]/g, "") || 31000000);
    const newCamp: MarketingCampaign = {
      id: `CMP-2026-${String(campaigns.length + 5).padStart(2, "0")}`,
      name: campName,
      channel: campChannel,
      budgetUSD: Math.round(budgetNum / 1550),
      actualSpendUSD: 0,
      leadsGenerated: 0,
      salesClosed: 0,
      revenueGeneratedUSD: 0,
      cplUSD: 0,
      roiPct: "0%",
      status: "Active & Scaling",
    };
    setCampaigns([newCamp, ...campaigns]);
    setIsCampaignModalOpen(false);
    showToast(`Marketing campaign "${campName}" launched (₦${budgetNum.toLocaleString()} allocation).`);
    setCampName("");
  };

  const totalMarketingSpend = campaigns.reduce((acc, c) => acc + c.actualSpendUSD * 1550, 0);
  const totalAttributedRevenue = campaigns.reduce((acc, c) => acc + c.revenueGeneratedUSD * 1550, 0);
  const liveSlidesCount = slides.filter((s) => s.active).length;

  return (
    <div className="space-y-4">
      {/* 1. Marketing & Homepage Telemetry Strip */}
      <div className="gap-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Homepage Live Slides"
          value={`${liveSlidesCount} Active`}
          change={`${slides.length} Total Registered`}
          icon={<FiImage className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Brand Partners Bar"
          value={`${brands.filter((b) => b.active).length} Logos`}
          change="Public Homepage Carousel"
          icon={<FiGlobe className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Attributed Sales Revenue"
          value={`₦${(totalAttributedRevenue / 1000000000).toFixed(2)}B`}
          change="12 Closed Units Attributed"
          icon={<FiTrendingUp className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Total Advertising Spend"
          value={`₦${(totalMarketingSpend / 1000000).toFixed(1)}M`}
          change="Across Google, Meta, OOH"
          icon={<FiDollarSign className="w-5 h-5 text-[#2563EB]" />}
        />
      </div>

      {/* 2. Sub-Tabs Bar */}
      <Card className="shadow-xs p-3">
        <div className="flex flex-wrap gap-1">
          <Button
            variant={activeTab === "hero-slides" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("hero-slides")}
            className="text-xs font-bold"
          >
            Homepage Hero Slider ({slides.length} Slides)
          </Button>
          <Button
            variant={activeTab === "brand-partners" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("brand-partners")}
            className="text-xs font-bold"
          >
            Brand Partners Bar ({brands.length} Brands)
          </Button>
          <Button
            variant={activeTab === "promotions" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("promotions")}
            className="text-xs font-bold"
          >
            Announcement Ticker ({promoBanner.enabled ? "Active" : "Disabled"})
          </Button>
          <Button
            variant={activeTab === "campaigns" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("campaigns")}
            className="text-xs font-bold"
          >
            Advertising Campaigns & ROI ({campaigns.length})
          </Button>
          <Button
            variant={activeTab === "articles" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("articles")}
            className="text-xs font-bold"
          >
            Public Editorial Dispatches ({articles.length})
          </Button>
        </div>
      </Card>

      {/* ===================================================================== */}
      {/* VIEW 1: HOMEPAGE HERO SLIDES MANAGER                                  */}
      {/* ===================================================================== */}
      {activeTab === "hero-slides" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
                  Homepage Hero Slider & Dynamic Banners (http://localhost:3000)
                </h3>
                <Badge variant="gold" size="sm">Live Homepage Sync</Badge>
              </div>
              <p className="text-[11px] text-[#64748B]">
                Create, edit, reorder, and activate the 5 luxury archetypes (Text+Image, Text Only, Image Only, Text+Video, Video Only) rendered on the public website.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsResetModalOpen(true)}
                leftIcon={<FiRotateCcw className="w-3.5 h-3.5" />}
              >
                Reset Defaults
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenCreateSlide}
                leftIcon={<FiPlus className="w-3.5 h-3.5" />}
              >
                + Create Homepage Slide
              </Button>
            </div>
          </div>

          <Table
            data={slides}
            keyExtractor={(s) => s.id}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "id",
                header: "Slide Ref",
                sortable: true,
                render: (s) => (
                  <span className="font-mono font-bold text-[#2563EB] text-xs">{s.id}</span>
                ),
              },
              {
                key: "title",
                header: "Title & Archetype",
                sortable: true,
                render: (s) => (
                  <div>
                    <span className="font-bold text-[#0F172A] text-xs block">{s.title}</span>
                    <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase px-1.5 py-0.2 rounded bg-[#EFF6FF] text-[#1D4ED8] font-bold border border-[#BFDBFE] mt-0.5">
                      {s.archetype === "text-video" || s.archetype === "video-only" ? (
                        <FiVideo className="w-2.5 h-2.5 text-[#2563EB]" />
                      ) : (
                        <FiImage className="w-2.5 h-2.5 text-[#2563EB]" />
                      )}
                      {s.archetype}
                    </span>
                  </div>
                ),
              },
              {
                key: "headline",
                header: "Headline Preview",
                render: (s) => (
                  <div className="max-w-xs truncate">
                    <span className="font-bold text-xs text-[#0F172A]">{s.headline} </span>
                    <span className="font-bold text-xs text-[#2563EB]">{s.highlightText}</span>
                    {s.description && (
                      <span className="block text-[10px] text-[#64748B] truncate mt-0.5">
                        {s.description}
                      </span>
                    )}
                  </div>
                ),
              },
              {
                key: "mediaUrl",
                header: "Media Asset",
                render: (s) => (
                  <div className="text-[11px] text-[#475569] max-w-[180px] truncate">
                    {s.mediaUrl ? (
                      <a
                        href={s.mediaUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#2563EB] hover:underline flex items-center gap-1 truncate"
                        title={s.mediaUrl}
                      >
                        <FiExternalLink className="w-3 h-3 shrink-0" />
                        <span className="truncate">{s.mediaUrl}</span>
                      </a>
                    ) : (
                      <span className="text-[#94A3B8] italic">Ambient Gradient (No Media)</span>
                    )}
                  </div>
                ),
              },
              {
                key: "order",
                header: "Order",
                sortable: true,
                render: (s) => (
                  <span className="font-mono text-xs font-bold text-[#0F172A]">#{s.order}</span>
                ),
              },
              {
                key: "active",
                header: "Status",
                render: (s) => (
                  <Badge variant={s.active ? "gold" : "outline"} size="sm">
                    {s.active ? "Live on Homepage" : "Draft / Paused"}
                  </Badge>
                ),
              },
              {
                key: "actions",
                header: "Actions",
                align: "right",
                render: (s) => (
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSlideActive(s.id)}
                      className="text-[10px] font-semibold text-[#64748B]"
                    >
                      {s.active ? "Pause" : "Publish"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEditSlide(s)}
                      className="text-xs"
                      leftIcon={<FiEdit className="w-3 h-3 text-[#2563EB]" />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setSlideToDelete(s)}
                      className="text-xs"
                    >
                      <FiTrash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </Card>
      )}

      {/* ===================================================================== */}
      {/* VIEW 2: HOMEPAGE BRAND PARTNERS BAR                                   */}
      {/* ===================================================================== */}
      {activeTab === "brand-partners" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
                  Brand Partners Showcase Bar (http://localhost:3000)
                </h3>
                <Badge variant="gold" size="sm">Public Logo Carousel</Badge>
              </div>
              <p className="text-[11px] text-[#64748B]">
                Manage luxury OEM automotive manufacturers displayed in the interactive logo strip on the public homepage.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenCreateBrand}
              leftIcon={<FiPlus className="w-3.5 h-3.5" />}
            >
              + Add Brand Partner
            </Button>
          </div>

          <Table
            data={brands}
            keyExtractor={(b) => b.id}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "id",
                header: "Brand ID",
                sortable: true,
                render: (b) => (
                  <span className="font-mono font-bold text-[#2563EB] text-xs">{b.id}</span>
                ),
              },
              {
                key: "name",
                header: "Brand Entity",
                sortable: true,
                render: (b) => (
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-white border border-[#CBD5E1] rounded-md p-1 flex items-center justify-center shrink-0">
                      {b.logo ? (
                        <img
                          src={b.logo}
                          alt={b.name}
                          className="max-h-7 max-w-7 object-contain"
                        />
                      ) : (
                        <FiGlobe className="w-4 h-4 text-[#94A3B8]" />
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-[#0F172A] block">{b.name}</span>
                      <span className="text-[10px] text-[#64748B] font-mono">Make: {b.make}</span>
                    </div>
                  </div>
                ),
              },
              {
                key: "logo",
                header: "Vector Logo URL",
                render: (b) => (
                  <div className="text-[11px] text-[#475569] max-w-xs truncate">
                    <a
                      href={b.logo}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#2563EB] hover:underline flex items-center gap-1 truncate"
                    >
                      <FiExternalLink className="w-3 h-3 shrink-0" />
                      <span className="truncate">{b.logo}</span>
                    </a>
                  </div>
                ),
              },
              {
                key: "active",
                header: "Status",
                render: (b) => (
                  <Badge variant={b.active ? "gold" : "outline"} size="sm">
                    {b.active ? "Visible on Carousel" : "Hidden"}
                  </Badge>
                ),
              },
              {
                key: "actions",
                header: "Actions",
                align: "right",
                render: (b) => (
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleBrandActive(b.id)}
                      className="text-[10px] font-semibold text-[#64748B]"
                    >
                      {b.active ? "Hide" : "Show"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEditBrand(b)}
                      className="text-xs"
                      leftIcon={<FiEdit className="w-3 h-3 text-[#2563EB]" />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setBrandToDelete(b)}
                      className="text-xs"
                    >
                      <FiTrash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </Card>
      )}

      {/* ===================================================================== */}
      {/* VIEW 3: HOMEPAGE ANNOUNCEMENT TICKER                                  */}
      {/* ===================================================================== */}
      {activeTab === "promotions" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
                  Homepage Announcement & Notification Ticker
                </h3>
                <Badge variant={promoEnabled ? "gold" : "outline"} size="sm">
                  {promoEnabled ? "Active on Website" : "Disabled"}
                </Badge>
              </div>
              <p className="text-[11px] text-[#64748B]">
                Configure the dynamic top announcement banner displayed at the peak of the public showroom website.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleSavePromoBanner}
              leftIcon={<FiCheck className="w-3.5 h-3.5" />}
            >
              + Update Announcement
            </Button>
          </div>

          {/* Live Preview Box */}
          <div className="p-3 bg-[#0F172A] text-white rounded-xl border border-[#334155] space-y-1">
            <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">
              Live Website Preview:
            </span>
            {promoEnabled ? (
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="bg-[#2563EB] text-white font-bold text-[9px] px-2 py-0.5 rounded uppercase">
                    {promoBadge || "VIP INVENTORY"}
                  </span>
                  <span className="text-[#E2E8F0] font-medium">{promoMessage}</span>
                </div>
                {promoLinkText && (
                  <span className="text-[#60A5FA] underline text-xs font-semibold cursor-pointer">
                    {promoLinkText} &rarr;
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs text-[#94A3B8] italic">
                Announcement banner is currently disabled and hidden from the homepage.
              </span>
            )}
          </div>

          <form onSubmit={handleSavePromoBanner} className="space-y-4 pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="promoEnabled"
                checked={promoEnabled}
                onChange={(e) => setPromoEnabled(e.target.checked)}
                className="w-4 h-4 text-[#2563EB] rounded cursor-pointer"
              />
              <label htmlFor="promoEnabled" className="text-xs font-bold text-[#0F172A] cursor-pointer">
                Display Announcement Banner on Public Website
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Badge Pill Label"
                placeholder="e.g. VIP INVENTORY ALERT"
                value={promoBadge}
                onChange={(e) => setPromoBadge(e.target.value)}
              />
              <Input
                label="Action Link Text"
                placeholder="e.g. View Stock"
                value={promoLinkText}
                onChange={(e) => setPromoLinkText(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Announcement Message Text"
                placeholder="e.g. New 2026 Mercedes-Maybach Night Series berthed at Lagos Port."
                value={promoMessage}
                onChange={(e) => setPromoMessage(e.target.value)}
                required
              />
              <Input
                label="Target Link Destination URL"
                placeholder="e.g. /inventory or /services/auto-brokers"
                value={promoLinkUrl}
                onChange={(e) => setPromoLinkUrl(e.target.value)}
              />
            </div>
          </form>
        </Card>
      )}

      {/* ===================================================================== */}
      {/* VIEW 4: ADVERTISING CAMPAIGNS & MARKETING ROI                         */}
      {/* ===================================================================== */}
      {activeTab === "campaigns" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3">
            <div>
              <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
                Marketing Campaigns, Cost Per Lead (CPL) & Revenue Attribution
              </h3>
              <p className="text-[11px] text-[#64748B]">
                Multi-channel ad performance across Google Ads, Meta, Out-of-Home digital billboards, and VIP private exhibits
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCampaignModalOpen(true)}
              leftIcon={<FiPlus className="w-3.5 h-3.5" />}
            >
              + Launch Campaign
            </Button>
          </div>

          <Table
            data={campaigns}
            keyExtractor={(c) => c.id}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "id",
                header: "Campaign Ref",
                sortable: true,
                render: (c) => <span className="font-mono font-bold text-[#2563EB] text-xs">{c.id}</span>,
              },
              {
                key: "name",
                header: "Campaign Name & Channel",
                sortable: true,
                render: (c) => (
                  <div>
                    <span className="font-bold text-[#0F172A] text-xs">{c.name}</span>
                    <span className="block text-[10px] text-[#64748B]">{c.channel}</span>
                  </div>
                ),
              },
              {
                key: "budgetUSD",
                header: "Allocated Budget",
                sortable: true,
                render: (c) => (
                  <span className="font-mono text-xs font-bold text-[#0F172A]">
                    ₦{(c.budgetUSD * 1550).toLocaleString()}
                  </span>
                ),
              },
              {
                key: "actualSpendUSD",
                header: "Actual Spend",
                sortable: true,
                render: (c) => (
                  <span className="font-mono text-xs text-[#475569]">
                    ₦{(c.actualSpendUSD * 1550).toLocaleString()}
                  </span>
                ),
              },
              {
                key: "leadsGenerated",
                header: "Leads",
                sortable: true,
                render: (c) => (
                  <span className="font-bold text-xs text-[#2563EB]">{c.leadsGenerated} Leads</span>
                ),
              },
              {
                key: "salesClosed",
                header: "Closed Units",
                sortable: true,
                render: (c) => (
                  <span className="font-bold text-xs text-emerald-700">{c.salesClosed} Cars</span>
                ),
              },
              {
                key: "revenueGeneratedUSD",
                header: "Attributed Revenue",
                sortable: true,
                render: (c) => (
                  <span className="font-mono font-bold text-xs text-[#0F172A]">
                    ₦{(c.revenueGeneratedUSD * 1550).toLocaleString()}
                  </span>
                ),
              },
              {
                key: "roiPct",
                header: "Ad ROI",
                sortable: true,
                render: (c) => <Badge variant="gold" size="sm">{c.roiPct}</Badge>,
              },
              {
                key: "status",
                header: "Status",
                render: (c) => (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {c.status}
                  </span>
                ),
              },
            ]}
          />
        </Card>
      )}

      {/* ===================================================================== */}
      {/* VIEW 5: PUBLIC EDITORIAL DISPATCHES                                   */}
      {/* ===================================================================== */}
      {activeTab === "articles" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3">
            <div>
              <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
                Website Content & Press Releases
              </h3>
              <p className="text-[11px] text-[#64748B]">
                Admin CMS console: public banners, featured vehicles & automotive press updates
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsArticleModalOpen(true)}
              leftIcon={<FiPlus className="w-3.5 h-3.5" />}
            >
              + Create Editorial
            </Button>
          </div>

          <Table
            data={articles}
            keyExtractor={(item) => item.id}
            pageSize={15}
            showSerialNumber={true}
            columns={[
              {
                key: "id",
                header: "Ref Code",
                sortable: true,
                render: (item) => <span className="font-mono font-bold text-[#2563EB] text-xs">{item.id}</span>,
              },
              {
                key: "title",
                header: "Article Title & Headline",
                sortable: true,
                render: (item) => <span className="font-bold text-[#0F172A] text-xs">{item.title}</span>,
              },
              {
                key: "category",
                header: "Editorial Category",
                sortable: true,
                render: (item) => <span className="text-xs text-[#475569]">{item.category}</span>,
              },
              {
                key: "author",
                header: "Publishing Author",
                render: (item) => <span className="text-xs text-[#0F172A] font-medium">{item.author}</span>,
              },
              {
                key: "date",
                header: "Date Published",
                sortable: true,
                render: (item) => <span className="font-mono text-xs text-[#64748B]">{item.date}</span>,
              },
              {
                key: "status",
                header: "Status",
                render: (item) => <Badge variant="gold" size="sm">{item.status}</Badge>,
              },
            ]}
          />
        </Card>
      )}

      {/* ===================================================================== */}
      {/* MODAL 1: CREATE / EDIT HOMEPAGE SLIDE                                  */}
      {/* ===================================================================== */}
      <Modal
        isOpen={isSlideModalOpen}
        onClose={() => setIsSlideModalOpen(false)}
        size="lg"
        title={editingSlideId ? "Edit Homepage Hero Slide" : "Create New Homepage Hero Slide"}
        description="Configure banner headline, archetype, media asset, and call-to-actions published on http://localhost:3000."
      >
        <form onSubmit={handleSaveSlide} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Administrative Slide Title"
              placeholder="e.g. 2026 Maybach Night Series Premier"
              value={slideTitle}
              onChange={(e) => setSlideTitle(e.target.value)}
              required
            />
            <Dropdown
              label="Slide Archetype"
              options={[
                { label: "Text + Image (Headline, Description, CTAs, Hero Image)", value: "text-image" },
                { label: "Text Only (Editorial Headline, Ambient Gradient, Value Badges)", value: "text-only" },
                { label: "Image Only (Full-Bleed Supercar Showcase)", value: "image-only" },
                { label: "Text + Video (Animated Headline, Background YouTube/MP4)", value: "text-video" },
                { label: "Video Only (Full-Bleed 4K Performance Footage)", value: "video-only" },
              ]}
              value={slideArchetype}
              onChange={(val) => setSlideArchetype(val as SlideArchetype)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Badge Pill Text"
              placeholder="e.g. PREMIUM LUXURY CAR DEALERSHIP"
              value={slideBadge}
              onChange={(e) => setSlideBadge(e.target.value)}
            />
            <Input
              label="Primary Headline"
              placeholder="e.g. DRIVE YOUR"
              value={slideHeadline}
              onChange={(e) => setSlideHeadline(e.target.value)}
            />
            <Input
              label="Highlight Accent Text"
              placeholder="e.g. DREAM CAR"
              value={slideHighlightText}
              onChange={(e) => setSlideHighlightText(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#0F172A]">
              Description / Paragraph Copy
            </label>
            <textarea
              rows={2}
              className="w-full bg-[#FFFFFF] border border-[#CBD5E1] rounded-md px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              placeholder="Explore our prestigious collection of luxury and executive vehicles..."
              value={slideDescription}
              onChange={(e) => setSlideDescription(e.target.value)}
            />
          </div>

          <Input
            label={
              slideArchetype === "text-video" || slideArchetype === "video-only"
                ? "Background Video URL (YouTube embed or MP4 URL)"
                : "Hero Image URL"
            }
            placeholder={
              slideArchetype === "text-video" || slideArchetype === "video-only"
                ? "https://www.youtube-nocookie.com/embed/YAFUyPp_238"
                : "https://images.unsplash.com/photo-..."
            }
            value={slideMediaUrl}
            onChange={(e) => setSlideMediaUrl(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Primary CTA Text"
              placeholder="e.g. View Inventory"
              value={slidePrimaryCtaText}
              onChange={(e) => setSlidePrimaryCtaText(e.target.value)}
            />
            <Input
              label="Primary CTA Target Link"
              placeholder="e.g. #inventory-section or /inventory"
              value={slidePrimaryCtaLink}
              onChange={(e) => setSlidePrimaryCtaLink(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Secondary CTA Text"
              placeholder="e.g. Book a Test Drive"
              value={slideSecondaryCtaText}
              onChange={(e) => setSlideSecondaryCtaText(e.target.value)}
            />
            <Input
              label="Secondary CTA Target Link"
              placeholder="e.g. test-drive-modal or /services/auto-brokers"
              value={slideSecondaryCtaLink}
              onChange={(e) => setSlideSecondaryCtaLink(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
            <div className="flex items-center gap-4">
              <div className="w-28">
                <Input
                  label="Display Order"
                  type="number"
                  value={String(slideOrder)}
                  onChange={(e) => setSlideOrder(Number(e.target.value) || 1)}
                />
              </div>
              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id="slideActiveToggle"
                  checked={slideActive}
                  onChange={(e) => setSlideActive(e.target.checked)}
                  className="w-4 h-4 text-[#2563EB] rounded cursor-pointer"
                />
                <label htmlFor="slideActiveToggle" className="text-xs font-bold text-[#0F172A] cursor-pointer">
                  Publish Live on Homepage
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsSlideModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                {editingSlideId ? "Save Changes" : "Publish Slide"}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* ===================================================================== */}
      {/* MODAL 2: DELETE SLIDE CONFIRMATION                                     */}
      {/* ===================================================================== */}
      <Modal
        isOpen={!!slideToDelete}
        onClose={() => setSlideToDelete(null)}
        size="sm"
        title="Delete Homepage Slide"
        description="Are you sure you want to remove this slide from the homepage slider?"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button variant="outline" size="sm" onClick={() => setSlideToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={handleConfirmDeleteSlide}>
              Confirm Delete
            </Button>
          </div>
        }
      >
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 space-y-1">
          <p className="font-bold">Removing Slide: {slideToDelete?.title}</p>
          <p className="text-[11px] text-red-600">
            This slide will be immediately removed from http://localhost:3000.
          </p>
        </div>
      </Modal>

      {/* ===================================================================== */}
      {/* MODAL 3: CREATE / EDIT BRAND PARTNER                                  */}
      {/* ===================================================================== */}
      <Modal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        size="md"
        title={editingBrandId ? "Edit Brand Partner" : "Add New Brand Partner"}
        description="Add luxury automotive manufacturers to the homepage logo carousel."
      >
        <form onSubmit={handleSaveBrand} className="space-y-4">
          <Input
            label="Brand Name"
            placeholder="e.g. Bentley Motors"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            required
          />
          <Input
            label="Make Identifier"
            placeholder="e.g. Bentley"
            value={brandMake}
            onChange={(e) => setBrandMake(e.target.value)}
          />
          <Input
            label="Vector Logo URL (SVG or PNG with transparent background)"
            placeholder="https://upload.wikimedia.org/wikipedia/commons/..."
            value={brandLogo}
            onChange={(e) => setBrandLogo(e.target.value)}
            required
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="brandActiveToggle"
              checked={brandActive}
              onChange={(e) => setBrandActive(e.target.checked)}
              className="w-4 h-4 text-[#2563EB] rounded cursor-pointer"
            />
            <label htmlFor="brandActiveToggle" className="text-xs font-bold text-[#0F172A] cursor-pointer">
              Visible in Homepage Carousel
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsBrandModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingBrandId ? "Update Brand" : "Add Brand"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ===================================================================== */}
      {/* MODAL 4: DELETE BRAND CONFIRMATION                                    */}
      {/* ===================================================================== */}
      <Modal
        isOpen={!!brandToDelete}
        onClose={() => setBrandToDelete(null)}
        size="sm"
        title="Remove Brand Partner"
        description="Are you sure you want to remove this brand from the carousel?"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button variant="outline" size="sm" onClick={() => setBrandToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={handleConfirmDeleteBrand}>
              Remove Brand
            </Button>
          </div>
        }
      >
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 space-y-1">
          <p className="font-bold">Brand: {brandToDelete?.name}</p>
          <p className="text-[11px] text-red-600">
            This logo will be removed from the public brand slider.
          </p>
        </div>
      </Modal>

      {/* ===================================================================== */}
      {/* MODAL 5: RESET HOMEPAGE DEFAULTS CONFIRMATION                         */}
      {/* ===================================================================== */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        size="sm"
        title="Reset Homepage to Factory Defaults"
        description="Restore original 5-slide luxury archetypes and default brand partners?"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button variant="outline" size="sm" onClick={() => setIsResetModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                resetToDefaults();
                setIsResetModalOpen(false);
                showToast("Homepage content restored to factory defaults.");
              }}
            >
              Reset Defaults
            </Button>
          </div>
        }
      >
        <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg text-xs text-[#1D4ED8]">
          This will restore the 5 original luxury slides (Mercedes fleet, editorial prestige, supercar showcase, track video, 4K performance) and brand logos.
        </div>
      </Modal>

      {/* MODAL 6: CREATE ARTICLE */}
      <Modal
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
        title="Publish Editorial News Article"
        size="md"
      >
        <form onSubmit={handlePublishArticle} className="space-y-3">
          <Input
            label="Article Headline"
            placeholder="e.g. 2026 Mercedes-Maybach Night Series Arrives in Lagos"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Dropdown
              label="Editorial Category"
              options={[
                { label: "Showroom Arrivals", value: "Showroom Arrivals" },
                { label: "Private Gala", value: "Private Gala" },
                { label: "Customs News", value: "Customs News" },
                { label: "Market Insights", value: "Market Insights" },
                { label: "Showroom Press", value: "Showroom Press" },
              ]}
              value={category}
              onChange={(val) => setCategory(String(val))}
            />
            <Input
              label="Author Name"
              placeholder="e.g. Chief Automotive Editor"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#0F172A]">Article Summary</label>
            <textarea
              rows={3}
              className="w-full bg-[#FFFFFF] border border-[#CBD5E1] rounded-md px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              placeholder="Summary of the article..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsArticleModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Publish Article
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 7: CREATE CAMPAIGN */}
      <Modal
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        title="Launch Multi-Channel Ad Campaign"
        size="md"
      >
        <form onSubmit={handleCreateCampaign} className="space-y-3">
          <Input
            label="Campaign Name"
            placeholder="e.g. Q4 2026 Maybach Executive Push"
            value={campName}
            onChange={(e) => setCampName(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Dropdown
              label="Advertising Channel"
              options={[
                { label: "Google Search Ads", value: "Google Search Ads" },
                { label: "Meta / Instagram Ads", value: "Meta / Instagram Ads" },
                { label: "Out-of-Home Billboards", value: "Out-of-Home Billboards" },
                { label: "Private Gala Exhibits", value: "Private Gala Exhibits" },
              ]}
              value={campChannel}
              onChange={(val) => setCampChannel(val as MarketingCampaign["channel"])}
            />
            <Input
              label="Allocated Budget (₦)"
              placeholder="e.g. 31,000,000"
              value={campBudget}
              onChange={(e) => setCampBudget(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsCampaignModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Launch Campaign
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
