/* ============================================================
   Altraware site content model.
   All site copy, pricing, blog posts and image URLs live here.
   Storage strategy (v1): defaults merged with localStorage
   overrides (written by /admin). Later: swap `loadOverrides`
   and `saveOverrides` with Firebase Firestore/Firestore-lite
   calls — every component reads through ContentProvider, so
   nothing else changes. Images are plain URLs: swap with
   Cloudinary delivery URLs when connected.
   ============================================================ */

export type Lang = "en" | "sw";

export interface Money {
  tsh: number; // Tanzanian Shillings
}

export interface PricingPackage {
  id: string;
  name: string;
  nameSw?: string;
  tagline: string;
  price: number | "custom";
  priceUnit?: string; // e.g. "one-time" | "/mo"
  durationWeeks: [number, number];
  features: string[];
  featured?: boolean;
}

export interface EstimatorConfig {
  types: { id: string; label: string; icon: string; base: number }[];
  features: { id: string; label: string; cost: number; note?: string }[];
  vatPercent: number;
  contingencyPercent: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover: string;
  date: string; // ISO
  author: string;
  tags: string[];
  body: string[]; // paragraphs
  published: boolean;
}

export interface ProjectMediaItem {
  type: "image" | "video";
  url: string;
  caption: string;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  url: string;
  category: string;
  year: string;
  description: string;
  tags: string[];
  media: ProjectMediaItem[];
  featured?: boolean;
}

export interface SiteContent {
  hero: {
    badge: string;
    eyebrow: string;
    titleLine1: { text: string; accent: boolean }[];
    titleLine2: { text: string; accent: boolean }[];
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    image: string;
    imageCaption: string;
    heroVideo: string;
    stats: { value: string; label: string }[];
  };
  about: {
    shortDescription: string;
    longIntro: string;
    areas: { title: string; description: string; icon: string }[];
    founders: { name: string; role: string; bio: string; photo: string }[];
    values: { title: string; body: string; icon: string }[];
    whoWeServe: string;
    whyAltraware: { title: string; body: string }[];
  };
  services: {
    id: string;
    num: string;
    title: string;
    titleSw?: string;
    subtitle: string;
    icon: string;
    accent?: string;
    tags: string[];
    description: string;
    highlights: { title: string; body: string; proof: string; icon?: string }[];
    previewImage?: string;
    startingPrice?: number;
    media?: ProjectMediaItem[];
  }[];
  platforms: {
    id: string;
    name: string;
    audience: string;
    tagline: string;
    description: string;
    features: string[];
    color: "deep" | "white";
    stats: { value: string; label: string }[];
    webUrl?: string;
    repoUrl?: string;
    apkUrl?: string;
  }[];
  projects: Project[];
  legal: {
    privacy: { updated: string; intro: string; sections: { title: string; body: string }[] };
    terms: { updated: string; intro: string; sections: { title: string; body: string }[] };
    companyDetails: {
      legalName: string;
      email: string;
      phonePrimary: string;
      phoneSecondary: string;
      address: string;
      registration: string;
    };
  };
  processPhases: {
    num: string;
    title: string;
    titleSw: string;
    weeks: string;
    body: string;
    deliverables: string[];
  }[];
  impact: {
    stats: { value: number; suffix: string; label: string }[];
    testimonials: { quote: string; name: string; role: string; color: string }[];
    sectors: { label: string; image: string }[];
  };
  pricing: {
    intro: string;
    packages: PricingPackage[];
    supportPlans: { id: string; name: string; nameSw: string; price: number | "custom"; unit: string; features: string[]; popular?: boolean }[];
    estimator: EstimatorConfig;
    faqs: { q: string; a: string }[];
  };
  contact: {
    phone: string;
    phoneAlt: string;
    whatsapp: string;
    email: string;
    address: string;
    hours: string;
  };
  blog: {
    intro: string;
    posts: BlogPost[];
  };
  images: Record<string, string>; // named image registry (admin-editable, Cloudinary-ready)
}

