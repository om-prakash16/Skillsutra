"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, Sparkles, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Type definition for BlogPost
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  read_time: string;
  author_name: string;
  image_gradient?: string;
  published_at: string;
}

export default function BlogPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const res = await fetch(`${apiUrl}/blog/posts`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json() as Promise<{ data: BlogPost[], total: number }>;
    }
  });

  const posts = data?.data || [];
  const featuredPost = posts.length > 0 ? posts[0] : null;
  const recentPosts = posts.length > 1 ? posts.slice(1) : [];

  return (
    <div className="min-h-screen py-24 px-4 md:px-8 relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 blur-[150px] -z-10 rounded-full" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-secondary/5 blur-[150px] -z-10 rounded-full" />
      
      <div className="max-w-7xl mx-auto space-y-24 relative z-10">
        
        {/* Header Section */}
        <div className="text-center space-y-8 max-w-3xl mx-auto">
           <div className="flex justify-center">
               <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-micro px-6 py-2 rounded-full shadow-premium">
                 Intelligence & Insights
               </Badge>
           </div>
           <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
             The SkillSutra <br />
             <span className="text-primary italic font-black">Journal</span>
           </h1>
           <p className="text-muted-foreground text-lg md:text-xl font-normal leading-relaxed">
             Insights, research, and technical deep-dives on the future of verified talent, AI hiring, and the skills economy.
           </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
             <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-destructive">
             <p>Failed to load transmissions.</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                   <Sparkles className="w-6 h-6 text-primary" />
                   <h2 className="text-3xl font-extrabold tracking-tight">Featured Transmission</h2>
                </div>
                
                <Link href={`/blog/${featuredPost.slug}`} className="block group">
                  <Card className="glass border-black/5 dark:border-border/50 shadow-premium overflow-hidden rounded-[2.5rem] group-hover:border-primary/40 transition-colors duration-500 relative">
                     <div className={`absolute inset-0 bg-gradient-to-br ${featuredPost.image_gradient || 'from-primary/20 via-primary/5 to-transparent'} opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
                     
                     <div className="grid md:grid-cols-2 gap-8 relative z-10">
                        <div className="h-64 md:h-full min-h-[300px] bg-muted/5 dark:bg-muted/5 relative overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                            <div className="w-32 h-32 bg-primary/20 rounded-full blur-3xl absolute" />
                            <div className="text-6xl text-primary/40 font-black italic transform -rotate-12 group-hover:scale-110 group-hover:text-primary/60 transition-all duration-700 text-center px-4">
                                {featuredPost.category}
                            </div>
                        </div>
                        
                        <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
                            <Badge variant="outline" className="w-fit text-primary border-primary/20 bg-primary/5 uppercase tracking-widest text-[10px] px-3 py-1">
                                {featuredPost.category}
                            </Badge>
                            
                            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                                {featuredPost.title}
                            </h3>
                            
                            <p className="text-muted-foreground text-lg leading-relaxed line-clamp-3">
                                {featuredPost.excerpt}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm font-medium text-muted-foreground">
                                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(featuredPost.published_at).toLocaleDateString()}</span>
                                <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {featuredPost.read_time}</span>
                                <span className="text-primary italic ml-auto group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-2">
                                   Read Full Briefing <ArrowRight className="w-4 h-4" />
                                </span>
                            </div>
                        </div>
                     </div>
                  </Card>
                </Link>
              </section>
            )}

            {/* Latest Posts Grid */}
            {recentPosts.length > 0 && (
              <section className="space-y-8">
                  <h2 className="text-3xl font-extrabold tracking-tight">Recent Archives</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {recentPosts.map((post) => (
                          <Link key={post.id} href={`/blog/${post.slug}`} className="block group h-full">
                              <Card className="h-full glass border-black/5 dark:border-border/50 shadow-premium rounded-[2rem] hover:border-primary/40 transition-colors duration-500 flex flex-col">
                                  <CardHeader className="space-y-4 pt-8 px-8">
                                      <Badge variant="secondary" className="w-fit bg-muted/50 text-muted-foreground uppercase tracking-widest text-[9px] px-3 py-1 font-bold">
                                          {post.category}
                                      </Badge>
                                      <CardTitle className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight">
                                          {post.title}
                                      </CardTitle>
                                  </CardHeader>
                                  <CardContent className="px-8 flex-1">
                                      <p className="text-muted-foreground leading-relaxed line-clamp-3">
                                          {post.excerpt}
                                      </p>
                                  </CardContent>
                                  <CardFooter className="px-8 pb-8 pt-4 border-t border-border/30 mt-auto flex items-center justify-between text-xs text-muted-foreground font-medium">
                                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(post.published_at).toLocaleDateString()}</span>
                                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.read_time}</span>
                                  </CardFooter>
                              </Card>
                          </Link>
                      ))}
                  </div>

                  <div className="pt-12 text-center">
                      <Button variant="outline" className="h-14 px-8 text-xs font-bold tracking-widest uppercase rounded-2xl hover:border-primary/50 transition-all">
                          Load Older Transmissions
                      </Button>
                  </div>
              </section>
            )}
          </>
        )}

      </div>
    </div>
  );
}
