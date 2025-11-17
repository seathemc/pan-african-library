import { PrismaClient } from '@prisma/client'
import literatureData from '../pan-african-literature-database.json'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database with pan-African literature...')

  const works = literatureData.panAfricanLiterature.works

  for (const work of works) {
    const createdWork = await prisma.work.create({
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
          create: work.accessLinks.map((url: string) => ({
            url,
            type: url.includes('archive.org') ? 'archive' : url.includes('.pdf') ? 'pdf' : 'web'
          }))
        }
      }
    })
    console.log(`Created: ${createdWork.title}`)
  }

  console.log(`\nSeeding complete! Added ${works.length} works to the database.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
