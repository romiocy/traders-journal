"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { useLanguage } from "@/context/LanguageContext";
import { PageTransition } from "@/components/PageTransition";

export default function AddTradePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    symbol: "",
    type: "BUY" as const,
    quantity: "",
    quantityCurrency: "USDT",
    entryPrice: "",
    tradeDate: new Date().toISOString().slice(0, 10),
    setupDescription: "",
    reasonToBuy: "",
  });

  // Extract base currency from symbol (e.g., "BTC" from "BTC/USDT")
  const getBaseCurrency = () => {
    const symbol = formData.symbol.trim().toUpperCase();
    if (symbol.includes("/")) {
      return symbol.split("/")[0];
    }
    // Try common quote currencies
    for (const quote of ["USDT", "USDC", "USD", "EUR", "BTC", "ETH", "BNB"]) {
      if (symbol.endsWith(quote) && symbol.length > quote.length) {
        return symbol.slice(0, -quote.length);
      }
    }
    return symbol || null;
  };

  const baseCurrency = getBaseCurrency();

  const currencyOptions = [
    ...(baseCurrency ? [baseCurrency] : []),
    "USDT",
    "USDC",
    "USD",
  ].filter((v, i, a) => a.indexOf(v) === i); // deduplicate

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
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
      const user = getCurrentUser();
      const userId = user?.id;

      const headers: any = { "Content-Type": "application/json" };
      if (userId) {
        headers["x-user-id"] = userId;
      }

      const response = await fetch("/api/trades", {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...formData,
          quantity: parseFloat(formData.quantity),
          entryPrice: parseFloat(formData.entryPrice),
          quantityCurrency: formData.quantityCurrency,
          tradeDate: new Date(formData.tradeDate),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create trade");
      }

      router.push("/trades");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
    <div className="max-w-2xl mx-auto px-1 sm:px-0">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">{t("addTrade", "title")}</h1>
        <p className="text-slate-300 text-sm sm:text-base">{t("addTrade", "subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300">
            {error}
          </div>
        )}

        <div className="card-base p-4 sm:p-6 space-y-5 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                {t("addTrade", "symbol")} *
              </label>
              <input
                type="text"
                name="symbol"
                value={formData.symbol}
                onChange={handleChange}
                placeholder={t("addTrade", "symbolPlaceholder")}
                required
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                {t("addTrade", "type")} *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="BUY">{t("addTrade", "buy")}</option>
                <option value="SELL">{t("addTrade", "sell")}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                {t("addTrade", "quantity")} *
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  step="0.01"
                  required
                  className="flex-1 min-w-0 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <select
                  name="quantityCurrency"
                  value={formData.quantityCurrency}
                  onChange={handleChange}
                  className="w-24 px-2 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  {currencyOptions.map((cur) => (
                    <option key={cur} value={cur}>{cur}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                {t("addTrade", "entryPrice")} *
              </label>
              <input
                type="number"
                name="entryPrice"
                value={formData.entryPrice}
                onChange={handleChange}
                step="0.01"
                required
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-white mb-2">
                {t("addTrade", "tradeDate")} *
              </label>
              <input
                type="date"
                name="tradeDate"
                value={formData.tradeDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              {t("addTrade", "setupDescription")}
            </label>
            <textarea
              name="setupDescription"
              value={formData.setupDescription}
              onChange={handleChange}
              placeholder={t("addTrade", "setupPlaceholder")}
              rows={3}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              {t("addTrade", "reasonToBuy")}
            </label>
            <textarea
              name="reasonToBuy"
              value={formData.reasonToBuy}
              onChange={handleChange}
              placeholder={t("addTrade", "reasonPlaceholder")}
              rows={3}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t("addTrade", "saving") : t("addTrade", "saveTrade")}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
          >
            {t("addTrade", "cancel")}
          </button>
        </div>
      </form>
    </div>
    </PageTransition>
  );
}
