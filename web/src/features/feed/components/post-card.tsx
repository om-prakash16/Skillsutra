import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThumbsUp, MessageSquare, Repeat2, Send, MoreHorizontal, Globe2 } from "lucide-react"
import Link from "next/link"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api/api-client"

export interface Post {
    id: string
    author_id: string
    content_markdown: string
    visibility: string
    likes_count: number
    comments_count: number
    reposts_count: number
    created_at: string
    updated_at: string
    media: any[]
    author_profile: {
        id: string
        full_name: string
        headline: string
        banner_url: string
    }
    has_liked: boolean
}

export function PostCard({ post }: { post: Post }) {
    const queryClient = useQueryClient()

    const likeMutation = useMutation({
        mutationFn: () => api.feed.toggleLike(post.id),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["feed"] })
            const previousFeed = queryClient.getQueryData(["feed"])
            
            // Optimistically update
            queryClient.setQueryData(["feed"], (old: any) => {
                if (!old) return old
                return old.map((p: Post) => {
                    if (p.id === post.id) {
                        return {
                            ...p,
                            has_liked: !p.has_liked,
                            likes_count: p.has_liked ? Math.max(0, p.likes_count - 1) : p.likes_count + 1
                        }
                    }
                    return p
                })
            })
            return { previousFeed }
        },
        onError: (err, newTodo, context: any) => {
            queryClient.setQueryData(["feed"], context.previousFeed)
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["feed"] })
        }
    })

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
        
        if (diffInSeconds < 60) return "Just now"
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
        return `${Math.floor(diffInSeconds / 86400)}d`
    }

    return (
        <Card className="glass border-border/50 rounded-2xl overflow-hidden mb-6">
            <CardContent className="p-0">
                <div className="p-4 sm:p-6 pb-2">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <Link href={`/in/${post.author_profile.id}`}>
                                <Avatar className="w-12 h-12 border-2 border-background shadow-sm hover:opacity-90 transition-opacity">
                                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                        {post.author_profile.full_name?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </Link>
                            <div>
                                <Link href={`/in/${post.author_profile.id}`} className="font-bold hover:underline hover:text-primary transition-colors flex items-center gap-1">
                                    {post.author_profile.full_name}
                                    <span className="text-muted-foreground text-xs font-normal hidden sm:inline">• 1st</span>
                                </Link>
                                <p className="text-xs text-muted-foreground line-clamp-1">{post.author_profile.headline || "Member"}</p>
                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground/80 mt-0.5">
                                    <span>{formatDate(post.created_at)}</span>
                                    <span>•</span>
                                    <Globe2 className="w-3 h-3" />
                                </div>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <MoreHorizontal className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="mt-4 text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                        {post.content_markdown}
                    </div>
                </div>

                {post.media && post.media.length > 0 && post.media[0].media_type === "IMAGE" && (
                    <div className="mt-3 bg-muted/20 border-y border-border/50">
                        <img 
                            src={post.media[0].media_url} 
                            alt="Post attachment" 
                            className="w-full max-h-[500px] object-cover"
                            loading="lazy"
                        />
                    </div>
                )}

                <div className="px-4 sm:px-6 py-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/50 pb-3 mb-1">
                        <div className="flex items-center gap-1 hover:text-primary hover:underline cursor-pointer">
                            <div className="flex -space-x-1">
                                <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center ring-2 ring-background z-10">
                                    <ThumbsUp className="w-2 h-2 text-white fill-current" />
                                </div>
                            </div>
                            <span className="ml-1">{post.likes_count}</span>
                        </div>
                        <div className="flex gap-3">
                            <span className="hover:text-primary hover:underline cursor-pointer">{post.comments_count} comments</span>
                            <span className="hover:text-primary hover:underline cursor-pointer">{post.reposts_count} reposts</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-between items-center pt-1">
                        <Button 
                            variant="ghost" 
                            className={`flex-1 sm:flex-none hover:bg-muted rounded-xl h-12 ${post.has_liked ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                            onClick={() => likeMutation.mutate()}
                            disabled={likeMutation.isPending}
                        >
                            <ThumbsUp className={`w-5 h-5 sm:mr-2 ${post.has_liked ? 'fill-current' : ''}`} />
                            <span className="text-sm font-medium hidden sm:inline">Like</span>
                        </Button>
                        <Button variant="ghost" className="flex-1 sm:flex-none text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl h-12">
                            <MessageSquare className="w-5 h-5 sm:mr-2" />
                            <span className="text-sm font-medium hidden sm:inline">Comment</span>
                        </Button>
                        <Button variant="ghost" className="flex-1 sm:flex-none text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl h-12">
                            <Repeat2 className="w-5 h-5 sm:mr-2" />
                            <span className="text-sm font-medium hidden sm:inline">Repost</span>
                        </Button>
                        <Button variant="ghost" className="flex-1 sm:flex-none text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl h-12">
                            <Send className="w-5 h-5 sm:mr-2" />
                            <span className="text-sm font-medium hidden sm:inline">Send</span>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
