"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"

// Chart context for configuration
const ChartContext = React.createContext<{
  config: Record<string, any>
}>({
  config: {},
})

export const useChart = () => {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a ChartContainer")
  }
  return context
}

// Chart container component
interface ChartContainerProps
  extends React.ComponentProps<"div"> {
  config: Record<string, any>
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"]
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ config, className, children, ...props }, ref) => {
    return (
      <ChartContext.Provider value={{ config }}>
        <div
          ref={ref}
          className={cn("flex aspect-video justify-center", className)}
          {...props}
        >
          <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
            {children}
          </RechartsPrimitive.ResponsiveContainer>
        </div>
      </ChartContext.Provider>
    )
  }
)
ChartContainer.displayName = "ChartContainer"

// Simple tooltip component for charts
interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{
    value: any
    name: string
    color: string
    dataKey: string
  }>
  label?: string
}

const ChartTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-md">
      {label && (
        <div className="mb-2 font-medium text-foreground">{label}</div>
      )}
      <div className="grid gap-2">
        {payload.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-muted-foreground">{item.name}:</span>
            <span className="text-sm font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export {
  ChartContainer,
  ChartTooltip,
  // Re-export recharts components
  RechartsPrimitive as Recharts,
}