/* ================= DEFAULT CONTENT (from reference HTML) ================= */

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    badge: "Tanzanian software studio — websites, apps & systems",
    eyebrow: "Act I — Mizizi · Roots",
    titleLine1: [
      { text: "Mizizi ya ", accent: false },
      { text: "nyumbani.", accent: true },
    ],
    titleLine2: [
      { text: "Ufundi wa ", accent: false },
      { text: "kidunia.", accent: true },
    ],
    subtitle:
      "Rooted at home. Engineered for the world. We design fast, mobile-first websites, apps and business systems — in Kiswahili and English, with M-Pesa at the core and support that stays.",
    primaryCta: "Start your project",
    secondaryCta: "See Faida POS live",
    image: "https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?q=80&w=900&auto=format&fit=crop",
    imageCaption: "Dar es Salaam",
    heroVideo: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    stats: [
      { value: "6.7924° S, 39.2083° E", label: "Dar es Salaam" },
      { value: "Offline-first", label: "2G ready" },
    ],
  },
  about: {
    shortDescription:
      "Altraware Technologies is a Tanzanian software company based in Dar es Salaam. We design and build websites, web and mobile apps, and management systems for small businesses, schools, care centres and NGOs. We combine local understanding — including mobile payments and Kiswahili — with modern engineering and practical, long-term support.",
    longIntro:
      "We help organisations move from paper, spreadsheets and scattered tools to reliable digital systems. Founded by David Mwijage and Clemence Ng'unda, we build with data privacy in mind, work in clear phases with written agreements, and stay with our clients after launch through maintenance and support plans.",
    areas: [
      {
        title: "Websites",
        icon: "fa-globe",
        description:
          "Fast, mobile-first sites in Kiswahili and English that help businesses be found and contacted — from simple landing pages to full business sites with booking or ordering.",
      },
      {
        title: "Apps",
        icon: "fa-mobile-screen-button",
        description:
          "Web and mobile applications built to fit how our clients actually work.",
      },
      {
        title: "Business systems",
        icon: "fa-layer-group",
        description:
          "Purpose-built platforms such as Faida POS for retail and CareTrack for care centres, designed to work well where connectivity and resources are limited.",
      },
    ],
    founders: [
      {
        name: "David Mwijage",
        role: "Co-founder · Engineering & Architecture",
        bio: "Leads system architecture, core engineering practice and offline-first product development.",
        photo: "https://res.cloudinary.com/oc8018um/image/upload/v1791497527/david.jpg",
      },
      {
        name: "Clemence Ng'unda",
        role: "Co-founder · Product & Business Operations",
        bio: "Leads client engagement, product direction and operational delivery for businesses.",
        photo: "https://res.cloudinary.com/oc8018um/image/upload/v1791497528/Clemence.png",
      },
    ],
    values: [
      {
        title: "Local insight",
        icon: "fa-location-dot",
        body: "Mobile money, Kiswahili and the realities our clients work in.",
      },
      {
        title: "Clear process",
        icon: "fa-file-signature",
        body: "Fixed packages, defined timelines and written agreements.",
      },
      {
        title: "Long-term support",
        icon: "fa-handshake",
        body: "Hosting, updates and maintenance after delivery.",
      },
      {
        title: "Privacy-minded engineering",
        icon: "fa-shield-halved",
        body: "We collect only the data a system genuinely needs.",
      },
    ],
    whoWeServe:
      "Small and medium businesses, schools, clinics, care centres, NGOs and contractors in Tanzania — with growing work for clients elsewhere in East Africa and internationally.",
    whyAltraware: [
      { title: "Local insight", body: "Mobile money, Kiswahili and the realities our clients work in." },
      { title: "Clear process", body: "Fixed packages, defined timelines and written agreements." },
      { title: "Long-term support", body: "Hosting, updates and maintenance after delivery." },
      { title: "Privacy-minded engineering", body: "We collect only the data a system genuinely needs." },
    ],
  },
  services: [
    {
      id: "websites",
      num: "01",
      title: "Websites",
      titleSw: "Tovuti",
      subtitle: "Fast, mobile-first sites in Kiswahili & English",
      icon: "fa-globe",
      tags: ["SEO", "BOOKING", "M-PESA"],
      description:
        "Be found. Be contacted. Be trusted. We build landing pages to full business sites with booking, ordering, catalogues and WhatsApp integration — optimised to load in under 2 seconds on Tanzanian networks.",
      highlights: [
        { icon: "fa-gauge-high", title: "Performance-first", body: "95+ Lighthouse score. Aggressive image optimisation, caching, and CDN.", proof: "1.4s load on 3G" },
        { icon: "fa-magnifying-glass", title: "Found on Google", body: "Search Engine Optimization, Google Business, and Maps indexing.", proof: "#1 rank target keywords" },
        { icon: "fa-comments-dollar", title: "Built to convert", body: "Click-to-WhatsApp, automated quote estimators, and inquiry forms.", proof: "+212% enquiries avg" },
      ],
      previewImage: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=600&auto=format&fit=crop",
      startingPrice: 350000,
      media: [
        { type: "image", url: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=900&auto=format&fit=crop", caption: "Business website — Kariakoo duka" },
        { type: "image", url: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=900&auto=format&fit=crop", caption: "Web app UI craft" },
        { type: "video", url: "https://media.w3.org/2010/05/bunny/movie.mp4", caption: "Landing page motion — replace with your reel" },
      ],
    },
    {
      id: "apps",
      num: "02",
      title: "Apps",
      titleSw: "Apu",
      subtitle: "Web & mobile apps shaped around how you work",
      icon: "fa-mobile-screen-button",
      accent: "bg-viol",
      tags: ["ANDROID", "iOS", "PWA", "FLUTTER"],
      description:
        "Operations, customer and offline-first apps — digitise the clipboard, put your business in your customer's pocket, and keep working when the network drops. Includes Flutter builds like the FaidaHQ companion app.",
      highlights: [
        { icon: "fa-clipboard-check", title: "Operations apps", body: "Orders, deliveries, field teams, and approvals — digitise paper notebooks.", proof: "Paperless operations" },
        { icon: "fa-mobile-screen", title: "Customer apps", body: "Booking, loyalty, ordering, and catalogs. Your brand in your customer's pocket.", proof: "Android & iOS ready" },
        { icon: "fa-wifi", title: "Offline-first engineering", body: "Work without internet, sync automatically when connected. Built for real connectivity.", proof: "100% offline resilient" },
      ],
      startingPrice: 800000,
      media: [
        { type: "image", url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=900&auto=format&fit=crop", caption: "Mobile-first app screens" },
        { type: "video", url: "https://media.w3.org/2010/05/sintel/trailer.mp4", caption: "App walkthrough — replace with your demo" },
      ],
    },
    {
      id: "systems",
      num: "03",
      title: "Business systems",
      titleSw: "Mifumo",
      subtitle: "Purpose-built platforms: Faida POS · CareTrack · ShuleDirect Pro",
      icon: "fa-layer-group",
      tags: ["FAIDA POS", "CARETRACK", "SHULE DIRECT"],
      description:
        "Purpose-built platforms that run your whole operation — sales, stock, attendance, fees and guardian communication — designed for limited connectivity and real compliance (PDPA 2022, NECTA).",
      highlights: [
        { icon: "fa-cash-register", title: "Faida POS", body: "Offline sales, stock alarms, staff tracking, and instant thermal receipts.", proof: "Retail & supermarket ready" },
        { icon: "fa-hospital-user", title: "CareTrack", body: "Attendance, health records, caregiver notes & guardian updates with privacy by design.", proof: "Care centres & clinics" },
        { icon: "fa-graduation-cap", title: "ShuleDirect Pro", body: "NECTA-aligned school management, student grading matrices, and parent communication.", proof: "Automated student reports" },
      ],
      startingPrice: 1200000,
      media: [
        { type: "image", url: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=900&auto=format&fit=crop", caption: "Team dashboards & systems" },
        { type: "image", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=900&auto=format&fit=crop", caption: "Analytics that owners read" },
        { type: "video", url: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4", caption: "System demo — replace in admin" },
      ],
    },
  ],
  platforms: [
    {
      id: "faida",
      name: "Faida POS",
      audience: "RETAIL · DUKA · RESTAURANT",
      tagline: "Sell anywhere. Work offline. Keep complete control.",
      description: "Sales, inventory tracking, staff accounts & instant thermal receipts. Works 100% offline on any Android device.",
      color: "deep",
      webUrl: "https://faida-hq.vercel.app/",
      repoUrl: "https://github.com/mwijay12/faida-pos-releases",
      apkUrl: "https://github.com/mwijay12/faida-pos-releases/releases/download/Faida/faida.pos.apk",
      features: [
        "100% offline-first sales & digital receipts",
        "Smart stock alarms & low inventory alerts",
        "Daily automated sales summaries & exports",
        "Stock-take in a third of the time",
      ],
      stats: [
        { value: "0.8s", label: "avg. sale checkout" },
        { value: "100%", label: "works offline" },
        { value: "3×", label: "faster stock-take" },
        { value: "Alerts", label: "smart stock notifications" },
      ],
    },
    {
      id: "caretrack",
      name: "CareTrack",
      audience: "CARE CENTRES · SCHOOLS · NGOs",
      tagline: "Attendance, health notes & guardian trust.",
      description: "Attendance, health notes, fees & guardian updates — with privacy by design.",
      color: "white",
      webUrl: "https://caretrack-six.vercel.app/dashboard",
      features: [
        "One-tap attendance with guardian SMS",
        "Health & meal logs per child",
        "Fees by M-Pesa with auto receipts",
        "Role-based access · audit log · encrypted",
      ],
      stats: [
        { value: "48", label: "children per centre (typical)" },
        { value: "min", label: "attendance in minutes" },
        { value: "SMS", label: "guardian arrival alerts" },
        { value: "2G", label: "syncs on weak networks" },
      ],
    },
  ],
  processPhases: [
    {
      num: "01",
      title: "Discovery & Scope",
      titleSw: "Discovery",
      weeks: "WEEK 1",
      body: "Written scope, fixed quote, and launch date agreed upfront.",
      deliverables: ["Scope map", "Written quote"],
    },
    {
      num: "02",
      title: "UI/UX Prototyping",
      titleSw: "Design",
      weeks: "WEEK 1–2",
      body: "Clickable prototypes tested on your phone before coding.",
      deliverables: ["Live prototype", "Design sign-off"],
    },
    {
      num: "03",
      title: "Agile Engineering",
      titleSw: "Build",
      weeks: "WEEK 2–6",
      body: "Fast sprints with offline tests, device QA, and weekly demos.",
      deliverables: ["Weekly preview", "Staging link"],
    },
    {
      num: "04",
      title: "Launch & Training",
      titleSw: "Launch",
      weeks: "FINAL WEEK",
      body: "Production rollout, team training, and 30-day hypercare.",
      deliverables: ["Production rollout", "Staff training"],
    },
    {
      num: "05",
      title: "Care & Support",
      titleSw: "Support",
      weeks: "LONG-TERM",
      body: "Daily backups, security updates, and WhatsApp SLA from 99K/mo.",
      deliverables: ["Automated backups", "WhatsApp SLA"],
    },
  ],
  impact: {
    stats: [
      { value: 15, suffix: "+", label: "projects & platform deployments" },
      { value: 99, suffix: ".9%", label: "average platform uptime" },
      { value: 100, suffix: "%", label: "code ownership & written SLA" },
      { value: 24, suffix: "/7", label: "dedicated client support availability" },
    ],
    testimonials: [
      {
        quote: "Altraware didn't just build our website — they taught us to read our own numbers. Bookings doubled in three months.",
        name: "Sarah Kimaro",
        role: "Serene Salon & Spa · Masaki",
        color: "bg-deep",
      },
      {
        quote: "CareTrack changed our mornings. Attendance takes minutes, and parents get an SMS the moment their child arrives.",
        name: "Joyce Mushi",
        role: "Director · Tumaini Care Centre",
        color: "bg-viol",
      },
      {
        quote: "Fees collection used to take weeks of chasing. Now guardians pay by M-Pesa and receipts send themselves.",
        name: "Pastor Peter Lyimo",
        role: "Administrator · Grace Schools, Arusha",
        color: "bg-green-600",
      },
    ],
    sectors: [
      { label: "Schools", image: "https://images.unsplash.com/photo-1497375638960-ca368c7231e4?q=80&w=400&auto=format&fit=crop" },
      { label: "Retail", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=400&auto=format&fit=crop" },
      { label: "NGOs", image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=400&auto=format&fit=crop" },
    ],
  },
  pricing: {
    intro:
      "Fixed packages, written quotes and honest estimates. Pick what you need — the estimator turns your choices into a realistic range, timeline and monthly cost in seconds.",
    packages: [
      {
        id: "web-starter",
        name: "Web Starter",
        tagline: "Clean, high-impact landing page that drives direct calls and WhatsApp inquiries",
        price: 350000,
        priceUnit: "one-time",
        durationWeeks: [1, 2],
        features: [
          "Modern responsive single-page design (Mobile-First)",
          "Direct WhatsApp & phone call triggers",
          "Google Maps registration & local SEO indexing",
          "Ultra-fast loading speed (under 1.5s on 3G)",
          "Free domain setup & SSL security certificate",
        ],
      },
      {
        id: "web-growth",
        name: "Growth Business Site",
        tagline: "Comprehensive multi-page website with service catalog, quote forms, and local SEO",
        price: 550000,
        priceUnit: "one-time",
        durationWeeks: [2, 3],
        featured: true,
        features: [
          "4–6 structured pages (Home, About, Services, Gallery, Contact)",
          "Product or service catalog with high-res galleries",
          "Google Business Profile setup & local search ranking",
          "Branded corporate emails (e.g. info@yourcompany.co.tz)",
          "Easy content updates & visitor traffic analytics",
        ],
      },
      {
        id: "web-pro",
        name: "Pro Web Portal",
        tagline: "Dynamic web portal with database integration, custom booking, and client portal",
        price: 750000,
        priceUnit: "one-time",
        durationWeeks: [2, 4],
        features: [
          "Unlimited pages with custom brand design system",
          "Client booking system, customer portal, or database forms",
          "Multi-language support (English & Swahili ready)",
          "95+ Lighthouse speed score & enterprise SSL",
          "API readiness & 2 months complimentary priority support",
        ],
      },
      {
        id: "sys-webapp",
        name: "Custom App / Portal",
        tagline: "Operational web or mobile app, client booking portal, or internal business dashboard",
        price: 800000,
        priceUnit: "starting grade",
        durationWeeks: [3, 5],
        features: [
          "Operational web or mobile app tailored to your workflow",
          "Centralized management dashboard & role-based access",
          "Real-time database with CSV & PDF report exports",
          "Responsive across mobile phones, tablets, and desktop",
          "Hands-on office onboarding & staff training session",
        ],
      },
      {
        id: "sys-faida",
        name: "Faida POS / Mobile App",
        tagline: "Native Flutter mobile app & POS terminal with offline-first local database",
        price: 1500000,
        priceUnit: "starting grade",
        durationWeeks: [3, 5],
        features: [
          "Production-ready Flutter Android APK + Web Admin portal",
          "100% offline-first operation with auto cloud synchronization",
          "Thermal printer receipt generation & Bluetooth support",
          "Smart stock alarms & daily sales breakdown reports",
          "On-site hardware setup & printer calibration",
        ],
      },
      {
        id: "sys-caretrack",
        name: "CareTrack / Enterprise ERP",
        tagline: "Comprehensive institutional system for clinics, care centres, and organizations",
        price: 3000000,
        priceUnit: "starting grade",
        durationWeeks: [6, 10],
        features: [
          "Multi-module workflow (Care profiles, Attendance, Staff, Inventory)",
          "Complete data migration from paper, books, or spreadsheets",
          "High-security encrypted records & audit logging",
          "Automated monthly compliance & donor reports",
          "6-Month written SLA guarantee & dedicated engineer support",
        ],
      },
    ],
    supportPlans: [
      {
        id: "tunza",
        name: "Essential Support",
        nameSw: "Tunza",
        price: 99000,
        unit: "/mo",
        features: ["Hosting, SSL & daily backups", "Security patches & monitoring", "Direct WhatsApp engineering support (48h)"],
      },
      {
        id: "kuza",
        name: "Growth Support",
        nameSw: "Kuza",
        price: 249000,
        unit: "/mo",
        popular: true,
        features: [
          "Everything in Essential Support",
          "4 content & design updates per month",
          "Monthly visitor analytics & speed report",
          "Priority WhatsApp channel (12h SLA)",
        ],
      },
      {
        id: "imara",
        name: "Partner SLA",
        nameSw: "Imara",
        price: "custom",
        unit: "",
        features: ["Dedicated monthly engineering hours", "Feature roadmap & custom enhancements", "Regular staff retraining sessions"],
      },
    ],
    estimator: {
      types: [
        { id: "website", label: "Website", icon: "fa-globe", base: 350000 },
        { id: "app", label: "Web / Mobile App", icon: "fa-mobile-screen-button", base: 800000 },
        { id: "system", label: "Business System", icon: "fa-layer-group", base: 1200000 },
      ],
      features: [
        { id: "mpesa", label: "Payment integration", cost: 350000 },
        { id: "bilingual", label: "Multi-language (EN + SW)", cost: 200000 },
        { id: "booking", label: "Booking & Orders", cost: 350000 },
        { id: "offline", label: "Offline-first sync", cost: 450000 },
        { id: "notifications", label: "Smart notifications", cost: 250000 },
        { id: "training", label: "Team training & manuals", cost: 200000 },
      ],
      vatPercent: 18,
      contingencyPercent: 30,
    },
    faqs: [
      {
        q: "How much does a website cost with Altraware?",
        a: "Our Web Starter is TSh 350,000 (delivered in 1–2 weeks), Growth Business is TSh 550,000 (delivered in 2 weeks), and Pro Web Portal is TSh 750,000. Custom operational apps start from TSh 800,000 (3–5 weeks) and turnkey business systems like Faida POS from TSh 1,200,000. Every project has a written agreement, clear deliverables, and no hidden surprises.",
      },
      {
        q: "Do your apps and systems work without internet?",
        a: "Yes. Faida POS and our custom operational systems are built offline-first. Your staff can sell, record transactions, and check stock with zero internet bundles. Data is safely stored on the device and syncs automatically whenever connected.",
      },
      {
        q: "What are your delivery timelines?",
        a: "Websites are delivered in 1 to 2 weeks (or express in 1 week). Web applications start at 4 weeks, native Flutter mobile apps at 4 to 6 weeks, and full-scale business ERPs/systems at approximately 6 to 10 weeks.",
      },
      {
        q: "Do you train our staff on how to use the systems?",
        a: "Yes. Every system includes hands-on team training (either on-site at your premises or via interactive video), along with illustrated PDF manuals and video walkthroughs that your team can rewatch anytime.",
      },
      {
        q: "Who owns the source code and data?",
        a: "You do. Full handover of code repositories, credentials, databases, and assets upon project completion, verified under our written agreement. Zero vendor lock-in.",
      },
    ],
  },
  contact: {
    phone: "+255 792 867 427",
    phoneAlt: "+255 790 942 616",
    whatsapp: "+255 792 867 427",
    email: "altrawaretechnology@gmail.com",
    address: "Dar es Salaam, Tanzania",
    hours: "Mon–Sat · 8:00–18:00 EAT",
  },
  projects: [
    {
      id: "faida-hq",
      title: "Faida POS (FaidaHQ)",
      client: "Altraware Platforms",
      url: "https://faida-hq.vercel.app/",
      category: "Business System",
      year: "2026",
      description: "Tanzania's premier retail and enterprise operating system — fast POS checkout, smart multi-branch stock inventory, threshold alerts, AI financial advisor, automated receipting, offline-first 2G SQLite sync and native M-Pesa reconciliation. Includes both web terminal and companion Flutter Android APK for store attendants.",
      tags: ["SaaS", "Retail POS", "Flutter", "AI Advisor", "M-Pesa", "Offline-first"],
      featured: true,
      media: [
        { type: "image", url: "https://res.cloudinary.com/oc8018um/image/upload/v1791497492/faidahq.png", caption: "Faida POS — Profit Headquarters Terminal & Dashboard" },
        { type: "video", url: "https://media.w3.org/2010/05/bunny/movie.mp4", caption: "Faida POS live walkthrough demo" },
      ],
    },
    {
      id: "uaut-connect",
      title: "UAUT Connect",
      client: "United African University of Tanzania (Kigamboni, Dar es Salaam)",
      url: "https://www.uautconnect.com/",
      category: "Education",
      year: "2026",
      description: "Official modern campus and admissions portal for UAUT (Kibada, Kigamboni) — online student application workflow, degree & diploma entry eligibility checker, OSIM guidance, campus life news and ambassador referral system engineered with Next.js and high-speed local caching.",
      tags: ["Next.js", "Campus Portal", "Education", "Admissions", "Referrals"],
      featured: true,
      media: [
        { type: "image", url: "https://res.cloudinary.com/oc8018um/image/upload/v1791497518/uautconnect.png", caption: "UAUT Connect — Student Portal & Campus Gateway" },
        { type: "image", url: "https://res.cloudinary.com/oc8018um/image/upload/v1791497516/2uautconnect.png", caption: "UAUT Connect — Programs & Admissions Matrix" },
      ],
    },
    {
      id: "niketz",
      title: "Nike TZ Store",
      client: "Nike TZ / Sneaker Vault Dar",
      url: "https://niketz.vercel.app/",
      category: "E-commerce",
      year: "2026",
      description: "High-performance online sneaker store in Tanzania — live inventory catalog, multi-category footwear, mobile money checkout simulation, customer review loop and lightning-fast product filtering.",
      tags: ["E-commerce", "Next.js", "Streetwear", "Sneakers", "M-Pesa"],
      featured: true,
      media: [
        { type: "image", url: "https://res.cloudinary.com/oc8018um/image/upload/v1791497526/niketz_web.png", caption: "Nike TZ — Sneaker & Streetwear E-commerce Store" },
      ],
    },
    {
      id: "mwijay-portfolio",
      title: "Mwijay Portfolio",
      client: "David Mwijage (Founder & Lead Architect)",
      url: "https://mwijayportfolio.vercel.app/",
      category: "Personal Portfolio",
      year: "2026",
      description: "Personal portfolio of David Mwijage — \"Based in Kongowe, Dreaming Global\". Showcasing AI application architecture, automated systems, full-stack systems and the digital landscape of 2026.",
      tags: ["Portfolio", "AI Architecture", "Next.js", "Lead Architect"],
      featured: true,
      media: [
        { type: "image", url: "https://res.cloudinary.com/oc8018um/image/upload/v1791497566/mwijayportfolio.png", caption: "Mwijay Portfolio — Based in Kongowe, Dreaming Global" },
      ],
    },
    {
      id: "aymi-africa",
      title: "AYMI Africa Hub",
      client: "AYMI Africa",
      url: "https://www.aymiafrica.org/",
      category: "Non-profit",
      year: "2026",
      description: "Pan-African youth movement hub — programs directory, Scholar Smart movement, NILINDE campaign and dialogue platforms, with membership signup and AI-assisted leadership prompts.",
      tags: ["Next.js", "Membership", "Non-profit", "AI"],
      featured: true,
      media: [
        { type: "image", url: "https://res.cloudinary.com/oc8018um/image/upload/v1791497521/aymi.png", caption: "AYMI Africa — Youth Platform & Programs" },
      ],
    },
    {
      id: "volta-rentals",
      title: "Volta Rentals",
      client: "Volta Rentals Tanzania",
      url: "https://volta-rentals.vercel.app/",
      category: "Web Platform",
      year: "2026",
      description: "Elite car-rental platform — live fleet registry (SUV, sedan, van, luxury), secure booking flow and a trip calculator that prices Dar→Arusha missions with fuel, chauffeur and extra-KM logic.",
      tags: ["Next.js", "Booking", "Registry", "Fleet"],
      featured: false,
      media: [
        { type: "image", url: "https://res.cloudinary.com/oc8018um/image/upload/v1791497522/voltarentals.png", caption: "Volta Rentals — Luxury Fleet Booking & Trip Calculator" },
      ],
    },
    {
      id: "bongo-foodie",
      title: "Bongo Foodie",
      client: "Bongo Foodie",
      url: "https://bongofoodie.vercel.app/",
      category: "Food & Ordering",
      year: "2026",
      description: "Authentic Swahili gastronomy, spiced by Chef AI — menu browsing by ingredient, price and rating, promotional campaigns, daily trivia and a conversational chef assistant.",
      tags: ["Food-tech", "AI", "Ordering", "Kiswahili"],
      featured: false,
      media: [
        { type: "image", url: "https://res.cloudinary.com/oc8018um/image/upload/v1791497525/bongofoodie.png", caption: "Bongo Foodie — Swahili Dishes & Chef AI" },
      ],
    },
    {
      id: "mwijay-studio",
      title: "Mwijay Studio",
      client: "Mwijay Davie (previous brand)",
      url: "https://mwijay-studio.vercel.app/",
      category: "Studio",
      year: "2025",
      description: "The studio that became Altraware — bold brand identities, web experiences and free AI tools (prompts, lyrics, brand names). Selected work includes Aymi Africa, Audenic, Bongo Foodie, FaidaHQ and more.",
      tags: ["Branding", "Web", "AI Tools", "Portfolio"],
      featured: false,
      media: [
        { type: "image", url: "https://res.cloudinary.com/oc8018um/image/upload/v1791497523/mwijaystudio.png", caption: "Mwijay Studio — Brand Architecture & Free AI Tools" },
      ],
    },
    {
      id: "audenic",
      title: "Audenic Audio Labs",
      client: "Audenic",
      url: "https://audenic.vercel.app/",
      category: "E-commerce",
      year: "2026",
      description: "Hand-tuned audio e-commerce — Dar es Salaam studio headphones & buds with product stories, reviews, warranty messaging and the Auden AI assistant in Kiswahili & English.",
      tags: ["E-commerce", "AI Assistant", "Audio", "SW/EN"],
      featured: false,
      media: [
        { type: "image", url: "https://res.cloudinary.com/oc8018um/image/upload/v1791497524/audenic.png", caption: "Audenic — Hand-Tuned Audio & Auden AI" },
      ],
    },
    {
      id: "shule-direct-pro",
      title: "ShuleDirect Pro",
      client: "ShuleDirect",
      url: "https://shule-direct-pro.vercel.app/",
      category: "Business System",
      year: "2026",
      description: "NECTA-compliant school management node — CSEE/FTNA academic matrices, ClickPesa revenue hub, Beem SMS, PDPA 2022 data sovereignty, hostel & fleet modules and Gemini-powered narrative reports.",
      tags: ["Education", "NECTA", "ClickPesa", "AI"],
      featured: false,
      media: [
        { type: "image", url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=900&auto=format&fit=crop", caption: "School management dashboards" },
      ],
    },
    {
      id: "caretrack",
      title: "CareTrack",
      client: "Altraware Platforms",
      url: "https://caretrack-six.vercel.app/dashboard",
      category: "Business System",
      year: "2026",
      description: "Children's home centre management — secure child profiles, staff assignments, role-based access, professional report generation and guardian communication for orphanage centres.",
      tags: ["Care Centres", "RBAC", "Reports", "Flutter-ready"],
      featured: false,
      media: [
        { type: "image", url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=900&auto=format&fit=crop", caption: "Care-centre attendance & medical records" },
      ],
    },
  ],
  blog: {
    intro:
      "Notes from the workshop — practical thinking about building software that works in Tanzania: connectivity, mobile money, Kiswahili-first design and honest pricing.",
    posts: [
      {
        id: "offline-first-dsm",
        title: "Why offline-first matters in Dar es Salaam",
        slug: "why-offline-first-matters",
        excerpt: "A POS that dies when the network drops isn't a tool — it's a liability. Here's how we design for 2G reality.",
        cover: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=900&auto=format&fit=crop",
        date: "2026-09-18",
        author: "David Mwijage",
        tags: ["engineering", "offline-first"],
        body: [
          "Most software is designed in places where internet is a utility. In Kariakoo, it's a variable. Power dips, bundles run out, and a 3G tower can be busy at noon and idle at midnight.",
          "Offline-first means the sale happens on the device, not on the server. Faida POS writes every transaction to local storage first, then syncs when connectivity returns. The shopkeeper never sees an error — just a small 'syncing' dot in the corner.",
          "The discipline this imposes is useful everywhere: smaller payloads, conflict-aware data models, and interfaces that assume latency. Your software becomes faster in Berlin because it had to survive Kariakoo.",
        ],
        published: true,
      },
      {
        id: "mpesa-in-2026",
        title: "Integrating M-Pesa in 2026: what Daraja actually feels like",
        slug: "integrating-mpesa-2026",
        excerpt: "STK push, C2B callbacks and reconciliation — a field report from integrating mobile money into real products.",
        cover: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=900&auto=format&fit=crop",
        date: "2026-08-02",
        author: "Clemence Ng'unda",
        tags: ["mobile-money", "product"],
        body: [
          "Mobile money is not a feature in Tanzania — it's the default. If your product can't take M-Pesa, most of your market can't pay you.",
          "The Daraja APIs have matured: STK push is reliable, C2B callbacks arrive within seconds, and reconciliation reports can be generated nightly. The hard part isn't the API — it's the edge cases: duplicate callbacks, timeout UX, and customers who pay with the wrong reference.",
          "Our rule: every payment has a human-readable receipt, an SMS confirmation, and a reconciliation line the owner can read without an accountant.",
        ],
        published: true,
      },
      {
        id: "kiswahili-first",
        title: "Kiswahili-first is not translation",
        slug: "kiswahili-first-is-not-translation",
        excerpt: "Translating an English interface into Kiswahili produces Kiswahili words in English shapes. We design the other way round.",
        cover: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=900&auto=format&fit=crop",
        date: "2026-06-21",
        author: "Clemence Ng'unda",
        tags: ["design", "language"],
        body: [
          "A button that says 'Submit' in English and 'Tuma' in Kiswahili is easy. What's hard is when the whole mental model is wrong — when 'dashboard' assumes a desk, a report assumes an accountant, and a workflow assumes an office.",
          "Kiswahili-first means we start from how our clients talk about their work: mahesabu, mahudhurio, risiti. Then we design screens around those words, and let English be the translation.",
          "The results are measurable: staff trained in minutes instead of hours, fewer support calls, and owners who actually open their own reports.",
        ],
        published: true,
      },
      {
        id: "website-in-chatgpt-ai-era",
        title: "Why your business still needs a website in the ChatGPT & AI era (2026)",
        slug: "why-your-business-needs-a-website-in-chatgpt-ai-era",
        excerpt: "With TikTok, Instagram, and AI search engines answering customer queries directly, many ask: 'Why invest in a website?' Here is why AI makes owning an official website more critical than ever.",
        cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=900&auto=format&fit=crop",
        date: "2026-10-04",
        author: "David Mwijage",
        tags: ["seo", "ai", "chatgpt", "strategy"],
        body: [
          "A frequent question we hear from Tanzanian entrepreneurs is: 'Everyone is on Instagram and TikTok, and when people search for services, they ask ChatGPT or Perplexity. Why should I spend money on an official website?'",
          "The answer lies in how modern AI search engines actually work. ChatGPT, Google Gemini, and Perplexity do not guess answers out of thin air — they crawl and reference the open web. Crucially, AI engines cannot reliably index private Instagram stories, locked WhatsApp groups, or direct messages. When a prospective client asks ChatGPT: 'Recommend a reliable solar installer, private school, or corporate logistics provider in Dar es Salaam,' the AI engine searches for fast, trusted websites with structured data, clear service catalogs, and authentic domain authority.",
          "If your business only exists on social media, you are invisible to AI discovery engines. But when you have an indexable website, AI learns your exact prices, office location, service list, and verified phone numbers — and directly cites your company in answers.",
          "Furthermore, social media is rented land. Algorithm changes cut organic reach overnight, and accounts can be banned or hacked without recourse. Your website is an asset you own 100%. Paired with click-to-WhatsApp triggers and automated quote estimators, it converts AI-assisted searchers into paying clients 24 hours a day.",
        ],
        published: true,
      },
      {
        id: "website-cost-tanzania-2026",
        title: "How much does a website & app cost in Tanzania? (2026 Honest Pricing Guide)",
        slug: "how-much-does-a-website-cost-in-tanzania-2026",
        excerpt: "From TSh 350,000 single-page sites to TSh 1.2M custom operational platforms — an authentic, transparent breakdown of digital development costs in Dar es Salaam.",
        cover: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=900&auto=format&fit=crop",
        date: "2026-09-28",
        author: "Clemence Ng'unda",
        tags: ["pricing", "websites", "apps", "tanzania"],
        body: [
          "Website and software pricing in Tanzania has historically been shrouded in mystery. Some freelancers quote TSh 50,000, while traditional agencies demand TSh 5,000,000 for identical scope. How much should a Tanzanian business realistically invest in 2026?",
          "Here is the realistic market standard for professional, high-performing software built to modern engineering standards:\n\n• Web Starter (Landing Page): TSh 350,000 – TSh 500,000. Ideal for service professionals, retail shops, and emerging ventures needing a fast, mobile-first page with WhatsApp call-to-actions.\n\n• Growth Business Website: TSh 550,000 – TSh 850,000. Multi-page sites (Home, About, Services, Catalog, Contact) with local SEO indexing, Google Business setup, and corporate email accounts.\n\n• Dynamic Pro Portal: TSh 750,000 – TSh 1,200,000. Custom booking workflows, database integration, student or customer inquiry forms, and multi-language support (Kiswahili + English).\n\n• Operational Apps & Web Systems: Starting from TSh 800,000. Tailored digital tools that replace paper clipboards, track stock, and coordinate field operations.\n\n• Turnkey Business Systems (e.g. Faida POS): TSh 1,200,000 – TSh 1,800,000. Full offline-first retail OS, thermal receipt printing, and automated M-Pesa reconciliation.",
          "Beware of the 'cheap template trap'. Freelancers offering TSh 50,000 websites frequently use pirated, bloated themes that load in 8+ seconds on 3G, contain security vulnerabilities, or hold your domain name hostage when you request changes. A reputable studio delivers clean code, sub-2s loading speed, .co.tz registration under your legal name, and written milestone agreements.",
          "At Altraware, all packages are published openly on our website. You receive a written contract, fixed quote, and launch date before work begins — zero surprise fees.",
        ],
        published: true,
      },
      {
        id: "why-brela-registered-company-matters",
        title: "Why working with a BRELA-registered software studio protects your business",
        slug: "why-brela-registered-software-company-matters",
        excerpt: "Lost source code, disappeared freelancers, and held-hostage domains are common business risks. Here is why official registration, written contracts, and code ownership matter.",
        cover: "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=900&auto=format&fit=crop",
        date: "2026-09-12",
        author: "David Mwijage & Clemence Ng'unda",
        tags: ["trust", "brela", "compliance", "contracts"],
        body: [
          "Every month, we meet business owners in Dar es Salaam who were burned by informal developers. The common stories are painful: an advance payment was sent to an individual mobile number, but the developer stopped answering calls; or the website was launched, but the freelancer refused to share administrative credentials and domain passwords.",
          "Software is not just a graphic design file — it is the digital spine of your company. That is why choosing a formally registered technology partner is essential.\n\n1. Legal Standing & BRELA Verification: Altraware Technologies is officially registered with the Business Registrations and Licensing Agency (BRELA) in Tanzania. When you transact with us, you are dealing with a recognized corporate entity with a verifiable physical presence in Dar es Salaam.\n\n2. Written SLA & Staged Contracts: We work in five transparent phases. You review and approve deliverables at each stage before billing the next. You receive a formal stamped agreement with clear delivery dates and agreed warranties.\n\n3. 100% Code & Database Sovereignty: Unlike providers who lock you into proprietary hosting traps, Altraware hands over full code repositories, database access keys, and administrative credentials upon delivery. You own your system entirely.\n\n4. Data Protection Compliance (PDPA 2022): We build with Tanzania's Personal Data Protection Act (No. 11 of 2022) at the core of our architecture. Customer phone numbers, patient notes, and financial records are encrypted and protected.",
          "Building software should give you peace of mind, not operational anxiety. Working with an accountable, registered team ensures your investment remains secure for years to come.",
        ],
        published: true,
      },
    ],
  },
  images: {
    heroDar: "https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?q=80&w=900&auto=format&fit=crop",
    streetTz: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=700&auto=format&fit=crop",
    mediaBanner: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    community: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=700&auto=format&fit=crop",
    clientAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=100&auto=format&fit=crop",
    webPreview: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=600&auto=format&fit=crop",
    sectorSchool: "https://images.unsplash.com/photo-1497375638960-ca368c7231e4?q=80&w=400&auto=format&fit=crop",
    sectorRetail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=400&auto=format&fit=crop",
    sectorNgo: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=400&auto=format&fit=crop",
  },
  legal: {
    privacy: {
      updated: "1 October 2026",
      intro:
        "Altraware Technologies (“we”, “us”, “our”) is a software company based in Dar es Salaam, Tanzania. This Privacy Policy explains what personal data we collect through this website and our platforms, why we collect it, and the choices you have. It is written in plain language, in the spirit of the Personal Data Protection Act, No. 11 of 2022 (PDPA) and international good practice.",
      sections: [
        {
          title: "1. Who we are & how to reach us",
          body: "Altraware Technologies Ltd, Dar es Salaam, Tanzania. Data controller contact: altrawaretechnology@gmail.com · +255 792 867 427 / +255 790 942 616. For anything about your data, write to us — we answer within one business day.",
        },
        {
          title: "2. Data we collect",
          body: "Contact form: name, phone, email, organisation and project details you type yourself. Platform use (e.g. Faida POS, CareTrack): business records you or your staff enter, such as sales, attendance or fees, on your instruction. Technical: basic, privacy-respecting analytics (pages visited, device type) with no invasive tracking or advertising profiles.",
        },
        {
          title: "3. Why we collect it (purpose & lawful basis)",
          body: "To respond to your brief and prepare quotes (your request); to deliver, maintain and support systems you have commissioned (contract); to keep platforms secure and improve them (our legitimate interest). We do not sell your data. We do not use your data for unrelated marketing. We collect only what a system genuinely needs — privacy-minded engineering is a company value.",
        },
        {
          title: "4. Children & vulnerable groups",
          body: "Some platforms (e.g. CareTrack) hold records about children in care. We apply extra care: role-based access, encryption, audit logs, and data-sharing only with guardians and authorised staff. Centre administrators act as data controllers for their records; we act as processor under written agreement.",
        },
        {
          title: "5. Where data lives & how long",
          body: "Data is stored on secure cloud infrastructure with encryption in transit and at rest. We keep contact-form data for up to 24 months (unless you ask us to delete it earlier), and client platform data for as long as your contract runs — after handover or termination, data is exported to you and deleted per agreement.",
        },
        {
          title: "6. Who we share with",
          body: "Service providers strictly necessary to run our systems (hosting, email, SMS gateways, mobile-money operators for payments you initiate), bound by confidentiality; authorities only where legally required; nobody else. No advertising networks.",
        },
        {
          title: "7. Your rights",
          body: "Under the PDPA you may: request a copy of your data; correct it; request deletion; object to processing; withdraw consent at any time. Email altrawaretechnology@gmail.com — free of charge, answered within one business day.",
        },
        {
          title: "8. Security",
          body: "Encryption in transit (TLS) and at rest; role-based access control; audit logging on platforms; regular backups; least-privilege staff access. If a breach ever affects you, we will notify you and the Personal Data Protection Commission without undue delay.",
        },
        {
          title: "9. Changes to this policy",
          body: "We may update this policy as systems evolve. Material changes will be announced on this page with a new “last updated” date. Continued use after changes means you accept the updated policy.",
        },
      ],
    },
    terms: {
      updated: "1 October 2026",
      intro:
        "These Terms & Conditions govern your use of the Altraware Technologies website and any software, platforms or services we deliver, unless replaced by a signed client agreement. By using this site or engaging us, you accept these terms.",
      sections: [
        {
          title: "1. Services & agreements",
          body: "We build websites, apps and business systems in defined phases. Website estimates are indicative; every engagement is confirmed by a written agreement stating scope, fixed price, timeline and deliverables — that signed document prevails over any content on this site.",
        },
        {
          title: "2. Quotes, payment & taxes",
          body: "Prices are quoted in Tanzanian Shillings (TSh). Unless stated otherwise, VAT and other statutory levies are excluded (our estimator lets you preview VAT at 18%). Typical payment structure: deposit on signing, milestone payments per phase, balance before go-live. Invoices are due within 14 days; late payment may pause work.",
        },
        {
          title: "3. Client responsibilities",
          body: "Timely feedback, content, access and approvals keep timelines honest. Delays in feedback extend deadlines proportionally. You confirm you own or are licensed to use all materials (text, images, logos) you supply to us.",
        },
        {
          title: "4. Intellectual property & handover",
          body: "On full payment, custom code and assets created for you are handed over — source code, credentials and data exports — as documented in your agreement. Altraware retains rights to its pre-existing tools, frameworks and reusable components, and may showcase delivered work in its portfolio unless you opt out in writing.",
        },
        {
          title: "5. Warranties & support",
          body: "We warrant delivered systems against defects for 30 days after launch (hypercare). Ongoing hosting, updates and maintenance run under a support plan (from TSh 99,000/month). Our liability is limited to fees paid for the affected work; we are not liable for indirect losses such as lost profits or lost data caused by third-party services.",
        },
        {
          title: "6. Third-party services",
          body: "Platforms may integrate mobile-money operators (M-Pesa, Tigo Pesa, HaloPesa), SMS gateways, maps and similar services. Their availability and terms are theirs; we help you register and integrate, but their fees and outages are outside our control.",
        },
        {
          title: "7. Acceptable use",
          body: "Do not use our platforms for unlawful purposes, attempt to breach security, or reverse-engineer licensed third-party components. Data entered must comply with Tanzanian law, including the PDPA 2022.",
        },
        {
          title: "8. Governing law",
          body: "These terms are governed by the laws of the United Republic of Tanzania. Disputes will first be addressed in good-faith negotiation; unresolved disputes fall under the courts of Tanzania.",
        },
        {
          title: "9. Contact",
          body: "Altraware Technologies Ltd · Dar es Salaam · altrawaretechnology@gmail.com · +255 792 867 427 / +255 790 942 616.",
        },
      ],
    },
    companyDetails: {
      legalName: "Altraware Technologies Ltd",
      email: "altrawaretechnology@gmail.com",
      phonePrimary: "+255 792 867 427",
      phoneSecondary: "+255 790 942 616",
      address: "Dar es Salaam, Tanzania",
      registration: "Registered in the United Republic of Tanzania",
    },
  },
};

/* ================= STORAGE (swap with Firebase later) ================= */

const STORAGE_KEY = "altraware_content_v2";

export function loadOverrides(): Partial<SiteContent> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<SiteContent>) : null;
  } catch {
    return null;
  }
}

export function saveOverrides(content: SiteContent) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  } catch (err) {
    // localStorage quota (~5MB) hujaa haraka picha zikiwa base64 data-URLs.
    // Tunakataa kuhifadhi kimya-kimya ili tusiharibu preview kwa data bovu.
    console.error(
      "[content] localStorage imejaa — huenda kuna data-URL kubwa (base64) badala ya Cloudinary URL. Tumia Cloudinary kisha jaribu tena.",
      err
    );
    throw new Error("Hifadhi imeshindwa: localStorage imejaa (picha kubwa kama base64?). Tumia Cloudinary URL.");
  }
}

export function resetOverrides() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

/* ================= PRICING LOGIC ================= */

export function formatTsh(n: number): string {
  return "TSh " + n.toLocaleString("en-US");
}

export function formatK(n: number): string {
  return n >= 1_000_000 ? (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M" : Math.round(n / 1000) + "K";
}

export function formatPriceTag(price: number | "custom"): string {
  if (price === "custom") return "Custom";
  if (price >= 1_000_000) {
    return `TSh ${(price / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  return `TSh ${Math.round(price / 1000)}K`;
}

export interface EstimateInput {
  typeId: string;
  featureIds: string[];
  includeSupport: boolean;
  supportPlanId: string;
  includeVat: boolean;
}

export interface EstimateResult {
  base: number;
  featuresCost: number;
  subtotal: number;
  contingency: number;
  highEnd: number;
  vat: number;
  totalWithVat: number;
  lowDisplay: string;
  highDisplay: string;
  weeks: [number, number];
  complexity: number; // 0..10
  supportMonthly: number | "custom";
  selectedFeatures: string[];
}

/** Smarter estimator: complexity score drives timeline & contingency,
 *  bundle discount applies when 3+ features are selected. */
export function computeEstimate(input: EstimateInput, content: SiteContent): EstimateResult {
  const est = content.pricing.estimator;
  const type = est.types.find((t) => t.id === input.typeId) ?? est.types[0];
  const feats = est.features.filter((f) => input.featureIds.includes(f.id));

  const base = type.base;
  const rawFeatures = feats.reduce((s, f) => s + f.cost, 0);
  // Bundle discount: 10% off feature add-ons when 3+ chosen
  const bundleDiscount = feats.length >= 3 ? 0.1 : 0;
  const featuresCost = Math.round(rawFeatures * (1 - bundleDiscount));

  const subtotal = base + featuresCost;

  // Complexity 0–10: base type weight + features count
  const typeWeight = input.typeId === "website" ? 2 : input.typeId === "app" ? 5 : 7;
  const complexity = Math.min(10, typeWeight + feats.length);

  // Contingency grows with complexity: 15% + 1.5% per point
  const contingencyPct = 0.15 + complexity * 0.015;
  const contingency = Math.round(subtotal * contingencyPct);
  const highEnd = subtotal + contingency;

  const vat = input.includeVat ? Math.round(highEnd * (est.vatPercent / 100)) : 0;
  const totalWithVat = highEnd + vat;

  // Timeline: 1-2 weeks for websites, 4-6 weeks for apps, 6-10 weeks for systems
  const baseWeeks: [number, number] = input.typeId === "website" ? [1, 2] : input.typeId === "app" ? [4, 6] : [6, 10];
  const addW = Math.round(feats.length * 0.4);
  const weeks: [number, number] = [baseWeeks[0] + addW, baseWeeks[1] + addW];

  const plan = content.pricing.supportPlans.find((p) => p.id === input.supportPlanId);
  const supportMonthly = plan ? plan.price : 0;

  return {
    base,
    featuresCost,
    subtotal,
    contingency,
    highEnd,
    vat,
    totalWithVat,
    lowDisplay: `TSh ${formatK(subtotal)}`,
    highDisplay: `TSh ${formatK(highEnd)}`,
    weeks,
    complexity,
    supportMonthly,
    selectedFeatures: feats.map((f) => f.label),
  };
}
