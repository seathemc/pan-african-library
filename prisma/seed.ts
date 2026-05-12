import { PrismaClient } from '@prisma/client'
import literatureData from '../pan-african-literature-database.json'

const prisma = new PrismaClient()

// ─── Theme classification ─────────────────────────────────────────────────────
// Maps keywords found in description/significance/genre/era → theme slugs.

const THEME_RULES: Array<{ slug: string; name: string; keywords: string[] }> = [
  { slug: 'colonialism',       name: 'Colonialism',             keywords: ['colonial', 'colonialism', 'colonization', 'colonised', 'colonial rule', 'british empire', 'french empire'] },
  { slug: 'decolonization',    name: 'Decolonization',          keywords: ['decoloni', 'independence', 'anti-colonial', 'liberation struggle', 'freedom struggle', 'self-determination'] },
  { slug: 'identity',          name: 'Identity & Belonging',    keywords: ['identity', 'belonging', 'diaspora', 'double consciousness', 'cultural identity', 'self-hood'] },
  { slug: 'feminism',          name: 'Feminism & Gender',       keywords: ['feminist', 'feminism', 'gender', 'patriarchy', 'womanhood', 'women', 'female oppression', 'black feminist'] },
  { slug: 'race-racism',       name: 'Race & Racism',           keywords: ['race', 'racism', 'racial', 'segregation', 'apartheid', 'jim crow', 'white supremacy', 'racial injustice', 'racial violence'] },
  { slug: 'pan-africanism',    name: 'Pan-Africanism',          keywords: ['pan-african', 'pan african', 'african unity', 'negritude', 'african consciousness', 'african nationalism'] },
  { slug: 'slavery',           name: 'Slavery & Abolition',     keywords: ['slave', 'slavery', 'enslaved', 'plantation', 'abolitionist', 'middle passage', 'bondage'] },
  { slug: 'religion-spirituality', name: 'Religion & Spirituality', keywords: ['religion', 'spiritual', 'islam', 'christianity', 'traditional religion', 'ancestors', 'ritual', 'faith'] },
  { slug: 'migration',         name: 'Migration & Exile',       keywords: ['migrat', 'exile', 'displacement', 'refugee', 'immigrant', 'leaving home', 'return'] },
  { slug: 'oral-tradition',    name: 'Oral Tradition',          keywords: ['oral tradition', 'griot', 'storytelling', 'folklore', 'oral history', 'proverb'] },
  { slug: 'resistance',        name: 'Resistance & Revolution', keywords: ['resistance', 'revolution', 'revolt', 'uprising', 'rebellion', 'black power', 'civil rights'] },
  { slug: 'family-community',  name: 'Family & Community',      keywords: ['family', 'community', 'kinship', 'village', 'generational', 'ancestors'] },
  { slug: 'education',         name: 'Education & Knowledge',   keywords: ['education', 'school', 'learning', 'literacy', 'university', 'intellectual'] },
  { slug: 'postcolonial-theory', name: 'Postcolonial Theory',   keywords: ['postcolonial', 'hybridity', 'subaltern', 'frantz fanon', 'orientalism', 'empire writes back'] },
  { slug: 'afrofuturism',      name: 'Afrofuturism',            keywords: ['afrofuturism', 'afrofuturist', 'speculative', 'science fiction', 'dystopia', 'utopia'] },
  { slug: 'class-poverty',     name: 'Class & Poverty',         keywords: ['class', 'poverty', 'working class', 'capitalism', 'economic inequality', 'exploitation'] },
  { slug: 'war-conflict',      name: 'War & Conflict',          keywords: ['war', 'conflict', 'civil war', 'genocide', 'violence', 'massacre', 'battle'] },
  { slug: 'harlem-renaissance', name: 'Harlem Renaissance',     keywords: ['harlem renaissance', 'harlem', 'new negro', '1920s', '1930s'] },
  { slug: 'autobiography',     name: 'Autobiography & Memory',  keywords: ['autobiography', 'memoir', 'memory', 'self-portrait', 'coming of age', 'bildungsroman'] },
  { slug: 'nature-land',       name: 'Nature & Land',           keywords: ['land', 'nature', 'earth', 'environment', 'landscape', 'agriculture'] },
  { slug: 'political-theory',  name: 'Political Theory',        keywords: ['political', 'marxism', 'socialism', 'democracy', 'governance', 'imperialism'] },
]

