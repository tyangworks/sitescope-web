"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe, ArrowLeft, Loader2, Mail } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { toast } from "sonner";
import { supabase, authProviders } from "@/lib/auth";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [linkSent, setLinkSent] = useState(false);
  const { t, language, setLanguage } = useTranslation();

  const getReturnPath = () => {
    const value = new URLSearchParams(window.location.search).get("next");
    return value && value.startsWith("/") && !value.startsWith("//")
      ? value
      : "/reports";
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const next = getReturnPath();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });

      if (error) throw error;

      setLinkSent(true);
      toast.success("Check your email for a secure sign-in link.");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (
    providerId: "google" | "microsoft",
    provider: "google" | "azure",
  ) => {
    setOauthLoading(providerId);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(getReturnPath())}`,
        },
      });

      if (error) throw error;

    } catch (error: unknown) {
      toast.error(getErrorMessage(error, `${provider} login failed`));
      setOauthLoading(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0F1A] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-[#9CA3AF] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.common.back}
        </Link>

        {/* Login Card */}
        <div className="bg-[#111827] rounded-2xl p-8 border border-[#1F2937] shadow-xl">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-[#3A8DFF] to-[#00C2A8] rounded-lg flex items-center justify-center">
              <Globe className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-white text-xl">SiteScope</span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">{t.auth.loginTitle}</h1>
            <p className="text-[#9CA3AF] text-sm">{t.auth.loginSubtitle}</p>
          </div>

          {/* OAuth Login Buttons */}
          <div className="space-y-3 mb-6">
            {authProviders.map((provider) => (
  <button
    key={provider.id}
    onClick={() => handleOAuthLogin(
      provider.id as "google" | "microsoft",
      provider.id === 'microsoft' ? 'azure' : 'google',
    )}
    disabled={oauthLoading !== null}
    className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium transition-all border ${
      provider.bgColor
    } ${provider.textColor} ${provider.borderColor} hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed`}
  >
    {oauthLoading === provider.id ? (
      <Loader2 className="w-5 h-5 animate-spin" />
    ) : null}
    <span>
      {oauthLoading === provider.id 
        ? t.common.loading 
        : `Continue with ${provider.name}`
      }
    </span>
  </button>
))}
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1F2937]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#111827] text-[#6B7280]">or</span>
            </div>
          </div>

          {/* Passwordless email sign-in */}
          <form onSubmit={handleMagicLink} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                {t.auth.email}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-[#0B0F1A] border border-[#1F2937] rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#3A8DFF] focus:ring-2 focus:ring-[#3A8DFF]/20 text-white placeholder-[#6B7280] transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-bg text-white font-semibold rounded-xl py-3 hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t.common.loading}
                </>
              ) : (
                linkSent ? "Send Link Again" : "Email Me a Magic Link"
              )}
            </button>
            {linkSent && (
              <p className="text-center text-sm text-[#00C2A8]">
                The sign-in link has been sent. You can close this page after opening it.
              </p>
            )}
          </form>
        </div>

        {/* Language Switcher */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-2 bg-[#111827] rounded-lg p-1 border border-[#1F2937]">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                language === 'en' 
                  ? 'bg-[#3A8DFF] text-white' 
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('zh')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                language === 'zh' 
                  ? 'bg-[#3A8DFF] text-white' 
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              中文
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
