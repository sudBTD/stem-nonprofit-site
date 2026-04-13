type SanitizeExternalUrlOptions = {
  allowHosts?: string[];
};

/**
 * Returns a safe absolute HTTP(S) URL string or null.
 */
export function sanitizeExternalUrl(
  rawUrl: string | null | undefined,
  options?: SanitizeExternalUrlOptions,
): string | null {
  const value = rawUrl?.trim();
  if (!value) return null;

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return null;
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return null;
  }

  if (options?.allowHosts && options.allowHosts.length > 0) {
    const host = parsed.hostname.toLowerCase();
    const allowed = options.allowHosts.some((allowedHost) => host === allowedHost.toLowerCase());
    if (!allowed) return null;
  }

  return parsed.toString();
}