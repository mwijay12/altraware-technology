export interface EmailInquiryData {
  name: string;
  email?: string;
  phone: string;
  org?: string;
  type: string;
  budget?: string;
  timeline?: string;
  message: string;
  refCode: string;
}

/**
 * Escapes unsafe HTML characters to prevent XSS in email bodies.
 */
function escapeHtml(str: string = ""): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Generates an ultra-premium, responsive, branded HTML email for the client.
 */
export function renderClientConfirmationEmail(data: EmailInquiryData): { subject: string; html: string; text: string } {
  const safeName = escapeHtml(data.name || "Partner");
  const safeType = escapeHtml(data.type || "Digital Solution");
  const safeBudget = escapeHtml(data.budget || "To be discussed");
  const safeTimeline = escapeHtml(data.timeline || "Standard deployment");
  const safeRef = escapeHtml(data.refCode || "#ALT-" + Math.floor(1000 + Math.random() * 9000));
  const safeOrg = data.org ? escapeHtml(data.org) : "";
  const safeMessage = escapeHtml(data.message || "").replace(/\n/g, "<br/>");
  const whatsappUrl = `https://wa.me/255792867427?text=${encodeURIComponent(
    `Hello Altraware! I submitted project brief ${safeRef} (${data.type || "System"}). My name is ${data.name}.`
  )}`;

  const subject = `Brief Received: ${data.type || "Project Inquiry"} [${safeRef}] — Altraware Technology`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #050B17;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #E2E8F0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #050B17;
      padding: 30px 15px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #0A1325;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }
    .header {
      padding: 36px 32px 28px;
      background: linear-gradient(180deg, rgba(124, 58, 237, 0.15) 0%, rgba(10, 19, 37, 0) 100%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      background: rgba(124, 58, 237, 0.2);
      border: 1px solid rgba(124, 58, 237, 0.4);
      color: #C4B5FD;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      border-radius: 9999px;
      margin-bottom: 16px;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 0.5px;
      color: #FFFFFF;
      margin: 0;
    }
    .brand-sub {
      font-size: 11px;
      letter-spacing: 2px;
      color: #94A3B8;
      text-transform: uppercase;
      margin-top: 4px;
    }
    .content {
      padding: 32px;
    }
    .greeting {
      font-size: 22px;
      font-weight: 700;
      color: #FFFFFF;
      margin: 0 0 12px;
    }
    .lead-text {
      font-size: 15px;
      line-height: 1.6;
      color: #94A3B8;
      margin: 0 0 24px;
    }
    .card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .card-title {
      font-size: 12px;
      font-weight: 700;
      color: #7C3AED;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      margin: 0 0 16px;
    }
    .row {
      display: table;
      width: 100%;
      margin-bottom: 10px;
    }
    .row-cell-lbl {
      display: table-cell;
      width: 35%;
      font-size: 13px;
      color: #64748B;
      padding-bottom: 8px;
    }
    .row-cell-val {
      display: table-cell;
      width: 65%;
      font-size: 14px;
      font-weight: 600;
      color: #F1F5F9;
      padding-bottom: 8px;
    }
    .ref-highlight {
      font-family: monospace;
      color: #A78BFA;
      background: rgba(124, 58, 237, 0.15);
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid rgba(124, 58, 237, 0.3);
      font-size: 13px;
    }
    .steps-section {
      margin-top: 28px;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }
    .steps-title {
      font-size: 14px;
      font-weight: 700;
      color: #FFFFFF;
      margin: 0 0 16px;
      letter-spacing: 0.5px;
    }
    .step-item {
      display: table;
      width: 100%;
      margin-bottom: 14px;
    }
    .step-num {
      display: table-cell;
      width: 28px;
      height: 28px;
      background: #7C3AED;
      color: #FFFFFF;
      font-size: 12px;
      font-weight: 700;
      text-align: center;
      vertical-align: top;
      border-radius: 50%;
      padding-top: 4px;
    }
    .step-body {
      display: table-cell;
      padding-left: 14px;
      vertical-align: top;
    }
    .step-body-h {
      font-size: 14px;
      font-weight: 600;
      color: #FFFFFF;
      margin: 0 0 3px;
    }
    .step-body-p {
      font-size: 13px;
      color: #94A3B8;
      line-height: 1.5;
      margin: 0;
    }
    .actions {
      text-align: center;
      margin-top: 32px;
      margin-bottom: 12px;
    }
    .btn-primary {
      display: inline-block;
      padding: 13px 26px;
      background: #7C3AED;
      color: #FFFFFF !important;
      text-decoration: none;
      font-size: 14px;
      font-weight: 700;
      border-radius: 10px;
      margin: 6px;
      box-shadow: 0 8px 20px rgba(124, 58, 237, 0.35);
    }
    .btn-secondary {
      display: inline-block;
      padding: 13px 24px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #E2E8F0 !important;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      border-radius: 10px;
      margin: 6px;
    }
    .footer {
      padding: 24px 32px;
      background: #070D1A;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 12px;
      color: #64748B;
      line-height: 1.6;
      text-align: center;
    }
    .footer a {
      color: #94A3B8;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      
      <!-- HEADER -->
      <div class="header">
        <span class="badge">● Brief Received</span>
        <h1 class="brand-title">ALTRAWARE TECHNOLOGY</h1>
        <div class="brand-sub">Software Engineering &amp; Enterprise Digital Systems · Dar es Salaam</div>
      </div>

      <!-- BODY CONTENT -->
      <div class="content">
        <h2 class="greeting">Habari, ${safeName}!</h2>
        <p class="lead-text">
          Thank you for entrusting your project vision to Altraware Technology. We have successfully logged your brief and assigned reference code <span class="ref-highlight">${safeRef}</span>.
        </p>

        <!-- SPECIFICATIONS CARD -->
        <div class="card">
          <div class="card-title">Project Summary</div>
          
          <div class="row">
            <div class="row-cell-lbl">Reference Code</div>
            <div class="row-cell-val"><span class="ref-highlight">${safeRef}</span></div>
          </div>
          
          <div class="row">
            <div class="row-cell-lbl">Service / Scope</div>
            <div class="row-cell-val">${safeType}</div>
          </div>

          ${
            safeOrg
              ? `<div class="row">
            <div class="row-cell-lbl">Organization</div>
            <div class="row-cell-val">${safeOrg}</div>
          </div>`
              : ""
          }

          <div class="row">
            <div class="row-cell-lbl">Target Budget</div>
            <div class="row-cell-val">${safeBudget}</div>
          </div>

          <div class="row">
            <div class="row-cell-lbl">Timeline Goal</div>
            <div class="row-cell-val">${safeTimeline}</div>
          </div>

          ${
            safeMessage
              ? `<div class="row" style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 10px;">
            <div class="row-cell-lbl" style="vertical-align: top;">Your Notes</div>
            <div class="row-cell-val" style="font-weight: 400; color: #CBD5E1; line-height: 1.5;">${safeMessage}</div>
          </div>`
              : ""
          }
        </div>

        <!-- WHAT HAPPENS NEXT -->
        <div class="steps-section">
          <div class="steps-title">What happens next?</div>

          <div class="step-item">
            <div class="step-num">1</div>
            <div class="step-body">
              <div class="step-body-h">Architecture &amp; Scope Review (0–12h)</div>
              <p class="step-body-p">Our software architects examine your requirements, database schema needs, and infrastructure roadmap.</p>
            </div>
          </div>

          <div class="step-item">
            <div class="step-num">2</div>
            <div class="step-body">
              <div class="step-body-h">Consultation &amp; Quotation (Within 24h)</div>
              <p class="step-body-p">We reach out via WhatsApp/Email or direct phone call with an exact milestone timeline and cost breakdown.</p>
            </div>
          </div>

          <div class="step-item">
            <div class="step-num">3</div>
            <div class="step-body">
              <div class="step-body-h">Interactive Prototype &amp; Kickoff</div>
              <p class="step-body-p">Work commences with sprint transparency, weekly updates, and full client dashboard access.</p>
            </div>
          </div>
        </div>

        <!-- ACTION BUTTONS -->
        <div class="actions">
          <a href="${whatsappUrl}" class="btn-primary" target="_blank" rel="noopener noreferrer">
            💬 Fast-Track on WhatsApp (+255 792 867 427)
          </a>
          <a href="https://altraware-technology.vercel.app/services" class="btn-secondary" target="_blank" rel="noopener noreferrer">
            Explore Systems &amp; Work
          </a>
        </div>

      </div>

      <!-- FOOTER -->
      <div class="footer">
        <div><strong>Altraware Technology Ltd</strong> · Dar es Salaam, Tanzania</div>
        <div style="margin-top: 4px;">
          Hotline: +255 792 867 427 / +255 790 942 616 · Email: <a href="mailto:altrawaretechnology@gmail.com">altrawaretechnology@gmail.com</a>
        </div>
        <div style="margin-top: 8px; color: #475569; font-size: 11px;">
          © ${new Date().getFullYear()} Altraware Technology. All rights reserved. Security and data privacy committed.
        </div>
      </div>

    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
HABARI ${data.name.toUpperCase()} — ALTRAWARE TECHNOLOGY

Thank you for contacting Altraware Technology. Your project brief has been received.

Project Summary:
- Reference Code: ${data.refCode}
- Solution: ${data.type}
- Budget: ${data.budget || "To be discussed"}
- Timeline: ${data.timeline || "Standard"}
${data.org ? `- Organization: ${data.org}\n` : ""}- Notes: ${data.message}

What happens next:
1. Technical architecture review within 12 hours.
2. Direct phone / WhatsApp consultation & milestone quotation within 24 hours.
3. Interactive prototype and kickoff.

Need fast response?
WhatsApp: +255 792 867 427
Email: altrawaretechnology@gmail.com
Website: https://altraware-technology.vercel.app/
`.trim();

  return { subject, html, text };
}

/**
 * Generates an internal notification email sent to the Altraware team (e.g. altrawaretechnology@gmail.com).
 */
export function renderAdminAlertEmail(data: EmailInquiryData): { subject: string; html: string; text: string } {
  const safeName = escapeHtml(data.name);
  const safePhone = escapeHtml(data.phone);
  const safeEmail = escapeHtml(data.email || "Not provided");
  const safeOrg = escapeHtml(data.org || "Individual / Not specified");
  const safeType = escapeHtml(data.type);
  const safeBudget = escapeHtml(data.budget || "Unspecified");
  const safeTimeline = escapeHtml(data.timeline || "Unspecified");
  const safeRef = escapeHtml(data.refCode);
  const safeMessage = escapeHtml(data.message).replace(/\n/g, "<br/>");

  const cleanPhone = data.phone.replace(/[^0-9]/g, "");
  const waLink = `https://wa.me/${cleanPhone.startsWith("0") ? "255" + cleanPhone.slice(1) : cleanPhone}`;

  const subject = `🔥 NEW PROJECT BRIEF: ${data.name} (${data.type}) [${safeRef}]`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:24px;background:#060C18;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#F1F5F9;">
  <div style="max-width:600px;margin:0 auto;background:#0D172A;border:1px solid rgba(255,255,255,0.12);border-radius:12px;padding:28px;">
    
    <div style="background:#7C3AED;color:#FFF;font-size:12px;font-weight:700;display:inline-block;padding:4px 10px;border-radius:6px;letter-spacing:1px;text-transform:uppercase;margin-bottom:12px;">
      ⚡ Lead Inbound Alert
    </div>
    
    <h2 style="margin:0 0 8px;font-size:22px;color:#FFF;">New Project Request Received</h2>
    <p style="margin:0 0 20px;color:#94A3B8;font-size:14px;">A prospective client submitted a brief on altraware-technology.</p>

    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:16px;margin-bottom:20px;">
      <table style="width:100%;font-size:14px;border-collapse:collapse;">
        <tr><td style="color:#64748B;padding:6px 0;width:120px;">Client Name</td><td style="color:#FFF;font-weight:700;">${safeName}</td></tr>
        <tr><td style="color:#64748B;padding:6px 0;">Organization</td><td style="color:#FFF;">${safeOrg}</td></tr>
        <tr><td style="color:#64748B;padding:6px 0;">Phone / WA</td><td style="color:#38BDF8;font-weight:700;"><a href="tel:${safePhone}" style="color:#38BDF8;">${safePhone}</a></td></tr>
        <tr><td style="color:#64748B;padding:6px 0;">Email</td><td style="color:#A78BFA;"><a href="mailto:${safeEmail}" style="color:#A78BFA;">${safeEmail}</a></td></tr>
        <tr><td style="color:#64748B;padding:6px 0;">Service Type</td><td style="color:#FBBF24;font-weight:700;">${safeType}</td></tr>
        <tr><td style="color:#64748B;padding:6px 0;">Budget</td><td style="color:#34D399;font-weight:700;">${safeBudget}</td></tr>
        <tr><td style="color:#64748B;padding:6px 0;">Timeline</td><td style="color:#FFF;">${safeTimeline}</td></tr>
        <tr><td style="color:#64748B;padding:6px 0;">Ref Code</td><td style="color:#C084FC;font-family:monospace;font-weight:700;">${safeRef}</td></tr>
      </table>
    </div>

    <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:16px;margin-bottom:24px;">
      <div style="color:#94A3B8;font-size:12px;text-transform:uppercase;font-weight:700;margin-bottom:8px;">Project Requirements &amp; Notes:</div>
      <div style="color:#E2E8F0;font-size:14px;line-height:1.6;">${safeMessage}</div>
    </div>

    <div style="text-align:center;">
      <a href="${waLink}" style="display:inline-block;padding:12px 22px;background:#10B981;color:#FFF;text-decoration:none;font-weight:700;font-size:14px;border-radius:8px;margin-right:8px;">
        💬 Chat Client on WhatsApp
      </a>
      ${
        data.email
          ? `<a href="mailto:${data.email}?subject=Altraware%20Technology%20-%20Re:%20${encodeURIComponent(
              data.type
            )}%20[${safeRef}]" style="display:inline-block;padding:12px 22px;background:#7C3AED;color:#FFF;text-decoration:none;font-weight:700;font-size:14px;border-radius:8px;">
        ✉️ Reply via Email
      </a>`
          : ""
      }
    </div>

  </div>
</body>
</html>
  `.trim();

  const text = `
NEW PROJECT INQUIRY [${data.refCode}]

Client: ${data.name}
Organization: ${data.org || "N/A"}
Phone: ${data.phone}
Email: ${data.email || "N/A"}
Service: ${data.type}
Budget: ${data.budget || "N/A"}
Timeline: ${data.timeline || "N/A"}

Message:
${data.message}
`.trim();

  return { subject, html, text };
}
