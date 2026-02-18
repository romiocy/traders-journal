"use client";

import { useEffect } from "react";

export function ErrorSuppressor() {
  useEffect(() => {
    // Suppress extension-related proxy errors
    const originalError = console.error;
    console.error = (...args: any[]) => {
      if (
        args[0]?.message?.includes("Proxy") &&
        (args[0]?.message?.includes("tronlink") ||
          args[0]?.message?.includes("tronlinkParams"))
      ) {
        return;
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return null;
}
