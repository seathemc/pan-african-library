import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ListOrdered, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkEntry {
  position: number;
  note: string | null;
  id: number;
  title: string;
  author: string;
  yearPublished: number;
  region: string;
  genre: string;
  era: string;
  description: string;
}

interface ReadingListDetail {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  curatedBy: string | null;
  works: WorkEntry[];
}

const READING_LIST_SLUGS = [
  "foundations-african-literature",
  "harlem-renaissance",
  "african-feminist-voices",
  "pan-africanism-independence",
  "afrofuturism",
  "civil-rights-black-power",
];

async function getReadingList(slug: string): Promise<ReadingListDetail | null> {
  try {
    const base = process.env.NEXTJS_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/reading-lists/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  return READING_LIST_SLUGS.map((slug) => ({ slug }));
}

export default async function ReadingListDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const list = await getReadingList(slug);

  if (!list) {
    return (
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <Link
          href="/reading-lists"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Reading Lists
        </Link>
        <div className="flex flex-col gap-3 py-12 items-center text-center">
          <ListOrdered className="h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">
            Theme data unavailable — database may not be seeded.
          </p>
          <Link href="/reading-lists" className="text-sm text-primary hover:underline">
            Return to Reading Lists
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      {/* Back link */}
      <Link
        href="/reading-lists"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Reading Lists
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <ListOrdered className="h-4 w-4 text-primary" />
          <Badge variant="outline">
            {list.works.length} {list.works.length === 1 ? "work" : "works"}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold">{list.title}</h1>
        {list.description && (
          <p className="text-muted-foreground max-w-2xl leading-relaxed">{list.description}</p>
        )}
        {list.curatedBy && (
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            Curated by {list.curatedBy}
          </p>
        )}
      </div>

      {/* Ordered works */}
      {list.works.length > 0 ? (
        <div className="flex flex-col">
          {list.works.map((work, index) => (
            <div key={work.id} className="relative">
              {/* Connecting line between entries */}
              {index < list.works.length - 1 && (
                <div className="absolute left-7 top-full w-px h-4 bg-border z-10" />
              )}
              <Link href={`/work/${work.id}`}>
                <div
                  className={cn(
                    "flex gap-4 rounded-lg border bg-card p-4 transition-all duration-200",
                    "hover:border-primary/50 hover:shadow-sm cursor-pointer",
                    index < list.works.length - 1 && "mb-4"
                  )}
                >
                  {/* Position number */}
                  <div className="flex-none w-10 flex items-start justify-center pt-0.5">
                    <span className="text-2xl font-bold text-muted-foreground/40 leading-none tabular-nums">
                      {work.position}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold leading-snug">{work.title}</h3>
                        <p className="text-sm text-muted-foreground">{work.author}</p>
                      </div>
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {work.yearPublished}
                      </Badge>
                    </div>

                    {work.note && (
                      <p className="text-sm text-muted-foreground italic leading-relaxed">
                        {work.note}
                      </p>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">{work.region}</Badge>
                      <Badge variant="secondary" className="text-xs">{work.genre}</Badge>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground py-8 text-center">
          No works in this reading list yet.
        </p>
      )}
    </div>
  );
}
