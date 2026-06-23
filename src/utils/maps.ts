import type { WeddingConfig } from "../types/wedding";

export function buildVenueQuery(config: WeddingConfig): string {
  return `${config.event.venueName}, ${config.event.address}`;
}

export function googleMapsUrl(config: WeddingConfig): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(buildVenueQuery(config))}`;
}

export function appleMapsUrl(config: WeddingConfig): string {
  return `https://maps.apple.com/?q=${encodeURIComponent(buildVenueQuery(config))}`;
}

export function googleMapEmbedUrl(config: WeddingConfig): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(buildVenueQuery(config))}&output=embed`;
}
