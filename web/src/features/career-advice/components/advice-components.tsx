"use client"

export function CategoryCard({ label, count, isActive, onClick }: { label: string, count?: number, isActive?: boolean, onClick?: () => void }) {
    return (
        <div 
            onClick={onClick}
            className={`p-4 border rounded-xl transition-colors cursor-pointer ${isActive ? 'bg-primary/10 border-primary' : 'border-white/5 hover:bg-white/5'}`}
        >
            <h5 className="text-[10px] font-black uppercase tracking-widest">{label} {count !== undefined && `(${count})`}</h5>
        </div>
    )
}

export function CareerStageCard({ title, description, stage }: { title?: string, description?: string, stage?: string }) {
    return (
        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
            <h5 className="font-bold text-sm mb-1">{title || stage}</h5>
            <p className="text-[10px] text-white/30 uppercase font-black">{description || "Optimization Path"}</p>
        </div>
    )
}
