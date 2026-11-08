"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import { Button } from "./Button";

export interface PageBannerProps {
  badge?: string;
  badgeIcon?: React.ReactNode;
  title: string;
  titleHighlight?: string;
  subtitle: string;
  backgroundImage?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  stats?: Array<{ label: string; value: string }>;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  onCtaClick?: () => void;
  onSecondaryCtaClick?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

export const PageBanner: React.FC<PageBannerProps> = ({
  badge,
  badgeIcon,
  title,
  titleHighlight,
  subtitle,
  backgroundImage = "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1920&q=80",
  breadcrumbs,
  stats,
  ctaText,
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
  onCtaClick,
  onSecondaryCtaClick,
  actions,
  className = "",
}) => {
  return (
    <div
      className={`relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[#CBD5E1] bg-[#0F172A] shadow-lg ${className}`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt={title}
          fill
          priority
          sizes="100vw"
          unoptimized
          className="object-cover object-center"
        />
        {/* Dark Luxury Gradient Overlays for optimal text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/95 via-[#0F172A]/80 to-[#0F172A]/40 sm:w-4/5 md:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/85 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/30 via-transparent to-transparent" />
      </div>

      {/* Banner Content */}
      <div className="relative z-10 flex flex-col justify-between p-6 sm:p-10 md:p-12 min-h-[240px] sm:min-h-[280px] md:min-h-[320px]">
        {/* Top Strip: Breadcrumbs & Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {breadcrumbs && breadcrumbs.length > 0 ? (
            <nav className="flex items-center gap-1.5 text-xs text-[#94A3B8] font-medium">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              {breadcrumbs.map((b, idx) => (
                <React.Fragment key={idx}>
                  <FiChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
                  {b.href ? (
                    <Link href={b.href} className="hover:text-white transition-colors">
                      {b.label}
                    </Link>
                  ) : (
                    <span className="text-[#60A5FA] font-semibold">{b.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          ) : <div />}

          {badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/30 backdrop-blur-md border border-[#BFDBFE]/30 text-white w-fit">
              {badgeIcon ? badgeIcon : <span className="w-2 h-2 rounded-full bg-[#60A5FA] animate-pulse" />}
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#EFF6FF]">
                {badge}
              </span>
            </div>
          )}
        </div>

        {/* Center: Title & Subtitle */}
        <div className="space-y-2.5 max-w-2xl py-3">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight text-white drop-shadow-sm">
            {title}{" "}
            {titleHighlight && (
              <span className="bg-gradient-to-r from-[#60A5FA] via-[#93C5FD] to-[#FFFFFF] bg-clip-text text-transparent">
                {titleHighlight}
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#CBD5E1] leading-relaxed max-w-xl drop-shadow">
            {subtitle}
          </p>
        </div>

        {/* Bottom Strip: Stats & CTAs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10">
          {stats && stats.length > 0 ? (
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
              {stats.map((s, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white text-sm sm:text-base">
                    {s.value}
                  </span>
                  <span className="text-[#94A3B8] text-[11px] sm:text-xs">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          ) : <div />}

          {actions ? (
            <div className="flex items-center gap-2.5">
              {actions}
            </div>
          ) : (ctaText || secondaryCtaText) ? (
            <div className="flex items-center gap-2.5">
              {secondaryCtaText && (
                secondaryCtaHref ? (
                  <Link href={secondaryCtaHref}>
                    <Button variant="secondary" size="sm">
                      {secondaryCtaText}
                    </Button>
                  </Link>
                ) : (
                  <Button variant="secondary" size="sm" onClick={onSecondaryCtaClick}>
                    {secondaryCtaText}
                  </Button>
                )
              )}

              {ctaText && (
                ctaHref ? (
                  <Link href={ctaHref}>
                    <Button variant="primary" size="sm">
                      {ctaText}
                    </Button>
                  </Link>
                ) : (
                  <Button variant="primary" size="sm" onClick={onCtaClick}>
                    {ctaText}
                  </Button>
                )
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
