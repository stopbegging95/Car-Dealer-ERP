"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiFileText,
  FiCalendar,
  FiArrowRight,
  FiEye,
  FiX,
} from "react-icons/fi";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button, Badge, Modal, Tabs } from "@/components/ui";
import { NEWS_ARTICLES, NewsArticle } from "@/data/news";

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeArticleModal, setActiveArticleModal] = useState<NewsArticle | null>(null);

  const filteredArticles =
    activeCategory === "all"
      ? NEWS_ARTICLES
      : NEWS_ARTICLES.filter((a) => a.category === activeCategory);

  const featuredArticle = NEWS_ARTICLES[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#2563EB] selection:text-[#FFFFFF]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header Block (Modern clean header, no forced banner) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-xs font-bold mb-2">
              <FiFileText className="w-3.5 h-3.5" />
              <span>Dealership Press & Editorial</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0F172A] uppercase tracking-tight">
              News, Events & Automotive Insights
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
              Stay informed on new showroom arrivals, exhibition galas, and automotive import updates.
            </p>
          </div>

          <Tabs
            variant="pills"
            activeTab={activeCategory}
            onChange={setActiveCategory}
            tabs={[
              { id: "all", label: "All Stories" },
              { id: "arrivals", label: "New Arrivals" },
              { id: "events", label: "Private Galas" },
              { id: "market", label: "Customs & Market" },
            ]}
          />
        </div>

        {/* Featured Article Card */}
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-12 gap-0 items-center">
          <div className="md:col-span-6 relative h-64 md:h-80 w-full bg-[#F1F5F9]">
            <Image
              src={featuredArticle.image}
              alt={featuredArticle.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized
              className="object-cover"
              priority
            />
            <div className="absolute top-3 left-3">
              <Badge variant="gold" size="sm">
                Featured Editorial
              </Badge>
            </div>
          </div>

          <div className="md:col-span-6 p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-3 text-xs text-[#64748B]">
              <span className="flex items-center gap-1">
                <FiCalendar className="w-3.5 h-3.5 text-[#2563EB]" />
                {featuredArticle.date}
              </span>
              <span>&bull;</span>
              <span>{featuredArticle.readTime}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] leading-snug">
              {featuredArticle.title}
            </h2>

            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              {featuredArticle.summary}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <Link href={`/news/${featuredArticle.slug}`}>
                <Button
                  variant="primary"
                  size="sm"
                  rightIcon={<FiArrowRight className="w-4 h-4 text-[#FFFFFF]" />}
                >
                  Read Full Story
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveArticleModal(featuredArticle)}
              >
                Quick Preview
              </Button>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              className="bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#2563EB] rounded-2xl overflow-hidden shadow-sm hover:shadow-md flex flex-col justify-between group transition-all"
            >
              <div>
                <div className="relative h-44 w-full bg-[#F1F5F9]">
                  <Image
                    src={art.image}
                    alt={art.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded bg-[#FFFFFF]/90 text-[#2563EB] font-mono text-[10px] font-bold border border-[#BFDBFE] shadow-xs">
                      {art.category.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
                    <FiCalendar className="w-3 h-3 text-[#2563EB]" />
                    <span>{art.date}</span>
                    <span>&bull;</span>
                    <span>{art.readTime}</span>
                  </div>

                  <h3 className="text-sm font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors line-clamp-2">
                    {art.title}
                  </h3>

                  <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed">
                    {art.summary}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center gap-2">
                <Link href={`/news/${art.slug}`} className="flex-1">
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    rightIcon={<FiArrowRight className="w-3.5 h-3.5 text-[#FFFFFF]" />}
                  >
                    Read
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveArticleModal(art)}
                  title="Quick Preview"
                >
                  <FiEye className="w-3.5 h-3.5 text-[#2563EB]" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Quick Article Preview Modal */}
      {activeArticleModal && (
        <Modal
          isOpen={Boolean(activeArticleModal)}
          onClose={() => setActiveArticleModal(null)}
          title={activeArticleModal.title}
          description={`Published on ${activeArticleModal.date} • ${activeArticleModal.readTime}`}
          size="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <Link href={`/news/${activeArticleModal.slug}`}>
                <Button
                  variant="primary"
                  size="sm"
                  rightIcon={<FiArrowRight className="w-3.5 h-3.5 text-white" />}
                >
                  Full Page View
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveArticleModal(null)}
                leftIcon={<FiX className="w-3.5 h-3.5" />}
              >
                Close Preview
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs sm:text-sm text-[#334155] leading-relaxed">
            <div className="relative h-56 w-full rounded-xl overflow-hidden bg-[#F1F5F9] border border-[#CBD5E1]">
              <Image
                src={activeArticleModal.image}
                alt={activeArticleModal.title}
                fill
                sizes="(max-width: 768px) 100vw, 700px"
                unoptimized
                className="object-cover"
              />
            </div>
            {activeArticleModal.content.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Modal>
      )}

      <Footer />
    </div>
  );
}
