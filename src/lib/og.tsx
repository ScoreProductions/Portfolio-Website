import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const ogSize = { width: 1200, height: 630 };

export function renderOg({ eyebrow, title, colors = ["#e8ff47", "#7a2cff"] }: { eyebrow: string; title: string; colors?: string[] }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "#f2efe9",
          background: `radial-gradient(circle at 85% 15%, ${colors[0]}99 0%, transparent 45%), radial-gradient(circle at 100% 100%, ${colors[1]}aa 0%, transparent 50%), #0a0a0b`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, letterSpacing: 6, textTransform: "uppercase" }}>
          <span>{site.name}</span>
          <span style={{ color: "#e8ff47" }}>{eyebrow}</span>
        </div>
        <div style={{ display: "flex", fontSize: 128, fontWeight: 700, lineHeight: 0.9, letterSpacing: -6, maxWidth: 1000 }}>{title}</div>
        <div style={{ display: "flex", fontSize: 28, color: "#8a8780" }}>{site.role}</div>
      </div>
    ),
    ogSize
  );
}
