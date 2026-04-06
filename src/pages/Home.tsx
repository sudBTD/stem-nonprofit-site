import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Orbit,
  Cpu,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import type { FounderRow } from "../lib/dbTypes";

export function Home() {
  const [founders, setFounders] = useState<FounderRow[]>([]);
  const [foundersLoading, setFoundersLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadFounders() {
      setFoundersLoading(true);
      console.log("[Home] Starting to load founders...");
      console.log("[Home] Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
      console.log("[Home] Supabase Key exists:", !!import.meta.env.VITE_SUPABASE_ANON_KEY);

      const { data, error } = await supabase
        .from("founders")
        .select("id, name, bio, school, expertise, photo_url")
        .order("name");

      console.log("[Home] Supabase query completed");
      console.log("Founder Data:", data);
      console.log("[Home] Error received:", error);

      if (cancelled) return;

      if (error) {
        console.error("[Home] Failed to fetch founders:", error.message, error);
        setFounders([]);
      } else {
        console.log("[Home] Founders loaded successfully:", data);
        setFounders((data as FounderRow[] | null) ?? []);
      }
      setFoundersLoading(false);
    }

    void loadFounders();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <section className="hero-seedu" style={{ overflowX: 'hidden' }}>
        <div className="hero-seedu__glow" aria-hidden />
        <div className="hero-seedu__grid" aria-hidden />
        <div
          className="hero-seedu__orb left-0 top-1/3 h-72 w-72"
          style={{
            background: `color-mix(in srgb, var(--color-stem) 55%, transparent)`,
          }}
          aria-hidden
        />
        <div
          className="hero-seedu__orb right-0 top-[-10%] h-96 w-96"
          style={{
            background: `color-mix(in srgb, var(--color-stem) 40%, var(--color-surface-800))`,
          }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-16 px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:flex-row lg:items-center lg:gap-12 lg:pt-24">
          <div className="min-w-0 flex-1">
            <h1 className="mt-8 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              STEM education
              <span className="block bg-gradient-to-r from-[var(--color-stem-200)] via-[var(--color-stem)] to-[var(--color-stem-400)] bg-clip-text text-transparent">
                engineered for everyone.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
              <span 
                className="font-semibold"
                style={{
                  backgroundImage: 'linear-gradient(to right, #60a5fa, #06b6d4)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent'
                }}
              >seedu</span> runs immersive
              workshops and mentorship that feel like the real thing—because
              they are. No prerequisites except curiosity.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/events"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-[var(--color-surface)] shadow-lg transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  backgroundColor: "var(--color-stem)",
                  outlineColor: "var(--color-stem-300)",
                  boxShadow: `0 16px 48px color-mix(in srgb, var(--color-stem) 38%, transparent)`,
                }}
              >
                Join an event
                <ArrowRight size={20} strokeWidth={2} aria-hidden />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[color-mix(in_srgb,white_6%,transparent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30"
              >
                Partner with us
              </Link>
            </div>

            <div className="mt-14 flex flex-wrap gap-3 border-t border-white/10 pt-10">
              {[
                { Icon: Cpu, t: "Labs & builds", s: "Hands-on, mentor-led" },
                { Icon: Orbit, t: "Industry pathways", s: "Skills that transfer" },
                { Icon: ShieldCheck, t: "Belonging-first", s: "Access built in" },
              ].map(({ Icon, t, s }) => (
                <div
                  key={t}
                  className="flex min-w-[10.5rem] flex-1 items-start gap-3 rounded-2xl border border-white/10 bg-[color-mix(in_srgb,var(--color-surface-850)_65%,transparent)] px-4 py-3 backdrop-blur-sm sm:max-w-[12.5rem]"
                >
                  <span
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `color-mix(in srgb, var(--color-stem) 16%, transparent)`,
                      color: `var(--color-stem-200)`,
                    }}
                  >
                    <Icon size={20} strokeWidth={2} aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-white">
                      {t}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      {s}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Meet the Founder Section */}
      {console.log("[Home] Render check - foundersLoading:", foundersLoading, "founders.length:", founders.length)}
      {!foundersLoading && founders.length > 0 && (
        <section
          className="border-b border-white/10 py-20"
          style={{ backgroundColor: "var(--color-surface-900)" }}
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-stem-400)]">
                Meet the Founder
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Visionary Behind <span 
                  className="font-semibold"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #60a5fa, #06b6d4)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    color: 'transparent'
                  }}
                >seedu</span>
              </h2>
            </div>

            <div className="mt-12 flex flex-col items-center">
              <div
                className="w-full max-w-4xl rounded-2xl border border-white/10 p-8 lg:p-12"
                style={{
                  background: `linear-gradient(135deg, color-mix(in srgb, var(--color-surface-850) 90%, var(--color-stem)), var(--color-surface-850))`,
                }}
              >
                <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-12">
                  {/* Founder Image */}
                  <div className="flex-shrink-0">
                    {founders.length > 0 && founders[0].photo_url ? (
                      <img
                        src={founders[0].photo_url}
                        alt={`${founders[0].name} - Founder`}
                        className="h-32 w-32 rounded-2xl object-cover shadow-lg lg:h-40 lg:w-40"
                      />
                    ) : (
                      <div
                        className="flex h-32 w-32 items-center justify-center rounded-2xl text-4xl font-bold text-white lg:h-40 lg:w-40"
                        style={{
                          background: `linear-gradient(135deg, var(--color-stem), var(--color-stem-600))`,
                        }}
                      >
                        {founders.length > 0 ? founders[0].name.charAt(0) : "?"}
                      </div>
                    )}
                  </div>

                  {/* Founder Info */}
                  <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-2xl font-bold text-white lg:text-3xl">
                      {founders.length > 0 ? founders[0].name : "Founder Name"}
                    </h3>

                    <div className="mt-4 space-y-2">
                      {founders.length > 0 && founders[0].school && (
                        <p className="text-sm font-medium text-slate-300">
                          <span className="text-slate-500">School:</span> {founders[0].school}
                        </p>
                      )}
                      {founders.length > 0 && founders[0].expertise && (
                        <p className="text-sm font-medium text-[var(--color-stem-400)]">
                          <span className="text-slate-500">Expertise:</span> {founders[0].expertise}
                        </p>
                      )}
                    </div>

                    <p className="mt-6 text-lg leading-relaxed text-slate-300">
                      {founders.length > 0 ? founders[0].bio : "Founder bio will appear here once loaded from the database."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section
        className="border-b border-white/10 py-20"
        style={{ backgroundColor: "var(--color-surface-900)" }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-stem-400)]">
              How we work
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              A studio for young innovators
            </h2>
            <p className="mt-4 text-slate-400">
              Programs are designed as sequences—not one-off lectures—so ideas
              compound and confidence sticks.
            </p>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            <article className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[var(--color-surface-850)] p-8 lg:col-span-3">
              <div>
                <h3 className="text-lg font-semibold text-white">Inclusive by design</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  Scholarships, assistive formats, and multilingual support are
                  part of the operating model—not optional add-ons.
                </p>
              </div>
              <p
                className="mt-8 text-xs font-medium uppercase tracking-widest"
                style={{ color: "var(--color-stem-300)" }}
              >
                Access · dignity · rigor
              </p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
