import Link from "next/link";
import { notFound } from "next/navigation";
import { getActByIso, getActs } from "@/lib/data";

export function generateStaticParams() {
  return getActs().map((a) => ({ iso: a.iso.toLowerCase() }));
}

export default async function ActDetailPage({ params }: { params: Promise<{ iso: string }> }) {
  const { iso } = await params;
  const act = getActByIso(iso);
  if (!act) notFound();

  return (
    <section className="container-prose py-20">
      <Link href="/acts" className="text-sm">← All acts</Link>
      <div className="mt-6 text-xs uppercase tracking-widest text-[color:var(--accent)]">
        {act.status === "enacted" ? `Enacted · ${act.year}` : "In development"}
      </div>
      <h1 className="mt-2 text-3xl md:text-4xl tracking-tight">{act.country}</h1>
      <p className="mt-2 text-[color:var(--muted)]">
        {act.actName} · {act.region} · {act.rec}
      </p>

      <dl className="mt-12 grid grid-cols-2 gap-y-6 gap-x-8 text-sm">
        <Stat label="Age limit" value={act.ageLimit ? `${act.ageLimit} years` : "—"} />
        <Stat label="Labelling body" value={act.labelingBody ?? "—"} />
        <Stat label="Label" value={act.labelName ?? "—"} />
        <Stat label="Tax holiday" value={act.taxHoliday ?? "—"} />
        <Stat
          label="Automatic tax application"
          value={
            act.taxAutoApplied === null || act.taxAutoApplied === undefined
              ? "—"
              : act.taxAutoApplied
              ? "Yes"
              : "No — separate verification required"
          }
        />
      </dl>

      <div className="mt-12">
        <h2 className="text-sm uppercase tracking-widest text-[color:var(--muted)]">Known gaps</h2>
        <ul className="mt-4 space-y-3 list-disc list-inside text-[color:var(--foreground)] leading-relaxed">
          {act.knownGaps.map((g, i) => (
            <li key={i}>{g}</li>
          ))}
        </ul>
      </div>

      {act.notable && (
        <div className="mt-12 border-l-2 border-[color:var(--accent)] pl-4 italic text-[color:var(--muted)]">
          {act.notable}
        </div>
      )}

      <div className="mt-16 border-t hairline pt-10">
        <h2 className="text-sm uppercase tracking-widest text-[color:var(--muted)]">What Common proposes for {act.country}</h2>
        <p className="mt-4 text-[color:var(--muted)] leading-relaxed">
          A combination of <Link href="/entity">PASE clause adoption</Link> (immediate, contractual), bilateral{" "}
          Startup Passport agreements with neighbouring economies, and surgical amendments to address the
          gaps listed above. The detailed per-country recommendation engine is being built — see the{" "}
          <Link href="/">manifesto</Link>.
        </p>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[color:var(--muted)]">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}
