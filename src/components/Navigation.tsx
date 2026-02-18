"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { clearCurrentUser } from "@/lib/auth";

export function Navigation() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const toggleLang = () => {
    setLang(lang === "en" ? "ru" : "en");
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="border-b border-slate-800 sticky top-0 z-50" style={{backgroundImage: "url('/header2.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600/80 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-bold text-sm">TJ</span>
              </div>
              <span className="text-xl font-bold text-white hidden sm:inline drop-shadow-lg">
                {t("common", "tradersJournal")}
              </span>
            </Link>

            <ul className="hidden md:flex gap-1 text-sm">
              <li>
                <Link href="/" className="px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition">
                  {t("nav", "dashboard")}
                </Link>
              </li>
              <li>
                <Link href="/trades" className="px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition">
                  {t("nav", "trades")}
                </Link>
              </li>
              {user && (
                <li>
                  <Link href="/add-trade" className="px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition">
                    {t("nav", "addTrade")}
                  </Link>
                </li>
              )}
              <li>
                <Link href="/performance" className="px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition">
                  {t("nav", "performance")}
                </Link>
              </li>
              {user && (
                <li>
                  <Link href="/settings" className="px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition">
                    {t("nav", "settings")}
                  </Link>
                </li>
              )}
              {user?.isAdmin && (
                <li>
                  <Link href="/admin" className="px-3 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 rounded-lg transition font-semibold">
                    {t("nav", "adminPanel")}
                  </Link>
                </li>
              )}
            </ul>

            <div className="flex gap-2 items-center">
              {/* Language Switcher */}
              <button
                onClick={toggleLang}
                className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 transition bg-slate-800/50 backdrop-blur-sm"
                title={lang === "en" ? "Switch to Russian" : "Переключить на English"}
              >
                {lang === "en" ? "🇷🇺 RU" : "🇬🇧 EN"}
              </button>

              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition font-medium text-sm"
                  >
                    {t("nav", "profile")}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium text-sm"
                  >
                    {t("nav", "signOut")}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition font-medium text-sm"
                  >
                    {t("nav", "login")}
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-medium text-sm inline-block"
                  >
                    {t("nav", "getStarted")}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden border-b border-slate-800 bg-slate-900/50 px-4 py-3">
        <ul className="flex gap-2 text-xs overflow-x-auto mb-3">
          <li>
            <Link href="/" className="px-2 py-1 text-slate-300 hover:text-white whitespace-nowrap">
              {t("nav", "dashboard")}
            </Link>
          </li>
          <li>
            <Link href="/trades" className="px-2 py-1 text-slate-300 hover:text-white whitespace-nowrap">
              {t("nav", "trades")}
            </Link>
          </li>
          {user && (
            <li>
              <Link href="/add-trade" className="px-2 py-1 text-slate-300 hover:text-white whitespace-nowrap">
                {t("nav", "add")}
              </Link>
            </li>
          )}
          <li>
            <Link href="/performance" className="px-2 py-1 text-slate-300 hover:text-white whitespace-nowrap">
              {t("nav", "performance")}
            </Link>
          </li>
          {user && (
            <li>
              <Link href="/settings" className="px-2 py-1 text-slate-300 hover:text-white whitespace-nowrap">
                {t("nav", "settings")}
              </Link>
            </li>
          )}
        </ul>
        <div className="flex gap-2">
          <button
            onClick={toggleLang}
            className="px-2 py-1 text-xs text-center text-slate-300 hover:text-white bg-slate-800 rounded font-bold"
          >
            {lang === "en" ? "🇷🇺 RU" : "🇬🇧 EN"}
          </button>
          {user ? (
            <>
              <Link href="/profile" className="flex-1 px-2 py-1 text-xs text-center text-slate-300 hover:text-white bg-slate-800 rounded">
                {t("nav", "profile")}
              </Link>
              <button
                onClick={handleLogout}
                className="flex-1 px-2 py-1 text-xs text-center bg-red-600 hover:bg-red-700 text-white rounded"
              >
                {t("nav", "signOut")}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="flex-1 px-2 py-1 text-xs text-center text-slate-300 hover:text-white bg-slate-800 rounded">
                {t("nav", "login")}
              </Link>
              <Link href="/signup" className="flex-1 px-2 py-1 text-xs text-center bg-blue-600 hover:bg-blue-700 text-white rounded">
                {t("nav", "signUp")}
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
