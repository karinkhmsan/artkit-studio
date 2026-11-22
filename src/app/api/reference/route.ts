import { NextResponse } from "next/server";
import { REFERENCE_QUERIES, type RefImage, type ReferenceCategory } from "@/lib/reference";

// The key stays on the server (PEXELS_API_KEY). The browser only talks to this route.
const BASE = process.env.PEXELS_API_BASE || "https://api.pexels.com/v1";

type PexelsPhoto = {
  id: number; url: string; alt: string; photographer: string; photographer_url: string;
  src: { large: string };
};

export async function GET(request: Request) {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return NextResponse.json({ error: "no-key" }, { status: 503 });

  const params = new URL(request.url).searchParams;
  const query = REFERENCE_QUERIES[params.get("category") as ReferenceCategory];
  if (!query) return NextResponse.json({ error: "bad-category" }, { status: 400 });
  const page = Math.min(5, Math.max(1, Number(params.get("page")) || 1));

  // Pexels answers are cached for 1 hour. Only 6 categories x 5 pages exist,
  // so we never use more than 30 requests per hour of the free limit.
  const res = await fetch(`${BASE}/search?query=${encodeURIComponent(query)}&per_page=40&page=${page}`, {
    headers: { Authorization: key },
    next: { revalidate: 3600 },
  });
  if (res.status === 429) return NextResponse.json({ error: "rate-limit" }, { status: 429 });
  if (!res.ok) return NextResponse.json({ error: "upstream" }, { status: 502 });

  const data = (await res.json()) as { photos?: PexelsPhoto[] };
  const photos: RefImage[] = (data.photos ?? []).map((p) => ({
    id: `pexels-${p.id}`,
    src: p.src.large,
    alt: p.alt || "",
    credit: { name: p.photographer, url: p.photographer_url, source: "Pexels", sourceUrl: p.url },
  }));
  return NextResponse.json({ photos });
}
