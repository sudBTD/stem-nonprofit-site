import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, GraduationCap, Library } from "lucide-react";
import { accelerateResources } from "../data/resources";
import type { TutorRow } from "../lib/dbTypes";
import { supabase } from "../lib/supabase";

export function Resources() {
  const [tutors, setTutors] = useState<TutorRow[]>([]);
  const [loadingTutors, setLoadingTutors] = useState(true);
  const [tutorsError, setTutorsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTutors() {
      setLoadingTutors(true);
      setTutorsError(null);
      const { data, error } = await supabase
        .from("tutors")
        .select("id, name, bio, school, grade, subjects")
        .order("name");

      if (cancelled) return;

      if (error) {
        console.error("[Resources] Failed to fetch tutors:", error.message, error);
        setTutorsError(error.message);
        setTutors([]);
      } else {
        setTutors((data as TutorRow[] | null) ?? []);
      }
      setLoadingTutors(false);
    }

    void loadTutors();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Resources
        </h1>
        <p className="mt-4 text-slate-400">
          Peer tutors and curated links to help you go deeper—whether you are
          catching up, racing ahead, or exploring a new field for the first
          time.
        </p>
      </div>

      <section className="mt-16">
        <div className="flex items-center gap-2 text-stem-400">
          <GraduationCap size={20} aria-hidden />
          <h2 className="text-lg font-semibold text-white">Student tutors</h2>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Volunteer tutors from local colleges and industry. Reach out through{" "}
          <Link
            to="/contact"
            className="text-stem-400 underline-offset-2 hover:underline"
          >
            Get involved
          </Link>{" "}
          to match availability.
        </p>

        {tutorsError ? (
          <p
            className="mt-8 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200"
            role="alert"
          >
            Could not load tutors: {tutorsError}
          </p>
        ) : null}

        {loadingTutors ? (
          <p className="mt-8 text-slate-500">Loading tutors…</p>
        ) : null}

        {!loadingTutors && !tutorsError && tutors.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-dashed border-white/20 bg-surface-850/40 p-8 text-center text-sm text-slate-400">
            No tutor profiles yet. Admins can add them from{" "}
            <Link to="/admin" className="text-stem-400 underline-offset-2 hover:underline">
              Admin
            </Link>
            .
          </p>
        ) : null}

        {!loadingTutors && tutors.length > 0 ? (
          <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tutors.map((t) => (
              <li
                key={t.id}
                className="rounded-2xl border border-white/10 bg-surface-850/50 p-6"
              >
                <h3 className="font-semibold text-white">{t.name}</h3>
                {(t.school || t.grade || t.subjects) && (
                  <div className="mt-2 space-y-1 text-xs text-slate-500">
                    {t.school && <p>School: {t.school}</p>}
                    {t.grade && <p>Grade: {t.grade}</p>}
                    {t.subjects && <p>Expertise: {t.subjects}</p>}
                  </div>
                )}
                <p className="mt-4 text-sm leading-relaxed text-slate-400">
                  {t.bio}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="mt-20">
        <div className="flex items-center gap-2 text-stem-400">
          <Library size={20} aria-hidden />
          <h2 className="text-lg font-semibold text-white">
            Accelerate your STEM passion
          </h2>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Trusted starting points—mix structured courses with tinkering and
          local programs.
        </p>

        <ul className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10 bg-surface-850/30">
          {accelerateResources.map((r) => (
            <li key={r.href}>
              <a
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-1 px-5 py-4 transition hover:bg-white/5 sm:flex-row sm:items-center sm:justify-between"
              >
                <span>
                  <span className="font-medium text-white">{r.title}</span>
                  <span className="mt-1 block text-sm text-slate-400 sm:mt-0 sm:inline sm:before:content-['—'] sm:before:mx-2 sm:before:text-slate-600">
                    {r.blurb}
                  </span>
                </span>
                <ExternalLink
                  size={20}
                  className="shrink-0 text-stem-400 sm:ml-4"
                  aria-hidden
                />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
