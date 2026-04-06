import { Calendar, Clock, MapPin, Users, Maximize, ExternalLink } from "lucide-react";
import type { WorkshopEvent } from "../data/events";
import { formatTime } from "../lib/eventMappers";
import { useRef } from "react";

type Props = {
  event: WorkshopEvent;
  variant?: "upcoming" | "past";
};

export function EventCard({ event, variant = "upcoming" }: Props) {
  const isPast = variant === "past";
  const iframeRef = useRef<HTMLIFrameElement>(null);

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
  const displayTime = event.displayTime;
  const displayLocation = event.displayLocation ?? event.location;
  const impactSummary = event.displayImpactSummary ?? event.impactSummary;

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
            <span 
              className="text-2xl font-semibold"
              style={{
                backgroundImage: 'linear-gradient(to right, #60a5fa, #06b6d4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent'
              }}
            >seedu</span>
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
          {displayTime && (
            <li className="flex items-start gap-2">
              <Clock size={20} className="mt-0.5 shrink-0 text-stem-400" aria-hidden />
              <span>{formatTime(displayTime)}</span>
            </li>
          )}
          <li className="flex items-start gap-2">
            <MapPin size={20} className="mt-0.5 shrink-0 text-stem-400" aria-hidden />
            <span>{displayLocation}</span>
          </li>
          {event.attendeeCount != null ? (
            <li className="flex items-start gap-2">
              <Users size={20} className="mt-0.5 shrink-0 text-stem-400" aria-hidden />
              <span>{event.attendeeCount.toLocaleString()} attendees</span>
            </li>
          ) : null}
        </ul>

        <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-300">
          {event.description}
        </p>

        {impactSummary ? (
          <div className="mt-4 rounded-2xl border border-stem-500/20 bg-stem-500/5 px-3 py-3 text-sm leading-relaxed text-stem-100">
            <span className="font-medium text-stem-300 uppercase tracking-wider">
              Impact Summary
            </span>
            <p className="mt-2 text-sm leading-relaxed text-stem-100">
              {impactSummary}
            </p>
          </div>
        ) : null}

        {event.slidesUrl ? (
          <div className="mt-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Presentation Slides
            </h3>
            <iframe
              src={event.slidesUrl}
              className="mt-3 w-full aspect-video rounded-xl border border-slate-800 shadow-2xl"
              allowFullScreen={true}
              {...({ mozallowfullscreen: "true", webkitallowfullscreen: "true" } as any)}
              ref={iframeRef}
            />
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
              <button
                onClick={() => iframeRef.current?.requestFullscreen()}
                className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
              >
                <Maximize size={16} />
                View Fullscreen
              </button>
              <a
                href={event.slidesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
              >
                <ExternalLink size={16} />
                Open in New Window
              </a>
            </div>
          </div>
        ) : null}

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
