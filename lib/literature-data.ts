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
  indicators: Array<{
    id: string
    name: string
    layer: "present" | "future"
    reason: string
  }>
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

const RAW_WORKS = literatureData.panAfricanLiterature.works as LiteratureWork[]

const EXCLUDED_WORK_IDS = new Set<number>([
  562, // Yoko Ogawa, The Memory Police: comparative speculative fiction, not African/diaspora.
])

const DUPLICATE_WORK_IDS = new Set<number>([
  292, // Aimé Césaire, Notebook of a Return to the Native Land duplicate.
  478, // Camara Laye, The African Child duplicate/translation variant.
  502, // Camara Laye, Dark Child duplicate/translation variant.
  539, // George Padmore, Pan-Africanism or Communism duplicate.
  581, // Nnedi Okorafor, Lagoon duplicate; keep existing canonical record 495.
])

const WORK_OVERRIDES: Record<number, Partial<LiteratureWork>> = {
  186: { era: "Colonial" },
  187: { era: "Colonial" },
  188: { era: "Colonial" },
  189: { era: "Colonial" },
  190: { era: "Colonial" },
}

const ARCHIVE_EXPANSION_WORKS: LiteratureWork[] = [
  {
    id: 563,
    title: "The Tale of Sinuhe",
    author: "Ancient Egyptian scribal tradition",
    yearPublished: -1900,
    language: "Middle Egyptian",
    region: "North Africa",
    country: "Egypt",
    genre: "Tale",
    era: "Pre-colonial",
    description:
      "A Middle Kingdom narrative of exile, return, kingship, and belonging. Sinuhe flees Egypt after the death of Amenemhat I, builds a life abroad, and is eventually summoned home by the pharaoh.",
    accessLinks: ["https://www.gutenberg.org/ebooks/15932"],
    significance:
      "One of the oldest surviving works of African narrative literature and a foundation text for exile-and-return motifs.",
  },
  {
    id: 564,
    title: "The Eloquent Peasant",
    author: "Ancient Egyptian scribal tradition",
    yearPublished: -1850,
    language: "Middle Egyptian",
    region: "North Africa",
    country: "Egypt",
    genre: "Wisdom Literature",
    era: "Pre-colonial",
    description:
      "A Middle Kingdom tale in which a wronged peasant delivers a sequence of speeches demanding justice from corrupt officials and appealing to maat, the moral order.",
    accessLinks: ["https://www.gutenberg.org/ebooks/15932"],
    significance:
      "Early African political and ethical literature centered on justice, eloquence, and accountability.",
  },
  {
    id: 565,
    title: "The Maxims of Ptahhotep",
    author: "Ptahhotep",
    yearPublished: -2350,
    language: "Old Egyptian",
    region: "North Africa",
    country: "Egypt",
    genre: "Wisdom Literature",
    era: "Pre-colonial",
    description:
      "A collection of instructions attributed to the vizier Ptahhotep, advising ethical conduct, humility, listening, speech, justice, and leadership.",
    accessLinks: ["https://sacred-texts.com/egy/ptah/index.htm"],
    significance:
      "Among the world's earliest surviving works of moral and political instruction.",
  },
  {
    id: 566,
    title: "The Book of Coming Forth by Day",
    author: "Ancient Egyptian funerary tradition",
    yearPublished: -1550,
    language: "Egyptian",
    region: "North Africa",
    country: "Egypt",
    genre: "Religious Text",
    era: "Pre-colonial",
    description:
      "A corpus of funerary spells, hymns, and declarations guiding the dead through judgment and rebirth, often known in English as the Egyptian Book of the Dead.",
    accessLinks: ["https://sacred-texts.com/egy/ebod/index.htm"],
    significance:
      "A major archive of ancient African cosmology, ethics, ritual, and ideas of judgment.",
  },
  {
    id: 567,
    title: "The Kebra Nagast",
    author: "Ethiopian ecclesiastical tradition",
    yearPublished: 1322,
    language: "Ge'ez",
    region: "East Africa",
    country: "Ethiopia",
    genre: "Epic",
    era: "Pre-colonial",
    description:
      "The Ethiopian national epic linking the Queen of Sheba, King Solomon, Menelik I, and the Ark of the Covenant into a sacred history of Ethiopian kingship.",
    accessLinks: ["https://sacred-texts.com/afr/kn/index.htm"],
    significance:
      "Foundational text for Ethiopian political theology, dynastic legitimacy, and Christian literary tradition.",
  },
  {
    id: 568,
    title: "The Epic of Askia Mohammed",
    author: "Songhay oral tradition",
    yearPublished: 1500,
    language: "Songhay oral tradition",
    region: "West Africa",
    country: "Mali",
    genre: "Oral Epic",
    era: "Pre-colonial",
    description:
      "Griotic accounts of Askia Mohammed Ture, ruler of the Songhay Empire, remembered for imperial consolidation, Islamic learning, trade, pilgrimage, and statecraft.",
    accessLinks: ["https://en.wikipedia.org/wiki/Askia_Mohammad_I"],
    significance:
      "Anchors Songhay political memory and West African traditions of kingship, scholarship, and empire.",
  },
  {
    id: 569,
    title: "Tarikh al-Sudan",
    author: "Abd al-Rahman al-Sa'di",
    yearPublished: 1655,
    language: "Arabic",
    region: "West Africa",
    country: "Mali",
    genre: "Chronicle",
    era: "Pre-colonial",
    description:
      "A seventeenth-century Timbuktu chronicle recounting the history of Mali, Songhay, Islamic scholarship, political succession, and urban life in the Niger bend.",
    accessLinks: ["https://archive.org/search?query=Tarikh+al-Sudan"],
    significance:
      "Core source for the written historical tradition of Timbuktu and the western Sahel.",
  },
  {
    id: 570,
    title: "Tarikh al-Fattash",
    author: "Mahmud Kati and later compilers",
    yearPublished: 1665,
    language: "Arabic",
    region: "West Africa",
    country: "Mali",
    genre: "Chronicle",
    era: "Pre-colonial",
    description:
      "A Sahelian chronicle associated with Timbuktu's scholarly families, preserving histories of Mali, Songhay, clerical lineages, and political authority.",
    accessLinks: ["https://archive.org/search?query=Tarikh+al-Fattash"],
    significance:
      "One of the major Arabic manuscript traditions for precolonial West African history.",
  },
  {
    id: 571,
    title: "Utendi wa Tambuka",
    author: "Bwana Mwengo",
    yearPublished: 1728,
    language: "Swahili",
    region: "East Africa",
    country: "Kenya",
    genre: "Epic Poem",
    era: "Pre-colonial",
    description:
      "A Swahili epic poem composed in Arabic script, narrating Islamic battles and embedding coastal East African poetics, memory, and literary form.",
    accessLinks: ["https://en.wikipedia.org/wiki/Utendi_wa_Tambuka"],
    significance:
      "Among the earliest known extended works of Swahili literature.",
  },
  {
    id: 572,
    title: "The Chronicle of Kilwa",
    author: "Swahili coastal chronicle tradition",
    yearPublished: 1520,
    language: "Arabic and Swahili traditions",
    region: "East Africa",
    country: "Tanzania",
    genre: "Chronicle",
    era: "Pre-colonial",
    description:
      "Chronicle traditions concerning the rulers, trade networks, Islamization, and maritime power of Kilwa on the Swahili coast.",
    accessLinks: ["https://en.wikipedia.org/wiki/Kilwa_Chronicle"],
    significance:
      "Key source for Indian Ocean African urban history and coastal political memory.",
  },
  {
    id: 573,
    title: "Dahomean Historical Traditions",
    author: "Dahomean oral historians",
    yearPublished: 1750,
    language: "Fon oral tradition",
    region: "West Africa",
    country: "Benin",
    genre: "Oral History",
    era: "Pre-colonial",
    description:
      "Royal and popular oral traditions preserving histories of the Kingdom of Dahomey, its institutions, military organization, sacred kingship, and political memory.",
    accessLinks: ["https://archive.org/search?query=Dahomey+oral+tradition"],
    significance:
      "Important archive for understanding West African state formation beyond colonial records.",
  },
  {
    id: 574,
    title: "Pumzi",
    author: "Wanuri Kahiu",
    yearPublished: 2009,
    language: "English and Kiswahili",
    region: "East Africa",
    country: "Kenya",
    genre: "Film",
    era: "Contemporary",
    description:
      "A Kenyan speculative short film set after ecological catastrophe, following a curator who discovers a seed and imagines life beyond a sealed authoritarian society.",
    accessLinks: ["https://en.wikipedia.org/wiki/Pumzi"],
    significance:
      "A landmark work of continental African science fiction and ecofuturism.",
  },
  {
    id: 575,
    title: "A Killing in the Sun",
    author: "Dilman Dila",
    yearPublished: 2014,
    language: "English",
    region: "East Africa",
    country: "Uganda",
    genre: "Speculative Fiction",
    era: "Contemporary",
    description:
      "A collection of speculative stories blending Ugandan settings, folklore, technology, horror, and political imagination.",
    accessLinks: ["https://dilmandila.com/"],
    significance:
      "Important work in the rise of twenty-first-century continental African speculative fiction.",
  },
  {
    id: 576,
    title: "The Silence of the Wilting Skin",
    author: "Tlotlo Tsamaase",
    yearPublished: 2020,
    language: "English",
    region: "Southern Africa",
    country: "Botswana",
    genre: "Speculative Fiction",
    era: "Contemporary",
    description:
      "A surreal speculative novella from Botswana exploring erasure, identity, bodily transformation, and social control.",
    accessLinks: ["https://www.neonhemlock.com/books/the-silence-of-the-wilting-skin"],
    significance:
      "A major contemporary Botswanan voice in African speculative fiction.",
  },
  {
    id: 577,
    title: "David Mogo, Godhunter",
    author: "Suyi Davies Okungbowa",
    yearPublished: 2019,
    language: "English",
    region: "West Africa",
    country: "Nigeria",
    genre: "Speculative Fiction",
    era: "Contemporary",
    description:
      "A Lagos-set godpunk novel in which a demigod mercenary navigates deities, urban survival, and spiritual power after gods fall to earth.",
    accessLinks: ["https://suyidavies.com/books/david-mogo-godhunter/"],
    significance:
      "Continental urban fantasy that puts Lagos, Yoruba cosmology, and contemporary Nigerian city life at the center of the genre.",
  },
  {
    id: 578,
    title: "The Lies of the Ajungo",
    author: "Moses Ose Utomi",
    yearPublished: 2023,
    language: "English",
    region: "West Africa",
    country: "Nigeria",
    genre: "Speculative Fiction",
    era: "Contemporary",
    description:
      "A desert fantasy novella about water, sacrifice, empire, myth, and the stories power tells to preserve itself.",
    accessLinks: ["https://us.macmillan.com/books/9781250849060/theliesoftheajungo/"],
    significance:
      "Part of a new wave of African fantasy centered on political mythmaking and ecological scarcity.",
  },
  {
    id: 579,
    title: "Jalada 02: Afrofuture(s)",
    author: "Jalada Africa collective",
    yearPublished: 2015,
    language: "English",
    region: "East Africa",
    country: "Kenya",
    genre: "Anthology",
    era: "Contemporary",
    description:
      "A Jalada Africa anthology of speculative futures from African writers, artists, and editors working across the continent and diaspora.",
    accessLinks: ["https://jaladaafrica.org/"],
    significance:
      "A key collective intervention in African futures writing and literary-network building.",
  },
  {
    id: 580,
    title: "Freshwater",
    author: "Akwaeke Emezi",
    yearPublished: 2018,
    language: "English",
    region: "West Africa",
    country: "Nigeria",
    genre: "Fiction",
    era: "Contemporary",
    description:
      "A novel drawing on Igbo ontology and embodiment to narrate selfhood, spirit, fracture, and survival through the life of Ada.",
    accessLinks: ["https://www.akwaeke.com/freshwater"],
    significance:
      "A major contemporary work connecting African cosmology, gender, body, and experimental narrative form.",
  },
  {
    id: 581,
    title: "Lagoon",
    author: "Nnedi Okorafor",
    yearPublished: 2014,
    language: "English",
    region: "West Africa",
    country: "Nigeria",
    genre: "Speculative Fiction",
    era: "Contemporary",
    description:
      "A first-contact novel set in Lagos, combining alien arrival, marine life, Nigerian urban systems, pidgin, and local spiritual ecologies.",
    accessLinks: ["https://nnedi.com/books/lagoon/"],
    significance:
      "One of the clearest bridges between diaspora Afrofuturism and Africanfuturism rooted in a specific African city.",
  },
  {
    id: 582,
    title: "After the Flare",
    author: "Deji Bryce Olukotun",
    yearPublished: 2017,
    language: "English",
    region: "West Africa",
    country: "Nigeria",
    genre: "Science Fiction",
    era: "Contemporary",
    description:
      "A science-fiction novel set around a Nigerian space program after a solar catastrophe, mixing technological ambition, politics, and crisis.",
    accessLinks: ["https://dejiolukotun.com/after-the-flare/"],
    significance:
      "Centers African space futures and Nigerian technological imagination.",
  },
]

