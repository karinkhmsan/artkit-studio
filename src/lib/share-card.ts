import type { Language } from "@/lib/content";

const WIDTH = 1080;
const PAD = 48;
const MAX_ART_HEIGHT = 1100;
const FONT = "'Noto Sans Thai', 'Leelawadee UI', Tahoma, system-ui, Arial, sans-serif";

// Break text into lines that fit. Uses word breaking so Thai (no spaces) wraps well.
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, language: Language): string[] {
  const parts = Array.from(new Intl.Segmenter(language, { granularity: "word" }).segment(text), (s) => s.segment);
  const lines: string[] = [];
  let line = "";
  for (const part of parts) {
    if (line && ctx.measureText(line + part).width > maxWidth) {
      lines.push(line.trim());
      line = part.trimStart();
    } else {
      line += part;
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

// Make a PNG card: the artwork on top, the prompt and the website link below.
export function buildShareCard(art: HTMLImageElement, prompt: string, label: string, url: string, language: Language): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.resolve(null);

  const inner = WIDTH - PAD * 2;
  const scale = Math.min(inner / art.naturalWidth, MAX_ART_HEIGHT / art.naturalHeight, 2);
  const artW = Math.round(art.naturalWidth * scale);
  const artH = Math.round(art.naturalHeight * scale);

  // Measure the text first, so we know how tall the card must be.
  ctx.font = `600 46px ${FONT}`;
  const lines = wrapText(ctx, prompt, inner, language);
  const lineHeight = 64;
  const textTop = PAD + artH + 44;
  const height = textTop + 40 + lines.length * lineHeight + 40 + 56 + PAD;

  canvas.width = WIDTH; // resizing clears the canvas, so draw after this
  canvas.height = height;
  ctx.fillStyle = "#18181b";
  ctx.fillRect(0, 0, WIDTH, height);

  // Artwork, centered, with rounded corners.
  const artX = Math.round((WIDTH - artW) / 2);
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(artX, PAD, artW, artH, 20);
  ctx.clip();
  ctx.drawImage(art, artX, PAD, artW, artH);
  ctx.restore();

  // Prompt text.
  ctx.textBaseline = "top";
  ctx.fillStyle = "#e6a677";
  ctx.font = `700 26px ${FONT}`;
  ctx.fillText(label, PAD, textTop);
  ctx.fillStyle = "#f3f0e9";
  ctx.font = `600 46px ${FONT}`;
  lines.forEach((l, i) => ctx.fillText(l, PAD, textTop + 40 + i * lineHeight));

  // Footer: site name on the left, link on the right.
  const footerY = textTop + 40 + lines.length * lineHeight + 40;
  ctx.fillStyle = "#38383b";
  ctx.fillRect(PAD, footerY - 20, inner, 2);
  ctx.fillStyle = "#e6a677";
  ctx.font = `700 30px ${FONT}`;
  ctx.fillText("ArtKit Studio", PAD, footerY);
  ctx.fillStyle = "#a6a3a0";
  ctx.font = `400 28px ${FONT}`;
  ctx.textAlign = "right";
  ctx.fillText(url.replace(/^https?:\/\//, "").replace(/\/$/, ""), WIDTH - PAD, footerY + 2);

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}
