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
    <div className="countdown" aria-label="Düğüne kalan süre" aria-live="polite">
      <div>
        <strong>{countdown.days}</strong>
        <span>Gün</span>
      </div>
      {countdown.hasStartTime ? (
        <>
          <div>
            <strong>{countdown.hours}</strong>
            <span>Saat</span>
          </div>
          <div>
            <strong>{countdown.minutes}</strong>
            <span>Dakika</span>
          </div>
        </>
      ) : (
        <p>Başlangıç saati yakında paylaşılacak.</p>
      )}
    </div>
  );
}
