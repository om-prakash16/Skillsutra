import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { User, Building2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface RoleSelectorProps {
    value: string
    onChange: (value: string) => void
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
    return (
        <RadioGroup defaultValue={value} onValueChange={onChange} className="grid grid-cols-2 gap-4">
            <div className="relative">
                <RadioGroupItem value="user" id="user" className="peer sr-only" />
                <Label
                    htmlFor="user"
                    className={cn(
                        "flex flex-col items-center justify-center rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 relative overflow-hidden",
                        value === "user" 
                            ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary),0.15)]" 
                            : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                    )}
                >
                    {value === "user" && (
                        <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-primary animate-in zoom-in duration-300" />
                    )}
                    <div className={cn(
                        "p-3 rounded-xl mb-3 transition-colors",
                        value === "user" ? "bg-primary text-white" : "bg-white/5 text-muted-foreground"
                    )}>
                        <User className="w-6 h-6" />
                    </div>
                    <span className={cn(
                        "font-black tracking-tight",
                        value === "user" ? "text-white" : "text-muted-foreground"
                    )}>
                        Job Seeker
                    </span>
                </Label>
            </div>

            <div className="relative">
                <RadioGroupItem value="company" id="company" className="peer sr-only" />
                <Label
                    htmlFor="company"
                    className={cn(
                        "flex flex-col items-center justify-center rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 relative overflow-hidden",
                        value === "company" 
                            ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary),0.15)]" 
                            : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                    )}
                >
                    {value === "company" && (
                        <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-primary animate-in zoom-in duration-300" />
                    )}
                    <div className={cn(
                        "p-3 rounded-xl mb-3 transition-colors",
                        value === "company" ? "bg-primary text-white" : "bg-white/5 text-muted-foreground"
                    )}>
                        <Building2 className="w-6 h-6" />
                    </div>
                    <span className={cn(
                        "font-black tracking-tight",
                        value === "company" ? "text-white" : "text-muted-foreground"
                    )}>
                        Company
                    </span>
                </Label>
            </div>
        </RadioGroup>
    )
}
