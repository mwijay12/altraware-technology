"use client";

import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TimelineContent } from "@/components/ui/timeline-animation";
import NumberFlow from "@number-flow/react";
import {
  Briefcase,
  CheckCheck,
  Database,
  Server,
  Globe,
  Smartphone,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { CurrencyToggle, tzsToUsd, useVisitorCurrency } from "@/lib/geo-pricing";

interface PlanItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  discountPrice?: number;
  badge?: string;
  popular?: boolean;
  features: { text: string; icon: React.ReactNode }[];
  includes: string[];
  ctaText: string;
  ctaHref: string;
}

const websitePlans: PlanItem[] = [
  {
    id: "starter",
    name: "Web Starter",
    subtitle: "Retail Shops & Emerging Ventures",
    description: "Clean, high-impact web presence engineered to turn visitors into direct calls and WhatsApp leads.",
    price: 350000,
    features: [
      { text: "Modern Mobile-First Layout (1–3 Sections)", icon: <Globe size={18} /> },
      { text: "Direct WhatsApp & Instant Phone Triggers", icon: <Zap size={18} /> },
      { text: "Optimized for 3G Mobile Networks (< 1.5s Load)", icon: <Smartphone size={18} /> },
      { text: ".co.tz / .com Domain & 1-Year Cloud Hosting", icon: <Server size={18} /> },
    ],
    includes: [
      "Includes Complimentary:",
      "Written agreement with fixed pricing guarantee",
      "Hands-on admin walkthrough session",
      "1-Month post-launch engineering support",
    ],
    ctaText: "Choose Web Starter",
    ctaHref: "/contact?package=web-starter",
  },
  {
    id: "growth",
    name: "Growth Business",
    subtitle: "Established Brands & Showcases",
    description: "Comprehensive multi-page website with product/service catalog, quote inquiry flows, and local Google SEO.",
    price: 550000,
    popular: true,
    badge: "Most Popular",
    features: [
      { text: "Product / Service Showcase with Visual Galleries", icon: <Briefcase size={18} /> },
      { text: "Instant WhatsApp Order & Quote Triggers", icon: <Zap size={18} /> },
      { text: "Google Business & Local Maps SEO Indexing", icon: <Globe size={18} /> },
      { text: "Branded Business Emails (info@company.co.tz)", icon: <Server size={18} /> },
    ],
    includes: [
      "Everything in Starter, plus:",
      "Simple content manager to update text and photos",
      "Visitor traffic and conversion analytics",
      "3-Month priority engineering support",
    ],
    ctaText: "Start Growth Site",
    ctaHref: "/contact?package=growth-site",
  },
  {
    id: "pro",
    name: "Pro Portal",
    subtitle: "Institutions, Portals & High-Traffic Brands",
    description: "Custom-crafted web application with client portals, dynamic database forms, and enterprise performance.",
    price: 750000,
    features: [
      { text: "Custom Bespoke Visual Brand Identity Design", icon: <Globe size={18} /> },
      { text: "Multi-Language Ready (English & Swahili)", icon: <ShieldCheck size={18} /> },
      { text: "Client Portal & Custom Database Inquiries", icon: <Database size={18} /> },
      { text: "95+ Lighthouse Score & Enterprise SSL", icon: <Server size={18} /> },
    ],
    includes: [
      "Everything in Growth, plus:",
      "API readiness & payment webhooks",
      "Formal written SLA agreement",
      "6-Month extended warranty",
    ],
    ctaText: "Choose Pro Portal",
    ctaHref: "/contact?package=pro-portal",
  },
];

