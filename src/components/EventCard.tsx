import { Calendar, Clock, MapPin } from "lucide-react";
import type { WorkshopEvent } from "../data/events";
import { formatTime } from "../lib/eventMappers";

type Props = {
  event: WorkshopEvent;
  variant?: "upcoming" | "past";
};

export function EventCard({ event, variant = "upcoming" }: Props) {
  const isPast = variant === "past";

  const getButtonContent = () => {
    if (!event.meetingLink) {
      return { text: "Coming Soon", isDisabled: true };
    }
    const isMeetGoogle = event.meetingLink.includes("meet.google.com");
    return {
      text: isMeetGoogle ? "Join Meeting" : "Register Now",
      isDisabled: false,
    };
  };

  const buttonContent = getButtonContent();

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-surface-850/80 to-surface-900/90 overflow-hidden shadow-xl shadow-black/20 transition hover:border-stem-500/35 hover:shadow-stem-500/10">
      {/* Event Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-stem-500 to-stem-600 flex items-center justify-center">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-stem-500 to-stem-600 text-white">
            <span className="text-2xl font-bold">SE Education</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-lg font-semibold tracking-tight text-white group-hover:text-stem-200">
          {event.title}
        </h2>

        <ul className="mt-4 space-y-2 text-sm text-slate-400">
          <li className="flex items-start gap-2">
            <Calendar size={20} className="mt-0.5 shrink-0 text-stem-400" aria-hidden />
            <span>{event.dateLabel}</span>
          </li>
          {event.specificTime && (
            <li className="flex items-start gap-2">
              <Clock size={20} className="mt-0.5 shrink-0 text-stem-400" aria-hidden />
              <span>{formatTime(event.specificTime)}</span>
            </li>
          )}
          <li className="flex items-start gap-2">
            <MapPin size={20} className="mt-0.5 shrink-0 text-stem-400" aria-hidden />
            <span>{event.location}</span>
          </li>
        </ul>

        <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-300">
          {event.description}
        </p>

        {isPast && event.outcome ? (
          <p className="mt-4 rounded-xl border border-stem-500/20 bg-stem-500/5 px-3 py-2 text-xs text-stem-100/90">
            <span className="font-medium text-stem-300">Outcome: </span>
            {event.outcome}
          </p>
        ) : null}
      </div>

      {!isPast ? (
        event.meetingLink ? (
          <a
            href={event.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-6 mb-6 inline-flex w-auto items-center justify-center rounded-xl bg-stem-500 px-4 py-2.5 text-sm font-semibold text-surface-950 transition hover:bg-stem-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stem-300"
          >
            {buttonContent.text}
          </a>
        ) : (
          <button
            disabled
            className="mx-6 mb-6 inline-flex w-auto items-center justify-center rounded-xl bg-slate-600 px-4 py-2.5 text-sm font-semibold text-slate-400 cursor-not-allowed opacity-60"
          >
            {buttonContent.text}
          </button>
        )
      ) : (
        <p className="mx-6 mb-6 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
          Completed
        </p>
      )}
    </article>
  );
}
