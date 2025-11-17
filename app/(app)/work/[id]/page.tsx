import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getWorkById, getAllWorks } from "@/lib/literature-data";
import { notFound } from "next/navigation";
import { BookOpen, ExternalLink, Calendar, Globe, Languages, Award } from "lucide-react";
import Link from "next/link";

export default async function WorkPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const work = getWorkById(parseInt(id));

  if (!work) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{work.genre}</Badge>
          <Badge variant="outline">{work.yearPublished}</Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">{work.title}</h1>
        <p className="text-xl text-muted-foreground font-medium">{work.author}</p>
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
                domain = url.hostname.replace('www.', '');
                isValidUrl = true;
              } catch {
                isValidUrl = false;
              }

              if (!isValidUrl) {
                // Display as text if not a valid URL
                return (
                  <div key={index} className="text-sm text-muted-foreground p-2 bg-muted rounded">
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

      {/* Explore More */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Explore More</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Link href={`/browse/region/${encodeURIComponent(work.region.toLowerCase())}`}>
            <Button variant="secondary">
              More from {work.region}
            </Button>
          </Link>
          <Link href={`/browse/era/${encodeURIComponent(work.era.toLowerCase())}`}>
            <Button variant="secondary">
              More {work.era} Works
            </Button>
          </Link>
          <Link href={`/browse/genre/${encodeURIComponent(work.genre.toLowerCase())}`}>
            <Button variant="secondary">
              More {work.genre}
            </Button>
          </Link>
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
