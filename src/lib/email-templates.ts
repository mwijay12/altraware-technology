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
 * Generates an ultra-clean, high-converting LIGHT MODE HTML email for the client (English first).
 * 100% inline-styled, fully responsive across Gmail, Apple Mail, Outlook, iOS, and Android.
 */
export function renderClientConfirmationEmail(data: EmailInquiryData): { subject: string; html: string; text: string } {
  const safeName = escapeHtml(data.name || "Valued Client");
  const safeType = escapeHtml(data.type || "Digital Solution / Custom System");
  const safeBudget = escapeHtml(data.budget || "To be discussed");
  const safeTimeline = escapeHtml(data.timeline || "Standard deployment");
  const safeRef = escapeHtml(data.refCode || "#ALT-" + Math.floor(1000 + Math.random() * 9000));
  const safeOrg = data.org ? escapeHtml(data.org) : "";
  const safeMessage = escapeHtml(data.message || "").replace(/\n/g, "<br/>");
  const cleanPhone = data.phone ? data.phone.replace(/[^0-9]/g, "") : "";
  const whatsappUrl = `https://wa.me/255792867427?text=${encodeURIComponent(
    `Hello Altraware! I submitted project brief ${safeRef} (${data.type || "System"}). My name is ${data.name}.`
  )}`;

  const subject = `Project Brief Received: ${data.type || "Digital Solution"} [${safeRef}] — Altraware Technology`;

  const html = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#F1F5F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;color:#334155;">
  
  <!-- OUTER WRAPPER TABLE -->
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#F1F5F9;padding:36px 14px;">
    <tr>
      <td align="center">
        
        <!-- MAIN CONTAINER (CLEAN LIGHT CARD) -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:620px;background-color:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px -5px rgba(0,0,0,0.06),0 8px 10px -6px rgba(0,0,0,0.04);">
          
          <!-- BRAND HEADER -->
          <tr>
            <td style="background-color:#F8FAFC;padding:32px 32px 24px;border-bottom:1px solid #E2E8F0;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <!-- STATUS BADGE -->
                    <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom:16px;">
                      <tr>
                        <td style="background-color:#EDE9FE;border:1px solid #DDD6FE;border-radius:24px;padding:5px 14px;color:#6D28D9;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
                          ● &nbsp;PROJECT BRIEF CONFIRMED
                        </td>
                      </tr>
                    </table>

                    <!-- LOGO & BRAND TITLE -->
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td valign="middle" style="padding-right:14px;">
                          <img src="https://altraware-technology.vercel.app/logo.png" alt="Altraware" width="46" height="46" style="display:block;border-radius:12px;border:1px solid #E2E8F0;background-color:#FFFFFF;" />
                        </td>
                        <td valign="middle">
                          <div style="font-size:20px;font-weight:800;color:#0F172A;letter-spacing:0.3px;margin:0;line-height:1.2;">
                            ALTRAWARE TECHNOLOGY
                          </div>
                          <div style="font-size:11px;color:#64748B;letter-spacing:1.2px;text-transform:uppercase;margin-top:4px;font-weight:600;">
                            Software Engineering &bull; Enterprise Digital Systems
                          </div>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- MAIN CONTENT BODY -->
          <tr>
            <td style="padding:32px 32px 28px;">
              
              <!-- GREETING -->
              <h2 style="font-size:22px;font-weight:700;color:#0F172A;margin:0 0 12px;line-height:1.3;">
                Hello, ${safeName}! 👋
              </h2>
              <p style="font-size:15px;line-height:1.6;color:#475569;margin:0 0 24px;">
                Thank you for contacting <strong>Altraware Technology</strong>. We have successfully logged your project inquiry and forwarded your specifications to our technical lead for architecture review. Your project reference code is:
              </p>

              <!-- REFERENCE CODE BANNER -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#F5F3FF;border:1px solid #DDD6FE;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
                <tr>
                  <td>
                    <div style="font-size:11px;color:#6D28D9;text-transform:uppercase;font-weight:700;letter-spacing:1px;">
                      Tracking Reference Code
                    </div>
                    <div style="font-size:22px;font-weight:800;color:#4C1D95;font-family:monospace;margin-top:4px;letter-spacing:1px;">
                      ${safeRef}
                    </div>
                  </td>
                  <td align="right" valign="middle">
                    <span style="background-color:#ECFDF5;border:1px solid #A7F3D0;color:#047857;font-size:11px;font-weight:700;padding:6px 12px;border-radius:20px;text-transform:uppercase;letter-spacing:0.5px;">
                      &check; Logged &amp; Verified
                    </span>
                  </td>
                </tr>
              </table>

              <!-- PROJECT SUMMARY BOX -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#FAFAFA;border:1px solid #E2E8F0;border-radius:14px;padding:22px;margin-bottom:28px;">
                <tr>
                  <td>
                    <div style="font-size:12px;font-weight:700;color:#6D28D9;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:16px;">
                      &bull; Project Summary &amp; Scope
                    </div>

                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="38%" style="padding:9px 0;font-size:13px;color:#64748B;font-weight:500;">
                          Requested Solution:
                        </td>
                        <td width="62%" style="padding:9px 0;font-size:14px;color:#0F172A;font-weight:700;">
                          ${safeType}
                        </td>
                      </tr>

                      ${
                        safeOrg
                          ? `<tr>
                        <td style="padding:9px 0;font-size:13px;color:#64748B;font-weight:500;">
                          Company / Organization:
                        </td>
                        <td style="padding:9px 0;font-size:14px;color:#0F172A;font-weight:600;">
                          ${safeOrg}
                        </td>
                      </tr>`
                          : ""
                      }

                      <tr>
                        <td style="padding:9px 0;font-size:13px;color:#64748B;font-weight:500;">
                          Target Budget:
                        </td>
                        <td style="padding:9px 0;font-size:14px;color:#059669;font-weight:700;">
                          ${safeBudget}
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:9px 0;font-size:13px;color:#64748B;font-weight:500;">
                          Target Timeline:
                        </td>
                        <td style="padding:9px 0;font-size:14px;color:#0F172A;font-weight:600;">
                          ${safeTimeline}
                        </td>
                      </tr>

                      ${
                        safeMessage
                          ? `<tr>
                        <td colspan="2" style="padding-top:14px;border-top:1px solid #E2E8F0;margin-top:8px;">
                          <div style="font-size:12px;color:#64748B;font-weight:600;margin-bottom:6px;text-transform:uppercase;">
                            Client Brief &amp; Requirements:
                          </div>
                          <div style="font-size:13px;color:#334155;line-height:1.6;background-color:#FFFFFF;padding:12px 14px;border-radius:8px;border:1px solid #CBD5E1;border-left:3px solid #7C3AED;">
                            ${safeMessage}
                          </div>
                        </td>
                      </tr>`
                          : ""
                      }

                    </table>
                  </td>
                </tr>
              </table>

              <!-- WHAT HAPPENS NEXT (ROADMAP) -->
              <div style="font-size:15px;font-weight:700;color:#0F172A;margin-bottom:18px;letter-spacing:0.3px;">
                What happens next?
              </div>

              <!-- STEP 1 -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:16px;">
                <tr>
                  <td width="36" valign="top">
                    <div style="width:28px;height:28px;background-color:#7C3AED;color:#FFFFFF;font-size:12px;font-weight:800;border-radius:50%;text-align:center;line-height:28px;">
                      1
                    </div>
                  </td>
                  <td valign="top" style="padding-left:12px;">
                    <div style="font-size:14px;font-weight:700;color:#0F172A;margin-bottom:2px;">
                      Technical Scope &amp; Architecture (0–12h)
                    </div>
                    <div style="font-size:13px;color:#64748B;line-height:1.5;">
                      Our engineers evaluate your requirements, database structure, and optimal technology stack.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- STEP 2 -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:16px;">
                <tr>
                  <td width="36" valign="top">
                    <div style="width:28px;height:28px;background-color:#7C3AED;color:#FFFFFF;font-size:12px;font-weight:800;border-radius:50%;text-align:center;line-height:28px;">
                      2
                    </div>
                  </td>
                  <td valign="top" style="padding-left:12px;">
                    <div style="font-size:14px;font-weight:700;color:#0F172A;margin-bottom:2px;">
                      Discovery Consultation &amp; Formal Quotation (Within 24h)
                    </div>
                    <div style="font-size:13px;color:#64748B;line-height:1.5;">
                      We reach out via WhatsApp, Email, or direct phone call with an exact milestone timeline and cost breakdown.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- STEP 3 -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:28px;">
                <tr>
                  <td width="36" valign="top">
                    <div style="width:28px;height:28px;background-color:#7C3AED;color:#FFFFFF;font-size:12px;font-weight:800;border-radius:50%;text-align:center;line-height:28px;">
                      3
                    </div>
                  </td>
                  <td valign="top" style="padding-left:12px;">
                    <div style="font-size:14px;font-weight:700;color:#0F172A;margin-bottom:2px;">
                      Interactive Prototype &amp; Sprint Kickoff
                    </div>
                    <div style="font-size:13px;color:#64748B;line-height:1.5;">
                      Development commences with complete milestone transparency, weekly updates, and written service agreements.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- ACTION BUTTONS -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top:10px;margin-bottom:10px;">
                <tr>
                  <td align="center">
                    
                    <!-- WHATSAPP FAST-TRACK BUTTON -->
                    <table border="0" cellspacing="0" cellpadding="0" style="margin:6px 0;">
                      <tr>
                        <td align="center" style="background-color:#16A34A;border-radius:12px;box-shadow:0 4px 12px rgba(22,163,74,0.25);">
                          <a href="${whatsappUrl}" target="_blank" style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:700;color:#FFFFFF;text-decoration:none;letter-spacing:0.3px;">
                            💬 Fast-Track on WhatsApp (+255 792 867 427)
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- EXPLORE PLATFORMS LINK BUTTON -->
                    <table border="0" cellspacing="0" cellpadding="0" style="margin:6px 0;">
                      <tr>
                        <td align="center" style="background-color:#F8FAFC;border:1px solid #CBD5E1;border-radius:12px;">
                          <a href="https://altraware-technology.vercel.app/services" target="_blank" style="display:inline-block;padding:12px 24px;font-size:13px;font-weight:600;color:#334155;text-decoration:none;">
                            Explore Systems &amp; Case Studies &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color:#F8FAFC;padding:26px 32px;border-top:1px solid #E2E8F0;text-align:center;">
              <div style="font-size:13px;font-weight:700;color:#0F172A;">
                Altraware Technology Ltd
              </div>
              <div style="font-size:12px;color:#64748B;margin-top:6px;line-height:1.6;">
                Dar es Salaam, Tanzania &bull; Phone: +255 792 867 427 / +255 790 942 616<br/>
                Official Email: <a href="mailto:altrawaretechnology@gmail.com" style="color:#6D28D9;text-decoration:none;font-weight:600;">altrawaretechnology@gmail.com</a>
              </div>
              <div style="font-size:11px;color:#94A3B8;margin-top:12px;">
                &copy; ${new Date().getFullYear()} Altraware Technology. All rights reserved. Data privacy and written contracts guaranteed.
              </div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();

  const text = `
HELLO ${data.name.toUpperCase()} — ALTRAWARE TECHNOLOGY

Thank you for contacting Altraware Technology. We have received your project inquiry and assigned it reference code: ${safeRef}.

PROJECT SPECIFICATIONS:
- Tracking Code: ${safeRef}
- Requested Solution: ${data.type}
- Target Budget: ${data.budget || "To be discussed"}
- Estimated Timeline: ${data.timeline || "Standard"}
${data.org ? `- Company / Org: ${data.org}\n` : ""}- Client Brief: ${data.message}

WHAT HAPPENS NEXT:
1. Technical Scope Review within 12 hours.
2. Direct WhatsApp / Phone consultation and formal milestone quotation within 24 hours.
3. Interactive prototype and sprint kickoff.

Need an immediate response?
WhatsApp: +255 792 867 427
Email: altrawaretechnology@gmail.com
Website: https://altraware-technology.vercel.app/
`.trim();

  return { subject, html, text };
}

