import type { LiteratureWork } from "@/lib/literature-data";

export type WorkContentStatus =
  | "metadata-only"
  | "excerpt-available"
  | "full-text-available"
  | "research-queued";

export interface WorkContentBlock {
  id: string;
  title: string;
  kind: "editorial-summary" | "excerpt" | "full-text" | "research-note";
  text: string;
  sourceLabel: string;
  sourceUrl: string | null;
  isVerbatim: boolean;
}

export interface WorkContentData {
  status: WorkContentStatus;
  statusLabel: string;
  summary: string;
  availabilityNote: string;
  blocks: WorkContentBlock[];
  lastUpdated: string;
}

type WorkContentSeed = Omit<WorkContentData, "statusLabel">;

const STATUS_LABELS: Record<WorkContentStatus, string> = {
  "metadata-only": "Catalog context only",
  "excerpt-available": "Excerpt available",
  "full-text-available": "Full text available",
  "research-queued": "Research queued",
};

const WORK_CONTENT: Record<number, WorkContentSeed> = {
  9001: {
    status: "excerpt-available",
    summary:
      "Wisdom stores an editorial research note and a short public-domain excerpt anchor for this ancient Egyptian exile-and-return narrative.",
    availabilityNote:
      "Use the linked public-domain translation for the full text; Wisdom stores a short orientation layer for model use.",
    blocks: [
      {
        id: "sinuhe-context",
        title: "Research note",
        kind: "research-note",
        text:
          "The Tale of Sinuhe is useful for questions about exile, political legitimacy, homecoming, and the emotional geography of ancient Egypt. It lets an AI connect African literary history to themes often treated as later Mediterranean or European motifs.",
        sourceLabel: "Wisdom editorial note",
        sourceUrl: null,
        isVerbatim: false,
      },
      {
        id: "sinuhe-public-domain",
        title: "Public-domain source",
        kind: "excerpt",
        text:
          "The linked Project Gutenberg volume contains public-domain translations of Egyptian tales, including Sinuhe. Wisdom should treat the stored text here as a pointer and context layer, not a full internal edition.",
        sourceLabel: "Project Gutenberg, Egyptian Tales",
        sourceUrl: "https://www.gutenberg.org/ebooks/15932",
        isVerbatim: false,
      },
    ],
    lastUpdated: "2026-05-21",
  },
  9002: {
    status: "excerpt-available",
    summary:
      "Wisdom stores context for The Eloquent Peasant as an early African text of justice, rhetoric, and accountability.",
    availabilityNote:
      "Use the public-domain source link for full translation access. The internal block is an editorial guide for tool use.",
    blocks: [
      {
        id: "eloquent-peasant-context",
        title: "Research note",
        kind: "research-note",
        text:
          "This text belongs in political theory and governance searches. It stages justice as something demanded by a non-elite speaker and ties good rule to listening, speech, and moral order.",
        sourceLabel: "Wisdom editorial note",
        sourceUrl: null,
        isVerbatim: false,
      },
    ],
    lastUpdated: "2026-05-21",
  },
  9003: {
    status: "excerpt-available",
    summary:
      "Wisdom stores a research-oriented entry for the Maxims of Ptahhotep, one of the earliest known wisdom-instruction corpora.",
    availabilityNote:
      "The linked source supplies a public-domain translation. Wisdom stores orientation and retrieval context.",
    blocks: [
      {
        id: "ptahhotep-context",
        title: "Research note",
        kind: "research-note",
        text:
          "Use Ptahhotep for leadership ethics, listening, restraint, speech, hierarchy, and justice. It should appear in searches about African philosophy, governance, education, and moral instruction.",
        sourceLabel: "Wisdom editorial note",
        sourceUrl: null,
        isVerbatim: false,
      },
    ],
    lastUpdated: "2026-05-21",
  },
  9004: {
    status: "excerpt-available",
    summary:
      "Wisdom stores context for the Egyptian Book of the Dead as an African religious, ethical, and cosmological archive.",
    availabilityNote:
      "Use the public-domain source link for full text. Internal storage is currently a guide layer, not a complete edition.",
    blocks: [
      {
        id: "book-of-dead-context",
        title: "Research note",
        kind: "research-note",
        text:
          "This corpus is central for questions about judgment, rebirth, ritual speech, body, soul, and moral accounting. It should be connected to spirituality, law, ethics, and ancient Kemet.",
        sourceLabel: "Wisdom editorial note",
        sourceUrl: null,
        isVerbatim: false,
      },
    ],
    lastUpdated: "2026-05-21",
  },
  9005: {
    status: "excerpt-available",
    summary:
      "Wisdom stores a research note for the Kebra Nagast, linking Ethiopian literary tradition, political theology, and sacred kingship.",
    availabilityNote:
      "Use the linked public-domain translation for full text. Wisdom stores context for retrieval and cross-layer reasoning.",
    blocks: [
      {
        id: "kebra-nagast-context",
        title: "Research note",
        kind: "research-note",
        text:
          "The Kebra Nagast should surface for Ethiopia, Solomonic legitimacy, Christian Africa, sacred history, sovereignty, and the movement of the Ark narrative into political theology.",
        sourceLabel: "Wisdom editorial note",
        sourceUrl: null,
        isVerbatim: false,
      },
    ],
    lastUpdated: "2026-05-21",
  },
  9007: {
    status: "research-queued",
    summary:
      "Wisdom identifies Tarikh al-Sudan as a priority Timbuktu chronicle for future excerpting and manuscript-context enrichment.",
    availabilityNote:
      "Full vetted internal text is not stored yet. Use the access link to locate public scans or bibliographic records.",
    blocks: [
      {
        id: "tarikh-sudan-context",
        title: "Research note",
        kind: "research-note",
        text:
          "This record should anchor searches about Timbuktu, Songhay, Sahelian historiography, Islamic scholarship, manuscript culture, and precolonial African statecraft.",
        sourceLabel: "Wisdom archive enrichment queue",
        sourceUrl: null,
        isVerbatim: false,
      },
    ],
    lastUpdated: "2026-05-21",
  },
  9012: {
    status: "research-queued",
    summary:
      "Wisdom stores catalog context for Pumzi as a priority continental African speculative film record.",
    availabilityNote:
      "No internal film transcript or excerpt is stored. Use external records while rights-safe enrichment is assessed.",
    blocks: [
      {
        id: "pumzi-context",
        title: "Research note",
        kind: "research-note",
        text:
          "Pumzi should surface for Africanfuturism, climate futures, water scarcity, environmental authoritarianism, archives, seeds, and Kenyan speculative cinema.",
        sourceLabel: "Wisdom editorial note",
        sourceUrl: null,
        isVerbatim: false,
      },
    ],
    lastUpdated: "2026-05-21",
  },
  9017: {
    status: "research-queued",
    summary:
      "Wisdom stores catalog context for Jalada's Afrofuture(s) as a collective African futures anthology.",
    availabilityNote:
      "No internal anthology text is stored yet. Use Jalada's site and rights-safe sources for full readings.",
    blocks: [
      {
        id: "jalada-afrofutures-context",
        title: "Research note",
        kind: "research-note",
        text:
          "This anthology helps correct the archive's overreliance on American diaspora speculative fiction by foregrounding African literary networks and writers imagining futures from the continent.",
        sourceLabel: "Wisdom editorial note",
        sourceUrl: null,
        isVerbatim: false,
      },
    ],
    lastUpdated: "2026-05-21",
  },
};

