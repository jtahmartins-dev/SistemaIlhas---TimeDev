"use client";

import { useEffect, useState } from "react";

/**
 * Detecta se o viewport está em modo mobile (< breakpoint).
 * Default 768px (tablet portrait).
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}
