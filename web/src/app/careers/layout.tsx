import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Careers | Best Hiring Tool",
    description: "Join us in rewiring the hiring ecosystem.",
}

export default function CareersLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
