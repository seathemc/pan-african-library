import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, BookOpen } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export const metadata = {
  title: "Manifesto · Wisdom",
  description:
    "AI has an Africa problem. We are the answer that ships. 5,000 years of African wisdom, one MCP.",
}

export default function ManifestoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="size-4" />
            </div>
            <span className="font-semibold text-lg">Wisdom</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/developer" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Developer
            </Link>
            <ThemeToggle />
            <a href="/whitepaper.pdf" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                Whitepaper PDF
              </Button>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        {/* Marker */}
        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-8">
          Manifesto · v0.1
        </p>

        {/* Lede */}
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-8">
          Africa knows.
          <br />
          <span className="text-muted-foreground">It has always known.</span>
        </h1>

        {/* Prominent CTA — above the fold */}
        <div className="flex flex-col sm:flex-row gap-3 mb-16 pb-12 border-b">
          <Link href="/developer">
            <Button size="lg" className="gap-2">
              Get the MCP
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a href="/whitepaper.pdf" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Read the whitepaper
            </Button>
          </a>
        </div>

        {/* Body */}
        <div className="text-lg md:text-xl leading-relaxed space-y-10 font-light">

          <section className="space-y-2">
            <p>Before the printing press, the griot.</p>
            <p>Before the algorithm, the elder.</p>
            <p>Before the archive, the memory carried in the body and passed in the voice.</p>
            <p className="pt-1">Carthage knew. Kush knew. Mali knew. Axum knew.</p>
            <p>Great Zimbabwe knew. Timbuktu knew. The Nile Valley knew.</p>
            <p className="pt-1 font-normal">
              Five thousand years of mathematics, philosophy, astronomy, navigation, law, literature, and prayer.
            </p>
            <p className="font-normal">This is the inheritance.</p>
          </section>

          <section className="space-y-3">
            <p>Imagine a child in Lagos asking her tablet a question about her people, and getting back her people.</p>
            <p>Imagine a researcher in Dakar finding the corpus she would have spent a decade building, already structured and searchable.</p>
            <p>Imagine a developer in Nairobi shipping an education tool on Tuesday because the knowledge layer was a one-line install on Monday.</p>
            <p>Imagine a lab that cannot release a frontier model without first passing an African knowledge benchmark.</p>
            <p className="font-normal">Imagine a century in which Africa is not the footnote. Africa is the source.</p>
            <p className="font-normal">That is what we are building toward.</p>
          </section>

          <section className="space-y-2">
            <p className="font-normal">Now, the truth.</p>
            <p className="pt-1">You ask the machine a question about Africa.</p>
            <p>It gives you back a Wikipedia paragraph, a paywall, or a guess.</p>
            <p className="pt-1 font-normal">That is not knowledge. That is absence with confidence.</p>
            <p className="font-normal">The machine does not know because the machine was not built to know.</p>
            <p className="pt-1">The tools that will define this century are being built right now, on what was easy to scrape.</p>
            <p className="font-normal">What is easy to scrape is not what is true.</p>
          </section>

          <section className="space-y-2">
            <p className="font-normal">So.</p>
            <p className="pt-1">We are not waiting.</p>
            <p>We are not asking.</p>
            <p>We are not petitioning.</p>
            <p className="font-normal pt-1">We are building.</p>
          </section>

          <section className="space-y-6">
            <p className="font-normal">Wisdom is what we built.</p>

            <p>
              In most African traditions, wisdom is not the same as knowledge.
              Knowledge is accumulated. Wisdom is synthesized — it's what you arrive at when you
              understand where something came from, where it stands, and where it is going.
              That is what Wisdom the tool is designed to give you, in three connected parts.
            </p>

            <div className="space-y-6 pl-4 border-l border-border">
              <div>
                <p className="font-normal mb-2">Past — The Archive.</p>
                <p>
                  The written and oral record of African thought across centuries. Novels, poems,
                  political philosophy, speeches, manifestos, science fiction — from every region,
                  era, and language. Pre-colonial oral tradition through contemporary theory.
                  Full-text searchable, filterable, structured for AI consumption. This is where
                  wisdom starts: in knowing what was thought, written, imagined, and believed
                  before you arrived.
                </p>
              </div>

              <div>
                <p className="font-normal mb-2">Present — The Dashboard.</p>
                <p>
                  The African Union's Agenda 2063 is the continent's fifty-year development
                  blueprint — seven aspirations covering prosperity, governance, peace, and
                  cultural identity, tracked across all 55 member states. Wisdom surfaces that
                  data as a live, queryable layer. Not a PDF. A structured surface any AI can
                  reason over. Because before you can chart a course forward, you need an honest
                  reading of where you actually are.
                </p>
              </div>

              <div>
                <p className="font-normal mb-2">Future — The Forecast.</p>
                <p>
                  Trend projections built on those same indicators. Where is Africa heading on
                  infrastructure, on economic convergence, on education, on governance? The
                  thinkers in the archive imagined a future. The dashboard shows whether the
                  present is tracking toward it. The forecast shows what the data actually
                  suggests — not what anyone wishes it would say.
                </p>
              </div>
            </div>

            <p>
              Three tools, one server, one command. But more than that: a single temporal system.
              The past gives you the foundation. The present gives you the reality. The future gives
              you the direction. Taken together, you don't just have information about Africa.
              You have wisdom about it.
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
            <p>This is not a database.</p>
            <p>This is not a chatbot.</p>
            <p>This is not a search engine.</p>
            <p className="font-normal">
              This is infrastructure for a continent that should never have had to ask permission to be indexed.
            </p>
            <p className="font-normal">We are going to make the truth easy to scrape.</p>
          </section>

          <section className="pt-2">
            <p className="text-2xl md:text-3xl font-semibold tracking-tight">
              5,000 years of African wisdom. One MCP. Plug in.
            </p>
          </section>
        </div>

        <footer className="mt-20 pt-8 border-t text-sm text-muted-foreground flex flex-col sm:flex-row gap-2 sm:justify-between">
          <p>Wisdom · pan-african-library</p>
          <a
            href="https://github.com/seathemc/pan-african-library"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            github.com/seathemc/pan-african-library
          </a>
        </footer>
      </main>
    </div>
  )
}
