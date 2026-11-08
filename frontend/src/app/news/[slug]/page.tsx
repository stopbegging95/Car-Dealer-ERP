"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiUser,
  FiShare2,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button, Badge, VehicleCard } from "@/components/ui";
import { NEWS_ARTICLES, NewsArticle } from "@/data/news";
import { VEHICLES } from "@/data/vehicles";

function NewsArticleDetailContent() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";

  const [isCopied, setIsCopied] = useState(false);

  const article: NewsArticle = useMemo(() => {
    return (
      NEWS_ARTICLES.find((a) => a.slug === slug || a.id === slug) ||
      NEWS_ARTICLES[0]
    );
  }, [slug]);

  // Related inventory matching luxury segment
  const relatedVehicles = useMemo(() => {
    return VEHICLES.slice(0, 3);
  }, []);

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  return (
    <div className="flex flex-col bg-[#F8FAFC] selection:bg-[#2563EB] min-h-screen font-sans text-[#0F172A] selection:text-[#FFFFFF]">
      <Navbar />

      <main className="flex-1 space-y-8 mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full max-w-5xl">
        {/* Back Link & Actions */}
        <div className="flex justify-between items-center gap-4">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 font-semibold text-[#64748B] hover:text-[#2563EB] text-xs transition-colors"
          >
            <FiArrowLeft className="w-4 h-4 text-[#2563EB]" />
            <span>Back to All News & Releases</span>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            leftIcon={isCopied ? <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <FiShare2 className="w-3.5 h-3.5 text-[#2563EB]" />}
          >
            {isCopied ? "Link Copied" : "Share Release"}
          </Button>
        </div>

        {/* Article Header (Clean, elegant, no forced banner) */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="gold" size="sm">
              {article.category.toUpperCase()}
            </Badge>
            <span className="flex items-center gap-1.5 text-[#64748B] text-xs">
              <FiCalendar className="w-3.5 h-3.5 text-[#2563EB]" />
              {article.date}
            </span>
            <span className="text-[#CBD5E1]">&bull;</span>
            <span className="flex items-center gap-1.5 text-[#64748B] text-xs">
              <FiClock className="w-3.5 h-3.5 text-[#2563EB]" />
              {article.readTime}
            </span>
            <span className="text-[#CBD5E1]">&bull;</span>
            <span className="flex items-center gap-1.5 text-[#64748B] text-xs">
              <FiUser className="w-3.5 h-3.5 text-[#2563EB]" />
              {article.author}
            </span>
          </div>

          <h1 className="font-black text-[#0F172A] text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase leading-tight tracking-tight">
            {article.title}
          </h1>

          <p className="max-w-3xl font-medium text-[#475569] text-sm sm:text-base leading-relaxed">
            {article.summary}
          </p>
        </div>

        {/* Main High-Res Editorial Photography */}
        <div className="relative bg-[#000000] shadow-xl border border-white/10 rounded-2xl w-full h-72 sm:h-96 md:h-[440px] overflow-hidden">
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            unoptimized
            priority
            className="object-center object-cover"
          />
        </div>

        {/* Article Body Content & Highlights */}
        <div className="gap-8 grid grid-cols-1 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-8 text-[#334155] text-sm sm:text-base leading-relaxed">
            {article.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            {/* Key Highlights Callout */}
            <div className="space-y-3.5 bg-[#FFFFFF] shadow-sm p-5 sm:p-6 border border-[#CBD5E1] rounded-2xl">
              <h3 className="font-bold text-[#2563EB] text-xs sm:text-sm uppercase tracking-wider">
                Executive Summary & Specifications
              </h3>
              <ul className="space-y-2">
                {article.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[#0F172A] text-xs sm:text-sm">
                    <FiCheckCircle className="mt-0.5 w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Secondary Image Gallery */}
            <div className="space-y-3 pt-4">
              <h4 className="font-bold text-[#64748B] text-xs uppercase tracking-wider">
                Release Photo Gallery
              </h4>
              <div className="gap-3 grid grid-cols-1 sm:grid-cols-3">
                {article.gallery.map((img, gi) => (
                  <div
                    key={gi}
                    className="relative bg-[#0F172A] shadow-sm border border-white/10 rounded-xl h-40 overflow-hidden"
                  >
                    <Image
                      src={img}
                      alt={`Gallery view ${gi + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      unoptimized
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Info & Inquiries */}
          <div className="space-y-6 lg:col-span-4">
            <div className="space-y-4 bg-[#FFFFFF] shadow-sm p-5 border border-[#E2E8F0] rounded-2xl">
              <h4 className="font-bold text-[#0F172A] text-sm">Private Showroom Inquiries</h4>
              <p className="text-[#64748B] text-xs leading-relaxed">
                Connect with our acquisitions desk regarding vehicles mentioned in this editorial.
              </p>
              <div className="space-y-2">
                <Link href="/contact">
                  <Button variant="primary" size="sm" fullWidth>
                    Contact Concierge
                  </Button>
                </Link>
                <Link href="/services/auto-brokers">
                  <Button variant="outline" size="sm" fullWidth>
                    Source Similar Model
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-3 bg-[#0F172A] shadow-md p-5 rounded-2xl text-[#FFFFFF]">
              <span className="font-mono font-bold text-[#38BDF8] text-[10px] uppercase tracking-wider">
                VIP Access
              </span>
              <h4 className="font-black text-base">Join Private Collectors Club</h4>
              <p className="text-[#CBD5E1] text-xs leading-relaxed">
                Receive confidential notifications 48 hours prior to public container discharge announcements.
              </p>
              <Link href="/auth/register">
                <Button variant="primary" size="sm" fullWidth>
                  Register Account
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Related Showroom Inventory */}
        <section className="space-y-6 pt-8 border-[#E2E8F0] border-t">
          <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2">
            <div>
              <span className="font-bold text-[#2563EB] text-xs uppercase tracking-wider">
                Current Dealership Stock
              </span>
              <h3 className="font-black text-[#0F172A] text-xl sm:text-2xl uppercase tracking-tight">
                Related Luxury Vehicles
              </h3>
            </div>
            <Link href="/inventory">
              <Button
                variant="outline"
                size="sm"
                rightIcon={<FiArrowRight className="w-3.5 h-3.5 text-[#2563EB]" />}
              >
                View Full Inventory
              </Button>
            </Link>
          </div>

          <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {relatedVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.stockId} vehicle={vehicle} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function NewsArticleDetailPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]" />}>
      <NewsArticleDetailContent />
    </React.Suspense>
  );
}

