import { useEffect, useState } from "react";
import type { WeddingConfig } from "../types/wedding";
import { createCountdown } from "../utils/date";

export function useCountdown(event: WeddingConfig["event"]) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  return createCountdown(event, now);
}
