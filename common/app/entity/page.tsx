import Link from "next/link";
import { getClauses } from "@/lib/data";

export const metadata = { title: "Pan-African Startup Entity — Common" };

export default function EntityIndex() {
  const clauses = getClauses();

  return (
    <section className="container-prose py-20">
      <div className="text-xs uppercase tracking-widest text-[color:var(--accent)]">
        Industry layer · Open-source
      </div>
      <h1 className="mt-2 text-3xl md:text-5xl tracking-tight">
        The Pan-African Startup Entity.
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-[color:var(--muted)]">
        A growing library of model corporate clauses — multi-class shares, ESOP, SAFE, convertible notes,
        cross-border registration — drafted in parallel for <strong className="text-foreground">both common-law
        and OHADA / civil-law</strong> jurisdictions. Adopt today via private contract, even before national
        recognition catches up. (This is exactly how the French SAS became dominant.)
      </p>

      <div className="mt-10 p-5 border hairline text-sm leading-relaxed">
        <strong>v0.1 — community review.</strong> These are reference templates, not legal advice.
        We're partnering with African law firms to harden each clause; pull requests and clause-by-clause
        annotations are welcome.
      </div>

      <h2 className="mt-16 text-sm uppercase tracking-widest text-[color:var(--muted)]">
        Available clauses
      </h2>
      <ul className="mt-6 grid gap-6">
        {clauses.map((c) => (
          <li key={c.slug} className="border hairline p-6">
            <div className="text-xs uppercase tracking-widest text-[color:var(--muted)]">
              {c.category}
            </div>
            <h3 className="mt-2 text-2xl tracking-tight">
              <Link href={`/entity/${c.slug}`} className="no-underline">{c.title}</Link>
            </h3>
            <p className="mt-3 text-[color:var(--muted)] leading-relaxed">{c.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {c.versions.map((v) => (
                <span key={v.tradition} className="border hairline rounded-full px-3 py-1">
                  {v.label}
                </span>
              ))}
            </div>
            <Link href={`/entity/${c.slug}`} className="mt-5 inline-block text-sm">
              Read clause →
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-20 text-sm uppercase tracking-widest text-[color:var(--muted)]">Roadmap</h2>
      <ul className="mt-4 space-y-2 text-[color:var(--muted)] leading-relaxed list-disc list-inside">
        <li>Standardised ESOP grant + vesting documents (common-law &amp; OHADA)</li>
        <li>Convertible note (priced &amp; unpriced)</li>
        <li>Founder share vesting + cliff agreement</li>
        <li>Cross-border holding structure recipes (Mauritius, Cayman, plus PASE-native)</li>
        <li>Data processing addendum aligned with the AU Convention on Cyber Security &amp; Personal Data Protection</li>
      </ul>
    </section>
  );
}
