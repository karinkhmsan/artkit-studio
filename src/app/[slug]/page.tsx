import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InfoPage } from "@/components/info-page";
import { getCopy, infoIds, infoLabelKey, type InfoId } from "@/lib/content";

export function generateStaticParams() { return infoIds.map((slug) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!infoIds.includes(slug as InfoId)) return {};
  const id = slug as InfoId;
  return { title: getCopy("en")[infoLabelKey[id]], description: getCopy("en").info[id].intro };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!infoIds.includes(slug as InfoId)) notFound();
  return <InfoPage id={slug as InfoId} />;
}