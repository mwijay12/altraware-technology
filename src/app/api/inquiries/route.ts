import { NextResponse } from "next/server";
import { sendProjectInquiryEmails } from "@/lib/email";
import { EmailInquiryData } from "@/lib/email-templates";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      org,
      type,
      budget,
      timeline,
      message,
      refCode: providedRef,
    } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone number are required" },
        { status: 400 }
      );
    }

    const refCode =
      providedRef || "#ALT-" + Math.floor(1000 + Math.random() * 9000);

    const inquiryPayload: EmailInquiryData = {
      name: String(name).trim(),
      email: email ? String(email).trim() : undefined,
      phone: String(phone).trim(),
      org: org ? String(org).trim() : undefined,
      type: type ? String(type).trim() : "Custom Software",
      budget: budget ? String(budget).trim() : undefined,
      timeline: timeline ? String(timeline).trim() : undefined,
      message: message ? String(message).trim() : "Project brief submitted via Altraware website.",
      refCode,
    };

    // Dispatch emails via Nodemailer
    const emailResult = await sendProjectInquiryEmails(inquiryPayload);

    return NextResponse.json({
      ok: true,
      refCode,
      emailSent: emailResult.clientSent,
      adminNotified: emailResult.adminSent,
      reason: emailResult.reason,
      error: emailResult.error,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    console.error("[API /api/inquiries] Error handling project inquiry:", msg);
    return NextResponse.json(
      { error: "Failed to process inquiry email", details: msg },
      { status: 500 }
    );
  }
}
