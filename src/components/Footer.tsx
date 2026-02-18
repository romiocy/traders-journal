"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer
      className="border-t border-slate-800 relative w-full"
      style={{
        backgroundImage: "url('/header2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600/80 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-bold text-sm">TJ</span>
              </div>
              <span className="text-lg font-bold text-white drop-shadow-lg">
                {t("common", "tradersJournal")}
              </span>
            </div>
            <p className="text-slate-300 text-sm">
              {t("footer", "description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4 drop-shadow-lg">{t("footer", "quickLinks")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-slate-300 hover:text-white transition text-sm">
                  {t("nav", "dashboard")}
                </Link>
              </li>
              <li>
                <Link href="/trades" className="text-slate-300 hover:text-white transition text-sm">
                  {t("nav", "trades")}
                </Link>
              </li>
              <li>
                <Link href="/add-trade" className="text-slate-300 hover:text-white transition text-sm">
                  {t("nav", "addTrade")}
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-slate-300 hover:text-white transition text-sm">
                  {t("nav", "settings")}
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-white font-bold mb-4 drop-shadow-lg">{t("footer", "about")}</h3>
            <p className="text-slate-300 text-sm mb-4">
              {t("footer", "aboutText")}
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-700 mt-8 pt-8">
          <p className="text-slate-400 text-sm text-center">
            © {new Date().getFullYear()} {t("common", "tradersJournal")}. {t("footer", "allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}
