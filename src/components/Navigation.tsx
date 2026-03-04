"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { clearCurrentUser } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import { CryptoTicker } from "./CryptoTicker";
import {
  LayoutDashboard, List, PlusCircle, TrendingUp, Calculator,
  Settings, ShieldCheck, User, LogOut
} from "lucide-react";

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    router.push("/login");
  };

  const toggleLang = () => {
    setLang(lang === "en" ? "ru" : "en");
  };

  const closeMobile = () => setMobileMenuOpen(false);

  const isActive = (path: string) => pathname === path;

  const navLinkClass = (path: string) =>
    `px-3 py-2 rounded-lg transition text-sm font-medium ${
      isActive(path)
        ? "text-white bg-blue-600/30 border border-blue-500/30"
        : "text-slate-300 hover:text-white hover:bg-slate-800/60"
    }`;

  const mobileNavLinkClass = (path: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium ${
      isActive(path)
        ? "text-white bg-blue-600/20 border border-blue-500/30"
        : "text-slate-300 hover:text-white hover:bg-slate-800/60"
    }`;

  return (
    <>
      <div className="sticky top-0 z-50">
      <nav className="border-b border-slate-700/50" style={{backgroundImage: "url('/header2.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 to-black/75"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Image src="/tj-logo.png" alt="Trader's Journal" width={36} height={36} className="rounded-lg" />
              <span className="text-base sm:text-xl font-bold text-white whitespace-nowrap drop-shadow-lg">
                {t("common", "tradersJournal")}
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <ul className="hidden md:flex gap-1 text-sm">
              <li><Link href="/" className={navLinkClass("/")}>{t("nav", "dashboard")}</Link></li>
              <li><Link href="/trades" className={navLinkClass("/trades")}>{t("nav", "trades")}</Link></li>
              {user && <li><Link href="/add-trade" className={navLinkClass("/add-trade")}>{t("nav", "addTrade")}</Link></li>}
              <li><Link href="/performance" className={navLinkClass("/performance")}>{t("nav", "performance")}</Link></li>
              <li><Link href="/calculator" className={navLinkClass("/calculator")}>{t("nav", "calculator")}</Link></li>
              {user && <li><Link href="/settings" className={navLinkClass("/settings")}>{t("nav", "settings")}</Link></li>}
              {user?.isAdmin && (
                <li>
                  <Link href="/admin" className={`px-3 py-2 rounded-lg transition text-sm font-semibold ${isActive("/admin") ? "text-blue-300 bg-blue-900/40 border border-blue-500/30" : "text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"}`}>
                    {t("nav", "adminPanel")}
                  </Link>
                </li>
              )}
            </ul>

            {/* Desktop Right Side */}
            <div className="hidden md:flex gap-2 items-center">
              <button
                onClick={toggleLang}
                className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 transition bg-slate-800/50 backdrop-blur-sm"
                title={lang === "en" ? "Switch to Russian" : "Переключить на English"}
              >
                {lang === "en" ? "🇷🇺 RU" : "🇬🇧 EN"}
              </button>
              {user ? (
                <>
                  <Link href="/profile" className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition font-medium text-sm">
                    {t("nav", "profile")}
                  </Link>
                  <button onClick={handleLogout} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium text-sm">
                    {t("nav", "signOut")}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition font-medium text-sm">
                    {t("nav", "login")}
                  </Link>
                  <Link href="/signup" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-medium text-sm inline-block">
                    {t("nav", "getStarted")}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Right Side: Lang + Hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={toggleLang}
                className="px-2 py-1.5 text-xs font-bold rounded-lg border border-slate-600 text-slate-300 hover:text-white transition bg-slate-800/50"
              >
                {lang === "en" ? "🇷🇺" : "🇬🇧"}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-300 hover:text-white transition rounded-lg hover:bg-slate-800/50"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Crypto Ticker - outside nav to avoid overlay coverage */}
      <CryptoTicker />
      </div>

      {/* Mobile Slide-out Menu — rendered via portal to escape all stacking contexts */}
      {portalRoot && createPortal(
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden"
                style={{ zIndex: 9998 }}
                onClick={closeMobile}
              />
              {/* Panel */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed top-0 right-0 bottom-0 w-72 bg-slate-900/95 backdrop-blur-xl border-l border-slate-700 md:hidden overflow-y-auto"
                style={{ zIndex: 9999 }}
              >
              <div className="p-5 flex flex-col h-full">
                {/* Close button */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Image src="/tj-logo.png" alt="Trader's Journal" width={28} height={28} className="rounded-lg" />
                    <span className="text-sm font-bold text-white">{t("common", "tradersJournal")}</span>
                  </div>
                  <button
                    onClick={closeMobile}
                    className="p-1.5 text-slate-400 hover:text-white transition rounded-lg hover:bg-slate-800"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 space-y-1">
                  <Link href="/" onClick={closeMobile} className={mobileNavLinkClass("/")}>
                    <LayoutDashboard className="w-5 h-5" /> {t("nav", "dashboard")}
                  </Link>
                  <Link href="/trades" onClick={closeMobile} className={mobileNavLinkClass("/trades")}>
                    <List className="w-5 h-5" /> {t("nav", "trades")}
                  </Link>
                  {user && (
                    <Link href="/add-trade" onClick={closeMobile} className={mobileNavLinkClass("/add-trade")}>
                      <PlusCircle className="w-5 h-5" /> {t("nav", "addTrade")}
                    </Link>
                  )}
                  <Link href="/performance" onClick={closeMobile} className={mobileNavLinkClass("/performance")}>
                    <TrendingUp className="w-5 h-5" /> {t("nav", "performance")}
                  </Link>
                  <Link href="/calculator" onClick={closeMobile} className={mobileNavLinkClass("/calculator")}>
                    <Calculator className="w-5 h-5" /> {t("nav", "calculator")}
                  </Link>
                  {user && (
                    <Link href="/settings" onClick={closeMobile} className={mobileNavLinkClass("/settings")}>
                      <Settings className="w-5 h-5" /> {t("nav", "settings")}
                    </Link>
                  )}
                  {user?.isAdmin && (
                    <>
                      <div className="border-t border-slate-700 my-3" />
                      <Link href="/admin" onClick={closeMobile} className={mobileNavLinkClass("/admin")}>
                        <ShieldCheck className="w-5 h-5" /> {t("nav", "adminPanel")}
                      </Link>
                    </>
                  )}
                </nav>

                {/* Bottom Actions */}
                <div className="border-t border-slate-700 pt-4 mt-4 space-y-2">
                  {user ? (
                    <>
                      <Link
                        href="/profile"
                        onClick={closeMobile}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition text-sm font-medium"
                      >
                        <span className="text-lg"><User className="w-5 h-5" /></span> {t("nav", "profile")}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600/30 hover:text-red-300 transition text-sm font-medium"
                      >
                        <span className="text-lg"><LogOut className="w-5 h-5" /></span> {t("nav", "signOut")}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={closeMobile}
                        className="block px-4 py-3 text-center rounded-xl bg-slate-800 text-slate-300 hover:text-white transition text-sm font-medium"
                      >
                        {t("nav", "login")}
                      </Link>
                      <Link
                        href="/signup"
                        onClick={closeMobile}
                        className="block px-4 py-3 text-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition text-sm font-medium"
                      >
                        {t("nav", "getStarted")}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      portalRoot
      )}
    </>
  );
}
