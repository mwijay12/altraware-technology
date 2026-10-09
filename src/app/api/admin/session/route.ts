import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

/* ============================================================
   Master passphrase check — SERVER SIDE pekee.
   Nenosiri halisi halitoki kwenye JS bundle ya client.
   Weka ADMIN_MASTER_KEY kwenye .env.local (na Vercel env vars).
   Bila hiyo key, master login imezimwa → tumia Google/Email.
   ============================================================ */

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export async function POST(req: Request) {
  const master = process.env.ADMIN_MASTER_KEY || "";
  if (!master) {
    return NextResponse.json(
      { error: "Master key haijawekwa kwenye server. Tumia Google au Email kuingia." },
      { status: 503 }
    );
  }

  let passphrase = "";
  try {
    const body = (await req.json()) as { passphrase?: unknown };
    if (typeof body.passphrase === "string") passphrase = body.passphrase;
  } catch {
    passphrase = "";
  }

  if (!passphrase || !safeEqual(passphrase, master)) {
    // Chelewesha kidogo kupunguza kasi ya brute-force
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: "Nenosiri si sahihi — jaribu tena." }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
