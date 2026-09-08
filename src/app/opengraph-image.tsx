import { ImageResponse } from "next/og";

export const alt =
  "Caliper UI — zero-dependency React primitives on native HTML and Tailwind CSS";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          backgroundColor: "#09090b",
          color: "#fafafa",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 6,
            color: "#a1a1aa",
          }}
        >
          CALIPER UI
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            Engineered for precision.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 12,
              fontSize: 64,
              lineHeight: 1.05,
              letterSpacing: -2,
              color: "#a1a1aa",
            }}
          >
            Built with zero dependencies.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#a1a1aa",
          }}
        >
          caliperui.abhinavkumar.site
        </div>
      </div>
    ),
    { ...size },
  );
}
