import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `Wewe ni "Altra", msaidizi mwerevu wa akili mnemba (AI) wa kampuni ya kiteknolojia ya Altraware Technologies Ltd iliyopo Dar es Salaam, Tanzania.
Wajibu wako ni kutoa majibu ya kitaalamu, ya heshima na ya kirafiki kwa wateja kwa Kiswahili na Kiingereza (au kuchanganya kulingana na mteja anavyoongea).

Kuhusu Altraware:
- Waasisi:
  1. David Mwijage — Co-Founder & Head of Engineering & Architecture (mtaalamu wa mifumo imara, offline-first, na ujenzi wa software).
  2. Clemence Ng'unda — Co-Founder & Head of Product & Business Operations (mtaalamu wa bidhaa, masoko, na uendeshaji).
- Kaulimbiu: "Mizizi ya nyumbani. Ufundi wa kidunia." (Local roots, world-class craft).
- Namba ya simu & WhatsApp: +255 792 867 427 (inayojibu haraka kila siku).
- Email: altrawaretechnology@gmail.com
- Eneo: Dar es Salaam, Tanzania.

Mifumo Yetu Mikubwa (Platforms):
1. Faida POS:
   - Mfumo wa mauzo wa duka, mgahawa, na retail unaofanya kazi 100% bila mtandao wa intaneti (Offline-first).
   - Unatoa ripoti za kila siku za SMS kwa mmiliki jioni, upashanaji wa M-Pesa na stoo.
   - Live Web Demo: https://faida-hq.vercel.app/
   - Flutter Android APK ya moja kwa moja: https://github.com/mwijay12/faida-pos-releases/releases/download/Faida/faida.pos.apk
   - GitHub Releases Repo: https://github.com/mwijay12/faida-pos-releases

2. CareTrack:
   - Mfumo wa kliniki, vituo vya kulelea watoto, na shule (attendance, health notes, ada za shule).
   - Una usalama wa hali ya juu na unapatikana hata kwa mtandao wa 2G.
   - Live Web System: https://caretrack-six.vercel.app/dashboard (ina Demo/Guest Mode wazi kwa kila mtu kuingia).

Viwango vya Bei (Pricing):
1. Websites:
   - Ona · Web Starter: TSh 350,000 (ukurasa 1, mobile-first, WhatsApp CTA, Google Maps, SEO).
   - Biashara · Growth Site: TSh 550,000 (kurasa 4–6, booking/maulizo, catalog, Google Business, mafunzo).
   - Kilele · Pro Web Portal: TSh 750,000 (CMS Admin dashboard, M-Pesa/Tigo Pesa payment, kurasa zisizo na kikomo, miezi 2 support).
2. Mifumo ya Biashara (Systems):
   - Mfumo wa Duka (Faida POS): TSh 1,850,000 (Kaunta, offline mode, stoo, SMS reports, Android app).
   - Mfumo wa Kliniki / Huduma (CareTrack): TSh 3,450,000 (Kumbukumbu za wagonjwa, ada, SMS kwa wazazi, usalama).
   - Enterprise ERP / Custom: Custom quote kulingana na ukubwa wa kampuni (kuanzia 8M+).

Miongozo ya Majibu:
- Jibu kwa lugha aliyotaka mtumiaji (Kiswahili au Kiingereza).
- USITUMIE alama za markdown kama vile **, ***, au ### kamwe (USIWEKE alama za nyota au reli). Badala yake, andika maandishi safi yenye aya fupi, orodha zenye alama za dash (-) au namba, na maneno yaliyopangwa kwa usafi.
- Majibu yawe mafupi, fasaha, yaliyopangika vizuri, na ya kirafiki.
- Ikiwezekana kila unapomaliza kumpa jibu mteja, mhimize kubofya kitufe cha WhatsApp chat au kuacha ujumbe.
`;

function getInceptionKeys(): string[] {
  const multi = process.env.INCEPTION_API_KEYS;
  if (multi) {
    const list = multi.split(",").map((k) => k.trim()).filter(Boolean);
    if (list.length > 0) return list;
  }
  const single = process.env.INCEPTION_API_KEY;
  return single ? [single] : [];
}

function getAgnesKeys(): string[] {
  const multi = process.env.AGNES_API_KEYS;
  if (multi) {
    const list = multi.split(",").map((k) => k.trim()).filter(Boolean);
    if (list.length > 0) return list;
  }
  const single = process.env.AGNES_API_KEY;
  return single ? [single] : [];
}

async function callInception(messages: { role: string; content: string }[], key: string): Promise<string> {
  const res = await fetch("https://api.inceptionlabs.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.INCEPTION_MODEL || "mercury-2.5",
      reasoning_effort: process.env.INCEPTION_REASONING_EFFORT || "low",
      messages,
      temperature: 0.7,
      max_tokens: 800,
    }),
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Inception error [${res.status}]: ${errText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

async function callAgnes(messages: { role: string; content: string }[], key: string): Promise<string> {
  const res = await fetch("https://apihub.agnes-ai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.AGNES_MODEL || "openai/deepseek-ai/DeepSeek-V3",
      messages,
      temperature: 0.7,
      max_tokens: 800,
    }),
    signal: AbortSignal.timeout(18000),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Agnes error [${res.status}]: ${errText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Build chat message payload
    const formattedMessages: { role: string; content: string }[] = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    if (Array.isArray(history)) {
      for (const h of history.slice(-6)) {
        if (h.text && (h.from === "user" || h.from === "ai")) {
          formattedMessages.push({
            role: h.from === "user" ? "user" : "assistant",
            content: h.text,
          });
        }
      }
    }

    formattedMessages.push({ role: "user", content: message });

    // 1. Try Inception Labs with rotation
    const inceptionKeys = getInceptionKeys();
    // Shuffle keys so load is distributed
    const shuffledInception = [...inceptionKeys].sort(() => Math.random() - 0.5);

    for (const key of shuffledInception) {
      try {
        const reply = await callInception(formattedMessages, key);
        if (reply && reply.trim()) {
          return NextResponse.json({ reply, provider: "inception" });
        }
      } catch (err) {
        console.warn("Inception key failed, rotating to next key...", err);
      }
    }

    // 2. Fallback to Agnes AI (DeepSeek-V3) with rotation
    const agnesKeys = getAgnesKeys();
    const shuffledAgnes = [...agnesKeys].sort(() => Math.random() - 0.5);

    for (const key of shuffledAgnes) {
      try {
        const reply = await callAgnes(formattedMessages, key);
        if (reply && reply.trim()) {
          return NextResponse.json({ reply, provider: "agnes" });
        }
      } catch (err) {
        console.warn("Agnes key failed, rotating to next key...", err);
      }
    }

    // Fallback response if external network unavailable
    return NextResponse.json({
      reply:
        "Karibu sana Altraware! Nipo hapa kukusaidia kuhusu tovuti zetu (Web Starter TSh 350k, Growth 550k, Pro 750k) na mifumo ya kibiashara kama Faida POS na CareTrack. Unaweza pia kubofya kitufe cha WhatsApp hapo chini kuwasiliana na David au Clemence moja kwa moja!",
      provider: "local-fallback",
    });
  } catch (err: any) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      {
        reply:
          "Samahani, mtandao ulikuwa na changamoto kidogo. Unaweza kuwasiliana nasi moja kwa moja kupitia WhatsApp (+255 792 867 427) au uulize swali lingine!",
        provider: "fallback",
      },
      { status: 200 }
    );
  }
}
