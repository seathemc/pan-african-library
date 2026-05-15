// "Our Paths" — Africa's three futures by 2043.
//
// Modeled on ISS African Futures (Pardee Institute IFs platform) but with
// three scenarios instead of two: Failure, Current Path, Possible Africa.
// Every number cites its source.

import Link from "next/link"
import { ExternalLink, Telescope, ArrowDownRight, Minus, ArrowUpRight, BookOpen } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  FUTURE_INDICATORS,
  SCENARIO_LABELS,
  INDICATORS_BY_CATEGORY,
  CATEGORY_NAMES,
  type FutureIndicator,
  type ScenarioKey,
} from "@/lib/futures-data"
import { ScenarioDivergenceChart } from "./scenario-chart"

export const metadata = {
  title: "Our Paths · Three futures for Africa by 2043 · Wisdom",
  description:
    "Africa is on three possible paths: failure, current path, or possible. Independent forecasts grounded in ISS African Futures, World Bank, IPCC, and FAO data.",
}

function formatValue(value: number, unit: string): string {
  switch (unit) {
    case '%': return `${value}%`
    case 'USD': return `$${value.toLocaleString()}`
    case '$B': return `$${value}B`
    case 'M': return `${value.toLocaleString()}M`
    case 'years': return `${value} yrs`
    case 't CO₂/person': return `${value.toFixed(2)} t CO₂`
    case 't/ha': return `${value.toFixed(1)} t/ha`
    case 'kg/ha': return `${Math.round(value).toLocaleString()} kg/ha`
    case 'per 1,000': return `${value}/1k`
    case 'per 100k': return `${value}/100k`
    case 'per 100': return `${value}/100`
    case 'score': return `${value.toFixed(1)}`
    case 'index (-2.5 to 2.5)': return value.toFixed(2)
    default: return `${value} ${unit}`
  }
}

function trendIcon(current: number, future: number, higherIsBetter: boolean) {
  const direction = future - current
  if (Math.abs(direction) < current * 0.02) return <Minus className="h-3 w-3" />
  const positive = higherIsBetter ? direction > 0 : direction < 0
  return positive ? (
    <ArrowUpRight className="h-3 w-3 text-emerald-500" />
  ) : (
    <ArrowDownRight className="h-3 w-3 text-orange-500" />
  )
}

