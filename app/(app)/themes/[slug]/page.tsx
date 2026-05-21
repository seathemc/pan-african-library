import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Tag } from "lucide-react";
import { getThemeBySlug, type ThemeDetail } from "@/lib/literature-data";

const THEME_SLUGS = [
  "colonialism",
  "decolonization",
  "identity",
  "feminism",
  "race-racism",
  "pan-africanism",
  "slavery",
  "religion-spirituality",
  "migration",
  "oral-tradition",
  "resistance",
  "family-community",
  "education",
  "postcolonial-theory",
  "afrofuturism",
  "class-poverty",
  "war-conflict",
  "harlem-renaissance",
  "autobiography",
  "nature-land",
  "political-theory",
];

async function getTheme(slug: string): Promise<ThemeDetail | null> {
  return getThemeBySlug(slug);
}

export async function generateStaticParams() {
  return THEME_SLUGS.map((slug) => ({ slug }));
}

export default async function ThemeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const theme = await getTheme(slug);

  if (!theme) {
    return (
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        <Link
          href="/themes"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Themes
        </Link>
        <div className="flex flex-col gap-3 py-12 items-center text-center">
          <Tag className="h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">
            Theme not found.
          </p>
          <Link href="/themes" className="text-sm text-primary hover:underline">
            Return to Themes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Back link */}
      <Link
        href="/themes"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Themes
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Tag className="h-4 w-4 text-primary" />
          <Badge variant="outline">{theme.works.length} {theme.works.length === 1 ? "work" : "works"}</Badge>
        </div>
        <h1 className="text-3xl font-bold">{theme.name}</h1>
      </div>

      {/* Works grid */}
      {theme.works.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {theme.works.map((work) => (
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
        <p className="text-muted-foreground py-8 text-center">No works found for this theme.</p>
      )}
    </div>
  );
}
