import nodemailer from "nodemailer";
import {
  EmailInquiryData,
  renderClientConfirmationEmail,
  renderAdminAlertEmail,
} from "./email-templates";

interface EmailDispatchResult {
  success: boolean;
  clientSent: boolean;
  adminSent: boolean;
  error?: string;
  reason?: string;
}

type Transporter = ReturnType<typeof nodemailer.createTransport>;

let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const user = process.env.SMTP_USER?.trim();
  let pass = process.env.SMTP_PASS?.trim();

  if (pass?.startsWith('"') && pass?.endsWith('"')) {
    pass = pass.slice(1, -1).trim();
  }

  const secure = process.env.SMTP_SECURE !== undefined ? process.env.SMTP_SECURE === "true" : port === 465;

  if (!user || !pass) {
    return null;
  }

  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
      pool: true,
      maxConnections: 3,
      maxMessages: 100,
    });
  }

  return cachedTransporter;
}

export async function sendProjectInquiryEmails(data: EmailInquiryData): Promise<EmailDispatchResult> {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn(
      "[Nodemailer] SMTP credentials (SMTP_USER / SMTP_PASS) not configured in environment. Skipping email dispatch."
    );
    return {
      success: false,
      clientSent: false,
      adminSent: false,
      reason: "SMTP_NOT_CONFIGURED",
    };
  }

  const defaultFrom =
    process.env.SMTP_FROM || `"Altraware Technology" <${process.env.SMTP_USER}>`;
  const adminEmail =
    process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_USER || "altrawaretechnology@gmail.com";

  let clientSent = false;
  let adminSent = false;
  const errors: string[] = [];

  // 1. Send confirmation email to client if valid email provided
  if (data.email && data.email.includes("@")) {
    try {
      const clientContent = renderClientConfirmationEmail(data);
      await transporter.sendMail({
        from: defaultFrom,
        to: data.email,
        replyTo: adminEmail,
        subject: clientContent.subject,
        html: clientContent.html,
        text: clientContent.text,
      });
      clientSent = true;
      console.log(`[Nodemailer] Successfully sent confirmation email to client: ${data.email} [${data.refCode}]`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[Nodemailer] Failed to send client confirmation email:", msg);
      errors.push(`Client: ${msg}`);
    }
  }

  // 2. Send internal notification email to the Altraware team
  try {
    const adminContent = renderAdminAlertEmail(data);
    await transporter.sendMail({
      from: defaultFrom,
      to: adminEmail,
      replyTo: data.email || undefined,
      subject: adminContent.subject,
      html: adminContent.html,
      text: adminContent.text,
    });
    adminSent = true;
    console.log(`[Nodemailer] Successfully sent admin notification email to: ${adminEmail} [${data.refCode}]`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Nodemailer] Failed to send admin alert email:", msg);
    errors.push(`Admin: ${msg}`);
  }

  return {
    success: clientSent || adminSent,
    clientSent,
    adminSent,
    error: errors.length > 0 ? errors.join("; ") : undefined,
  };
}
