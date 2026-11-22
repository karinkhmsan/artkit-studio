"use client";

import { useEffect } from "react";
import type { Language } from "@/lib/content";
import type { RefImage } from "@/lib/reference";
import { getToolCopy } from "@/lib/tool-copy";

export function ReferenceView({ image, preload, language }: { image: RefImage; preload?: RefImage; language: Language }) {
  const t = getToolCopy(language).timer.reference;

  // Load the next picture in the background, so the change is instant.
  useEffect(() => {
    if (preload) new Image().src = preload.src;
  }, [preload]);

  return (
    <figure className="reference-view">
      <div className="reference-frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={image.id} src={image.src} alt={image.alt} />
      </div>
      {image.credit && (
        <figcaption>
          {t.credit} <a href={image.credit.url} target="_blank" rel="noopener noreferrer">{image.credit.name}</a> {t.on}{" "}
          <a href={image.credit.sourceUrl} target="_blank" rel="noopener noreferrer">{image.credit.source}</a>
        </figcaption>
      )}
    </figure>
  );
}
