// Africa tile-grid map.
//
// Each African country is rendered as a small rounded tile arranged on a 12×11
// grid that approximates the continent's geographic layout. Tiles are
// color-coded by an indicator value. This pattern (used by FT, Bloomberg,
// Economist) has two advantages over a choropleth:
//
//   1. Every country gets equal visual weight — so Lesotho and DRC carry the
//      same political signal, which is a more honest read of "country-level
//      performance."
//   2. No SVG / topojson dependencies. Pure CSS grid + DOM, so dark/light
//      theming Just Works via Tailwind tokens.
//
// Tiles for countries with no data render grayed out, making coverage gaps
// instantly visible.

"use client"

import { cn } from "@/lib/utils"
import { AU_MEMBER_STATES } from "@/scripts/ingest/african-countries"

// Grid positions for every AU member state — integer { row, col } on a
// 9-row × 11-col grid. Layout approximates Africa's geography (north at row 0,
// west at col 0). Adjacent geographic neighbours are adjacent grid cells where
// possible.
const FINAL: Record<string, { row: number; col: number }> = {
  // Row 0 — North coast
  ESH: { row: 0, col: 2 }, MAR: { row: 0, col: 3 }, DZA: { row: 0, col: 4 },
  TUN: { row: 0, col: 5 }, LBY: { row: 0, col: 6 }, EGY: { row: 0, col: 7 },

  // Row 1 — Sahara/Sahel
  MRT: { row: 1, col: 2 }, MLI: { row: 1, col: 3 }, NER: { row: 1, col: 4 },
  TCD: { row: 1, col: 5 }, SDN: { row: 1, col: 6 }, ERI: { row: 1, col: 7 },
  DJI: { row: 1, col: 8 },

  // Row 2 — West coast + Horn
  CPV: { row: 2, col: 0 }, SEN: { row: 2, col: 1 }, GMB: { row: 2, col: 2 },
  BFA: { row: 2, col: 3 }, BEN: { row: 2, col: 4 }, NGA: { row: 2, col: 5 },
  CAF: { row: 2, col: 6 }, SSD: { row: 2, col: 7 }, ETH: { row: 2, col: 8 },
  SOM: { row: 2, col: 9 },

  // Row 3 — Coastal W. Africa + Central
  GIN: { row: 3, col: 1 }, GNB: { row: 3, col: 2 }, SLE: { row: 3, col: 3 },
  CIV: { row: 3, col: 4 }, GHA: { row: 3, col: 5 }, TGO: { row: 3, col: 6 },
  CMR: { row: 3, col: 7 }, UGA: { row: 3, col: 8 }, KEN: { row: 3, col: 9 },

  // Row 4 — Equatorial belt
  LBR: { row: 4, col: 3 }, STP: { row: 4, col: 5 }, GNQ: { row: 4, col: 6 },
  GAB: { row: 4, col: 7 }, COD: { row: 4, col: 8 }, RWA: { row: 4, col: 9 },

  // Row 5 — Central / Great Lakes
  COG: { row: 5, col: 7 }, BDI: { row: 5, col: 8 }, TZA: { row: 5, col: 9 },
  SYC: { row: 5, col: 10 },

  // Row 6 — South-central
  AGO: { row: 6, col: 6 }, ZMB: { row: 6, col: 7 }, MWI: { row: 6, col: 8 },
  MOZ: { row: 6, col: 9 }, COM: { row: 6, col: 10 },

  // Row 7 — Southern
  NAM: { row: 7, col: 6 }, BWA: { row: 7, col: 7 }, ZWE: { row: 7, col: 8 },
  MDG: { row: 7, col: 9 },

  // Row 8 — Southern tip
  ZAF: { row: 8, col: 7 }, LSO: { row: 8, col: 8 }, SWZ: { row: 8, col: 9 },
  MUS: { row: 8, col: 10 },
}

export type TileValue = {
  iso3: string
  value: number | null
  formatted?: string
}

