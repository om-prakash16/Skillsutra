import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { userApi } from "@/lib/api/api-client"

export function MiniProfile({ user }: { user: any }) {
    const { data: profileResponse } = useQuery({
        queryKey: ["userProfile", user?.id],
        queryFn: async () => {
            const res = await userApi.profile.get()
            return res.profile
        },
        enabled: !!user?.id
    })

    if (!user) return null

    const bannerUrl = profileResponse?.banner_url || null
    const avatarUrl = profileResponse?.avatar_url || user.avatar

    return (
        <Card className="glass border-border/50 rounded-2xl overflow-hidden sticky top-24">
            <div 
                className={`h-16 relative ${!bannerUrl ? 'bg-gradient-to-r from-primary/20 via-primary/10 to-transparent' : 'bg-cover bg-center'}`}
                style={bannerUrl ? { backgroundImage: `url(${bannerUrl})` } : {}}
            >
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                    <Avatar className="w-16 h-16 border-4 border-background shadow-lg">
                        <AvatarImage src={avatarUrl} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {user.username?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
            <CardContent className="pt-12 pb-6 px-6 text-center space-y-4">
                <div>
                    <Link href={`/in/${user.username || user.id}`} className="font-bold hover:underline text-lg">
                        {profileResponse?.full_name || `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.name || "User"}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest font-bold">
                        {profileResponse?.headline || user.headline || "Software Engineer"}
                    </p>
                </div>

                <div className="border-t border-border/50 pt-4 space-y-2 text-left">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground font-medium">Profile viewers</span>
                        <span className="font-bold text-primary">142</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground font-medium">Connections</span>
                        <span className="font-bold text-primary">500+</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
