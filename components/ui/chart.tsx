// shadcn-style chart wrapper.
//
// Provides theme-aware (light/dark) recharts theming via CSS variables. Charts
// declare a config mapping data keys to color tokens (e.g. "var(--chart-1)").
// Tooltips, legends, and grid lines all pull from CSS variables so swapping
// themes works without re-render gymnastics.
//
// Based on the canonical shadcn/ui chart component pattern, simplified to
// what we actually need.

"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// ── Chart config ────────────────────────────────────────────────────────
export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
    color?: string
    theme?: { light: string; dark: string }
  }
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const ctx = React.useContext(ChartContext)
  if (!ctx) throw new Error("useChart must be used within <ChartContainer>")
  return ctx
}

// ── ChartContainer ──────────────────────────────────────────────────────
export const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs",
          // Theme-aware recharts overrides — pull from CSS variables so dark
          // mode works automatically.
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
          "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border",
          "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border",
          "[&_.recharts-radial-bar-background-sector]:fill-muted",
          "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted",
          "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-border",
          "[&_.recharts-sector[stroke='#fff']]:stroke-transparent",
          "[&_.recharts-sector]:outline-none",
          "[&_.recharts-surface]:outline-none",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

// ── ChartStyle: emits per-chart CSS color variables ─────────────────────
const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, c]) => c.theme || c.color,
  )
  if (!colorConfig.length) return null
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
[data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.light ?? itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .filter(Boolean)
  .join("\n")}
}
.dark [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.dark ?? itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .filter(Boolean)
  .join("\n")}
}
        `.trim(),
      }}
    />
  )
}

// ── ChartTooltip ────────────────────────────────────────────────────────
export const ChartTooltip = RechartsPrimitive.Tooltip

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TooltipPayloadItem = any

export const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  {
    active?: boolean
    payload?: TooltipPayloadItem[]
    label?: React.ReactNode
    className?: string
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: "line" | "dot" | "dashed"
    formatter?: (value: number | string, name: string) => React.ReactNode
    labelFormatter?: (label: React.ReactNode) => React.ReactNode
  }
>(
  (
    {
      active,
      payload,
      label,
      className,
      hideLabel = false,
      hideIndicator = false,
      indicator = "dot",
      formatter,
      labelFormatter,
    },
    ref,
  ) => {
    const { config } = useChart()
    if (!active || !payload?.length) return null

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-border/50 bg-background/95 px-3 py-2 text-xs shadow-xl backdrop-blur-sm",
          className,
        )}
      >
        {!hideLabel && (
          <div className="font-medium text-foreground mb-1">
            {labelFormatter ? labelFormatter(label) : label}
          </div>
        )}
        <div className="grid gap-1">
          {payload.map((item: TooltipPayloadItem, i: number) => {
            const key = item.dataKey ?? item.name ?? "value"
            const itemConfig = config[key]
            const itemColor = item.color ?? item.payload?.fill ?? `var(--color-${key})`
            return (
              <div key={i} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  {!hideIndicator && (
                    <span
                      className={cn(
                        indicator === "line"
                          ? "h-0.5 w-3"
                          : indicator === "dashed"
                            ? "h-0.5 w-3 border-t border-dashed"
                            : "h-2 w-2 rounded-[2px]",
                      )}
                      style={{
                        backgroundColor: indicator !== "dashed" ? itemColor : undefined,
                        borderColor: indicator === "dashed" ? itemColor : undefined,
                      }}
                    />
                  )}
                  <span className="text-muted-foreground">
                    {itemConfig?.label ?? item.name ?? key}
                  </span>
                </div>
                <span className="font-mono font-medium tabular-nums text-foreground">
                  {formatter ? formatter(item.value, item.name) : item.value}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  },
)
ChartTooltipContent.displayName = "ChartTooltip"

// ── ChartLegend ─────────────────────────────────────────────────────────
export const ChartLegend = RechartsPrimitive.Legend

export const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  {
    payload?: TooltipPayloadItem[]
    verticalAlign?: "top" | "bottom"
    className?: string
    hideIcon?: boolean
  }
>(({ payload, verticalAlign = "bottom", className, hideIcon = false }, ref) => {
  const { config } = useChart()
  if (!payload?.length) return null
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center gap-4 flex-wrap",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className,
      )}
    >
      {payload.map((item: TooltipPayloadItem) => {
        const key = item.dataKey ?? item.value ?? "value"
        const itemConfig = config[key]
        return (
          <div key={key} className="flex items-center gap-1.5">
            {!hideIcon && (
              <span
                className="h-2 w-2 rounded-[2px] shrink-0"
                style={{ backgroundColor: item.color }}
              />
            )}
            <span className="text-xs text-muted-foreground">
              {itemConfig?.label ?? item.value}
            </span>
          </div>
        )
      })}
    </div>
  )
})
ChartLegendContent.displayName = "ChartLegend"
