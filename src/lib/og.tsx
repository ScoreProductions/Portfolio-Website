import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const ogSize = { width: 1200, height: 630 };

export function renderOg({ eyebrow, title, colors = ["#ff3b45", "#6e0008"] }: { eyebrow: string; title: string; colors?: string[] }) {
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
          color: "#ffffff",
          background: `radial-gradient(circle at 15% 10%, ${colors[0]} 0%, transparent 50%), radial-gradient(circle at 100% 100%, ${colors[1]} 0%, transparent 55%), #e10a17`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, letterSpacing: 6, textTransform: "uppercase" }}>
          <span>{site.brand}</span>
          <span>{eyebrow}</span>
        </div>
        <div style={{ display: "flex", fontSize: 92, fontWeight: 700, lineHeight: 0.95, letterSpacing: -4, maxWidth: 1000 }}>{title}</div>
        <div style={{ display: "flex", fontSize: 28, color: "rgba(255,255,255,0.8)" }}>{site.role}</div>
      </div>
    ),
    ogSize
  );
}
