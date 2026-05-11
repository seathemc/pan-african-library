import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function SignatoriesPage() {
  let signatories: Array<{
    id: string;
    name: string;
    role: string;
    organization: string | null;
    country: string;
    message: string | null;
  }> = [];
  let dbAvailable = true;
  try {
    signatories = await prisma.signatory.findMany({
      where: { showPublicly: true },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, role: true, organization: true, country: true, message: true },
    });
  } catch {
    dbAvailable = false;
  }

  return (
    <section className="container-wide py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl tracking-tight">Signatories</h1>
          <p className="mt-2 text-[color:var(--muted)]">
            {dbAvailable
              ? `${signatories.length.toLocaleString()} people have signed.`
              : "Database not connected — signatory wall will populate once configured."}
          </p>
        </div>
        <Link
          href="/sign"
          className="no-underline rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium"
        >
          Add your name
        </Link>
      </div>

      {dbAvailable && signatories.length === 0 && (
        <p className="mt-16 text-[color:var(--muted)]">
          No public signatories yet. Be the first.
        </p>
      )}

      {dbAvailable && signatories.length > 0 && (
        <ul className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {signatories.map((s) => (
            <li key={s.id} className="border hairline p-5">
              <div className="font-medium">{s.name}</div>
              <div className="text-sm text-[color:var(--muted)] mt-0.5">
                {[s.role, s.organization, s.country].filter(Boolean).join(" · ")}
              </div>
              {s.message && (
                <p className="mt-3 text-sm leading-relaxed">"{s.message}"</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
