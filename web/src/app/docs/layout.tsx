import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Documentation | Best Hiring Tool",
    description: "API references, integration guides, and platform documentation.",
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
