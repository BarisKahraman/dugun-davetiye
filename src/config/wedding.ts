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
    dressCode: "Belirli bir kıyafet kodumuz yok. Kendinizi iyi hissettiğiniz hâlinizle gelin.",
    childrenInvited: true
  },
  schedule: [
    {
      id: "yemek",
      order: 1,
      title: "Yemek",
      description: "Akşamı aynı sofradan, aynı neşeyle başlatıyoruz.",
      enabled: true
    },
    {
      id: "giris-dansi",
      order: 2,
      title: "Giriş dansı",
      description: "Sahneye küçük bir telaş, büyük bir gülümsemeyle çıkıyoruz.",
      enabled: true
    },
    {
      id: "nikah",
      order: 3,
      title: "Nikâh",
      description: "Kısa, sade ve hafızası uzun bir evet.",
      enabled: true
    },
    {
      id: "taki-toreni",
      order: 4,
      title: "Takı töreni",
      description: "Sevdiklerimizle tek tek selamlaştığımız o kalabalık an.",
      enabled: true
    },
    {
      id: "pasta-kesimi",
      order: 5,
      title: "Pasta kesimi",
      description: "Tatlı kısmı biraz alkışlı olacak.",
      enabled: true
    },
    {
      id: "fotograf",
      order: 6,
      title: "Fotoğraf",
      description: "Geceden yanımıza kalacak kareler için kısa bir mola.",
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
    manifesto: "Bir yaz akşamında, sevdiğimiz herkesle aynı cümlede buluşuyoruz.",
    invitation:
      "16 Ağustos’ta Elmalı’da, hayatımızın en güzel akşamlarından birini birlikte kuruyoruz. Müzik, yemek, kahkaha ve biraz da tatlı telaş var. Sizleri aramızda görmek istiyoruz.",
    rsvpPositiveThanks: "Harika, notunuz bize ulaştı. 16 Ağustos’ta görüşmek üzere.",
    rsvpNegativeThanks: "Bize haber verdiğiniz için teşekkür ederiz. O gün sizi yanımızda hissedeceğiz.",
    guestNotePrompt:
      "Bize bir cümle, güzel bir anı ya da o gece mutlaka çalması gereken bir şarkı bırakın.",
    privacyNote:
      "Bu formda paylaştığınız bilgiler yalnızca düğün organizasyonu ve sizinle iletişim kurmak amacıyla kullanılacaktır.",
    postWeddingThanks: "Bu akşamı bizimle aynı hatıraya dönüştürdüğünüz için teşekkür ederiz."
  }
};

export function getFamilyLine(config: WeddingConfig): string | undefined {
  const { brideMother, brideFather, groomMother, groomFather } = config.families;
  if (!brideMother || !brideFather || !groomMother || !groomFather) {
    return undefined;
  }

  return `${brideMother} & ${brideFather} · ${groomMother} & ${groomFather}`;
}
