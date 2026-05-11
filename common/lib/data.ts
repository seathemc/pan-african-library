import acts from "@/data/startup-acts.json";
import clauses from "@/data/clauses.json";

export type Act = (typeof acts)[number];
export type Clause = (typeof clauses)[number];

export function getActs(): Act[] {
  return acts as Act[];
}

export function getActByIso(iso: string): Act | undefined {
  return (acts as Act[]).find((a) => a.iso.toLowerCase() === iso.toLowerCase());
}

export function getClauses(): Clause[] {
  return clauses as Clause[];
}

export function getClauseBySlug(slug: string): Clause | undefined {
  return (clauses as Clause[]).find((c) => c.slug === slug);
}
