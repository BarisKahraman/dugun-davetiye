import type { WeddingConfig } from "../types/wedding";

export const siteUrl =
  import.meta.env.VITE_SITE_URL?.replace(/\/$/, "") ?? "https://nuraybarisevleniyooooooor.com";

export const weddingConfig: WeddingConfig = {
  couple: {
    bride: "Nuray Göncü",
    groom: "Barış Kahraman",
    brideAge: 30,
    groomAge: 29
  },
  families: {
    brideMother: "Fatma Göncü",
    brideFather: "Hüseyin Göncü",
    groomFather: "Mustafa Kahraman"
  },
  event: {
    date: "2026-08-16",
    startTime: "12:00",
    timezone: "Europe/Istanbul",
    venueName: "Değirmenci Düğün Salonu",
    address: "Gökpınar, 07700 Elmalı / Antalya",
    city: "Elmalı / Antalya",
    childrenInvited: false
  },
  schedule: [
    {
      id: "yemek",
      order: 1,
      title: "Yemek",
      description: "Düğün yemeğimizle güne başlıyoruz.",
      enabled: true
    },
    {
      id: "giris-dansi",
      order: 2,
      title: "Giriş dansı",
      description: "Çiftin ilk dansıyla törenimiz başlıyor.",
      enabled: true
    },
    {
      id: "nikah",
      order: 3,
      title: "Nikâh",
      description: "Resmi nikâh töreni.",
      enabled: true
    },
    {
      id: "taki-toreni",
      order: 4,
      title: "Takı töreni",
      description: "Sevdiklerimizle tek tek selamlaşıyoruz.",
      enabled: true
    },
    {
      id: "pasta-kesimi",
      order: 5,
      title: "Pasta kesimi",
      description: "Pasta kesimi ile geceyi taçlandırıyoruz.",
      enabled: true
    },
    {
      id: "fotograf",
      order: 6,
      title: "Fotoğraf",
      description: "Anı fotoğrafları için kısa bir süre ayırıyoruz.",
      enabled: true
    }
  ],
  rsvp: {
    enabled: true,
    required: false,
    deadline: "2026-08-16"
  },
  transport: {
    shuttleAvailable: false
  },
  contact: {},
  gift: {
    enabled: false,
    note: "Varlığınız bizim için en güzel hediye. Yine de katkıda bulunmak isteyenler için bilgiyi burada paylaşıyoruz."
  },
  music: {
    enabled: false,
    preferredSong: "Careless Whisper"
  },
  social: {},
  gallery: {},
  copy: {
    heroEyebrow: "16 AĞUSTOS 2026 · ELMALI / ANTALYA",
    manifesto: "Hayatımızın en özel gününde sizi yanımızda görmek istiyoruz.",
    invitation:
      "16 Ağustos’ta Değirmenci Düğün Salonu’nda gerçekleşecek düğün törenimize sizleri davet etmekten mutluluk duyuyoruz. Varlığınız bu günü daha anlamlı kılacak.",
    rsvpPositiveThanks: "Katılımınız için teşekkür ederiz. 16 Ağustos’ta görüşmek üzere.",
    rsvpNegativeThanks: "Bize haber verdiğiniz için teşekkür ederiz.",
    guestNotePrompt:
      "Bize bir mesaj ya da o gün mutlaka duyulmak istediğiniz bir şarkı bırakabilirsiniz.",
    privacyNote:
      "Bu formda paylaştığınız bilgiler yalnızca düğün organizasyonu amacıyla kullanılacaktır.",
    postWeddingThanks: "Bu özel günü bizimle paylaştığınız için teşekkür ederiz."
  }
};

export function getFamilyLine(config: WeddingConfig): string | undefined {
  const { brideMother, brideFather, groomMother, groomFather } = config.families;
  if (!brideMother || !brideFather || !groomMother || !groomFather) {
    return undefined;
  }

  return `${brideMother} & ${brideFather} · ${groomMother} & ${groomFather}`;
}
