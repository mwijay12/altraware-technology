# ALTRAWARE — DESIGN BRIEF (v3 "Karatasi")
### The de-slop plan. This file is the constraint layer: every screen must obey it.

> Why this file exists: AI-built sites look generic because nobody locked the
> decisions, so every section re-invents itself from the statistical average.
> This document *is* the decision. If a change contradicts this file, the change
> is wrong.

---

## 0. WHAT THE SITE IS (one sentence)

Altraware is a **software studio in Dar es Salaam that ships working systems** —
Faida POS, CareTrack, UAUT Connect, Nike TZ — in Kiswahili and English, for
networks that drop and money that moves by M-Pesa.

The site's only job: make a serious buyer believe that sentence in under 60
seconds, and give them a way to start.

Not "a cinematic journey". Not "Act I". Not "technology that speaks our language".
Those are theatre. **Proof is the product.**

---

## 1. THE AUDIT — measured tells

Not vibes. Counted.

| # | Tell | Evidence in this repo |
|---|---|---|
| 1 | **Purple is the default** | 618 `viol` references across 28 files. Violet = eyebrow, link, hover, focus ring, check, icon tile, transition curtain, badge, price highlight, glow shadow. #7C3AED → #5B21B6 gradient is the single most-cited AI-design tell. |
| 2 | **Brand-hero recipe** | badge+pulse → typewriter → 40px rule → eyebrow → H1 with one accent word → subtitle → 2 pill CTAs → tech-logo row → 3D tilt image → 2 floating glass cards → rotating circular badge → bouncing scroll arrow. Every item is a known template. Stacked. |
| 3 | **Invented telemetry** | "99.98% uptime", "24ms", "Production Node · DSM", "0.8s avg sale", "1.4s load on 3G", "+212% enquiries", "#1 rank target keywords", "48 children per centre (typical)", "3× faster stock-take". Fabricated specificity is the deepest slop tell — it looks like instrumentation, it is decoration. |
| 4 | **Section cloning** | 10 sections on `/`, 8 shaped Hero→Eyebrow→H1→sub→three-cards. Every page opens with the identical hero shell. `/services` and `/` share the same H1 verbatim ("Three crafts. One standard: excellent."). |
| 5 | **Motion as wallpaper** | 15 `TextEffect` instances on home; fade+slide+blur word-stagger mixed *inside one heading*; 2 ScrollVelocity rows × 7 pills; infinite ✦ marquees; TiltCard on nearly every box; 700ms GSAP curtain wipe on every nav. When all motion is loud, none of it means anything. |
| 6 | **Card-on-card** | `rounded-full` 48×, `rounded-3xl` 4× on home alone; border + shadow + glow on the same box; glass-white; emoji (🏪🏫) next to FA icons next to text glyphs. |
| 7 | **Rainbow leakage** | green, amber, emerald, sky, red, purple + violet = 6 decorative hues fighting each other. |
| 8 | **Tagline stacking** | Four slogans in one viewport ("Rooted at home / Mizizi ya nyumbani / KISWAHILI FIRST • GLOBAL CRAFT / Technology that speaks our language"), plus "SCROLL TO BEGIN THE STORY". Punchy couplet headlines ("Don't take our word. Touch the software." / "No surprises. Just a clear njia.") — an LLM rhythm tell. |
| 9 | **Stock stand-ins** | Hero "Dar es Salaam" = Unsplash. Testimonial portrait "Neema Mwakalinga" = Unsplash. Demo reels = Big Buck Bunny + Sintel with captions literally reading *"replace with your reel"*. Contradicts "All live. All ours." |

### What is real and must be protected
- **Shipped, linkable work** — Faida POS, UAUT Connect, Nike TZ, CareTrack, Mwijay, Aymi, Volta + Cloudinary screenshots of the actual UIs. This is the moat. Make it the loudest thing on the page.
- **Bilingual identity** — Kiswahili is operational, not decorative.
- **Offline-first / M-Pesa / 2G specifics** — genuinely rare, genuinely credible.
- **Published pricing** with written agreements.
- **Founders with faces.**
- The portal/admin system (untouched by this brief).

---

## 2. THE DIRECTION — "Karatasi"

