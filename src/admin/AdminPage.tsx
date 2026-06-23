import { Check, Download, ExternalLink, LogIn, LogOut, RefreshCw, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { weddingDataAdapter, isProductionMode } from "../services/dataAdapter";
import {
  hasFirebaseConfig,
  signInWithGoogle,
  signOutAdmin,
  subscribeAdminAuth
} from "../services/firebaseAuth";
import type { AdminDashboard, GuestbookEntry, ScheduleItem } from "../types/wedding";
import { downloadTextFile, rsvpsToCsv } from "../utils/csv";

type EditableSchedule = Record<string, { time: string; description: string }>;

function makeEditableSchedule(schedule: ScheduleItem[]): EditableSchedule {
  return schedule.reduce<EditableSchedule>((acc, item) => {
    acc[item.id] = {
      time: item.time ?? "",
      description: item.description ?? ""
    };
    return acc;
  }, {});
}

function maxDailyCount(daily: AdminDashboard["dailyRsvps"]): number {
  return Math.max(1, ...daily.map((item) => item.count));
}

function songLabel(entry: { title: string; artist?: string }): string {
  return entry.artist ? `${entry.title} - ${entry.artist}` : entry.title;
}

export default function AdminPage() {
  const production = isProductionMode();
  const [user, setUser] = useState<User | null>(null);
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [schedule, setSchedule] = useState<EditableSchedule>({});
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [settingDrafts, setSettingDrafts] = useState({
    contactPhone: "",
    contactWhatsapp: "",
    giftIban: "",
    giftAccountName: "",
    galleryUploadUrl: "",
    publicGalleryUrl: ""
  });

  const canUseProductionAuth = !production || hasFirebaseConfig();
  const maxCount = useMemo(() => maxDailyCount(dashboard?.dailyRsvps ?? []), [dashboard]);

  useEffect(() => {
    if (!production) {
      return undefined;
    }
    return subscribeAdminAuth(setUser);
  }, [production]);

  async function token(): Promise<string | undefined> {
    if (!production) {
      return undefined;
    }
    return user?.getIdToken();
  }

  async function loadDashboard() {
    setLoading(true);
    setError("");
    try {
      const data = await weddingDataAdapter.getAdminDashboard(await token());
      setDashboard(data);
      setSchedule(makeEditableSchedule(data.schedule));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Yönetim verisi alınamadı.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!production || user) {
      loadDashboard().catch(() => undefined);
    }
  }, [production, user]);

  async function handleSignIn() {
    setError("");
    try {
      setUser(await signInWithGoogle());
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : "Giriş tamamlanamadı.");
    }
  }

  async function handleScheduleSave(item: ScheduleItem) {
    setStatus("");
    setError("");
    try {
      await weddingDataAdapter.updateScheduleItem(
        {
          id: item.id,
          time: schedule[item.id]?.time,
          description: schedule[item.id]?.description
        },
        await token()
      );
      setStatus("Program güncellendi.");
      await loadDashboard();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Program güncellenemedi.");
    }
  }

  async function handleSettingSave(key: string, value: string) {
    setStatus("");
    setError("");
    try {
      await weddingDataAdapter.updateSetting({ key, value }, await token());
      setStatus("Ayar kaydedildi.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Ayar kaydedilemedi.");
    }
  }

  async function approveGuestbook(entry: GuestbookEntry, approved: boolean) {
    setStatus("");
    setError("");
    try {
      await weddingDataAdapter.approveGuestbook(entry.id, approved, entry.displayedName, await token());
      setStatus("Hatıra defteri güncellendi.");
      await loadDashboard();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Hatıra defteri güncellenemedi.");
    }
  }

  if (production && !canUseProductionAuth) {
    return (
      <main className="admin-page">
        <section className="admin-login">
          <h1>Yönetim</h1>
          <p>Production mod için Firebase web app environment değişkenleri eksik.</p>
        </section>
      </main>
    );
  }

  if (production && !user) {
    return (
      <main className="admin-page">
        <section className="admin-login">
          <h1>Yönetim</h1>
          <p>Bu alan yalnızca yetkili Google hesabıyla açılır.</p>
          <button className="button button--primary" type="button" onClick={handleSignIn}>
            <LogIn aria-hidden="true" size={18} />
            Google ile Giriş Yap
          </button>
          {error ? <p className="form-error" role="alert">{error}</p> : null}
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Yönetim</p>
          <h1>Nuray &amp; Barış</h1>
          <p>{production ? user?.email : "Mock mod: veriler bu tarayıcıdaki localStorage içinde tutulur."}</p>
        </div>
        <div className="admin-header__actions">
          <button className="button button--ghost" type="button" onClick={loadDashboard} disabled={loading}>
            <RefreshCw aria-hidden="true" size={18} />
            Yenile
          </button>
          {dashboard?.settingsSheetUrl ? (
            <a className="button button--ghost" href={dashboard.settingsSheetUrl} target="_blank" rel="noreferrer">
              <ExternalLink aria-hidden="true" size={18} />
              Sheet’i Aç
            </a>
          ) : null}
          {production ? (
            <button className="button button--ghost" type="button" onClick={() => signOutAdmin()}>
              <LogOut aria-hidden="true" size={18} />
              Çıkış
            </button>
          ) : null}
        </div>
      </header>

      {status ? <p className="admin-status" role="status">{status}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}

      <section className="admin-metrics" aria-label="RSVP özetleri">
        <article>
          <span>Toplam RSVP</span>
          <strong>{dashboard?.totals.rsvpCount ?? 0}</strong>
        </article>
        <article>
          <span>Katılacak</span>
          <strong>{dashboard?.totals.attendingCount ?? 0}</strong>
        </article>
        <article>
          <span>Katılamayacak</span>
          <strong>{dashboard?.totals.notAttendingCount ?? 0}</strong>
        </article>
        <article>
          <span>Toplam misafir</span>
          <strong>{dashboard?.totals.guestCount ?? 0}</strong>
        </article>
      </section>

      <section className="admin-grid">
        <article className="admin-panel">
          <div className="panel-title">
            <h2>Günlere Göre RSVP</h2>
            <button
              className="button button--ghost"
              type="button"
              onClick={() => dashboard && downloadTextFile("rsvp.csv", rsvpsToCsv(dashboard.rsvps))}
              disabled={!dashboard?.rsvps.length}
            >
              <Download aria-hidden="true" size={18} />
              CSV
            </button>
          </div>
          <div className="bar-chart">
            {(dashboard?.dailyRsvps ?? []).map((item) => (
              <div key={item.date}>
                <span>{item.date}</span>
                <meter min="0" max={maxCount} value={item.count}>{item.count}</meter>
                <strong>{item.count}</strong>
              </div>
            ))}
            {!dashboard?.dailyRsvps.length ? <p>Henüz RSVP yok.</p> : null}
          </div>
        </article>

        <article className="admin-panel">
          <h2>Konaklama İhtiyacı</h2>
          <ul className="plain-list">
            {(dashboard?.accommodationNeeds ?? []).map((rsvp) => (
              <li key={rsvp.id}>{rsvp.fullName}</li>
            ))}
            {!dashboard?.accommodationNeeds.length ? <li>Kayıt yok.</li> : null}
          </ul>
        </article>
      </section>

      <section className="admin-panel">
        <h2>Program Saatleri</h2>
        <div className="admin-schedule">
          {(dashboard?.schedule ?? []).map((item) => (
            <div key={item.id} className="schedule-edit">
              <label>
                {item.order}. {item.title}
                <input
                  value={schedule[item.id]?.time ?? ""}
                  onChange={(event) =>
                    setSchedule((current) => ({
                      ...current,
                      [item.id]: {
                        ...current[item.id],
                        time: event.target.value
                      }
                    }))
                  }
                  placeholder="19:30"
                />
              </label>
              <label>
                Açıklama
                <input
                  value={schedule[item.id]?.description ?? ""}
                  onChange={(event) =>
                    setSchedule((current) => ({
                      ...current,
                      [item.id]: {
                        ...current[item.id],
                        description: event.target.value
                      }
                    }))
                  }
                />
              </label>
              <button className="icon-button" type="button" onClick={() => handleScheduleSave(item)} aria-label={`${item.title} kaydet`}>
                <Save aria-hidden="true" size={18} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-grid">
        <article className="admin-panel">
          <h2>Ayarlar</h2>
          {[
            ["contact.phone", "Telefon", "contactPhone"],
            ["contact.whatsapp", "WhatsApp", "contactWhatsapp"],
            ["gift.iban", "IBAN", "giftIban"],
            ["gift.accountName", "Hesap sahibi", "giftAccountName"],
            ["gallery.uploadUrl", "Fotoğraf yükleme linki", "galleryUploadUrl"],
            ["gallery.publicGalleryUrl", "Galeri linki", "publicGalleryUrl"]
          ].map(([key, label, draftKey]) => (
            <label className="setting-row" key={key}>
              {label}
              <input
                value={settingDrafts[draftKey as keyof typeof settingDrafts]}
                onChange={(event) =>
                  setSettingDrafts((current) => ({ ...current, [draftKey]: event.target.value }))
                }
              />
              <button
                className="icon-button"
                type="button"
                onClick={() => handleSettingSave(key, settingDrafts[draftKey as keyof typeof settingDrafts])}
                aria-label={`${label} kaydet`}
              >
                <Save aria-hidden="true" size={18} />
              </button>
            </label>
          ))}
        </article>

        <article className="admin-panel">
          <h2>Düğün Modu Ön İzleme</h2>
          <div className="mode-preview">
            <button className="button button--ghost" type="button">Düğün Öncesi</button>
            <button className="button button--ghost" type="button">Düğün Günü</button>
            <button className="button button--ghost" type="button">Düğün Sonrası</button>
          </div>
          <p>Ön izleme düğmeleri production içerik ayarlarını değiştirmez; görsel kontrol için tutulur.</p>
        </article>
      </section>

      <section className="admin-panel">
        <h2>RSVP Kayıtları</h2>
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ad soyad</th>
                <th>Telefon</th>
                <th>Durum</th>
                <th>Kişi</th>
                <th>Not</th>
                <th>Şarkı</th>
              </tr>
            </thead>
            <tbody>
              {(dashboard?.rsvps ?? []).map((rsvp) => (
                <tr key={rsvp.id}>
                  <td>{rsvp.fullName}</td>
                  <td>{rsvp.phone}</td>
                  <td>{rsvp.attendance === "attending" ? "Katılıyor" : "Katılamıyor"}</td>
                  <td>{rsvp.guestCount}</td>
                  <td>{rsvp.message}</td>
                  <td>{rsvp.songTitle ? songLabel({ title: rsvp.songTitle, artist: rsvp.songArtist }) : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-grid">
        <article className="admin-panel">
          <h2>Şarkı Önerileri</h2>
          <ul className="plain-list">
            {(dashboard?.songs ?? []).map((song, index) => (
              <li key={`${song.title}-${index}`}>
                {songLabel(song)} <span>{song.fullName}</span>
              </li>
            ))}
            {!dashboard?.songs.length ? <li>Henüz öneri yok.</li> : null}
          </ul>
        </article>

        <article className="admin-panel">
          <h2>Hatıra Defteri</h2>
          <ul className="guestbook-list">
            {(dashboard?.guestbook ?? []).map((entry) => (
              <li key={entry.id}>
                <strong>{entry.fullName}</strong>
                <p>{entry.note || songLabel({ title: entry.songTitle ?? "", artist: entry.songArtist })}</p>
                <button className="button button--ghost" type="button" onClick={() => approveGuestbook(entry, !entry.approved)}>
                  <Check aria-hidden="true" size={18} />
                  {entry.approved ? "Onayı Kaldır" : "Onayla"}
                </button>
              </li>
            ))}
            {!dashboard?.guestbook.length ? <li>Henüz mesaj yok.</li> : null}
          </ul>
        </article>
      </section>
    </main>
  );
}
