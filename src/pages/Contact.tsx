import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { Send, Building2, HandHeart } from "lucide-react";

type Involvement = "volunteer" | "partner";

export function Contact() {
  const [params] = useSearchParams();
  const eventPrefill = params.get("event") ?? "";

  const [involvement, setInvolvement] = useState<Involvement>("volunteer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!eventPrefill) return;
    const line = `I would like to RSVP or learn more about: ${eventPrefill}\n\n`;
    setMessage((prev) => (prev.trim() === "" ? line : prev));
  }, [eventPrefill]);

  const heading = useMemo(
    () =>
      involvement === "partner"
        ? "Partner with us"
        : "Volunteer with STEM Forward",
    [involvement],
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Get involved
          </h1>
          <p className="mt-4 text-slate-400">
            Whether you can mentor for an evening or co-design a semester with
            us, we would love to hear from you. This demo form captures your
            intent locally—wire it to your CRM or inbox when you deploy.
          </p>
          <ul className="mt-8 space-y-4 text-sm text-slate-400">
            <li className="flex gap-3">
              <HandHeart size={20} className="shrink-0 text-stem-400" aria-hidden />
              <span>
                <strong className="text-slate-200">Volunteers:</strong> workshop
                support, tutoring, translation, and accessibility allies.
              </span>
            </li>
            <li className="flex gap-3">
              <Building2 size={20} className="shrink-0 text-stem-400" aria-hidden />
              <span>
                <strong className="text-slate-200">Partners:</strong> schools,
                companies, and civic orgs hosting or sponsoring programs.
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-surface-850/50 p-6 sm:p-8">
          <div className="flex flex-wrap gap-2 rounded-xl bg-surface-950/60 p-1">
            <button
              type="button"
              onClick={() => setInvolvement("volunteer")}
              className={[
                "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition min-w-[8rem]",
                involvement === "volunteer"
                  ? "bg-stem-500 text-surface-950"
                  : "text-slate-400 hover:text-white",
              ].join(" ")}
            >
              <HandHeart size={20} aria-hidden />
              Volunteer
            </button>
            <button
              type="button"
              onClick={() => setInvolvement("partner")}
              className={[
                "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition min-w-[8rem]",
                involvement === "partner"
                  ? "bg-stem-500 text-surface-950"
                  : "text-slate-400 hover:text-white",
              ].join(" ")}
            >
              <Building2 size={20} aria-hidden />
              Organization
            </button>
          </div>

          <h2 className="mt-8 text-lg font-semibold text-white">{heading}</h2>

          {submitted ? (
            <p
              className="mt-6 rounded-xl border border-stem-500/30 bg-stem-500/10 px-4 py-3 text-sm text-stem-100"
              role="status"
            >
              Thank you—your message is ready to send. Connect this form to your
              backend or form service to deliver it for real.
            </p>
          ) : (
            <form className="mt-6 space-y-5" onSubmit={onSubmit}>
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-slate-400">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-surface-950/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-stem-500/50 focus:outline-none focus:ring-2 focus:ring-stem-500/30"
                  placeholder="Jordan Smith"
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-slate-400">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-surface-950/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-stem-500/50 focus:outline-none focus:ring-2 focus:ring-stem-500/30"
                  placeholder="you@organization.org"
                  autoComplete="email"
                />
              </div>
              <div>
                <label
                  htmlFor="organization"
                  className="block text-xs font-medium text-slate-400"
                >
                  Organization {involvement === "volunteer" ? "(optional)" : null}
                </label>
                <input
                  id="organization"
                  name="organization"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-surface-950/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-stem-500/50 focus:outline-none focus:ring-2 focus:ring-stem-500/30"
                  placeholder={
                    involvement === "partner"
                      ? "Company or school name"
                      : "If applicable"
                  }
                  autoComplete="organization"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-xs font-medium text-slate-400">
                  How would you like to contribute?
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1.5 w-full resize-y rounded-xl border border-white/10 bg-surface-950/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-stem-500/50 focus:outline-none focus:ring-2 focus:ring-stem-500/30"
                  placeholder="Tell us about your skills, goals, or partnership ideas."
                />
              </div>
              <input type="hidden" name="involvement" value={involvement} />
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-stem-500 px-4 py-3 text-sm font-semibold text-surface-950 transition hover:bg-stem-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stem-300 sm:w-auto"
              >
                <Send size={20} aria-hidden />
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
