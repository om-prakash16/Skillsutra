"use client"

export function ArticleCard({ article }: { article: any }) {
    return (
        <div className="p-4 border border-border/50 rounded-xl bg-muted/30">
            <h4 className="font-bold text-sm mb-2">{article?.title || "Career Strategy Insight"}</h4>
            <p className="text-[10px] text-muted-foreground italic">Deep-dive technical career telemetry...</p>
        </div>
    )
}