Swahili: *paper*. The site should feel like a **studio monograph printed in Dar
es Salaam** — warm stock, hairline rules, one ink, one clay red, real photographs,
and typography doing the work that gradients were doing.

Deliberately the opposite of the default: no violet wash, no glass, no glow, no
gradient text, no orbs, no typewriter, no fake dashboards.

### 2.1 Palette — three hues, locked

| Role | Token | Value | Use |
|---|---|---|---|
| Ground (60%) | `--paper` | `#F4EFE6` | page background. Warm off-white — never `#fff`, never `#fafafa`. |
| Ink (30%) | `--ink` | `#16130D` | text, dark sections. Warm near-black, never `#000`. |
| Accent (10%) | `--clay` | `#A63D2A` | terracotta. **Max 3 appearances per screen.** Links, the active state, one underline. |
| Structure | `--rule` | `#DCD3C4` | 1px hairlines. This replaces borders+shadows. |
| Paper-2 | `--paper-2` | `#EAE3D6` | the *only* card separation. |
| Deep | `--forest` | `#1B2721` | optional dark band (used at most twice per page). |

Rules:
- Violet `#7C3AED` survives **only inside the logo mark**. Not as a UI colour.
- No gradients anywhere except a photograph.
- Semantic colours (success green / warning amber) only for real state, never decoration.
- Radii: `2px` tags · `6px` cards · `999px` **only** for buttons and article pills. No `rounded-3xl`.

### 2.2 Type — two voices, loud contrast

- **Display:** Fraunces (already installed) — weight **400/500, never 700**. Compressed tracking (−0.02em). It carries the personality.
- **Body/UI:** Inter — 400/500. Never as a headline.
- **Mono/labels:** IBM Plex Mono for prices, dates, measurements, coordinates. Replaces the current "eyebrow + 0.32em letterspacing" reflex.
- Scale (editorial ×1.333): 13 / 15 / 17 / 22 / 30 / 40 / 54 / 72px. Nothing else.
- Headlines: **sentence case**, max 2 lines mobile / 1–2 desktop. No `titleCase Everything`. No punchy couplets.
- Kiswahili appears where it *means* something (section labels, product names, the actual words clients use) — not as a decorative subtitle under every English line.

### 2.3 Layout — asymmetry over the three-card reflex

- One 12-col grid, outer margin wide (max 1200px content).
- Section headers: **left-aligned**, mono kicker, Fraunces statement. No centred stacks, no 40px rule + eyebrow + accent word.
- Cards: **borderless by default.** Separate with space first, `--paper-2` second. A hairline only when a table needs it.
- 3-up grids: allowed **once** on the entire home page.
- Numbers and prices are set in mono, aligned, no pills.

### 2.4 Motion — one idea per screen

- Section entrance: `opacity 0→1`, `y 12px→0`, 400ms, ease-out, **once**. No per-word staggering.
- One (1) signature motion on the home page — an image that resolves (clip/scale) as you enter. Everything else is still.
- Hover: colour + underline. No tilt, no lift, no glow.
- Page transition: 180ms ink wipe. No logo, no word, no curtain columns.
- Respect `prefers-reduced-motion` everywhere; nothing loops forever except a single
  "currently shipping" text ticker (which carries real information).

### 2.5 Imagery

- **Real product screenshots** (already in Cloudinary) are the hero. UI at 1× on a
  paper frame, with the domain in mono beneath.
- Real Dar es Salaam photography — warm, filmic, people at work. If we don't have
  it, we use a *placeholder clearly marked for the founders to replace*, never a
  fake testimonial portrait.
- No Big Buck Bunny / Sintel. Video only if it's actually the product.
- Delete every fabricated statistic from `content.ts` or replace with a verifiable
  count (e.g. "7 systems in production" — count the projects array).

### 2.6 Copy

- Delete: "unlock/unleash/elevate/seamless/robust/leverage/bespoke/cutting-edge",
  "in today's world", "whether you're…", "not just X, but Y", tagline stacks.
- Prefer: a number, a place, a constraint, a name. "Stock-take in Kariakoo takes a
  third of the time. It works with the router off." beats "3× faster operations."
- One claim per sentence. Price in the first paragraph of the pricing page.

---

## 3. THE REBUILD — home page narrative

