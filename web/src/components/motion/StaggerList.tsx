"use client";

import React from "react";
import { motion } from "framer-motion";
import { staggerContainer, fadeUpVariant } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface StaggerListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  staggerDelay?: number;
}

export function StaggerList({ children, className, staggerDelay = 0.05, ...props }: StaggerListProps) {
  // We recreate the container variant to allow custom staggerDelay
  const customStagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={customStagger}
      className={cn("flex flex-col gap-4", className)}
      {...(props as any)}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return (
          <motion.div variants={fadeUpVariant}>
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
