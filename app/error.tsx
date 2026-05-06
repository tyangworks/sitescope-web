"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen grid place-items-center bg-slate-50 px-6">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-7 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Something went wrong</h2>
        <p className="text-slate-600 mb-6">
          We hit an unexpected issue. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800"
        >
          Retry
        </button>
      </div>
    </main>
  );
}
