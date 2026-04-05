import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { History } from "lucide-react";
import { EventCard } from "../components/EventCard";
import type { WorkshopEvent } from "../data/events";
import { mapEventRowsToWorkshopEvents } from "../lib/eventMappers";
import { supabase } from "../lib/supabase";

export function Events() {
  const [events, setEvents] = useState<WorkshopEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      const { data, error: qError } = await supabase
        .from("events")
        .select("id, title, description, date, is_past, image_url, location_detailed, attendee_count, impact_summary, meeting_link, specific_time")
        .eq("is_past", false)
        .order("date", { ascending: true });

      if (cancelled) return;

      if (qError) {
        console.error("[Events] Fetch failed:", qError.message, qError);
        setError(qError.message);
        setEvents([]);
      } else {
        setEvents(mapEventRowsToWorkshopEvents(data));
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
          Upcoming workshops
        </h1>
        <p className="mt-4 text-slate-400">
          Reserve a seat, meet mentors, and build something you are proud to
          share. Programs are designed for mixed experience levels.
        </p>
      </div>

      <Link
        to="/events/past"
        className="mt-8 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-stem-500/40 hover:bg-stem-500/10 hover:text-white"
      >
        <History size={20} className="text-stem-400" aria-hidden />
        View past events
      </Link>

      {error ? (
        <p
          className="mt-12 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          role="alert"
        >
          Could not load events: {error}
        </p>
      ) : null}

      {loading ? <p className="mt-12 text-slate-500">Loading events…</p> : null}

      {!loading && !error && events.length === 0 ? (
        <p className="mt-12 rounded-2xl border border-dashed border-white/20 bg-surface-850/40 p-8 text-center text-slate-400">
          New workshops are being scheduled.{" "}
          <Link to="/contact" className="text-stem-400 underline-offset-2 hover:underline">
            Get in touch
          </Link>{" "}
          to hear first.
        </p>
      ) : null}

      {!loading && !error && events.length > 0 ? (
        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {events.map((event) => (
            <li key={event.id}>
              <EventCard event={event} variant="upcoming" />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
