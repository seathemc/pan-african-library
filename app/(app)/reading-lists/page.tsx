import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ListOrdered, BookOpen, ChevronRight } from "lucide-react";

interface ReadingListSummary {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  curatedBy: string | null;
  workCount: number;
  previewTitles?: string[];
}

const FALLBACK_LISTS: ReadingListSummary[] = [
  {
    id: 1,
    title: "Foundations of African Literature",
    slug: "foundations-african-literature",
    description: "Essential texts that established the canon of African literary tradition.",
    curatedBy: "Alexandria",
    workCount: 0,
  },
  {
    id: 2,
    title: "The Harlem Renaissance",
    slug: "harlem-renaissance",
    description: "Voices from the flowering of Black American art and thought in the 1920s.",
    curatedBy: "Alexandria",
    workCount: 0,
  },
  {
    id: 3,
    title: "African Feminist Voices",
    slug: "african-feminist-voices",
    description: "Writing by African and diasporic women on gender, power, and liberation.",
    curatedBy: "Alexandria",
    workCount: 0,
  },
  {
    id: 4,
    title: "Pan-Africanism & Independence",
    slug: "pan-africanism-independence",
    description: "Texts that shaped the independence movements and Pan-African thought.",
    curatedBy: "Alexandria",
    workCount: 0,
  },
  {
    id: 5,
    title: "Afrofuturism",
    slug: "afrofuturism",
    description: "Speculative and visionary works imagining African and Black futures.",
    curatedBy: "Alexandria",
    workCount: 0,
  },
  {
    id: 6,
    title: "Civil Rights & Black Power",
    slug: "civil-rights-black-power",
    description: "Speeches, essays, and manifestos from the American freedom struggle.",
    curatedBy: "Alexandria",
    workCount: 0,
  },
];

async function getReadingLists(): Promise<ReadingListSummary[]> {
  try {
    const base = process.env.NEXTJS_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/reading-lists`, { cache: "no-store" });
    if (!res.ok) throw new Error("API error");
    return res.json();
  } catch {
    return FALLBACK_LISTS;
  }
}

export default async function ReadingListsPage() {
  const lists = await getReadingLists();

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <ListOrdered className="h-5 w-5 text-primary" />
          <Badge variant="secondary" className="text-xs">Reading Lists</Badge>
        </div>
        <h1 className="text-3xl font-bold">Reading Lists</h1>
        <p className="text-muted-foreground max-w-2xl">
          Curated paths through the archive
        </p>
      </div>

      {/* Stacked list */}
      <div className="flex flex-col gap-4">
        {lists.map((list) => (
          <Link key={list.slug} href={`/reading-lists/${list.slug}`} className="group">
            <Card className="hover:border-primary/50 transition-all duration-200 cursor-pointer group-hover:shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <CardTitle className="text-xl leading-snug group-hover:text-primary transition-colors">
                      {list.title}
                    </CardTitle>
                    {list.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {list.description}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-3 flex-wrap">
                  {list.curatedBy && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      Curated by {list.curatedBy}
                    </span>
                  )}
                  {list.workCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {list.workCount} {list.workCount === 1 ? "work" : "works"}
                    </Badge>
                  )}
                </div>
                {list.previewTitles && list.previewTitles.length > 0 && (
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-1">
                    {list.previewTitles.slice(0, 3).join(" · ")}
                    {list.previewTitles.length > 3 && " · …"}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
