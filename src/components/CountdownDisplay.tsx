import type { WeddingConfig } from "../types/wedding";
import { useCountdown } from "../hooks/useCountdown";

type CountdownDisplayProps = {
  event: WeddingConfig["event"];
};

export function CountdownDisplay({ event }: CountdownDisplayProps) {
  const countdown = useCountdown(event);

  if (countdown.mode === "day") {
    return (
      <div className="countdown countdown--message" aria-live="polite">
        <strong>Bugün evleniyoruz</strong>
        <span>Harita ve program biraz daha görünür olsun diye hazır bekliyor.</span>
      </div>
    );
  }

  if (countdown.mode === "after") {
    return (
      <div className="countdown countdown--message" aria-live="polite">
        <strong>Teşekkürler</strong>
        <span>Bu akşam artık güzel bir hatıra.</span>
      </div>
    );
  }

  return (
    <div className="countdown" aria-label="Düğüne kalan süre" aria-live="off">
      <div>
        <strong>{countdown.days}</strong>
        <span>Gün</span>
      </div>
      <div>
        <strong>{String(countdown.hours ?? 0).padStart(2, "0")}</strong>
        <span>Saat</span>
      </div>
      <div>
        <strong>{String(countdown.minutes ?? 0).padStart(2, "0")}</strong>
        <span>Dakika</span>
      </div>
      <div>
        <strong>{String(countdown.seconds ?? 0).padStart(2, "0")}</strong>
        <span>Saniye</span>
      </div>
    </div>
  );
}
