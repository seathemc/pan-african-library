import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, BookOpen } from "lucide-react"

export const metadata = {
  title: "Manifesto · Wisdom",
  description:
    "AI has an Africa problem. We are the answer that ships. 5,000 years of African wisdom, one MCP.",
}

export default function ManifestoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Minimal header */}
      <header className="border-b">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="size-4" />
            </div>
            <span className="font-semibold text-lg">Wisdom</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/developer" className="text-muted-foreground hover:text-foreground transition-colors">
              Developer
            </Link>
            <a
              href="/whitepaper.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
            >
              <FileText className="h-3.5 w-3.5" />
              Whitepaper
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-20 md:py-28">
        {/* Marker */}
        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-10">
          Manifesto · v0.1
        </p>

        {/* Lede */}
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-12">
          AI has an Africa problem.
          <br />
          <span className="text-muted-foreground">We are the answer that ships.</span>
        </h1>

        {/* Body — manifesto stanzas */}
        <div className="text-lg md:text-xl leading-relaxed space-y-10 font-light">
          <section className="space-y-2">
            <p>You ask the machine a question about Africa.</p>
            <p>It gives you back a Wikipedia paragraph.</p>
            <p>It gives you a paywall.</p>
            <p>It gives you a guess.</p>
            <p className="font-normal">That is not knowledge. That is absence with confidence.</p>
          </section>

          <section className="space-y-2">
            <p>The knowledge is not missing.</p>
            <p>The knowledge has been here for five thousand years.</p>
            <p>Carthage knew. Kush knew. Mali knew. Axum knew.</p>
            <p>Great Zimbabwe knew. The Nile Valley knew.</p>
            <p>The griot knew. The elder knew. The scholar in Timbuktu knew.</p>
            <p className="font-normal">The machine does not know because the machine was not built to know.</p>
          </section>

          <section className="space-y-2">
            <p>Let us be clear about what this means.</p>
            <p>It means your child is being taught by a system that cannot teach her about herself.</p>
            <p>It means your students are being researched on by labs that do not read their work.</p>
            <p>It means your continent is being modeled by people who do not have the data.</p>
            <p className="font-normal">It means the next century is being written without you.</p>
          </section>

          <section className="space-y-2">
            <p>We are not waiting.</p>
            <p>We are not asking.</p>
            <p>We are not petitioning.</p>
            <p className="font-normal">We are building.</p>
          </section>

          <section className="space-y-4">
            <p className="font-normal">Wisdom is what we built.</p>
            <p>
              One server. One command. Five thousand years of African thought made readable to every machine
              that will shape the next hundred.
            </p>
            <p>
              Past — the archive. 368 works to start. The first deposit, not the archive.
            </p>
            <p>
              Present — the dashboard. Real African development data, the Agenda 2063 indicators, queryable
              by anyone who asks.
            </p>
            <p>
              Future — the forecast. Where the continent is going, said in the language the new tools speak.
            </p>
          </section>

          <section className="space-y-2">
            <p>If you build, plug in.</p>
            <p>If you research, plug in.</p>
            <p>If you teach, plug in.</p>
            <p>If you run a lab, plug in.</p>
            <p>If you keep an archive, contribute.</p>
            <p className="font-normal">If you do nothing, you have decided.</p>
          </section>

          <section className="space-y-2">
            <p>The tools that will define this century are being built right now.</p>
            <p>They are being built with what is easy to scrape.</p>
            <p>What is easy to scrape is not what is true.</p>
            <p className="font-normal">We are going to make the truth easy to scrape.</p>
          </section>

          <section className="space-y-2">
            <p>This is not a database.</p>
            <p>This is not a chatbot.</p>
            <p>This is not a search engine.</p>
            <p className="font-normal">
              This is infrastructure for a continent that should never have had to ask permission to be
              indexed.
            </p>
          </section>

          <section className="pt-2">
            <p className="text-2xl md:text-3xl font-semibold tracking-tight">
              5,000 years of African wisdom. One MCP. Plug in.
            </p>
          </section>
        </div>

        {/* CTA + whitepaper */}
        <div className="mt-16 pt-10 border-t flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/developer">
              <Button size="lg" className="gap-2 text-base">
                Get the MCP
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="/whitepaper.pdf" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="gap-2 text-base">
                <FileText className="h-4 w-4" />
                Read the whitepaper (PDF)
              </Button>
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            The whitepaper is a 3-page deeper read: what this unlocks, why the knowledge exists, what Wisdom
            ships in v0.1, and the roadmap to v0.3.
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t text-sm text-muted-foreground flex flex-col sm:flex-row gap-2 sm:justify-between">
          <p>Wisdom · pan-african-library</p>
          <p>
            <a
              href="https://github.com/seathemc/pan-african-library"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              github.com/seathemc/pan-african-library
            </a>
          </p>
        </footer>
      </main>
    </div>
  )
}
