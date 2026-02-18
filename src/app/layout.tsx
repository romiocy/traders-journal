import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ErrorSuppressor } from "@/components/ErrorSuppressor";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trader's Journal - Your Trading Performance Analysis Platform",
  description: "Track your trades, analyze performance, and build winning strategies with advanced analytics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full flex flex-col`}>
        <ErrorSuppressor />
        <AuthProvider>
          <LanguageProvider>
            <div className="app-bg min-h-screen flex flex-col">
              <div className="relative z-10">
                <Navigation />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">{children}</main>
              </div>
              <Footer />
            </div>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
