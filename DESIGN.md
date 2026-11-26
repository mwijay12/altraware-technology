# ALTRAWARE — DIRECTION v4 "USIKU" (night)
### Built from what the two references actually do, not what they look like.

---

## The finding: accent colour was never the problem

Measured from the two reference repos:

| | Parallax-website | site-unixstudio | **Altraware (old)** |
|---|---|---|---|
| Ground | `#0a0a0a` | `#121212` | cream |
| Accent colours | **0** (pure mono) | **1** acid lime | **6** hues competing |
| Accent instances in the whole stylesheet | 0 | **6** | 618 (`viol`) |
| Display type | Syne 800, 85–130px, uppercase | Panchang/Hubot, 70px | Fraunces 400, 60px |
| Outline/stroke text as texture | yes | yes | no |
| Scroll-scrubbed parallax layers | yes | yes | no |
| Full-bleed image moments | yes | yes | tilt cards |

**The tell was never purple.** It was purple 618 times: as eyebrow, link, hover,
focus ring, check, icon tile, badge, glow, curtain, price highlight. A colour
used everywhere is not a brand, it is just noise with a hex code.

Unix Studio proves the point from the other side: it has a loud acid lime and
still reads as premium, because it appears **six times in the entire site**.

### So: keep purple. Use it like a jewel, not a wash.

**Budget: 8 violet appearances on the whole home page.** Every one earns its
place:
1. Hero glow behind the headline (one soft bloom, not five)
2. The single primary CTA
3. Active nav underline
4. One underlined link keyword per section (max 3 sections)
5. Focus ring

Everything else is monochrome. If violet shows up a tenth time, cut it.

---

## Palette — locked

| Role | Token | Value | Note |
|---|---|---|---|
| Ground | `--noir` | `#0B0A0F` | near-black **with a violet undertone**, never `#000` |
| Ground-2 | `--noir-2` | `#121018` | section shift only, no borders |
| Ink/text | `--bone` | `#EDE9E3` | warm off-white, never `#fff` |
| Muted | `--ash` | `#8A8580` | secondary copy |
| Structure | `--wire` | `#26232E` | 1px hairlines |
| **Accent** | `--violet` | `#8B5CF6` | 8 uses maximum per page |
| Accent-deep | `--violet-deep` | `#4C1D95` | glow bloom only, never a fill |

No other hue. No green/amber/sky/red unless it is a real state (form error,
success). No gradients except the violet bloom, which is radial and used once.

## Type — locked

- **Display: Syne 700/800** — uppercase, tight tracking, huge. This is what
  makes the reference feel like a studio and not a startup.
- **Body/UI: Space Grotesk** (already a dependency) — 400/500.
- **Mono: Space Grotesk tabular** for numerals, or JetBrains Mono.
- Outline text (`-webkit-text-stroke`) as a texture device on section titles —
  this is the single most recognisable move in both references.
- Scale: 14 / 16 / 19 / 24 / 32 / 48 / 72 / 96 / 130px. Display sizes go much
  larger than v3; that is where the drama comes from.

## Motion — parallax, done properly

Taken from the references, rebuilt for React/GSAP:

1. **Scroll-scrubbed layers** — `scrub: 1.2`, multiple depths. Text moves
   slower than images; images move slower than the background.
2. **Hero entrance** — headline characters rise from a mask, then the hero
   image's `clip-path` opens from a centre sliver to full-bleed.
3. **Section titles** — outline word slides one way, solid word the other.
4. **Marquee** — one continuous strip between sections (the references both
   use this as a rhythm device).
5. **Mouse parallax** — the small star/circle decor drifts against the cursor.
6. `prefers-reduced-motion` kills all of it and the page is still complete.

## Structure of the home page

1. **Hero** — full viewport. Giant Syne headline with one outlined word, one
   violet bloom behind it, full-bleed image revealing on load, marquee pinned
   to the bottom.
2. **Statement** — large type over a parallax image, generous negative space.
3. **Services** — numbered list (`/01 … /03`), hairline rows, an arrow that
   flies horizontally as you scroll past.
4. **Work** — asymmetric, staggered: images at different scroll speeds, big
   numerals, no equal card grid.
5. **Proof / numbers** — one line of real counts.
6. **Closing** — huge outline word, one CTA.

---

## Image defects found (the "broken pics")

Confirmed from the source, independent of network:

| # | Defect | Count | Fix |
|---|---|---|---|
| 1 | Feature-film files (`sintel/trailer.mp4`, `bunny/movie.mp4`) rendered as product video tiles captioned "replace with your reel" | 5 | remove the tiles; only show video where it is the actual product |
| 2 | Stock photos standing in for a product screenshot — CareTrack and ShuleDirectPro show an Unsplash hospital/school photo under a caption that says "attendance & medical records" | 2 | swap to the real screenshot, or drop the tile |
| 3 | Project screenshots requested at `w_600` and rendered in ~420 px retina cards (needs 840+) → visibly soft, reads as broken | 9 | request `w_1200` / `dpr_2.0` |
| 4 | Hero `<Image>` fetches `images.unsplash.com` at `w=900` for an 800×520 slot; Unsplash rate-limits and 503s under load | 1 | local poster, no third-party at LCP |
| 5 | No `onError` anywhere → a failed load leaves an empty box with no fallback | all | `MediaImage` component with a dark placeholder + label |

Also: the site never exercises a broken-image path because every tile assumes
success. `MediaImage` fixes that class of bug permanently.

---

## Rollout

| Act | Scope |
|---|---|
| 1 | Tokens, Syne + Space Grotesk, primitives, dark shell (nav/footer/transition) |
| 2 | Home page rebuilt on parallax layers |
| 3 | `MediaImage` + content hygiene (defects 1–5) |
| 4 | Inner pages inherit the shell |

Verification: `tsc --noEmit`, `next build`, `eslint`, plus a rendered-HTML
count of violet occurrences (must be ≤ 8 on `/`) and a broken-media scan.
