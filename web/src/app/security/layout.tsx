import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Security & Compliance | Best Hiring Tool",
    description: "How we protect your data, privacy, and infrastructure.",
}

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
