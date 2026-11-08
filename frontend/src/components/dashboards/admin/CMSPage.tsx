"use client";

import React, { useState } from "react";
import {
  FiPlus,
  FiCheck,
  FiTrendingUp,
  FiDollarSign,
  FiTarget,
  FiShare2,
  FiFileText,
  FiGlobe,
} from "react-icons/fi";
import { Button, Input, Dropdown, Card, Modal, Badge, Table, KPICard } from "@/components/ui";

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
  const [activeTab, setActiveTab] = useState<"campaigns" | "articles">("campaigns");

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

  // Modal States
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);

  // Article Form State
  const [headline, setHeadline] = useState("");
  const [category, setCategory] = useState("Showroom Press");
  const [summary, setSummary] = useState("");
  const [author, setAuthor] = useState("Chief Automotive Editor");

  // Campaign Form State
  const [campName, setCampName] = useState("");
  const [campChannel, setCampChannel] = useState<MarketingCampaign["channel"]>("Google Search Ads");
  const [campBudget, setCampBudget] = useState("20,000");

  const handlePublishArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline) return;
    const newArticle: EditorialArticle = {
      id: `NEWS-00${articles.length + 1}`,
      title: headline,
      category,
      author,
      date: "Nov 08, 2026",
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
    const budgetNum = Number(campBudget.replace(/[^0-9]/g, "") || 20000);
    const newCamp: MarketingCampaign = {
      id: `CMP-2026-${String(campaigns.length + 5).padStart(2, "0")}`,
      name: campName,
      channel: campChannel,
      budgetUSD: budgetNum,
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
  const totalLeads = campaigns.reduce((acc, c) => acc + c.leadsGenerated, 0);

  return (
    <div className="space-y-4">
      {/* 1. Marketing Top Metrics Strip */}
      <div className="gap-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
        <KPICard
          title="Attributed Leads Generated"
          value={`${totalLeads} Leads`}
          change="Avg CPL ₦332,500"
          icon={<FiTarget className="w-5 h-5 text-[#2563EB]" />}
        />
        <KPICard
          title="Blended Marketing ROI"
          value="+2,580%"
          change="High Return on Ad Spend"
          icon={<FiShare2 className="w-5 h-5 text-emerald-600" />}
        />
      </div>

      {/* 2. Sub-Tabs Bar */}
      <Card className="shadow-xs p-3">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2">
          <div className="flex flex-wrap gap-1">
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

          <div className="flex items-center gap-2">
            {activeTab === "campaigns" ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsCampaignModalOpen(true)}
                leftIcon={<FiPlus className="w-3.5 h-3.5" />}
              >
                + Launch Campaign
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsArticleModalOpen(true)}
                leftIcon={<FiPlus className="w-3.5 h-3.5" />}
              >
                + Create Editorial
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* VIEW 1: Advertising Campaigns & Marketing ROI */}
      {activeTab === "campaigns" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div>
            <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
              Marketing Campaigns, Cost Per Lead (CPL) & Revenue Attribution
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Multi-channel ad performance across Google Ads, Meta, Out-of-Home digital billboards, and VIP private exhibits
            </p>
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
                header: "Budget / Spend (₦)",
                sortable: true,
                render: (c) => (
                  <span className="font-mono text-xs text-[#0F172A]">
                    ₦{(c.actualSpendUSD * 1550).toLocaleString()} / ₦{(c.budgetUSD * 1550).toLocaleString()}
                  </span>
                ),
              },
              {
                key: "leadsGenerated",
                header: "Leads & CPL",
                sortable: true,
                render: (c) => (
                  <div>
                    <span className="font-bold text-xs text-[#0F172A]">{c.leadsGenerated} Leads</span>
                    <span className="block font-mono text-[10px] text-[#64748B]">₦{(c.cplUSD * 1550).toFixed(0)} CPL</span>
                  </div>
                ),
              },
              {
                key: "salesClosed",
                header: "Closed Units",
                render: (c) => <span className="font-bold text-xs text-emerald-700">{c.salesClosed} Cars</span>,
              },
              {
                key: "revenueGeneratedUSD",
                header: "Attributed Revenue (₦)",
                sortable: true,
                render: (c) => (
                  <span className="font-mono font-bold text-[#1D4ED8] text-xs">
                    ₦{(c.revenueGeneratedUSD * 1550).toLocaleString()}
                  </span>
                ),
              },
              {
                key: "roiPct",
                header: "Marketing ROI",
                sortable: true,
                render: (c) => (
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-xs">
                    {c.roiPct}
                  </span>
                ),
              },
              {
                key: "status",
                header: "Status",
                render: (c) => <Badge variant="gold" size="sm">{c.status}</Badge>,
              },
            ]}
          />
        </Card>
      )}

      {/* VIEW 2: Editorial Articles */}
      {activeTab === "articles" && (
        <Card className="space-y-4 shadow-xs p-4 sm:p-5">
          <div>
            <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">
              Website Content & Press Releases
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Admin CMS console: public banners, featured vehicles & automotive press updates
            </p>
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

      {/* Modal: Launch Marketing Campaign */}
      <Modal
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        size="md"
        title="Launch New Marketing Campaign"
        description="Configure advertising channel, target budget, and tracking attribution."
      >
        <form onSubmit={handleCreateCampaign} className="space-y-3">
          <Input
            label="Campaign Name"
            placeholder="e.g. Q4 2026 SUV Fleet Drive"
            value={campName}
            onChange={(e) => setCampName(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Dropdown
              label="Advertising Channel"
              value={campChannel}
              onChange={(val) => setCampChannel(val as any)}
              options={[
                { label: "Google Search Ads", value: "Google Search Ads" },
                { label: "Meta / Instagram Ads", value: "Meta / Instagram Ads" },
                { label: "Out-of-Home Billboards", value: "Out-of-Home Billboards" },
                { label: "Private Gala Exhibits", value: "Private Gala Exhibits" },
              ]}
            />
            <Input
              label="Allocated Budget (₦ NGN)"
              placeholder="31,000,000"
              value={campBudget}
              onChange={(e) => setCampBudget(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsCampaignModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" leftIcon={<FiCheck />}>
              Launch Campaign
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Publish Editorial Article */}
      <Modal
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
        size="md"
        title="Publish New Editorial / Press Release"
      >
        <form onSubmit={handlePublishArticle} className="space-y-3">
          <Input
            label="Article Title & Headline"
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
                { label: "Private Gala Exhibitions", value: "Private Gala" },
                { label: "Customs & Import Regulations", value: "Customs News" },
                { label: "Market Insights", value: "Market Insights" },
              ]}
              value={category}
              onChange={(val) => setCategory(String(val))}
            />
            <Input
              label="Author / Press Desk"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
          <Input
            label="Executive Summary"
            placeholder="Brief 1-2 sentence synopsis for public preview card..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsArticleModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" leftIcon={<FiCheck />}>
              Publish Editorial
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
