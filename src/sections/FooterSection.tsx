import { Gift, Printer } from "lucide-react";
import { useState } from "react";
import { CopyButton } from "../components/CopyButton";
import { Modal } from "../components/Modal";
import { Monogram } from "../components/Monogram";
import type { WeddingConfig } from "../types/wedding";

type FooterSectionProps = {
  config: WeddingConfig;
};

export function FooterSection({ config }: FooterSectionProps) {
  const [giftOpen, setGiftOpen] = useState(false);
  const giftDetails =
    config.gift.enabled && config.gift.iban && config.gift.accountName
      ? { iban: config.gift.iban, accountName: config.gift.accountName }
      : undefined;

  return (
    <footer className="footer">
      <div className="page-shell footer__inner">
        <div>
          <Monogram compact />
          <p>Nuray &amp; Barış · 16 Ağustos 2026</p>
          <small>nuraybarisevleniyooooooor.com</small>
        </div>
        <div className="footer__actions">
          <button className="button button--ghost" type="button" onClick={() => window.print()}>
            <Printer aria-hidden="true" size={18} />
            PDF Davetiyeyi Kaydet
          </button>
          {giftDetails ? (
            <button className="button button--ghost" type="button" onClick={() => setGiftOpen(true)}>
              <Gift aria-hidden="true" size={18} />
              Hediye Notu
            </button>
          ) : null}
        </div>
      </div>
      {giftDetails ? (
        <Modal open={giftOpen} title="Hediye Notu" onClose={() => setGiftOpen(false)}>
          <p>{config.gift.note}</p>
          <dl className="gift-details">
            <div>
              <dt>Hesap sahibi</dt>
              <dd>{giftDetails.accountName}</dd>
            </div>
            <div>
              <dt>IBAN</dt>
              <dd>{giftDetails.iban}</dd>
            </div>
          </dl>
          <CopyButton value={giftDetails.iban} label="IBAN’ı Kopyala" />
        </Modal>
      ) : null}
    </footer>
  );
}
