import Link from "next/link";

export default function SiteFooter() {
  const contactEmail =
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@sitescope.fyi";

  return (
    <footer className="py-10 border-t border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="text-sm text-slate-500">
          © 2026 SiteScope.fyi. Built for growth teams.
        </div>
        <div className="flex items-center gap-5 text-sm font-medium">
          <Link className="text-slate-600 hover:text-slate-900" href="/privacy">
            Privacy
          </Link>
          <Link className="text-slate-600 hover:text-slate-900" href="/terms">
            Terms
          </Link>
          <a
            className="text-slate-600 hover:text-slate-900"
            href={`mailto:${contactEmail}`}
          >
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
}
