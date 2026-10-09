"use client";

import { formatTsh } from "@/lib/content";
import type { SiteContent } from "@/lib/content";

/* ============================================================
   Invoice engine — official business invoices for Tanzania.
   Generates branded PDFs with jsPDF (works fully offline in
   the browser). Logo is embedded from /logo.jpg as base64.
   Later: log invoices to Firebase after download.
   ============================================================ */

export interface InvoiceItem {
  desc: string;
  qty: number;
  unitPrice: number; // TSh
}

export interface Invoice {
  id: string;
  number: string; // ALT-2026-001
  date: string; // ISO
  dueDate: string; // ISO
  clientName: string;
  clientOrg?: string;
  clientPhone?: string;
  clientEmail?: string;
  items: InvoiceItem[];
  vatPercent: number;
  discount: number; // flat TSh
  depositPercent: number; // e.g. 50 → deposit invoice
  notes?: string;
  status: "draft" | "sent" | "paid" | "overdue";
  paidDate?: string;
  currencyNote?: string;
}

export function makeInvoiceNumber(seq: number): string {
  return `ALT-${new Date().getFullYear()}-${String(seq).padStart(3, "0")}`;
}

export function invoiceTotals(inv: Invoice) {
  const sub = inv.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const discount = inv.discount;
  const taxable = sub - discount;
  const vat = Math.round(taxable * (inv.vatPercent / 100));
  const total = taxable + vat;
  const deposit = Math.round(total * (inv.depositPercent / 100));
  const balance = total - deposit;
  return { sub, discount, taxable, vat, total, deposit, balance };
}

