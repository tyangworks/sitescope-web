"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Globe, Menu, X } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, language, setLanguage } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [language]);

  const links = [
    { href: "/", label: t.nav.analyze },
    { href: "/#pricing", label: t.nav.pricing },
    { href: "/content", label: t.nav.content },
    { href: "/services", label: t.nav.services },
    { href: "/reports", label: t.nav.history },
  ];

  const languageSwitcher = (mobile = false) => (
    <div className="flex items-center rounded-lg border border-gray-700 bg-[#111827] p-1">
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        className={`${mobile ? "flex-1" : ""} rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
          language === "en"
            ? "bg-[#3A8DFF] text-white"
            : "text-gray-400 hover:text-white"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("zh")}
        aria-pressed={language === "zh"}
        className={`${mobile ? "flex-1" : ""} rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
          language === "zh"
            ? "bg-[#3A8DFF] text-white"
            : "text-gray-400 hover:text-white"
        }`}
      >
        中
      </button>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-[#0B0F1A]/95 text-white backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2" onClick={() => setMenuOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-teal-400">
            <Globe className="h-5 w-5 text-white" />
          </span>
          <span className="text-lg font-bold">SiteScope</span>
        </Link>

        <div className="hidden items-center gap-5 lg:flex xl:gap-7">
          <nav aria-label="Primary navigation" className="flex items-center gap-5 text-sm font-semibold text-gray-300 xl:gap-7">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="whitespace-nowrap transition-colors hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
          {languageSwitcher()}
          <Link
            href="/login"
            className="whitespace-nowrap rounded-xl bg-gradient-to-r from-blue-500 to-teal-400 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            {t.nav.login}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-700 text-gray-300 transition-colors hover:text-white lg:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-800 bg-[#0B0F1A] px-5 py-4 lg:hidden">
          <nav aria-label="Mobile navigation" className="mx-auto max-w-7xl space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 font-semibold text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <div className="grid gap-3 pt-3 sm:grid-cols-2">
              {languageSwitcher(true)}
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-teal-400 px-4 py-2 text-sm font-semibold text-white"
              >
                {t.nav.login}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
