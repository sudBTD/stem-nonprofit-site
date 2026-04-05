import type { WorkshopEvent } from "../data/events";

export const eventSelectColumns =
  "id, title, description, date, is_past, image_url, location_detailed, attendee_count, impact_summary, meeting_link, specific_time, slides_url";

/** Row shape from Supabase `events` — fields may be missing on old or partial rows */
export type EventRow = {
  id: string;
  title?: string | null;
  /** Postgres `date` or timestamptz serialized by PostgREST */
  date?: string | null;
  description?: string | null;
  is_past?: boolean | null;
  tutor_id?: string | null;
  image_url?: string | null;
  location_detailed?: string | null;
  attendee_count?: number | null;
  impact_summary?: string | null;
  meeting_link?: string | null;
  specific_time?: string | null;
  slides_url?: string | null;
};

function normalizeOptionalString(value: unknown): string | undefined {
  const normalized = String(value ?? "").trim();
  return normalized || undefined;
}


function formatDateLabel(raw: string): string {
  const t = raw.trim();
  if (!t) return "Date TBA";
  const ymd = t.includes("T") ? (t.split("T")[0]?.trim() ?? t) : t;
  if (/^\d{4}-\d{2}-\d{2}$/.test(ymd)) {
    const d = new Date(`${ymd}T12:00:00`);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  }
  return t;
}

export function formatDateLabelLong(raw: string): string {
  const t = raw.trim();
  if (!t) return "Date TBA";
  const ymd = t.includes("T") ? (t.split("T")[0]?.trim() ?? t) : t;
  if (/^\d{4}-\d{2}-\d{2}$/.test(ymd)) {
    const d = new Date(`${ymd}T12:00:00`);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  }
  return t;
}

/** Display helper for admin lists and anywhere raw `date` from DB is shown */
export function formatEventDateDisplay(raw: string | null | undefined): string {
  return formatDateLabel(String(raw ?? ""));
}

/** Format time string (HH:MM or similar) for display */
export function formatTime(timeStr: unknown): string {
  const t = String(timeStr ?? "").trim();
  if (!t) return "—";
  if (/^\d{1,2}:\d{2}/.test(t)) return t;
  return t;
}

export function isRenderableEventRow(row: unknown): row is EventRow {
  if (!row || typeof row !== "object") return false;
  const r = row as Record<string, unknown>;
  return typeof r.id === "string" && r.id.length > 0;
}

export function eventRowToWorkshopEvent(row: EventRow): WorkshopEvent {
  const title = normalizeOptionalString(row.title) ?? "Untitled event";
  const description = normalizeOptionalString(row.description) ?? "";
  const imageUrl = normalizeOptionalString(row.image_url);
  const locationDetailed = normalizeOptionalString(row.location_detailed);
  const impactSummary = normalizeOptionalString(row.impact_summary);
  const slidesUrl = normalizeOptionalString(row.slides_url);
  const specificTime = normalizeOptionalString(row.specific_time);
  const formattedTime = formatTime(specificTime);
  const displayLocation = locationDetailed || "TBD";

  return {
    id: row.id,
    title,
    dateLabel: formatDateLabelLong(String(row.date ?? "")),
    time: formattedTime,
    location: displayLocation,
    description,
    outcome: undefined,
    imageUrl,
    locationDetailed,
    displayLocation,
    attendeeCount: row.attendee_count ?? undefined,
    meetingLink: normalizeOptionalString(row.meeting_link),
    specificTime,
    displayTime: specificTime ? formattedTime : undefined,
    slidesUrl,
    impactSummary,
    displayImpactSummary: impactSummary,
  };
}

export function mapEventRowsToWorkshopEvents(data: unknown): WorkshopEvent[] {
  if (data == null) return [];
  if (!Array.isArray(data)) return [];
  if (data.length === 0) return [];
  return data.filter(isRenderableEventRow).map(eventRowToWorkshopEvent);
}
