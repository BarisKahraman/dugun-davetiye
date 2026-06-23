import { Monogram } from "./Monogram";

const floatingPetals = Array.from({ length: 11 }, (_, index) => index);

export function StorybookInvitationScene() {
  return (
    <div className="storybook-scene" aria-hidden="true">
      <div className="storybook-scene__wash storybook-scene__wash--sky" />
      <div className="storybook-scene__wash storybook-scene__wash--olive" />

      <div className="storybook-scene__card">
        <span className="storybook-scene__tape storybook-scene__tape--top" />
        <span className="storybook-scene__tape storybook-scene__tape--side" />
        <Monogram compact />
        <strong>N &amp; B</strong>
        <small>16 Ağustos 2026</small>
        <span className="storybook-scene__card-line" />
      </div>

      <div className="storybook-scene__envelope">
        <span className="storybook-scene__envelope-back" />
        <span className="storybook-scene__envelope-note" />
        <span className="storybook-scene__envelope-flap" />
        <span className="storybook-scene__envelope-front" />
      </div>

      <div className="painted-branch painted-branch--left">
        <span className="painted-branch__stem" />
        <span className="painted-branch__leaf" />
        <span className="painted-branch__leaf" />
        <span className="painted-branch__leaf" />
      </div>
      <div className="painted-branch painted-branch--right">
        <span className="painted-branch__stem" />
        <span className="painted-branch__leaf" />
        <span className="painted-branch__leaf" />
        <span className="painted-branch__leaf" />
      </div>

      <div className="painted-flower-field painted-flower-field--front">
        <span className="painted-flower painted-flower--rose" />
        <span className="painted-flower painted-flower--blue" />
        <span className="painted-flower painted-flower--cream" />
        <span className="painted-flower painted-flower--rose" />
      </div>
      <div className="painted-flower-field painted-flower-field--corner">
        <span className="painted-flower painted-flower--blue" />
        <span className="painted-flower painted-flower--cream" />
        <span className="painted-flower painted-flower--rose" />
      </div>

      <div className="storybook-scene__petals">
        {floatingPetals.map((petal) => (
          <span key={petal} />
        ))}
      </div>

      <svg className="storybook-scene__line" viewBox="0 0 360 150" focusable="false">
        <path d="M18 105C78 32 132 136 187 66C234 8 270 80 338 31" />
      </svg>
    </div>
  );
}
