"use client"
import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UploadCloud, FileText, CheckCircle, Loader2, ArrowRight, ShieldCheck, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useWallet } from "@solana/wallet-adapter-react"
import { useAuth } from "@/context/auth-context"

interface ParsedData {
    skills: string[]
    soft_skills: string[]
    experience_years: number
    roles: string[]
    education: string[]
    forensic_confidence: number
}

export default function VerifyPage() {
    const { connected, publicKey } = useWallet()
    const { user } = useAuth()
    
    const [file, setFile] = useState<File | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [parsedData, setParsedData] = useState<ParsedData | null>(null)
    const [isMinting, setIsMinting] = useState(false)
    const [minted, setMinted] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selected = e.target.files[0]
            if (selected.type !== "application/pdf") {
                toast.error("Please explicitly upload a PDF file.")
                return
            }
            setFile(selected)
            setParsedData(null) // reset previous if any
        }
    }

    const handleAnalyze = async () => {
        if (!file) {
            toast.error("Please upload a file first.")
            return
        }

        setIsAnalyzing(true)
        const formData = new FormData()
        formData.append("file", file)

        try {
            const response = await fetch("http://localhost:8000/api/v1/ai/analyze-resume", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.detail || "Failed to analyze resume")
            }

            const data = await response.json()
            toast.success("Resume analyzed successfully!")
            setParsedData(data.parsed_data)
        } catch (error: any) {
            console.error("Analysis error:", error)
            toast.error(error.message || "A server error occurred. Please try again.")
        } finally {
            setIsAnalyzing(false)
        }
    }

    const handleMint = async () => {
        if (!connected || !publicKey) {
            toast.error("Please connect your Solana wallet first!")
            return
        }
        setIsMinting(true)
        
        // Simulating the Anchor smart contract interaction
        // Expected flow: backend signs -> frontend confirms -> broadcast to network
        setTimeout(() => {
            setIsMinting(false)
            setMinted(true)
            toast.success("Profile SBT Minted successfully to your wallet!")
        }, 3000)
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center relative overflow-hidden bg-background text-white">
            <div className="absolute top-[10%] -left-[10%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full pointer-events-none opacity-40 animate-pulse" />
            <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] bg-secondary/10 blur-[180px] rounded-full pointer-events-none opacity-30" />

            <div className="text-center max-w-3xl mb-16 relative z-10 space-y-6">
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]"
                >
                    <Cpu className="w-4 h-4" /> Waitless Verification
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-black font-heading tracking-tighter uppercase leading-none">
                    Prove Your <span className="text-gradient">Potential</span>
                </h1>
                <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed font-medium opacity-80">
                    Upload your standard resume. Our AI Engine extracts the cryptographic proof we need to mint your verified Profile NFT.
                </p>
            </div>

            <div className="w-full max-w-5xl grid md:grid-cols-2 gap-10 relative z-10 px-4">
                {/* Upload Section */}
                <motion.div 
                    className="p-10 rounded-[2.5rem] glass border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden group shadow-2xl h-[480px]"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    
                    {!file ? (
                        <label className="cursor-pointer flex flex-col items-center relative z-20 w-full h-full justify-center">
                            <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(var(--primary),0.2)] border border-primary/20">
                                <UploadCloud className="w-12 h-12 text-primary" />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tight mb-3">Upload Resume</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-10">PDF format • MAX 5MB</p>
                            <Button variant="premium" className="h-14 px-10 rounded-2xl pointer-events-none text-sm font-black uppercase tracking-widest shadow-xl">
                                Browse Files
                            </Button>
                            <input 
                                type="file" 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30" 
                                accept="application/pdf,.pdf"
                                onChange={handleFileChange}
                            />
                        </label>
                    ) : (
                        <div className="flex flex-col items-center w-full space-y-8">
                            <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-3xl flex items-center justify-center text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                                <FileText className="w-10 h-10" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-black text-lg truncate w-full max-w-[280px]">{file.name}</p>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Ready for heuristic analysis</p>
                            </div>
                            
                            <Button 
                                onClick={handleAnalyze} 
                                disabled={isAnalyzing}
                                variant="premium"
                                className="w-full h-16 rounded-2xl font-black uppercase tracking-widest shadow-2xl relative overflow-hidden"
                            >
                                {isAnalyzing ? (
                                    <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Deep Scanning...</>
                                ) : (
                                    <>Initiate AI Scan <ArrowRight className="ml-3 w-5 h-5" /></>
                                )}
                            </Button>
                            
                            <button 
                                onClick={() => { setFile(null); setParsedData(null); }}
                                className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 hover:text-rose-500 transition-colors"
                            >
                                Remove File
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* Results Section */}
                <motion.div 
                    className="p-10 rounded-[2.5rem] glass border-white/5 shadow-2xl h-[480px] relative overflow-hidden"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    {!parsedData ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground/30">
                            <div className="p-6 glass rounded-full bg-white/5 border-white/5 mb-6">
                                <Cpu className="w-16 h-16 animate-pulse" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Awaiting Neural Input</p>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 glass rounded-xl bg-emerald-500/10 border-emerald-500/20">
                                        <ShieldCheck className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-tight">Extracted Proof</h3>
                                </div>
                                <div className="text-right">
                                    <div className="text-[9px] uppercase font-black text-muted-foreground/60 tracking-[0.2em] mb-2">Confidence Level</div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 h-2 glass rounded-full overflow-hidden border border-white/5">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${parsedData.forensic_confidence}%` }}
                                                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                            />
                                        </div>
                                        <span className="text-[10px] font-black text-emerald-400">{parsedData.forensic_confidence}%</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex-1 space-y-8 overflow-y-auto custom-scrollbar pr-2">
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Technical Competencies</p>
                                    <div className="flex flex-wrap gap-2">
                                        {parsedData.skills.map((skill, i) => (
                                            <span key={i} className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg bg-primary/10 text-primary border border-primary/20">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Total Experience</p>
                                        <p className="font-black text-xl italic">{parsedData.experience_years} Cycles</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Verified Role</p>
                                        <p className="font-black text-sm uppercase tracking-tight">{parsedData.roles[0]}</p>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Academic Anchor</p>
                                    <p className="font-black text-sm text-blue-300 uppercase tracking-tight">{parsedData.education[0]}</p>
                                </div>
                            </div>

                            <div className="mt-auto pt-8">
                                <AnimatePresence mode="wait">
                                    {minted ? (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                            className="w-full h-16 rounded-2xl glass bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center gap-3 font-black uppercase tracking-widest text-xs shadow-2xl"
                                        >
                                            <CheckCircle className="w-5 h-5" /> Secured On-Chain
                                        </motion.div>
                                    ) : (
                                        <div className="space-y-4">
                                            <Button 
                                                onClick={handleMint}
                                                disabled={isMinting}
                                                variant="premium"
                                                className="w-full h-16 rounded-2xl font-black uppercase tracking-widest shadow-2xl"
                                            >
                                                {isMinting ? (
                                                    <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Finalizing Ledger...</>
                                                ) : (
                                                    'Mint Profile NFT (SBT)'
                                                )}
                                            </Button>
                                            {!connected && (
                                                <p className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em] text-center italic">Wallet Not Connected • Ledger Entry Restricted</p>
                                            )}
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
