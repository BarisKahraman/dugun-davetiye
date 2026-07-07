import type { WeddingConfig } from "../types/wedding";

type InvitationSectionProps = {
  config: WeddingConfig;
};

export function InvitationSection({ config }: InvitationSectionProps) {
  return (
    <section className="section section--intro reveal" id="invitation" aria-labelledby="invitation-title">
      <div className="page-shell intro-spread">
        <div className="intro-spread__label">
          <p className="eyebrow">Davet</p>
          <span aria-hidden="true">16/08</span>
        </div>
        <div className="intro-copy">
          <div className="intro-watercolor-accent" aria-hidden="true">
            <span className="painted-flower painted-flower--rose" />
            <span className="painted-flower painted-flower--cream" />
            <span className="painted-flower painted-flower--blue" />
            <span className="painted-leaf" />
            <span className="painted-leaf" />
          </div>
          <h2 id="invitation-title">Düğünümüze Davet</h2>
          <p className="intro-text">{config.copy.invitation}</p>
          <div className="motion-ticker" aria-hidden="true">
            <span>Yemek</span>
            <span>Müzik</span>
            <span>Dans</span>
            <span>Nikâh</span>
            <span>16 Ağustos</span>
          </div>
        </div>
        <div className="intro-mini-scene" aria-hidden="true">
          <span className="intro-mini-scene__sun" />
          <span className="intro-mini-scene__hill intro-mini-scene__hill--back" />
          <span className="intro-mini-scene__hill intro-mini-scene__hill--front" />
          <span className="intro-mini-scene__table" />
          <span className="intro-mini-scene__plate intro-mini-scene__plate--left" />
          <span className="intro-mini-scene__plate intro-mini-scene__plate--right" />
          <span className="intro-mini-scene__lantern intro-mini-scene__lantern--left" />
          <span className="intro-mini-scene__lantern intro-mini-scene__lantern--right" />
          <span className="intro-mini-scene__note intro-mini-scene__note--one" />
          <span className="intro-mini-scene__note intro-mini-scene__note--two" />
          <span className="painted-flower painted-flower--rose" />
          <span className="painted-flower painted-flower--blue" />
        </div>
      </div>
    </section>
  );
}
