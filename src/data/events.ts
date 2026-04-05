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
  /** Image URL for event card */
  imageUrl?: string;
  /** Detailed location string */
  locationDetailed?: string;
  /** Number of attendees */
  attendeeCount?: number;
  /** Meeting link (Google Meet, registration page, etc.) */
  meetingLink?: string;
  /** Specific time in HH:MM format */
  specificTime?: string;
  /** Google Slides embed URL for presentation slides */
  slidesUrl?: string;
  /** Event impact summary */
  impactSummary?: string;
  /** Render-ready location value */
  displayLocation?: string;
  /** Render-ready time value */
  displayTime?: string;
  /** Render-ready summary value */
  displayImpactSummary?: string;
};

/** Placeholder — live data comes from Supabase on Events / PastEvents pages */
export const events: WorkshopEvent[] = [];

export const pastEvents: WorkshopEvent[] = [];

/** @deprecated Use `events` — kept as an alias for older imports */
export const upcomingEvents = events;
