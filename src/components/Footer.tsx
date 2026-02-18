"use client";

import Link from "next/link";

export function Footer() {
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
                Trader&apos;s Journal
              </span>
            </div>
            <p className="text-slate-300 text-sm">
              Track your trades, analyze your performance, and improve your trading strategy.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4 drop-shadow-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-slate-300 hover:text-white transition text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/trades" className="text-slate-300 hover:text-white transition text-sm">
                  Trades
                </Link>
              </li>
              <li>
                <Link href="/add-trade" className="text-slate-300 hover:text-white transition text-sm">
                  Add Trade
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-slate-300 hover:text-white transition text-sm">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-4 drop-shadow-lg">About</h3>
            <p className="text-slate-300 text-sm mb-4">
              Professional trading journal for serious traders. Manage your positions and track your performance.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-700 mt-8 pt-8">
          <p className="text-slate-400 text-sm text-center">
            © {new Date().getFullYear()} Trader&apos;s Journal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
