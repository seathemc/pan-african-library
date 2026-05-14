import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllWorks } from "@/lib/literature-data";
import { BookOpen, TrendingUp, Github, ArrowRight, Library, MessageSquare, Code2 } from "lucide-react";

export default function LandingPage() {
  const allWorks = getAllWorks();
  const totalWorks = allWorks.length;

  // Get sample works for preview — spread across regions
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
            <Link href="/browse" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Archive
            </Link>
            <Link href="/ask" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Get Wisdom
            </Link>
            <Link href="/africa-2050" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Agenda 2063
            </Link>
            <Link href="/developer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Developer
            </Link>
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
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center gap-6 py-20">
            <Badge variant="secondary" className="text-sm px-4 py-1">
              Pan-African Knowledge, Open to All
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Wisdom
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl leading-relaxed">
              Africa&apos;s greatest thinkers, writers, and fighters. One library.
            </p>
            <p className="text-base text-muted-foreground max-w-2xl">
              {totalWorks}+ works spanning every region, era, and language — available as an API, an MCP server, or a conversation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link href="/browse">
                <Button size="lg" className="gap-2 text-base px-8 py-6">
                  <Library className="h-5 w-5" />
                  Explore the Archive
                </Button>
              </Link>
              <Link href="/ask">
                <Button size="lg" variant="outline" className="gap-2 text-base px-8 py-6">
                  <MessageSquare className="h-5 w-5" />
                  Get Wisdom
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground mt-2">
              <span>{totalWorks}+ Works</span>
              <span>·</span>
              <span>21 Themes</span>
              <span>·</span>
              <span>200+ Authors</span>
              <span>·</span>
              <span>Open Source</span>
            </div>
          </div>
        </div>

        {/* Feature 1: The Archive */}
        <div className="bg-muted/30 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <Library className="h-6 w-6 text-primary" />
                  <Badge variant="outline">The Archive</Badge>
                </div>
                <h2 className="text-4xl font-bold">
                  {totalWorks}+ Works, Every Region
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  West Africa, East Africa, North Africa, the Caribbean, and the diaspora. Fiction, poetry,
                  theory, memoir. From pre-colonial oral epics to contemporary novels. Arabic, Swahili,
                  Portuguese, French, and English.
                </p>
                <Link href="/browse">
                  <Button variant="outline" className="w-fit gap-2">
                    Browse the Archive <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Archive Preview */}
              <Card className="bg-background border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Library className="h-5 w-5" />
                    Sample from the Archive
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {displayWorks.map((work) => (
                    <div key={work.id} className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm leading-tight">{work.title}</h4>
                        <Badge variant="secondary" className="text-[10px] shrink-0">
                          {work.yearPublished}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{work.author}</p>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-[10px]">{work.region}</Badge>
                        <Badge variant="outline" className="text-[10px]">{work.genre}</Badge>
                      </div>
                    </div>
                  ))}
                  <div className="text-center pt-2">
                    <span className="text-sm text-muted-foreground">
                      + {totalWorks - 4} more works
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Feature 2: Get Wisdom */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  <Badge variant="outline">Get Wisdom</Badge>
                </div>
                <h2 className="text-4xl font-bold">
                  Get Wisdom
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  An AI librarian trained on the archive. Ask for reading recommendations, explore themes,
                  or get deep context on any work or author.
                </p>
                <Link href="/ask">
                  <Button variant="outline" className="w-fit gap-2">
                    Start a conversation <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Chat preview */}
              <Card className="bg-background border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Wisdom
                  </CardTitle>
                  <CardDescription>Powered by Claude · Searches {totalWorks}+ works</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-muted/50 rounded-lg px-4 py-3 text-sm max-w-xs ml-auto text-right">
                    Recommend 3 works on decolonization from East Africa
                  </div>
                  <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 text-sm space-y-2">
                    <p>Here are three essential East African works on decolonization:</p>
                    <p>1. <strong>Ngũgĩ wa Thiong&apos;o</strong> — <em>Decolonising the Mind</em> (Kenya, 1986) — a foundational argument for writing in African languages</p>
                    <p>2. <strong>Frantz Fanon</strong> — <em>The Wretched of the Earth</em> (1961) — the psychology and politics of colonial liberation</p>
                    <p>3. <strong>Okot p&apos;Bitek</strong> — <em>Song of Lawino</em> (Uganda, 1966) — cultural identity and resistance through Acholi oral tradition</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Feature 3: Agenda 2063 Tracker */}
        <div className="bg-muted/30 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Aspiration list */}
              <Card className="bg-background border-primary/20 order-2 lg:order-1">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    The 7 Aspirations
                  </CardTitle>
                  <CardDescription>African Union Agenda 2063 framework</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: "A Prosperous Africa", color: "bg-emerald-500", status: "On Track" },
                    { label: "An Integrated Continent", color: "bg-amber-500", status: "At Risk" },
                    { label: "Good Governance", color: "bg-amber-500", status: "At Risk" },
                    { label: "A Peaceful Africa", color: "bg-red-500", status: "Behind" },
                    { label: "Strong Cultural Identity", color: "bg-emerald-500", status: "On Track" },
                    { label: "People-Driven Development", color: "bg-amber-500", status: "At Risk" },
                    { label: "Africa as a Global Player", color: "bg-emerald-500", status: "On Track" },
                  ].map(({ label, color, status }) => (
                    <div key={label} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className={`inline-block w-2.5 h-2.5 rounded-full shrink-0 ${color}`} />
                        <span className="text-sm">{label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{status}</span>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground pt-3 border-t leading-relaxed">
                    Baselines and targets from official AU sources. Current figures are projections based on
                    published trends — not live data feeds.
                  </p>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-6 order-1 lg:order-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <Badge variant="outline">Agenda 2063</Badge>
                </div>
                <h2 className="text-4xl font-bold">
                  Tracking Africa&apos;s 2063 Goals
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  The African Union&apos;s Agenda 2063 sets targets across 7 aspirations. This dashboard tracks
                  progress against real 2013 baselines and 2063 targets — poverty, education, health,
                  governance, energy, trade, and gender equality.
                </p>
                <Link href="/africa-2050">
                  <Button variant="outline" className="w-fit gap-2">
                    View the Dashboard <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 4 (full width): Wisdom MCP */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <Card className="bg-background border-primary/20">
              <CardContent className="pt-8 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-2">
                      <Code2 className="h-6 w-6 text-primary" />
                      <Badge variant="outline">Wisdom MCP</Badge>
                    </div>
                    <h2 className="text-4xl font-bold">
                      Plug Wisdom into Any AI App
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Wisdom is available as an MCP server. Add it to Claude Desktop, Claude Code, or
                      Cursor and your AI assistant gets instant access to the full library.
                    </p>
                    <Link href="/developer">
                      <Button variant="outline" className="w-fit gap-2">
                        Developer Docs <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  {/* Claude Desktop config block */}
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground font-medium">claude_desktop_config.json</p>
                    <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto text-xs">{`{
  "mcpServers": {
    "wisdom": {
      "command": "npx",
      "args": [
        "-y",
        "wisdom-mcp"
      ]
    }
  }
}`}</pre>
                    <p className="text-xs text-muted-foreground">
                      7 tools available via MCP: search works, get work details, browse by theme, get reading
                      lists, explore authors, and more.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="border-y bg-muted/20 py-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: `${totalWorks}+`, label: "Works" },
                { value: "21", label: "Themes" },
                { value: "6", label: "Reading Lists" },
                { value: "7", label: "Tools via MCP" },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="text-3xl font-bold">{value}</span>
                  <span className="text-sm text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-semibold">Wisdom</span>
              <span className="text-sm text-muted-foreground">· Pan-African Library · Open Source (MIT)</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/browse" className="hover:text-foreground transition-colors">Archive</Link>
              <Link href="/ask" className="hover:text-foreground transition-colors">Get Wisdom</Link>
              <Link href="/africa-2050" className="hover:text-foreground transition-colors">Agenda 2063</Link>
              <a
                href="https://github.com/seathemc/pan-african-library"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                GitHub
              </a>
              <Link href="/developer" className="hover:text-foreground transition-colors">Developer</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
