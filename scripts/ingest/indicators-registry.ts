// The bridge between the AU's Agenda 2063 framework and the data sources that
// can actually measure it.
//
// AU's framework: 7 Aspirations → 20 Goals → ~140 priority targets.
// Source: AU Commission, "Agenda 2063: The Africa We Want — Popular Version" (2015);
// First Ten-Year Implementation Plan (FTYIP) priority indicators; Second Ten-Year
// Implementation Plan (STYIP, 2024-2033). The STYIP indicator dictionary is not
// yet publicly released by AUDA-NEPAD, so we hold to the FTYIP set for now.
//
// AU itself publishes no machine-readable indicator data. We rebuild the scoring
// independently from public APIs (World Bank, WHO GHO, UNESCO UIS, IIAG, ACLED,
// Afrobarometer, FAOSTAT) and expose the divergence between our independent
// score and AU's self-reported figures from the biennial Continental Reports.

export type DataSource =
  | 'world-bank'
  | 'who-gho'
  | 'unesco-uis'
  | 'mo-ibrahim-iiag'
  | 'transparency-international'
  | 'rsf-press-freedom'
  | 'acled'
  | 'afrobarometer'
  | 'faostat'
  | 'unctad'
  | 'ipu'
  | 'au-self-reported'

export interface IndicatorDef {
  id: string                    // stable identifier
  name: string                  // display name
  description: string           // what this measures
  goalId: number                // 1-20 — AU's official Agenda 2063 goal numbering
  aspirationId: number          // 1-7
  source: DataSource
  sourceCode: string            // the source's own code (e.g. World Bank indicator code)
  sourceUrl: string             // canonical URL where this data was originally published
  unit: string                  // %, years, score, per 100k, etc.
  baseline2013: number | null   // null when the source has no 2013 datapoint
  target2063: number            // AU's target; pulled from FTYIP unless cited otherwise
  targetSource: string          // citation for the target value
  higherIsBetter: boolean
  notes?: string                // caveats: methodology, gaps, politically contested, etc.
}

