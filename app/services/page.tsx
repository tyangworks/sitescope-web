"use client";

import { useState } from "react";
import Link from "next/link"; // 修复：使用默认导入
import {
  Globe,
  ArrowLeft,
  Loader2,
  Mail,
  Globe as WebIcon,
  Target,
  MessageSquare,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { toast } from "sonner";

export default function ServicesPage() {
  
  const [formData, setFormData] = useState({
    email: "",
    companyName: "", // 公司名
    website: "",
    goal: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const { t, language, setLanguage } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission - replace with actual API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Request submitted successfully!");
      setFormData({
        email: "",
        companyName: "",
        website: "",
        goal: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#0B0F1A]">
      {/* Navigation */}
      <nav className="bg-[#0B0F1A]/80 backdrop-blur-md border-b border-[#1F2937] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#3A8DFF] to-[#00C2A8] rounded-lg flex items-center justify-center">
              <Globe className="text-white w-4 h-4" />
            </div>
            <span className="font-bold text-white">SiteScope</span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center gap-2 bg-[#111827] rounded-lg p-1 border border-[#1F2937]">
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  language === "en"
                    ? "bg-[#3A8DFF] text-white"
                    : "text-[#9CA3AF] hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("zh")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  language === "zh"
                    ? "bg-[#3A8DFF] text-white"
                    : "text-[#9CA3AF] hover:text-white"
                }`}
              >
                中
              </button>
            </div>

            <Link
              href="/login"
              className="px-4 py-2 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-all"
            >
              {t.nav.login}
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#9CA3AF] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.common.back}
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            {t.cta.title}
          </h1>
          <p className="text-[#9CA3AF] text-lg max-w-2xl mx-auto">
            {t.cta.subtitle}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#111827] rounded-2xl p-8 border border-[#1F2937] shadow-xl">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                {t.cta.email} *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder={t.report.enterEmail}
                  className="w-full bg-[#0B0F1A] border border-[#1F2937] rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#3A8DFF] focus:ring-2 focus:ring-[#3A8DFF]/20 text-white placeholder-[#6B7280] transition-all"
                  required
                />
              </div>
            </div>

            {/* Company Name (必填) */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Company Name *
              </label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  placeholder="Your Company Name"
                  className="w-full bg-[#0B0F1A] border border-[#1F2937] rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#3A8DFF] focus:ring-2 focus:ring-[#3A8DFF]/20 text-white placeholder-[#6B7280] transition-all"
                  required
                />
              </div>
            </div>

            {/* Website  (可选) */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Website (Optional)
              </label>
              <div className="relative">
                <WebIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  placeholder="https://yourwebsite.com"
                  className="w-full bg-[#0B0F1A] border border-[#1F2937] rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#3A8DFF] focus:ring-2 focus:ring-[#3A8DFF]/20 text-white placeholder-[#6B7280] transition-all"
                />
              </div>
            </div>

            {/* Goal */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                {t.cta.goal}
              </label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <select
                  value={formData.goal}
                  onChange={(e) =>
                    setFormData({ ...formData, goal: e.target.value })
                  }
                  className="w-full bg-[#0B0F1A] border border-[#1F2937] rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#3A8DFF] focus:ring-2 focus:ring-[#3A8DFF]/20 text-white transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="bg-[#111827]">
                    Select your goal
                  </option>
                  <option value="redesign" className="bg-[#111827]">
                    Website Redesign
                  </option>
                  <option value="performance" className="bg-[#111827]">
                    Performance Optimization
                  </option>
                  <option value="seo" className="bg-[#111827]">
                    SEO Improvement
                  </option>
                  <option value="conversion" className="bg-[#111827]">
                    Conversion Rate Optimization
                  </option>
                  <option value="new" className="bg-[#111827]">
                    New Website Build
                  </option>
                  <option value="other" className="bg-[#111827]">
                    Other
                  </option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                {t.cta.message}
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-[#6B7280]" />
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Tell us more about your project..."
                  rows={4}
                  className="w-full bg-[#0B0F1A] border border-[#1F2937] rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#3A8DFF] focus:ring-2 focus:ring-[#3A8DFF]/20 text-white placeholder-[#6B7280] transition-all resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-bg text-white font-semibold rounded-xl py-4 hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60 text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t.common.loading}
                </>
              ) : (
                t.cta.submit
              )}
            </button>
          </form>
          {/* Info */}
          <div className="mt-6 p-4 bg-[#0B0F1A] rounded-xl border border-[#1F2937]">
            <p className="text-sm text-[#9CA3AF] text-center">
              🚀 Our team will review your request and get back to you within 24
              hours.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Globe className="w-6 h-6" />,
              title: "Custom Design",
              desc: "Unique designs tailored to your brand",
            },
            {
              icon: <Target className="w-6 h-6" />,
              title: "Performance First",
              desc: "Lightning-fast load times",
            },
            {
              icon: <MessageSquare className="w-6 h-6" />,
              title: "SEO Optimized",
              desc: "Built to rank on search engines",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-[#111827] p-6 rounded-xl border border-[#1F2937] text-center hover:border-[#3A8DFF]/50 transition-all"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-[#3A8DFF]/20 rounded-lg flex items-center justify-center text-[#3A8DFF]">
                {feature.icon}
              </div>
              <h3 className="font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-[#9CA3AF]">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
