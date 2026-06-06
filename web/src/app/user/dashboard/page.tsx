"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Bookmark, FileText, TrendingUp, Route, ChevronRight, Compass } from "lucide-react"

import Link from "next/link"
import { ProofScoreDisplay } from "@/components/ai/ProofScoreDisplay"
import { AIInsightsPanel } from "@/components/ai/AIInsightsPanel"
import { Sparkles } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function UserDashboard() {
    const router = useRouter()
    useEffect(() => {
        router.push("/")
    }, [router])

    return null;
}
