import type { WorkshopEvent } from "../data/events";
import { Clock, MapPin, Users } from "lucide-react";

type Props = {
  event: WorkshopEvent;
};

export function PastEventCard({ event }: Props) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface-850/50 shadow-lg transition hover:border-stem-500/35 hover:shadow-stem-500/15">
      {/* Image Section */}
      {event.imageUrl ? (
        <div className="relative w-full overflow-hidden bg-surface-900 pt-[66.67%]">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="w-full bg-gradient-to-br from-surface-800 to-surface-900 pt-[66.67%]" />
      )}

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-6">
        {/* Title and Date */}
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white group-hover:text-stem-200">
            {event.title}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm font-medium text-stem-400">
            <span>{event.dateLabel}</span>
            {event.displayTime ? (
              <span className="inline-flex items-center gap-2 text-slate-400">
                <Clock size={16} className="text-slate-500" aria-hidden />
                {event.displayTime}
              </span>
            ) : null}
          </div>
        </div>

        {/* Location */}
        {(event.displayLocation || event.location) && (
          <div className="mt-4 flex items-start gap-2">
            <MapPin
              size={18}
              className="mt-0.5 shrink-0 text-slate-500"
              aria-hidden
            />
            <p className="text-sm text-slate-400">{event.displayLocation || event.location}</p>
          </div>
        )}

        {/* Attendee Count */}
        {event.attendeeCount ? (
          <div className="mt-4 flex items-center gap-2">
            <Users size={18} className="text-slate-500" aria-hidden />
            <p className="text-sm text-slate-400">
              {event.attendeeCount.toLocaleString()} attendees
            </p>
          </div>
        ) : null}

        {/* Description */}
        <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-300">
          {event.description}
        </p>

        {/* Impact Summary Box */}
        <div className="mt-6 rounded-xl bg-slate-800/40 px-4 py-3.5 border border-slate-700/50">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Impact Summary
          </p>
          <p className="text-sm text-slate-300">
            {event.displayImpactSummary ?? event.impactSummary ?? event.outcome ?? "Program impact and outcomes coming soon."}
          </p>
        </div>
      </div>
    </article>
  );
}
