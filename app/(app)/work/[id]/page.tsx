import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getWorkById, getAllWorks } from "@/lib/literature-data";
import { notFound } from "next/navigation";
import { BookOpen, ExternalLink, Calendar, Globe, Languages, Award, Tag, ListOrdered, BookMarked } from "lucide-react";
import Link from "next/link";
import { AddToCollection } from "@/components/add-to-collection";
import { authorNameToSlug } from "@/lib/author-utils";

interface ApiTheme {
  name: string;
  slug: string;
}

interface ApiRelation {
  type: string;
  direction: "outgoing" | "incoming";
  work: { id: number; title: string; author: string };
}

interface ApiReadingList {
  id: number;
  title: string;
  slug: string;
}

interface EnrichedData {
  themes: ApiTheme[];
  relations: ApiRelation[];
  readingLists: ApiReadingList[];
}

async function getEnrichedData(id: string): Promise<EnrichedData | null> {
  try {
    const baseUrl = process.env.NEXTJS_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/works/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      themes: Array.isArray(data.themes) ? data.themes : [],
      relations: Array.isArray(data.relations) ? data.relations : [],
      readingLists: Array.isArray(data.readingLists) ? data.readingLists : [],
    };
  } catch {
    return null;
  }
}

// Group relations by type, de-duplicating work ids across directions
function groupRelationsByType(relations: ApiRelation[]): Record<string, ApiRelation[]> {
  const seen = new Set<number>();
  const grouped: Record<string, ApiRelation[]> = {};
  for (const rel of relations) {
    if (seen.has(rel.work.id)) continue;
    seen.add(rel.work.id);
    if (!grouped[rel.type]) grouped[rel.type] = [];
    grouped[rel.type].push(rel);
  }
  return grouped;
}

function relationTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    same_series: "Same Series",
    influenced_by: "Influenced By",
    influences: "Influences",
    related: "Related Works",
  };
  return labels[type] ?? type.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const work = getWorkById(parseInt(id));

  if (!work) {
    notFound();
  }

  const enriched = await getEnrichedData(id);
  const themes = enriched?.themes ?? [];
  const relations = enriched?.relations ?? [];
  const readingLists = enriched?.readingLists ?? [];
  const groupedRelations = groupRelationsByType(relations);
  const firstTheme = themes.length > 0 ? themes[0] : null;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline">{work.genre}</Badge>
          <Badge variant="outline">{work.yearPublished}</Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">{work.title}</h1>
        <Link
          href={`/author/${authorNameToSlug(work.author)}`}
          className="text-xl text-muted-foreground font-medium hover:text-foreground transition-colors w-fit"
        >
          {work.author}
        </Link>

        {/* Themes section */}
        {themes.length > 0 && (
          <div className="flex items-start gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground shrink-0 mt-0.5">
              <Tag className="h-4 w-4" />
              <span>Themes:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {themes.map((theme) => (
                <Link key={theme.slug} href={`/themes/${theme.slug}`}>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80 transition-colors"
                  >
                    {theme.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reading Lists section */}
      {readingLists.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <ListOrdered className="h-4 w-4 text-primary" />
              Part of Reading Lists
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {readingLists.map((list) => (
              <Link key={list.slug} href={`/reading-lists/${list.slug}`}>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:border-primary/60 transition-colors text-sm py-1 px-3"
                >
                  {list.title}
                </Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quick Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="h-4 w-4" />
              Region
            </div>
            <p className="font-medium">{work.region}</p>
            <p className="text-sm text-muted-foreground">{work.country}</p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Era
            </div>
            <p className="font-medium">{work.era}</p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Languages className="h-4 w-4" />
              Language
            </div>
            <p className="font-medium">{work.language}</p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              Genre
            </div>
            <p className="font-medium">{work.genre}</p>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>About This Work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-base leading-relaxed">{work.description}</p>

          {work.significance && (
            <>
              <Separator />
              <div className="flex gap-3">
                <Award className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Literary Significance</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {work.significance}
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Related Works section */}
      {relations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookMarked className="h-5 w-5 text-primary" />
              Related Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(groupedRelations).map(([type, rels]) => (
              <div key={type}>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  {relationTypeLabel(type)}
                </p>
                <div className="flex flex-col gap-2">
                  {rels.map((rel) => (
                    <Link
                      key={rel.work.id}
                      href={`/work/${rel.work.id}`}
                      className="group"
                    >
                      <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors">
                        <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                            {rel.work.title}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {rel.work.author}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Access Links */}
      {work.accessLinks && work.accessLinks.length > 0 && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Access This Work
            </CardTitle>
            <CardDescription>
              Read or download this work from trusted sources
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {work.accessLinks.map((link, index) => {
              // Check if it's a valid URL
              let isValidUrl = false;
              let domain = link;
              try {
                const url = new URL(link);
                domain = url.hostname.replace("www.", "");
                isValidUrl = true;
              } catch {
                isValidUrl = false;
              }

              if (!isValidUrl) {
                // Display as text if not a valid URL
                return (
                  <div
                    key={index}
                    className="text-sm text-muted-foreground p-2 bg-muted rounded"
                  >
                    {link}
                  </div>
                );
              }

              return (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button variant="outline" className="w-full justify-between">
                    <span className="truncate">{domain}</span>
                    <ExternalLink className="h-4 w-4 shrink-0 ml-2" />
                  </Button>
                </a>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Save to Collection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BookMarked className="h-5 w-5 text-primary" />
            Save to Collection
          </CardTitle>
          <CardDescription>Add this work to one of your personal collections.</CardDescription>
        </CardHeader>
        <CardContent>
          <AddToCollection workId={work.id} />
        </CardContent>
      </Card>

      {/* Explore More */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Explore More</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Link
            href={`/browse/region/${encodeURIComponent(work.region.toLowerCase())}`}
          >
            <Button variant="secondary">More from {work.region}</Button>
          </Link>
          <Link
            href={`/browse/era/${encodeURIComponent(work.era.toLowerCase())}`}
          >
            <Button variant="secondary">More {work.era} Works</Button>
          </Link>
          <Link
            href={`/browse/genre/${encodeURIComponent(work.genre.toLowerCase())}`}
          >
            <Button variant="secondary">More {work.genre}</Button>
          </Link>
          {firstTheme && (
            <Link href={`/themes/${firstTheme.slug}`}>
              <Button variant="secondary">
                <Tag className="h-4 w-4 mr-1.5" />
                Explore: {firstTheme.name}
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export async function generateStaticParams() {
  const works = getAllWorks();
  return works.map((work) => ({
    id: work.id.toString(),
  }));
}
