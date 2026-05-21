import literatureData from "@/pan-african-literature-database.json"

export interface LiteratureWork {
  id: number
  title: string
  author: string
  yearPublished: number
  language: string
  region: string
  country: string
  genre: string
  era: string
  description: string
  accessLinks: string[]
  significance: string
}

export interface LiteratureDatabase {
  metadata: {
    compiledDate: string
    totalWorks: number
    description: string
  }
  works: LiteratureWork[]
}

export interface ThemeSummary {
  id: number
  name: string
  slug: string
  description: string
  workCount: number
}

export interface ThemeDetail extends ThemeSummary {
  works: LiteratureWork[]
}

export interface WorkTheme {
  name: string
  slug: string
}

export interface EnrichedWorkData {
  themes: WorkTheme[]
  relations: Array<{
    type: string
    direction: "outgoing" | "incoming"
    work: { id: number; title: string; author: string }
  }>
  readingLists: Array<{
    id: number
    title: string
    slug: string
  }>
}

type ThemeRule = {
  slug: string
  name: string
  description: string
  keywords: string[]
}

const THEME_RULES: ThemeRule[] = [
  {
    slug: "colonialism",
    name: "Colonialism",
    description: "Works exploring colonial power, resistance, and its aftermath",
    keywords: ["colonial", "colonialism", "colonization", "colonised", "colonial rule", "british empire", "french empire"],
  },
  {
    slug: "decolonization",
    name: "Decolonization",
    description: "Processes and ideologies of dismantling colonial structures",
    keywords: ["decoloni", "independence", "anti-colonial", "liberation struggle", "freedom struggle", "self-determination"],
  },
  {
    slug: "identity",
    name: "Identity",
    description: "Explorations of Black, African, and diasporic selfhood",
    keywords: ["identity", "belonging", "diaspora", "double consciousness", "cultural identity", "self-hood"],
  },
  {
    slug: "feminism",
    name: "Feminism",
    description: "Gender, womanhood, and feminist struggle across the African world",
    keywords: ["feminist", "feminism", "gender", "patriarchy", "womanhood", "women", "female oppression", "black feminist"],
  },
  {
    slug: "race-racism",
    name: "Race & Racism",
    description: "The construction of race and the lived reality of racism",
    keywords: ["race", "racism", "racial", "segregation", "apartheid", "jim crow", "white supremacy", "racial injustice", "racial violence"],
  },
  {
    slug: "pan-africanism",
    name: "Pan-Africanism",
    description: "Unity, solidarity, and liberation across the African diaspora",
    keywords: ["pan-african", "pan african", "african unity", "negritude", "african consciousness", "african nationalism"],
  },
  {
    slug: "slavery",
    name: "Slavery",
    description: "The transatlantic slave trade and its enduring legacies",
    keywords: ["slave", "slavery", "enslaved", "plantation", "abolitionist", "middle passage", "bondage"],
  },
  {
    slug: "religion-spirituality",
    name: "Religion & Spirituality",
    description: "Faith, cosmology, and spiritual life in African traditions",
    keywords: ["religion", "spiritual", "islam", "christianity", "traditional religion", "ancestors", "ritual", "faith"],
  },
  {
    slug: "migration",
    name: "Migration",
    description: "Movement, diaspora, and the search for belonging",
    keywords: ["migrat", "exile", "displacement", "refugee", "immigrant", "leaving home", "return"],
  },
  {
    slug: "oral-tradition",
    name: "Oral Tradition",
    description: "Storytelling, griot culture, and the spoken word as archive",
    keywords: ["oral tradition", "griot", "storytelling", "folklore", "oral history", "proverb"],
  },
  {
    slug: "resistance",
    name: "Resistance",
    description: "Acts of defiance, uprising, and the will to be free",
    keywords: ["resistance", "revolution", "revolt", "uprising", "rebellion", "black power", "civil rights"],
  },
  {
    slug: "family-community",
    name: "Family & Community",
    description: "Kinship, communal bonds, and the ethics of care",
    keywords: ["family", "community", "kinship", "village", "generational", "ancestors"],
  },
  {
    slug: "education",
    name: "Education",
    description: "Knowledge, self-determination, and the politics of learning",
    keywords: ["education", "school", "learning", "literacy", "university", "intellectual"],
  },
  {
    slug: "postcolonial-theory",
    name: "Postcolonial Theory",
    description: "Intellectual frameworks for understanding colonial modernity",
    keywords: ["postcolonial", "hybridity", "subaltern", "frantz fanon", "orientalism", "empire writes back"],
  },
  {
    slug: "afrofuturism",
    name: "Afrofuturism",
    description: "Speculative visions of African and Black futures",
    keywords: ["afrofuturism", "afrofuturist", "speculative", "science fiction", "dystopia", "utopia"],
  },
  {
    slug: "class-poverty",
    name: "Class & Poverty",
    description: "Economic inequality, labour, and class struggle",
    keywords: ["class", "poverty", "working class", "capitalism", "economic inequality", "exploitation"],
  },
  {
    slug: "war-conflict",
    name: "War & Conflict",
    description: "Armed struggle, liberation wars, and the cost of conflict",
    keywords: ["war", "conflict", "civil war", "genocide", "violence", "massacre", "battle"],
  },
  {
    slug: "harlem-renaissance",
    name: "Harlem Renaissance",
    description: "The cultural and artistic flowering of Black America in the 1920s",
    keywords: ["harlem renaissance", "harlem", "new negro", "1920s", "1930s"],
  },
  {
    slug: "autobiography",
    name: "Autobiography",
    description: "Self-narration, testimony, and personal witness",
    keywords: ["autobiography", "memoir", "memory", "self-portrait", "coming of age", "bildungsroman"],
  },
  {
    slug: "nature-land",
    name: "Nature & Land",
    description: "The relationship between African peoples and the land",
    keywords: ["land", "nature", "earth", "environment", "landscape", "agriculture"],
  },
  {
    slug: "political-theory",
    name: "Political Theory",
    description: "Ideas of governance, justice, and political organisation",
    keywords: ["political", "marxism", "socialism", "democracy", "governance", "imperialism"],
  },
]

