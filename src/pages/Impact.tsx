import { Quote, HeartHandshake } from "lucide-react";
import { useEffect, useState } from "react";
import { StatCounter } from "../components/StatCounter";
import { supabase } from "../lib/supabase";
import type { StatRow, TestimonialRow } from "../lib/dbTypes";

export function Impact() {
  const [stats, setStats] = useState<StatRow[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);

      // Fetch stats
      const { data: statsData, error: statsError } = await supabase
        .from("stats")
        .select("id, label, value")
        .order("label");

      // Fetch testimonials
      const { data: testimonialsData, error: testimonialsError } = await supabase
        .from("testimonials")
        .select("id, name, role, content, image_url")
        .order("name");

      if (cancelled) return;

      if (statsError) {
        console.error("[Impact] Failed to fetch stats:", statsError);
        setStats([]);
      } else {
        setStats(statsData || []);
      }

      if (testimonialsError) {
        console.error("[Impact] Failed to fetch testimonials:", testimonialsError);
        setTestimonials([]);
      } else {
        setTestimonials(testimonialsData || []);
      }

      setLoading(false);
    }

    void loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Impact
        </h1>
        <p className="mt-4 text-slate-400">
          Numbers tell part of the story. The rest lives in classrooms,
          living rooms, and the quiet confidence of a student who just shipped
          their first project.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {loading ? (
          <>
            <div className="animate-pulse rounded-2xl border border-white/10 bg-surface-850/50 p-6">
              <div className="h-8 w-16 rounded bg-white/10"></div>
              <div className="mt-2 h-4 w-32 rounded bg-white/5"></div>
            </div>
            <div className="animate-pulse rounded-2xl border border-white/10 bg-surface-850/50 p-6">
              <div className="h-8 w-16 rounded bg-white/10"></div>
              <div className="mt-2 h-4 w-32 rounded bg-white/5"></div>
            </div>
            <div className="animate-pulse rounded-2xl border border-white/10 bg-surface-850/50 p-6">
              <div className="h-8 w-16 rounded bg-white/10"></div>
              <div className="mt-2 h-4 w-32 rounded bg-white/5"></div>
            </div>
          </>
        ) : (
          stats.map((stat) => (
            <StatCounter
              key={stat.id}
              value={stat.value}
              label={stat.label}
            />
          ))
        )}
      </div>

      <section className="mt-20">
        <div className="flex items-center gap-2 text-stem-400">
          <HeartHandshake size={20} aria-hidden />
          <h2 className="text-sm font-semibold uppercase tracking-wider">
            Voices from our community
          </h2>
        </div>
        <p className="mt-2 text-xl font-semibold text-white">
          Students, parents, and educators
        </p>

        <ul className="mt-10 grid gap-6 lg:grid-cols-3">
          {loading ? (
            <>
              <div className="animate-pulse rounded-2xl border border-white/10 bg-surface-850/50 p-6">
                <div className="h-5 w-5 rounded bg-white/10"></div>
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-full rounded bg-white/5"></div>
                  <div className="h-4 w-3/4 rounded bg-white/5"></div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-white/10"></div>
                  <div className="space-y-1">
                    <div className="h-3 w-16 rounded bg-white/5"></div>
                    <div className="h-3 w-12 rounded bg-white/5"></div>
                  </div>
                </div>
              </div>
              <div className="animate-pulse rounded-2xl border border-white/10 bg-surface-850/50 p-6">
                <div className="h-5 w-5 rounded bg-white/10"></div>
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-full rounded bg-white/5"></div>
                  <div className="h-4 w-3/4 rounded bg-white/5"></div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-white/10"></div>
                  <div className="space-y-1">
                    <div className="h-3 w-16 rounded bg-white/5"></div>
                    <div className="h-3 w-12 rounded bg-white/5"></div>
                  </div>
                </div>
              </div>
              <div className="animate-pulse rounded-2xl border border-white/10 bg-surface-850/50 p-6">
                <div className="h-5 w-5 rounded bg-white/10"></div>
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-full rounded bg-white/5"></div>
                  <div className="h-4 w-3/4 rounded bg-white/5"></div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-white/10"></div>
                  <div className="space-y-1">
                    <div className="h-3 w-16 rounded bg-white/5"></div>
                    <div className="h-3 w-12 rounded bg-white/5"></div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            testimonials.map((testimonial) => (
              <li
                key={testimonial.id}
                className="flex flex-col rounded-2xl border border-white/10 bg-surface-850/50 p-6"
              >
                <Quote size={20} className="text-stem-500/60" aria-hidden />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-300">
                  "{testimonial.content}"
                </blockquote>
                <footer className="mt-6 border-t border-white/10 pt-4">
                  {testimonial.image_url && (
                    <img
                      src={testimonial.image_url}
                      alt={testimonial.name}
                      className="mb-3 h-8 w-8 rounded-full object-cover"
                    />
                  )}
                  <p className="font-medium text-white">{testimonial.name}</p>
                  <p className="text-xs text-stem-400">{testimonial.role}</p>
                </footer>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