/* Load the logo once and cache as data URL */
let logoCache: string | null = null;
async function getLogo(): Promise<string | null> {
  if (logoCache !== null) return logoCache;
  try {
    const res = await fetch("/logo.jpg");
    const blob = await res.blob();
    logoCache = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch {
    logoCache = null;
  }
  return logoCache;
}

export async function downloadInvoicePdf(inv: Invoice, content: SiteContent) {
  const { jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const c = content.legal.companyDetails;
  const t = invoiceTotals(inv);

  /* ---------- header band ---------- */
  doc.setFillColor(10, 23, 53); // deep
  doc.rect(0, 0, W, 34, "F");
  // logo
  const logo = await getLogo();
  if (logo) {
    try {
      doc.addImage(logo, "JPEG", 12, 7, 20, 20);
    } catch {
      /* ignore bad logo */
    }
  }
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text("ALTRAWARE TECHNOLOGY LTD", 36, 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text("Websites · Apps · Business Systems — Dar es Salaam, Tanzania", 36, 20);
  doc.text(`${c.email}  ·  ${c.phonePrimary} / ${c.phoneSecondary}`, 36, 25);
  // INVOICE label right
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(inv.status === "paid" ? "RECEIPT" : "INVOICE", W - 14, 16, { align: "right" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(inv.number, W - 14, 22, { align: "right" });
  doc.text(new Date(inv.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }), W - 14, 27, { align: "right" });

  /* ---------- parties ---------- */
  let y = 46;
  doc.setTextColor(20, 20, 30);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("FROM", 14, y);
  doc.text("BILL TO", 120, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  const from = [c.legalName, c.address, c.registration, c.email, `${c.phonePrimary} · ${c.phoneSecondary}`];
  from.forEach((line, i) => doc.text(String(line), 14, y + 6 + i * 5));
  const to = [
    inv.clientName,
    inv.clientOrg || "",
    inv.clientPhone || "",
    inv.clientEmail || "",
  ].filter(Boolean);
  to.forEach((line, i) => doc.text(String(line), 120, y + 6 + i * 5));
  y += 6 + Math.max(from.length, to.length) * 5 + 6;

  /* ---------- meta row ---------- */
  doc.setFillColor(247, 246, 242);
  doc.rect(14, y - 4, W - 28, 10, "F");
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.text("DATE", 18, y + 2.5);
  doc.text("DUE DATE", 70, y + 2.5);
  doc.text("STATUS", 122, y + 2.5);
  doc.text("CURRENCY", 166, y + 2.5);
  doc.setFont("helvetica", "normal");
  doc.text(new Date(inv.date).toLocaleDateString("en-GB"), 18, y + 9);
  doc.text(new Date(inv.dueDate).toLocaleDateString("en-GB"), 70, y + 9);
  doc.text(inv.status.toUpperCase(), 122, y + 9);
  doc.text("Tanzanian Shilling (TSh)", 166, y + 9);
  y += 20;

  /* ---------- items table ---------- */
  autoTable(doc, {
    startY: y,
    head: [["#", "DESCRIPTION", "QTY", "UNIT PRICE", "AMOUNT"]],
    body: inv.items.map((it, i) => [
      String(i + 1),
      it.desc,
      String(it.qty),
      formatTsh(it.unitPrice).replace("TSh ", ""),
      formatTsh(it.qty * it.unitPrice).replace("TSh ", ""),
    ]),
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 3, textColor: [25, 25, 35] },
    headStyles: { fillColor: [10, 23, 53], textColor: 255, fontSize: 8.5, fontStyle: "bold" },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 88 },
      2: { cellWidth: 18, halign: "right" },
      3: { cellWidth: 32, halign: "right" },
      4: { cellWidth: 34, halign: "right", fontStyle: "bold" },
    },
    alternateRowStyles: { fillColor: [250, 250, 248] },
  });

  /* ---------- totals block ---------- */
  // @ts-expect-error lastAutoTable injected by plugin
  y = doc.lastAutoTable.finalY + 8;
  const tx = 130;
  const line = (label: string, value: string, bold = false, big = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(big ? 12 : 9.5);
    doc.setTextColor(25, 25, 35);
    doc.text(label, tx, y);
    doc.text(value, W - 14, y, { align: "right" });
    y += big ? 8 : 6;
  };
  line("Subtotal", formatTsh(t.sub));
  if (t.discount > 0) line("Discount", `-${formatTsh(t.discount)}`);
  line(`VAT (${inv.vatPercent}%)`, formatTsh(t.vat));
  doc.setDrawColor(10, 23, 53);
  doc.setLineWidth(0.4);
  doc.line(tx, y - 2, W - 14, y - 2);
  y += 2;
  line(inv.status === "paid" ? "TOTAL PAID" : "TOTAL", formatTsh(t.total), true, true);

  if (inv.depositPercent > 0 && inv.depositPercent < 100) {
    line(`Deposit (${inv.depositPercent}%)`, formatTsh(t.deposit));
    line("Balance after deposit", formatTsh(t.balance));
  }

  /* ---------- payment instructions ---------- */
  y += 4;
  doc.setFillColor(247, 246, 242);
  doc.rect(14, y, W - 28, 24, "F");
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(10, 23, 53);
  doc.text("PAYMENT — MALIPO", 18, y + 6);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(40, 40, 50);
  doc.text("Mobile money: M-Pesa / Tigo Pesa / Airtel Money — numbers on request per project agreement.", 18, y + 12);
  doc.text("Bank transfer details are included in your project agreement. Quote the invoice number as reference.", 18, y + 17);
  y += 32;

  /* ---------- notes + footer ---------- */
  if (inv.notes) {
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 70);
    const splitNotes = doc.splitTextToSize(`Notes: ${inv.notes}`, W - 36);
    doc.text(splitNotes, 14, y);
    y += splitNotes.length * 4.5 + 4;
  }

  // violet accent footer
  doc.setFillColor(124, 58, 237);
  doc.rect(0, 285, W, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text(
    `Asante sana! Questions about this invoice? WhatsApp ${c.phonePrimary} · Altraware Technology Ltd`,
    W / 2,
    292,
    { align: "center" }
  );

  doc.save(`${inv.number}${inv.status === "paid" ? "-receipt" : ""}.pdf`);
}

/* ---------- storage (localStorage → Firebase later) ---------- */

const INVOICE_KEY = "altraware_invoices_v1";

export function loadInvoices(): Invoice[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(INVOICE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveInvoices(list: Invoice[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(INVOICE_KEY, JSON.stringify(list));
}