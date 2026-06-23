import { describe, expect, it } from "vitest";
import { rsvpSchema } from "./rsvpSchema";

describe("rsvpSchema", () => {
  it("accepts an attending guest with a valid guest count", () => {
    const result = rsvpSchema.safeParse({
      fullName: "Ayşe Yılmaz",
      phone: "+90 555 111 22 33",
      attendance: "attending",
      guestCount: 2,
      accommodationNeed: "unsure",
      message: "Görüşmek üzere",
      songTitle: "Careless Whisper",
      songArtist: "George Michael"
    });

    expect(result.success).toBe(true);
  });

  it("rejects attending submissions without guest count", () => {
    const result = rsvpSchema.safeParse({
      fullName: "Ayşe Yılmaz",
      phone: "+90 555 111 22 33",
      attendance: "attending"
    });

    expect(result.success).toBe(false);
  });

  it("accepts not-attending submissions without guest count", () => {
    const result = rsvpSchema.safeParse({
      fullName: "Mehmet Kaya",
      phone: "0555 111 22 33",
      attendance: "not_attending"
    });

    expect(result.success).toBe(true);
  });

  it("rejects unrealistic guest counts", () => {
    const result = rsvpSchema.safeParse({
      fullName: "Mehmet Kaya",
      phone: "0555 111 22 33",
      attendance: "attending",
      guestCount: 250
    });

    expect(result.success).toBe(false);
  });
});
