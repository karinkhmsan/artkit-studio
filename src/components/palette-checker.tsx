"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ImagePlus, X } from "lucide-react";
import { ChipGroup, isTyping } from "@/components/tool-ui";
import { copyText } from "@/lib/clipboard";
import type { Language } from "@/lib/content";
import { getToolCopy } from "@/lib/tool-copy";

type Mode = "color" | "gray" | "v3" | "v5";
type Swatch = { hex: string; share: number; value: number };

const MODES: Mode[] = ["color", "gray", "v3", "v5"];
const MAX_SIDE = 640; // the image is shrunk so analysis stays fast
const MAX_BYTES = 15 * 1024 * 1024;

const toHex = (r: number, g: number, b: number) =>
  "#" + [r, g, b].map((n) => Math.round(n).toString(16).padStart(2, "0")).join("");
const luminance = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b; // 0..255
const distance = (a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }) =>
  Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b);

// Group pixels into buckets, then merge buckets that look alike.
function extractPalette(data: Uint8ClampedArray, count = 6): Swatch[] {
  const buckets = new Map<number, { r: number; g: number; b: number; n: number }>();
  let total = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue; // skip see-through pixels
    const key = ((data[i] >> 4) << 8) | ((data[i + 1] >> 4) << 4) | (data[i + 2] >> 4);
    const bucket = buckets.get(key) ?? { r: 0, g: 0, b: 0, n: 0 };
    bucket.r += data[i]; bucket.g += data[i + 1]; bucket.b += data[i + 2]; bucket.n++;
    buckets.set(key, bucket);
    total++;
  }
  const sorted = [...buckets.values()]
    .map((b) => ({ r: b.r / b.n, g: b.g / b.n, b: b.b / b.n, n: b.n }))
    .sort((a, b) => b.n - a.n);

  const picked: typeof sorted = [];
  for (const color of sorted) {
    const near = picked.find((p) => distance(p, color) < 48);
    if (near) near.n += color.n;
    else if (picked.length < count) picked.push({ ...color });
    else {
      const closest = picked.reduce((a, b) => (distance(a, color) < distance(b, color) ? a : b));
      closest.n += color.n;
    }
  }
  return picked
    .sort((a, b) => b.n - a.n)
    .map((c) => ({ hex: toHex(c.r, c.g, c.b), share: Math.round((c.n / total) * 100), value: Math.round((luminance(c.r, c.g, c.b) / 255) * 100) }));
}

// Draw the picture in color, grayscale, or a few gray steps.
function paint(canvas: HTMLCanvasElement | null, source: ImageData | null, mode: Mode) {
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx || !source) return;
  if (mode === "color") { ctx.putImageData(source, 0, 0); return; }
  const out = new ImageData(new Uint8ClampedArray(source.data), source.width, source.height);
  const steps = mode === "v3" ? 3 : mode === "v5" ? 5 : 0;
  for (let i = 0; i < out.data.length; i += 4) {
    let v = luminance(out.data[i], out.data[i + 1], out.data[i + 2]);
    if (steps) v = Math.round((v / 255) * (steps - 1)) * (255 / (steps - 1));
    out.data[i] = out.data[i + 1] = out.data[i + 2] = v;
  }
  ctx.putImageData(out, 0, 0);
}

