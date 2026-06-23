import { useEffect } from "react";
import { DesignMotifs } from "../components/DesignMotifs";
import { FlowDivider } from "../components/FlowDivider";
import { activeDesign } from "../config/design";
import { weddingConfig } from "../config/wedding";
import { useReveal } from "../hooks/useReveal";
import { weddingDataAdapter } from "../services/dataAdapter";
import { DynamicAreaSection } from "../sections/DynamicAreaSection";
import { EventDetailsSection } from "../sections/EventDetailsSection";
import { FooterSection } from "../sections/FooterSection";
import { HeroSection } from "../sections/HeroSection";
import { InvitationSection } from "../sections/InvitationSection";
import { MusicSection } from "../sections/MusicSection";
import { RsvpSection } from "../sections/RsvpSection";
import { ScheduleSection } from "../sections/ScheduleSection";
import { TransportSection } from "../sections/TransportSection";
import { VenueSection } from "../sections/VenueSection";

export function WeddingPage() {
  useReveal();

  useEffect(() => {
    weddingDataAdapter.track("pageViews").catch(() => undefined);
  }, []);

  return (
    <div className={`app-design app-design--${activeDesign}`} data-design={activeDesign}>
      <DesignMotifs design={activeDesign} />
      <a className="skip-link" href="#main">
        İçeriğe geç
      </a>
      <main id="main">
        <HeroSection config={weddingConfig} />
        <InvitationSection config={weddingConfig} />
        <FlowDivider variant="sky" />
        <EventDetailsSection config={weddingConfig} />
        <FlowDivider variant="olive" />
        <ScheduleSection config={weddingConfig} />
        <FlowDivider variant="terracotta" />
        <VenueSection config={weddingConfig} />
        <FlowDivider variant="paper" />
        <TransportSection config={weddingConfig} />
        <FlowDivider variant="sky" />
        <RsvpSection config={weddingConfig} />
        <FlowDivider variant="olive" />
        <MusicSection config={weddingConfig} />
        <FlowDivider variant="terracotta" />
        <DynamicAreaSection config={weddingConfig} />
      </main>
      <FooterSection config={weddingConfig} />
    </div>
  );
}
