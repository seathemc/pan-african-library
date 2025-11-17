const { PrismaClient } = require('@prisma/client')
const literatureData = require('../pan-african-literature-database.json')

const prisma = new PrismaClient()

async function main() {
  console.log('Adding new entries to database...')

  const works = literatureData.panAfricanLiterature.works
  let added = 0
  let skipped = 0

  for (const work of works) {
    // Check if work already exists (by title and author)
    const existing = await prisma.work.findFirst({
      where: {
        title: work.title,
        author: work.author
      }
    })

    if (existing) {
      skipped++
      continue
    }

    // Add new work
    await prisma.work.create({
      data: {
        title: work.title,
        author: work.author,
        yearPublished: work.yearPublished,
        language: work.language,
        region: work.region,
        country: work.country,
        genre: work.genre,
        era: work.era,
        description: work.description,
        significance: work.significance || null,
        accessLinks: {
          create: work.accessLinks
            .filter((url: string) => url.startsWith('http'))
            .map((url: string) => ({
              url,
              type: url.includes('archive.org') ? 'archive' : url.includes('.pdf') ? 'pdf' : 'web'
            }))
        }
      }
    })
    console.log(`✅ Added: ${work.title} by ${work.author}`)
    added++
  }

  console.log(`\n✨ Done! Added ${added} new works, skipped ${skipped} existing works.`)

  const total = await prisma.work.count()
  console.log(`📚 Total works in database: ${total}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
