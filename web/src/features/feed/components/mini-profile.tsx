import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

export function MiniProfile({ user }: { user: any }) {
    if (!user) return null

    return (
        <Card className="glass border-border/50 rounded-2xl overflow-hidden sticky top-24">
            <div className="h-16 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent relative">
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                    <Avatar className="w-16 h-16 border-4 border-background shadow-lg">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {user.username?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
            <CardContent className="pt-12 pb-6 px-6 text-center space-y-4">
                <div>
                    <Link href={`/in/${user.username}`} className="font-bold hover:underline text-lg">
                        {user.first_name} {user.last_name}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">{user.headline || "Software Engineer"}</p>
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
