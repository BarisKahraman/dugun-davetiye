import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value ? sanitizeText(value) : undefined));

const guestCountSchema = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }
    return Number(value);
  },
  z.number().int().min(1).max(20).optional()
);

export const rsvpSchema = z
  .object({
    fullName: z.string().trim().min(2).max(120).transform(sanitizeText),
    phone: z
      .string()
      .trim()
      .min(7)
      .max(24)
      .refine((value) => /^[+]?[\d\s().-]+$/.test(value))
      .refine((value) => value.replace(/\D/g, "").length >= 7),
    attendance: z.enum(["attending", "not_attending"]),
    guestCount: guestCountSchema,
    accommodationNeed: z.enum(["yes", "no", "unsure"]).optional(),
    message: optionalText(500),
    songTitle: optionalText(120),
    songArtist: optionalText(120),
    consent: z.boolean().optional().default(true),
    honey: z.string().max(0).optional()
  })
  .superRefine((value, ctx) => {
    if (value.honey) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Gönderim doğrulanamadı.",
        path: ["honey"]
      });
    }
    if (value.attendance === "attending" && !value.guestCount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Katılım için kişi sayısı gerekli.",
        path: ["guestCount"]
      });
    }
  });

export type RsvpInput = z.infer<typeof rsvpSchema>;

export function sanitizeText(value: string): string {
  return value.replace(/[<>]/g, "").replace(/\s+/g, " ").trim();
}

export function escapeSheetFormula(value: string | number | boolean | undefined): string | number | boolean {
  if (typeof value !== "string") {
    return value ?? "";
  }
  const trimmed = value.trimStart();
  if (/^[=+\-@]/.test(trimmed)) {
    return `'${value}`;
  }
  return value;
}

export function firstValidationMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Form alanlarını kontrol edin.";
}
