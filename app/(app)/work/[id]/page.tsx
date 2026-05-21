import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getAllWorks, getWorkById, getEnrichedWorkData } from "@/lib/literature-data";
import { getWorkContentData } from "@/lib/work-content";
import { notFound } from "next/navigation";
import { BookOpen, ExternalLink, Calendar, Globe, Languages, Award, Tag, BookMarked, FileText } from "lucide-react";
import Link from "next/link";
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
  const workId = Number(id);
  if (Number.isNaN(workId)) return null;
  return getEnrichedWorkData(workId);
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
  const groupedRelations = groupRelationsByType(relations);
  const firstTheme = themes.length > 0 ? themes[0] : null;
  const content = getWorkContentData(work);

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline">{work.genre}</Badge>
          <Badge variant="outline">{work.yearPublished}</Badge>
          <Badge variant="secondary">{content.statusLabel}</Badge>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Text in Wisdom
          </CardTitle>
          <CardDescription>
            What Wisdom currently stores internally for this work, separate from external links.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline">{content.statusLabel}</Badge>
            <p className="text-sm text-muted-foreground">{content.summary}</p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {content.availabilityNote}
          </p>

          {content.blocks.map((block) => (
            <div key={block.id} className="rounded-lg border bg-muted/30 p-4 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium">{block.title}</p>
                <Badge variant="secondary" className="text-[11px]">
                  {block.kind}
                </Badge>
                {!block.isVerbatim && (
                  <Badge variant="outline" className="text-[11px]">
                    not primary text
                  </Badge>
                )}
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">{block.text}</p>
              <p className="text-xs text-muted-foreground">
                {block.sourceLabel}
                {block.sourceUrl ? ` · ${block.sourceUrl}` : ""}
              </p>
            </div>
          ))}
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

      {/* Fallback search links when no direct accessLinks provided.
         Audit pass XI: 10% of works (56/561) had no accessLinks and dead-ended
         the user. These cards always render so every work has at least three
         ways to look further. */}
      {(!work.accessLinks || work.accessLinks.length === 0) && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ExternalLink className="h-5 w-5" />
              Find this work elsewhere
            </CardTitle>
            <CardDescription>
              We don't have a direct access link on file. Try these public archives:
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {[
              { name: 'Internet Archive', url: `https://archive.org/search?query=${encodeURIComponent(work.title + ' ' + work.author)}` },
              { name: 'Open Library', url: `https://openlibrary.org/search?q=${encodeURIComponent(work.title + ' ' + work.author)}` },
              { name: 'WorldCat (library lookup)', url: `https://www.worldcat.org/search?q=${encodeURIComponent(work.title + ' ' + work.author)}` },
            ].map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button variant="outline" className="w-full justify-between">
                  <span className="truncate">Search on {s.name}</span>
                  <ExternalLink className="h-4 w-4 shrink-0 ml-2" />
                </Button>
              </a>
            ))}
          </CardContent>
        </Card>
      )}

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
