import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getWorksByRegion } from "@/lib/literature-data";
import { notFound } from "next/navigation";

export default async function RegionPage({
  params,
}: {
  params: Promise<{ region: string }>
}) {
  const { region } = await params;
  const decodedRegion = decodeURIComponent(region);
  const works = getWorksByRegion(decodedRegion);

  if (works.length === 0) {
    notFound();
  }

  const regionName = works[0].region;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{works.length} works</Badge>
        </div>
        <h1 className="text-3xl font-bold">{regionName}</h1>
        <p className="text-muted-foreground">
          Explore literature from {regionName}
        </p>
      </div>

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
                  <Badge variant="secondary" className="text-xs">{work.country}</Badge>
                  <Badge variant="secondary" className="text-xs">{work.genre}</Badge>
                  <Badge variant="secondary" className="text-xs">{work.era}</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
