"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { useStudio } from "@/components/studio-shell";
import { getCopy } from "@/lib/content";

// Set these in .env.local (see .env.example). Without them the slot stays an empty placeholder.
const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const slots = {
  left: process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEFT,
  right: process.env.NEXT_PUBLIC_ADSENSE_SLOT_RIGHT,
  mobile: process.env.NEXT_PUBLIC_ADSENSE_SLOT_MOBILE,
};

export function AdSlot({ placement }: { placement: "left" | "right" | "mobile" }) {
  const { language } = useStudio();
  const copy = getCopy(language);
  const slot = slots[placement];
  const live = Boolean(client && slot);
  const box = useRef<HTMLDivElement>(null);
  const requested = useRef(false);

  useEffect(() => {
    // Ask Google for one ad. Skip if this slot is hidden by the layout (width 0).
    if (!live || requested.current || !box.current || box.current.offsetWidth === 0) return;
    requested.current = true;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch { /* The ad can fail to load (for example with an ad blocker). */ }
  }, [live]);

  return (
    <aside className={`ad-slot ad-slot-${placement}`} aria-label={copy.adLabel}>
      <div className="ad-slot-heading"><span className="ad-heading-line" />{copy.adLabel}<span className="ad-heading-line" /></div>
      {live ? (
        <div ref={box} className="ad-slot-live">
          <Script id="adsense" async strategy="afterInteractive" crossOrigin="anonymous" src={`https://pagead2.googleadsyndication.com/pagead/js/adsbygoogle.js?client=${client}`} />
          <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client={client} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />
        </div>
      ) : (
        <div className="ad-slot-box"><span className="ad-placeholder-icon" aria-hidden="true">✳</span><span>{copy.adReserved}</span><small>{copy.adNotice}</small></div>
      )}
    </aside>
  );
}