export function PaletteChecker({ language, active }: { language: Language; active: boolean }) {
  const t = getToolCopy(language).palette;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sourceRef = useRef<ImageData | null>(null);
  const [hasImage, setHasImage] = useState(false);
  const [swatches, setSwatches] = useState<Swatch[]>([]);
  const [mode, setMode] = useState<Mode>("color");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState("");

  function loadFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError(t.errorType);
    if (file.size > MAX_BYTES) return setError(t.errorSize);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas?.getContext("2d", { willReadFrequently: true });
      if (!canvas || !ctx) return;
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      sourceRef.current = ctx.getImageData(0, 0, w, h);
      setSwatches(extractPalette(sourceRef.current.data));
      setMode("color");
      setError("");
      setHasImage(true);
      URL.revokeObjectURL(url);
    };
    img.onerror = () => { setError(t.errorLoad); URL.revokeObjectURL(url); };
    img.src = url;
  }

  function clear() {
    sourceRef.current = null;
    setHasImage(false);
    setSwatches([]);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function copy(text: string, label: string) {
    if (await copyText(text)) {
      setCopied(label);
      setTimeout(() => setCopied((c) => (c === label ? "" : c)), 1200);
    }
  }

  // Redraw when the view changes.
  useEffect(() => { paint(canvasRef.current, sourceRef.current, mode); }, [mode, hasImage]);

  // Paste an image with Ctrl+V, and keyboard shortcuts.
  useEffect(() => {
    if (!active) return;
    function onPaste(e: ClipboardEvent) {
      const file = Array.from(e.clipboardData?.files ?? []).find((f) => f.type.startsWith("image/"));
      if (file) loadFile(file);
    }
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target) || !hasImage) return;
      const key = e.key.toLowerCase();
      if (key === "v") setMode(MODES[(MODES.indexOf(mode) + 1) % MODES.length]);
      else if (key === "escape") clear();
      else if (/^[1-6]$/.test(key) && swatches[Number(key) - 1]) copy(swatches[Number(key) - 1].hex, swatches[Number(key) - 1].hex);
    }
    window.addEventListener("paste", onPaste);
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("paste", onPaste); window.removeEventListener("keydown", onKey); };
  });

  return (
    <div className="palette-tool">
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => loadFile(e.target.files?.[0])} />

      <div
        className={`dropzone ${dragging ? "is-dragging" : ""}`}
        hidden={hasImage}
        role="button" tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); inputRef.current?.click(); } }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); loadFile(e.dataTransfer.files[0]); }}
      >
        <ImagePlus size={34} strokeWidth={1.3} aria-hidden="true" />
        <strong>{t.drop}</strong>
        <span>{t.dropHint}</span>
      </div>

      <div className="palette-result" hidden={!hasImage}>
        <div className="canvas-wrap"><canvas ref={canvasRef} aria-label={t.value} /></div>

        <div className="palette-side">
          <ChipGroup label={t.viewLabel} value={mode} onChange={setMode} options={MODES.map((m) => ({ id: m, label: t.modes[m] }))} />

          <div className="field">
            <span className="field-label">{t.palette}</span>
            <div className="swatch-list">
              {swatches.map((s, i) => (
                <button key={s.hex} type="button" className="swatch" onClick={() => copy(s.hex, s.hex)} title={`${i + 1}`}>
                  <span className="swatch-color" style={{ background: s.hex }}>{copied === s.hex && <Check size={16} aria-hidden="true" />}</span>
                  <span className="swatch-hex">{copied === s.hex ? t.copied : s.hex.toUpperCase()}</span>
                  <span className="swatch-meta">{t.value} {s.value}% · {s.share}%</span>
                </button>
              ))}
            </div>
          </div>

          <div className="palette-actions">
            <button type="button" className="tool-btn" onClick={() => copy(swatches.map((s) => s.hex.toUpperCase()).join(", "), "all")}>
              {copied === "all" ? <Check size={16} aria-hidden="true" /> : null}{copied === "all" ? t.copied : t.copyAll}
            </button>
            <button type="button" className="tool-btn" onClick={() => inputRef.current?.click()}>{t.choose}</button>
            <button type="button" className="tool-btn icon" onClick={clear} aria-label={t.clear} title={t.clear}><X size={16} aria-hidden="true" /></button>
          </div>
        </div>
      </div>

      {error && <p className="tool-error" role="alert">{error}</p>}
      <p className="shortcut-hint">{t.privacy} · {t.shortcuts}</p>
    </div>
  );
}
