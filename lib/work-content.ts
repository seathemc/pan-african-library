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

const WORK_CONTENT: Record<number, WorkContentSeed> = {};

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
