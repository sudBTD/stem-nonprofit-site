import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock } from "lucide-react";
import { PastEventCard } from "../components/PastEventCard";
import type { WorkshopEvent } from "../data/events";
import { mapEventRowsToWorkshopEvents } from "../lib/eventMappers";
import { supabase } from "../lib/supabase";

export function PastEvents() {
  const [pastEvents, setPastEvents] = useState<WorkshopEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      const { data, error: qError } = await supabase
        .from("events")
        .select("id, title, description, date, is_past, image_url, location_detailed, attendee_count, impact_summary")
        .eq("is_past", true)
        .order("date", { ascending: false });

      if (cancelled) return;

      if (qError) {
        console.error("[PastEvents] Fetch failed:", qError.message, qError);
        setError(qError.message);
        setPastEvents([]);
      } else {
        setPastEvents(mapEventRowsToWorkshopEvents(data));
      }
      setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Past events
        </h1>
        <p className="mt-4 text-slate-400">
          A running archive of programs we have run. When a workshop wraps,
          we move it here to make room for what is next on the calendar.
        </p>
      </div>

      <Link
        to="/events"
        className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-stem-400 hover:text-stem-300"
      >
        <CalendarClock size={20} aria-hidden />
        Back to upcoming events
      </Link>

      {error ? (
        <p
          className="mt-12 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          role="alert"
        >
          Could not load past events: {error}
        </p>
      ) : null}

      {loading ? (
        <p className="mt-12 text-slate-500">Loading past events…</p>
      ) : null}

      {!loading && !error && pastEvents.length === 0 ? (
        <p className="mt-12 text-slate-500">No archived events yet.</p>
      ) : null}

      {!loading && !error && pastEvents.length > 0 ? (
        <ul className="mt-12 grid gap-8 sm:grid-cols-2">
          {pastEvents.map((event) => (
            <li key={event.id}>
              <PastEventCard event={event} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
