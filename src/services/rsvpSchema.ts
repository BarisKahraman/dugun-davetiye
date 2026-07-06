import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `En fazla ${max} karakter yazabilirsiniz.`)
    .optional()
    .transform((value) => (value ? value : undefined));

const phoneSchema = z
  .string({ required_error: "Telefon numaranızı yazın." })
  .trim()
  .min(7, "Telefon numarası çok kısa görünüyor.")
  .max(24, "Telefon numarası çok uzun görünüyor.")
  .refine((value) => /^[+]?[\d\s().-]+$/.test(value), "Telefon numarasında geçersiz karakter var.")
  .refine(
    (value) => value.replace(/\D/g, "").length >= 7,
    "Telefon numarasında yeterli rakam görünmüyor."
  );

const guestCountSchema = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }
    return Number(value);
  },
  z
    .number({ invalid_type_error: "Kişi sayısını sayı olarak girin." })
    .int("Kişi sayısı tam sayı olmalı.")
    .min(1, "Katılım için en az 1 kişi yazın.")
    .max(20, "Kişi sayısı çok yüksek görünüyor.")
    .optional()
);

export const rsvpSchema = z
  .object({
    fullName: z
      .string({ required_error: "Ad soyad alanı zorunlu." })
      .trim()
      .min(2, "Ad soyad alanını doldurun.")
      .max(120, "Ad soyad en fazla 120 karakter olabilir."),
    phone: phoneSchema,
    attendance: z.enum(["attending", "not_attending"], {
      required_error: "Katılım durumunuzu seçin."
    }),
    guestCount: guestCountSchema,
    accommodationNeed: z.enum(["yes", "no", "unsure"]).optional(),
    message: optionalText(500),
    songTitle: optionalText(120),
    songArtist: optionalText(120),
    consent: z.boolean().optional().default(true),
    honey: z.string().optional()
  })
  .superRefine((value, ctx) => {
    if (value.attendance === "attending" && !value.guestCount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Katılıyorsanız kişi sayısını yazın.",
        path: ["guestCount"]
      });
    }
  });

export type ParsedRsvp = z.infer<typeof rsvpSchema>;
