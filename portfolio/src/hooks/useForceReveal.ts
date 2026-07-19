"use client";

import { useEffect, useState } from "react";

export function useForceReveal(delay = 900) {
  const [forceReveal, setForceReveal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setForceReveal(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return forceReveal;
}
