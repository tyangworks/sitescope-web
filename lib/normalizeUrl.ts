export type NormalizedUrlResult = {
  url: string;
  error: string;
};

const WRAPPING_CHARS = /^[\s"'`<\[]+|[\s"'`>\]]+$/g;
const TRAILING_SENTENCE_PUNCTUATION = /[.,;:]+$/;

function looksLikeAuditableHost(hostname: string) {
  if (!hostname) return false;
  if (hostname === "localhost") return true;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) return true;
  if (hostname.includes(":")) return true;
  return hostname.includes(".");
}

export function normalizeUrlInput(input: string): NormalizedUrlResult {
  let value = input.trim().replace(WRAPPING_CHARS, "");

  if (!value) {
    return { url: "", error: "Enter a website, like example.com." };
  }

  value = value.replace(/\s+/g, "");
  value = value.replace(TRAILING_SENTENCE_PUNCTUATION, "");

  if (!/^https?:\/\//i.test(value)) {
    value = `https://${value}`;
  }

  try {
    const parsed = new URL(value);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { url: "", error: "Use a website URL that starts with http or https." };
    }

    if (parsed.username || parsed.password) {
      return { url: "", error: "Please remove usernames or passwords from the URL." };
    }

    parsed.protocol = parsed.protocol.toLowerCase();
    parsed.hostname = parsed.hostname.toLowerCase();
    parsed.hash = "";

    if (!looksLikeAuditableHost(parsed.hostname)) {
      return { url: "", error: "Enter a real website domain, like example.com." };
    }

    if (
      (parsed.protocol === "https:" && parsed.port === "443") ||
      (parsed.protocol === "http:" && parsed.port === "80")
    ) {
      parsed.port = "";
    }

    const path = parsed.pathname.replace(/\/+$/, "");
    parsed.pathname = path || "/";

    return {
      url: parsed.toString().replace(/\/$/, (match) => (path === "/" ? match : "")),
      error: "",
    };
  } catch {
    return { url: "", error: "Check the website address and try again." };
  }
}

export function normalizeUrl(input: string): string {
  return normalizeUrlInput(input).url;
}
