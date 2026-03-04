"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { PageTransition, FadeIn } from "@/components/PageTransition";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text gradient-text mb-2">
              {t("forgotPassword", "title")}
            </h1>
            <p className="text-slate-300">{t("forgotPassword", "subtitle")}</p>
          </div>

          {sent ? (
            <FadeIn>
              <div className="card-base p-6 sm:p-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-green-900/30 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">
                  {t("forgotPassword", "emailSent")}
                </h2>
                <p className="text-slate-300 text-sm">
                  {t("forgotPassword", "checkInbox")}
                </p>
                <p className="text-slate-400 text-xs">
                  {t("forgotPassword", "checkSpam")}
                </p>
                <Link
                  href="/login"
                  className="inline-block mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4 inline" /> {t("forgotPassword", "backToLogin")}
                </Link>
              </div>
            </FadeIn>
          ) : (
            <form onSubmit={handleSubmit} className="card-base p-5 sm:p-6 space-y-4">
              {error && (
                <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}

              <p className="text-slate-300 text-sm">
                {t("forgotPassword", "instructions")}
              </p>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  {t("forgotPassword", "emailLabel")} *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("forgotPassword", "emailPlaceholder")}
                  required
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t("forgotPassword", "sending") : t("forgotPassword", "sendLink")}
              </button>

              <p className="text-center text-slate-300 text-sm">
                {t("forgotPassword", "rememberPassword")}{" "}
                <Link href="/login" className="text-blue-400 hover:text-blue-300">
                  {t("forgotPassword", "backToLogin")}
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
