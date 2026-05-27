"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, MousePointer2 } from "lucide-react";
import { normalizeUrlInput } from "@/lib/normalizeUrl";

function errorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

type AuditUrlFormProps = {
  buttonLabel?: string;
  compact?: boolean;
};

export default function AuditUrlForm({
  buttonLabel = "Get Free Audit",
  compact = false,
}: AuditUrlFormProps) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const normalizedPreview = normalizeUrlInput(url);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const normalized = normalizeUrlInput(url);

    if (!normalized.url) {
      setError(normalized.error);
      return;
    }

    setUrl(normalized.url);
    setError("");
    setLoading(true);

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "https://api.sitescope.fyi";
      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalized.url }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Audit failed");
      router.push(`/report/${result.id}`);
    } catch (error: unknown) {
      setError(errorMessage(error, "Could not start the audit. Please try again."));
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col items-stretch gap-3 border border-gray-700 bg-[#111827] p-2 shadow-xl shadow-black/20 md:flex-row ${
          compact ? "rounded-xl" : "rounded-2xl"
        }`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
          <MousePointer2 className="h-5 w-5 flex-shrink-0 text-gray-500" />
          <input
            type="text"
            inputMode="url"
            value={url}
            onBlur={() => {
              const normalized = normalizeUrlInput(url);
              if (normalized.url) setUrl(normalized.url);
            }}
            onChange={(event) => {
              setUrl(event.target.value);
              if (error) setError("");
            }}
            placeholder="Enter your website, e.g. example.com"
            className="w-full bg-transparent py-3 text-base font-semibold text-white outline-none placeholder:text-gray-500 md:text-lg"
            disabled={loading}
            autoCapitalize="none"
            autoComplete="url"
            autoCorrect="off"
            spellCheck={false}
            aria-invalid={Boolean(error)}
          />
        </div>
        <button
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-teal-400 px-6 py-3 text-base font-black text-white transition-all hover:opacity-90 disabled:opacity-70"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : buttonLabel}
        </button>
      </form>
      <p className="mt-3 text-center text-xs font-semibold text-gray-500">
        No signup required. Results in minutes.
      </p>
      {error && (
        <p className="mt-3 flex items-center justify-center gap-2 text-center text-sm font-bold text-red-400">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
      {!error && url && normalizedPreview.url && normalizedPreview.url !== url && (
        <p className="mt-3 text-center text-sm font-medium text-gray-400">
          We will audit:{" "}
          <span className="text-teal-300">{normalizedPreview.url}</span>
        </p>
      )}
    </div>
  );
}
