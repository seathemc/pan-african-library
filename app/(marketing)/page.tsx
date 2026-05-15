import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllWorks } from "@/lib/literature-data";
import { Github, ArrowRight, Library, MessageSquare, Code2, Database, ShieldCheck, RefreshCw, ExternalLink } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { WisdomLogo } from "@/components/wisdom-logo";

export default function LandingPage() {
  const allWorks = getAllWorks();

  const sampleWorks = allWorks.filter(w =>
    ['Things Fall Apart', 'Season of Migration to the North', 'Song of Lawino', 'Breath, Eyes, Memory'].includes(w.title)
  );
  const displayWorks = sampleWorks.length >= 4 ? sampleWorks.slice(0, 4) : allWorks.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <WisdomLogo size={18} />
            </div>
            <span className="font-semibold text-lg">Wisdom</span>
          </div>
          <div className="flex items-center gap-2">
            <nav className="hidden md:inline-flex items-center rounded-lg bg-muted p-1 gap-0.5">
              <Link href="/africa-2050" className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-background hover:text-foreground transition-all">Future</Link>
              <Link href="/africa-2050" className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-background hover:text-foreground transition-all">Present</Link>
              <Link href="/browse" className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-background hover:text-foreground transition-all">Past</Link>
              <Link href="/ask" className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-background hover:text-foreground transition-all">Get Wisdom</Link>
              <Link href="/developer" className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-background hover:text-foreground transition-all">Developer</Link>
              <Link href="/manifesto" className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-background hover:text-foreground transition-all">Manifesto</Link>
            </nav>
            <ThemeToggle />
            <a
              href="https://github.com/seathemc/pan-african-library"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* Hero */}
        <div className="max-w-5xl mx-auto px-6 pt-24 pb-16">
          <div className="flex flex-col gap-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              5,000 years of African wisdom<br className="hidden md:block" /> in one MCP.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Thinkers, writers, fighters, artists — from ancient oral traditions to contemporary theory.
              Embeddable in any tool or workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Link href="/developer">
                <Button size="lg" className="gap-2 text-base">
                  <Code2 className="h-5 w-5" />
                  View the MCP
                </Button>
              </Link>
              <Link href="/browse">
                <Button size="lg" variant="outline" className="gap-2 text-base">
                  <Library className="h-5 w-5" />
                  Explore the Archive
                </Button>
              </Link>
              <Link href="/ask">
                <Button size="lg" variant="outline" className="gap-2 text-base">
                  <MessageSquare className="h-5 w-5" />
                  Get Wisdom
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* MCP code block */}
        <div className="max-w-5xl mx-auto px-6 pb-20">
          <div className="border rounded-xl bg-muted/30 p-6 space-y-4">
            <p className="text-sm font-medium flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              Add Wisdom to Claude Desktop in one step
            </p>
            <pre className="bg-background border rounded-lg p-5 text-sm font-mono overflow-x-auto">{`{
  "mcpServers": {
    "wisdom": {
      "command": "npx",
      "args": ["-y", "wisdom-mcp"]
    }
  }
}`}</pre>
            <p className="text-sm text-muted-foreground">
              Works with Claude Desktop, Claude Code, Cursor, and any MCP-compatible tool.
            </p>
            <Link href="/developer">
              <Button variant="outline" size="sm" className="gap-2 mt-1">
                Full developer docs <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Three features — the Wisdom story */}
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="flex flex-col gap-5 mb-14 max-w-2xl">
            <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium">Past · Present · Future</p>
            <h2 className="text-3xl md:text-4xl font-bold leading-snug">
              Intelligence without time is just data.<br />Wisdom knows where something came from, where it stands, and where it's going.
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              The three tools aren't separate features — they're a single temporal system.
              The past gives you the foundation. The present gives you the reality. The future gives you the direction.
              Put them together, and you don't have information about Africa. You have wisdom about it.
            </p>
          </div>

          <div className="flex flex-col gap-0 divide-y border rounded-xl overflow-hidden">

            {/* Past */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="flex flex-col gap-4 p-8 lg:border-r">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Past</span>
                  <Badge variant="secondary">The Archive</Badge>
                </div>
                <h3 className="text-2xl font-bold">The intellectual and cultural foundation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Novels, poems, essays, manifestos, speeches, oral traditions, theory, memoir —
                  spanning every region and era, from pre-colonial oral tradition to contemporary Afrofuturism.
                  The written record of how Africa has understood itself over centuries.
                  This is where wisdom begins: in knowing what was thought before.
                </p>
                <Link href="/browse">
                  <Button variant="outline" className="w-fit gap-2 mt-2">
                    Browse the Archive <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="p-8 bg-muted/20">
                <div className="space-y-3">
                  {displayWorks.map((work) => (
                    <div key={work.id} className="bg-background rounded-lg p-4 border space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm leading-tight">{work.title}</h4>
                        <Badge variant="secondary" className="text-[10px] shrink-0">{work.yearPublished}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{work.author}</p>
                      <div className="flex gap-1.5">
                        <Badge variant="outline" className="text-[10px]">{work.region}</Badge>
                        <Badge variant="outline" className="text-[10px]">{work.genre}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Present */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="p-8 bg-muted/20 lg:border-r order-2 lg:order-1">
                <div className="space-y-3">
                  {[
                    { label: "A Prosperous Africa", color: "bg-emerald-500", status: "On Track" },
                    { label: "An Integrated Continent", color: "bg-amber-500", status: "At Risk" },
                    { label: "Good Governance", color: "bg-amber-500", status: "At Risk" },
                    { label: "A Peaceful Africa", color: "bg-red-500", status: "Behind" },
                    { label: "Strong Cultural Identity", color: "bg-emerald-500", status: "On Track" },
                    { label: "People-Driven Development", color: "bg-amber-500", status: "At Risk" },
                    { label: "Africa as a Global Player", color: "bg-emerald-500", status: "On Track" },
                  ].map(({ label, color, status }) => (
                    <div key={label} className="bg-background rounded-lg px-4 py-3 border flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className={`inline-block w-2.5 h-2.5 rounded-full shrink-0 ${color}`} />
                        <span className="text-sm">{label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{status}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-4 p-8 order-1 lg:order-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Present</span>
                  <Badge variant="secondary">The Dashboard</Badge>
                </div>
                <h3 className="text-2xl font-bold">Where Africa stands today</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The African Union's Agenda 2063 is a fifty-year development blueprint tracking
                  prosperity, governance, peace, and identity across all 55 member states. Wisdom
                  surfaces that data as a live, queryable layer — not a PDF report. Because
                  understanding the present is what connects the intellectual inheritance of the
                  past to a credible vision of the future.
                </p>
                <Link href="/africa-2050">
                  <Button variant="outline" className="w-fit gap-2 mt-2">
                    View the Dashboard <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Future */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="flex flex-col gap-4 p-8 lg:border-r">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Future</span>
                  <Badge variant="secondary">The Forecast</Badge>
                </div>
                <h3 className="text-2xl font-bold">Where Africa is headed</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Trend projections on the same Agenda 2063 indicators — infrastructure, economic
                  convergence, education, health — so that questions about Africa's direction are
                  answered with data, not opinion. The thinkers in the archive imagined this future.
                  The dashboard shows where it stands. The forecast shows whether the trajectory matches the vision.
                </p>
                <Link href="/africa-2050">
                  <Button variant="outline" className="w-fit gap-2 mt-2">
                    Explore the Forecast <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="p-8 bg-muted/20 flex flex-col justify-center gap-4">
                <Card className="border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Progress toward 2063 targets</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { label: "Poverty Reduction", pct: 34 },
                      { label: "Education Access", pct: 51 },
                      { label: "Gender Equality", pct: 28 },
                      { label: "Renewable Energy", pct: 19 },
                    ].map(({ label, pct }) => (
                      <div key={label} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="font-medium">{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    <p className="text-[10px] text-muted-foreground pt-1">Projections from published AU trend data · Not live feeds</p>
                  </CardContent>
                </Card>
              </div>
            </div>

          </div>
        </div>

        {/* How we know what we know — credibility / data architecture */}
        <div className="border-t py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-4 max-w-3xl">
                <Badge variant="outline" className="w-fit gap-1.5">
                  <ShieldCheck className="h-3 w-3" /> How we know what we know
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  The numbers aren't AU's. They're independently verifiable.
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  African Union biennial reports are self-reported by member states and widely
                  read as politically optimistic — one goal jumped 12% → 98% in two years in their
                  2022 report. Wisdom rebuilds the same scoring from{' '}
                  <strong className="text-foreground">independent public sources</strong>:
                  the World Bank, WHO, UNESCO, Mo Ibrahim IIAG, UN Population Division, IPCC, and ISS African Futures.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-blue-500/30 bg-blue-500/[0.03]">
                  <CardHeader className="pb-3">
                    <Database className="h-5 w-5 text-blue-500 dark:text-blue-400 mb-2" />
                    <CardTitle className="text-base">Every number cites its source</CardTitle>
                    <CardDescription className="text-xs">
                      Click any indicator on the dashboard and you'll see exactly which World Bank
                      code or WHO dataset it came from. We don't blend providers within a single number.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card className="border-emerald-500/30 bg-emerald-500/[0.03]">
                  <CardHeader className="pb-3">
                    <RefreshCw className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mb-2" />
                    <CardTitle className="text-base">Refreshed weekly, not biennially</CardTitle>
                    <CardDescription className="text-xs">
                      A GitHub Action pulls fresh data from the source APIs every Sunday and commits
                      it back to the repo. AU publishes once every two years in PDFs — we publish
                      a diff every week.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card className="border-violet-500/30 bg-violet-500/[0.03]">
                  <CardHeader className="pb-3">
                    <ShieldCheck className="h-5 w-5 text-violet-500 dark:text-violet-400 mb-2" />
                    <CardTitle className="text-base">Methodology is public</CardTitle>
                    <CardDescription className="text-xs">
                      Every formula, every coverage gap, every disagreement with AU's numbers is
                      published on our audit page. We use population-weighted continental aggregates
                      (matching WB/WHO methodology), not naïve country means.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              {/* Mini architecture diagram */}
              <div className="rounded-lg border bg-muted/10 p-6">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
                  Data flow
                </div>
                <div className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-3 text-xs">
                  <FlowStep
                    label="Sources"
                    detail="World Bank · WHO · UNESCO · IIAG · UN · ISS"
                    tone="muted"
                  />
                  <FlowArrow />
                  <FlowStep
                    label="Ingest"
                    detail="Weekly cron · GitHub Actions"
                    tone="blue"
                  />
                  <FlowArrow />
                  <FlowStep
                    label="Storage"
                    detail="Versioned JSON · committed to git"
                    tone="violet"
                  />
                  <FlowArrow />
                  <FlowStep
                    label="Aggregate"
                    detail="Population-weighted · clamped · null-safe"
                    tone="emerald"
                  />
                  <FlowArrow />
                  <FlowStep
                    label="Render"
                    detail="Next.js · server-side · zero API calls at request time"
                    tone="primary"
                  />
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                <Link href="/audit">
                  <Button variant="outline" className="gap-2">
                    Read the full methodology
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <a href="https://github.com/seathemc/pan-african-library" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" className="gap-2">
                    <Github className="h-4 w-4" />
                    Read the code on GitHub
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Get Wisdom */}
        <div className="border-t bg-muted/10 py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="flex flex-col gap-5">
                <Badge variant="outline" className="w-fit">Get Wisdom</Badge>
                <h2 className="text-3xl font-bold">One conversation across all three</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Ask the AI librarian anything — reading recommendations, context on an author,
                  what the archive says about a moment in African history, or how a literary theme
                  connects to what the development data shows today.
                </p>
                <Link href="/ask">
                  <Button className="w-fit gap-2">
                    Start a conversation <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <Card className="bg-background border-primary/20">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Wisdom
                  </CardTitle>
                  <CardDescription>Powered by Claude</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-muted/50 rounded-lg px-4 py-3 text-sm max-w-xs ml-auto text-right">
                    Recommend 3 works on decolonization from East Africa
                  </div>
                  <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 text-sm space-y-2">
                    <p>Here are three essential works:</p>
                    <p>1. <strong>Ngũgĩ wa Thiong&apos;o</strong> — <em>Decolonising the Mind</em> (1986)</p>
                    <p>2. <strong>Frantz Fanon</strong> — <em>The Wretched of the Earth</em> (1961)</p>
                    <p>3. <strong>Okot p&apos;Bitek</strong> — <em>Song of Lawino</em> (1966)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

      </main>

      <footer className="border-t py-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <WisdomLogo size={20} className="text-primary" />
              <span className="font-semibold">Wisdom</span>
              <span className="text-sm text-muted-foreground">· Pan-African Library · Open Source (MIT)</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/browse" className="hover:text-foreground transition-colors">Archive</Link>
              <Link href="/africa-2050" className="hover:text-foreground transition-colors">Agenda 2063</Link>
              <Link href="/ask" className="hover:text-foreground transition-colors">Get Wisdom</Link>
              <a href="https://github.com/seathemc/pan-african-library" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
              <Link href="/developer" className="hover:text-foreground transition-colors">Developer</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Compact horizontal data-flow step used in the "How we know what we know" section.
// One per layer of the architecture; together they tell the source → render story.
function FlowStep({
  label,
  detail,
  tone,
}: {
  label: string;
  detail: string;
  tone: "muted" | "blue" | "violet" | "emerald" | "primary";
}) {
  const toneClasses = {
    muted: "border-muted-foreground/30 bg-background",
    blue: "border-blue-500/40 bg-blue-500/[0.04]",
    violet: "border-violet-500/40 bg-violet-500/[0.04]",
    emerald: "border-emerald-500/40 bg-emerald-500/[0.04]",
    primary: "border-primary/40 bg-primary/[0.05]",
  } as const;
  return (
    <div
      className={`flex-1 rounded-md border ${toneClasses[tone]} px-3 py-2.5 flex flex-col gap-0.5 min-w-0`}
    >
      <div className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
        {label}
      </div>
      <div className="text-[11px] text-muted-foreground leading-snug truncate">
        {detail}
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex items-center justify-center text-muted-foreground/60 shrink-0">
      <span className="hidden sm:inline">→</span>
      <span className="sm:hidden text-xs py-1">↓</span>
    </div>
  );
}