type WorkContentInput = Pick<
  LiteratureWork,
  "id" | "title" | "author" | "description" | "significance" | "accessLinks"
>;

export function getWorkContentData(work: WorkContentInput): WorkContentData {
  const seeded = WORK_CONTENT[work.id];
  if (seeded) {
    return {
      ...seeded,
      statusLabel: STATUS_LABELS[seeded.status],
    };
  }

  const catalogContext = [work.description, work.significance].filter(Boolean).join(" ");

  return {
    status: "metadata-only",
    statusLabel: STATUS_LABELS["metadata-only"],
    summary:
      "Wisdom currently stores catalog context for this work, but not a vetted internal excerpt or full text.",
    availabilityNote:
      work.accessLinks.length > 0
        ? "Use the external access links for the primary text while archive enrichment continues."
        : "No direct primary text is stored in Wisdom yet. Archive enrichment is still needed for this work.",
    blocks: [
      {
        id: `catalog-${work.id}`,
        title: "Catalog summary",
        kind: "editorial-summary",
        text: catalogContext,
        sourceLabel: "Wisdom catalog metadata",
        sourceUrl: null,
        isVerbatim: false,
      },
      {
        id: `research-${work.id}`,
        title: "Research note",
        kind: "research-note",
        text:
          "This record is ready for a future stored excerpt, translation note, or full-text attachment once a vetted source and rights status are confirmed.",
        sourceLabel: "Wisdom archive enrichment queue",
        sourceUrl: null,
        isVerbatim: false,
      },
    ],
    lastUpdated: "2026-05-20",
  };
}

export function getWorkContentStatus(work: WorkContentInput): WorkContentStatus {
  return getWorkContentData(work).status;
}

export function getWorkContentCoverage(totalWorks: number) {
  const seededEntries = Object.values(WORK_CONTENT);
  const fullText = seededEntries.filter((entry) => entry.status === "full-text-available").length;
  const excerpted = seededEntries.filter((entry) => entry.status === "excerpt-available").length;
  const queued = seededEntries.filter((entry) => entry.status === "research-queued").length;

  return {
    totalWorks,
    fullText,
    excerpted,
    queued,
    metadataOnly: Math.max(totalWorks - fullText - excerpted - queued, 0),
  };
}