const systemPlans: PlanItem[] = [
  {
    id: "webapp",
    name: "Custom App Starter",
    subtitle: "Operations & Mobile/Web Apps",
    description: "Custom operational app to manage inventory, customer orders, team approvals, and daily workflows.",
    price: 800000,
    features: [
      { text: "Centralized Management Dashboard & Admin Portal", icon: <Database size={18} /> },
      { text: "Role-Based Access Control (Admin, Manager, Staff)", icon: <ShieldCheck size={18} /> },
      { text: "Automated Daily & Monthly Excel / PDF Exports", icon: <Server size={18} /> },
      { text: "Responsive across desktop, tablets, and phones", icon: <Smartphone size={18} /> },
    ],
    includes: [
      "Includes Complimentary:",
      "Secure cloud architecture with automated backups",
      "On-site staff onboarding & training session",
      "3-Month dedicated technical support",
    ],
    ctaText: "Inquire for Custom App",
    ctaHref: "/contact?package=custom-app",
  },
  {
    id: "faidapos",
    name: "Faida POS / Mobile App",
    subtitle: "Retail Stores, Supermarkets & Field Teams",
    description: "Native cross-platform mobile app: Flutter Android APK & Web App, 100% offline-ready with thermal receipts.",
    price: 1500000,
    popular: true,
    badge: "Production Proven",
    features: [
      { text: "Native Android APK via Flutter + Web Admin Portal", icon: <Smartphone size={18} /> },
      { text: "100% Offline-First SQLite with Cloud Sync", icon: <Zap size={18} /> },
      { text: "Thermal Printer & Bluetooth Receipt Printing", icon: <Briefcase size={18} /> },
      { text: "Smart Stock Alarms & Low Inventory Tracking", icon: <Database size={18} /> },
    ],
    includes: [
      "Everything in Web App, plus:",
      "Android APK tested on real 2G/3G networks",
      "On-site device setup & printer calibration",
      "Regular software upgrades and maintenance",
    ],
    ctaText: "Get Mobile App / POS",
    ctaHref: "/platforms",
  },
  {
    id: "caretrack",
    name: "CareTrack / Enterprise ERP",
    subtitle: "Clinics, Health Centres & Community Homes",
    description: "Full-scale institutional platform: patient/child profiles, attendance, caregiver logs, and paperless workflows.",
    price: 3500000,
    features: [
      { text: "Reception, Care Profiles, Staff & Inventory Modules", icon: <ShieldCheck size={18} /> },
      { text: "Medication & Stock Expiry Notification Alarms", icon: <Database size={18} /> },
      { text: "Encrypted Records & Role-Based Permissions", icon: <Server size={18} /> },
      { text: "Automated Monthly Regulatory & Donor Reports", icon: <Globe size={18} /> },
    ],
    includes: [
      "Enterprise Institutional Delivery:",
      "Secure Cloud or On-Premise Local Server Deployment",
      "Data privacy NDA & data sovereignty compliance",
      "6-Month written SLA guarantee & dedicated support",
    ],
    ctaText: "Consult an Engineer",
    ctaHref: "/contact?package=caretrack",
  },
];

interface PricingSwitchProps {
  category: "websites" | "systems";
  onChangeCategory: (cat: "websites" | "systems") => void;
}

const CategorySwitch = ({ category, onChangeCategory }: PricingSwitchProps) => {
  return (
    <div className="flex justify-center">
      <div className="relative z-20 mx-auto flex w-fit rounded-full bg-deep/8 p-1.5 border border-deep/15 shadow-sm">
        <button
          onClick={() => onChangeCategory("websites")}
          className={`relative z-10 w-fit sm:h-12 h-10 rounded-full sm:px-8 px-4 sm:py-2 py-1 text-sm sm:text-base font-bold transition-colors ${
            category === "websites"
              ? "text-white"
              : "text-deep/70 hover:text-deep"
          }`}
        >
          {category === "websites" && (
            <motion.span
              layoutId="pricingCategorySwitch"
              className="absolute inset-0 rounded-full bg-viol shadow-md shadow-viol/30"
              transition={{ type: "spring", stiffness: 500, damping: 32 }}
            />
          )}
          <span className="relative flex items-center gap-2">
            <Globe className="w-4 h-4" /> Websites & Portals
          </span>
        </button>

        <button
          onClick={() => onChangeCategory("systems")}
          className={`relative z-10 w-fit sm:h-12 h-10 rounded-full sm:px-8 px-4 sm:py-2 py-1 text-sm sm:text-base font-bold transition-colors ${
            category === "systems"
              ? "text-white"
              : "text-deep/70 hover:text-deep"
          }`}
        >
          {category === "systems" && (
            <motion.span
              layoutId="pricingCategorySwitch"
              className="absolute inset-0 rounded-full bg-deep shadow-md shadow-deep/30"
              transition={{ type: "spring", stiffness: 500, damping: 32 }}
            />
          )}
          <span className="relative flex items-center gap-2">
            <Database className="w-4 h-4" /> Apps & Business Systems
          </span>
        </button>
      </div>
    </div>
  );
};

