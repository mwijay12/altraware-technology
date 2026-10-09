import type { Metadata } from "next";
import { DEFAULT_CONTENT } from "@/lib/content";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = DEFAULT_CONTENT.blog.posts.find((p) => p.slug === slug);
  if (!post) return { title: "Post" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: post.cover ? [post.cover] : [], type: "article" },
  };
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
