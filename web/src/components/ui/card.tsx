import * as React from "react"

import { cn } from "@/lib/utils"

import { motion, HTMLMotionProps } from "framer-motion"
import { hoverScale, tapScale } from "@/lib/motion"

export interface CardProps extends HTMLMotionProps<"div"> {
  interactive?: boolean;
}

const MotionDiv = motion.div

function Card({ className, interactive = false, ...props }: CardProps) {
  return (
    <MotionDiv
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-2xl border py-6 shadow-sm transition-colors duration-300",
        interactive && "cursor-pointer hover:border-primary/30 hover:shadow-[0_0_20px_hsl(var(--primary)/0.1)]",
        className
      )}
      whileHover={interactive ? "hover" : undefined}
      whileTap={interactive ? "tap" : undefined}
      variants={interactive ? { hover: hoverScale, tap: tapScale } : undefined}
      {...(props as any)}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