// ── Aspiration 1: Prosperous Africa ───────────────────────────────────────
// Goals 1-7 sit here in AU's framework
export const INDICATORS: IndicatorDef[] = [
  // Goal 1: High Standard of Living, Quality of Life and Well-Being
  {
    id: 'poverty-headcount-215',
    name: 'Extreme poverty rate ($2.15/day, 2017 PPP)',
    description: 'Share of population living below the international poverty line of $2.15/day in 2017 PPP terms.',
    goalId: 1, aspirationId: 1,
    source: 'world-bank',
    sourceCode: 'SI.POV.DDAY',
    sourceUrl: 'https://data.worldbank.org/indicator/SI.POV.DDAY',
    unit: '%',
    baseline2013: 42, target2063: 3,
    targetSource: 'FTYIP target — derived from AU Aspiration 1 commitment to eradicate poverty by 2063',
    higherIsBetter: false,
    notes: 'Survey-based (LSMS/DHS); coverage gaps for Eritrea, Libya, South Sudan, Somalia.',
  },
  {
    id: 'safe-water-access',
    name: 'Safely managed drinking water',
    description: 'Population with access to safely managed drinking water services.',
    goalId: 1, aspirationId: 1,
    source: 'world-bank',
    sourceCode: 'SH.H2O.SMDW.ZS',
    sourceUrl: 'https://data.worldbank.org/indicator/SH.H2O.SMDW.ZS',
    unit: '%',
    baseline2013: 24, target2063: 100,
    targetSource: 'FTYIP — universal access by 2063',
    higherIsBetter: true,
  },
  {
    id: 'electricity-access',
    name: 'Access to electricity',
    description: 'Share of population with access to electricity.',
    goalId: 1, aspirationId: 1,
    source: 'world-bank',
    sourceCode: 'EG.ELC.ACCS.ZS',
    sourceUrl: 'https://data.worldbank.org/indicator/EG.ELC.ACCS.ZS',
    unit: '%',
    baseline2013: 38, target2063: 100,
    targetSource: 'FTYIP — universal access; AU PIDA programme',
    higherIsBetter: true,
  },

  // Goal 2: Well-Educated Citizens
  {
    id: 'literacy-adult',
    name: 'Adult literacy rate',
    description: 'Share of population aged 15+ who can read and write a short simple statement.',
    goalId: 2, aspirationId: 1,
    source: 'world-bank',
    sourceCode: 'SE.ADT.LITR.ZS',
    sourceUrl: 'https://data.worldbank.org/indicator/SE.ADT.LITR.ZS',
    unit: '%',
    baseline2013: 60, target2063: 99,
    targetSource: 'FTYIP — universal literacy',
    higherIsBetter: true,
    notes: 'Sourced from UNESCO UIS via World Bank. Survey-based, gappy years for many countries.',
  },
  {
    id: 'secondary-completion',
    name: 'Lower secondary completion rate',
    description: 'Share of relevant age group completing lower secondary school.',
    goalId: 2, aspirationId: 1,
    source: 'world-bank',
    sourceCode: 'SE.SEC.CMPT.LO.ZS',
    sourceUrl: 'https://data.worldbank.org/indicator/SE.SEC.CMPT.LO.ZS',
    unit: '%',
    baseline2013: 40, target2063: 95,
    targetSource: 'FTYIP',
    higherIsBetter: true,
  },

  // Goal 3: Healthy and Well-Nourished Citizens
  {
    id: 'life-expectancy',
    name: 'Life expectancy at birth',
    description: 'Average number of years a newborn would live under current mortality patterns.',
    goalId: 3, aspirationId: 1,
    source: 'world-bank',
    sourceCode: 'SP.DYN.LE00.IN',
    sourceUrl: 'https://data.worldbank.org/indicator/SP.DYN.LE00.IN',
    unit: 'years',
    baseline2013: 60, target2063: 75,
    targetSource: 'FTYIP',
    higherIsBetter: true,
  },
  {
    id: 'under5-mortality',
    name: 'Under-5 mortality rate',
    description: 'Deaths of children under 5 per 1,000 live births.',
    goalId: 3, aspirationId: 1,
    source: 'world-bank',
    sourceCode: 'SH.DYN.MORT',
    sourceUrl: 'https://data.worldbank.org/indicator/SH.DYN.MORT',
    unit: 'per 1,000',
    baseline2013: 84, target2063: 25,
    targetSource: 'FTYIP — derived from SDG 3.2',
    higherIsBetter: false,
  },
  {
    id: 'maternal-mortality',
    name: 'Maternal mortality ratio',
    description: 'Maternal deaths per 100,000 live births.',
    goalId: 3, aspirationId: 1,
    source: 'world-bank',
    sourceCode: 'SH.STA.MMRT',
    sourceUrl: 'https://data.worldbank.org/indicator/SH.STA.MMRT',
    unit: 'per 100k',
    baseline2013: 480, target2063: 70,
    targetSource: 'FTYIP — derived from SDG 3.1',
    higherIsBetter: false,
  },
  {
    id: 'stunting',
    name: 'Child stunting prevalence',
    description: 'Children under 5 whose height-for-age is more than 2 std deviations below the WHO reference.',
    goalId: 3, aspirationId: 1,
    source: 'world-bank',
    sourceCode: 'SH.STA.STNT.ZS',
    sourceUrl: 'https://data.worldbank.org/indicator/SH.STA.STNT.ZS',
    unit: '%',
    baseline2013: 35, target2063: 5,
    targetSource: 'FTYIP — Africa Regional Nutrition Strategy',
    higherIsBetter: false,
  },

  // Goal 4: Transformed Economies & Job Creation
  {
    id: 'gdp-per-capita',
    name: 'GDP per capita (current US$)',
    description: 'Gross domestic product divided by midyear population, current US$ (not PPP).',
    goalId: 4, aspirationId: 1,
    source: 'world-bank',
    sourceCode: 'NY.GDP.PCAP.CD',
    sourceUrl: 'https://data.worldbank.org/indicator/NY.GDP.PCAP.CD',
    unit: 'USD',
    // Audit fix 2026-05 (pass IV): baseline was 1880 (sub-Saharan Africa only).
    // Whole-continent value per WB 2013: ~$2,210 (current US$). FTYIP target
    // of $12,000 is the upper-middle-income threshold.
    baseline2013: 2210, target2063: 12000,
    targetSource: 'FTYIP — upper-middle-income status for Africa',
    higherIsBetter: true,
    notes: 'Current US$ (NY.GDP.PCAP.CD), not PPP. For PPP figures see futures-data.ts which uses NY.GDP.PCAP.PP.CD.',
  },
  {
    id: 'unemployment-youth',
    name: 'Youth unemployment rate',
    description: 'Share of labour force aged 15-24 that is unemployed (ILO modelled estimates).',
    goalId: 4, aspirationId: 1,
    source: 'world-bank',
    sourceCode: 'SL.UEM.1524.ZS',
    sourceUrl: 'https://data.worldbank.org/indicator/SL.UEM.1524.ZS',
    unit: '%',
    baseline2013: 13.5, target2063: 4,
    targetSource: 'FTYIP',
    higherIsBetter: false,
  },
  {
    id: 'manufacturing-gdp',
    name: 'Manufacturing value added (% of GDP)',
    description: 'Industrialisation indicator: manufacturing as a share of total economy.',
    goalId: 4, aspirationId: 1,
    source: 'world-bank',
    sourceCode: 'NV.IND.MANF.ZS',
    sourceUrl: 'https://data.worldbank.org/indicator/NV.IND.MANF.ZS',
    unit: '%',
    baseline2013: 11, target2063: 25,
    targetSource: 'FTYIP — Africa Industrialisation strategy',
    higherIsBetter: true,
  },

  // Goal 5: Modern Agriculture
  {
    id: 'cereal-yield',
    name: 'Cereal yield (kg/hectare)',
    description: 'Cereal production per hectare of harvested land — a core agricultural productivity indicator.',
    goalId: 5, aspirationId: 1,
    source: 'world-bank',
    sourceCode: 'AG.YLD.CREL.KG',
    sourceUrl: 'https://data.worldbank.org/indicator/AG.YLD.CREL.KG',
    unit: 'kg/ha',
    baseline2013: 1500, target2063: 5000,
    targetSource: 'FTYIP / CAADP — triple agricultural productivity',
    higherIsBetter: true,
  },
  {
    id: 'undernourishment',
    name: 'Prevalence of undernourishment',
    description: 'Share of population with insufficient caloric intake (FAO methodology).',
    goalId: 5, aspirationId: 1,
    source: 'world-bank',
    sourceCode: 'SN.ITK.DEFC.ZS',
    sourceUrl: 'https://data.worldbank.org/indicator/SN.ITK.DEFC.ZS',
    unit: '%',
    baseline2013: 19, target2063: 0,
    targetSource: 'FTYIP — Malabo Declaration: end hunger by 2025 (missed)',
    higherIsBetter: false,
  },

  // Goal 7: Environmentally Sustainable Climate-Resilient Economies
  {
    id: 'co2-per-capita',
    name: 'CO₂ emissions per capita',
    description: 'Metric tons of CO₂ per person. Africa contributes <4% of global emissions; the goal is climate resilience while staying low-carbon.',
    goalId: 7, aspirationId: 1,
    source: 'world-bank',
    sourceCode: 'EN.GHG.CO2.PC.CE.AR5',
    sourceUrl: 'https://data.worldbank.org/indicator/EN.GHG.CO2.PC.CE.AR5',
    unit: 't CO₂/person',
    baseline2013: 1.1, target2063: 2.0,
    targetSource: 'AU Common African Position on Climate — equitable growth with bounded emissions',
    higherIsBetter: false,
    notes: 'Africa\'s CO₂ "target" is bounded growth, not reduction — historical contribution is minimal.',
  },
  {
    id: 'forest-area',
    name: 'Forest area (% of land)',
    description: 'Share of land area covered by forest.',
    goalId: 7, aspirationId: 1,
    source: 'world-bank',
    sourceCode: 'AG.LND.FRST.ZS',
    sourceUrl: 'https://data.worldbank.org/indicator/AG.LND.FRST.ZS',
    unit: '%',
    baseline2013: 23, target2063: 25,
    targetSource: 'AU Great Green Wall + climate adaptation strategies',
    higherIsBetter: true,
  },
  {
    id: 'renewable-energy-share',
    name: 'Renewable energy share of total final consumption',
    description: 'Share of total final energy consumption that is renewable (incl. traditional biomass).',
    goalId: 7, aspirationId: 1,
    source: 'world-bank',
    sourceCode: 'EG.FEC.RNEW.ZS',
    sourceUrl: 'https://data.worldbank.org/indicator/EG.FEC.RNEW.ZS',
    unit: '%',
    baseline2013: 50, target2063: 80,
    targetSource: 'AU Africa Renewable Energy Initiative (AREI)',
    higherIsBetter: true,
    notes: 'High baseline includes traditional biomass (firewood, charcoal) which AU wants to replace with modern renewables.',
  },

  // ── Aspiration 2: Integrated Africa (Goals 8-10) ───────────────────────────
  // Goal 10: World-class infrastructure
  {
    id: 'internet-users',
    name: 'Individuals using the internet',
    description: 'Share of population using the internet.',
    goalId: 10, aspirationId: 2,
    source: 'world-bank',
    sourceCode: 'IT.NET.USER.ZS',
    sourceUrl: 'https://data.worldbank.org/indicator/IT.NET.USER.ZS',
    unit: '%',
    baseline2013: 17, target2063: 95,
    targetSource: 'FTYIP — STC on Communication & ICT, Digital Transformation Strategy',
    higherIsBetter: true,
  },
  {
    id: 'mobile-subscriptions',
    name: 'Mobile cellular subscriptions per 100 people',
    description: 'Penetration of mobile telephony.',
    goalId: 10, aspirationId: 2,
    source: 'world-bank',
    sourceCode: 'IT.CEL.SETS.P2',
    sourceUrl: 'https://data.worldbank.org/indicator/IT.CEL.SETS.P2',
    unit: 'per 100',
    baseline2013: 70, target2063: 150,
    targetSource: 'FTYIP — universal access',
    higherIsBetter: true,
  },

  // ── Aspiration 6: People-driven (Goals 17, 18) ────────────────────────────
  {
    id: 'women-parliament',
    name: 'Women in national parliament',
    description: 'Share of seats held by women in lower or single house of parliament.',
    goalId: 17, aspirationId: 6,
    source: 'world-bank',
    sourceCode: 'SG.GEN.PARL.ZS',
    sourceUrl: 'https://data.worldbank.org/indicator/SG.GEN.PARL.ZS',
    unit: '%',
    baseline2013: 22, target2063: 50,
    targetSource: 'AU Solemn Declaration on Gender Equality + Maputo Protocol — parity by 2063',
    higherIsBetter: true,
  },
  {
    id: 'female-labor-participation',
    name: 'Female labour force participation',
    description: 'Share of women aged 15+ in the labour force (ILO modelled).',
    goalId: 17, aspirationId: 6,
    source: 'world-bank',
    sourceCode: 'SL.TLF.CACT.FE.ZS',
    sourceUrl: 'https://data.worldbank.org/indicator/SL.TLF.CACT.FE.ZS',
    unit: '%',
    baseline2013: 56, target2063: 70,
    targetSource: 'FTYIP — gender parity in economic participation',
    higherIsBetter: true,
  },

  // ── Aspiration 3: Good Governance (Goals 11, 12) — IIAG ─────────────────
  {
    id: 'iiag-overall',
    name: 'Mo Ibrahim Overall Governance score',
    description:
      'Composite governance index covering security & rule of law, participation & rights, economic opportunity, and human development. Independent (not AU-reported).',
    goalId: 11, aspirationId: 3,
    source: 'mo-ibrahim-iiag',
    sourceCode: 'IIAG-Overall-Governance',
    sourceUrl: 'https://iiag.online',
    unit: 'score',
    baseline2013: 48, target2063: 75,
    targetSource: 'AU Aspiration 3 — derived from Goal 11 commitments',
    higherIsBetter: true,
    notes:
      "The most respected African governance index. AU's own 2021 score for Aspiration 3 was 42% — IIAG's continental average is in the high 40s and has barely moved in a decade.",
  },
]

// Convenience: indicators organised by AU's 20-goal framework
export const INDICATORS_BY_GOAL = Object.fromEntries(
  Array.from({ length: 20 }, (_, i) => [
    i + 1,
    INDICATORS.filter((ind) => ind.goalId === i + 1),
  ]),
) as Record<number, IndicatorDef[]>
