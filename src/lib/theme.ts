import { cookies } from "next/headers";

export type ThemeChoice = "light" | "dark" | "system";

export async function themeChoice(): Promise<ThemeChoice> {
  const stored = (await cookies()).get("caliper-theme")?.value;
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "system";
}