/**
 * Generates an internal alert email sent to the Altraware team (altrawaretechnology@gmail.com) in clean LIGHT MODE.
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
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#F1F5F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#334155;">
  
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#F1F5F9;padding:32px 14px;">
    <tr>
      <td align="center">
        
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:28px;box-shadow:0 10px 25px -5px rgba(0,0,0,0.06);">
          <tr>
            <td>
              
              <!-- BADGE -->
              <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom:14px;">
                <tr>
                  <td style="background-color:#EDE9FE;border:1px solid #DDD6FE;color:#6D28D9;font-size:11px;font-weight:700;padding:5px 12px;border-radius:6px;letter-spacing:1px;text-transform:uppercase;">
                    ⚡ INBOUND LEAD ALERT
                  </td>
                </tr>
              </table>

              <h2 style="margin:0 0 8px;font-size:22px;color:#0F172A;font-weight:800;">
                New Project Request Received!
              </h2>
              <p style="margin:0 0 20px;color:#64748B;font-size:14px;line-height:1.5;">
                A prospective client submitted a brief on <strong>altraware-technology</strong>:
              </p>

              <!-- CLIENT DETAILS CARD -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;padding:16px 18px;margin-bottom:20px;">
                <tr>
                  <td width="35%" style="color:#64748B;font-size:13px;padding:7px 0;font-weight:600;">Client Name:</td>
                  <td width="65%" style="color:#0F172A;font-size:14px;padding:7px 0;font-weight:700;">${safeName}</td>
                </tr>
                <tr>
                  <td style="color:#64748B;font-size:13px;padding:7px 0;font-weight:600;">Phone / WhatsApp:</td>
                  <td style="font-size:14px;padding:7px 0;font-weight:700;">
                    <a href="tel:${safePhone}" style="color:#0284C7;text-decoration:none;">${safePhone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="color:#64748B;font-size:13px;padding:7px 0;font-weight:600;">Email:</td>
                  <td style="font-size:14px;padding:7px 0;font-weight:600;">
                    <a href="mailto:${safeEmail}" style="color:#6D28D9;text-decoration:none;">${safeEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td style="color:#64748B;font-size:13px;padding:7px 0;font-weight:600;">Organization:</td>
                  <td style="color:#334155;font-size:14px;padding:7px 0;">${safeOrg}</td>
                </tr>
                <tr>
                  <td style="color:#64748B;font-size:13px;padding:7px 0;font-weight:600;">Solution Scope:</td>
                  <td style="color:#D97706;font-size:14px;padding:7px 0;font-weight:700;">${safeType}</td>
                </tr>
                <tr>
                  <td style="color:#64748B;font-size:13px;padding:7px 0;font-weight:600;">Target Budget:</td>
                  <td style="color:#059669;font-size:14px;padding:7px 0;font-weight:700;">${safeBudget}</td>
                </tr>
                <tr>
                  <td style="color:#64748B;font-size:13px;padding:7px 0;font-weight:600;">Timeline:</td>
                  <td style="color:#334155;font-size:14px;padding:7px 0;">${safeTimeline}</td>
                </tr>
                <tr>
                  <td style="color:#64748B;font-size:13px;padding:7px 0;font-weight:600;">Tracking Code:</td>
                  <td style="color:#6D28D9;font-size:14px;padding:7px 0;font-family:monospace;font-weight:800;">${safeRef}</td>
                </tr>
              </table>

              <!-- PROJECT NOTES -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#F1F5F9;border:1px solid #E2E8F0;border-radius:10px;padding:14px 18px;margin-bottom:24px;">
                <tr>
                  <td>
                    <div style="color:#475569;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">
                      Client Requirements &amp; Notes:
                    </div>
                    <div style="color:#0F172A;font-size:13px;line-height:1.6;">
                      ${safeMessage}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- ACTION BUTTONS -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    
                    <table border="0" cellspacing="0" cellpadding="0" style="margin:4px 0;">
                      <tr>
                        <td style="background-color:#16A34A;border-radius:10px;">
                          <a href="${waLink}" target="_blank" style="display:inline-block;padding:12px 24px;color:#FFFFFF;text-decoration:none;font-size:14px;font-weight:700;">
                            💬 Open Client WhatsApp Chat
                          </a>
                        </td>
                      </tr>
                    </table>

                    ${
                      data.email
                        ? `<table border="0" cellspacing="0" cellpadding="0" style="margin:4px 0;">
                      <tr>
                        <td style="background-color:#6D28D9;border-radius:10px;">
                          <a href="mailto:${data.email}?subject=Altraware%20Technology%20-%20Re:%20${encodeURIComponent(
                            data.type
                          )}%20[${safeRef}]" style="display:inline-block;padding:12px 24px;color:#FFFFFF;text-decoration:none;font-size:14px;font-weight:700;">
                            ✉️ Reply to Client via Email
                          </a>
                        </td>
                      </tr>
                    </table>`
                        : ""
                    }

                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();

  const text = `
INBOUND LEAD ALERT [${data.refCode}]

Client: ${data.name}
Company: ${data.org || "N/A"}
Phone: ${data.phone}
Email: ${data.email || "N/A"}
Scope: ${data.type}
Budget: ${data.budget || "N/A"}
Timeline: ${data.timeline || "N/A"}

Brief:
${data.message}

WhatsApp: ${waLink}
`.trim();

  return { subject, html, text };
}
