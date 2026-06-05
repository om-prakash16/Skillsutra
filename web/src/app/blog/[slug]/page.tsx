import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  read_time: string;
  author_name: string;
  image_gradient?: string;
  published_at: string;
}

async function getPost(slug: string): Promise<BlogPost | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
  try {
    const res = await fetch(`${apiUrl}/blog/posts/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch post");
    }
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) return { title: "Post Not Found" };
  
  return {
    title: `${post.title} | SkillSutra Journal`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen py-24 px-4 md:px-8 relative overflow-hidden bg-background">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 blur-[150px] -z-10 rounded-full" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-secondary/5 blur-[150px] -z-10 rounded-full" />

      <div className="max-w-3xl mx-auto space-y-12 relative z-10">
        
        {/* Navigation */}
        <Link href="/blog" className="inline-flex items-center text-sm font-bold tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Journal
        </Link>

        {/* Header */}
        <header className="space-y-8 pb-12 border-b border-border/50">
            <div className="flex items-center justify-between">
                <Badge variant="outline" className="w-fit text-primary border-primary/20 bg-primary/5 uppercase tracking-widest text-xs px-4 py-1.5 rounded-full">
                    {post.category}
                </Badge>
                
                <div className="flex items-center gap-4 text-muted-foreground">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                        <Share2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground">
                {post.title}
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
                {post.excerpt}
            </p>

            <div className="flex items-center gap-6 pt-4 text-sm font-medium text-muted-foreground/80">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {post.author_name.charAt(0)}
                    </div>
                    <span className="text-foreground">{post.author_name}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-border" />
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(post.published_at).toLocaleDateString()}</span>
                <div className="w-1 h-1 rounded-full bg-border" />
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {post.read_time}</span>
            </div>
        </header>

        {/* Featured Image Placeholder or Gradient Area */}
        <div className={`w-full h-48 md:h-80 rounded-[2rem] bg-gradient-to-br ${post.image_gradient || 'from-primary/20 via-primary/5 to-transparent'} relative overflow-hidden flex items-center justify-center`}>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
            <div className="text-6xl text-primary/10 font-black italic transform -rotate-12 select-none text-center px-4">
                {post.category}
            </div>
        </div>

        {/* Markdown Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
            <ReactMarkdown>
                {post.content}
            </ReactMarkdown>
        </div>

      </div>
    </article>
  );
}
