"use client";

import { ArrowUpRight, Focus, Globe2, LockKeyhole, Sparkles } from "lucide-react";
import { AdSlot } from "@/components/ad-slot";
import { useStudio } from "@/components/studio-shell";
import { ToolIcon, ToolWorkspace } from "@/components/tool-workspace";
import { getCopy, toolIds } from "@/lib/content";

export function StudioHome() {
  const { language, activeTool, setActiveTool } = useStudio();
  const copy = getCopy(language);

  return (
    <>
      <div className="page-width home-content">
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-copy"><div className="hero-kicker"><Sparkles size={14} aria-hidden="true" /> {copy.privateBadge}</div><h1 id="hero-heading">{copy.littleSpace}<br /><em>{copy.create}</em></h1><p>{copy.heroDescription}</p></div>
          <div className="hero-ornament" aria-hidden="true"><span className="ornament-orbit orbit-outer" /><span className="ornament-orbit orbit-inner" /><span className="ornament-sun">✳</span><span className="ornament-star star-one">✦</span><span className="ornament-star star-two">✧</span><span className="ornament-dot" /></div>
        </section>

        <div className="section-heading"><div><p className="eyebrow">01 — {copy.workspace}</p><h2>{copy.everything}</h2></div><span className="section-heading-aside">ARTKIT STUDIO <span className="tiny-cross">✳</span> 001</span></div>
        <div className="studio-grid">
          <div className="side-column"><aside className="tool-sidebar" aria-label={copy.explore}>
            <p className="sidebar-label">{copy.explore} <span>03</span></p>
            <div className="tool-list">{toolIds.map((tool, index) => <button type="button" key={tool} className={`tool-list-item ${tool === activeTool ? "selected" : ""}`} aria-pressed={tool === activeTool} onClick={() => setActiveTool(tool)}><span className="tool-list-icon"><ToolIcon tool={tool} size={19} /></span><span className="tool-list-name"><strong>{copy[`${tool}Full`]}</strong><small>{String(index + 1).padStart(2, "0")} / 03</small></span><ArrowUpRight size={16} className="tool-list-arrow" aria-hidden="true" /></button>)}</div>
            <div className="sidebar-note"><span>✳</span><p>{copy.footerNote}</p></div>
          </aside><AdSlot placement="left" /></div>
          <ToolWorkspace tool={activeTool} language={language} />
          <AdSlot placement="right" />
        </div>
        <AdSlot placement="mobile" />

        <section className="features" aria-labelledby="features-title"><div className="features-heading"><p className="eyebrow">02 — {copy.builtFor}</p><h2 id="features-title">{copy.everything}</h2></div><div className="feature-grid"><article><span className="feature-icon"><Focus size={21} strokeWidth={1.7} aria-hidden="true" /></span><h3>{copy.featureOneTitle}</h3><p>{copy.featureOneBody}</p></article><article><span className="feature-icon"><LockKeyhole size={21} strokeWidth={1.7} aria-hidden="true" /></span><h3>{copy.featureTwoTitle}</h3><p>{copy.featureTwoBody}</p></article><article><span className="feature-icon"><Globe2 size={21} strokeWidth={1.7} aria-hidden="true" /></span><h3>{copy.featureThreeTitle}</h3><p>{copy.featureThreeBody}</p></article></div></section>
      </div>
    </>
  );
}