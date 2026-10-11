import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // 1. Check Vercel edge geolocation header
  const vercelCountry = req.headers.get("x-vercel-ip-country");
  
  if (vercelCountry) {
    const code = vercelCountry.toUpperCase();
    return NextResponse.json({
      countryCode: code,
      countryName: code === "TZ" ? "Tanzania" : code,
      source: "vercel",
    });
  }

  // 2. Fallback to Cloudflare or other CDN headers if present
  const cfCountry = req.headers.get("cf-ipcountry");
  if (cfCountry && cfCountry !== "XX") {
    const code = cfCountry.toUpperCase();
    return NextResponse.json({
      countryCode: code,
      countryName: code === "TZ" ? "Tanzania" : code,
      source: "cloudflare",
    });
  }

  return NextResponse.json({
    countryCode: "TZ",
    countryName: "Tanzania",
    source: "default",
  });
}
