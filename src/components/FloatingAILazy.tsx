"use client";

import dynamic from "next/dynamic";

// FloatingAI is heavy (chat state + fetch logic) and only needed after
// user interaction — load it lazily on the client so it never blocks
// LCP / FCP on mobile. This wrapper lives in a Client Component because
// `ssr: false` is not allowed directly in a Server Component (layout).
const FloatingAI = dynamic(() => import("@/components/FloatingAI"), {
  ssr: false,
});

export default function FloatingAILazy() {
  return <FloatingAI />;
}
