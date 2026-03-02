"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setCurrentUser, getCurrentUser } from "@/lib/auth";
import { useLanguage } from "@/context/LanguageContext";
import { PageTransition, FloatingParticles, TextReveal } from "@/components/PageTransition";
import { motion } from "framer-motion";

const formItemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: 0.1 + i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    login: "",
    password: "",
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
    return <div className="text-center py-12 text-slate-300">{t("login", "checkingAuth")}</div>;
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

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login: formData.login,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Login failed");
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
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8 sm:py-12 relative">
      <FloatingParticles count={12} />
      <motion.div
        className="w-full max-w-md relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text gradient-text mb-2">
            <TextReveal text={t("login", "welcomeBack")} />
          </h1>
          <motion.p
            className="text-slate-300"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {t("login", "loginToAccount")}
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} className="card-base p-5 sm:p-6 space-y-4">
          {error && (
            <motion.div
              className="p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}

          <motion.div custom={0} variants={formItemVariants} initial="hidden" animate="visible">
            <label className="block text-sm font-semibold text-white mb-2">
              {t("login", "loginLabel")} *
            </label>
            <input
              type="text"
              name="login"
              value={formData.login}
              onChange={handleChange}
              placeholder={t("login", "enterLogin")}
              required
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </motion.div>

          <motion.div custom={1} variants={formItemVariants} initial="hidden" animate="visible">
            <label className="block text-sm font-semibold text-white mb-2">
              {t("login", "password")} *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t("login", "enterPassword")}
              required
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </motion.div>

          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition">
              {t("login", "forgotPassword")}
            </Link>
          </div>

          <motion.div custom={3} variants={formItemVariants} initial="hidden" animate="visible">
            <motion.button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02, boxShadow: "0 10px 40px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? t("login", "loggingIn") : t("login", "loginBtn")}
            </motion.button>
          </motion.div>

          <motion.p
            className="text-center text-slate-300 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {t("login", "noAccount")}{" "}
            <Link href="/signup" className="text-blue-400 hover:text-blue-300">
              {t("login", "signUpHere")}
            </Link>
          </motion.p>
        </form>
      </motion.div>
    </div>
    </PageTransition>
  );
}
