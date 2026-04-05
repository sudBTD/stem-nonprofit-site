import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, LogIn } from "lucide-react";
import { supabase } from "../lib/supabase";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-white/10 bg-surface-950/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-stem-500/50 focus:outline-none focus:ring-2 focus:ring-stem-500/30";
const labelClass = "block text-xs font-medium text-slate-400";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { from?: string } | null;
  const from =
    state?.from && state.from.startsWith("/") ? state.from : "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          console.error("[Login] getSession failed:", error.message, error);
        }
        if (session) {
          navigate(from, { replace: true });
        } else {
          setChecking(false);
        }
      })
      .catch((err: unknown) => {
        console.error("[Login] getSession threw:", err);
        setChecking(false);
      });
  }, [navigate, from]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const em = email.trim();
    if (!em || !password) return;
    setBusy(true);
    const { error: signErr } = await supabase.auth.signInWithPassword({
      email: em,
      password,
    });
    setBusy(false);
    if (signErr) {
      console.error("[Login] signInWithPassword failed:", signErr.message, signErr);
      setError(signErr.message);
      return;
    }
    navigate(from, { replace: true });
  }

  if (checking) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center text-slate-500 sm:px-6">
        Loading…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14 sm:px-6 sm:py-20">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
      >
        <ArrowLeft size={18} aria-hidden />
        Back to site
      </Link>

      <div className="mt-8 rounded-2xl border border-white/10 bg-surface-850/50 p-8">
        <h1 className="text-xl font-semibold text-white">Admin sign in</h1>
        <p className="mt-2 text-sm text-slate-400">
          Use the email and password from your Supabase project (Authentication
          → Users).
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="login-email" className={labelClass}>
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="login-password" className={labelClass}>
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          {error ? (
            <p className="text-sm text-red-300" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-stem-500 px-4 py-3 text-sm font-semibold text-surface-950 transition hover:bg-stem-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogIn size={18} aria-hidden />
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
