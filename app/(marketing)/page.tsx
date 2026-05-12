import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllWorks } from "@/lib/literature-data";
import { BookOpen, TrendingUp, Github, ArrowRight, Sparkles, Library, BarChart3, MessageSquare, Tag, ListOrdered } from "lucide-react";

export default function LandingPage() {
  const allWorks = getAllWorks();
  const totalWorks = allWorks.length;

  // Get sample works for preview — spread across regions
  const sampleWorks = allWorks.filter(w =>
    ['Things Fall Apart','Season of Migration to the North','Song of Lawino','Kindred'].includes(w.title)
  ).slice(0, 4);
  const displayWorks = sampleWorks.length === 4 ? sampleWorks : allWorks.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="size-4" />
            </div>
            <span className="font-semibold text-lg">Alexandria</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/browse" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Archive
            </Link>
            <Link href="/ask" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Ask Alexandria
            </Link>
            <Link href="/africa-2050" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Africa 2063
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
              Building Pan-African Optimism
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Alexandria
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl leading-relaxed">
              We&apos;re reviving pan-African thought and making it accessible. Over {totalWorks} works from
              Frederick Douglass to Chimamanda Ngozi Adichie. From Nkrumah to Sankara. All in one place—open
              source, permanent, and free. This is how we build optimism for the pan-African future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Link href="/browse">
                <Button size="lg" className="gap-2 text-base px-8 py-6">
                  <Library className="h-5 w-5" />
                  Explore the Archive
                </Button>
              </Link>
              <Link href="/ask">
                <Button size="lg" variant="outline" className="gap-2 text-base px-8 py-6">
                  <MessageSquare className="h-5 w-5" />
                  Ask Alexandria
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
              <Github className="h-4 w-4" />
              <span>100% Open Source • Community-Driven • Permanent</span>
            </div>
          </div>
        </div>

        {/* Feature 1: The Past - Left Text, Right UI */}
        <div className="bg-muted/30 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <Badge variant="outline">The Past</Badge>
                </div>
                <h2 className="text-4xl font-bold">
                  {totalWorks}+ Works, One Archive
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  The ancient Library of Alexandria was lost. Timbuktu&apos;s manuscripts were scattered.
                  Colonial powers erased histories. We&apos;re collecting everything—every speech, every essay,
                  every manifesto—into one digital archive that can never be destroyed.
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    Foundational texts: Wheatley, Douglass, Du Bois
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    African independence: Nkrumah, Sankara, Nyerere
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    Caribbean thought: C.L.R. James, Fanon, Eric Williams
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    Contemporary voices: Coates, Adichie, Moten
                  </li>
                </ul>
                <Link href="/browse">
                  <Button variant="outline" className="w-fit gap-2">
                    Browse the Archive <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Archive Preview - Show actual works */}
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

        {/* Feature 2: Ask Alexandria AI */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  <Badge variant="outline">Ask Alexandria</Badge>
                </div>
                <h2 className="text-4xl font-bold">
                  Your AI Guide to the Archive
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Ask Alexandria is an AI librarian with deep knowledge of every work in the archive.
                  Ask it to recommend books by theme, find works from a specific era, or explain a
                  concept in pan-African thought. It searches, retrieves, and synthesizes—in plain language.
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    &ldquo;What should I read to understand Negritude?&rdquo;
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    &ldquo;Find African women writers from East Africa&rdquo;
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    &ldquo;Curate a reading list on decolonization&rdquo;
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    &ldquo;What connects Fanon, Cabral, and Biko?&rdquo;
                  </li>
                </ul>
                <Link href="/ask">
                  <Button variant="outline" className="w-fit gap-2">
                    Try Ask Alexandria <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Chat preview */}
              <Card className="bg-background border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Alexandria
                  </CardTitle>
                  <CardDescription>Powered by Claude · Searches 368+ works</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-muted/50 rounded-lg px-4 py-3 text-sm max-w-xs ml-auto text-right">
                    Recommend a reading list on pan-African feminism
                  </div>
                  <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 text-sm space-y-2">
                    <p>I&apos;d suggest starting with these essential works:</p>
                    <p>1. <strong>Ama Ata Aidoo</strong> — <em>Changes</em> (Ghana, 1991) — love, work, and what women owe themselves</p>
                    <p>2. <strong>Buchi Emecheta</strong> — <em>Second-Class Citizen</em> (Nigeria/UK) — immigrant life and female survival</p>
                    <p>3. <strong>Nawal El Saadawi</strong> — <em>Woman at Point Zero</em> (Egypt) — the politics of the female body</p>
                  </div>
                  <div className="flex gap-2 flex-wrap pt-1">
                    <Badge variant="secondary" className="text-xs">Themes</Badge>
                    <Badge variant="secondary" className="text-xs">Reading Lists</Badge>
                    <Badge variant="secondary" className="text-xs">Search</Badge>
                    <Badge variant="secondary" className="text-xs">Work Detail</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Feature 3: Themes & Reading Lists */}
        <div className="bg-muted/30 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3">Explore by Theme or Curated Path</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                21 thematic categories and 6 curated reading lists give you structured entry points into the archive.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-background">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Tag className="h-5 w-5 text-primary" />
                    Thematic Index
                  </CardTitle>
                  <CardDescription>Browse works by cross-cutting ideas and movements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['Decolonization','Pan-Africanism','Afrofuturism','Feminism','Resistance','Identity','Slavery','Oral Tradition'].map(t => (
                      <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                    ))}
                    <Badge variant="secondary" className="text-xs">+13 more</Badge>
                  </div>
                  <Link href="/themes">
                    <Button variant="outline" size="sm" className="gap-2 w-full">
                      Browse All Themes <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              <Card className="bg-background">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ListOrdered className="h-5 w-5 text-primary" />
                    Curated Reading Lists
                  </CardTitle>
                  <CardDescription>Structured paths through the archive</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2 mb-4 text-sm text-muted-foreground">
                    {['Foundations of African Literature','The Harlem Renaissance','African Feminist Voices','Pan-Africanism & Independence','Afrofuturism','Civil Rights & Black Power'].map(l => (
                      <div key={l} className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                        {l}
                      </div>
                    ))}
                  </div>
                  <Link href="/reading-lists">
                    <Button variant="outline" size="sm" className="gap-2 w-full">
                      View Reading Lists <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Feature 4: The Future - Left UI, Right Text */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Mini Charts Preview */}
              <Card className="bg-background border-primary/20 order-2 lg:order-1">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Agenda 2063 Projections
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Mini Bar Chart - Population */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium">Population Growth</div>
                    <div className="flex items-end gap-1 h-16">
                      <div className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-blue-500/20 rounded-t" style={{height: '40%'}}></div>
                        <span className="text-[10px] text-muted-foreground">2024</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-blue-500/40 rounded-t" style={{height: '60%'}}></div>
                        <span className="text-[10px] text-muted-foreground">2030</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-blue-500/60 rounded-t" style={{height: '80%'}}></div>
                        <span className="text-[10px] text-muted-foreground">2040</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-blue-500 rounded-t" style={{height: '100%'}}></div>
                        <span className="text-[10px] text-muted-foreground">2050</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground text-center">1.46B → 2.49B</div>
                  </div>

                  {/* Mini Line Chart - GDP */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium">GDP Growth (Trillions USD)</div>
                    <div className="relative h-12 bg-muted/30 rounded">
                      <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                        <polyline
                          fill="none"
                          stroke="#8b5cf6"
                          strokeWidth="2"
                          points="0,35 25,30 50,22 75,14 100,5"
                        />
                      </svg>
                    </div>
                    <div className="text-xs text-muted-foreground text-center">$2.96T → $4.5T</div>
                  </div>

                  {/* Mini Progress Bars - Key Metrics */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Electricity Access</span>
                        <span className="font-medium">95%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{width: '95%'}}></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Internet Penetration</span>
                        <span className="font-medium">75%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500 rounded-full" style={{width: '75%'}}></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Renewable Energy</span>
                        <span className="font-medium">60%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{width: '60%'}}></div>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    <p><strong>Sources:</strong> UN Population Division, IMF World Economic Outlook, IEA Africa Energy Outlook, World Bank</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-6 order-1 lg:order-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <Badge variant="outline">The Future</Badge>
                </div>
                <h2 className="text-4xl font-bold">
                  Data-Driven Optimism
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Pan-African optimism isn&apos;t wishful thinking—it&apos;s rooted in data. We&apos;ve compiled
                  projections from the UN, World Bank, IMF, WHO, and IEA into one dashboard.
                  116 metrics showing Africa&apos;s trajectory through 2050. Population, economy, energy,
                  health, education, and digital transformation—all visualized.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  <strong>Why we built this:</strong> Because the narrative about Africa&apos;s future is often
                  told by others. These are the facts, from authoritative sources, showing what&apos;s actually
                  happening. The data tells a story of transformation.
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    +1 billion people by 2050, youngest continent
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    GDP doubles to $4.5 trillion
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    900 million middle class (36% of population)
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    Life satisfaction: 54% → 76%
                  </li>
                </ul>
                <Link href="/africa-2050">
                  <Button variant="outline" className="w-fit gap-2">
                    View All Projections <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-muted/30 py-20">
          <div className="max-w-4xl mx-auto px-6">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-3xl">Building in the Present</CardTitle>
                <CardDescription className="text-base leading-relaxed pt-4 max-w-3xl mx-auto">
                  This is an open source project. Every work catalogued, every chart rendered, every line
                  of code—it&apos;s all public. Fork it. Host it. Build on it. We&apos;re not just preserving
                  pan-African thought; we&apos;re building the infrastructure for a new wave of pan-African
                  optimism. The past informs us. The future inspires us. We build in the present.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col items-center text-center gap-8">
              <h3 className="text-3xl font-bold">Ready to explore?</h3>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Dive into the archive or visualize Africa&apos;s future. This is pan-African knowledge,
                open to all.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/browse">
                  <Button size="lg" className="gap-2 px-8">
                    <Library className="h-5 w-5" />
                    Enter the Archive
                  </Button>
                </Link>
                <Link href="/ask">
                  <Button size="lg" variant="outline" className="gap-2 px-8">
                    <MessageSquare className="h-5 w-5" />
                    Ask Alexandria
                  </Button>
                </Link>
                <Link href="/africa-2050">
                  <Button size="lg" variant="outline" className="gap-2 px-8">
                    <BarChart3 className="h-5 w-5" />
                    Africa 2063
                  </Button>
                </Link>
              </div>
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
              <span className="font-semibold">Alexandria</span>
              <span className="text-sm text-muted-foreground">• Pan-African Library</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Open Source (MIT)</span>
              <span>•</span>
              <a href="https://github.com/seathemc/pan-african-library" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
