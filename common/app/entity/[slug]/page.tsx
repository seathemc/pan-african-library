import Link from "next/link";
import { notFound } from "next/navigation";
import { getClauseBySlug, getClauses } from "@/lib/data";
import { readClauseMarkdown, renderMarkdown } from "@/lib/content";

export function generateStaticParams() {
  return getClauses().map((c) => ({ slug: c.slug }));
}

export default async function ClausePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tradition?: string }>;
}) {
  const { slug } = await params;
  const { tradition } = await searchParams;
  const clause = getClauseBySlug(slug);
  if (!clause) notFound();

  const selected =
    clause.versions.find((v) => v.tradition === tradition) ?? clause.versions[0];
  const md = readClauseMarkdown(selected.file);
  const html = renderMarkdown(md);

  return (
    <section className="container-prose py-16">
      <Link href="/entity" className="text-sm">← Clause library</Link>

      <div className="mt-6 text-xs uppercase tracking-widest text-[color:var(--accent)]">
        {clause.category}
      </div>
      <h1 className="mt-2 text-3xl md:text-4xl tracking-tight">{clause.title}</h1>
      <p className="mt-4 text-[color:var(--muted)] leading-relaxed">{clause.summary}</p>

      {clause.addresses && clause.addresses.length > 0 && (
        <div className="mt-8 border hairline p-5">
          <div className="text-xs uppercase tracking-widest text-[color:var(--muted)]">
            Addresses these specific barriers
          </div>
          <ul className="mt-3 space-y-1.5 text-sm list-disc list-inside">
            {clause.addresses.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-2">
        {clause.versions.map((v) => {
          const active = v.tradition === selected.tradition;
          return (
            <Link
              key={v.tradition}
              href={`/entity/${clause.slug}?tradition=${v.tradition}`}
              className={
                "no-underline rounded-full px-4 py-1.5 text-sm border hairline " +
                (active ? "bg-foreground text-background" : "")
              }
            >
              {v.label}
            </Link>
          );
        })}
      </div>

      <article
        className="prose prose-neutral mt-10 max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <div className="mt-16 border-t hairline pt-6 text-sm text-[color:var(--muted)]">
        Found an issue or have a better drafting? Open a PR on GitHub or{" "}
        <Link href="/sign">sign as counsel</Link> to join the review group.
      </div>
    </section>
  );
}
