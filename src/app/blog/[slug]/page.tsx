"use client";

import { useParams } from "next/navigation";
import { TransitionLink } from "@/components/Navbar";
import { Reveal, ImgReveal } from "@/components/motion";
import { useContent } from "@/components/providers";

export default function BlogPostPage() {
  const params = useParams();
  const { content } = useContent();
  const post = content.blog.posts.find((p) => p.slug === params.slug);

  if (!post) {
    return (
      <div className="pt-[160px] pb-32 text-center">
        <div className="display text-4xl">Post not found — <i className="text-viol">hamna.</i></div>
        <TransitionLink href="/blog" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-viol">
          ← Back to all posts
        </TransitionLink>
      </div>
    );
  }

  const others = content.blog.posts.filter((p) => p.slug !== post.slug && p.published).slice(0, 2);

  return (
    <div className="pt-[120px]">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[560px] h-[560px] rounded-full bg-viol/10 blur-[120px] pointer-events-none" />
        <div className="max-w-[840px] mx-auto px-5 md:px-8 py-14 md:py-20">
          <Reveal>
            <TransitionLink href="/blog" className="text-xs font-grotesk font-bold text-viol flex items-center gap-2 mb-6">
              <i className="fa-solid fa-arrow-left" /> All posts
            </TransitionLink>
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((t) => (
                <span key={t} className="bg-viol/10 text-viol text-[11px] font-bold px-3 py-1 rounded-full">#{t}</span>
              ))}
            </div>
            <h1 className="display text-4xl md:text-6xl font-medium leading-[1.02]">{post.title}</h1>
            <div className="flex items-center gap-3 mt-6">
              <div className="w-10 h-10 rounded-full bg-deep text-white flex items-center justify-center font-bold">{post.author.charAt(0)}</div>
              <div>
                <div className="text-sm font-bold">{post.author}</div>
                <div className="text-xs text-deep/50 font-mono">
                  {new Date(post.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* COVER */}
      <section className="max-w-[1000px] mx-auto px-5 md:px-8">
        <ImgReveal src={post.cover} alt={post.title} className="rounded-3xl h-[340px] md:h-[440px] border-8 border-white shadow-2xl shadow-deep/20" imgClassName="w-full h-full object-cover" />
      </section>

      {/* BODY */}
      <section className="bg-cream py-16 md:py-24 mt-16">
        <div className="max-w-[760px] mx-auto px-5 md:px-8">
          <Reveal>
            <p className="font-serif italic text-xl md:text-2xl text-deep/85 leading-relaxed border-l-4 border-viol pl-6">
              {post.excerpt}
            </p>
          </Reveal>
          {post.body.map((para, i) => (
            <Reveal key={i} delay={0.05 * i}>
              <p className="text-deep/70 text-base md:text-lg leading-relaxed mt-8">{para}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* MORE POSTS */}
      {others.length > 0 && (
        <section className="bg-white py-16 md:py-24 border-t border-line">
          <div className="max-w-[1000px] mx-auto px-5 md:px-8">
            <Reveal>
              <div className="eyebrow text-viol mb-6">Keep reading — Endelea kusoma</div>
            </Reveal>
            <div className="grid md:grid-cols-2 gap-5">
              {others.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08}>
                  <TransitionLink href={`/blog/${p.slug}`} className="block group">
                    <div className="bg-cream border border-deep/10 rounded-3xl overflow-hidden group-hover:border-viol transition-colors">
                      <div className="h-40 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.cover} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
                      </div>
                      <div className="p-5">
                        <div className="font-grotesk font-bold text-lg leading-snug">{p.title}</div>
                        <p className="text-sm text-deep/60 mt-2 line-clamp-2">{p.excerpt}</p>
                      </div>
                    </div>
                  </TransitionLink>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}