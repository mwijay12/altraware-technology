"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TransitionLink } from "@/components/Navbar";
import { Reveal, TiltCard, ImgReveal } from "@/components/motion";
import { useContent } from "@/components/providers";
import type { BlogPost } from "@/lib/content";

export default function BlogPage() {
  const { content } = useContent();
  const [filter, setFilter] = useState<string>("all");
  const posts = content.blog.posts.filter((p) => p.published);
  const tags = ["all", ...Array.from(new Set(posts.flatMap((p) => p.tags)))];

  const shown = filter === "all" ? posts : posts.filter((p) => p.tags.includes(filter));

  return (
    <div className="pt-[120px]">
      {/* HERO */}
      <section className="relative overflow-hidden grid-bg">
        <div className="absolute -top-32 -right-32 w-[560px] h-[560px] rounded-full bg-viol/10 blur-[120px] pointer-events-none" />
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-16 md:py-24">
          <Reveal>
            <div className="eyebrow text-viol mb-4 flex items-center gap-3">
              <span className="w-10 h-[2px] bg-viol inline-block" /> Notes from the workshop
            </div>
            <h1 className="display text-5xl md:text-7xl font-medium">
              Thinking, <i className="text-viol">written down.</i>
            </h1>
            <p className="text-deep/60 mt-6 max-w-xl text-[15px] md:text-base">{content.blog.intro}</p>
          </Reveal>
        </div>
      </section>

      {/* TAGS + POSTS */}
      <section className="bg-cream py-16 md:py-24">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8">
          <Reveal className="flex flex-wrap gap-2 mb-10">
            {tags.map((t) => (
              <button
                key={t}
                className={`text-xs font-grotesk font-bold px-4 py-2 rounded-full border transition-all ${
                  filter === t ? "bg-deep text-white border-deep" : "bg-white border-deep/10 text-deep/60 hover:border-viol"
                }`}
                onClick={() => setFilter(t)}
              >
                {t === "all" ? "All posts" : `#${t}`}
              </button>
            ))}
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {shown.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.07}>
                <TransitionLink href={`/blog/${p.slug}`} className="block h-full">
                  <TiltCard intensity={6} className="bg-white border border-deep/10 rounded-3xl overflow-hidden h-full hover:border-viol transition-colors">
                    <div className="relative h-48 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.cover} alt={p.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        {p.tags.map((t) => (
                          <span key={t} className="bg-deep/85 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="text-[11px] font-mono text-deep/40">
                        {new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · {p.author}
                      </div>
                      <div className="font-grotesk font-bold text-lg mt-2 leading-snug">{p.title}</div>
                      <p className="text-sm text-deep/60 mt-2 line-clamp-3">{p.excerpt}</p>
                      <div className="mt-4 text-sm font-bold text-viol flex items-center gap-2">
                        Read <i className="fa-solid fa-arrow-right text-xs" />
                      </div>
                    </div>
                  </TiltCard>
                </TransitionLink>
              </Reveal>
            ))}
          </div>

          {shown.length === 0 && (
            <div className="text-center text-deep/40 py-20">No posts under this tag yet — coming soon.</div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-deep text-white relative overflow-hidden">
        <div className="noise-blue absolute inset-0" />
        <div className="max-w-[900px] mx-auto px-5 py-24 text-center relative">
          <Reveal>
            <h2 className="display text-4xl md:text-6xl font-medium">
              Rather talk than <i className="text-violL">read?</i>
            </h2>
            <p className="text-white/55 mt-4">One conversation about your business is worth ten blog posts.</p>
            <div className="mt-8">
              <TransitionLink href="/contact" className="bg-white text-deep px-8 py-4 rounded-full font-bold text-sm hover:bg-viol hover:text-white transition-all inline-flex items-center gap-2">
                Start a project <i className="fa-solid fa-arrow-right" />
              </TransitionLink>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}