const works = literatureData.panAfricanLiterature.works as LiteratureWork[]

function classifyThemes(work: LiteratureWork): WorkTheme[] {
  const corpus = [
    work.title,
    work.genre,
    work.era,
    work.description,
    work.significance ?? "",
    work.region,
  ].join(" ").toLowerCase()

  const matched = new Set<string>()
  for (const rule of THEME_RULES) {
    if (rule.keywords.some((keyword) => corpus.includes(keyword))) {
      matched.add(rule.slug)
    }
  }

  if (work.era === "Harlem Renaissance") matched.add("harlem-renaissance")
  if (work.genre === "Autobiography") matched.add("autobiography")
  if (work.genre === "Folklore") matched.add("oral-tradition")

  return THEME_RULES
    .filter((rule) => matched.has(rule.slug))
    .map((rule) => ({ name: rule.name, slug: rule.slug }))
}

export const getAllWorks = (): LiteratureWork[] => works

export const getWorkById = (id: number): LiteratureWork | undefined => {
  return works.find((work) => work.id === id)
}

export const getWorksByRegion = (region: string): LiteratureWork[] => {
  return works.filter((work) => work.region.toLowerCase() === region.toLowerCase())
}

export const getWorksByEra = (era: string): LiteratureWork[] => {
  return works.filter((work) => work.era.toLowerCase() === era.toLowerCase())
}

export const getWorksByGenre = (genre: string): LiteratureWork[] => {
  return works.filter((work) => work.genre.toLowerCase() === genre.toLowerCase())
}

export const getRegions = (): string[] => {
  const regions = new Set(works.map((work) => work.region))
  return Array.from(regions).sort()
}

export const getEras = (): string[] => {
  const eras = new Set(works.map((work) => work.era))
  return Array.from(eras).sort()
}

export const getGenres = (): string[] => {
  const genres = new Set(works.map((work) => work.genre))
  return Array.from(genres).sort()
}

export const getThemeCatalog = (): ThemeSummary[] => {
  return THEME_RULES.map((rule, index) => {
    const workCount = works.filter((work) => classifyThemes(work).some((theme) => theme.slug === rule.slug)).length
    return {
      id: index + 1,
      name: rule.name,
      slug: rule.slug,
      description: rule.description,
      workCount,
    }
  })
}

export const getThemeBySlug = (slug: string): ThemeDetail | null => {
  const theme = getThemeCatalog().find((entry) => entry.slug === slug)
  if (!theme) return null

  const themedWorks = works
    .filter((work) => classifyThemes(work).some((item) => item.slug === slug))
    .sort((a, b) => a.yearPublished - b.yearPublished)

  return {
    ...theme,
    works: themedWorks,
  }
}

export const getEnrichedWorkData = (workId: number): EnrichedWorkData => {
  const work = getWorkById(workId)
  if (!work) {
    return { themes: [], relations: [], readingLists: [] }
  }

  return {
    themes: classifyThemes(work),
    relations: [],
    readingLists: [],
  }
}
