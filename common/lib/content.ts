import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

const CONTENT_DIR = path.join(process.cwd(), "content", "clauses");

export function readClauseMarkdown(filename: string): string {
  const fullPath = path.join(CONTENT_DIR, filename);
  return fs.readFileSync(fullPath, "utf8");
}

export function renderMarkdown(md: string): string {
  marked.setOptions({ gfm: true, breaks: false });
  return marked.parse(md, { async: false }) as string;
}
