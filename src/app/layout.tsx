import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Barlow_Condensed, Public_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/site";
import { themeChoice } from "@/lib/theme";
import "../styles/globals.css";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-dial",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Caliper UI",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#184e78" },
    { media: "(prefers-color-scheme: dark)", color: "#0c2438" },
  ],
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const theme = await themeChoice();

  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${barlowCondensed.variable}`}
      data-theme={theme}
      suppressHydrationWarning
    >
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
