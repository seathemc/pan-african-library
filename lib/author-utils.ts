/**
 * Convert an author name to a URL-safe slug.
 * e.g. "Chinua Achebe" → "chinua-achebe"
 */
export function authorNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Reverse-lookup: given a slug and the list of all author names,
 * return the original name that matches the slug.
 */
export function slugToAuthorName(
  slug: string,
  allNames: string[]
): string | undefined {
  return allNames.find((name) => authorNameToSlug(name) === slug);
}
