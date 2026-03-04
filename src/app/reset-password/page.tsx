"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { PageTransition, FadeIn } from "@/components/PageTransition";
import { ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-slate-300">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError(t("resetPassword", "invalidLink"));
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError(t("resetPassword", "minLength"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("resetPassword", "mismatch"));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setSuccess(true);
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
              {t("resetPassword", "title")}
            </h1>
            <p className="text-slate-300">{t("resetPassword", "subtitle")}</p>
          </div>

          {success ? (
            <FadeIn>
              <div className="card-base p-6 sm:p-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-green-900/30 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">
                  {t("resetPassword", "success")}
                </h2>
                <p className="text-slate-300 text-sm">
                  {t("resetPassword", "successMsg")}
                </p>
                <Link
                  href="/login"
                  className="btn-primary inline-block mt-4"
                >
                  {t("resetPassword", "goToLogin")}
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

              {!token ? (
                <div className="text-center py-4">
                  <p className="text-slate-300 mb-4">{t("resetPassword", "invalidLink")}</p>
                  <Link href="/forgot-password" className="text-blue-400 hover:text-blue-300 text-sm">
                    {t("resetPassword", "requestNew")}
                  </Link>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      {t("resetPassword", "newPassword")} *
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t("resetPassword", "newPasswordPlaceholder")}
                      required
                      minLength={6}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      {t("resetPassword", "confirmPassword")} *
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t("resetPassword", "confirmPlaceholder")}
                      required
                      minLength={6}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? t("resetPassword", "resetting") : t("resetPassword", "resetBtn")}
                  </button>
                </>
              )}

              <p className="text-center text-slate-300 text-sm">
                <Link href="/login" className="text-blue-400 hover:text-blue-300">
                  <ArrowLeft className="w-4 h-4 inline" /> {t("forgotPassword", "backToLogin")}
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
