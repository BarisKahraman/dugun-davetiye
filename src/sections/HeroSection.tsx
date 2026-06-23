import { ArrowDown, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CalendarLinks } from "../components/CalendarLinks";
import { CountdownDisplay } from "../components/CountdownDisplay";
import { EnvelopeIntro } from "../components/EnvelopeIntro";
import { Monogram } from "../components/Monogram";
import { MusicControl } from "../components/MusicControl";
import { StorybookInvitationScene } from "../components/StorybookInvitationScene";
import type { WeddingConfig } from "../types/wedding";

type HeroSectionProps = {
  config: WeddingConfig;
};

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function HeroSection({ config }: HeroSectionProps) {
  const [opened, setOpened] = useState(false);
  const [showEnvelope, setShowEnvelope] = useState(true);
  const titleRef = useRef<HTMLHeadingElement>(null);

  function openInvitation() {
    setOpened(true);
    window.setTimeout(() => setShowEnvelope(false), 1500);
  }

  useEffect(() => {
    if (!opened) {
      return undefined;
    }

    const timer = window.setTimeout(() => titleRef.current?.focus(), 900);
    return () => window.clearTimeout(timer);
  }, [opened]);

  return (
    <section className={opened ? "hero hero--opened" : "hero hero--sealed"} aria-labelledby="hero-title">
      {showEnvelope ? (
        <EnvelopeIntro
          opened={opened}
          bride={config.couple.bride}
          groom={config.couple.groom}
          onOpen={openInvitation}
        />
      ) : null}
      <div className="hero__stage hero__grid page-shell" aria-hidden={!opened}>
        <div className="hero__copy">
          <Monogram />
          <p className="eyebrow">{config.copy.heroEyebrow}</p>
          <div className="hero-title-flower-accent" aria-hidden="true">
            <span className="painted-flower painted-flower--rose" />
            <span className="painted-flower painted-flower--blue" />
            <span className="painted-flower painted-flower--cream" />
            <span className="painted-leaf" />
            <span className="painted-leaf" />
          </div>
          <h1 id="hero-title" ref={titleRef} tabIndex={-1}>
            {config.couple.bride}
            <span>&amp;</span>
            {config.couple.groom}
          </h1>
          <p className="hero__manifesto">{config.copy.manifesto}</p>
          <CountdownDisplay event={config.event} />
          <div className="hero__actions">
            <button className="button button--primary" type="button" onClick={() => scrollToId("rsvp")}>
              <Send aria-hidden="true" size={18} />
              Katılımını Bildir
            </button>
            <button className="text-link" type="button" onClick={() => scrollToId("invitation")}>
              Davetiyeyi Keşfet
            </button>
            <button className="text-link" type="button" onClick={() => scrollToId("schedule")}>
              Programı Gör
            </button>
          </div>
          <CalendarLinks config={config} compact />
        </div>
        <div className="hero__visual" role="img" aria-label="Animasyonlu suluboya davetiye sahnesi">
          <StorybookInvitationScene />
          <div className="hero__date-card" aria-hidden="true">
            <span>16</span>
            <small>Ağustos</small>
          </div>
        </div>
      </div>
      <MusicControl music={config.music} />
      <button className="scroll-cue" type="button" onClick={() => scrollToId("invitation")} aria-label="Aşağı kaydır">
        <ArrowDown aria-hidden="true" size={20} />
      </button>
    </section>
  );
}
