import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Assessments | Best Hiring Tool",
    description: "AI-driven technical assessments and verifiable skills.",
}

export default function AssessmentsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
