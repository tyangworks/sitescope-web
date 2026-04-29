"use client";

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <div className="text-xl font-bold">
          SiteScope
        </div>

        {/* MENU */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="/pricing" className="hover:opacity-70">
            Pricing
          </a>
          <a href="/build" className="hover:opacity-70">
            Build
          </a>
          <a href="/login" className="hover:opacity-70">
            Sign in
          </a>
        </div>

        {/* CTA */}
        <a
          href="/audit"
          className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-90"
        >
          Get Audit
        </a>
      </div>
    </nav>
  );
}