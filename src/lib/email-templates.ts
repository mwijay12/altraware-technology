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
 * Generates an ultra-premium, 100% inline-styled HTML email for the client.
 * Fully compatible with Gmail (desktop, Android, iOS), Apple Mail, Outlook.
 */
export function renderClientConfirmationEmail(data: EmailInquiryData): { subject: string; html: string; text: string } {
  const safeName = escapeHtml(data.name || "Mteja Wetu");
  const safeType = escapeHtml(data.type || "Mfumo / Tovuti ya Kidijitali");
  const safeBudget = escapeHtml(data.budget || "Kuzungumzwa");
  const safeTimeline = escapeHtml(data.timeline || "Kawaida");
  const safeRef = escapeHtml(data.refCode || "#ALT-" + Math.floor(1000 + Math.random() * 9000));
  const safeOrg = data.org ? escapeHtml(data.org) : "";
  const safeMessage = escapeHtml(data.message || "").replace(/\n/g, "<br/>");
  const whatsappUrl = `https://wa.me/255792867427?text=${encodeURIComponent(
    `Habari Altraware! Nimetuma ombi la mradi ${safeRef} (${data.type || "System"}). Jina langu ni ${data.name}.`
  )}`;

  const subject = `Brief Received: ${data.type || "Project Inquiry"} [${safeRef}] — Altraware Technology`;

  const html = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="sw">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#050B17;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;color:#E2E8F0;">
  
  <!-- OUTER WRAPPER TABLE -->
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#050B17;padding:32px 12px;">
    <tr>
      <td align="center">
        
        <!-- MAIN CONTAINER -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:620px;background-color:#0B1426;border:1px solid #1E293B;border-radius:18px;overflow:hidden;box-shadow:0 25px 50px -12px rgba(0,0,0,0.7);">
          
          <!-- BRAND HEADER -->
          <tr>
            <td style="background:linear-gradient(180deg,#151B3B 0%,#0B1426 100%);padding:36px 32px 28px;border-bottom:1px solid rgba(255,255,255,0.08);">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <!-- STATUS BADGE -->
                    <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom:18px;">
                      <tr>
                        <td style="background-color:rgba(124,58,237,0.18);border:1px solid rgba(167,139,250,0.4);border-radius:24px;padding:5px 14px;color:#C4B5FD;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">
                          ● &nbsp;BRIEF RECEIVED &bull; IMEPOKELEWA
                        </td>
                      </tr>
                    </table>

                    <!-- LOGO & BRAND TITLE -->
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td valign="middle" style="padding-right:14px;">
                          <img src="https://altraware-technology.vercel.app/logo.png" alt="Altraware" width="46" height="46" style="display:block;border-radius:12px;border:1px solid rgba(255,255,255,0.15);background-color:#070E1E;" />
                        </td>
                        <td valign="middle">
                          <div style="font-size:20px;font-weight:800;color:#FFFFFF;letter-spacing:0.5px;margin:0;line-height:1.2;">
                            ALTRAWARE TECHNOLOGY
                          </div>
                          <div style="font-size:11px;color:#94A3B8;letter-spacing:1.5px;text-transform:uppercase;margin-top:4px;font-weight:600;">
                            SOFTWARE ENGINEERING &bull; DAR ES SALAAM, TANZANIA
                          </div>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- MAIN BODY CONTENT -->
          <tr>
            <td style="padding:32px 32px 28px;">
              
              <!-- GREETING -->
              <h2 style="font-size:22px;font-weight:700;color:#FFFFFF;margin:0 0 12px;line-height:1.3;">
                Habari, ${safeName}! 👋
              </h2>
              <p style="font-size:15px;line-height:1.6;color:#94A3B8;margin:0 0 24px;">
                Asante kwa kuwasiliana na <strong>Altraware Technology</strong>. Tumeipokea taarifa ya mradi wako na tumemkabidhi mhandisi wetu kwa ajili ya kufanya tathmini ya kiufundi (technical review). Mradi wako umepewa nambari ya utambulisho:
              </p>

              <!-- REF CODE BANNER -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:rgba(124,58,237,0.12);border:1px solid rgba(124,58,237,0.35);border-radius:12px;padding:14px 20px;margin-bottom:24px;">
                <tr>
                  <td>
                    <div style="font-size:11px;color:#A78BFA;text-transform:uppercase;font-weight:700;letter-spacing:1px;">
                      Nambari ya Kumbukumbu (Reference Code)
                    </div>
                    <div style="font-size:20px;font-weight:800;color:#FFFFFF;font-family:monospace;margin-top:4px;letter-spacing:1px;">
                      ${safeRef}
                    </div>
                  </td>
                  <td align="right" valign="middle">
                    <span style="background-color:#10B981;color:#FFFFFF;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;text-transform:uppercase;letter-spacing:0.5px;">
                      &check; Imethibitishwa
                    </span>
                  </td>
                </tr>
              </table>

              <!-- PROJECT SUMMARY BOX -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:22px;margin-bottom:28px;">
                <tr>
                  <td>
                    <div style="font-size:12px;font-weight:700;color:#7C3AED;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:16px;">
                      &bull; Muhtasari wa Mradi Alioomba
                    </div>

                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="38%" style="padding:8px 0;font-size:13px;color:#64748B;font-weight:500;">
                          Huduma / Mfumo:
                        </td>
                        <td width="62%" style="padding:8px 0;font-size:14px;color:#FFFFFF;font-weight:700;">
                          ${safeType}
                        </td>
                      </tr>

                      ${
                        safeOrg
                          ? `<tr>
                        <td style="padding:8px 0;font-size:13px;color:#64748B;font-weight:500;">
                          Kampuni / Taasisi:
                        </td>
                        <td style="padding:8px 0;font-size:14px;color:#FFFFFF;font-weight:600;">
                          ${safeOrg}
                        </td>
                      </tr>`
                          : ""
                      }

                      <tr>
                        <td style="padding:8px 0;font-size:13px;color:#64748B;font-weight:500;">
                          Makadirio ya Bajeti:
                        </td>
                        <td style="padding:8px 0;font-size:14px;color:#34D399;font-weight:700;">
                          ${safeBudget}
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:8px 0;font-size:13px;color:#64748B;font-weight:500;">
                          Muda Unaotarajiwa:
                        </td>
                        <td style="padding:8px 0;font-size:14px;color:#F1F5F9;font-weight:600;">
                          ${safeTimeline}
                        </td>
                      </tr>

                      ${
                        safeMessage
                          ? `<tr>
                        <td colspan="2" style="padding-top:14px;border-top:1px solid rgba(255,255,255,0.06);margin-top:8px;">
                          <div style="font-size:12px;color:#64748B;font-weight:600;margin-bottom:6px;text-transform:uppercase;">
                            Maelezo Yako:
                          </div>
                          <div style="font-size:13px;color:#CBD5E1;line-height:1.6;background-color:rgba(0,0,0,0.25);padding:12px 14px;border-radius:8px;border:1px solid rgba(255,255,255,0.05);">
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

              <!-- NEXT STEPS ROADMAP -->
              <div style="font-size:14px;font-weight:700;color:#FFFFFF;margin-bottom:16px;letter-spacing:0.5px;">
                Nini Kinafuata Sasa? (What happens next?)
              </div>

              <!-- STEP 1 -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:14px;">
                <tr>
                  <td width="36" valign="top">
                    <div style="width:28px;height:28px;background-color:#7C3AED;color:#FFFFFF;font-size:12px;font-weight:800;border-radius:50%;text-align:center;line-height:28px;">
                      1
                    </div>
                  </td>
                  <td valign="top" style="padding-left:12px;">
                    <div style="font-size:14px;font-weight:700;color:#FFFFFF;margin-bottom:2px;">
                      Tathmini ya Mahitaji (Masaa 0–12)
                    </div>
                    <div style="font-size:13px;color:#94A3B8;line-height:1.5;">
                      Wahandisi wetu wanapitia ramani ya mfumo, database, na muundo wa tovuti unaoendana na biashara yako.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- STEP 2 -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:14px;">
                <tr>
                  <td width="36" valign="top">
                    <div style="width:28px;height:28px;background-color:#7C3AED;color:#FFFFFF;font-size:12px;font-weight:800;border-radius:50%;text-align:center;line-height:28px;">
                      2
                    </div>
                  </td>
                  <td valign="top" style="padding-left:12px;">
                    <div style="font-size:14px;font-weight:700;color:#FFFFFF;margin-bottom:2px;">
                      Mawasiliano &amp; Quotation Rasmi (Ndani ya masaa 24)
                    </div>
                    <div style="font-size:13px;color:#94A3B8;line-height:1.5;">
                      Tunawasiliana nawe moja kwa moja kupitia WhatsApp au Simu kukupatia bei rasmi na ratiba ya hatua kwa hatua (milestones).
                    </div>
                  </td>
                </tr>
              </table>

              <!-- STEP 3 -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:26px;">
                <tr>
                  <td width="36" valign="top">
                    <div style="width:28px;height:28px;background-color:#7C3AED;color:#FFFFFF;font-size:12px;font-weight:800;border-radius:50%;text-align:center;line-height:28px;">
                      3
                    </div>
                  </td>
                  <td valign="top" style="padding-left:12px;">
                    <div style="font-size:14px;font-weight:700;color:#FFFFFF;margin-bottom:2px;">
                      Mfano wa Kwanza (Interactive Prototype) &amp; Kuanza Kazi
                    </div>
                    <div style="font-size:13px;color:#94A3B8;line-height:1.5;">
                      Kazi inaanza kwa uwazi, ufuatiliaji wa maendeleo live kwenye Client Portal, na mkataba wa kisheria wenye amani ya moyo.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- CALL TO ACTION BUTTONS -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top:20px;margin-bottom:10px;">
                <tr>
                  <td align="center">
                    
                    <!-- WHATSAPP FAST-TRACK BUTTON -->
                    <table border="0" cellspacing="0" cellpadding="0" style="margin:6px 0;">
                      <tr>
                        <td align="center" style="background-color:#25D366;border-radius:12px;">
                          <a href="${whatsappUrl}" target="_blank" style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:700;color:#FFFFFF;text-decoration:none;letter-spacing:0.5px;">
                            &phone;&nbsp; Zungumza Nasi WhatsApp (+255 792 867 427)
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- WEBSITE LINK BUTTON -->
                    <table border="0" cellspacing="0" cellpadding="0" style="margin:6px 0;">
                      <tr>
                        <td align="center" style="background-color:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:12px;">
                          <a href="https://altraware-technology.vercel.app/services" target="_blank" style="display:inline-block;padding:12px 24px;font-size:13px;font-weight:600;color:#CBD5E1;text-decoration:none;">
                            Tazama Mifumo &amp; Kazi Zetu &rarr;
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
            <td style="background-color:#070E1E;padding:26px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
              <div style="font-size:13px;font-weight:700;color:#FFFFFF;">
                Altraware Technology Ltd
              </div>
              <div style="font-size:12px;color:#64748B;margin-top:6px;line-height:1.6;">
                Dar es Salaam, Tanzania &bull; Simu: +255 792 867 427 / +255 790 942 616<br/>
                Barua pepe rasmi: <a href="mailto:altrawaretechnology@gmail.com" style="color:#A78BFA;text-decoration:none;">altrawaretechnology@gmail.com</a>
              </div>
              <div style="font-size:11px;color:#475569;margin-top:12px;">
                &copy; ${new Date().getFullYear()} Altraware Technology. Haki zote zimehifadhiwa. Ulinzi wa taarifa na mkataba wa kisheria umezingatiwa.
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
HABARI ${data.name.toUpperCase()} — ALTRAWARE TECHNOLOGY

Asante kwa kuwasiliana na Altraware Technology. Tumeipokea taarifa ya mradi wako na mhandisi wetu anaiangalia sasa.

MUHTASARI WA MRADI:
- Nambari ya Kumbukumbu: ${safeRef}
- Mfumo / Huduma: ${data.type}
- Makadirio ya Bajeti: ${data.budget || "Kuzungumzwa"}
- Muda Unaotarajiwa: ${data.timeline || "Kawaida"}
${data.org ? `- Kampuni / Taasisi: ${data.org}\n` : ""}- Maelezo Yako: ${data.message}

NINI KINAFUATA?
1. Tathmini ya Mahitaji ndani ya masaa 12.
2. Mawasiliano moja kwa moja kupitia WhatsApp/Simu na quotation rasmi ndani ya masaa 24.
3. Interactive Prototype na kuanza ujenzi.

Unahitaji jibu la haraka?
WhatsApp: +255 792 867 427
Barua pepe: altrawaretechnology@gmail.com
Tovuti: https://altraware-technology.vercel.app/
`.trim();

  return { subject, html, text };
}

/**
 * Generates an internal alert email sent to the Altraware team (altrawaretechnology@gmail.com).
 * 100% inline-styled, beautiful, and actionable.
 */
export function renderAdminAlertEmail(data: EmailInquiryData): { subject: string; html: string; text: string } {
  const safeName = escapeHtml(data.name);
  const safePhone = escapeHtml(data.phone);
  const safeEmail = escapeHtml(data.email || "Haijawekwa");
  const safeOrg = escapeHtml(data.org || "Mtu binafsi / Haikutajwa");
  const safeType = escapeHtml(data.type);
  const safeBudget = escapeHtml(data.budget || "Haijatajwa");
  const safeTimeline = escapeHtml(data.timeline || "Haijatajwa");
  const safeRef = escapeHtml(data.refCode);
  const safeMessage = escapeHtml(data.message).replace(/\n/g, "<br/>");

  const cleanPhone = data.phone.replace(/[^0-9]/g, "");
  const waLink = `https://wa.me/${cleanPhone.startsWith("0") ? "255" + cleanPhone.slice(1) : cleanPhone}`;

  const subject = `🔥 MRADI MPYA: ${data.name} (${data.type}) [${safeRef}]`;

  const html = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="sw">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#070E1E;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#F1F5F9;">
  
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#070E1E;padding:28px 12px;">
    <tr>
      <td align="center">
        
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#0F1A30;border:1px solid #1E293B;border-radius:16px;padding:28px;box-shadow:0 20px 40px rgba(0,0,0,0.5);">
          <tr>
            <td>
              
              <!-- BADGE -->
              <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom:14px;">
                <tr>
                  <td style="background-color:#7C3AED;color:#FFFFFF;font-size:11px;font-weight:700;padding:4px 12px;border-radius:6px;letter-spacing:1px;text-transform:uppercase;">
                    ⚡ LEAD MPYA AMEINGIA TOVUTINI
                  </td>
                </tr>
              </table>

              <h2 style="margin:0 0 8px;font-size:22px;color:#FFFFFF;font-weight:800;">
                Ombi Jipya la Mradi Limefika!
              </h2>
              <p style="margin:0 0 20px;color:#94A3B8;font-size:14px;line-height:1.5;">
                Mteja ametuma brief kwenye tovuti ya Altraware Technology. Hapa chini ni maelezo yake kamili:
              </p>

              <!-- CLIENT DETAILS CARD -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:rgba(255,255,255,0.035);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px 18px;margin-bottom:20px;">
                <tr>
                  <td width="35%" style="color:#64748B;font-size:13px;padding:7px 0;font-weight:600;">Jina la Mteja:</td>
                  <td width="65%" style="color:#FFFFFF;font-size:14px;padding:7px 0;font-weight:700;">${safeName}</td>
                </tr>
                <tr>
                  <td style="color:#64748B;font-size:13px;padding:7px 0;font-weight:600;">Simu / WhatsApp:</td>
                  <td style="font-size:14px;padding:7px 0;font-weight:700;">
                    <a href="tel:${safePhone}" style="color:#38BDF8;text-decoration:none;">${safePhone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="color:#64748B;font-size:13px;padding:7px 0;font-weight:600;">Barua Pepe:</td>
                  <td style="font-size:14px;padding:7px 0;font-weight:600;">
                    <a href="mailto:${safeEmail}" style="color:#C4B5FD;text-decoration:none;">${safeEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td style="color:#64748B;font-size:13px;padding:7px 0;font-weight:600;">Kampuni / Taasisi:</td>
                  <td style="color:#E2E8F0;font-size:14px;padding:7px 0;">${safeOrg}</td>
                </tr>
                <tr>
                  <td style="color:#64748B;font-size:13px;padding:7px 0;font-weight:600;">Aina ya Mfumo:</td>
                  <td style="color:#FBBF24;font-size:14px;padding:7px 0;font-weight:700;">${safeType}</td>
                </tr>
                <tr>
                  <td style="color:#64748B;font-size:13px;padding:7px 0;font-weight:600;">Makadirio ya Bajeti:</td>
                  <td style="color:#34D399;font-size:14px;padding:7px 0;font-weight:700;">${safeBudget}</td>
                </tr>
                <tr>
                  <td style="color:#64748B;font-size:13px;padding:7px 0;font-weight:600;">Muda Unaotakiwa:</td>
                  <td style="color:#E2E8F0;font-size:14px;padding:7px 0;">${safeTimeline}</td>
                </tr>
                <tr>
                  <td style="color:#64748B;font-size:13px;padding:7px 0;font-weight:600;">Ref Code:</td>
                  <td style="color:#A78BFA;font-size:14px;padding:7px 0;font-family:monospace;font-weight:800;">${safeRef}</td>
                </tr>
              </table>

              <!-- PROJECT NOTES -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:14px 18px;margin-bottom:24px;">
                <tr>
                  <td>
                    <div style="color:#94A3B8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">
                      Maelezo Aliyoandika Mteja:
                    </div>
                    <div style="color:#F1F5F9;font-size:13px;line-height:1.6;">
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
                        <td style="background-color:#10B981;border-radius:10px;">
                          <a href="${waLink}" target="_blank" style="display:inline-block;padding:12px 24px;color:#FFFFFF;text-decoration:none;font-size:14px;font-weight:700;">
                            💬 Mpigie / Chat WhatsApp Sasa
                          </a>
                        </td>
                      </tr>
                    </table>

                    ${
                      data.email
                        ? `<table border="0" cellspacing="0" cellpadding="0" style="margin:4px 0;">
                      <tr>
                        <td style="background-color:#7C3AED;border-radius:10px;">
                          <a href="mailto:${data.email}?subject=Altraware%20Technology%20-%20Kuhusu%20Mradi%20Wako%20[${safeRef}]" style="display:inline-block;padding:12px 24px;color:#FFFFFF;text-decoration:none;font-size:14px;font-weight:700;">
                            ✉️ Mjibu kwa Email
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
LEAD MPYA AMEINGIA TOVUTINI [${data.refCode}]

Mteja: ${data.name}
Kampuni: ${data.org || "N/A"}
Simu: ${data.phone}
Email: ${data.email || "N/A"}
Mfumo: ${data.type}
Bajeti: ${data.budget || "N/A"}
Muda: ${data.timeline || "N/A"}

Maelezo:
${data.message}

WhatsApp: ${waLink}
`.trim();

  return { subject, html, text };
}
