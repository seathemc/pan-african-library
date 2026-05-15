# Audit Prompt — Wisdom Pan-African Library Data Verification

Hand this entire document to a data-science-capable AI agent (Claude, GPT-4o,
Gemini, Cursor, etc.) with repo access. It contains everything needed to do
an end-to-end audit of the Agenda 2063 dashboard data, formulas, citations,
and methodology.

---

## ROLE

You are the Chief Data Officer of a UN statistical division being asked to
review a publicly-deployed dashboard that claims to objectively measure
whether the African Union's Agenda 2063 goals are being met. Your job is to
find every numerical, methodological, citation, and framing error before it
embarrasses anyone or — worse — gets quoted by journalists.

You are explicitly **NOT** here to be encouraging. Find what's wrong. Quantify
what's wrong. Propose fixes. If something is correct, say so once and move on.

## WHAT THIS PRODUCT IS

`Wisdom` is a Next.js application at `pan-african-library/`. The relevant
modules for this audit:

- **Agenda 2063 dashboard** (`/africa-2050`): two views, "Our reality" (live
  current-state scoring of African Union's 20 goals) and "Our goals" (linear
  projections to 2063 targets per indicator).
- **Three-scenario futures forecast** (`/futures`): The Failure / Current
  Path / Possible Africa for 2043, modelled on ISS African Futures
  (futures.issafrica.org) data.
- **Public data audit page** (`/audit`): the methodology disclosure page
  this audit will largely write into.

The product compares its own independently-computed scores against the AU's
self-reported scores from the AUDA-NEPAD Second Continental Report on the
Implementation of Agenda 2063 (Feb 2022). The product's stated objective is
to be **more credible than AU's own self-reported numbers**, by virtue of
sourcing data from independent providers (World Bank, WHO, IIAG, ISS, etc.)
and showing every number's provenance.

## REPO STRUCTURE (audit-relevant files only)

```
pan-african-library/
├── lib/
│   ├── agenda-2063-data.ts          # ⚠ DEPRECATED static indicators, 25 entries
│   ├── agenda-2063-live.ts          # Live data loader + scoring formulas
│   └── futures-data.ts              # 3-scenario data for /futures page
├── scripts/ingest/
│   ├── african-countries.ts         # 55 AU member states with ISO3 codes
│   ├── african-population.ts        # UN WPP 2024 population weights
│   ├── indicators-registry.ts       # 22 indicators × source mappings
│   ├── world-bank.ts                # Live ingestion script (blocked by sandbox)
│   ├── seed-from-public-data.ts     # Bootstrap seed (only 7 indicators populated)
│   └── mo-ibrahim-iiag.ts           # IIAG ingestion + 2014/2024 hand-curated values
├── data/ingested/
│   ├── world-bank.json              # 21 indicators, only 7 with country data
│   ├── mo-ibrahim-iiag.json         # 1 indicator, 54/55 countries
│   └── manifest.json                # Fetch timestamp, isSeed flag
├── app/(app)/africa-2050/
│   ├── page.tsx                     # Page shell with Reality/Goals view switcher
│   ├── live-data-section.tsx       # Live data layer UI (consumes lib/agenda-2063-live)
│   ├── score-dashboard.tsx          # Old static layer UI (consumes lib/agenda-2063-data)
│   ├── forecast-view.tsx            # "Our goals" forecast view
│   ├── forecast-summary.tsx         # Aggregated forecast card
│   ├── charts.tsx                   # 8-tab chart deck (population/economy/etc)
│   ├── aspiration-radar.tsx         # 7-aspiration radar comparison
│   └── view-switcher.tsx
├── app/(app)/futures/
│   ├── page.tsx                     # /futures page with 3 scenarios
│   └── scenario-chart.tsx           # GDP/cap divergence chart
├── app/(app)/audit/
│   └── page.tsx                     # Public methodology disclosure
└── components/
    └── africa-tile-map.tsx          # Tile-grid map of Africa
```

## ALREADY KNOWN ISSUES (pre-audit findings — don't re-discover, just verify they're documented)

