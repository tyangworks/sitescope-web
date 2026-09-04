"use client";

import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Globe, Heart } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const paypalDonateUrl =
  "https://www.paypal.com/donate/?hosted_button_id=DMPQU9NWDQDYE";

export default function SiteFooter() {
  const { t, language } = useTranslation();
  const copy = language === "zh"
    ? {
        tagline: "为增长团队提供 AI 网站审计。",
        product: "产品",
        reports: "报告",
        legal: "法律",
        privacy: "隐私政策",
        terms: "服务条款",
        contact: "联系我们",
        support: "支持我们",
        donate: "捐赠",
        donateCopy: "支持我们继续提供免费 AI 网站审计。",
        donateButton: "通过 PayPal 捐赠",
        copyright: "© 2026 SiteScope。为增长团队打造。",
      }
    : {
        tagline: "AI-powered website audits for growth teams.",
        product: "Product",
        reports: "Reports",
        legal: "Legal",
        privacy: "Privacy",
        terms: "Terms",
        contact: "Contact Us",
        support: "Support",
        donate: "Donate",
        donateCopy: "Support free AI website audits.",
        donateButton: "Donate with PayPal",
        copyright: "© 2026 SiteScope. Built for growth teams.",
      };

  return (
    <footer className="border-t border-gray-800 bg-[#0B0F1A] px-6 py-12 text-sm text-gray-500 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-8 md:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-teal-400">
              <Globe className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white">SiteScope</span>
          </div>
          <p className="text-gray-400">
            {copy.tagline}
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">{copy.product}</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="transition-colors hover:text-white">
                {t.nav.analyze}
              </Link>
            </li>
            <li>
              <Link href="/content" className="transition-colors hover:text-white">
                {t.nav.content}
              </Link>
            </li>
            <li>
              <Link href="/services" className="transition-colors hover:text-white">
                {t.nav.services}
              </Link>
            </li>
            <li>
              <Link href="/reports" className="transition-colors hover:text-white">
                {copy.reports}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">{copy.legal}</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/privacy" className="transition-colors hover:text-white">
                {copy.privacy}
              </Link>
            </li>
            <li>
              <Link href="/terms" className="transition-colors hover:text-white">
                {copy.terms}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition-colors hover:text-white">
                {copy.contact}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">{copy.support}</h4>
          <div className="rounded-2xl border border-gray-800 bg-[#111827] p-4">
            <div className="flex items-center gap-3">
              <Image
                src="/paypal-donate-qr.png"
                alt="PayPal donation QR code"
                width={72}
                height={72}
                className="rounded-lg border border-gray-700 bg-white p-1"
              />
          <div>
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Heart className="h-4 w-4 text-blue-300" />
                  {copy.donate}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-gray-400">
                  {copy.donateCopy}
                </p>
              </div>
            </div>
            <a
              href={paypalDonateUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#ffc439] px-4 py-2 text-xs font-black text-[#003087] transition-opacity hover:opacity-90"
            >
              {copy.donateButton}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
        </div>

        <div className="flex flex-col items-center justify-between border-t border-gray-800 pt-8 md:flex-row">
          <div className="text-gray-600">
            {copy.copyright}
          </div>
          <div className="mt-4 flex gap-6 md:mt-0">
            <a href="#" className="transition-colors hover:text-gray-400">
              Twitter
            </a>
            <a href="#" className="transition-colors hover:text-gray-400">
              LinkedIn
            </a>
            <a href="#" className="transition-colors hover:text-gray-400">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
