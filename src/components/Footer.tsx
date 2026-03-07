"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function Footer() {
  const { t } = useLanguage();
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, margin: "-60px" });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  const linkHover = {
    x: 4,
    color: "#ffffff",
    transition: { duration: 0.2 },
  };

  return (
    <footer
      ref={footerRef}
      className="border-t border-slate-700 relative w-full"
      style={{
        backgroundImage: "url('/header2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 to-black/75 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Brand */}
          <motion.div className="flex flex-col gap-3" variants={itemVariants}>
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-8 h-8 bg-blue-600/80 rounded-lg flex items-center justify-center backdrop-blur-sm"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-white font-bold text-sm">TJ</span>
              </motion.div>
              <span className="text-lg font-bold text-white drop-shadow-lg">
                {t("common", "tradersJournal")}
              </span>
            </div>
            <p className="text-slate-200 text-sm">
              {t("footer", "description")}
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-bold mb-4 drop-shadow-lg">{t("footer", "quickLinks")}</h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: t("nav", "dashboard") },
                { href: "/trades", label: t("nav", "trades") },
                { href: "/add-trade", label: t("nav", "addTrade") },
                { href: "/settings", label: t("nav", "settings") },
              ].map((link) => (
                <motion.li key={link.href}>
                  <motion.div whileHover={linkHover}>
                    <Link href={link.href} className="text-slate-200 hover:text-white transition text-sm inline-block">
                      {link.label}
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* About */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-bold mb-4 drop-shadow-lg">{t("footer", "about")}</h3>
            <p className="text-slate-200 text-sm mb-4">
              {t("footer", "aboutText")}
            </p>
          </motion.div>
        </motion.div>

        {/* Bottom */}
        <motion.div
          className="border-t border-slate-600 mt-8 pt-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <p className="text-slate-300 text-sm text-center">
            © 2026 {t("common", "tradersJournal")}. {t("footer", "allRightsReserved")}
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
