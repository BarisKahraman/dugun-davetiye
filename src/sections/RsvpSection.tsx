import { CheckCircle2, MapPin, Send } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { CalendarLinks } from "../components/CalendarLinks";
import type { WeddingConfig, RsvpFormInput, Attendance, AccommodationNeed } from "../types/wedding";
import { weddingDataAdapter } from "../services/dataAdapter";
import { rsvpSchema } from "../services/rsvpSchema";
import { getWeddingMode } from "../utils/date";
import { googleMapsUrl } from "../utils/maps";

type RsvpSectionProps = {
  config: WeddingConfig;
};

type FormState = {
  fullName: string;
  phone: string;
  attendance: Attendance;
  guestCount: string;
  accommodationNeed: "" | AccommodationNeed;
  message: string;
  songTitle: string;
  songArtist: string;
  honey: string;
};

type FieldErrors = Partial<Record<keyof RsvpFormInput, string>>;

const initialForm: FormState = {
  fullName: "",
  phone: "",
  attendance: "attending",
  guestCount: "1",
  accommodationNeed: "",
  message: "",
  songTitle: "",
  songArtist: "",
  honey: ""
};

function buildPayload(form: FormState): RsvpFormInput {
  return {
    fullName: form.fullName,
    phone: form.phone,
    attendance: form.attendance,
    guestCount: form.attendance === "attending" ? Number(form.guestCount) : undefined,
    accommodationNeed: form.accommodationNeed || undefined,
    message: form.message || undefined,
    songTitle: form.songTitle || undefined,
    songArtist: form.songArtist || undefined,
    consent: true,
    honey: form.honey
  };
}

function fieldErrors(error: unknown): FieldErrors {
  const parsed = rsvpSchema.safeParse(error);
  if (parsed.success) {
    return {};
  }

  return Object.entries(parsed.error.flatten().fieldErrors).reduce<FieldErrors>((acc, [key, value]) => {
    if (value?.[0]) {
      acc[key as keyof RsvpFormInput] = value[0];
    }
    return acc;
  }, {});
}

