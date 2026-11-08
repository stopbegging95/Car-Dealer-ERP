"use client";

import React, { useState } from "react";
import { FiPlus, FiCheck } from "react-icons/fi";
import { Button, Input, Dropdown, Card, Modal } from "@/components/ui";

export interface CMSPageProps {
  showToast: (msg: string) => void;
}

export const CMSPage: React.FC<CMSPageProps> = ({ showToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [headline, setHeadline] = useState("");
  const [category, setCategory] = useState("Showroom Press");
  const [summary, setSummary] = useState("");
  const [author, setAuthor] = useState("Chief Automotive Editor");

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline) return;
    setIsModalOpen(false);
    showToast(`Published article "${headline}" to public news editorial.`);
    setHeadline("");
    setSummary("");
  };

  return (
    <div className="space-y-4">
      <Card className="space-y-3 shadow-xs p-4 sm:p-5">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 pb-2.5 border-b border-[#E2E8F0]">
          <div>
            <h3 className="font-bold text-[#2563EB] text-sm uppercase tracking-wider">Website Content & Promotions Manager</h3>
            <p className="text-[11px] text-[#64748B]">Admin CMS console: public banners, featured vehicles & automotive press updates</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<FiPlus className="w-3.5 h-3.5" />}
          >
            + Create Editorial Dispatch
          </Button>
        </div>

        {/* Modal for Publishing Announcement */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Publish New Editorial / Press Release"
          size="md"
        >
          <form onSubmit={handlePublish} className="space-y-3">
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
              <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" leftIcon={<FiCheck />}>
                Publish to Live Newsfeed
              </Button>
            </div>
          </form>
        </Modal>

        <div className="gap-3 grid grid-cols-1 sm:grid-cols-3 text-xs">
          <div className="space-y-2 bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
            <span className="block font-bold text-[#0F172A]">Homepage Hero Headline</span>
            <Input defaultValue="DRIVE YOUR DREAM CAR" />
            <Button variant="primary" size="sm" onClick={() => showToast("Hero headline updated successfully!")}>
              Update Hero
            </Button>
          </div>
          <div className="space-y-2 bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
            <span className="block font-bold text-[#0F172A]">Featured Showcase Cars</span>
            <Dropdown
              label="Pinned Vehicle"
              options={[
                { label: "Mercedes Maybach S580", value: "STK-2026-001" },
                { label: "Porsche 911 Turbo S", value: "STK-2026-002" },
              ]}
              onChange={() => {}}
            />
            <Button variant="outline" size="sm" onClick={() => showToast("Vehicle pinned to public featured showcase.")}>
              Pin to Featured
            </Button>
          </div>
          <div className="space-y-2 bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-md">
            <span className="block font-bold text-[#0F172A]">Editorial Bureau Control</span>
            <p className="text-[#64748B] text-[11px]">Direct sync with public /news editorial dispatches and event calendar.</p>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
              Draft Press Release
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

