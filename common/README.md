# Common — A legal architecture for Africa's single digital market

> A movement to integrate Africa's 14 startup acts into one coherent legal architecture.
> Inspired by [EU-Inc](https://www.eu-inc.org/). Grounded in the policy paper *Integrating Africa's Startup Acts: Building a Legal Architecture for a Single Digital Market*.

## What this is

Africa already has **6 enacted startup acts** (Tunisia, Senegal, Nigeria, DRC, Ivory Coast, Ethiopia) and **8 in development** (Algeria, Kenya, Ghana, Morocco, Rwanda, South Africa, Uganda, Egypt) — covering 75–78% of African GDP. They look strikingly similar (all use labelling, all set 5–10 year age limits, all promise tax holidays, all create an oversight body) but **they don't talk to each other**. A startup labelled in Senegal gets no automatic recognition in Ivory Coast even though both are ECOWAS, OHADA, and UEMOA members.

Common is a movement to fix that. Four pillars:

| Layer | Surface in this app |
|---|---|
| **Industry** — Pan-African Startup Entity (PASE) | `/entity` — open-source model corporate clauses for both common-law and OHADA jurisdictions |
| **Regional** — Startup Passport | `/acts` (passport coverage indicator) — building on the Ghana–Rwanda Fintech Passport (Feb 2025) |
| **National** — Surgical code fixes | `/acts/[country]` — per-country known gaps and proposed amendments |
| **Continental** — Enhanced AU Model Law | (planned) — annotated AU Model Law with implementation specifications |

Plus a **manifesto + signatory wall** at `/` and `/sign`.

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS v4
- Prisma 6 + PostgreSQL (Supabase recommended)
- Markdown clauses rendered server-side with `marked`

## Getting started

```bash
cd common
npm install
cp .env.example .env.local
# Fill in your Supabase DATABASE_URL + DIRECT_URL
npx prisma db push
npm run dev
```

The site will load with all content (manifesto, acts table, clause library) even without a database — only the signatory features require Supabase to be configured.

## Repository structure

```
common/
├── app/
│   ├── page.tsx                       # Manifesto
│   ├── sign/page.tsx                  # Sign form
│   ├── signatories/page.tsx           # Public wall
│   ├── acts/page.tsx                  # Comparison table
│   ├── acts/[iso]/page.tsx            # Per-country detail
│   ├── entity/page.tsx                # PASE clause library index
│   ├── entity/[slug]/page.tsx         # Individual clause page
│   └── api/sign/route.ts              # Signatory submission
├── data/
│   ├── startup-acts.json              # 14 acts — clause-level metadata
│   └── clauses.json                   # PASE clause manifest
├── content/clauses/                   # Model clause markdown
│   ├── multi-class-shares.common-law.md
│   ├── multi-class-shares.ohada.md
│   ├── safe.common-law.md
│   └── safe.ohada.md
├── prisma/schema.prisma               # Signatory model
└── lib/                               # data, prisma, markdown helpers
```

## What's included in this v0 scaffold

✅ Manifesto landing page with the four pillars  
✅ `/sign` form + `/api/sign` POST endpoint (Prisma upsert by email)  
✅ Public signatory wall (`/signatories`)  
✅ Filterable acts table (`/acts`) covering all 14 jurisdictions  
✅ Per-country detail pages with known gaps and recommendations  
✅ Two PASE clauses — multi-class shares and SAFE — each in common-law and OHADA versions  

## What's deferred

- Email verification on sign (currently `verified: false` by default)
- Detailed per-country recommendation engine (needs the dense underlying paper)
- More PASE clauses (ESOP, convertible notes, founder vesting, cross-border holding)
- Annotated AU Model Law page (`/model-law`)
- API for government labelling-portal integration (Recommendation #1 from the paper)

## License

MIT. Built openly so the AU, RECs, UNDP/timbuktoo, and any African government drafting a startup act can use, fork, or adopt any part of it.

## Credits

Source paper: *Integrating Africa's Startup Acts: Building a Legal Architecture for a Single Digital Market* — the clause-by-clause analysis of 6 enacted + 8 in-development startup acts that underpins every page on this site.
