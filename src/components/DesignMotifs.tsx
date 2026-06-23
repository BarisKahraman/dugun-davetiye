import type { DesignVariant } from "../config/design";

type DesignMotifsProps = {
  design: DesignVariant;
};

export function DesignMotifs({ design }: DesignMotifsProps) {
  return (
    <div className={`design-motifs design-motifs--${design}`} aria-hidden="true">
      {design === "storybook" ? (
        <>
          <span className="motif motif--paint-wash" />
          <span className="motif motif--paint-petal" />
          <span className="motif motif--paint-leaf" />
          <span className="motif motif--paint-note" />
        </>
      ) : null}

      {design === "moonlit" ? (
        <>
          <span className="motif motif--moon" />
          <span className="motif motif--lantern motif--lantern-one" />
          <span className="motif motif--lantern motif--lantern-two" />
          <span className="motif motif--star-field" />
          <svg className="motif motif--constellation" viewBox="0 0 260 160" focusable="false">
            <path d="M18 110 70 64l54 24 49-57 68 42" />
            <circle cx="18" cy="110" r="4" />
            <circle cx="70" cy="64" r="4" />
            <circle cx="124" cy="88" r="4" />
            <circle cx="173" cy="31" r="4" />
            <circle cx="241" cy="73" r="4" />
          </svg>
        </>
      ) : null}

      {design === "tile" ? (
        <>
          <span className="motif motif--tile-grid" />
          <span className="motif motif--tile-arch" />
          <span className="motif motif--tile-chip motif--tile-chip-one" />
          <span className="motif motif--tile-chip motif--tile-chip-two" />
          <span className="motif motif--tile-chip motif--tile-chip-three" />
        </>
      ) : null}

      {design === "letterpress" ? (
        <>
          <span className="motif motif--deckle-sheet" />
          <span className="motif motif--postal-stamp" />
          <span className="motif motif--ink-roller" />
          <span className="motif motif--wax-seal" />
          <span className="motif motif--registration-cross" />
        </>
      ) : null}

      {design === "garden" ? (
        <>
          <span className="motif motif--olive-bough motif--olive-bough-one" />
          <span className="motif motif--olive-bough motif--olive-bough-two" />
          <span className="motif motif--citrus motif--citrus-one" />
          <span className="motif motif--citrus motif--citrus-two" />
          <span className="motif motif--stitch-path" />
        </>
      ) : null}
    </div>
  );
}
