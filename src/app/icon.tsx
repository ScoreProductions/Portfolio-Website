import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#e8ff47", color: "#0a0a0b", fontSize: 44, fontWeight: 800, borderRadius: 14 }}>
        {site.shortName[0]}
      </div>
    ),
    size
  );
}
