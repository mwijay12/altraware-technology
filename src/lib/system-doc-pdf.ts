"use client";

import type { ClientProject } from "@/lib/client-projects";

/* ============================================================
   System Documentation PDF — clean A4 document (NOT a page screenshot).
   Branded header, numbered sections, handover credentials, SLA + footer.
   ============================================================ */

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

function safeText(v: string | undefined, fallback = "—"): string {
  const t = (v ?? "").trim();
  return t.length > 0 ? t : fallback;
}

export async function downloadSystemDocPdf(project: ClientProject) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const M = 14; // margin
  const contentW = W - M * 2;
  let y = 0;

  const ensureSpace = (needed: number) => {
    if (y + needed > 282) {
      doc.addPage();
      y = 18;
    }
  };

  const sectionTitle = (num: string, title: string) => {
    ensureSpace(18);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(124, 58, 237);
    doc.text(`${num}  ${title.toUpperCase()}`, M, y);
    y += 2;
    doc.setDrawColor(124, 58, 237);
    doc.setLineWidth(0.5);
    doc.line(M, y, M + 18, y);
    y += 5;
  };

  const bodyText = (text: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(30, 30, 40);
    const lines = doc.splitTextToSize(safeText(text, "Not documented yet."), contentW);
    for (const line of lines) {
      ensureSpace(5);
      doc.text(line, M, y);
      y += 4.8;
    }
    y += 3;
  };

  /* ---------- header band ---------- */
  doc.setFillColor(10, 23, 53);
  doc.rect(0, 0, W, 32, "F");
  const logo = await getLogo();
  if (logo) {
    try {
      doc.addImage(logo, "JPEG", 12, 6, 20, 20);
    } catch {
      /* ignore */
    }
  }
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("ALTRAWARE TECHNOLOGY", 36, 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(196, 181, 253);
  doc.text("SYSTEM DOCUMENTATION  ·  OFFICIAL HANDOVER DOCUMENT", 36, 17.5);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text(
    `${safeText(project.systemName)}  ·  ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`,
    36,
    23
  );

  /* ---------- title block ---------- */
  y = 40;
  doc.setTextColor(10, 23, 53);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  const titleLines = doc.splitTextToSize(safeText(project.systemName, "Untitled System"), contentW);
  doc.text(titleLines, M, y);
  y += titleLines.length * 7 + 2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(90, 90, 110);
  doc.text(
    `Client: ${safeText(project.clientName)}${project.company ? `  ·  ${project.company}` : ""}   |   Progress: ${project.progressPercent}%   |   Stage: ${safeText(project.stage)}`,
    M,
    y
  );
  y += 5;
  doc.text(
    `Contact: ${safeText(project.clientPhone)}${project.clientEmail ? `  ·  ${project.clientEmail}` : ""}   |   Target launch: ${safeText(project.targetLaunchDate)}`,
    M,
    y
  );
  y += 4;
  doc.setDrawColor(230, 230, 235);
  doc.setLineWidth(0.3);
  doc.line(M, y, W - M, y);
  y += 7;

  /* ---------- sections ---------- */
  sectionTitle("01", "System overview");
  bodyText(project.documentation.overview);

  sectionTitle("02", "Technical architecture");
  bodyText(project.documentation.architecture);

  sectionTitle("03", "User guide");
  bodyText(project.documentation.userGuide);

  if (project.documentation.apiEndpoints?.trim()) {
    sectionTitle("04", "Integration endpoints");
    doc.setFont("courier", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(30, 30, 40);
    const apiLines = doc.splitTextToSize(project.documentation.apiEndpoints, contentW);
    for (const line of apiLines) {
      ensureSpace(5);
      doc.text(line, M, y);
      y += 4.5;
    }
    y += 3;
  }

  sectionTitle(project.documentation.apiEndpoints?.trim() ? "05" : "04", "Accounts & handover");
  const cred = project.adminCredentials;
  if (cred && (cred.portalUrl || cred.username || cred.tempPassword)) {
    ensureSpace(30);
    doc.setFillColor(255, 251, 235);
    doc.setDrawColor(245, 200, 120);
    const boxY = y - 3;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(60, 50, 20);
    const rows: [string, string][] = [
      ["Portal URL", safeText(cred.portalUrl)],
      ["Username", safeText(cred.username)],
      ["Temp password", safeText(cred.tempPassword)],
    ];
    let by = y + 3;
    rows.forEach(([k, v]) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${k}:`, M + 3, by);
      doc.setFont("helvetica", "normal");
      const vv = doc.splitTextToSize(v, contentW - 40);
      doc.text(vv, M + 35, by);
      by += vv.length * 4.5 + 1.5;
    });
    if (cred.note?.trim()) {
      doc.setFont("helvetica", "italic");
      const nl = doc.splitTextToSize(`Note: ${cred.note}`, contentW - 6);
      doc.text(nl, M + 3, by + 1);
      by += nl.length * 4.5;
    }
    const boxH = by - boxY + 3;
    // draw box behind (use rounded feel via rect)
    // Note: drawn after text would cover it, so we drew fill first conceptually —
    // re-draw border only here to keep it clean.
    doc.setDrawColor(245, 200, 120);
    doc.rect(M, boxY, contentW, boxH);
    y = boxY + boxH + 6;
  } else {
    bodyText("No handover credentials recorded yet.");
  }

  sectionTitle(project.documentation.apiEndpoints?.trim() ? "06" : "05", "Support agreement (SLA)");
  bodyText(project.documentation.slaSupport || "24/7 technical support by phone and WhatsApp (+255 757 939 444).");

  /* ---------- footer on each page ---------- */
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFillColor(124, 58, 237);
    doc.rect(0, 287, W, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text(
      `Altraware Technology  ·  Dar es Salaam, Tanzania  ·  Page ${i} of ${pages}`,
      W / 2,
      293,
      { align: "center" }
    );
  }

  const fileName = `${(project.systemName || "system").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "system"}-documentation.pdf`;
  doc.save(fileName);
}