const works = [...RAW_WORKS, ...ARCHIVE_EXPANSION_WORKS]
  .filter((work) => !EXCLUDED_WORK_IDS.has(work.id) && !DUPLICATE_WORK_IDS.has(work.id))
  .map((work) => ({ ...work, ...(WORK_OVERRIDES[work.id] ?? {}) }))
  .sort((a, b) => a.id - b.id)

function normalizeEra(value: string): string {
  const lower = value.toLowerCase()
  if (lower.includes("pre-colonial")) return "pre-colonial"
  return lower
}

function matchesKeyword(corpus: string, keyword: string): boolean {
  if (keyword.length <= 4 && /^[a-z]+$/.test(keyword)) {
    return new RegExp(`(^|[^a-z])${keyword}([^a-z]|$)`).test(corpus)
  }

  return corpus.includes(keyword)
}

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
    const searchableCorpus = rule.slug === "colonialism"
      ? corpus.replace(/pre[- ]colonial/g, "")
      : corpus
    if (rule.keywords.some((keyword) => matchesKeyword(searchableCorpus, keyword))) {
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
  const normalized = normalizeEra(era)
  return works.filter((work) => normalizeEra(work.era) === normalized)
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

export const getWorksByThemeSlug = (slug: string): LiteratureWork[] => {
  return works
    .filter((work) => classifyThemes(work).some((item) => item.slug === slug))
    .sort((a, b) => a.yearPublished - b.yearPublished)
}

export const getWorksByThemeSlugs = (slugs: string[], limit = 8): LiteratureWork[] => {
  const wanted = new Set(slugs)
  return works
    .map((work) => ({
      work,
      matches: classifyThemes(work).filter((item) => wanted.has(item.slug)).length,
    }))
    .filter((item) => item.matches > 0)
    .sort((a, b) => b.matches - a.matches || a.work.yearPublished - b.work.yearPublished)
    .slice(0, limit)
    .map((item) => item.work)
}

const INDICATOR_THEME_MAP: Record<string, { slugs: string[]; reason: string }> = {
  "poverty-headcount-215": {
    slugs: ["class-poverty", "political-theory", "decolonization"],
    reason: "Poverty and development outcomes connect to class, extraction, postcolonial economics, and political economy.",
  },
  "safe-water-access": {
    slugs: ["nature-land", "class-poverty"],
    reason: "Water access connects environmental infrastructure, inequality, and everyday welfare.",
  },
  "electricity-access": {
    slugs: ["class-poverty", "political-theory"],
    reason: "Electricity access is an infrastructure and development capacity question.",
  },
  "literacy-adult": {
    slugs: ["education", "decolonization"],
    reason: "Literacy connects to education, liberation, and intellectual self-determination.",
  },
  "secondary-completion": {
    slugs: ["education", "feminism"],
    reason: "School completion connects education, gender, and intergenerational opportunity.",
  },
  "life-expectancy": {
    slugs: ["family-community", "class-poverty"],
    reason: "Health outcomes connect to community wellbeing, poverty, and development.",
  },
  "under5-mortality": {
    slugs: ["family-community", "class-poverty"],
    reason: "Child survival connects to family wellbeing, poverty, and public health capacity.",
  },
  "maternal-mortality": {
    slugs: ["feminism", "family-community", "class-poverty"],
    reason: "Maternal mortality connects gender, health systems, and structural inequality.",
  },
  "stunting": {
    slugs: ["family-community", "nature-land", "class-poverty"],
    reason: "Child nutrition connects food systems, land, poverty, and household wellbeing.",
  },
  "gdp-per-capita": {
    slugs: ["class-poverty", "political-theory", "decolonization"],
    reason: "Income levels connect to political economy, underdevelopment, and postcolonial development strategy.",
  },
  "unemployment-youth": {
    slugs: ["class-poverty", "education", "resistance"],
    reason: "Youth unemployment connects education, class, urban pressure, and political possibility.",
  },
  "manufacturing-gdp": {
    slugs: ["class-poverty", "political-theory", "decolonization"],
    reason: "Industrialisation connects economic sovereignty, labour, and development policy.",
  },
  "cereal-yield": {
    slugs: ["nature-land", "class-poverty"],
    reason: "Agricultural productivity connects land, food security, rural life, and poverty.",
  },
  "undernourishment": {
    slugs: ["nature-land", "class-poverty", "family-community"],
    reason: "Hunger connects food systems, land, poverty, and household survival.",
  },
  "co2-per-capita": {
    slugs: ["nature-land", "political-theory", "afrofuturism"],
    reason: "Climate questions connect land, environment, governance, and futures.",
  },
  "forest-area": {
    slugs: ["nature-land", "religion-spirituality"],
    reason: "Forest cover connects land, ecology, cosmology, and climate resilience.",
  },
  "renewable-energy-share": {
    slugs: ["nature-land", "afrofuturism", "political-theory"],
    reason: "Energy transition connects ecological futures, infrastructure, and political economy.",
  },
  "internet-users": {
    slugs: ["education", "afrofuturism"],
    reason: "Internet access connects knowledge systems, digital infrastructure, and futures.",
  },
  "mobile-subscriptions": {
    slugs: ["education", "afrofuturism"],
    reason: "Mobile connectivity connects communication, knowledge access, and digital futures.",
  },
  "women-parliament": {
    slugs: ["feminism", "political-theory", "resistance"],
    reason: "Women's representation connects gender, governance, power, and liberation movements.",
  },
  "female-labor-participation": {
    slugs: ["feminism", "class-poverty"],
    reason: "Women's labour force participation connects gender justice, work, and economic power.",
  },
  "iiag-overall": {
    slugs: ["political-theory", "postcolonial-theory", "decolonization", "resistance"],
    reason: "Governance connects postcolonial state power, legitimacy, accountability, and resistance.",
  },
}

export function getRelatedWorksForIndicator(indicatorId: string, limit = 8) {
  const mapping = INDICATOR_THEME_MAP[indicatorId]
  if (!mapping) return []
  return getWorksByThemeSlugs(mapping.slugs, limit).map((work) => ({
    id: work.id,
    title: work.title,
    author: work.author,
    yearPublished: work.yearPublished,
    region: work.region,
    genre: work.genre,
    era: work.era,
    reason: mapping.reason,
  }))
}

export function getRelatedIndicatorsForWork(workId: number) {
  const work = getWorkById(workId)
  if (!work) return []
  const workThemeSlugs = new Set(classifyThemes(work).map((theme) => theme.slug))
  return Object.entries(INDICATOR_THEME_MAP)
    .filter(([, mapping]) => mapping.slugs.some((slug) => workThemeSlugs.has(slug)))
    .slice(0, 8)
    .map(([id, mapping]) => ({
      id,
      name: id
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
      layer: "present" as const,
      reason: mapping.reason,
    }))
}

export const getEnrichedWorkData = (workId: number): EnrichedWorkData => {
  const work = getWorkById(workId)
  if (!work) {
    return { themes: [], indicators: [], relations: [], readingLists: [] }
  }

  return {
    themes: classifyThemes(work),
    indicators: getRelatedIndicatorsForWork(workId),
    relations: [],
    readingLists: [],
  }
}