function classifyThemes(work: {
  title: string
  genre: string
  era: string
  description: string
  significance?: string | null
  region: string
}): string[] {
  const corpus = [
    work.title,
    work.genre,
    work.era,
    work.description,
    work.significance ?? '',
    work.region,
  ].join(' ').toLowerCase()

  const matched = new Set<string>()
  for (const rule of THEME_RULES) {
    if (rule.keywords.some(kw => corpus.includes(kw))) {
      matched.add(rule.slug)
    }
  }

  // Era-based theme overrides
  if (work.era === 'Harlem Renaissance') matched.add('harlem-renaissance')
  if (work.genre === 'Autobiography')   matched.add('autobiography')
  if (work.genre === 'Folklore')        matched.add('oral-tradition')

  return Array.from(matched)
}

// ─── Reading lists ────────────────────────────────────────────────────────────

const READING_LISTS: Array<{
  title: string
  slug: string
  description: string
  workTitles: Array<{ title: string; author: string; note?: string }>
}> = [
  {
    title: 'Foundations of African Literature',
    slug: 'foundations-african-literature',
    description: 'The essential texts every reader of African literature should encounter first — works that defined the canon and opened the world to African voices.',
    workTitles: [
      { title: 'Things Fall Apart',            author: 'Chinua Achebe',            note: 'The novel that changed how the world sees Africa.' },
      { title: 'Weep Not, Child',               author: 'Ngũgĩ wa Thiong\'o',       note: 'First novel in English by an East African writer.' },
      { title: 'Half of a Yellow Sun',          author: 'Chimamanda Ngozi Adichie', note: 'A modern masterpiece on the Biafran War.' },
      { title: 'Nervous Conditions',            author: 'Tsitsi Dangarembga',       note: 'Landmark feminist voice from Zimbabwe.' },
      { title: 'So Long a Letter',              author: 'Mariama Bâ',               note: 'Senegal\'s most celebrated epistolary novel.' },
      { title: 'Woman at Point Zero',           author: 'Nawal El Saadawi',         note: 'Egypt\'s pioneering feminist novel.' },
    ],
  },
  {
    title: 'The Harlem Renaissance',
    slug: 'harlem-renaissance',
    description: 'The explosion of African American art, literature, and thought in 1920s-1930s New York that transformed Black cultural identity.',
    workTitles: [
      { title: 'Their Eyes Were Watching God',  author: 'Zora Neale Hurston',       note: 'The crown jewel of Harlem Renaissance fiction.' },
      { title: 'The Weary Blues',               author: 'Langston Hughes',          note: 'Hughes\'s debut — jazz, blues, and Black life in verse.' },
      { title: 'Cane',                          author: 'Jean Toomer',              note: 'A genre-defying hybrid of poetry, prose, and drama.' },
      { title: 'Quicksand',                     author: 'Nella Larsen',             note: 'A razor-sharp study of race and identity.' },
      { title: 'Passing',                       author: 'Nella Larsen',             note: 'Larsen\'s compact, devastating second novel.' },
    ],
  },
  {
    title: 'African Feminist Voices',
    slug: 'african-feminist-voices',
    description: 'Works by African and diaspora women writers and theorists who reshaped feminism from their own ground.',
    workTitles: [
      { title: 'Ain\'t I a Woman',              author: 'bell hooks',               note: 'The founding text of Black feminist analysis.' },
      { title: 'Sister Outsider',               author: 'Audre Lorde',              note: 'Essays and speeches that remain urgently alive.' },
      { title: 'We Should All Be Feminists',    author: 'Chimamanda Ngozi Adichie', note: 'The manifesto that reached millions.' },
      { title: 'Nervous Conditions',            author: 'Tsitsi Dangarembga',       note: 'Colonialism and gender under one roof.' },
      { title: 'Woman at Point Zero',           author: 'Nawal El Saadawi',         note: 'Patriarchy laid bare.' },
    ],
  },
  {
    title: 'Pan-Africanism & Independence',
    slug: 'pan-africanism-independence',
    description: 'The philosophical and political texts that drove the African independence movements of the 20th century.',
    workTitles: [
      { title: 'The Wretched of the Earth',     author: 'Frantz Fanon',             note: 'The bible of anti-colonial thought.' },
      { title: 'Neo-Colonialism',               author: 'Kwame Nkrumah',            note: 'Ghana\'s founding father on Africa\'s next struggle.' },
      { title: 'How Europe Underdeveloped Africa', author: 'Walter Rodney',          note: 'The definitive economic history of colonial extraction.' },
      { title: 'Long Walk to Freedom',          author: 'Nelson Mandela',           note: 'The autobiography of the century.' },
    ],
  },
  {
    title: 'Afrofuturism',
    slug: 'afrofuturism',
    description: 'Science fiction, speculative fiction, and visionary writing by African and diaspora authors imagining liberated Black futures.',
    workTitles: [
      { title: 'Kindred',                       author: 'Octavia E. Butler',        note: 'Time travel as a meditation on slavery.' },
      { title: 'Parable of the Sower',          author: 'Octavia E. Butler',        note: 'Prophetic and terrifyingly prescient.' },
      { title: 'Bloodchild',                    author: 'Octavia E. Butler',        note: 'Butler\'s acclaimed short fiction collection.' },
    ],
  },
  {
    title: 'Civil Rights & Black Power',
    slug: 'civil-rights-black-power',
    description: 'Literature and thought from the American civil rights and Black Power movements — essential voices of resistance.',
    workTitles: [
      { title: 'The Fire Next Time',            author: 'James Baldwin',            note: 'Baldwin at his most urgent and prophetic.' },
      { title: 'The Autobiography of Malcolm X', author: 'Malcolm X',              note: 'One of the most important autobiographies ever written.' },
      { title: 'I Know Why the Caged Bird Sings', author: 'Maya Angelou',          note: 'Angelou\'s astonishing memoir.' },
      { title: 'Notes of a Native Son',         author: 'James Baldwin',           note: 'The essays that made Baldwin.' },
    ],
  },
]

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Seeding Alexandria database...\n')

  // 1. Upsert all themes
  console.log('Creating themes...')
  for (const rule of THEME_RULES) {
    await prisma.theme.upsert({
      where:  { slug: rule.slug },
      create: { name: rule.name, slug: rule.slug },
      update: { name: rule.name },
    })
  }
  console.log(`  ✓ ${THEME_RULES.length} themes ready\n`)

  // 2. Upsert works
  console.log('Seeding works...')
  const works = literatureData.panAfricanLiterature.works
  const workIdMap = new Map<string, number>() // "Title|Author" → db id

  for (const work of works) {
    const key = `${work.title}|${work.author}`

    // Detect translation info from language field
    const isTranslation = work.language.toLowerCase().includes('translated')
    const originalLanguage = isTranslation
      ? work.language.split('(')[0].trim()
      : undefined
    const language = isTranslation ? 'English' : work.language

    const upserted = await prisma.work.upsert({
      where:  { id: work.id },
      create: {
        id:               work.id,
        title:            work.title,
        author:           work.author,
        yearPublished:    work.yearPublished,
        language,
        originalLanguage: originalLanguage ?? null,
        region:           work.region,
        country:          work.country,
        genre:            work.genre,
        era:              work.era,
        description:      work.description,
        significance:     work.significance ?? null,
        accessLinks: {
          create: (work.accessLinks ?? []).map((url: string) => ({
            url,
            type: url.includes('archive.org') ? 'archive'
                : url.includes('.pdf')        ? 'pdf'
                : 'web',
          })),
        },
      },
      update: {
        title:            work.title,
        author:           work.author,
        yearPublished:    work.yearPublished,
        language,
        originalLanguage: originalLanguage ?? null,
        region:           work.region,
        country:          work.country,
        genre:            work.genre,
        era:              work.era,
        description:      work.description,
        significance:     work.significance ?? null,
      },
    })

    workIdMap.set(key, upserted.id)

    // Attach themes
    const themeSlugs = classifyThemes(work)
    for (const slug of themeSlugs) {
      const theme = await prisma.theme.findUnique({ where: { slug } })
      if (!theme) continue
      await prisma.workTheme.upsert({
        where:  { workId_themeId: { workId: upserted.id, themeId: theme.id } },
        create: { workId: upserted.id, themeId: theme.id },
        update: {},
      })
    }
  }
  console.log(`  ✓ ${works.length} works seeded\n`)

  // 3. Same-author series relations (Achebe African Trilogy, Ngugi, etc.)
  console.log('Creating work relations...')
  const seriesGroups: Array<Array<{ title: string; author: string }>> = [
    [
      { title: 'Things Fall Apart',    author: 'Chinua Achebe' },
      { title: 'No Longer at Ease',    author: 'Chinua Achebe' },
      { title: 'Arrow of God',         author: 'Chinua Achebe' },
    ],
    [
      { title: 'Weep Not, Child',      author: 'Ngũgĩ wa Thiong\'o' },
      { title: 'The River Between',    author: 'Ngũgĩ wa Thiong\'o' },
    ],
    [
      { title: 'Parable of the Sower', author: 'Octavia E. Butler' },
      { title: 'Parable of the Talents', author: 'Octavia E. Butler' },
    ],
    [
      { title: 'Notes of a Native Son',  author: 'James Baldwin' },
      { title: 'The Fire Next Time',     author: 'James Baldwin' },
      { title: 'Nobody Knows My Name',   author: 'James Baldwin' },
    ],
  ]

  let relationsCreated = 0
  for (const group of seriesGroups) {
    for (let i = 0; i < group.length; i++) {
      for (let j = 0; j < group.length; j++) {
        if (i === j) continue
        const fromId = workIdMap.get(`${group[i].title}|${group[i].author}`)
        const toId   = workIdMap.get(`${group[j].title}|${group[j].author}`)
        if (!fromId || !toId) continue
        await prisma.workRelation.upsert({
          where:  { fromWorkId_toWorkId_type: { fromWorkId: fromId, toWorkId: toId, type: 'same_series' } },
          create: { fromWorkId: fromId, toWorkId: toId, type: 'same_series' },
          update: {},
        })
        relationsCreated++
      }
    }
  }

  // Influence relations
  const influences: Array<{ from: { title: string; author: string }; to: { title: string; author: string } }> = [
    { from: { title: 'Things Fall Apart', author: 'Chinua Achebe' }, to: { title: 'Half of a Yellow Sun', author: 'Chimamanda Ngozi Adichie' } },
    { from: { title: 'Their Eyes Were Watching God', author: 'Zora Neale Hurston' }, to: { title: 'The Color Purple', author: 'Alice Walker' } },
    { from: { title: 'Invisible Man', author: 'Ralph Ellison' }, to: { title: 'Go Tell It on the Mountain', author: 'James Baldwin' } },
  ]

  for (const rel of influences) {
    const fromId = workIdMap.get(`${rel.from.title}|${rel.from.author}`)
    const toId   = workIdMap.get(`${rel.to.title}|${rel.to.author}`)
    if (!fromId || !toId) continue
    await prisma.workRelation.upsert({
      where:  { fromWorkId_toWorkId_type: { fromWorkId: toId, toWorkId: fromId, type: 'influenced_by' } },
      create: { fromWorkId: toId, toWorkId: fromId, type: 'influenced_by' },
      update: {},
    })
    relationsCreated++
  }
  console.log(`  ✓ ${relationsCreated} work relations created\n`)

  // 4. Reading lists
  console.log('Creating reading lists...')
  for (const list of READING_LISTS) {
    const rl = await prisma.readingList.upsert({
      where:  { slug: list.slug },
      create: { title: list.title, slug: list.slug, description: list.description },
      update: { title: list.title, description: list.description },
    })

    let position = 1
    for (const entry of list.workTitles) {
      const dbId = workIdMap.get(`${entry.title}|${entry.author}`)
      if (!dbId) {
        console.warn(`    ⚠ Not found: "${entry.title}" by ${entry.author}`)
        continue
      }
      await prisma.readingListWork.upsert({
        where:  { readingListId_workId: { readingListId: rl.id, workId: dbId } },
        create: { readingListId: rl.id, workId: dbId, position, note: entry.note ?? null },
        update: { position, note: entry.note ?? null },
      })
      position++
    }
    console.log(`  ✓ "${list.title}"`)
  }

  console.log('\nAlexandria seed complete.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
