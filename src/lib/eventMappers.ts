import type { WorkshopEvent } from "../data/events";

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
};

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
export function formatTime(timeStr: string | null | undefined): string {
  if (!timeStr) return "—";
  const t = timeStr.trim();
  if (!t) return "—";
  // If it looks like HH:MM format, return as-is; otherwise return the raw value
  if (/^\d{1,2}:\d{2}/.test(t)) return t;
  return t;
}

export function isRenderableEventRow(row: unknown): row is EventRow {
  if (!row || typeof row !== "object") return false;
  const r = row as Record<string, unknown>;
  return typeof r.id === "string" && r.id.length > 0;
}

export function eventRowToWorkshopEvent(row: EventRow): WorkshopEvent {
  return {
    id: row.id,
    title: (row.title ?? "").trim() || "Untitled event",
    dateLabel: formatDateLabelLong(String(row.date ?? "")),
    time: formatTime(row.specific_time ?? ""),
    location: (row.location_detailed ?? "").trim() || "TBD",
    description: (row.description ?? "").trim() || "",
    outcome: undefined,
    imageUrl: (row.image_url ?? "").trim() || undefined,
    locationDetailed: (row.location_detailed ?? "").trim() || undefined,
    attendeeCount: row.attendee_count ?? undefined,
    meetingLink: (row.meeting_link ?? "").trim() || undefined,
    specificTime: row.specific_time ?? undefined,
    impactSummary: (row.impact_summary ?? "").trim() || undefined,
  };
}

export function mapEventRowsToWorkshopEvents(data: unknown): WorkshopEvent[] {
  if (data == null) return [];
  if (!Array.isArray(data)) return [];
  if (data.length === 0) return [];
  return data.filter(isRenderableEventRow).map(eventRowToWorkshopEvent);
}