export default function FuturesPage() {
  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto pb-12">
      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="pt-8 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Telescope className="h-5 w-5 text-primary" />
          <Badge variant="secondary" className="text-xs">
            The Future · Three Paths to 2043
          </Badge>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Our Paths
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
          By 2043 — when the African Union's third Ten-Year Implementation Plan
          ends — the continent will be one of three things, depending on what
          we do now.
        </p>
      </div>

      {/* ── Hero: three scenarios at a glance ────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <ScenarioHero scenarioKey="failure" />
        <ScenarioHero scenarioKey="currentPath" />
        <ScenarioHero scenarioKey="possibleAfrica" />
      </div>

      {/* ── Big divergence chart: GDP per capita ─────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">The single most important chart</CardTitle>
          <CardDescription>
            GDP per capita on the three paths, 2013 → 2043. The fan between the
            lines is what's at stake.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScenarioDivergenceChart />
          <SourceLine
            sources={[
              { label: 'World Bank Open Data', url: 'https://data.worldbank.org/indicator/NY.GDP.PCAP.PP.CD' },
              { label: 'ISS African Futures (Cilliers, IFs 8.34)', url: 'https://futures.issafrica.org/thematic/01-africas-current-path/' },
            ]}
          />
        </CardContent>
      </Card>

      {/* ── Sectoral cards ───────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sectoral futures</h2>
          <p className="text-muted-foreground mt-1">
            For each indicator: today's value, the three 2043 scenarios, and where the numbers come from.
          </p>
        </div>

        {(Object.keys(INDICATORS_BY_CATEGORY) as Array<keyof typeof INDICATORS_BY_CATEGORY>).map((cat) => (
          <div key={cat}>
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {CATEGORY_NAMES[cat]}
              </h3>
              <span className="text-xs text-muted-foreground">
                {INDICATORS_BY_CATEGORY[cat].length} indicators
              </span>
            </div>
            <div className="grid gap-3">
              {INDICATORS_BY_CATEGORY[cat].map((indicator) => (
                <IndicatorRow key={indicator.id} indicator={indicator} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── The Imagined Future ─────────────────────────────────── */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
        <CardHeader>
          <Badge variant="outline" className="text-[10px] uppercase tracking-wider w-fit gap-1.5">
            <BookOpen className="h-3 w-3" /> The imagined future
          </Badge>
          <CardTitle className="text-xl mt-2">
            African writers already imagined 2043
          </CardTitle>
          <CardDescription className="max-w-2xl">
            Decades before the data forecasters arrived, African novelists were
            modelling these same futures — by feel, not regression. Their
            imagination is part of the archive.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <ImaginedFutureCard
            title="Lagoon"
            author="Nnedi Okorafor"
            year={2014}
            workId={495}
            scenario="possibleAfrica"
            blurb="Aliens make first contact in Lagos, not Washington. The city's chaos becomes the protagonist."
          />
          <ImaginedFutureCard
            title="Rosewater"
            author="Tade Thompson"
            year={2016}
            workId={454}
            scenario="currentPath"
            blurb="Nigeria 2066: a town has grown around an alien biodome. Biopunk meets corruption-as-usual."
          />
          <ImaginedFutureCard
            title="Who Fears Death"
            author="Nnedi Okorafor"
            year={2010}
            workId={73}
            scenario="failure"
            blurb="Post-apocalyptic Sudan after climate and ethnic collapse. The failure scenario as fiction."
          />
        </CardContent>
      </Card>

      {/* ── Methodology footer ──────────────────────────────────── */}
      <Card className="bg-muted/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Methodology &amp; sources</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground leading-relaxed space-y-2">
          <p>
            <strong className="text-foreground">Current Path & Possible Africa values</strong>{' '}
            are drawn from{' '}
            <a
              href="https://futures.issafrica.org/thematic/01-africas-current-path/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              ISS African Futures
            </a>{' '}
            (Jakkie Cilliers, March 2026, IFs 8.34) — built on the{' '}
            <a
              href="https://pardee.du.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Pardee Institute
            </a>{' '}
            International Futures simulation model. The Combined Scenario
            assumes ambitious policy across 10 sectors (demographics,
            agriculture, health, education, manufacturing, AfCFTA,
            leapfrogging, financial flows, infrastructure, governance).
          </p>
          <p>
            <strong className="text-foreground">The Failure scenario</strong> is
            our own construction. It assumes documented historical worst-case
            patterns happen together: a 1980s-style lost decade (SAP era +
            commodity collapse), coup contagion in the Sahel, +3°C climate
            pathway, AfCFTA stagnation, and pandemic-preparedness collapse. Each
            component is anchored to a real precedent (Zimbabwe 2000-2008,
            Sahel 2020-2024, COVID-19 2020-2022).
          </p>
          <p>
            <strong className="text-foreground">Today's values</strong> are
            sourced from the World Bank, WHO Global Health Observatory,
            UNESCO UIS, FAOSTAT, UN World Population Prospects, IPCC AR6, and
            Mo Ibrahim IIAG. Every indicator card cites its specific source URL.
          </p>
          <p>
            <strong className="text-foreground">2043, not 2063?</strong> Because
            ISS publishes against the AU's 10-year implementation horizons.
            2043 is the end of the third plan. We extend a few indicators to
            2063 where defensible.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function ScenarioHero({ scenarioKey }: { scenarioKey: ScenarioKey }) {
  const meta = SCENARIO_LABELS[scenarioKey]
  // Pull headline numbers for this scenario across a few key indicators
  const headlines = ['gdp-share-global', 'extreme-poverty', 'agricultural-imports']
    .map((id) => FUTURE_INDICATORS.find((f) => f.id === id)!)
    .map((ind) => ({
      label: ind.name,
      value: formatValue(ind.scenarios2043[scenarioKey].value, ind.unit),
      currentValue: formatValue(ind.current.value, ind.unit),
      higherIsBetter: ind.higherIsBetter,
      trend: trendIcon(ind.current.value, ind.scenarios2043[scenarioKey].value, ind.higherIsBetter),
    }))

  const accent =
    scenarioKey === 'failure'
      ? 'border-red-500/40 bg-red-500/[0.04]'
      : scenarioKey === 'currentPath'
        ? 'border-blue-500/40 bg-blue-500/[0.04]'
        : 'border-emerald-500/40 bg-emerald-500/[0.04]'
  const titleColor =
    scenarioKey === 'failure'
      ? 'text-red-600 dark:text-red-400'
      : scenarioKey === 'currentPath'
        ? 'text-blue-600 dark:text-blue-400'
        : 'text-emerald-600 dark:text-emerald-400'

  return (
    <Card className={`${accent} flex flex-col`}>
      <CardHeader className="pb-3">
        <Badge variant="outline" className="w-fit text-[10px] uppercase tracking-wider mb-1.5">
          By 2043
        </Badge>
        <CardTitle className={`text-2xl ${titleColor}`}>{meta.name}</CardTitle>
        <CardDescription className="text-xs leading-relaxed">
          {meta.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 flex-1 justify-end">
        {headlines.map((h, i) => (
          <div key={i} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground truncate">{h.label}</span>
            <span className="flex items-center gap-1 font-semibold tabular-nums shrink-0">
              {h.value}
              {h.trend}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function IndicatorRow({ indicator }: { indicator: FutureIndicator }) {
  const { failure, currentPath, possibleAfrica } = indicator.scenarios2043

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base">{indicator.name}</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              {indicator.description}
            </CardDescription>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xl font-bold tabular-nums">
              {formatValue(indicator.current.value, indicator.unit)}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              today · {indicator.current.year}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Three scenario columns */}
        <div className="grid grid-cols-3 gap-2">
          <ScenarioCell
            scenario="failure"
            value={formatValue(failure.value, indicator.unit)}
            current={indicator.current.value}
            future={failure.value}
            higherIsBetter={indicator.higherIsBetter}
          />
          <ScenarioCell
            scenario="currentPath"
            value={formatValue(currentPath.value, indicator.unit)}
            current={indicator.current.value}
            future={currentPath.value}
            higherIsBetter={indicator.higherIsBetter}
          />
          <ScenarioCell
            scenario="possibleAfrica"
            value={formatValue(possibleAfrica.value, indicator.unit)}
            current={indicator.current.value}
            future={possibleAfrica.value}
            higherIsBetter={indicator.higherIsBetter}
          />
        </div>

        {/* Source citations row */}
        <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t flex-wrap text-[11px] text-muted-foreground">
          <div className="flex flex-col gap-0.5">
            <span>
              <span className="font-medium">Today's value:</span>{' '}
              <a
                href={indicator.current.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground inline-flex items-center gap-0.5"
              >
                {indicator.current.source} <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </span>
            <span>
              <span className="font-medium">Scenario forecasts:</span>{' '}
              <a
                href={indicator.scenarioSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground inline-flex items-center gap-0.5"
              >
                {indicator.scenarioSource} <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </span>
          </div>
        </div>

        {/* Failure basis note — methodology transparency */}
        <details className="mt-2 group">
          <summary className="text-[11px] text-muted-foreground/80 cursor-pointer hover:text-foreground select-none">
            Why might Failure happen? (methodology)
          </summary>
          <p className="text-[11px] text-muted-foreground/80 mt-1 italic leading-relaxed">
            {indicator.failureBasis}
          </p>
        </details>
      </CardContent>
    </Card>
  )
}

function ScenarioCell({
  scenario,
  value,
  current,
  future,
  higherIsBetter,
}: {
  scenario: ScenarioKey
  value: string
  current: number
  future: number
  higherIsBetter: boolean
}) {
  const meta = SCENARIO_LABELS[scenario]
  const accent =
    scenario === 'failure'
      ? 'text-red-600 dark:text-red-400 bg-red-500/[0.06] border-red-500/20'
      : scenario === 'currentPath'
        ? 'text-blue-600 dark:text-blue-400 bg-blue-500/[0.06] border-blue-500/20'
        : 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/[0.06] border-emerald-500/20'

  return (
    <div className={`rounded-md border px-3 py-2.5 flex flex-col gap-1 ${accent}`}>
      <div className="text-[10px] uppercase tracking-wider opacity-80 leading-none">
        {meta.short}
      </div>
      <div className="text-lg font-bold tabular-nums leading-tight">{value}</div>
      <div className="text-[10px] flex items-center gap-1 opacity-80">
        {trendIcon(current, future, higherIsBetter)}
        <span>by 2043</span>
      </div>
    </div>
  )
}

function ImaginedFutureCard({
  title,
  author,
  year,
  workId,
  scenario,
  blurb,
}: {
  title: string
  author: string
  year: number
  workId: number
  scenario: ScenarioKey
  blurb: string
}) {
  const meta = SCENARIO_LABELS[scenario]
  const accent =
    scenario === 'failure'
      ? 'text-red-600 dark:text-red-400'
      : scenario === 'currentPath'
        ? 'text-blue-600 dark:text-blue-400'
        : 'text-emerald-600 dark:text-emerald-400'

  return (
    <div className="rounded-md border bg-card/40 p-3 flex flex-col gap-1.5">
      <span className={`text-[10px] uppercase tracking-wider ${accent}`}>
        Imagines: {meta.short}
      </span>
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-semibold">{title}</span>
        <span className="text-xs text-muted-foreground tabular-nums">{year}</span>
      </div>
      <span className="text-xs text-muted-foreground">{author}</span>
      <p className="text-xs leading-relaxed mt-1">{blurb}</p>
      <Link href={`/work/${workId}`} className="mt-1">
        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1">
          Read in the archive →
        </Button>
      </Link>
    </div>
  )
}

function SourceLine({ sources }: { sources: Array<{ label: string; url: string }> }) {
  return (
    <div className="text-[11px] text-muted-foreground mt-3 pt-3 border-t flex items-center gap-2 flex-wrap">
      <span className="uppercase tracking-wider font-medium">Sources:</span>
      {sources.map((s, i) => (
        <span key={i} className="flex items-center gap-1">
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground inline-flex items-center gap-0.5"
          >
            {s.label}
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
          {i < sources.length - 1 && <span className="text-muted-foreground/50">·</span>}
        </span>
      ))}
    </div>
  )
}