Current: 10 sections, 8 of them the same shape.
New: **6 movements**, each a different shape on purpose.

1. **Statement** — full-bleed. Fraunces line ("Mizizi ya nyumbani. Ufundi wa
   kidunia.") at display scale, one paragraph, one CTA + WhatsApp. Real
   photograph or the Faida POS terminal. No badge, no typewriter, no floating cards.
2. **Proof** — the loudest section. Rows of real deployments: screenshot, project
   name, what it does in one line, live URL, year. Editorial list, not a card grid.
   This is what no competitor in TZ can post.
3. **How we work** — the 5 phases as a numbered typographic list (mono numerals,
   hairline rules). Headline claim: written scope, fixed price, before any code.
4. **What we build** — 3 services, editorial rows. Pricing anchored to each.
5. **Who builds it** — founders, faces, one real client quote, the studio address.
6. **Start** — one paragraph, price floor stated plainly, contact + WhatsApp.

Removed entirely: ScrollVelocity pill clouds, tech-logo row, 3D tilt image stack,
"Altraware Core 99.98%" card, code-snippet card (fake), rotating badge,
counter animations, "SCROLL TO BEGIN", ✦ marquee, 4 of the 6 taglines.

---

## 4. ROLLOUT

| Act | Scope | Status |
|---|---|---|
| 0 | Tokens + type + primitives (`globals.css`, `layout.tsx`) | ✅ done |
| 1 | Home rebuild (`src/app/page.tsx`) | ✅ done — 6 movements |
| 2 | Shell: `Navbar`, `Footer`, `PageTransition`, overlays (`FloatingAI`, `ProjectModal`) | ✅ done |
| 3 | Inner-page rebuilds (`about`, `services`, `pricing`, `process`, `impact`, `platforms`, `contact`) | ⬜ next — they inherit the palette and rhythm, but still carry v2 card markup |
| 4 | Content truth pass (`lib/content.ts`) | ⏸ deferred by owner — invented figures stay for now, `npm run audit:design` keeps flagging them |

### What Act 0–2 actually changed
- Palette locked to paper / ink / clay / rule; `viol`, `violL`, `violD` are
  **remapped** in `@theme` to clay and its tints, so ~600 legacy utility usages
  across the inner pages resolve to the accent without touching their markup.
- Self-hosted **Fraunces** (wght + SOFT + WONK), **Instrument Sans**, **Plex Mono**
  from `public/fonts` — no Google Fonts request on first paint, and the build
  works with no network.
- Components live in `@layer components` so Tailwind utilities still override them,
  and the default type scale is untouched so inner pages keep their sizing.
- Home: 10 sections → 6, one three-column grid, 0 gradients / glass / orbs /
  glow, one signature motion (pure CSS ink-part reveal, skipped under
  `prefers-reduced-motion`).
- Nav: masthead instead of a floating pill; scroll state written to a data
  attribute instead of React state. Page transition: 180 ms ink veil instead of
  a 700 ms violet column curtain.
- `services`/`impact` no longer import the home page bundle
  (`components/marketing.tsx`).

**Verification each act:** `npx tsc --noEmit`, `npx next build`,
`npx eslint src`, plus `npm run audit:design` against the running server.

---

## 5. ACCEPTANCE TEST — `npm run audit:design`

Executable, not a checklist you tick by eye. It counts signatures in the
**rendered HTML** and fails the build if a rebuilt route regresses.

```
✓ /              clean (77.5 KB)
~ /about         visual pass · legacy debt: violet class names: 24, …
✗ /services      fabricated claims: +212%, 1.4s load
```

`✓` clean · `~` passes the visual tier, still owes v2 markup · `✗` fail.

Tier 1 (fails everywhere): gradients · backdrop blur · glow shadows ·
bounce/ping loops · fabricated figures.

Tier 2 (fails on rebuilt routes only): violet class names · blur orbs ·
three-column grids · `rounded-3xl` · `rounded-full`.

Home page limits: **0** gradients, **0** glass, **0** orbs, **0** glow,
**0** invented numbers, **1** three-column grid, **3** radii.

Human check on top of the script: every headline sentence-cased and ≤ 2 lines,
every claim traceable to a shipped thing or a named person.
