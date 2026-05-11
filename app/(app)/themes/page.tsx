import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Theme {
  id: number;
  name: string;
  slug: string;
  workCount: number;
}

const THEME_DESCRIPTIONS: Record<string, string> = {
  colonialism: "Works exploring colonial power, resistance, and its aftermath",
  decolonization: "Processes and ideologies of dismantling colonial structures",
  identity: "Explorations of Black, African, and diasporic selfhood",
  feminism: "Gender, womanhood, and feminist struggle across the African world",
  "race-racism": "The construction of race and the lived reality of racism",
  "pan-africanism": "Unity, solidarity, and liberation across the African diaspora",
  slavery: "The transatlantic slave trade and its enduring legacies",
  "religion-spirituality": "Faith, cosmology, and spiritual life in African traditions",
  migration: "Movement, diaspora, and the search for belonging",
  "oral-tradition": "Storytelling, griot culture, and the spoken word as archive",
  resistance: "Acts of defiance, uprising, and the will to be free",
  "family-community": "Kinship, communal bonds, and the ethics of care",
  education: "Knowledge, self-determination, and the politics of learning",
  "postcolonial-theory": "Intellectual frameworks for understanding colonial modernity",
  afrofuturism: "Speculative visions of African and Black futures",
  "class-poverty": "Economic inequality, labour, and class struggle",
  "war-conflict": "Armed struggle, liberation wars, and the cost of conflict",
  "harlem-renaissance": "The cultural and artistic flowering of Black America in the 1920s",
  autobiography: "Self-narration, testimony, and personal witness",
  "nature-land": "The relationship between African peoples and the land",
  "political-theory": "Ideas of governance, justice, and political organisation",
};

const FALLBACK_THEMES = [
  { slug: "colonialism", name: "Colonialism" },
  { slug: "decolonization", name: "Decolonization" },
  { slug: "identity", name: "Identity" },
  { slug: "feminism", name: "Feminism" },
  { slug: "race-racism", name: "Race & Racism" },
  { slug: "pan-africanism", name: "Pan-Africanism" },
  { slug: "slavery", name: "Slavery" },
  { slug: "religion-spirituality", name: "Religion & Spirituality" },
  { slug: "migration", name: "Migration" },
  { slug: "oral-tradition", name: "Oral Tradition" },
  { slug: "resistance", name: "Resistance" },
  { slug: "family-community", name: "Family & Community" },
  { slug: "education", name: "Education" },
  { slug: "postcolonial-theory", name: "Postcolonial Theory" },
  { slug: "afrofuturism", name: "Afrofuturism" },
  { slug: "class-poverty", name: "Class & Poverty" },
  { slug: "war-conflict", name: "War & Conflict" },
  { slug: "harlem-renaissance", name: "Harlem Renaissance" },
  { slug: "autobiography", name: "Autobiography" },
  { slug: "nature-land", name: "Nature & Land" },
  { slug: "political-theory", name: "Political Theory" },
];

async function getThemes(): Promise<Theme[]> {
  try {
    const base = process.env.NEXTJS_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/themes`, { cache: "no-store" });
    if (!res.ok) throw new Error("API error");
    return res.json();
  } catch {
    return FALLBACK_THEMES.map((t, i) => ({ id: i + 1, name: t.name, slug: t.slug, workCount: 0 }));
  }
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
                  {THEME_DESCRIPTIONS[theme.slug] ?? `Works related to ${theme.name.toLowerCase()}`}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
