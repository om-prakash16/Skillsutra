"use client"

import React, { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    showStrength?: boolean;
    error?: string;
}

export function PasswordInput({ label, showStrength = false, error, className = "", value, onChange, ...props }: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false)

    // Calculate password strength
    const valStr = (value as string) || ""
    const hasLetters = /[A-Za-z]/.test(valStr)
    const hasNumbers = /\d/.test(valStr)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(valStr)
    const isLongEnough = valStr.length >= 8

    let strength = 0
    if (isLongEnough) strength += 1
    if (hasLetters && hasNumbers) strength += 1
    if (hasSpecial) strength += 1

    const getStrengthColor = () => {
        if (strength === 0) return "bg-gray-200 dark:bg-white/10"
        if (strength === 1) return "bg-red-500"
        if (strength === 2) return "bg-yellow-500"
        return "bg-green-500"
    }

    const getStrengthText = () => {
        if (valStr.length === 0) return ""
        if (strength === 1) return "Weak"
        if (strength === 2) return "Fair"
        if (strength === 3) return "Strong"
        return ""
    }

    return (
        <div className="w-full space-y-1">
            {label && <label className="text-sm font-medium text-foreground">{label}</label>}
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    className={`w-full px-4 py-3 rounded-xl bg-muted/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all pr-12 ${error ? 'border-red-500' : ''} ${className}`}
                    {...props}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            </div>
            
            {showStrength && valStr.length > 0 && (
                <div className="flex items-center space-x-2 mt-2">
                    <div className="flex-1 flex gap-1 h-1.5">
                        <div className={`flex-1 rounded-full ${strength >= 1 ? getStrengthColor() : 'bg-gray-200 dark:bg-white/10'}`} />
                        <div className={`flex-1 rounded-full ${strength >= 2 ? getStrengthColor() : 'bg-gray-200 dark:bg-white/10'}`} />
                        <div className={`flex-1 rounded-full ${strength >= 3 ? getStrengthColor() : 'bg-gray-200 dark:bg-white/10'}`} />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground w-10 text-right">
                        {getStrengthText()}
                    </span>
                </div>
            )}
            
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    )
}
