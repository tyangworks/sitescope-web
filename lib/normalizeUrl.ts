export function normalizeUrl(input: string): string {
  let value = input.trim();
  if (!value) return "";
  if (!/^https?:\/\//i.test(value)) {
    value = `https://${value}`;
  }

  try {
    const parsed = new URL(value);
    parsed.hostname = parsed.hostname.toLowerCase();
    const path = parsed.pathname.replace(/\/+$/, "");
    parsed.pathname = path || "/";
    return parsed.toString().replace(/\/$/, (m) => (path === "/" ? m : ""));
  } catch {
    return value.replace(/\/+$/, "");
  }
}
