import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Red Auto — auto parts marketplace";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #ba0013, #e31e24)",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-1px",
            marginBottom: 24,
          }}
        >
          Red Auto
        </div>
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.85)",
            textAlign: "center",
            maxWidth: 700,
          }}
        >
          Request a part. Pick an offer.
        </div>
      </div>
    ),
    size,
  );
}
