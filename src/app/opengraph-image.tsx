import { ImageResponse } from "next/og";

export const alt = "Caliper UI — typed React components on native HTML and Tailwind CSS";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        backgroundColor: "#184e78",
        color: "#e7eef3",
        padding: 72,
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 28,
          letterSpacing: 6,
          color: "#e6c98a",
        }}
      >
        CALIPER UI
      </div>
      <div style={{ display: "flex", fontSize: 68, lineHeight: 1.05, letterSpacing: -1.5 }}>
        Typed React components on native HTML.
      </div>
      <div style={{ display: "flex", fontSize: 22, color: "#b7c9d6" }}>
        caliperui.abhinavkumar.site
      </div>
    </div>,
    { ...size },
  );
}
