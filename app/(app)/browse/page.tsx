import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllWorks } from "@/lib/literature-data";
import { BookOpen } from "lucide-react";

export default function BrowsePage() {
  const allWorks = getAllWorks();

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <Badge variant="secondary" className="text-xs">Reviving the Past</Badge>
        </div>
        <h1 className="text-3xl font-bold">The Archive</h1>
        <p className="text-muted-foreground max-w-2xl">
          {allWorks.length} works of pan-African thought, collected in one place. From the earliest Black
          voices in America to contemporary African philosophers. Speeches, essays, novels, manifestos—all
          preserved, all accessible.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allWorks.map((work) => (
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
