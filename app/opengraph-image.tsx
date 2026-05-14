import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Veridion — Inteligentní workspace pro veřejné zakázky";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(ellipse at top, #172648 0%, #0A0D12 50%, #05070A 100%)",
          color: "white",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Top: logo + tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
              <path
                d="M4 6.5L16 27 28 6.5"
                stroke="#FFFFFF"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.5 6.5L16 17l5.5-10.5"
                stroke="#8CB4FF"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.7"
              />
            </svg>
            <div
              style={{
                fontSize: 28,
                fontWeight: 500,
                letterSpacing: "-0.02em",
              }}
            >
              Veridion
            </div>
          </div>
          <div
            style={{
              fontSize: 16,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#9AA3B4",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 999,
              padding: "8px 16px",
            }}
          >
            Enterprise · CZ
          </div>
        </div>

        {/* Middle: headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 88,
              fontWeight: 600,
              lineHeight: 1.02,
              letterSpacing: "-0.04em",
              backgroundImage:
                "linear-gradient(180deg, #FFFFFF 0%, #C9D0DC 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Veřejné zakázky.
          </div>
          <div
            style={{
              fontSize: 88,
              fontWeight: 600,
              lineHeight: 1.02,
              letterSpacing: "-0.04em",
              backgroundImage:
                "linear-gradient(180deg, #FFFFFF 0%, #8CB4FF 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Znovu promyšlené.
          </div>
        </div>

        {/* Bottom: subtitle */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 32,
          }}
        >
          <div
            style={{
              fontSize: 24,
              color: "#9AA3B4",
              maxWidth: 720,
              lineHeight: 1.4,
            }}
          >
            AI workspace pro monitoring, analýzu a řízení veřejných zakázek.
          </div>
          <div
            style={{
              fontSize: 18,
              color: "#6C7587",
              letterSpacing: "0.04em",
            }}
          >
            veridion.cz
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
