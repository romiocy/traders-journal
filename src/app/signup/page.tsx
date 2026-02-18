"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setCurrentUser, getCurrentUser } from "@/lib/auth";
import { useLanguage } from "@/context/LanguageContext";
import { PageTransition } from "@/components/PageTransition";

export default function SignupPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    login: "",
    name: "",
    surname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const user = getCurrentUser();
    if (user) {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <div className="text-center py-12 text-slate-400">{t("login", "checkingAuth")}</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login: formData.login,
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Signup failed");
      }

      const user = await response.json();
      
      // Save user to localStorage
      setCurrentUser(user);

      // Dispatch custom event to notify auth context
      window.dispatchEvent(new Event("authchange"));

      // Redirect to dashboard
      router.push("/");
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
            {t("signup", "joinTitle")}
          </h1>
          <p className="text-slate-400">{t("signup", "createAccount")}</p>
        </div>

        <form onSubmit={handleSubmit} className="card-base p-5 sm:p-6 space-y-4">
          {error && (
            <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              {t("signup", "loginLabel")} *
            </label>
            <input
              type="text"
              name="login"
              value={formData.login}
              onChange={handleChange}
              placeholder={t("signup", "chooseLogin")}
              required
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                {t("signup", "name")} *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John"
                required
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                {t("signup", "surname")} *
              </label>
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                placeholder="Doe"
                required
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              {t("signup", "email")} *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              {t("signup", "phone")}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              {t("signup", "password")} *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t("signup", "enterPassword")}
              required
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              {t("signup", "confirmPassword")} *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder={t("signup", "confirmYourPassword")}
              required
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t("signup", "creatingAccount") : t("signup", "signUp")}
          </button>

          <p className="text-center text-slate-400 text-sm">
            {t("signup", "alreadyHaveAccount")}{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300">
              {t("signup", "loginHere")}
            </Link>
          </p>
        </form>
      </div>
    </div>
    </PageTransition>
  );
}
