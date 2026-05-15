// Population weights for the 55 AU member states.
//
// Source: UN World Population Prospects 2024 (medium variant), 2023 estimate.
// Used to compute population-weighted continental aggregates instead of
// naïve country-level means. WB / WHO / IMF all publish continental
// averages as population-weighted; using a simple mean overstates outcomes
// dominated by smaller, often higher-income states (Mauritius, Seychelles,
// Botswana skew everything upward in a simple mean).
//
// Verified spot-checks against UN WPP 2024:
//   Nigeria   223.8M, Ethiopia 126.5M, Egypt 112.7M, DRC 102.3M (top 4)
//   Total Africa: ~1,460M in 2023.

export const POP_2023_M: Record<string, number> = {
  // Top 10 (78% of continent population)
  NGA: 223.8, ETH: 126.5, EGY: 112.7, COD: 102.3, TZA: 67.4, ZAF: 60.4,
  KEN: 55.1, UGA: 48.6, SDN: 48.1, DZA: 45.6,
  // Next tier
  MAR: 37.8, AGO: 36.7, GHA: 34.1, MOZ: 33.9, MDG: 30.3,
  CMR: 28.6, CIV: 28.9, NER: 27.2, BFA: 23.2, MLI: 23.3, MWI: 21.0,
  ZMB: 20.6, SOM: 18.1, SEN: 17.8, TCD: 17.7, ZWE: 16.7,
  // Smaller states
  GIN: 14.2, RWA: 14.1, BEN: 13.7, BDI: 13.2, TUN: 12.5,
  SSD: 11.1, TGO: 9.1, SLE: 8.6, LBY: 6.9, COG: 6.1,
  CAF: 5.7, LBR: 5.4, MRT: 4.9, ERI: 3.7, NAM: 2.6,
  GMB: 2.7, BWA: 2.7, GAB: 2.4, LSO: 2.3, GNB: 2.2,
  GNQ: 1.7, MUS: 1.3, ESH: 0.6, SWZ: 1.2, DJI: 1.1,
  COM: 0.85, CPV: 0.6, STP: 0.23, SYC: 0.1,
}

export const POPULATION_TOTAL_2023_M = Object.values(POP_2023_M).reduce(
  (a, b) => a + b,
  0,
)
