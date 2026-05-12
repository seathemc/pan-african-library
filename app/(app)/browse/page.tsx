import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllWorks } from "@/lib/literature-data";
import { BookOpen } from "lucide-react";

const PAGE_SIZE = 60;

const REGIONS = [
  "West Africa", "East Africa", "Southern Africa", "North Africa",
  "Central Africa", "Caribbean", "Diaspora",
];

const GENRES = ["Fiction", "Non-fiction", "Poetry", "Drama", "Autobiography", "Folklore"];

const ERAS = [
  "Pre-colonial Oral Traditions", "Colonial", "Post-colonial",
  "Harlem Renaissance", "Negritude", "Contemporary",
];

interface BrowsePageProps {
  searchParams: Promise<{
    page?: string;
    region?: string;
    genre?: string;
    era?: string;
  }>;
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const regionFilter = params.region || "";
  const genreFilter = params.genre || "";
  const eraFilter = params.era || "";

  const allWorks = getAllWorks();

  const filtered = allWorks.filter((w) => {
    if (regionFilter && !w.region.includes(regionFilter)) return false;
    if (genreFilter && w.genre !== genreFilter) return false;
    if (eraFilter && w.era !== eraFilter) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageWorks = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function buildUrl(overrides: Record<string, string>) {
    const p: Record<string, string> = {};
    if (regionFilter) p.region = regionFilter;
    if (genreFilter) p.genre = genreFilter;
    if (eraFilter) p.era = eraFilter;
    Object.assign(p, overrides);
    const qs = new URLSearchParams(p).toString();
    return `/browse${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <Badge variant="secondary" className="text-xs">The Archive</Badge>
        </div>
        <h1 className="text-3xl font-bold">Browse</h1>
        <p className="text-muted-foreground max-w-2xl">
          {allWorks.length} works of pan-African thought.{" "}
          {filtered.length < allWorks.length && (
            <span className="text-foreground font-medium">{filtered.length} matching current filters.</span>
          )}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3">
        {/* Region */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-medium text-muted-foreground w-14 shrink-0">Region</span>
          <Link href={buildUrl({ region: "", page: "1" })}>
            <Badge variant={!regionFilter ? "default" : "outline"} className="cursor-pointer text-xs">
              All
            </Badge>
          </Link>
          {REGIONS.map((r) => (
            <Link key={r} href={buildUrl({ region: r, page: "1" })}>
              <Badge variant={regionFilter === r ? "default" : "outline"} className="cursor-pointer text-xs">
                {r}
              </Badge>
            </Link>
          ))}
        </div>
        {/* Genre */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-medium text-muted-foreground w-14 shrink-0">Genre</span>
          <Link href={buildUrl({ genre: "", page: "1" })}>
            <Badge variant={!genreFilter ? "default" : "outline"} className="cursor-pointer text-xs">
              All
            </Badge>
          </Link>
          {GENRES.map((g) => (
            <Link key={g} href={buildUrl({ genre: g, page: "1" })}>
              <Badge variant={genreFilter === g ? "default" : "outline"} className="cursor-pointer text-xs">
                {g}
              </Badge>
            </Link>
          ))}
        </div>
        {/* Era */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-medium text-muted-foreground w-14 shrink-0">Era</span>
          <Link href={buildUrl({ era: "", page: "1" })}>
            <Badge variant={!eraFilter ? "default" : "outline"} className="cursor-pointer text-xs">
              All
            </Badge>
          </Link>
          {ERAS.map((e) => (
            <Link key={e} href={buildUrl({ era: e, page: "1" })}>
              <Badge variant={eraFilter === e ? "default" : "outline"} className="cursor-pointer text-xs">
                {e}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* Grid */}
      {pageWorks.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center">No works match the current filters.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pageWorks.map((work) => (
            <Link key={work.id} href={`/work/${work.id}`}>
              <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">{work.title}</CardTitle>
                    <Badge variant="outline" className="shrink-0">{work.yearPublished}</Badge>
                  </div>
                  <CardDescription className="font-medium">{work.author}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                    {work.description}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">{work.region}</Badge>
                    <Badge variant="secondary" className="text-xs">{work.genre}</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages} · {filtered.length} works
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={buildUrl({ page: String(page - 1) })}>
                <Badge variant="outline" className="cursor-pointer px-3 py-1">← Prev</Badge>
              </Link>
            )}
            {page < totalPages && (
              <Link href={buildUrl({ page: String(page + 1) })}>
                <Badge variant="outline" className="cursor-pointer px-3 py-1">Next →</Badge>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
