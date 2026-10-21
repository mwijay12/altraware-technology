# 🌐 ALTRAWARE TECHNOLOGY — Enterprise Digital Studio & Client Operating System

```text
       ___   __  ______  ___  _       _____    ____  ______
      /   | / / /_  __/ / __ \/ |     / /   |  / __ \/ ____/
     / /| |/ /   / /   / /_/ / | /| / / /| | / /_/ / __/
    / ___ / /___/ /   / _, _/| |/ |/ / ___ |/ _, _/ /___
   /_/  |_\____/_/   /_/ |_| |__/|__/_/  |_/_/ |_/_____/

   >> "Mizizi ya nyumbani. Ufundi wa kidunia."
   >> Local roots. World-class craft. — Dar es Salaam, Tanzania
   >> Next.js 16 · React 19 · Tailwind v4 · GSAP · Firebase · Cloudinary
```

> **Production Status:** 🟢 **Production Ready (v2.4.0)** · **Build:** Passing (`next build`, `tsc --noEmit` clean) · **Deploy Target:** Vercel

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth_%2B_Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-unsigned_upload-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![GSAP](https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?logo=greensock&logoColor=white)](https://gsap.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)
[![BRELA](https://img.shields.io/badge/BRELA-Registered-0B6E4F)](https://www.brela.go.tz/)
[![Kiswahili](https://img.shields.io/badge/Kiswahili--first-🇹🇿-yellow)](https://en.wikipedia.org/wiki/Swahili_language)

---

## 📊 SITE STATS AT A GLANCE

| Metric | Value | Where it lives |
|---|---|---|
| 🚀 Live platform deployments | **15+** | `/impact`, project showcase |
| ⏱️ Avg. platform uptime | **99.9%** | Impact stats + hero "Altraware Core" card |
| ⚡ Target load on 3G | **< 2s** | Performance-first builds |
| 💰 Published packages | **TSh 350K / 550K / 750K** | `/pricing` + estimator |
| 🛠️ Business systems from | **TSh 1.2M** | Faida POS · CareTrack · ShuleDirect Pro |
| 📱 Mobile-first traffic | **98%** | Design baseline |
| 🌍 Languages | **SW · EN** (Kiswahili-first) | Site-wide content model |
| 💬 Support | **24/7 WhatsApp** from TSh 99K/mo | Support plans |

---

## 📑 TABLE OF CONTENTS

- [Section 1: Project Identity](#-section-1-project-identity)
- [Section 2: Live System Snapshot](#-section-2-live-system-snapshot)
- [Section 3: System Architecture](#-section-3-system-architecture)
- [Section 4: Motion, Text Effects & Visual System](#-section-4-motion-text-effects--visual-system)
- [Section 5: Complete File Structure](#-section-5-complete-file-structure)
- [Section 6: Installation & Setup](#-section-6-installation--setup)
- [Section 7: How To Use It](#-section-7-how-to-use-it)
- [Section 8: Database Schema](#-section-8-database-schema)
- [Section 9: AI & Smart Estimation Details](#-section-9-ai--smart-estimation-details)
- [Section 10: Security & Admin Sessions](#-section-10-security--admin-sessions)
- [Section 11: Current Limitations & Known Issues](#-section-11-current-limitations--known-issues)
- [Section 12: Modification & Addon Guide](#-section-12-modification--addon-guide)
- [Section 13: Deployment Guide](#-section-13-deployment-guide)
- [Section 14: Cost Calculator](#-section-14-cost-calculator)
- [Section 15: Product Roadmap](#-section-15-product-roadmap)
- [Section 16: Lessons Learned](#-section-16-lessons-learned)
- [Section 17: Quick Reference Card](#-section-17-quick-reference-card)

---

## 🏛️ SECTION 1: PROJECT IDENTITY

### The 10-Year-Old Explanation
Altraware Technology is like a digital workshop in Dar es Salaam that builds super-fast websites, apps and business systems for shops, schools, clinics and offices — in Kiswahili and English, with M-Pesa inside — while giving owners a live window (`/portal`) to watch their software being built step by step.

### The Developer Explanation
Altraware Technology is a unified, high-performance platform built on **Next.js 16.3.8 (App Router)** and **React 19.2**. It combines a cinematic marketing site (GPU-accelerated **GSAP 3 ScrollTrigger**, **Lenis** inertia scrolling, **Tailwind CSS v4** design tokens) with an authenticated **Client Operations Portal (`/portal`)** and a reactive **Studio Administration Console (`/admin`)**. It uses **Firebase Authentication** (Google OAuth + Email/Password), **Cloud Firestore** for realtime sync, **Cloudinary** unsigned direct browser-to-cloud uploads (images + video), and client-side **jsPDF** vector invoice rendering. Content is driven by a typed CMS model (`src/lib/content.ts`) with localStorage overrides editable from `/admin`.

### The Business Problem It Solves
The East African software market is plagued by two extremes: unreliable freelancers quoting TSh 50,000–150,000 who deliver broken templates with zero support, versus bloated agencies billing TSh 5,000,000+ with 4-month lead times. Altraware Technology bridges the void as a **BRELA-registered** studio: fixed published packages (`TSh 350K / 550K / 750K`), written agreements, offline-first engineering for 2G reality, M-Pesa-native payments, and a live Client Portal that eliminates communication black holes.

### Product Metadata
- **Current Version:** `v2.4.0` (Production Master)
- **Status:** 🟢 `Production Ready · Active Deployment`
- **Founders:** David Mwijage (Engineering & Architecture) · Clemence Ng'unda (Product & Business Operations)
- **Slogan:** *"Mizizi ya nyumbani. Ufundi wa kidunia."* — Rooted at home. Engineered for the world.
- **Contact:** altrawaretechnology@gmail.com · +255 792 867 427 / +255 790 942 616 · Dar es Salaam, Tanzania
- **Differentiator:** Not a static agency page — an interactive operating system: live POS sandboxes, real-time milestone tracking, direct media uploads, a smart estimator with complexity scoring, branded PDF invoices, and full source-code handover.

---

## ⚡ SECTION 2: LIVE SYSTEM SNAPSHOT

### Component Inventory Table

| Component | Status | What It Does | Tech Used |
|---|---|---|---|
| **Marketing Engine (`/`)** | 🟢 Live | 3D tilt cards, live ticker, kinetic typography, video showcase, live project cards | Next.js 16, GSAP, Lenis, Tailwind v4 |
| **Interactive Demos (`/platforms`)** | 🟢 Live | Faida POS cart + receipt & CareTrack clinic simulator sandboxes | React 19 state, Canvas, NumberFlow |
| **Smart Estimator (`/pricing`)** | 🟢 Live | Investment calculator with complexity scoring, bundle discount, VAT & retainer | TypeScript math engine (`computeEstimate`) |
| **Client Portal (`/portal`)** | 🟢 Live | Project milestones, APK downloads, Handover Vault & PDF manuals | Firebase Auth, Firestore, jsPDF |
| **Admin Console (`/admin`)** | 🟢 Live | Sidebar dashboard, CMS overrides, invoice generator, Cloudinary media registry | React 19, Firestore, Cloudinary |
| **Video & Media Vault** | 🟢 Live | PC/mobile direct upload with live preview, size guards & clear errors | Cloudinary unsigned REST (`image`/`video`) |
| **Invoice Engine** | 🟢 Live | Branded vector PDF invoices/receipts with VAT, deposit & banking logic | jsPDF + jspdf-autotable |
| **AI Assistant "Altra"** | 🟢 Live | Floating bilingual (SW/EN) concierge with provider rotation + local fallback | `/api/chat`, Inception → Agnes → local |
| **Blog Engine (`/blog`)** | 🟢 Live | SEO metadata, tag library, admin-published posts | App Router dynamic `[slug]` |

### What is Fully Working Right Now
- [x] **"K" Pricing Formatting**: `TSh 350K / 550K / 750K / 800K`, millions as `TSh 1.5M / 3M` (`formatK`, `formatPriceTag`).
- [x] **Admin Direct Uploaders**: images (10MB cap) + video (100MB cap) from PC/mobile straight to Cloudinary, with explicit errors when the preset isn't UNSIGNED.
- [x] **Expiring Admin Sessions**: 8h absolute + 30min idle auto-logout, server-verified master passphrase, click-time delete guards.
- [x] **Firebase Authentication**: Google popup OAuth + Email/Password across `/admin` and `/portal`; non-admin emails are signed out immediately.
- [x] **Real-Time Client Tracker**: stages (Discovery → Design → Build → Staging → Live), docs editing, handover credentials.
- [x] **Lead → Project Conversion**: 1-click promotion of inquiries into active projects.
- [x] **PDF Generation**: branded invoices/receipts and client manuals, rendered fully in-browser (works offline).
- [x] **Resilient Images**: every Cloudinary asset verified live (HTTP 200); project cards degrade to gradient placeholders via `onError` instead of broken icons.

### What is Partially Working
- **Push Notifications**: FCM scaffolding exists; Tanzania delivery still relies on SMS/WhatsApp fallbacks.
- **Live M-Pesa Daraja**: the POS demo simulates STK-push confirmation; production Daraja credentials need sandbox clearance.

### Planned (Next Sprints)
- [ ] Push-to-deploy APK updates from GitHub Actions into the Client Portal downloads tab.
- [ ] Multi-tenant roles (Super Admin, Project Manager, Client Viewer).
- [ ] Firestore Security Rules hardening (Auth allowlist mirrored server-side).

### What Was Tried and Abandoned (And Why)
- **Decimal Millions (`TSh 0.35M`)**: felt like "millions" to local buyers — replaced with `TSh 350K` (*"laki tatu na nusu"*).
- **Heavy scroll-zoom carousels**: killed frame rates on budget Androids over 3G — replaced with lightweight GSAP + CSS transforms.
- **Silent base64 image fallback**: filled localStorage (~5MB quota) and broke previews after reload — replaced with loud, actionable upload errors.
- **Client-side hardcoded master password**: readable in the JS bundle by anyone — replaced with server-side verification (`ADMIN_MASTER_KEY`).

---

## 🏗️ SECTION 3: SYSTEM ARCHITECTURE

### End-to-End System Diagram

```text
+--------------------------------------------------------------------------------------------------+
|                                    CLIENT BROWSER / MOBILE DEVICE                                |
|                                                                                                  |
|   +-----------------------+   +---------------------------+   +------------------------------+   |
|   |  Public Site Visitors |   |   Authenticated Clients   |   |   Studio Administrators      |   |
|   |  (Routes: /, /pricing)|   |   (Route: /portal)        |   |   (Route: /admin)            |   |
|   +-----------+-----------+   +-------------+-------------+   +--------------+---------------+   |
+---------------|-----------------------------|--------------------------------|-------------------+
                |                             |                                |
                v                             v                                v
+--------------------------------------------------------------------------------------------------+
|                                   NEXT.JS 16 APP ROUTER (EDGE / SSR)                             |
|                                                                                                  |
|   - Layout Providers (ContentProvider, NotifyProvider, SmoothScroll/Lenis)                       |
|   - Kinetic UI Pipeline (GSAP ScrollTrigger, Marquee/ScrollVelocity, Framer Motion)             |
|   - Smart Calculation Engine (Estimator, Complexity Scoring, Bundle Discount, VAT)               |
|   - Admin Session Layer (8h absolute + 30min idle expiry, click-time delete guards)              |
+--------------------------------------------------------------------------------------------------+
        |                                     |                                   |
        | Direct Uploads                      | Auth State & DB Sync              | PDF Rendering
        v                                     v                                   v
+-----------------------+           +----------------------+            +--------------------+
|    CLOUDINARY API     |           |    GOOGLE FIREBASE   |            |   IN-BROWSER jsPDF |
|                       |           |                      |            |                    |
| - image/video/upload  |           | - Authentication     |            | - System Manuals   |
| - MP4 / WebM / MOV    |           |   (Google & Email)   |            | - Tax Invoices     |
| - Unsigned Presets    |           | - Cloud Firestore    |            | - Payment Receipts |
| - Size-guarded + loud |           |   (Realtime Sync)    |            +--------------------+
|   errors, no silent   |           +----------------------+
|   base64 fallback     |           |  ADMIN PASSPHRASE    |
+-----------------------+           |  VERIFIER            |
                                    |  /api/admin/session  |
                                    |  (ADMIN_MASTER_KEY)  |
                                    +----------------------+
```

### Line-by-Line Execution Walkthrough: Admin Video Upload Flow
When an administrator drops a hero video from their PC into the Admin Console:
1. `src/app/admin/page.tsx` (`VideoUploaderField`): catches the file via `onDrop` / `onChange`.
2. **File Validation**: `file.type.startsWith("video/")` — otherwise `notify("chagua faili la video", "error")`.
3. **Config Check**: `getCloudinaryConfig()` throws a clear Swahili error if `NEXT_PUBLIC_CLOUDINARY_*` env is missing.
4. **Size Guard**: images > 10MB / videos > 100MB are rejected with the exact oversize in MB.
5. **REST Dispatch**: `fetch("https://api.cloudinary.com/v1_1/<cloud>/<image|video>/upload", { method: "POST", body: formData })` with the **unsigned** preset.
6. **Loud Errors**: non-2xx responses throw with status + hint (*"hakikisha preset ni UNSIGNED"*) — never a silent base64 fallback.
7. **Draft Mutation**: `onChange(secure_url)` → `setDraft({ ...draft, hero: { ...draft.hero, heroVideo: url } })`.
8. **Instant Preview**: the dashboard `<video>` player switches source immediately for verification.
9. **Persistence**: "Save changes ✓" → `updateContent(draft)` → `ContentProvider` → localStorage (quota-guarded; oversized payloads raise instead of corrupting state).

---

## ✨ SECTION 4: MOTION, TEXT EFFECTS & VISUAL SYSTEM

The site's signature is its kinetic layer — every effect below is live in production, GPU-friendly, and tuned for budget Androids on 3G.

### 🎬 Cinematic Frames
| Effect | File | What the visitor sees |
|---|---|---|
| **Preloader** | `providers.tsx` → `Preloader` | Brand mark + rotating Kiswahili words (*Karibu · Mizizi · Ufundi · Athari · Twende*), progress bar + %, GSAP curtain exit — plays once per session |
| **5-Column Curtain Sweep** | `providers.tsx` → `PageTransition` | Violet → deep-blue column wipe with logo + *"Twende"* between page navigations |
| **Custom Cursor** | `motion.tsx` → `CustomCursor` | Dot + trailing ring (desktop only), auto-hides over iframes/demos |
| **Film Grain** | `globals.css` → `.grain` / `.grain-cine` | Subtle cinematic texture over the whole experience |

### 📝 Kinetic Typography
| Effect | File | What the visitor sees |
|---|---|---|
| **Typewriter** | `ui/typewriter-text.tsx` | Hero badge rotates *"Tanzanian software studio → Websites from TSh 350,000 → M-Pesa native…"* with blinking cursor |
| **TextEffect** | `ui/text-effect.tsx` | Per-`word` / per-`char` entrances — `slide`, `fade`, `blur` presets across section headlines |
| **TextGradientScroll** | `ui/text-gradient-scroll.tsx` | Body copy illuminates word-by-word as you scroll (used in the Roots narrative) |
| **ScrollVelocity Marquees** | `ui/scroll-velocity.tsx` + `motion.tsx` → `Marquee` | Dual counter-scrolling tracks: media cards one way, pricing pills the other; angled brand ticker under the hero |
| **Glyph Portal** | `ui/glyph-portal.tsx` | Rock-solid scroll-camera flight through live typography |
| **Hover Highlight** | `ui/hover-highlight-text.tsx` | Interactive highlight sweeps on key phrases |
| **Timeline Animation** | `ui/timeline-animation.tsx` | Chronological step reveals (process phases) |

### 🃏 Cards, Counters & Media
| Effect | File | What the visitor sees |
|---|---|---|
| **TiltCard** | `motion.tsx` | 3D perspective tilt on hover (desktop only) — hero visual, projects, pricing |
| **Counter** | `motion.tsx` | Eased count-ups (98% mobile traffic, 24/7, 15+ deployments, 99.9% uptime) triggered on scroll into view |
| **ImgReveal** | `motion.tsx` | Curtain-wipe image entrances across About/Services |
| **MediaBlock** | `motion.tsx` | Admin-editable image + playable-video strips so no page is text-only |
| **LivePreviewFrame** | `ui/LivePreviewFrame.tsx` | Faida POS "Launch Interactive Sandbox" — poster → live iframe with loading + blocked-frame hint |
| **ProjectModal** | `ui/ProjectModal.tsx` | Full project dossier: media gallery, tech tags, live-link CTA |
| **Liquid Glass Carousel** | `ui/liquid-glass-carousel.tsx` | WebGL showcase carousel with error boundary fallback |

### 🦸 Hero Composition (homepage)
Floating **Altraware Core** status card (99.98% uptime pulse), floating `faida.checkout({pay: "M-PESA", lang: "sw"})` code snippet, rotating *"KISWAHILI FIRST • GLOBAL CRAFT"* badge, mobile background + readability scrim, and staggered `heroReady` entrances — all responsive from small phones to widescreen.

---

## 📁 SECTION 5: COMPLETE FILE STRUCTURE

```text
altraware-site/
├── public/                               # Static assets served at root
│   ├── logo.png / logo.jpg               # Master brand emblem
│   ├── favicon.ico / favicon.png / .svg  # Browser icons
│   └── *.png / *.jpg                     # Local fallback artwork (project shots, founders)
├── src/
│   ├── app/                              # Next.js 16 App Router routing tree
│   │   ├── admin/                        # Studio Administration Console
│   │   │   ├── layout.tsx                # Auth gate: Firebase + server-verified master key, expiring sessions
│   │   │   └── page.tsx                  # Sidebar dashboard: Leads, Tracker, Pricing, Blog, Invoices, Content, Images
│   │   ├── api/
│   │   │   ├── admin/session/route.ts    # POST passphrase verifier (ADMIN_MASTER_KEY, timing-safe)
│   │   │   └── chat/route.ts             # "Altra" AI: Inception + key rotation → Agnes → local fallback
│   │   ├── blog/  [slug]/                # Thought leadership: library + dynamic reader + SEO metadata
│   │   ├── portal/  (+ client-portal/)   # Client Operations Portal (milestones, vault, manuals)
│   │   ├── about/ contact/ impact/ platforms/ pricing/ process/ services/  # Marketing routes
│   │   ├── privacy/ terms/               # PDPA-2022aligned legal pages (content-driven)
│   │   ├── robots.ts / sitemap.ts        # SEO plumbing
│   │   ├── layout.tsx                    # Root layout: fonts, grain, preloader, cursor, navbar, footer, AI
│   │   └── page.tsx                      # Homepage (hero → roots → services → work → platforms → impact → pricing)
│   ├── components/
│   │   ├── admin/                        # AdminAuthModal, ClientTrackerTab, LeadsTab
│   │   ├── ui/                           # card, CloudinaryUploader, LivePreviewFrame, ProjectModal,
│   │   │                                 # pricing-section, scroll-velocity, text-effect, text-gradient-scroll,
│   │   │                                 # timeline-animation, typewriter-text, glyph-portal,
│   │   │                                 # hover-highlight-text, liquid-glass-*
│   │   ├── motion.tsx                    # Reveal, TiltCard, Counter, ImgReveal, Marquee, MediaBlock, CustomCursor
│   │   ├── providers.tsx                 # ContentProvider, NotifyProvider, SmoothScroll(Lenis), Preloader, PageTransition
│   │   ├── Navbar.tsx / Footer.tsx / Logo.tsx / FloatingAI.tsx
│   └── lib/
│       ├── admin-session.ts              # Timestamped sessions (8h abs / 30min idle), useAdminSession, canManageNow
│       ├── cloudinary.ts                 # Env-guarded unsigned uploader (image/video endpoints, size caps, loud errors)
│       ├── content.ts                    # Typed CMS: defaults, localStorage overrides (quota-guarded), estimator math
│       ├── firebase.ts                   # Firebase init (env-only, no hardcoded keys) + admin allowlist
│       ├── client-projects.ts            # Project tracker store (local + Firestore)
│       ├── leads.ts                      # Inquiries store (local + Firestore)
│       ├── invoice.ts                    # jsPDF invoice/receipt engine (VAT, deposit, banking)
│       └── utils.ts                      # Shared helpers
├── next.config.ts                        # images.remotePatterns (Cloudinary, Unsplash, demo video hosts)
├── .env.example                          # Safe placeholder template (NO secrets — copy to .env.local)
├── package.json / tsconfig.json / eslint.config.mjs / postcss.config.mjs
└── README.md                             # This file
```

> ⚠️ `.env*` (except `.env.example`) is git-ignored. **Never commit real keys.** The `ADMIN_EMAILS` allowlist in `firebase.ts` holds email addresses only — not secrets.

---

## 💻 SECTION 6: INSTALLATION & SETUP

### Step 0: Prerequisites
- **Node.js**: v18.18+ or v20+ ([Download](https://nodejs.org/))
- **Git**: ([Download](https://git-scm.com/))
- **Browser**: Chrome, Edge, Firefox, or Safari

### Step 1: Clone
```bash
git clone https://github.com/mwijay12/altraware-technology.git
cd altraware-technology
```

### Step 2: Environment Variables (no real secrets live here — use your own)
```bash
cp .env.example .env.local
```
Fill in `.env.local` (see `.env.example` for the full template):
```env
# ─── CLOUDINARY (unsigned upload — public values) ───
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-cloud-name>
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=<your-unsigned-preset>

# ─── FIREBASE (Firebase Console → Project Settings) ───
NEXT_PUBLIC_FIREBASE_API_KEY=<...>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<...>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<...>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<...>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<...>
NEXT_PUBLIC_FIREBASE_APP_ID=<...>
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=<...>

# ─── ADMIN CONSOLE (SERVER-SIDE ONLY — never NEXT_PUBLIC_) ───
ADMIN_MASTER_KEY=<long-random-passphrase>

# ─── AI ENGINES (SERVER-SIDE ONLY) ───
INCEPTION_API_KEY=<...>
AGNES_API_KEY=<...>
```
> Generate a master key with: `powershell -c "-join ((48..57)+(65..90)+(97..122) | Get-Random -Count 24 | ForEach-Object {[char]$_})"`
> Cloudinary preset **must** be **Unsigned** (Dashboard → Settings → Upload → Signing Mode). Restart `next dev` after any `NEXT_PUBLIC_*` change.

### Step 3: Install & Run
```bash
npm install
npm run dev        # → http://localhost:3000
```
*Expected:*
```text
▲ Next.js 16.3.8 (Turbopack)
- Local:        http://localhost:3000
✓ Ready in ~1.4s
```

### Step 4: Self-Test
1. Homepage shows `TSh 350K / 550K / 750K` pricing + kinetic hero.
2. `/admin` → sign in with Google (allowlisted email) or master passphrase; header chip shows session type + remaining time.
3. Content tab → upload an image: success returns a `res.cloudinary.com` URL; a signed/missing preset returns a clear error (never a silent fake).

### Common Setup Errors & Solutions
| Error Symptom | Cause | Solution |
|---|---|---|
| `auth/unauthorized-domain` | localhost not whitelisted | Firebase Console → Auth → Settings → Authorized Domains → add `localhost` |
| `Cloudinary upload imeshindwa (401/403)` | Preset is Signed or missing | Set preset Signing Mode to **Unsigned** |
| `Cloudinary haijasanidiwa` | `NEXT_PUBLIC_*` missing / dev not restarted | Fill `.env.local`, restart `next dev` |
| `Master key haijawekwa` (503) | `ADMIN_MASTER_KEY` missing | Add it server-side (+ Vercel env vars) |
| Preview shows stale/broken images | Old localStorage overrides | DevTools → Application → Local Storage → delete `altraware_content_v2`, or Admin → "Reset site defaults" |
| Tailwind/PostCSS compile error | Node < 18.18 | Upgrade to Node 20 LTS |

---

## 📖 SECTION 7: HOW TO USE IT

### 1. Requesting a Project (client perspective)
Clients use `/pricing` (estimator) or `/contact` (brief form). Inquiries land in Firestore `inquiries` + local mirror, and appear in Admin → *Maombi & Leads*:
- **Estimator math** (`computeEstimate`): base + features (10% bundle discount at 3+ features) → contingency (15% + 1.5%/complexity point) → optional 18% VAT → timeline in weeks.

### 2. Client Operations Portal (`/portal`)
- **Login** with client email/Google.
- **Roadmap**: live stages Discovery → Live with progress %.
- **System Documentation**: *"Pakua Mwongozo (PDF)"* compiles a branded staff manual in-browser.
- **Handover Vault**: production URLs, credentials, repos behind auth.

### 3. Studio Admin Console (`/admin`)
- **Maombi & Leads**: 1-click *"Badili Kuwa Mradi"* converts inquiries into tracked projects.
- **Projects & Docs**: stage control, technical documentation, credentials, print-ready docs; deletes are admin-gated + confirmed.
- **Pricing / Blog / Invoices / Content / Images**: full CMS — packages, posts, branded PDFs, hero copy, Cloudinary media registry.
- **Session chip** (header): `Master/Google · saa X dak Y` — when it hits zero you are logged out automatically.

---

## 🗄️ SECTION 8: DATABASE SCHEMA

### Firestore `client_projects`
```text
client_projects/{id}
├── clientName: string        "Juma Salim (Kilimanjaro Logistics)"
├── clientPhone: string       "+255754998877"
├── clientEmail / systemName / stage (discovery|design|development|staging|live)
├── progressPercent: number   10–100
├── startDate / targetLaunchDate: string (ISO)
├── documentation: { overview, architecture, userGuide, apiEndpoints, slaSupport }
└── updatedAt: string (ISO)
```

### Firestore `inquiries`
```text
inquiries/{id}
├── name / phone / email? / org? / type / message / budget? / timeline?
├── status: "new" | "contacted" | "in_progress" | "converted" | "closed"
├── notes? / refCode? ("#ALT-4821")
└── createdAt: string (ISO)
```

### Browser localStorage mirrors
| Key | Content | Notes |
|---|---|---|
| `altraware_content_v2` | Full CMS overrides | Quota-guarded; legacy `v1` keys are ignored/cleared |
| `altraware_inquiries_v1` | Inquiry mirror + seed data | Merged with Firestore on load |
| `altraware_admin_session` (sessionStorage) | `{ v:1, method, createdAt, lastActive }` | Tab-scoped; legacy `"1"` flags treated as expired |
| `altraware_admin_theme` | `dark` / `light` | Console theme preference |

---

## 🤖 SECTION 9: AI & SMART ESTIMATION DETAILS

### 1. Smart Estimator Algorithm (`computeEstimate`, `src/lib/content.ts`)
$$\text{Features} = \sum \text{costs} \times (1 - 0.10 \text{ if } \ge 3 \text{ features})$$
$$\text{Subtotal} = \text{Base} + \text{Features} \qquad \text{Complexity} = \min(10, \text{typeWeight} + n_{features})$$
$$\text{Contingency} = \text{Subtotal} \times (15\% + 1.5\% \times \text{Complexity})$$
$$\text{Range} = [\text{Subtotal} \;\; ..\;\; \text{Subtotal} + \text{Contingency}] \qquad \text{VAT} = 18\% \text{ (optional)}$$

### 2. "Altra" Assistant Pipeline (`/api/chat`)
1. **Primary**: Inception Labs (`mercury-2.5`) with shuffled multi-key rotation — a dead key just rotates to the next.
2. **Fallback**: Agnes AI (`DeepSeek-V3`, OpenAI-compatible), same rotation.
3. **Local fallback**: honest offline reply with package prices + WhatsApp CTA — the widget never shows a dead error.
4. Grounded in Tanzanian context: published tiers (350K → 3M), BRELA trust, offline-first, code ownership; answers in the user's language (SW/EN); WhatsApp CTA at `+255 792 867 427`.

---

## 🔐 SECTION 10: SECURITY & ADMIN SESSIONS

| Control | Implementation | File |
|---|---|---|
| Master passphrase | **Server-side only** via `POST /api/admin/session`, timing-safe compare against `ADMIN_MASTER_KEY` | `app/api/admin/session/route.ts` |
| No hardcoded secrets | Cloudinary/Firebase read **env only**; old bundle passwords removed | `lib/cloudinary.ts`, `lib/firebase.ts` |
| Expiring sessions | **8h absolute** + **30min idle** auto-logout (Firebase signed out too) | `lib/admin-session.ts` |
| Legacy invalidation | Old `"1"` flags + `v1` content keys treated as expired/cleared | `admin-session.ts`, `providers.tsx` |
| Delete guards | Every destructive action re-verifies admin at click-time (`canManageNow`) | `page.tsx`, `LeadsTab`, `ClientTrackerTab` |
| Email allowlist | Non-admin Firebase users are signed out on sight | `useAdminSession` |
| Session visibility | Header chip shows method + live countdown (`Master · saa 7 dak 12`) | `app/admin/page.tsx` |
| Login feedback | Expired-session banner (*"umeto lewa kiotomatiki, ingia tena"*) + rejected-email notice | `app/admin/layout.tsx` |

> ⚠️ Client-side guards are UX-level. **Mirror the allowlist in Firestore Security Rules** (only admin emails may read/write `inquiries` / `client_projects`) before treating the console as fully hardened. Brute-force note: the passphrase endpoint adds a 600ms delay on failure — for production, put it behind Vercel rate limiting / WAF.

---

## ⚠️ SECTION 11: CURRENT LIMITATIONS & KNOWN ISSUES

1. **Large uploads on 2G/3G**: videos > 50MB can take 60s+ on cellular — UI encourages compressed MP4s < 20MB; hard caps are 10MB (image) / 100MB (video).
2. **Single-device CMS drafts**: without Firestore sync, overrides live in per-browser localStorage (see table above).
3. **M-Pesa Daraja**: POS demo simulates STK-push; production credentials pending sandbox clearance.
4. **ESLint**: `npm run lint` reports pre-existing `set-state-in-effect` warnings from Next 16's stricter rules across mount-load effects — cosmetic, build is unaffected (`tsc` + `next build` clean).
5. **Fixed this cycle**: silent base64 fallback (removed), hardcoded bundle passwords (removed), `v1/v2` reset-key mismatch (fixed), missing `images.remotePatterns` (added), brand spelling (Technology, everywhere).

---

## 🛠️ SECTION 12: MODIFICATION & ADDON GUIDE

### Mod 1: YouTube/Vimeo hero video — ⭐ (30 min)
**Files:** `src/app/page.tsx`, `src/app/admin/page.tsx` → swap `<video>` for an `<iframe>`, regex-parse the video ID from `content.hero.heroVideo`.

### Mod 2: Live M-Pesa Daraja STK Push — ⭐⭐⭐⭐ (2 days)
**New:** `src/app/api/mpesa/stkpush/route.ts`, `src/app/api/mpesa/callback/route.ts` → Daraja bearer token → STK push → write confirmations to Firestore.

### Mod 3: SMS via Beem/NextSMS — ⭐⭐ (3 hrs)
**Files:** `ClientTrackerTab.tsx`, `lib/leads.ts` → webhook on milestone change → SMS to client phone.

### Mod 4: New estimator feature — ⭐ (15 min)
Admin → Pricing → *"+ Add estimator feature"* (label + cost) → Save. Complexity, contingency and timelines recompute automatically.

---

## 🚀 SECTION 13: DEPLOYMENT GUIDE

### Vercel (recommended)
1. Push to GitHub (this repo).
2. Vercel → **Add New Project** → import `altraware-technology` → Framework: **Next.js**.
3. **Environment Variables** (all of them — especially the server-side ones):
   | Variable | Scope | Notes |
   |---|---|---|
   | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` / `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Production + Preview | Unsigned preset |
   | `NEXT_PUBLIC_FIREBASE_*` (7 vars) | Production + Preview | From Firebase Console |
   | `ADMIN_MASTER_KEY` | **Production only** | Long random string; master login 503s without it |
   | `INCEPTION_API_KEY(S)` / `AGNES_API_KEY(S)` | **Production only** | AI engines; never `NEXT_PUBLIC_` |
4. **Deploy** (`npm run build` runs automatically). Also add `localhost:3000` to Firebase Authorized Domains for local dev.

### Custom Domain (`.co.tz`)
1. Registrar DNS: `A @ → 76.76.21.21`, `CNAME www → cname.vercel-dns.com`.
2. Vercel → Domains → add `altraware.co.tz` (+ `www`). SSL auto-provisions in ~15 min.

---

## 💰 SECTION 14: COST CALCULATOR

| Service | Free Tier | Production | 100 users/mo | 1,000 users/mo |
|---|---|---|---|---|
| **Vercel Hosting** | 100 GB BW/mo | Pro ($20/mo) | $0.00 | $0.00–$20.00 |
| **Cloud Firestore** | 50K reads / 20K writes / day | Pay-as-you-go | $0.00 | $0.00 |
| **Cloudinary** | 25 credits | Plus ($89/mo) | $0.00 | $0.00 |
| **Domain (.co.tz)** | — | Annual | ~$15.00/yr | ~$15.00/yr |
| **TOTAL** | — | — | **$0.00/mo** | **$0.00–$20.00/mo** |

---

## 🗺️ SECTION 15: PRODUCT ROADMAP

### Short-Term (next 2 weeks)
- [x] `K` pricing notation site-wide
- [x] Native admin uploaders with preview + loud errors
- [x] Enterprise sidebar admin layout
- [x] Expiring sessions + server-verified master login
- [ ] WhatsApp trigger on completed milestones
- [ ] Admin theme lock switch

### Medium-Term (3 months)
- [ ] Beem Africa SMS milestone alerts
- [ ] Multi-tenant sub-accounts with invite links
- [ ] Daraja STK Push production credentials
- [ ] Firestore Security Rules mirroring the admin allowlist

### Long-Term (6–12 months — v3.0)
- [ ] AI onboarding: brief → interactive wireframe in 60 seconds
- [ ] Flutter client app (tickets, reviews, invoice payments)

---

## 🧠 SECTION 16: LESSONS LEARNED

1. **Pricing psychology beats code perfection**: `0.35M` scared buyers; `350K` (*"laki tatu na nusu"*) closed deals.
2. **Offline-first is non-negotiable**: SQLite-first sync saved clients during Kariakoo fiber cuts.
3. **Loud errors beat graceful degradation**: a silent base64 fallback hid a broken preset for weeks; an explicit error fixed it in minutes.
4. **Never ship secrets in the bundle**: a hardcoded password is a public password — verify server-side.
5. **Transparency converts**: written milestones + live portal close contracts ~3× faster than opaque email proposals.

---

## 📋 SECTION 17: QUICK REFERENCE CARD

### Essential Commands
```bash
npm run dev          # local dev → http://localhost:3000
npx tsc --noEmit     # strict type check
npm run build        # production bundle
npm start            # serve production locally
```

### Critical Access (no secrets stored here — use your own `.env.local`)
- **Site:** `http://localhost:3000` · **Admin:** `/admin` · **Portal:** `/portal`
- **Admin login:** Google (allowlisted email) · Email/Password · Master passphrase (`ADMIN_MASTER_KEY` from server env)
- **Session:** max 8h · idle logout 30min · countdown chip in admin header
- **Reset stale previews:** delete `altraware_content_v2` in DevTools → Application → Local Storage

---

*Document sealed and certified for Altraware Technology Ltd.*
*Dar es Salaam, Tanzania · October 2026 · "Mizizi ya nyumbani. Ufundi wa kidunia."*
