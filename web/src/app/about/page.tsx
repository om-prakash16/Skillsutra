import type { Metadata } from "next"
import { AboutClient } from "./about-client"

export const metadata: Metadata = {
    title: "About | Best Hiring Tool",
    description: "A modern approach to hiring and career clarity.",
}

export default function AboutPage() {
    return <AboutClient />
}
