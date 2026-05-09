"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe, ArrowLeft, Loader2, Mail, Lock } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { toast } from "sonner";
import { supabase, authProviders } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const { t, language, setLanguage } = useTranslation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Login successful!");
      window.location.href = "/reports";
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'azure') => {
    setOauthLoading(provider);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      // OAuth 会自动重定向，这里不需要手动处理
    } catch (error: any) {
      toast.error(error.message || `${provider} login failed`);
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
    onClick={() => handleOAuthLogin(provider.id === 'microsoft' ? 'azure' : 'google')}
    disabled={oauthLoading !== null}
    className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium transition-all border ${
      provider.bgColor
    } ${provider.textColor} ${provider.borderColor} hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed`}
  >
    {oauthLoading === provider.id ? (
      <Loader2 className="w-5 h-5 animate-spin" />
    ) : (
      <span className="text-xl">{provider.icon}</span>
    )}
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

          {/* Email/Password Form */}
          <form onSubmit={handleLogin} className="space-y-6">
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

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                {t.auth.password}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0B0F1A] border border-[#1F2937] rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#3A8DFF] focus:ring-2 focus:ring-[#3A8DFF]/20 text-white placeholder-[#6B7280] transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[#9CA3AF] cursor-pointer">
                <input type="checkbox" className="rounded border-[#1F2937]" />
                <span>Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-[#3A8DFF] hover:underline">
                {t.auth.forgotPassword}
              </Link>
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
                t.auth.loginButton
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center text-sm text-[#9CA3AF]">
            {t.auth.noAccount}{" "}
            <Link href="/signup" className="text-[#3A8DFF] font-semibold hover:underline">
              {t.auth.signUp}
            </Link>
          </div>
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