Two prior audit passes have surfaced these. Please verify each is either
fixed or correctly disclosed in `/audit` and `/audit page.tsx`:

### Verified fixed (audit by re-running checks)
- IIAG continental average 47.99 vs published 49.3 (Malawi was missing) → Malawi restored to 2014 + 2024 datasets.
- GDP per capita continental average overstated 40% (was simple-mean $2,824, should be pop-weighted $2,021) → `continentalAggregate()` in lib/agenda-2063-live.ts now computes both methods.
- 11 of 20 AU goals had no indicators but composite was labeled "covers all 7 aspirations" → `getCoverageStats()` + transparency banner now disclose actual coverage.
- Africa population 2043 forecast was 2.3B vs UN 2.14B → fixed in lib/futures-data.ts.
- Scenario chart "now" marker was 2023, should be 2026 → fixed.
- charts.tsx: GDP 2013 was $1.6T (sub-Saharan only), should be $2.5T (full Africa) → fixed.
- charts.tsx: IIAG 2013 was 47.5, should be 50.4 → fixed.
- charts.tsx: population baseline 1.11B, should be 1.13B → fixed.

### Open (verify these are disclosed clearly)
- 14 of 22 registry indicators have NO seed data (only 7 wired)
- True composite score is **14.6%** (pop-weighted, mean of 4 aspirations), not "18%" or whatever else the UI shows in some cases
- Two competing sources of truth: `agenda-2063-data.ts` (deprecated, 25 indicators) vs `agenda-2063-live.ts` (registry, 22 indicators). ScoreDashboard and ForecastView still read from the deprecated file.

## YOUR AUDIT TASKS

Work through these in order. Produce a single Markdown report at `AUDIT_REPORT.md`
with sections matching each task. Include line numbers for every issue found.

### TASK 1: Numerical accuracy of every hardcoded value

For every numerical literal in the following files, verify it against the cited
authoritative source. Where a value lacks a citation, find the closest
authoritative value and note the discrepancy.

Files to audit (priority order):

