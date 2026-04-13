import { createClient } from "@supabase/supabase-js";

function envString(key: "VITE_SUPABASE_URL" | "VITE_SUPABASE_ANON_KEY"): string {
  const v = import.meta.env[key];
  if (v == null || typeof v !== "string") return "";
  return v.trim();
}

const supabaseUrl = envString("VITE_SUPABASE_URL");
const supabaseKey = envString("VITE_SUPABASE_ANON_KEY");
const looksLikePrivilegedKey = /service_role|sb_secret_/i.test(supabaseKey);

const missing: string[] = [];
if (!supabaseUrl) missing.push("VITE_SUPABASE_URL");
if (!supabaseKey) missing.push("VITE_SUPABASE_ANON_KEY");

if (missing.length > 0) {
  console.error(
    "[Supabase] Missing environment variable(s):",
    missing.join(", "),
    "— Add them to .env.local in the project root (use VITE_ prefix so Vite exposes them) and restart the dev server.",
  );
}

if (looksLikePrivilegedKey) {
  console.error(
    "[Supabase] VITE_SUPABASE_ANON_KEY appears to be privileged (service/secret key).",
    "Never expose privileged Supabase keys in frontend code.",
  );
}

/**
 * createClient requires non-empty URL/key; placeholders avoid a crash so the app can render
 * and show errors until .env.local is configured.
 */
export const supabase = createClient(
  supabaseUrl || "https://missing-env.supabase.co",
  looksLikePrivilegedKey ? "missing-anon-key" : supabaseKey || "missing-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
    },
  },
);
