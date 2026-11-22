// A reference photo shown next to the timer.
export type RefImage = {
  id: string;
  src: string;
  alt: string;
  credit?: { name: string; url: string; source: string; sourceUrl: string };
};

// What each category searches for on Pexels. Only these are allowed.
export const REFERENCE_QUERIES = {
  people: "person posing full body",
  hands: "hands gesture",
  animals: "animal",
  landscape: "landscape",
  stilllife: "still life objects",
  portrait: "portrait face",
} as const;

export type ReferenceCategory = keyof typeof REFERENCE_QUERIES;
export const REFERENCE_CATEGORIES = Object.keys(REFERENCE_QUERIES) as ReferenceCategory[];

export function shuffle<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
