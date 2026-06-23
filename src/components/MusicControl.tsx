import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { WeddingConfig } from "../types/wedding";

type MusicControlProps = {
  music: WeddingConfig["music"];
};

export function MusicControl({ music }: MusicControlProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(() => sessionStorage.getItem("nb-music-playing") === "true");

  useEffect(() => {
    if (!music.localAudioUrl || !audioRef.current) {
      return;
    }

    if (playing) {
      audioRef.current.play().catch(() => setPlaying(false));
    } else {
      audioRef.current.pause();
    }
    sessionStorage.setItem("nb-music-playing", String(playing));
  }, [music.localAudioUrl, playing]);

  if (!music.enabled || (!music.localAudioUrl && !music.spotifyUrl)) {
    return null;
  }

  if (music.spotifyUrl && !music.localAudioUrl) {
    return (
      <a className="music-control" href={music.spotifyUrl} target="_blank" rel="noreferrer">
        <Play aria-hidden="true" size={18} />
        Spotify’da Aç
      </a>
    );
  }

  return (
    <div className="music-control">
      <button
        className="icon-button"
        type="button"
        onClick={() => setPlaying((value) => !value)}
        aria-label={playing ? "Müziği durdur" : "Müziği başlat"}
      >
        {playing ? <Pause aria-hidden="true" size={18} /> : <Play aria-hidden="true" size={18} />}
      </button>
      <span>{playing ? "Müzik açık" : "Müzik kapalı"}</span>
      <audio ref={audioRef} src={music.localAudioUrl} preload="none" loop />
    </div>
  );
}
