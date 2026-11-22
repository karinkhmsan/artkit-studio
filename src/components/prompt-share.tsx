"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Download, Facebook, ImagePlus, Instagram, Share2, X } from "lucide-react";
import { copyText } from "@/lib/clipboard";
import type { Language } from "@/lib/content";
import { buildShareCard } from "@/lib/share-card";
import { getToolCopy } from "@/lib/tool-copy";

const MAX_BYTES = 15 * 1024 * 1024;
const FILE_NAME = "artkit-prompt.png";

export function PromptShare({ language, promptText }: { language: Language; promptText: string }) {
  const t = getToolCopy(language).prompt.share;
  const [art, setArt] = useState<HTMLImageElement | null>(null);
  const [card, setCard] = useState<Blob | null>(null);
  const [cardUrl, setCardUrl] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [canShare, setCanShare] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  // The link we put in the post. Set NEXT_PUBLIC_SITE_URL after you deploy.
  const caption = `${t.intro(promptText)}\n${t.tryYours} ${siteUrl}`;

  useEffect(() => {
    setSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || window.location.origin);
    const test = new File([""], FILE_NAME, { type: "image/png" });
    setCanShare(typeof navigator.canShare === "function" && navigator.canShare({ files: [test] }));
  }, []);

  // Rebuild the card whenever the image, prompt, language or link changes.
  useEffect(() => {
    if (!art || !siteUrl) return;
    let cancelled = false;
    buildShareCard(art, promptText, t.cardLabel, siteUrl, language).then((blob) => {
      if (cancelled || !blob) return;
      setCard(blob);
      setCardUrl(URL.createObjectURL(blob));
    });
    return () => { cancelled = true; };
  }, [art, promptText, language, siteUrl, t.cardLabel]);

  // Free the old preview address when a new one replaces it.
  useEffect(() => () => { if (cardUrl) URL.revokeObjectURL(cardUrl); }, [cardUrl]);

  function loadFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError(t.errorType);
    if (file.size > MAX_BYTES) return setError(t.errorSize);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { setArt(img); setError(""); setStatus(""); URL.revokeObjectURL(url); };
    img.onerror = () => { setError(t.errorLoad); URL.revokeObjectURL(url); };
    img.src = url;
  }

  function remove() {
    setArt(null); setCard(null); setCardUrl(""); setStatus(""); setError("");
  }

  function save() {
    if (!cardUrl) return;
    const link = document.createElement("a");
    link.href = cardUrl;
    link.download = FILE_NAME;
    link.click();
  }

  async function nativeShare() {
    if (!card) return;
    try {
      await navigator.share({ files: [new File([card], FILE_NAME, { type: "image/png" })], text: caption });
    } catch { /* The person closed the share sheet. */ }
  }

  // The website opens first (browsers block pop-ups after a wait), then we save and copy.
  function openSite(address: string, message: string, withCaption: boolean) {
    window.open(address, "_blank", "noopener");
    save();
    if (withCaption) void copyText(caption);
    setStatus(message);
  }

  const enc = encodeURIComponent;
  const text = `${t.intro(promptText)}\n${t.tryYours}`;

  return (
    <section className="share-box" aria-labelledby="share-title"
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); loadFile(e.dataTransfer.files[0]); }}
    >
      <h3 id="share-title">{t.title}</h3>
      <p className="shortcut-hint">{t.hint}</p>

      <input id="share-file" type="file" accept="image/*" hidden onChange={(e) => { loadFile(e.target.files?.[0]); e.target.value = ""; }} />

      {!art && (
        <label htmlFor="share-file" className={`dropzone compact ${dragging ? "is-dragging" : ""}`}>
          <ImagePlus size={28} strokeWidth={1.4} aria-hidden="true" />
          <strong>{t.upload}</strong>
          <span>{t.dropHint}</span>
        </label>
      )}

      {art && (
        <div className="share-result">
          <div className="share-preview">{/* eslint-disable-next-line @next/next/no-img-element */}
            {cardUrl && <img src={cardUrl} alt={t.previewAlt} />}</div>
          <div className="share-actions">
            {canShare && <button type="button" className="tool-btn primary" onClick={nativeShare} disabled={!card}><Share2 size={17} aria-hidden="true" />{t.native}</button>}
            <button type="button" className="tool-btn" disabled={!card} onClick={() => openSite(`https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(siteUrl)}`, t.msgX, false)}><strong>X</strong></button>
            <button type="button" className="tool-btn" disabled={!card} onClick={() => openSite(`https://www.facebook.com/sharer/sharer.php?u=${enc(siteUrl)}&quote=${enc(t.intro(promptText))}`, t.msgFacebook, true)}><Facebook size={17} aria-hidden="true" />Facebook</button>
            <button type="button" className="tool-btn" disabled={!card} onClick={() => openSite("https://www.instagram.com/", t.msgInstagram, true)}><Instagram size={17} aria-hidden="true" />Instagram</button>
            <button type="button" className="tool-btn" disabled={!card} onClick={() => { save(); setStatus(t.msgSaved); }}><Download size={17} aria-hidden="true" />{t.download}</button>
            <button type="button" className="tool-btn" onClick={async () => { if (await copyText(caption)) setStatus(t.msgCopied); }}><Copy size={16} aria-hidden="true" />{t.copyCaption}</button>
            <label htmlFor="share-file" className="tool-btn">{t.replace}</label>
            <button type="button" className="tool-btn icon" onClick={remove} aria-label={t.remove} title={t.remove}><X size={16} aria-hidden="true" /></button>
          </div>
          <p className="share-status" role="status" aria-live="polite">{status && <><Check size={15} aria-hidden="true" /> {status}</>}</p>
        </div>
      )}

      {error && <p className="tool-error" role="alert">{error}</p>}
      <p className="shortcut-hint">{t.note}</p>
    </section>
  );
}
