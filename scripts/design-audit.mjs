#!/usr/bin/env node
/**
 * scripts/design-audit.mjs
 *
 * Counts the slop signatures DESIGN.md forbids, against real rendered
 * HTML — not the source. Run the dev server (or point BASE at prod):
 *
 *   node scripts/design-audit.mjs                      # default routes
 *   BASE=https://altraware.example node scripts/design-audit.mjs / /pricing
 *
 * Two tiers:
 *   VISUAL — things that read as AI-made on screen. Fail on every route.
 *   LEGACY — v2 class names still in inner-page markup. Fail only on the
 *            routes that have been rebuilt (REBUILT). Elsewhere they are
 *            reported as debt, because @theme remaps them to clay.
 */

const BASE = (process.env.BASE || "http://localhost:3000").replace(/\/$/, "");
const args = process.argv.slice(2);
const ROUTES = args.length
  ? args
  : ["/", "/about", "/services", "/pricing", "/process", "/impact", "/platforms", "/contact", "/blog"];

/** Routes that must pass the full test. Everything else reports debt. */
const REBUILT = new Set(["/"]);

/** Visible tells. Never acceptable, anywhere. */
const VISUAL = {
  "gradient fills / gradient text": /bg-gradient|bg-clip-text/g,
  "glass / backdrop blur": /backdrop-blur/g,
  "glow shadows": /shadow-(?:xl|2xl)\b|shadow-viol/g,
  "bounce / ping loops": /animate-(?:bounce|ping)\b/g,
};

/** Ownership of the design system. Must be zero on rebuilt routes. */
const LEGACY = {
  "violet class names": /\b(?:text|bg|border|from|to|via)-viol\b/g,
  "blur orbs": /blur-\[1[0-9][0-9]px\]/g,
  "three-column grid": /(?:sm|md|lg):grid-cols-3/g,
  "large radius (rounded-3xl)": /rounded-3xl/g,
  "collision radius (rounded-full)": /rounded-full/g,
};

/** Per-route budgets for the legacy tier. */
const BUDGET = {
  "rounded-full": 4,
  "three-column grid": 1,
};

/** Claims the audit found to be invented. Re-add only with a source. */
const FABRICATED = ["99.98%", "24ms", "+212%", "1.4s load", "0.8s", "Production Node", "99.9%"];

function count(body, re) {
  return (body.match(re) || []).length;
}

async function audit(route) {
  const res = await fetch(BASE + route);
  if (!res.ok) return { route, error: `HTTP ${res.status}` };
  const html = await res.text();
  const body = html.replace(/<script[\s\S]*?<\/script>/g, "");

  const fails = [];
  const debt = [];

  for (const [name, re] of Object.entries(VISUAL)) {
    const n = count(body, re);
    if (n > 0) fails.push(`${name}: ${n}`);
  }

  const fake = FABRICATED.filter((s) => body.includes(s));
  if (fake.length) fails.push(`fabricated claims: ${fake.join(", ")}`);

  for (const [name, re] of Object.entries(LEGACY)) {
    const n = count(body, re);
    if (n === 0) continue;
    const budget = BUDGET[name] ?? 0;
    const label = `${name}: ${n}${budget ? ` (max ${budget})` : ""}`;
    if (REBUILT.has(route)) {
      if (n > budget) fails.push(label);
    } else {
      debt.push(`${name}: ${n}`);
    }
  }

  return { route, fails, debt, bytes: html.length };
}

let anyFail = false;
for (const route of ROUTES) {
  const r = await audit(route);
  if (r.error) {
    anyFail = true;
    console.log(`  ${route.padEnd(14)} ${r.error}`);
    continue;
  }
  if (r.fails.length) {
    anyFail = true;
    console.log(`✗ ${route.padEnd(14)} ${r.fails.join(" · ")}`);
  } else if (r.debt.length) {
    console.log(`~ ${route.padEnd(14)} visual pass · legacy debt: ${r.debt.join(", ")}`);
  } else {
    console.log(`✓ ${route.padEnd(14)} clean (${(r.bytes / 1024).toFixed(1)} KB)`);
  }
}

process.exit(anyFail ? 1 : 0);
