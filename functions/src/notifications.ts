import type { RsvpInput } from "./validation.js";

export async function notifyRsvp(input: RsvpInput): Promise<void> {
  const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!webhookUrl || !token) {
    return;
  }

  const text =
    input.attendance === "attending"
      ? `Yeni RSVP: ${input.fullName}, ${input.guestCount ?? 1} kişi`
      : `Yeni RSVP: ${input.fullName} katılamıyor`;

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text })
  });

  if (!response.ok) {
    throw new Error("WhatsApp bildirimi gönderilemedi.");
  }
}

export async function sendDailySummary(): Promise<void> {
  const notificationEmail = process.env.NOTIFICATION_EMAIL;
  if (!notificationEmail) {
    return;
  }

  // Provider bilgisi verilene kadar gerçek e-posta gönderimi yapılmaz.
  await Promise.resolve();
}
