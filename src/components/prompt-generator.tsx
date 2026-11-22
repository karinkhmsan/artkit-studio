"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Dices, Lock, Unlock } from "lucide-react";
import { isTyping } from "@/components/tool-ui";
import { PromptShare } from "@/components/prompt-share";
import { copyText } from "@/lib/clipboard";
import type { Language } from "@/lib/content";
import { getToolCopy } from "@/lib/tool-copy";

const KEYS = ["subject", "setting", "mood", "twist"] as const;
type Key = (typeof KEYS)[number];
type Picks = Record<Key, number>;

const randomIndex = (size: number, not: number) => {
  if (size < 2) return 0;
  let n = Math.floor(Math.random() * size);
  while (n === not) n = Math.floor(Math.random() * size);
  return n;
};

export function PromptGenerator({ language, active }: { language: Language; active: boolean }) {
  const t = getToolCopy(language).prompt;
  const lists: Record<Key, string[]> = { subject: t.subjects, setting: t.settings, mood: t.moods, twist: t.twists };
  const [picks, setPicks] = useState<Picks>({ subject: 0, setting: 0, mood: 0, twist: 0 });
  const [locked, setLocked] = useState<Record<Key, boolean>>({ subject: false, setting: false, mood: false, twist: false });
  const [rolls, setRolls] = useState(0);
  const [copied, setCopied] = useState(false);

  function roll() {
    setPicks((old) => {
      const next = { ...old };
      for (const k of KEYS) if (!locked[k]) next[k] = randomIndex(lists[k].length, old[k]);
      return next;
    });
    setRolls((n) => n + 1);
  }

  async function copy() {
    const text = KEYS.map((k) => lists[k][picks[k]]).join(" · ");
    if (await copyText(text)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  }

  // First prompt is random (done after load so the server and browser match).
  useEffect(() => { roll(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!active) return;
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      if (e.key.toLowerCase() === "r") roll();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="prompt-tool">
      <div className="prompt-grid">
        {KEYS.map((k) => (
          <div key={k} className={`prompt-chip ${locked[k] ? "is-locked" : ""}`}>
            <div className="prompt-chip-top">
              <span className="field-label">{t.labels[k]}</span>
              <button
                type="button" className="lock-btn" aria-pressed={locked[k]}
                aria-label={`${locked[k] ? t.unlock : t.lock}: ${t.labels[k]}`} title={locked[k] ? t.unlock : t.lock}
                onClick={() => setLocked({ ...locked, [k]: !locked[k] })}
              >
                {locked[k] ? <Lock size={14} aria-hidden="true" /> : <Unlock size={14} aria-hidden="true" />}
              </button>
            </div>
            <strong key={`${k}-${picks[k]}-${rolls}`} className="prompt-text">{lists[k][picks[k]]}</strong>
          </div>
        ))}
      </div>

      <div className="timer-controls">
        <button type="button" className="tool-btn primary" onClick={roll}><Dices size={17} aria-hidden="true" />{t.roll}</button>
        <button type="button" className="tool-btn" onClick={copy}>
          {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}{copied ? t.copied : t.copy}
        </button>
      </div>
      <p className="shortcut-hint">{t.shortcuts}</p>

      <PromptShare language={language} promptText={KEYS.map((k) => lists[k][picks[k]]).join(" · ")} />
    </div>
  );
}
