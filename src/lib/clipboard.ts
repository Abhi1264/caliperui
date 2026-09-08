"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function useClipboard(resetAfter = 2_000) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const copy = useCallback(
    async (text: string) => {
      const success = await copyToClipboard(text);
      setCopied(success);
      clearTimeout(timerRef.current);
      if (success && resetAfter > 0) {
        timerRef.current = setTimeout(() => setCopied(false), resetAfter);
      }
      return success;
    },
    [resetAfter],
  );

  return { copied, copy };
}
