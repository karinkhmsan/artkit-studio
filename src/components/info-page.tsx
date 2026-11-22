"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useStudio } from "@/components/studio-shell";
import { getCopy, infoIds, infoLabelKey, type InfoId } from "@/lib/content";

export function InfoPage({ id }: { id: InfoId }) {
  const { language } = useStudio();
  const copy = getCopy(language);
  const page = copy.info[id];
  return <div className="page-width info-page"><Link className="back-link" href="/"><ArrowLeft size={17} aria-hidden="true" />{copy.backToStudio}</Link><div className="info-layout"><div className="info-main"><p className="eyebrow">ARTKIT STUDIO / {page.eyebrow}</p><h1>{page.title}</h1><p className="info-intro">{page.intro}</p><div className="info-sections">{page.sections.map((section, index) => <section key={section.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{section.title}</h2><p>{section.body}</p></div></section>)}</div></div><aside className="info-aside"><span>✳</span><p>{copy.footerNote}</p><div>{infoIds.filter((link) => link !== id).map((link) => <Link href={`/${link}`} key={link}>{copy[infoLabelKey[link]]}<ArrowUpRight size={15} aria-hidden="true" /></Link>)}</div></aside></div></div>;
}