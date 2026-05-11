import Link from "next/link";
import { getActs } from "@/lib/data";

export const metadata = { title: "Africa's startup acts — Common" };

export default function ActsPage() {
  const acts = getActs();
  const enacted = acts.filter((a) => a.status === "enacted").sort((a, b) => (a.year ?? 0) - (b.year ?? 0));
  const drafting = acts.filter((a) => a.status === "in-development");

  return (
    <section className="container-wide py-20">
      <h1 className="text-3xl md:text-4xl tracking-tight">Africa's startup acts</h1>
      <p className="mt-4 max-w-2xl text-[color:var(--muted)] leading-relaxed">
        {acts.length} frameworks across the continent — covering 75–78% of African GDP. Independently drafted,
        structurally similar. The convergence is the opportunity.
      </p>

      <h2 className="mt-16 text-sm uppercase tracking-widest text-[color:var(--muted)]">
        Enacted ({enacted.length})
      </h2>
      <ActsTable acts={enacted} />

      <h2 className="mt-20 text-sm uppercase tracking-widest text-[color:var(--muted)]">
        In development ({drafting.length})
      </h2>
      <ActsTable acts={drafting} />

      <div className="mt-20 border-t hairline pt-10">
        <h2 className="text-sm uppercase tracking-widest text-[color:var(--muted)]">
          The convergence pattern
        </h2>
        <ul className="mt-6 grid md:grid-cols-2 gap-x-12 gap-y-4 text-[color:var(--muted)] leading-relaxed">
          <li><strong className="text-foreground">Age limits:</strong> all between 5 and 10 years (Tunisia 8, Nigeria 10, Senegal 8, DRC 7, Ivory Coast 8, Ethiopia 5).</li>
          <li><strong className="text-foreground">Labelling systems:</strong> all use certification, not new legal entities.</li>
          <li><strong className="text-foreground">Tax holidays:</strong> all promise them. None apply automatically on labelling.</li>
          <li><strong className="text-foreground">Oversight bodies:</strong> all create a dedicated authority (College of Startups, NCDIE, DER/FJ…).</li>
        </ul>
      </div>
    </section>
  );
}

function ActsTable({ acts }: { acts: ReturnType<typeof getActs> }) {
  return (
    <div className="mt-6 overflow-x-auto border hairline">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b hairline text-left text-[color:var(--muted)]">
            <th className="px-4 py-3 font-normal">Country</th>
            <th className="px-4 py-3 font-normal">Region / REC</th>
            <th className="px-4 py-3 font-normal">Year</th>
            <th className="px-4 py-3 font-normal">Age limit</th>
            <th className="px-4 py-3 font-normal">Labelling body</th>
            <th className="px-4 py-3 font-normal">Tax holiday</th>
            <th className="px-4 py-3 font-normal"></th>
          </tr>
        </thead>
        <tbody>
          {acts.map((a) => (
            <tr key={a.iso} className="border-b hairline last:border-b-0 hover:bg-black/[0.02]">
              <td className="px-4 py-3">
                <Link href={`/acts/${a.iso.toLowerCase()}`} className="no-underline font-medium">
                  {a.country}
                </Link>
              </td>
              <td className="px-4 py-3 text-[color:var(--muted)]">{a.region} · {a.rec}</td>
              <td className="px-4 py-3 text-[color:var(--muted)]">{a.year ?? "—"}</td>
              <td className="px-4 py-3 text-[color:var(--muted)]">{a.ageLimit ? `${a.ageLimit} yrs` : "—"}</td>
              <td className="px-4 py-3 text-[color:var(--muted)]">{a.labelingBody ?? "—"}</td>
              <td className="px-4 py-3 text-[color:var(--muted)]">{a.taxHoliday ?? "—"}</td>
              <td className="px-4 py-3 text-right">
                <Link href={`/acts/${a.iso.toLowerCase()}`} className="text-sm">Details →</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
