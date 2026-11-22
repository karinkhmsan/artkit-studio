import { ImageResponse } from "next/og";

// The picture shown when the link is shared on X, Facebook and other apps.
export const alt = "ArtKit Studio - A little space to make art";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 90, background: "#18181b", color: "#f3f0e9" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 84, height: 84, borderRadius: 22, background: "#e6a677", display: "flex" }} />
          <div style={{ fontSize: 56, fontWeight: 700 }}>ArtKit Studio</div>
        </div>
        <div style={{ marginTop: 60, fontSize: 88, fontWeight: 700, lineHeight: 1.1, display: "flex", flexDirection: "column" }}>
          <span>A little space to</span>
          <span style={{ color: "#e6a677" }}>make art.</span>
        </div>
        <div style={{ marginTop: 40, fontSize: 34, color: "#a6a3a0" }}>Gesture timer · Color and value · Drawing prompts</div>
      </div>
    ),
    size,
  );
}
