import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllWorks } from "@/lib/literature-data";
import { BookOpen, TrendingUp, Github, ArrowRight, Library, MessageSquare, Code2 } from "lucide-react";

export default function LandingPage() {
  const allWorks = getAllWorks();
  const totalWorks = allWorks.length;

  const sampleWorks = allWorks.filter(w =>
    ['Things Fall Apart', 'Season of Migration to the North', 'Song of Lawino', 'Breath, Eyes, Memory'].includes(w.title)
  );
  const displayWorks = sampleWorks.length >= 4 ? sampleWorks.slice(0, 4) : allWorks.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="size-4" />
            </div>
            <span className="font-semibold text-lg">Wisdom</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/browse" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Past</Link>
            <Link href="/africa-2050" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Present</Link>
            <Link href="/africa-2050" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Future</Link>
            <Link href="/ask" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Get Wisdom</Link>
            <Link href="/developer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Developer</Link>
            <a
              href="https://github.com/seathemc/pan-african-library"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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

        {/* MCP code block — x402 style */}
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
              That&apos;s it. Your AI assistant now has access to thousands of African works, authors, themes, and reading lists.
              Works with Claude Desktop, Claude Code, Cursor, and any MCP-compatible tool.
            </p>
            <Link href="/developer">
              <Button variant="outline" size="sm" className="gap-2 mt-1">
                Full developer docs <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-y bg-muted/20 py-10">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: `${totalWorks}+`, label: "Works" },
                { value: "200+", label: "Authors" },
                { value: "21", label: "Themes" },
                { value: "7", label: "MCP Tools" },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="text-3xl font-bold">{value}</span>
                  <span className="text-sm text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Three features */}
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="flex flex-col gap-4 mb-14">
            <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium">Three features</p>
            <h2 className="text-3xl font-bold">We built three features. Each one looks at Africa differently.</h2>
          </div>

          <div className="flex flex-col gap-0 divide-y border rounded-xl overflow-hidden">

            {/* Past */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="flex flex-col gap-4 p-8 lg:border-r">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Past</span>
                  <Badge variant="secondary">The Archive</Badge>
                </div>
                <h3 className="text-2xl font-bold">Thousands of pieces of African literature</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Novels, poems, essays, manifestos, speeches, oral traditions, theory, memoir — spanning
                  every region, era, and language. West Africa, East Africa, North Africa, the Caribbean,
                  and the diaspora. Arabic, Swahili, Portuguese, French, and English.
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
                  A live dashboard tracking Africa&apos;s progress against the African Union&apos;s Agenda 2063
                  goals — poverty, education, governance, health, trade, and gender equality. Real 2013
                  baselines, real 2063 targets.
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
                  Projections and trajectories toward 2063. Where Africa is headed on each of the 7
                  Agenda 2063 aspirations, and what the data says about the path there.
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
                    <CardTitle className="text-sm font-medium text-muted-foreground">Overall Progress vs. 2063 Target</CardTitle>
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

        {/* Get Wisdom — AI layer */}
        <div className="border-t bg-muted/10 py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="flex flex-col gap-5">
                <Badge variant="outline" className="w-fit">Get Wisdom</Badge>
                <h2 className="text-3xl font-bold">One conversation across all three</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Ask the AI librarian anything — reading recommendations, context on an author, connections
                  across works and data, or what the archive says about any theme or moment in African history.
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

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-semibold">Wisdom</span>
              <span className="text-sm text-muted-foreground">· Pan-African Library · Open Source (MIT)</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/browse" className="hover:text-foreground transition-colors">Past</Link>
              <Link href="/africa-2050" className="hover:text-foreground transition-colors">Present</Link>
              <Link href="/africa-2050" className="hover:text-foreground transition-colors">Future</Link>
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
