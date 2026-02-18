"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { clearCurrentUser } from "@/lib/auth";

export function Navigation() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
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
                Trader&apos;s Journal
              </span>
            </Link>

            <ul className="hidden md:flex gap-1 text-sm">
              <li>
                <Link href="/" className="px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/trades" className="px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition">
                  Trades
                </Link>
              </li>
              <li>
                <Link href="/add-trade" className="px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition">
                  Add Trade
                </Link>
              </li>
              <li>
                <Link href="/performance" className="px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition">
                  Performance
                </Link>
              </li>
              <li>
                <Link href="/settings" className="px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition">
                  Settings
                </Link>
              </li>
              {user?.isAdmin && (
                <li>
                  <Link href="/admin" className="px-3 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 rounded-lg transition font-semibold">
                    Admin Panel
                  </Link>
                </li>
              )}
            </ul>

            <div className="flex gap-2 items-center">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition font-medium text-sm"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium text-sm"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition font-medium text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-medium text-sm inline-block"
                  >
                    Get Started
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
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/trades" className="px-2 py-1 text-slate-300 hover:text-white whitespace-nowrap">
              Trades
            </Link>
          </li>
          <li>
            <Link href="/add-trade" className="px-2 py-1 text-slate-300 hover:text-white whitespace-nowrap">
              Add
            </Link>
          </li>
          <li>
            <Link href="/performance" className="px-2 py-1 text-slate-300 hover:text-white whitespace-nowrap">
              Performance
            </Link>
          </li>
          <li>
            <Link href="/settings" className="px-2 py-1 text-slate-300 hover:text-white whitespace-nowrap">
              Settings
            </Link>
          </li>
        </ul>
        <div className="flex gap-2">
          {user ? (
            <>
              <Link href="/profile" className="flex-1 px-2 py-1 text-xs text-center text-slate-300 hover:text-white bg-slate-800 rounded">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex-1 px-2 py-1 text-xs text-center bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="flex-1 px-2 py-1 text-xs text-center text-slate-300 hover:text-white bg-slate-800 rounded">
                Login
              </Link>
              <Link href="/signup" className="flex-1 px-2 py-1 text-xs text-center bg-blue-600 hover:bg-blue-700 text-white rounded">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
