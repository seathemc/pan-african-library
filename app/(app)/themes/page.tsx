import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getThemeCatalog, type ThemeSummary } from "@/lib/literature-data";

async function getThemes(): Promise<ThemeSummary[]> {
  return getThemeCatalog();
}

export default async function ThemesPage() {
  const themes = await getThemes();

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-primary" />
          <Badge variant="secondary" className="text-xs">Themes</Badge>
        </div>
        <h1 className="text-3xl font-bold">Themes</h1>
        <p className="text-muted-foreground max-w-2xl">
          Explore the library by cross-cutting ideas, movements, and concepts
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <Link key={theme.slug} href={`/themes/${theme.slug}`} className="group">
            <Card className="h-full hover:border-primary/50 transition-all duration-200 cursor-pointer group-hover:shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg leading-tight">{theme.name}</CardTitle>
                  <ArrowRight
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground mt-0.5",
                      "opacity-0 -translate-x-1 transition-all duration-200",
                      "group-hover:opacity-100 group-hover:translate-x-0"
                    )}
                  />
                </div>
                {theme.workCount > 0 && (
                  <Badge variant="outline" className="w-fit text-xs">
                    {theme.workCount} {theme.workCount === 1 ? "work" : "works"}
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {theme.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
