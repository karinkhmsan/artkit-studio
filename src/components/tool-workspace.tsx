"use client";

import { Clock3, Lightbulb, Palette, type LucideIcon } from "lucide-react";
import { GestureTimer } from "@/components/gesture-timer";
import { PaletteChecker } from "@/components/palette-checker";
import { PromptGenerator } from "@/components/prompt-generator";
import { getCopy, type Language, type ToolId } from "@/lib/content";

const toolIcons: Record<ToolId, LucideIcon> = { timer: Clock3, palette: Palette, prompt: Lightbulb };
const toolNumbers: Record<ToolId, string> = { timer: "01", palette: "02", prompt: "03" };

export function ToolIcon({ tool, size = 20 }: { tool: ToolId; size?: number }) {
  const Icon = toolIcons[tool];
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />;
}

// All three tools stay mounted, so a running timer keeps going when you switch tabs.
export function ToolWorkspace({ tool, language }: { tool: ToolId; language: Language }) {
  const copy = getCopy(language);
  return (
    <section className={`workspace-panel workspace-${tool}`} aria-labelledby="tool-title">
      <div className="panel-topline"><span><span className="status-dot" />{copy.selectedTool} <span className="panel-slash">/</span> {toolNumbers[tool]}</span><span className="panel-status">{copy.ready}</span></div>
      <div className="workspace-intro"><span className="workspace-icon"><ToolIcon tool={tool} size={25} /></span><div><p className="eyebrow workspace-eyebrow">{copy[`${tool}Step`]}</p><h2 id="tool-title">{copy[`${tool}Title`]}</h2><p className="workspace-description">{copy[`${tool}Description`]}</p></div></div>
      <div hidden={tool !== "timer"}><GestureTimer language={language} active={tool === "timer"} /></div>
      <div hidden={tool !== "palette"}><PaletteChecker language={language} active={tool === "palette"} /></div>
      <div hidden={tool !== "prompt"}><PromptGenerator language={language} active={tool === "prompt"} /></div>
    </section>
  );
}