export function RsvpSection({ config }: RsvpSectionProps) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const startedRef = useRef(false);
  const successRef = useRef<HTMLDivElement>(null);
  const mode = getWeddingMode(config.event);

  if (!config.rsvp.enabled || mode === "after") {
    return (
      <section className="section section--sand reveal" id="rsvp" aria-labelledby="rsvp-title">
        <div className="page-shell">
          <h2 id="rsvp-title">Katılım Bildirimi Kapandı</h2>
          <p>{config.copy.postWeddingThanks}</p>
        </div>
      </section>
    );
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function trackStarted() {
    if (startedRef.current) {
      return;
    }
    startedRef.current = true;
    weddingDataAdapter.track("rsvpStarted").catch(() => undefined);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    const payload = buildPayload(form);
    const parsed = rsvpSchema.safeParse(payload);

    if (!parsed.success) {
      setErrors(fieldErrors(payload));
      return;
    }

    setSubmitting(true);
    try {
      const result = await weddingDataAdapter.submitRsvp(parsed.data);
      await weddingDataAdapter.track("rsvpCompleted").catch(() => undefined);
      setSuccessMessage(result.message);
      setTimeout(() => successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Gönderim sırasında bir sorun oluştu.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section section--rsvp reveal" id="rsvp" aria-labelledby="rsvp-title">
      <div className="page-shell rsvp-grid">
        <div className="rsvp-copy">
          <p className="eyebrow">RSVP</p>
          <h2 id="rsvp-title">Katılımını Bildir</h2>
          <p>{config.copy.guestNotePrompt}</p>
          <div className="rsvp-copy__scene" aria-hidden="true">
            <span className="rsvp-copy__note" />
            <span className="rsvp-copy__clip" />
            <span className="painted-flower painted-flower--rose" />
            <span className="painted-flower painted-flower--cream" />
            <span className="painted-leaf" />
          </div>
          <p className="privacy-note">{config.copy.privacyNote}</p>
        </div>
        {successMessage ? (
          <div ref={successRef} className="rsvp-form success-panel" role="status">
            <div className="rsvp-form__corner-florals" aria-hidden="true">
              <span className="painted-flower painted-flower--blue" />
              <span className="painted-flower painted-flower--rose" />
              <span className="painted-leaf" />
            </div>
            <CheckCircle2 aria-hidden="true" size={28} />
            <h3>{successMessage}</h3>
            <CalendarLinks config={config} compact />
            <a className="button button--ghost" href={googleMapsUrl(config)} target="_blank" rel="noreferrer">
              <MapPin aria-hidden="true" size={18} />
              Haritaya Git
            </a>
          </div>
        ) : (
        <form className="rsvp-form" onSubmit={handleSubmit} onFocusCapture={trackStarted} noValidate>
          <div className="rsvp-form__corner-florals" aria-hidden="true">
            <span className="painted-flower painted-flower--blue" />
            <span className="painted-flower painted-flower--rose" />
            <span className="painted-leaf" />
          </div>

          <div className="honeypot" aria-hidden="true">
            <label htmlFor="company">Bu alanı boş bırakın</label>
            <input
              id="company"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              value={form.honey}
              onChange={(event) => update("honey", event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="fullName">Ad soyad</label>
            <input
              id="fullName"
              value={form.fullName}
              onChange={(event) => update("fullName", event.target.value)}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
              autoComplete="name"
              required
            />
            {errors.fullName ? <p id="fullName-error" className="field-error">{errors.fullName}</p> : null}
          </div>

          <div className="field">
            <label htmlFor="phone">Telefon</label>
            <input
              id="phone"
              value={form.phone}
              onChange={(event) => update("phone", event.target.value)}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              autoComplete="tel"
              inputMode="tel"
              required
            />
            {errors.phone ? <p id="phone-error" className="field-error">{errors.phone}</p> : null}
          </div>

          <fieldset className="field">
            <legend>Katılım</legend>
            <label className="radio-card">
              <input
                type="radio"
                name="attendance"
                checked={form.attendance === "attending"}
                onChange={() => update("attendance", "attending")}
              />
              Katılıyorum
            </label>
            <label className="radio-card">
              <input
                type="radio"
                name="attendance"
                checked={form.attendance === "not_attending"}
                onChange={() => update("attendance", "not_attending")}
              />
              Katılamıyorum
            </label>
          </fieldset>

          {form.attendance === "attending" ? (
            <div className="field">
              <label htmlFor="guestCount">Kişi sayısı</label>
              <input
                id="guestCount"
                value={form.guestCount}
                onChange={(event) => update("guestCount", event.target.value)}
                aria-invalid={Boolean(errors.guestCount)}
                aria-describedby={errors.guestCount ? "guestCount-error" : undefined}
                inputMode="numeric"
                type="number"
                min="1"
                max="20"
                required
              />
              {errors.guestCount ? <p id="guestCount-error" className="field-error">{errors.guestCount}</p> : null}
            </div>
          ) : null}

          <div className="field">
            <label htmlFor="accommodationNeed">Konaklama ihtiyacı</label>
            <select
              id="accommodationNeed"
              value={form.accommodationNeed}
              onChange={(event) => update("accommodationNeed", event.target.value as FormState["accommodationNeed"])}
            >
              <option value="">Seçmek istemiyorum</option>
              <option value="yes">Olabilir</option>
              <option value="no">Yok</option>
              <option value="unsure">Henüz emin değilim</option>
            </select>
          </div>

          <div className="field field--full">
            <label htmlFor="message">Not veya mesaj</label>
            <textarea
              id="message"
              value={form.message}
              onChange={(event) => update("message", event.target.value)}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "message-error" : undefined}
              rows={4}
            />
            {errors.message ? <p id="message-error" className="field-error">{errors.message}</p> : null}
          </div>

          <div className="field">
            <label htmlFor="songTitle">Şarkı adı</label>
            <input
              id="songTitle"
              value={form.songTitle}
              onChange={(event) => update("songTitle", event.target.value)}
              aria-invalid={Boolean(errors.songTitle)}
              aria-describedby={errors.songTitle ? "songTitle-error" : undefined}
            />
            {errors.songTitle ? <p id="songTitle-error" className="field-error">{errors.songTitle}</p> : null}
          </div>

          <div className="field">
            <label htmlFor="songArtist">Sanatçı adı</label>
            <input
              id="songArtist"
              value={form.songArtist}
              onChange={(event) => update("songArtist", event.target.value)}
              aria-invalid={Boolean(errors.songArtist)}
              aria-describedby={errors.songArtist ? "songArtist-error" : undefined}
            />
            {errors.songArtist ? <p id="songArtist-error" className="field-error">{errors.songArtist}</p> : null}
          </div>

          {submitError ? <p className="form-error" role="alert">{submitError}</p> : null}
          <button className="button button--primary field--full" type="submit" disabled={submitting}>
            <Send aria-hidden="true" size={18} />
            {submitting ? "Gönderiliyor" : "Gönder"}
          </button>
        </form>
        )}
      </div>
    </section>
  );
}
