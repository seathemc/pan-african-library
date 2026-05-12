import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, User } from "lucide-react";
import { getAllWorks } from "@/lib/literature-data";
import { authorNameToSlug, slugToAuthorName } from "@/lib/author-utils";

export async function generateStaticParams() {
  const works = getAllWorks();
  const uniqueAuthors = Array.from(new Set(works.map((w) => w.author)));
  return uniqueAuthors.map((name) => ({ slug: authorNameToSlug(name) }));
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const allWorks = getAllWorks();
  const allAuthorNames = Array.from(new Set(allWorks.map((w) => w.author)));
  const authorName = slugToAuthorName(slug, allAuthorNames);

  if (!authorName) {
    notFound();
  }

  const works = allWorks.filter((w) => w.author === authorName);

  const regions = Array.from(new Set(works.map((w) => w.region))).sort();
  const eras = Array.from(new Set(works.map((w) => w.era))).sort();
  const genres = Array.from(new Set(works.map((w) => w.genre))).sort();

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Back link */}
      <Link
        href="/browse"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Browse
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <User className="h-4 w-4 text-primary" />
          <Badge variant="outline">
            {works.length} {works.length === 1 ? "work" : "works"}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold">{authorName}</h1>

        {/* Region / Era / Genre pills */}
        <div className="flex flex-wrap gap-2 mt-1">
          {regions.map((r) => (
            <Badge key={r} variant="secondary" className="text-xs">
              {r}
            </Badge>
          ))}
          {eras.map((e) => (
            <Badge key={e} variant="outline" className="text-xs">
              {e}
            </Badge>
          ))}
          {genres.map((g) => (
            <Badge key={g} variant="secondary" className="text-xs">
              {g}
            </Badge>
          ))}
        </div>
      </div>

      {/* Works grid */}
      {works.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {works.map((work) => (
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
      ) : (
        <p className="text-muted-foreground py-8 text-center">No works found for this author.</p>
      )}
    </div>
  );
}
