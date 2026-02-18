"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function SettingsPage() {
  const { t } = useLanguage();
  const [exchanges, setExchanges] = useState<{ name: string; connected: boolean }[]>([]);
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [selectedExchange, setSelectedExchange] = useState("BINANCE");

  const handleConnectExchange = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API integration
    console.log("Connecting to", selectedExchange);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">{t("settings", "title")}</h1>
        <p className="text-slate-400">{t("settings", "subtitle")}</p>
      </div>

      <div className="card-base p-6">
        <h2 className="text-xl font-bold text-white mb-2">
          {t("settings", "exchangeIntegrations")}
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          {t("settings", "exchangeDesc")}
        </p>

        <form onSubmit={handleConnectExchange} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              {t("settings", "exchange")}
            </label>
            <select
              value={selectedExchange}
              onChange={(e) => setSelectedExchange(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="BINANCE">Binance</option>
              <option value="COINBASE">Coinbase</option>
              <option value="KRAKEN">Kraken</option>
              <option value="BYBIT">Bybit</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              {t("settings", "apiKey")}
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={t("settings", "enterApiKey")}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              {t("settings", "apiSecret")}
            </label>
            <input
              type="password"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              placeholder={t("settings", "enterApiSecret")}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
          >
            {t("settings", "connectExchange")}
          </button>
        </form>

        <div className="mt-8">
          <h3 className="font-medium text-white mb-4">{t("settings", "connectedExchanges")}</h3>
          <div className="space-y-2">
            {exchanges.length === 0 ? (
              <p className="text-slate-400 text-sm">
                {t("settings", "noExchanges")}
              </p>
            ) : (
              exchanges.map((exchange) => (
                <div
                  key={exchange.name}
                  className="flex items-center justify-between p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg"
                >
                  <span className="font-medium text-white">
                    {exchange.name}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      exchange.connected ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {exchange.connected ? `✓ ${t("settings", "connected")}` : `✗ ${t("settings", "disconnected")}`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="card-base p-6">
        <h2 className="text-xl font-bold text-white mb-6">
          {t("settings", "preferences")}
        </h2>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 accent-blue-500"
            />
            <span className="text-sm text-slate-300">
              {t("settings", "emailNotifications")}
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 accent-blue-500"
              defaultChecked
            />
            <span className="text-sm text-slate-300">
              {t("settings", "autoCalculate")}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
