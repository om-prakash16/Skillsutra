import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Info } from "lucide-react"

export function TrendingWidget() {
    const trendingTopics = [
        { title: "The Future of React 19", readers: "10,432", time: "2h ago" },
        { title: "Next.js App Router Best Practices", readers: "8,921", time: "4h ago" },
        { title: "AI in Software Development", readers: "15,200", time: "1d ago" },
        { title: "TypeScript 5.5 Release", readers: "6,543", time: "5h ago" },
        { title: "Tech Hiring Trends 2026", readers: "12,100", time: "12h ago" },
    ]

    return (
        <Card className="glass border-border/50 rounded-2xl overflow-hidden sticky top-24">
            <CardHeader className="pb-3 px-6 pt-6 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Trending Now
                </CardTitle>
                <Info className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
            </CardHeader>
            <CardContent className="px-4 pb-6">
                <ul className="space-y-4">
                    {trendingTopics.map((topic, i) => (
                        <li key={i} className="group cursor-pointer">
                            <div className="flex items-start gap-3 px-2 py-1 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 group-hover:scale-150 transition-transform" />
                                <div>
                                    <h4 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors">{topic.title}</h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {topic.time} • {topic.readers} readers
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="px-2 mt-4">
                    <button className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors bg-muted/50 hover:bg-muted px-4 py-2 rounded-xl w-full">
                        Show more
                    </button>
                </div>
            </CardContent>
        </Card>
    )
}
