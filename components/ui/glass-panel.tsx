import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'enhanced' | 'subtle'
}

const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: "bg-white/5 backdrop-blur-sm border border-white/10",
      enhanced: "bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 shadow-2xl",
      subtle: "bg-white/3 backdrop-blur-sm border border-white/5"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl",
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
GlassPanel.displayName = "GlassPanel"

export { GlassPanel }
