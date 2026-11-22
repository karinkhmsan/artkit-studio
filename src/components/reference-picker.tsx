"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, RefreshCw } from "lucide-react";
import { ChipGroup } from "@/components/tool-ui";
import type { Language } from "@/lib/content";
import { REFERENCE_CATEGORIES, shuffle, type RefImage, type ReferenceCategory } from "@/lib/reference";
import { getToolCopy } from "@/lib/tool-copy";

type Source = "none" | "pexels" | "mine";
const MAX_FILES = 60;

export function ReferencePicker({ language, onChange }: { language: Language; onChange: (images: RefImage[]) => void }) {
  const t = getToolCopy(language).timer.reference;
  const [source, setSource] = useState<Source>("none");
  const [category, setCategory] = useState<ReferenceCategory>("people");
  const [mine, setMine] = useState<RefImage[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const requestId = useRef(0); // ignore answers that arrive late

  // Free the local picture addresses when this tool is closed.
  const minePrev = useRef<RefImage[]>([]);
  useEffect(() => { minePrev.current = mine; }, [mine]);
  useEffect(() => () => minePrev.current.forEach((i) => URL.revokeObjectURL(i.src)), []);

  function show(list: RefImage[]) {
    setCount(list.length);
    onChange(list);
  }

  async function loadPexels(cat: ReferenceCategory) {
    const id = ++requestId.current;
    setLoading(true);
    setError("");
    show([]);
    try {
      const page = 1 + Math.floor(Math.random() * 5);
      const res = await fetch(`/api/reference?category=${cat}&page=${page}`);
      const data = await res.json();
      if (id !== requestId.current) return;
      if (!res.ok) throw new Error(data.error);
      show(shuffle(data.photos as RefImage[]));
    } catch (e) {
      if (id !== requestId.current) return;
      const code = e instanceof Error ? e.message : "";
      setError(code === "no-key" ? t.errNoKey : code === "rate-limit" ? t.errRate : t.errNetwork);
    }
    if (id === requestId.current) setLoading(false);
  }

  function chooseSource(next: Source) {
    requestId.current++; // cancel any running download
    setSource(next);
    setError("");
    setLoading(false);
    if (next === "none") show([]);
    else if (next === "mine") show(mine);
    else void loadPexels(category);
  }

  function chooseCategory(next: ReferenceCategory) {
    setCategory(next);
    void loadPexels(next);
  }

  function pickFiles(files: FileList | null) {
    const chosen = Array.from(files ?? []).filter((f) => f.type.startsWith("image/")).slice(0, MAX_FILES);
    if (!chosen.length) return;
    mine.forEach((i) => URL.revokeObjectURL(i.src));
    const list = shuffle(chosen.map((f, i) => ({ id: `mine-${i}-${f.name}`, src: URL.createObjectURL(f), alt: f.name })));
    setMine(list);
    show(list);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="reference-picker">
      <ChipGroup
        label={t.title} value={source} onChange={chooseSource}
        options={[{ id: "none", label: t.none }, { id: "pexels", label: t.pexels }, { id: "mine", label: t.mine }]}
      />

      {source === "pexels" && (
        <>
          <ChipGroup label={t.category} value={category} onChange={chooseCategory} options={REFERENCE_CATEGORIES.map((id) => ({ id, label: t.categories[id] }))} />
          <div className="reference-actions">
            <button type="button" className="tool-btn" onClick={() => loadPexels(category)} disabled={loading}><RefreshCw size={16} aria-hidden="true" />{t.newSet}</button>
            <span className="reference-status">{loading ? t.loading : count ? `${t.count(count)} · ${t.hintPexels}` : ""}</span>
          </div>
        </>
      )}

      {source === "mine" && (
        <>
          <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(e) => pickFiles(e.target.files)} />
          <div className="reference-actions">
            <button type="button" className="tool-btn" onClick={() => inputRef.current?.click()}><ImagePlus size={16} aria-hidden="true" />{count ? t.change : t.pick}</button>
            {count > 1 && <button type="button" className="tool-btn" onClick={() => { const list = shuffle(mine); setMine(list); show(list); }}>{t.shuffle}</button>}
          </div>
          <p className="reference-status">{count ? t.count(count) : t.hintMine}</p>
        </>
      )}

      {error && <p className="tool-error" role="alert">{error}</p>}
    </div>
  );
}
