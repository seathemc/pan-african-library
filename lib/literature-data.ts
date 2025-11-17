import literatureData from '@/pan-african-literature-database.json'

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

export const getAllWorks = (): LiteratureWork[] => {
  return literatureData.panAfricanLiterature.works
}

export const getWorkById = (id: number): LiteratureWork | undefined => {
  return literatureData.panAfricanLiterature.works.find(work => work.id === id)
}

export const getWorksByRegion = (region: string): LiteratureWork[] => {
  return literatureData.panAfricanLiterature.works.filter(
    work => work.region.toLowerCase() === region.toLowerCase()
  )
}

export const getWorksByEra = (era: string): LiteratureWork[] => {
  return literatureData.panAfricanLiterature.works.filter(
    work => work.era.toLowerCase() === era.toLowerCase()
  )
}

export const getWorksByGenre = (genre: string): LiteratureWork[] => {
  return literatureData.panAfricanLiterature.works.filter(
    work => work.genre.toLowerCase() === genre.toLowerCase()
  )
}

export const getRegions = (): string[] => {
  const regions = new Set(literatureData.panAfricanLiterature.works.map(work => work.region))
  return Array.from(regions).sort()
}

export const getEras = (): string[] => {
  const eras = new Set(literatureData.panAfricanLiterature.works.map(work => work.era))
  return Array.from(eras).sort()
}

export const getGenres = (): string[] => {
  const genres = new Set(literatureData.panAfricanLiterature.works.map(work => work.genre))
  return Array.from(genres).sort()
}
