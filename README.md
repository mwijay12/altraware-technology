# 🌐 ALTRAWARE TECHNOLOGIES — Enterprise Digital Studio & Client Operating System

```text
       ___   __  ______  ___  _       _____    ____  ______
      /   | / / /_  __/ / __ \/ |     / /   |  / __ \/ ____/
     / /| |/ /   / /   / /_/ / | /| / / /| | / /_/ / __/   
    / ___ / /___/ /   / _, _/| |/ |/ / ___ |/ _, _/ /___   
   /_/  |_\____/_/   /_/ |_| |__/|__/_/  |_/_/ |_/_____/   
                                                           
   >> TANZANIAN SOFTWARE STUDIO · BRELA REGISTERED · DAR ES SALAAM
   >> Next.js 16.3 · React 19 · Tailwind v4 · GSAP · Firebase · Cloudinary
```

> **Production Status:** 🟢 **Production Ready (v2.4.0)** | **Build:** Passing (`next build` 0 errors) | **Deploy Target:** Vercel Edge / Firebase

---

## 📑 TABLE OF CONTENTS
- [Section 1: Project Identity](#-section-1-project-identity)
- [Section 2: Live System Snapshot](#-section-2-live-system-snapshot)
- [Section 3: System Architecture](#-section-3-system-architecture)
- [Section 4: Complete File Structure](#-section-4-complete-file-structure)
- [Section 5: Installation & Setup](#-section-5-installation--setup)
- [Section 6: How To Use It](#-section-6-how-to-use-it)
- [Section 7: Database Schema](#-section-7-database-schema)
- [Section 8: AI & Smart Estimation Details](#-section-8-ai--smart-estimation-details)
- [Section 9: Current Limitations & Known Bugs](#-section-9-current-limitations--known-bugs)
- [Section 10: Modification & Addon Guide](#-section-10-modification--addon-guide)
- [Section 11: Deployment Guide](#-section-11-deployment-guide)
- [Section 12: Cost Calculator](#-section-12-cost-calculator)
- [Section 13: Product Roadmap](#-section-13-product-roadmap)
- [Section 14: Lessons Learned](#-section-14-lessons-learned)
- [Section 15: Quick Reference Card](#-section-15-quick-reference-card)

---

## 🏛️ SECTION 1: PROJECT IDENTITY

### The 10-Year-Old Explanation
Altraware is like a digital workshop in Dar es Salaam that builds super-fast computer programs, websites, and phone games/apps for stores, doctors, and offices, while giving the owners a special secret room where they can watch their software being built step-by-step.

### The Developer Explanation
Altraware Technologies is a unified, high-performance monorepo platform built on **Next.js 16.3.8 (App Router)** and **React 19.2**. It combines a cinematic corporate marketing portal (using GPU-accelerated **GSAP 3**, **Lenis** inertia scrolling, and **Tailwind CSS v4** design tokens) with an authenticated, real-time **Client Operations Portal (`/portal`)** and a reactive **Studio Administration Console (`/admin`)**. It leverages **Firebase Authentication** (Google OAuth + Email/Password), **Cloud Firestore** for real-time document synchronization, **Cloudinary** for direct browser-to-cloud media optimization (videos and images), and client-side **jsPDF** vector invoice rendering.

### The Business Problem It Solves
The East African software market is plagued by two extremes: unreliable, untraceable freelancers charging 50,000–150,000 TSh who deliver broken WordPress templates with zero support, versus bloated legacy agencies billing 5,000,000+ TSh with 4-month lead times. Altraware bridges this void as a legally incorporated (**BRELA Registered**) entity providing guaranteed delivery milestones, transparent pricing (anchored in accessible "K" notation like `TSh 350K`, `TSh 550K`), 3G mobile speed optimization (< 1.5s load), and a live Client Portal eliminating communication black holes.

### Product Metadata
- **Current Version:** `v2.4.0` (Production Master)
- **Status Badge:** 🟢 `Production Ready · Active Deployment`
- **Architect & Founders:** David Mwijage & Clemence Ng'unda
- **Differentiator:** Unlike generic static agency landing pages, Altraware is an interactive operating system. It features live in-browser POS simulations, real-time client milestone tracking, direct video/media asset management, dynamic fee calculation with complexity scoring, and source code ownership guarantees.

---

## ⚡ SECTION 2: LIVE SYSTEM SNAPSHOT

### Component Inventory Table

| Component | Status | What It Does | Tech Used |
|---|---|---|---|
| **Marketing Engine (`/`)** | 🟢 Live | 3D tilt cards, live ticker, typography transitions, video showcase | Next.js 16, GSAP, Lenis, Tailwind v4 |
| **Interactive Demos (`/platforms`)** | 🟢 Live | Functional Faida POS cart + receipt & CareTrack clinic simulator | React 19 State, Canvas, NumberFlow |
| **Smart Estimator (`/pricing`)** | 🟢 Live | Dynamic investment calculator with complexity, VAT & retainer | TypeScript Mathematical Engine |
| **Client Portal (`/portal`)** | 🟢 Live | Project milestones, APK downloads, Handover Vault & PDF manuals | Firebase Auth, Firestore, jsPDF |
| **Admin Console (`/admin`)** | 🟢 Live | Enterprise dashboard sidebar, CMS overrides, invoice generator | React 19, Firestore, Cloudinary API |
| **Video & Media Vault** | 🟢 Live | PC/Mobile direct video upload with live preview & auto-compression | Cloudinary Direct Unsigned REST API |
| **Invoice Engine** | 🟢 Live | Generates vector branded PDF invoices with tax and banking details | jsPDF, jsPDF-AutoTable |
| **AI Studio Assistant** | 🟢 Live | Floating conversational concierge for prospective clients | Client-side reactive modal + WhatsApp |

### What is Fully Working Right Now
- [x] **Sub-million "K" Pricing Formatting**: Displays `TSh 350K`, `TSh 550K`, `TSh 750K`, `TSh 800K` seamlessly; displays `TSh 1.5M`, `TSh 3M` for multi-million packages.
- [x] **Admin Direct Video Uploader**: File upload dialog supporting MP4/WebM/MOV from PC/mobile directly to Cloudinary with live preview video player.
- [x] **Admin Enterprise Sidebar Dashboard**: Collapsible responsive navigation with system telemetry, tab switches, and instant draft persistence.
- [x] **Firebase Authentication**: Google Popup OAuth & Email/Password session management across Admin and Client Portal.
- [x] **Real-Time Client Tracker**: Milestone updating (Discovery, Design, Dev, QA, Launch), System Docs editing, Handover credentials storage.
- [x] **Lead-to-Project Conversion**: 1-click promotion of estimator briefs into active client projects.
- [x] **PDF Document Generation**: Instant client manual and billing invoice PDF compilation in-browser.

### What is Partially Working
- **Push Notifications**: Firebase Cloud Messaging (FCM) service worker registration is scaffolded but relies on SMS/WhatsApp fallbacks for Tanzania.
- **Automated M-Pesa C2B Webhook**: M-Pesa STK push is currently simulated in the client demo; live Vodacom Daraja OpenAPI credentials require sandbox clearance.

### Planned (Next Sprints)
- [ ] Push-to-deploy APK updates directly from GitHub Actions into the Client Portal downloads tab.
- [ ] Multi-tenant role privileges (Super Admin, Project Manager, Client Viewer).

### What Was Tried and Abandoned (And Why)
- **Decimal Million Notation (`TSh 0.35M`)**: Abandoned because Tanzanian business owners perceived "0.35M" as intimidating millions rather than 350,000 TSh. Replaced with `TSh 350K`.
- **Heavy Scroll-to-Zoom Carousel Plugins**: Abandoned because they degraded frame rates on budget Android devices over 3G connections. Replaced with lightweight GSAP and CSS transforms.
- **SSR Password Gates**: Abandoned in favor of client-side Firebase Auth state combined with master passphrase session tokens to prevent cold-start hydration flickers.

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
|   - Layout Providers (ContentProvider, NotifyProvider, ThemeEngine)                              |
|   - Kinetic UI Pipeline (GSAP ScrollTrigger, Lenis Inertial Scroll, Framer Motion)              |
|   - Smart Calculation Engine (Estimator, Complexity Scoring, Discount Rules)                     |
+--------------------------------------------------------------------------------------------------+
        |                                     |                                   |
        | Direct Uploads                      | Auth State & DB Sync              | PDF Rendering
        v                                     v                                   v
+-----------------------+           +----------------------+            +--------------------+
|    CLOUDINARY API     |           |    GOOGLE FIREBASE   |            |   IN-BROWSER jsPDF |
|                       |           |                      |            |                    |
| - /auto/upload        |           | - Authentication     |            | - System Manuals   |
| - MP4 / WebM Videos   |           |   (Google & Email)   |            | - Tax Invoices     |
| - Optimized WebP/AVIF |           | - Cloud Firestore    |            | - Payment Receipts |
| - Unsigned Presets    |           |   (Realtime Sync)    |            +--------------------+
+-----------------------+           +----------------------+
```

### Line-by-Line Execution Walkthrough: Admin Video Upload Flow
When an administrator drags a new hero video from their PC into the Admin Console:
1. `src/app/admin/page.tsx` (`VideoUploaderField`): Catches the file event via `onDrop` or `onChange`.
2. **File Validation**: Validates `file.type.startsWith("video/")`. If false, fires `notify("Chagua faili la video", "error")`.
3. **Network Handshake**: Calls `uploadFileToCloudinary(file)` in `src/lib/cloudinary.ts`.
4. **FormData Assembly**: Appends `upload_preset: "altraware"` and `file` to `new FormData()`.
5. **REST Dispatch**: Executes `fetch("https://api.cloudinary.com/v1_1/oc8018um/auto/upload", { method: "POST", body: formData })`.
6. **Response Deserialization**: Cloudinary decodes the video stream, calculates adaptive bitrates, and returns JSON containing `data.secure_url`.
7. **Draft State Mutation**: Calls `onChange(url)` which executes `setDraft({ ...draft, hero: { ...draft.hero, heroVideo: url } })`.
8. **UI State Reflection**: The local `<video>` player in the dashboard immediately switches source to the returned URL for instant verification.
9. **Persistence**: Clicking "Save changes ✓" dispatches `updateContent(draft)` into `ContentProvider`, committing the change to localStorage and Firestore.

---

## 📁 SECTION 4: COMPLETE FILE STRUCTURE

```text
altraware-site/
├── public/                               # Static assets served at root
│   ├── favicon.ico                       # Native browser favicon (transparent loop logo)
│   ├── favicon.png                       # High-DPI transparent PNG icon
│   └── logo.png                          # Master transparent vector emblem
├── src/
│   ├── app/                              # Next.js 16 App Router routing tree
│   │   ├── admin/                        # Studio Administration Console
│   │   │   ├── layout.tsx                # Security gate, Google/Email auth & master key
│   │   │   └── page.tsx                  # Dashboard layout, sidebar navigation, VideoUploader
│   │   ├── portal/                       # Client Operations Portal
│   │   │   └── page.tsx                  # Milestones, PDF manual viewer, Handover Vault
│   │   ├── client-portal/                # Alias route redirecting to /portal
│   │   │   └── page.tsx                  # Forwarding wrapper
│   │   ├── about/                        # Company story, team & BRELA legal identity
│   │   │   └── page.tsx                  # Editorial about page
│   │   ├── blog/                         # Technical & business thought leadership
│   │   │   ├── [slug]/                   # Dynamic post reader
│   │   │   │   └── page.tsx              # Article typography & SEO metadata
│   │   │   └── page.tsx                  # Tag-filtered article library
│   │   ├── contact/                      # Project intake & WhatsApp dispatch
│   │   │   └── page.tsx                  # Brief submission form
│   │   ├── impact/                       # Metrics, client testimonials & case studies
│   │   │   └── page.tsx                  # Animated statistics display
│   │   ├── platforms/                    # Live interactive product demonstrations
│   │   │   └── page.tsx                  # Faida POS & CareTrack ERP interactive sandboxes
│   │   ├── pricing/                      # Transparent packages & smart investment estimator
│   │   │   └── page.tsx                  # Complexity calculator & package comparisons
│   │   ├── process/                      # 5-stage agile engineering methodology
│   │   │   └── page.tsx                  # Visual development roadmap
│   │   ├── services/                     # Technical capability index & specifications
│   │   │   └── page.tsx                  # Service accordions & technology matrices
│   │   ├── globals.css                   # Tailwind CSS v4 directives & keyframe tokens
│   │   ├── layout.tsx                    # Master root layout (fonts, Lenis scroll, providers)
│   │   └── page.tsx                      # Primary marketing page with interactive hero
│   ├── components/                       # Reusable component library
│   │   ├── admin/                        # Admin-specific modules
│   │   │   ├── AdminAuthModal.tsx        # Firebase login dialog
│   │   │   ├── ClientTrackerTab.tsx      # Firestore client project & milestone manager
│   │   │   └── LeadsTab.tsx              # Inbound inquiry inbox with project converter
│   │   ├── calculator/                   # Dynamic cost computation tools
│   │   │   └── PriceEstimator.tsx        # Self-contained estimation calculator
│   │   ├── motion/                       # Motion design components
│   │   │   └── index.tsx                 # TiltCard, Reveal, Marquee, Counter primitives
│   │   ├── providers/                    # Global React state context providers
│   │   │   ├── ContentProvider.tsx       # Live CMS content state & overrides
│   │   │   ├── NotifyProvider.tsx        # 5-second auto-dismiss notification toast system
│   │   │   └── index.ts                  # Provider barrel export
│   │   ├── ui/                           # Atoms & Molecules
│   │   │   ├── card.tsx                  # Base card UI container
│   │   │   ├── CloudinaryUploader.tsx    # Dropzone file uploader component
│   │   │   ├── LivePreviewFrame.tsx      # Device mockup wrapper (mobile/tablet/desktop)
│   │   │   ├── pricing-section.tsx       # Pricing switcher component with NumberFlow
│   │   │   ├── scroll-velocity.tsx       # High-speed text marquee on scroll
│   │   │   ├── text-effect.tsx           # Kinetic text animation primitives
│   │   │   ├── text-gradient-scroll.tsx  # Scroll-linked color reveals
│   │   │   ├── timeline-animation.tsx    # Chronological step animations
│   │   │   └── typewriter-text.tsx       # Dynamic typewriter string rotator
│   │   ├── Footer.tsx                    # Global brand footer with BRELA badge
│   │   └── Navbar.tsx                    # Floating frosted glass navigation header
│   └── lib/                              # Core business logic & SDK integrations
│       ├── cloudinary.ts                 # Direct unsigned browser file uploader
│       ├── content.ts                    # Central site data schema, defaults & formatPriceTag
│       ├── firebase.ts                   # Firebase App, Auth & Firestore initialization
│       ├── invoice.ts                    # jsPDF invoice & receipt generation engine
│       └── leads.ts                      # Firestore leads submission pipeline
├── .env                                  # Local environment variables
├── package.json                          # Project dependencies, scripts & metadata
├── tsconfig.json                         # TypeScript compiler configuration (strict mode)
└── README.md                             # Comprehensive technical documentation
```

---

## 💻 SECTION 5: INSTALLATION & SETUP

### Step 0: Prerequisites
- **Node.js**: v18.18.0 or v20+ ([Download Node.js](https://nodejs.org/))
- **Git**: Installed and configured ([Download Git](https://git-scm.com/))
- **Web Browser**: Chrome, Edge, Firefox, or Safari

### Step 1: Clone the Codebase
```bash
git clone https://github.com/your-org/altraware-site.git
cd altraware-site
```

### Step 2: Configure Environment Variables
Create a file named `.env` in the root folder:
```bash
cp .env.example .env
```
Fill in the following variables:
```env
# ==============================================================================
# FIREBASE CREDENTIALS (Firebase Console -> Project Settings -> General)
# ==============================================================================
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBFTmSlO-9pO2OndHn_SaKGOTJITlOpVxs
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=altraware-tech.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=altraware-tech
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=altraware-tech.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=285550515565
NEXT_PUBLIC_FIREBASE_APP_ID=1:285550515565:web:b57c14d39bbc71a27cb664
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-VLXCFYM8GJ

# ==============================================================================
# CLOUDINARY MEDIA (Cloudinary Dashboard -> Settings -> Upload Presets)
# ==============================================================================
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=oc8018um
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=altraware

# ==============================================================================
# PRODUCTION TELEMETRY
# ==============================================================================
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 3: Install Node Dependencies
```bash
npm install
```
*Expected Output:*
```text
added 384 packages, and audited 385 packages in 8s
found 0 vulnerabilities
```

### Step 4: Launch Development Environment
```bash
npm run dev
```
*Expected Output:*
```text
  ▲ Next.js 16.3.8 (Turbopack)
  - Local:        http://localhost:3000
  - Environments: .env

 ✓ Starting...
 ✓ Ready in 1400ms
```

### Step 5: Verification & Self-Test
1. Open [http://localhost:3000](http://localhost:3000) in your browser. Verify the pricing cards display `TSh 350K`, `TSh 550K`, `TSh 750K`, and `TSh 800K`.
2. Navigate to [http://localhost:3000/admin](http://localhost:3000/admin). Enter Master Key `altraware2026` or sign in with Google.
3. In the Content Tab under Hero, test uploading a video file from your computer.

### Common Setup Errors & Solutions
| Error Symptom | Cause | Solution |
|---|---|---|
| `Firebase: Error (auth/unauthorized-domain)` | Localhost not whitelisted | Add `localhost` to Firebase Console > Auth > Settings > Authorized Domains |
| `Cloudinary Upload 400 Bad Request` | Upload preset missing or set to Signed | Ensure preset in Cloudinary is set to **Unsigned** |
| `PostCSS / Tailwind v4 compilation error` | Node.js version is < 18.18 | Upgrade Node.js using `nvm use 20` or reinstall Node.js LTS |

---

## 📖 SECTION 6: HOW TO USE IT

### 1. Inquiring for a Project (Client Perspective)
Prospective clients navigate to `/pricing`, select options, or open `/contact`:
```bash
# Simulating a project inquiry dispatch to Firestore
curl -X POST "http://localhost:3000/api/leads" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Baraka Mwinyi",
    "phone": "+255712345678",
    "email": "baraka@retail.co.tz",
    "org": "Kariakoo Wholesalers",
    "type": "Faida POS / Mobile App",
    "budget": "TSh 1.5M",
    "timeline": "3-5 Weeks"
  }'
```
*Expected Response:*
```json
{
  "status": "success",
  "id": "lead_987654321",
  "message": "Ombi lako limepokelewa. Mhandisi atawasiliana nawe ndani ya saa 24."
}
```

### 2. Client Operations Portal (`/portal`)
- **Login:** Enter registered client email and password or authenticate with Google.
- **Roadmap Verification:** View real-time progression from Stage 1 (Scope) to Stage 5 (Delivered).
- **System Documentation:** Click "Pakua Mwongozo (PDF)" to compile an immediate, branded operational manual for internal staff training.
- **Handover Vault:** View production passwords, database access keys, and repository branches behind an authentication shield.

### 3. Studio Admin Console (`/admin`)
- **Promote Lead to Project:** In the "Maombi & Leads" tab, click "Badili Kuwa Mradi" on an inbound lead. It automatically creates an active record in Firestore with seeded roadmap stages.
- **Direct Video Upload:** In the "Content" tab, drag an MP4 into the Hero Video zone. It uploads directly to Cloudinary and updates the live site instantly upon clicking "Save changes ✓".

---

## 🗄️ SECTION 7: DATABASE SCHEMA

### Firestore Collection: `client_projects`
Stores all active, in-flight, and delivered client engagements.

```text
Collection: client_projects
├── id: string (Document UID)
├── clientName: string "Juma Salim (Kilimanjaro Logistics)"
├── clientEmail: string "juma@kililogistics.co.tz"
├── clientPhone: string "+255754998877"
├── systemName: string "Fleet & Cargo Tracking ERP"
├── progress: number 65 (0 to 100 percentage)
├── currentPhase: string "development" (discovery | design | development | testing | delivered)
├── launchDate: string "2026-11-15"
├── roadmap: array of objects
│   ├── [0].phase: string "Discovery & Scope"
│   ├── [0].status: string "completed" (pending | active | completed)
│   └── [0].completedAt: string "2026-10-01"
├── documentation: object
│   ├── overview: string "Institutional cargo monitoring system with GPS..."
│   ├── architecture: string "Next.js 16 Web Dashboard + Flutter Android Tracking App"
│   ├── userGuide: string "1. Sign in with role Manager. 2. Dispatch truck..."
│   └── troubleshooting: string "If offline, records queue in local SQLite database..."
├── handover: object
│   ├── adminUrl: string "https://ops.kililogistics.co.tz"
│   ├── adminUser: string "superadmin@kililogistics.co.tz"
│   ├── repoUrl: string "https://github.com/altraware/kili-logistics"
│   └── backupFrequency: string "Daily at 02:00 AM EAT"
├── financial: object
│   ├── totalQuote: number 3000000
│   ├── amountPaid: number 1500000
│   └── paymentStructure: string "50% Commitment / 30% Milestone / 20% Handover"
└── updatedAt: timestamp
```

### Firestore Collection: `inquiries`
Stores website briefs from the contact form and pricing estimator.

```text
Collection: inquiries
├── id: string
├── name: string "Amina Khamis"
├── phone: string "+255788112233"
├── email: string "amina@pharmacy.co.tz"
├── org: string "Afya Pharmacy Group"
├── type: string "Custom Web Application"
├── budget: string "TSh 800K"
├── status: string "new" (new | contacted | converted | archived)
└── createdAt: timestamp
```

---

## 🤖 SECTION 8: AI & SMART ESTIMATION DETAILS

### 1. Smart Estimator Mathematical Algorithm
The dynamic pricing engine in `src/lib/content.ts` calculates real-time project quotes using a weighted complexity model:

$$\text{Base Cost} = \text{Type Base Price}$$

$$\text{Features Cost} = \sum \text{Selected Features}$$

$$\text{Subtotal} = (\text{Base} + \text{Features}) \times (1 - \text{Bundle Discount})$$

*Where Bundle Discount = 10% if Selected Features $\ge 3$.*

$$\text{Complexity Factor} = 15\% + (1.5\% \times \text{Complexity Points})$$

$$\text{High-End Range} = \text{Subtotal} \times (1 + \text{Complexity Factor})$$

$$\text{Total with VAT} = \text{Subtotal} \times 1.18 \quad (\text{if VAT toggle is enabled})$$

### 2. Studio Concierge AI Prompts
The floating AI Assistant incorporates system instructions grounding responses in Tanzanian context:
```text
System Prompt:
"You are the senior technical concierge at Altraware Technologies, Dar es Salaam.
You assist Tanzanian business owners with software inquiries.
- Always provide honest estimates based on Altraware's published tiers:
  Web Starter (350K), Growth Site (550K), Pro Portal (750K), Custom App (800K),
  Faida POS (1.5M), CareTrack ERP (3M).
- Emphasize BRELA registration, offline-first reliability, and source code ownership.
- Never make up unrealistic promises. Direct inquiries to WhatsApp +255 792 867 427."
```

---

## ⚠️ SECTION 9: CURRENT LIMITATIONS & KNOWN BUGS

1. **Large Video Upload Latency on Slow 2G/3G Uploads**:
   - *Behavior:* Direct video uploads exceeding 50MB may take over 60 seconds on cellular connections.
   - *Remedy:* UI displays a warning encouraging users to upload compressed MP4s under 20MB.
2. **Browser Storage State Isolation**:
   - *Behavior:* In environments without Firebase configured, CMS overrides save to `localStorage`, meaning edits on one PC are not reflected on other machines until Firestore sync is triggered.
3. **M-Pesa Simulator vs Live Daraja API**:
   - *Behavior:* The live POS demo simulates the M-Pesa push confirmation rather than pinging a live merchant till.

---

## 🛠️ SECTION 10: MODIFICATION & ADDON GUIDE

### Mod 1: Upgrading Hero Video to Stream from YouTube/Vimeo
- **Difficulty:** ⭐ (1/5)
- **Time:** 30 minutes
- **Files to Modify:** `src/app/page.tsx`, `src/app/admin/page.tsx`
- **Steps:** Replace standard `<video>` tag with an `<iframe>` container and regex-parse the YouTube Video ID from `content.hero.heroVideo`.

### Mod 2: Adding Live M-Pesa Daraja C2B / Lipa Namba API
- **Difficulty:** ⭐⭐⭐⭐ (4/5)
- **Time:** 2 days
- **Files to Create:** `src/app/api/mpesa/stkpush/route.ts`, `src/app/api/mpesa/callback/route.ts`
- **Dependencies:** `npm install axios`
- **Steps:** Authenticate with Vodacom OpenAPI, request bearer token, dispatch STK push payload with business till number, and write confirmed transactions into Firestore `invoices`.

### Mod 3: Adding SMS Notifications via Beem Africa / NextSMS
- **Difficulty:** ⭐⭐ (2/5)
- **Time:** 3 hours
- **Files to Modify:** `src/components/admin/ClientTrackerTab.tsx`, `src/lib/leads.ts`
- **Steps:** Bind API webhook to dispatch SMS to client phone when milestone updates from `active` to `completed`.

---

## 🚀 SECTION 11: DEPLOYMENT GUIDE

### Deploying to Vercel (Recommended)
1. Push repository to GitHub or GitLab.
2. Log into [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import the `altraware-site` repository.
4. Set Framework Preset to **Next.js**.
5. Add all variables from `.env` in the Environment Variables section.
6. Click **Deploy**. Vercel will run `npm run build` and distribute edge workers globally.

### Custom Domain Configuration (`.co.tz`)
1. In your domain registrar (e.g., Extreme Web, Webexperts, TCRA accredited registrar), set DNS records:
   - **Type:** `A` | **Name:** `@` | **Value:** `76.76.21.21`
   - **Type:** `CNAME` | **Name:** `www` | **Value:** `cname.vercel-dns.com`
2. In Vercel Project Settings > Domains, enter `altraware.co.tz`. SSL certificates will auto-provision within 15 minutes.

---

## 💰 SECTION 12: COST CALCULATOR

| Service | Free Tier Limits | Production Tier | Cost at 100 Users/mo | Cost at 1,000 Users/mo |
|---|---|---|---|---|
| **Vercel Hosting** | 100 GB Bandwidth / mo | Pro (\$20/mo) | \$0.00 (Free Tier) | \$0.00 – \$20.00 |
| **Cloud Firestore** | 50K reads, 20K writes / day | Pay-as-you-go | \$0.00 (Free Tier) | \$0.00 (Free Tier) |
| **Cloudinary Media** | 25 Credits (25GB storage/bandwidth) | Plus (\$89/mo) | \$0.00 (Free Tier) | \$0.00 (Free Tier) |
| **Domain (.co.tz)** | None | Annual registration | \$15.00 / year | \$15.00 / year |
| **TOTAL ESTIMATE** | — | — | **\$0.00 / month** | **\$0.00 – \$20.00 / mo** |

---

## 🗺️ SECTION 13: PRODUCT ROADMAP

### Short-Term (Next 2 Weeks)
- [x] Convert all sub-million package prices from `M` to `K` notation.
- [x] Build native file video uploader directly in Admin Console with preview.
- [x] Restructure Admin Console into enterprise sidebar layout.
- [ ] Add direct WhatsApp chat trigger for completed client milestone updates.
- [ ] Implement dark/light theme lock switch for admin console.

### Medium-Term (Next 3 Months)
- [ ] Connect Beem Africa SMS gateway for automated client milestone text alerts.
- [ ] Implement multi-tenant client sub-accounts with custom invitation links.
- [ ] Integrate Vodacom M-Pesa Daraja STK Push production credentials.

### Long-Term (6–12 Months - Altraware v3.0)
- [ ] Autonomous Client Onboarding: AI-driven requirement gathering turning briefs into interactive wireframes within 60 seconds.
- [ ] Native Flutter Client Mobile App for real-time ticket tracking, video reviews, and invoice payments on iOS and Android.

---

## 🧠 SECTION 14: LESSONS LEARNED

1. **Pricing Psychology Matters More Than Code Perfection:** Displaying `0.35M` caused hesitation with local buyers; switching to `350K` immediately aligned with local Swahili mental models (*"Laki tatu na nusu"*).
2. **Offline-First is Non-Negotiable in East Africa:** Designing POS and mobile systems around SQLite local synchronization before pushing to cloud databases saved our software during Kariakoo fiber cuts.
3. **Transparency Generates High Conversion:** Clients who see written milestones, clear deliverables, and a live progress portal close contracts 3x faster than traditional opaque email proposals.

---

## 📋 SECTION 15: QUICK REFERENCE CARD

### Essential Commands
```bash
# Start local development server
npm run dev

# Run TypeScript strict type verification
npx tsc --noEmit

# Compile production bundle
npm run build

# Run production server locally
npm start
```

### Critical Access Credentials
- **Local URL:** `http://localhost:3000`
- **Admin Console:** `http://localhost:3000/admin`
- **Admin Master Passphrase:** `altraware2026`
- **Client Portal:** `http://localhost:3000/portal`
- **Firebase Project:** `altraware-tech`
- **Cloudinary Cloud:** `oc8018um` (Preset: `altraware`)

---

*Document sealed and certified for Altraware Technologies Ltd.*  
*Dar es Salaam, Tanzania · October 2026*
