import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getActs } from "@/lib/data";

export const revalidate = 60;

export default async function HomePage() {
  const [signatoryCount, recent] = await Promise.all([
    safeCount(),
    safeRecent(),
  ]);
  const acts = getActs();
  const enacted = acts.filter((a) => a.status === "enacted").length;
  const drafting = acts.filter((a) => a.status === "in-development").length;

  return (
    <>
      {/* Hero */}
      <section className="container-prose pt-20 pb-16">
        <p className="text-sm uppercase tracking-widest text-[color:var(--muted)]">
          A movement for a single African digital market
        </p>
        <h1 className="mt-6 text-4xl md:text-6xl leading-[1.05] tracking-tight">
          One legal architecture for {acts.length} African startup acts.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-[color:var(--muted)]">
          Africa's internet economy is projected to reach <strong className="text-foreground">$712B by 2050</strong>.
          {" "}
          {enacted} countries have enacted startup acts. {drafting} more are drafting one.
          Together they cover 75–78% of African GDP — but each one operates as an island.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-[color:var(--muted)]">
          <strong className="text-foreground">Common</strong> is a movement to integrate them: a Pan-African Startup Entity
          founders can adopt today, a Startup Passport for cross-border recognition, surgical reforms to national codes,
          and an enhanced AU Model Law.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/sign"
            className="no-underline rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:opacity-90"
          >
            Sign the manifesto
          </Link>
          <Link href="/acts" className="no-underline text-sm">
            See the {acts.length} acts →
          </Link>
        </div>
        <p className="mt-6 text-sm text-[color:var(--muted)]">
          {signatoryCount === null
            ? "Signatory count unavailable until the database is connected."
            : `${signatoryCount.toLocaleString()} signatories so far.`}
        </p>
      </section>

      {/* The four pillars */}
      <section className="border-t hairline">
        <div className="container-wide py-20">
          <h2 className="text-sm uppercase tracking-widest text-[color:var(--muted)]">The four pillars</h2>
          <div className="mt-10 grid md:grid-cols-2 gap-x-12 gap-y-12">
            <Pillar
              tag="Industry"
              title="Pan-African Startup Entity (PASE)"
              body="A standardised corporate template — multi-class shares, ESOP, SAFE-recognition — usable today via private contract in both common-law and OHADA jurisdictions. Drawing on the playbook of EU-Inc and the French SAS."
              cta={{ href: "/entity", label: "See the clause library" }}
            />
            <Pillar
              tag="Regional"
              title="Startup Passport"
              body="Mutual recognition between countries. Get labelled once at home; operate across the region. Building on the Ghana–Rwanda Fintech Passport (Feb 2025) — Africa's first."
              cta={{ href: "/acts", label: "See passport coverage" }}
            />
            <Pillar
              tag="National"
              title="Surgical code fixes"
              body="Targeted amendments to corporate, securities, tax, forex and labour codes — three to five precise edits per country, supported by digital implementation rails (APIs between government agencies)."
              cta={{ href: "/acts", label: "Country-by-country gaps" }}
            />
            <Pillar
              tag="Continental"
              title="Enhanced AU Model Law"
              body="The AU shipped a Model Law on Startup Promotion in July 2024. Common proposes implementation specifications: standard term sheets, API standards, passport protocols, and industry classification aligned with Agenda 2063."
              cta={{ href: "/", label: "Coming soon" }}
            />
          </div>
        </div>
      </section>

      {/* Why this matters */}
      <section className="border-t hairline">
        <div className="container-prose py-20">
          <h2 className="text-sm uppercase tracking-widest text-[color:var(--muted)]">Why now</h2>
          <div className="mt-8 space-y-6 text-lg leading-relaxed">
            <p>
              <strong>83% of growth-stage African startups use offshore structures</strong> — not for tax avoidance,
              but because African legal systems can't accommodate multi-class shares, SAFEs, and modern ESOPs.
              These workarounds consume <strong>15–20% of operational budgets</strong> that should fund product.
            </p>
            <p>
              <strong>Less than 5% of seed-stage African startups reach Series A.</strong> Fragmented regulation is
              one reason: a fintech approved in Nigeria must reapply separately in Ghana despite essentially identical
              operations. Months are lost. Capital is burned.
            </p>
            <p>
              The window is narrow. <strong>The decisions made in the next 2–3 years</strong> will determine whether
              Africa creates 54 fragmented markets or one integrated digital economy. The legal infrastructure
              already exists — ECOWAS, OHADA, EAC, the AU Model Law, the Ghana–Rwanda passport. It just needs
              to be connected.
            </p>
          </div>
        </div>
      </section>

      {/* Recent signatories */}
      {recent && recent.length > 0 && (
        <section className="border-t hairline">
          <div className="container-wide py-20">
            <h2 className="text-sm uppercase tracking-widest text-[color:var(--muted)]">Recent signatories</h2>
            <ul className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recent.map((s) => (
                <li key={s.id} className="border hairline p-5">
                  <div className="font-medium">{s.name}</div>
                  <div className="text-sm text-[color:var(--muted)]">
                    {[s.role, s.organization, s.country].filter(Boolean).join(" · ")}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link href="/signatories" className="text-sm">
                See all signatories →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="border-t hairline">
        <div className="container-prose py-24 text-center">
          <h2 className="text-3xl md:text-4xl tracking-tight">
            If you're building, investing, advising, or legislating in Africa — sign.
          </h2>
          <p className="mt-6 text-[color:var(--muted)]">
            Founders, investors, in-house counsels, policymakers. Add your name. Make the case for one architecture.
          </p>
          <div className="mt-10">
            <Link
              href="/sign"
              className="no-underline rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:opacity-90"
            >
              Sign the manifesto
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Pillar({
  tag,
  title,
  body,
  cta,
}: {
  tag: string;
  title: string;
  body: string;
  cta: { href: string; label: string };
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-[color:var(--accent)]">{tag}</div>
      <h3 className="mt-2 text-2xl tracking-tight">{title}</h3>
      <p className="mt-3 text-[color:var(--muted)] leading-relaxed">{body}</p>
      <Link href={cta.href} className="mt-4 inline-block text-sm">
        {cta.label} →
      </Link>
    </div>
  );
}

async function safeCount(): Promise<number | null> {
  try {
    return await prisma.signatory.count({ where: { showPublicly: true } });
  } catch {
    return null;
  }
}

async function safeRecent() {
  try {
    return await prisma.signatory.findMany({
      where: { showPublicly: true },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { id: true, name: true, role: true, organization: true, country: true },
    });
  } catch {
    return null;
  }
}