interface AfricaTileMapProps {
  values: TileValue[]
  /** Color scale name. */
  scale?: "sequential" | "diverging" | "progress"
  /** Higher value = better outcome. */
  higherIsBetter?: boolean
  /** Min/max for color mapping. If omitted, computed from values. */
  domain?: [number, number]
  /** Label shown when hovering an empty tile. */
  noDataLabel?: string
  /** Compact mode (smaller tiles, used in inline previews). */
  compact?: boolean
}

function colorForValue(
  value: number | null,
  domain: [number, number],
  higherIsBetter: boolean,
): string {
  if (value === null) return "bg-muted/40"
  const [min, max] = domain
  const range = max - min
  if (range === 0) return "bg-muted"
  let normalised = (value - min) / range // 0..1
  if (!higherIsBetter) normalised = 1 - normalised
  // 5-stop diverging scale, red → amber → emerald
  if (normalised < 0.2) return "bg-red-500/80 text-white"
  if (normalised < 0.4) return "bg-orange-500/80 text-white"
  if (normalised < 0.6) return "bg-amber-500/80 text-amber-950"
  if (normalised < 0.8) return "bg-lime-500/70 text-lime-950"
  return "bg-emerald-500/80 text-white"
}

export function AfricaTileMap({
  values,
  higherIsBetter = true,
  domain,
  noDataLabel = "no data",
  compact = false,
}: AfricaTileMapProps) {
  const valuesByIso = new Map<string, TileValue>(values.map((v) => [v.iso3, v]))

  // Compute domain from data if not specified
  const numericValues = values.map((v) => v.value).filter((v): v is number => v !== null)
  const computedDomain: [number, number] =
    numericValues.length > 0
      ? [Math.min(...numericValues), Math.max(...numericValues)]
      : [0, 1]
  const effectiveDomain = domain ?? computedDomain

  const tileSize = compact ? "h-7 w-9 text-[10px]" : "h-9 w-12 text-xs"
  const ROWS = 9
  const COLS = 11

  return (
    <div className="flex flex-col gap-3">
      <div
        className="grid gap-1 mx-auto"
        style={{
          gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
          gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
          width: compact ? "max-content" : "max-content",
        }}
      >
        {AU_MEMBER_STATES.map((country) => {
          const pos = FINAL[country.iso3]
          if (!pos) return null
          const tile = valuesByIso.get(country.iso3)
          const v = tile?.value ?? null
          const colorClass = colorForValue(v, effectiveDomain, higherIsBetter)
          return (
            <div
              key={country.iso3}
              className={cn(
                "rounded-md flex items-center justify-center font-mono font-medium leading-none transition-colors group relative",
                tileSize,
                colorClass,
                v === null && "text-muted-foreground/60",
              )}
              style={{ gridRow: pos.row + 1, gridColumn: pos.col + 1 }}
              title={`${country.name} (${country.iso3}): ${tile?.formatted ?? (v !== null ? v.toFixed(1) : noDataLabel)}`}
            >
              {country.iso3}
              {/* Hover tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:flex flex-col items-center pointer-events-none z-10">
                <div className="bg-popover border border-border text-popover-foreground rounded-md px-2 py-1 text-xs whitespace-nowrap shadow-lg">
                  <div className="font-semibold">{country.name}</div>
                  <div className="text-muted-foreground tabular-nums">
                    {tile?.formatted ?? (v !== null ? v.toFixed(1) : noDataLabel)}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
        <span className="tabular-nums">
          {higherIsBetter ? "worse" : "better"} {effectiveDomain[0].toFixed(1)}
        </span>
        <span className="h-3 w-5 bg-red-500/80 rounded-sm" />
        <span className="h-3 w-5 bg-orange-500/80 rounded-sm" />
        <span className="h-3 w-5 bg-amber-500/80 rounded-sm" />
        <span className="h-3 w-5 bg-lime-500/70 rounded-sm" />
        <span className="h-3 w-5 bg-emerald-500/80 rounded-sm" />
        <span className="tabular-nums">
          {effectiveDomain[1].toFixed(1)} {higherIsBetter ? "better" : "worse"}
        </span>
        <span className="ml-2 h-3 w-5 bg-muted/40 border border-border/50 rounded-sm" />
        <span>{noDataLabel}</span>
      </div>
    </div>
  )
}
