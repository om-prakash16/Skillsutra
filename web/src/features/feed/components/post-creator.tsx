"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageIcon, Video, Calendar, FileText, Send } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api/api-client"
import { toast } from "sonner"

export function PostCreator({ user }: { user: any }) {
    const [content, setContent] = useState("")
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (data: any) => api.feed.createPost(data),
        onSuccess: () => {
            setContent("")
            toast.success("Post created!")
            queryClient.invalidateQueries({ queryKey: ["feed"] })
        },
        onError: () => {
            toast.error("Failed to create post")
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return
        mutation.mutate({ content_markdown: content, visibility: "PUBLIC", media: [] })
    }

    if (!user) return null

    return (
        <Card className="glass border-border/50 rounded-2xl overflow-hidden mb-6">
            <CardContent className="p-4 sm:p-6 space-y-4">
                <form onSubmit={handleSubmit}>
                    <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12 border-2 border-background shadow-sm">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                {user.username?.[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex gap-2">
                            <Input 
                                placeholder="Start a post..." 
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                disabled={mutation.isPending}
                                className="rounded-full bg-muted/50 border-border hover:bg-muted/80 focus:bg-background transition-colors h-12 px-6"
                            />
                            {content.trim() && (
                                <Button 
                                    type="submit" 
                                    disabled={mutation.isPending}
                                    className="rounded-full h-12 w-12 p-0 flex-shrink-0"
                                >
                                    <Send className="w-5 h-5" />
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
                
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                    <Button type="button" variant="ghost" className="flex-1 sm:flex-none text-muted-foreground hover:text-foreground rounded-xl h-10 px-4">
                        <ImageIcon className="w-5 h-5 mr-2 text-blue-500" />
                        <span className="text-sm font-medium">Media</span>
                    </Button>
                    <Button type="button" variant="ghost" className="flex-1 sm:flex-none text-muted-foreground hover:text-foreground rounded-xl h-10 px-4">
                        <Video className="w-5 h-5 mr-2 text-emerald-500" />
                        <span className="text-sm font-medium">Video</span>
                    </Button>
                    <Button type="button" variant="ghost" className="flex-1 sm:flex-none text-muted-foreground hover:text-foreground rounded-xl h-10 px-4 hidden sm:flex">
                        <Calendar className="w-5 h-5 mr-2 text-amber-500" />
                        <span className="text-sm font-medium">Event</span>
                    </Button>
                    <Button type="button" variant="ghost" className="flex-1 sm:flex-none text-muted-foreground hover:text-foreground rounded-xl h-10 px-4 hidden sm:flex">
                        <FileText className="w-5 h-5 mr-2 text-rose-500" />
                        <span className="text-sm font-medium">Write article</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