1. `app/(app)/africa-2050/charts.tsx` — has 9+ hardcoded data series:
   - `populationData` → verify against UN WPP 2024 medium variant
     (https://population.un.org/wpp/Download/Standard/MostUsed/, file
     `WPP2024_TotalPopulationBySex.csv`)
   - `economicData` → verify GDP and per-capita against World Bank
     (`NY.GDP.MKTP.CD` for current US$ Africa total)
   - `energyData` → verify electricity access against World Bank
     (`EG.ELC.ACCS.ZS`) and IEA Africa Energy Outlook
   - `educationData` → verify against UNESCO UIS Bulk Data Download
   - `healthData` → verify against WHO GHO (life expectancy:
     `WHOSIS_000001`; under-5 mortality: `MDG_0000000007`)
   - `digitalData` → verify against ITU
     (https://www.itu.int/en/ITU-D/Statistics/Pages/stat/default.aspx)
   - `governanceData` → verify ibrahimIndex against MIIAG published reports
     2014–2024 (https://iiag.online; download dataset)
   - `tradeData` → verify intra-African trade share against UNCTAD
   - `employmentData`, `wagesData`, `happinessData` — verify against ILO
     (modelled estimates), World Happiness Report, etc.
2. `lib/futures-data.ts` — 14 indicators with current/scenario/source URLs:
   - For each `current.value`: verify against the cited source
   - For each `scenarios2043.currentPath.value`: verify against ISS African
     Futures thematic reports (the URLs are in `scenarioSourceUrl`).
     Specifically: download/read each cited ISS thematic page and confirm
     our number matches their published Current Path 2043 forecast.
   - For each `scenarios2043.failure.value`: verify the `failureBasis`
     justification cites real historical precedent (Zimbabwe 2000-2008,
     SAP era 1980-1995, Sahel coup contagion 2020-2024, +3°C climate, etc.)
   - For each `scenarios2043.possibleAfrica.value`: verify against ISS
     African Futures Combined Scenario for that indicator
3. `lib/agenda-2063-data.ts` (deprecated): just verify it's marked deprecated
   and not used by any non-deprecated component
4. `data/ingested/world-bank.json` — every country value should match World
   Bank API for that indicator + country + year. Spot-check 5 countries × 5
   indicators (25 total spot-checks)
5. `data/ingested/mo-ibrahim-iiag.json` — every country score should match
   IIAG published values (https://iiag.online → select year → download CSV)
6. `scripts/ingest/african-population.ts` — every weight should match UN WPP
   2024 medium variant 2023 estimate (in millions)

For each value, output:
```
[OK | OFF_BY_X% | WRONG] file:line  literal_value  expected_value  source_url  notes
```

### TASK 2: Formula correctness

Re-derive the following calculations from first principles and verify the code
produces the same result:

- `calculateProgress(current, baseline, target, higherIsBetter)` in
  `lib/agenda-2063-live.ts`. Test cases:
  - life expectancy: baseline 60, current 64, target 75 → expected 26.7%
  - maternal mortality: baseline 480, current 394, target 70, higherIsBetter=false → expected 21.0%
  - regression case: baseline 50, current 40, target 80, hib=true → expected 0%
  - overshoot: baseline 0, current 110, target 100, hib=true → expected 100%
  - target = baseline edge case
  - null current
- `calculateGoalScore(goalId)`: simple mean of indicator progress in goal.
  Verify it skips null indicators correctly.
- `calculateAspirationScore(aspirationId)`: mean of goal scores. Verify it
  skips goals with null score.
- `calculateOverallScore()`: mean of aspiration scores excluding nulls.
  Critical question: is excluding-null-aspirations the right choice, or
  should we be honest that the composite covers only N of 7 aspirations?
- `continentalAggregate(indicatorId)`: simple mean vs population-weighted.
  Verify the population weights are used correctly. Verify total reported
  population matches sum of contributing countries (not double-counted).
- Forecast extrapolation in `forecast-view.tsx` and `forecast-summary.tsx`:
  - `projectCompletionYear`: linear extrapolation. Verify edge case where
    `progress = 0` (stagnant) returns null, not infinity.
  - Verify `medianCompletionYear` computation properly handles odd vs even
    sample size.
  - Verify the trajectory chart (`forecast-summary.tsx`) plots `currentPace`
    and `requiredPace` correctly.

For each formula, output:
```
[CORRECT | INCORRECT | EDGE_CASE_BUG] formula_name  test_input  expected  actual  notes
```

### TASK 3: Cross-file consistency

Identify all pairs of files that contain the same conceptual indicator but
with different values:

- `lib/agenda-2063-data.ts` vs `scripts/ingest/indicators-registry.ts`:
  same indicator, different baseline/target?
- `lib/futures-data.ts` vs `scripts/ingest/indicators-registry.ts`:
  same indicator (e.g. life-expectancy), different baseline2013 or target2063?
- `app/(app)/africa-2050/charts.tsx` vs `lib/agenda-2063-live.ts`:
  same indicator (e.g. life expectancy 2023), different value?

For each conflict, output:
```
[CONFLICT] indicator_name  fileA:line valueA  fileB:line valueB  likely_correct_value  recommendation
```

### TASK 4: Citation accuracy

For every external URL in the codebase:

1. Verify the URL is reachable (HTTP 200)
2. Verify the page actually contains the data we cite
3. Verify the dataset/indicator code we cite (e.g. `SP.DYN.LE00.IN`) is the
   correct identifier on that source

Sources to verify:
- All `sourceUrl` and `scenarioSourceUrl` fields in `lib/futures-data.ts`
- All `sourceUrl` fields in `scripts/ingest/indicators-registry.ts`
- All anchor `href` URLs in `app/(app)/audit/page.tsx`
- All anchor `href` URLs in the chart sources footer in `app/(app)/africa-2050/charts.tsx`
- The AU Continental Report URL in `lib/agenda-2063-live.ts` `AU_REPORTED_SCORES.reportUrl`

For each, output:
```
[VALID | DEAD | WRONG_DATASET] url  expected_dataset  actual_content_summary
```

### TASK 5: Methodology framing — does the UI claim what the math actually does?

Read each of the following and identify any claim that overstates what the
underlying data supports:

- `app/(app)/africa-2050/live-data-section.tsx`:
  - The hero card claim "Composite of 7 aspirations" — does the math actually
    use all 7? (Answer: no, only those with indicators. Is this disclosed?)
  - The "Our score vs AU's self-reported score" table — does the divergence
    column properly handle the case where our score is null?
  - The "indicators wired" count vs "indicators with data" — are these
    distinguished clearly?
- `app/(app)/futures/page.tsx`:
  - The "By 2043" hero numbers — are they specifically 2043 values, or do
    some come from extrapolations beyond what ISS published?
  - The Failure scenario claim "documented historical worst-case" —
    is each Failure value actually anchored to a documented precedent?
- `app/(app)/futures/scenario-chart.tsx`:
  - Are the 2026 historical values defensible? ($6,100 GDP/cap PPP for 2026)
  - Are the three forward paths' 2043 endpoints consistent with the
    sectoral cards on the same page?
- `app/(app)/africa-2050/charts.tsx`:
  - The forward projections (2030, 2040, 2050, 2063) — are they labeled as
    extrapolation/projection, not actual data?
  - Where the chart suggests Africa "will" achieve some value — does the
    underlying data actually support such a confident claim?

For each issue, output:
```
[OVERCLAIM | MISSING_CAVEAT | MISLEADING_LABEL] file:line  what_UI_says  what_data_actually_shows
```

### TASK 6: AU framework alignment

The AU's official Agenda 2063 framework is:
- 7 Aspirations
- 20 Goals (numbered 1-20, distributed across aspirations as 7+3+2+3+1+2+2)
- ~140-170 priority targets (from FTYIP)
- ~250 indicators (from the integrated SDG/A2063 framework)

Verify in our code:
1. Are the 20 goals numbered correctly?
2. Are aspiration-to-goal mappings correct? (`ASPIRATION_GOALS` in
   `lib/agenda-2063-live.ts`)
3. Are indicator-to-goal assignments in `scripts/ingest/indicators-registry.ts`
   correct? (e.g., is "literacy-adult" really under Goal 2 in AU's framework?)
4. Compare our 22 indicators against AU's published priority indicator set.
   How much of AU's framework do we cover?

Reference: the user-shared AUDA-NEPAD "Second Continental Report on the
Implementation of Agenda 2063" (Feb 2022) which lists all 20 goals with
2019/2021 progress scores.

### TASK 7: Reproducibility and live-pipeline integrity

The dashboard is supposed to refresh weekly via a GitHub Action
(`.github/workflows/ingest-data.yml`). Verify:

1. The workflow YAML is syntactically valid
2. The workflow actually runs the ingestion script (no typos in the
   `npx tsx scripts/ingest/world-bank.ts` invocation)
3. The ingestion script (`scripts/ingest/world-bank.ts`) actually fetches
   from the World Bank API and writes valid JSON
4. The output JSON shape matches what `lib/agenda-2063-live.ts` expects
5. The `manifest.json` has correct `fetchedAt` and `isSeed` semantics
6. The `getFreshnessLabel()` function correctly degrades from "Refreshed
   today" → "Refreshed N days ago" → "stale"

Run `npx tsx scripts/ingest/world-bank.ts` if you have network access. Even
in a sandbox, parse the script and verify the URL pattern matches the World
Bank API documentation.

### TASK 8: Country coverage gaps

For each indicator in `data/ingested/world-bank.json`:

- Which countries are reporting (have `latestValue !== null`)?
- Which countries are missing?
- Among the missing, which are the most populous? (a missing Mauritius
  matters less than a missing Nigeria)
- For the populous-missing countries, can data be sourced from elsewhere
  (national stats office, WHO directly, etc.)?

Cross-reference with `scripts/ingest/african-population.ts` to compute:
- `populationCovered / totalAfricanPop` per indicator
- The "missing population" (countries with no value × their populations)

Flag any indicator where missing-population exceeds 10% of the continent.

### TASK 9: Comparative validation against ISS African Futures

For every indicator that overlaps between our scope and ISS thematic reports:

1. Pull the ISS report URL (in `lib/futures-data.ts`)
2. Compare our 2023 baseline value to ISS's 2023 baseline
3. Compare our 2043 Current Path value to ISS's Current Path forecast
4. Note where we differ from ISS by more than 10%

ISS thematic URLs follow pattern `https://futures.issafrica.org/thematic/NN-name/`
where NN is the theme number. Reports are by Jakkie Cilliers, last updated
March 2026 using IFs 8.34.

### TASK 10: Final report structure

Produce `AUDIT_REPORT.md` with these sections:

1. **Executive summary** — 5 bullets: most critical issues
2. **Findings by severity**:
   - HIGH (numerical errors > 20%, broken formulas, dead URLs, factual misstatements)
   - MEDIUM (numerical errors 5-20%, methodology overclaims, missing citations)
   - LOW (cosmetic, minor framing, opportunities for improvement)
3. **Per-task findings** — output blocks from tasks 1-9
4. **Recommended fixes** — prioritized list with effort estimates
5. **What's actually right** — short list. Don't pad. If the formula passes
   all edge-case tests, say so once.
6. **What we still can't verify** — be honest about what your audit couldn't
   confirm (e.g., couldn't fetch ISS PDF, couldn't reach World Bank API)

## AUDIT TONE GUIDELINES

- Quantify everything. Not "GDP value seems high" — "GDP value of $2.5T is
  6% above WB published $2.36T."
- Cite line numbers for every finding.
- Don't pad. If a section has no issues, write one sentence.
- Don't moralize. The user wants signal, not encouragement.
- Distinguish between **errors** (provably wrong) and **judgment calls** (where
  reasonable people could differ).
- If you can't verify something, say so. Don't guess.

## RUNTIME CONSTRAINTS

You have access to: file read, web fetch, code execution. You may need
network access to fetch from World Bank, WHO, UNESCO, IIAG. If your sandbox
blocks any of these, document which checks you couldn't complete and why.

You should be able to complete a thorough audit in 30-90 minutes of focused
work. Don't rush through. The point is to find things the previous audits
missed.

## DELIVERABLES

1. `AUDIT_REPORT.md` — comprehensive findings (see Task 10 structure)
2. `AUDIT_REPORT_SUMMARY.md` — 1-page exec summary for stakeholders
3. (Optional) commit-ready fixes as a series of Edit operations on the files
   identified, each with a clear commit message explaining the change

## REFERENCE: KEY EXTERNAL DATA SOURCES (use these for verification)

- **World Bank Open Data API**: `https://api.worldbank.org/v2/country/{ISO3}/indicator/{CODE}?format=json` — no auth, public domain. Indicator catalog: https://data.worldbank.org/indicator
- **WHO Global Health Observatory OData**: `https://ghoapi.azureedge.net/api/Indicator` — no auth
- **UNESCO UIS API**: `https://api.uis.unesco.org` — requires free API key from https://api.uis.unesco.org
- **UN World Population Prospects 2024**: `https://population.un.org/wpp/Download/Standard/MostUsed/` — bulk CSV/Excel
- **FAOSTAT API**: `https://fenixservices.fao.org/faostat/api/v1/en/` — no auth
- **ISS African Futures**: `https://futures.issafrica.org` — HTML/PDF reports, scrape per thematic page
- **Mo Ibrahim IIAG**: `https://iiag.online` — annual data, downloadable CSV
- **AUDA-NEPAD Continental Reports**: `https://au.int/en/documents` — search "Continental Report"
- **Our World in Data** (cleaned cross-source aggregator): `https://ourworldindata.org/grapher/{slug}.csv` for any chart slug
- **AfDB Open Data Portal**: `https://dataportal.opendataforafrica.org` (Knoema-based, requires free API key)

## TIMELINE EXPECTATION

A complete audit covering all 10 tasks against ~13,000 lines of code and
~6,500 lines of data should take a thorough auditor 4-8 hours. Don't skim.
This dashboard is going to be quoted by people who matter.

---

End of audit prompt. Begin work by reading `AUDIT_PROMPT.md` (this file) end-to-end,
then reading the file structure overview above, then proceeding to Task 1.