export default function PricingSection() {
  const [category, setCategory] = useState<"websites" | "systems">("websites");
  const pricingRef = useRef<HTMLDivElement>(null);
  const geo = useVisitorCurrency();

  const activePlans = category === "websites" ? websitePlans : systemPlans;

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.15,
        duration: 0.45,
      },
    }),
    hidden: {
      filter: "blur(6px)",
      y: -15,
      opacity: 0,
    },
  };

  return (
    <div
      className="px-5 py-24 min-h-screen mx-auto relative bg-[#fdfcf9] border-t border-line overflow-hidden"
      ref={pricingRef}
      id="pricing-section"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-0 left-[15%] right-[15%] w-[70%] h-[500px] pointer-events-none z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(124,58,237,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="text-center mb-10 max-w-3xl mx-auto relative z-10">
        <TimelineContent
          as="div"
          animationNum={0}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-viol/10 text-viol font-grotesk text-xs font-bold tracking-widest uppercase mb-4 border border-viol/20"
        >
          <Sparkles className="w-3.5 h-3.5" /> FIXED PACKAGES · CLEAR ROADMAPS
        </TimelineContent>

        <TimelineContent
          as="h2"
          animationNum={1}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="display text-4xl sm:text-5xl md:text-6xl font-medium text-deep leading-[1.05] mb-5"
        >
          Transparent software pricing,{" "}
          <span className="font-serif italic text-viol underline decoration-viol/30 decoration-wavy">
            without excuses.
          </span>
        </TimelineContent>

        <TimelineContent
          as="p"
          animationNum={2}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="text-base sm:text-lg text-deep/70 sm:w-[85%] mx-auto leading-relaxed"
        >
          Choose the package suited for your stage of growth. Every engagement includes a written agreement, concrete delivery milestones, and complete source code handover from Dar es Salaam.
        </TimelineContent>
      </div>

      <TimelineContent
        as="div"
        animationNum={3}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="relative z-10 mb-12 space-y-4"
      >
        <CategorySwitch category={category} onChangeCategory={setCategory} />
        <CurrencyToggle pricing={geo} />
      </TimelineContent>

      <div className="grid md:grid-cols-3 max-w-7xl gap-6 mx-auto relative z-10">
        {activePlans.map((plan, index) => (
          <TimelineContent
            key={plan.id}
            as="div"
            animationNum={4 + index}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <Card
              className={`relative h-full flex flex-col transition-all duration-300 hover:shadow-xl border-2 ${
                plan.popular
                  ? "border-viol ring-4 ring-viol/10 bg-white shadow-lg"
                  : "border-deep/10 bg-white hover:border-deep/20"
              }`}
            >
              <CardHeader className="text-left pb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-2xl font-bold text-deep font-grotesk tracking-tight">
                    {plan.name}
                  </h3>
                  {plan.popular && (
                    <span className="bg-viol text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm">
                      {plan.badge || "Popular"}
                    </span>
                  )}
                </div>
                <div className="text-xs font-semibold text-viol mb-2 font-grotesk uppercase tracking-wider">
                  {plan.subtitle}
                </div>
                <p className="text-sm text-deep/65 mb-4 min-h-[40px] leading-relaxed">
                  {plan.description}
                </p>
                <div className="flex items-baseline pt-2 border-t border-deep/10">
                  <span className="text-xs font-bold text-deep/60 mr-1.5 font-grotesk">
                    {geo.symbol}
                  </span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-deep font-grotesk tracking-tight">
                    <NumberFlow
                      value={geo.currency === "USD" ? tzsToUsd(plan.price) : plan.price}
                      format={{ useGrouping: true }}
                      className="text-3xl sm:text-4xl font-extrabold"
                    />
                  </span>
                  <span className="text-deep/50 text-xs ml-2 font-medium">
                    / fixed quote
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-2 flex-1 flex flex-col justify-between">
                <div>
                  <a
                    href={plan.ctaHref}
                    className={`w-full py-3.5 px-5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 ${
                      plan.popular
                        ? "bg-viol hover:bg-violD text-white shadow-md shadow-viol/30"
                        : "bg-deep hover:bg-deep2 text-white shadow-md shadow-deep/20"
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <ul className="space-y-3 font-medium py-6 border-b border-deep/10 text-sm">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-deep/85">
                        <span className="text-viol grid place-content-center mt-0.5 mr-3 shrink-0">
                          {feature.icon}
                        </span>
                        <span className="leading-snug">{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2.5 pt-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-deep/70">
                    {plan.includes[0]}
                  </h4>
                  <ul className="space-y-2 text-xs font-medium text-deep/65">
                    {plan.includes.slice(1).map((inc, incIndex) => (
                      <li key={incIndex} className="flex items-center">
                        <span className="h-4 w-4 bg-green-50 border border-green-500 rounded-full grid place-content-center mr-2.5 shrink-0 text-green-600">
                          <CheckCheck className="h-3 w-3" />
                        </span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TimelineContent>
        ))}
      </div>

      {/* Trust reassurance banner */}
      <div className="max-w-4xl mx-auto mt-16 p-6 rounded-2xl bg-white border border-deep/10 shadow-sm text-center relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <div className="font-bold text-deep text-base">Je, unahitaji mfumo maalum au msaada wa kuchagua?</div>
          <div className="text-xs text-deep/60 mt-0.5">Wasiliana na wahandisi wetu Clemence & David kwa ushauri wa bure wa kiufundi.</div>
        </div>
        <a
          href="https://wa.me/255760224853?text=Habari%20Altraware,%20nahitaji%20ushauri%20kuhusu%20mfumo/tovuti"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-5 py-2.5 rounded-full font-bold text-xs shrink-0 transition-all shadow-sm"
        >
          <i className="fa-brands fa-whatsapp text-sm" /> Ongea Nasi WhatsApp
        </a>
      </div>
    </div>
  );
}
