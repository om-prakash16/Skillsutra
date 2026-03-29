import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { User, Building2 } from "lucide-react"

interface RoleSelectorProps {
    value: string
    onChange: (value: string) => void
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
    return (
        <RadioGroup defaultValue={value} onValueChange={onChange} className="grid grid-cols-2 gap-4">
            <div>
                <RadioGroupItem value="user" id="user" className="peer sr-only" />
                <Label
                    htmlFor="user"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                >
                    <User className="mb-3 h-6 w-6" />
                    Job Seeker
                </Label>
            </div>
            <div>
                <RadioGroupItem value="company" id="company" className="peer sr-only" />
                <Label
                    htmlFor="company"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                >
                    <Building2 className="mb-3 h-6 w-6" />
                    Company
                </Label>
            </div>
        </RadioGroup>
    )
}
