import { SITE_DESCRIPTION, SITE_URL } from "@/lib/site";

import { Showcase } from "./showcase";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Caliper UI",
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: "DeveloperApplication",
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Showcase />
    </>
  );
}
