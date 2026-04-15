# Alexandria — Pan-African Library

**[pan-african-library.vercel.app](https://pan-african-library.vercel.app)**

A digital archive of pan-African thought, paired with a live data dashboard for Africa's future.

56 works. 116 metrics. One open-source project.

---

## What This Is

**Alexandria** has two parts:

**The Archive** — A searchable library of 56 significant works of pan-African literature and thought. From Frederick Douglass and Aimé Césaire to Chimamanda Ngozi Adichie and Teju Cole. Organised by region, era, language, and genre — with direct links to freely accessible copies where they exist.

**Africa 2050** — A data dashboard built from projections sourced from the UN, World Bank, IMF, WHO, and IEA. 116 metrics covering population, GDP, electricity access, internet penetration, and life satisfaction. Pan-African optimism, grounded in data.

The name is deliberate. The Library of Alexandria was lost. Timbuktu's manuscripts were scattered. This is a small attempt in the other direction.

---

## Features

- Browse 56 works across 6 regions and 4 eras
- Individual work pages with author context, significance, and access links
- Filter by region, genre, and era
- Full-text search across the archive
- Africa 2050 charts and projections with source attribution
- Magic link authentication via Supabase
- Fully open source — fork it, host it, build on it

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Database | Supabase (PostgreSQL) |
| ORM | Prisma |
| UI | shadcn/ui + Tailwind CSS |
| Charts | Recharts |
| Auth | Supabase + custom magic link |
| Deployment | Vercel |

---

## Getting Started

**1. Clone and install**

```bash
git clone https://github.com/seathemc/pan-african-library
cd pan-african-library
npm install
```

**2. Set up environment variables**

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials. You'll need:
- A [Supabase](https://supabase.com) project
- The database connection string (from Project Settings → Database)
- The public API key (from Project Settings → API)
- A JWT secret for magic link auth (`openssl rand -base64 32`)

**3. Set up the database**

```bash
npx prisma generate
npx prisma db push
```

To seed the literature database:

```bash
cd prisma && npx ts-node seed.ts
```

**4. Run locally**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
app/
  (marketing)/        Landing page
  (app)/
    browse/           Archive — all 56 works, filterable
    work/[id]/        Individual work page
    africa-2050/      Data dashboard + charts
    search/           Full-text search
    login/            Magic link auth
lib/
  literature-data.ts  Data access layer
  auth.ts             Auth helpers
  supabase.ts         Supabase client
prisma/
  schema.prisma       Database schema
  seed.ts             Seeds the literature database
pan-african-literature-database.json   Source of truth for the 56 works
```

---

## The Database

The `pan-african-literature-database.json` file is the core data asset. 56 works, each with:

```json
{
  "id": 1,
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "yearPublished": 1958,
  "language": "English",
  "region": "West Africa",
  "country": "Nigeria",
  "genre": "Fiction",
  "era": "Post-colonial Era",
  "description": "...",
  "accessLinks": ["https://archive.org/..."],
  "significance": "..."
}
```

This JSON is importable on its own — use it in any project that needs a structured dataset of pan-African literature.

---

## Coverage

**By region:** West Africa (26) · Southern Africa (15) · East Africa (8) · Central Africa (6) · Diaspora (5) · North Africa (3)

**By era:** Post-colonial (25) · Contemporary (24) · Colonial (5) · Negritude (3)

**By language:** English (35) · French (15) · Arabic (3) · Bilingual (3)

---

## Contributing

The archive is incomplete. Notable gaps:

- Works in Swahili, Yoruba, Amharic, and other African languages
- More poetry and drama
- Contemporary voices from Central and East Africa
- Critical essays and literary theory

To add a work: update `pan-african-literature-database.json` following the existing schema, then open a PR.

---

## License

MIT. Open source, for good.

---

*Dedicated to everyone who collected, copied, translated, smuggled, and preserved African knowledge when the easier thing would have been to let it disappear.*
