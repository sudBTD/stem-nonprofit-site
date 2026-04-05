export type WorkshopEvent = {
  id: string;
  title: string;
  /** Short label shown on cards, e.g. "Apr 18, 2026" */
  dateLabel: string;
  time: string;
  location: string;
  description: string;
  /** Optional note for archive / impact stories */
  outcome?: string;
  /** Image URL for past events card */
  imageUrl?: string;
  /** Detailed location string */
  locationDetailed?: string;
  /** Number of attendees */
  attendeeCount?: number;
};

/** Placeholder — live data comes from Supabase on Events / PastEvents pages */
export const events: WorkshopEvent[] = [];

export const pastEvents: WorkshopEvent[] = [];

/** @deprecated Use `events` — kept as an alias for older imports */
export const upcomingEvents = events;
