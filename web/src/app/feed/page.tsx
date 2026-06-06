"use client"

import { useAuth } from "@/context/auth-context"
import { MiniProfile } from "@/features/feed/components/mini-profile"
import { PostCreator } from "@/features/feed/components/post-creator"
import { PostCard, Post } from "@/features/feed/components/post-card"
import { TrendingWidget } from "@/features/feed/components/trending-widget"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api/api-client"

export default function FeedPage() {
    const { user, isLoading } = useAuth()

    const { data: posts, isLoading: feedLoading } = useQuery({
        queryKey: ["feed"],
        queryFn: async () => {
            const res = await api.feed.getPosts()
            return res.data
        }
    })

    return (
        <div className="min-h-screen bg-background/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Sidebar (Mini Profile) */}
                    <div className="hidden lg:block lg:col-span-3">
                        <MiniProfile user={user} />
                    </div>

                    {/* Main Content (Feed) */}
                    <div className="col-span-1 lg:col-span-6 space-y-6">
                        <PostCreator user={user} />
                        
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <hr className="flex-1 border-border/50" />
                                <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest px-2">Sort by: Top</span>
                                <hr className="flex-1 border-border/50" />
                            </div>

                            {feedLoading ? (
                                <div className="text-center text-muted-foreground py-10">Loading feed...</div>
                            ) : posts && posts.length > 0 ? (
                                posts.map((post: Post) => (
                                    <PostCard key={post.id} post={post} />
                                ))
                            ) : (
                                <div className="text-center text-muted-foreground py-10">
                                    No posts yet. Be the first to share something!
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar (Trending & Suggestions) */}
                    <div className="hidden lg:block lg:col-span-3">
                        <TrendingWidget />
                    </div>
                </div>
            </div>
        </div>
    )
}
