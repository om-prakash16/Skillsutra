"use client"

import { useState, useMemo, useEffect } from "react"
import { CompanyFilters } from "@/features/companies/components/company-filters"
import { CompanyCard } from "@/features/companies/components/company-card"
import { Button } from "@/components/ui/button"
import { Search, Building2, Loader2 } from "lucide-react"
import { publicApi } from "@/lib/api/public-api"

const ITEMS_PER_PAGE = 12

export default function CompaniesPage() {
    const [companies, setCompanies] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    
    // Filter State
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
    const [selectedSizes, setSelectedSizes] = useState<string[]>([])
    const [onlyHiring, setOnlyHiring] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        fetchCompanies()
    }, [])

    const fetchCompanies = async () => {
        setIsLoading(true)
        try {
            // Since our backend endpoint supports filters, we should use them eventually.
            // For now, we fetch all and filter client-side for consistency with existing logic.
            const data = await publicApi.search.companies("")
            setCompanies(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error("Failed to fetch companies:", err)
        } finally {
            setIsLoading(false)
        }
    }

    // Filtering Logic (Client-side for now to maintain original filter behavior)
    const filteredCompanies = useMemo(() => {
        return companies.filter(company => {
            // Search Query
            if (searchQuery && !company.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false
            }
            // Industry Filter
            if (selectedIndustries.length > 0 && !selectedIndustries.includes(company.industry)) {
                return false
            }
            // Size Filter
            if (selectedSizes.length > 0 && !selectedSizes.includes(company.company_size)) {
                return false
            }
            // Hiring Status (Note: Adjust if 'hiringStatus' exists in DB)
            if (onlyHiring && company.verified !== true) { // Using 'verified' as proxy if hiring status not yet in DB
                return false
            }
            return true
        })
    }, [companies, searchQuery, selectedIndustries, selectedSizes, onlyHiring])

    // Pagination Logic
    const paginatedCompanies = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
        return filteredCompanies.slice(startIndex, startIndex + ITEMS_PER_PAGE)
    }, [filteredCompanies, currentPage])

    const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE)

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, selectedIndustries, selectedSizes, onlyHiring])

    return (
        <div className="min-h-screen pt-24 pb-20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="container px-4 mx-auto mb-20 relative z-10 text-center">
                <div className="max-w-4xl mx-auto space-y-6">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                        Partner <span className="text-primary italic font-black">Network</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground font-normal max-w-2xl mx-auto">
                        Explore the network of verified corporate entities. Browse our active organizations seeking top talent.
                    </p>
                </div>
            </div>

            <main className="container px-4 mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row gap-10 items-start">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-80 shrink-0 sticky top-32">
                        <div className="glass border-border/50 rounded-3xl p-8 shadow-premium">
                            <h2 className="text-micro text-muted-foreground font-bold mb-8 flex items-center gap-3">
                                <div className="p-2 glass rounded-xl bg-primary/10 border-primary/20">
                                    <Search className="w-4 h-4 text-primary" />
                                </div>
                                SEARCH FILTERS
                            </h2>
                            <CompanyFilters
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                selectedIndustries={selectedIndustries}
                                setSelectedIndustries={setSelectedIndustries}
                                selectedSizes={selectedSizes}
                                setSelectedSizes={setSelectedSizes}
                                onlyHiring={onlyHiring}
                                setOnlyHiring={setOnlyHiring}
                            />
                        </div>
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1 w-full min-w-0">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 pb-4 border-b border-black/5 dark:border-border/50">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold tracking-tight">Active Registry</h2>
                                <p className="text-micro text-muted-foreground/40 font-medium">
                                    Displaying {filteredCompanies.length} partner nodes
                                </p>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="py-32 flex flex-col items-center justify-center gap-6">
                                <Loader2 className="w-10 h-10 animate-spin text-primary/40" />
                                <p className="text-micro text-muted-foreground/40 uppercase tracking-widest">Indexing Corporate Network...</p>
                            </div>
                        ) : filteredCompanies.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {paginatedCompanies.map((company) => (
                                        <CompanyCard key={company.id} company={company} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-16 flex justify-center items-center gap-4">
                                        <Button
                                            variant="outline"
                                            className="h-11 px-6 rounded-xl border-black/10 hover:border-primary/50 text-micro font-bold tracking-widest transition-all"
                                            disabled={currentPage === 1}
                                            onClick={() => {
                                                setCurrentPage(p => Math.max(1, p - 1))
                                                window.scrollTo({ top: 300, behavior: 'smooth' })
                                            }}
                                        >
                                            PREVIOUS
                                        </Button>
                                        <div className="flex items-center gap-2 text-micro font-bold text-muted-foreground/40 glass px-6 h-11 rounded-xl border border-black/5 dark:border-border/50">
                                            PAGE <span className="text-primary mx-1">{currentPage}</span> OF {totalPages}
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="h-11 px-6 rounded-xl border-black/10 hover:border-primary/50 text-micro font-bold tracking-widest transition-all"
                                            disabled={currentPage === totalPages}
                                            onClick={() => {
                                                setCurrentPage(p => Math.min(totalPages, p + 1))
                                                window.scrollTo({ top: 300, behavior: 'smooth' })
                                            }}
                                        >
                                            NEXT
                                        </Button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-32 glass rounded-3xl border border-dashed border-black/5 dark:border-border/50 relative overflow-hidden shadow-premium">
                                <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full" />
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-16 h-16 mb-6 rounded-2xl glass bg-primary/10 border border-primary/20 flex items-center justify-center shadow-premium">
                                        <Building2 className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-bold tracking-tight mb-2">No active nodes found</h3>
                                    <p className="text-micro text-muted-foreground/60 mb-8 max-w-xs mx-auto uppercase tracking-widest">
                                        The filter matrix returned zero results. Adjust your parameters to discover more organizations.
                                    </p>
                                    <Button 
                                        variant="premium" 
                                        className="h-11 px-8 rounded-xl text-micro font-bold tracking-widest shadow-premium"
                                        onClick={() => {
                                            setSearchQuery("")
                                            setSelectedIndustries([])
                                            setSelectedSizes([])
                                            setOnlyHiring(false)
                                        }}
                                    >
                                        RESET FILTERS
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
