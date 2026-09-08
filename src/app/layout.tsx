import type { Metadata } from "next";
import type { ReactNode } from "react";

import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Caliper UI — Source-owned React primitives",
  description:
    "Typed React primitives built with native browser APIs and Tailwind CSS, with no added runtime package beyond React.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
