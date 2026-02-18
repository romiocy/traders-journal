"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Trade } from "@/types/trade";
import { getCurrentUser } from "@/lib/auth";

export default function EditTradePage() {
  const router = useRouter();
  const params = useParams();
  const tradeId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [trade, setTrade] = useState<Trade | null>(null);
  const [formData, setFormData] = useState({
    exitPrice: "",
    exitDate: "",
    reasonToSell: "",
    mistakes: "",
    lessonsLearned: "",
    notes: "",
  });

  useEffect(() => {
    fetchTrade();
  }, [tradeId]);

  const fetchTrade = async () => {
    try {
      const user = getCurrentUser();
      const userId = user?.id;

      const headers: any = {};
      if (userId) {
        headers["x-user-id"] = userId;
      }

      const response = await fetch(`/api/trades/${tradeId}`, { headers });
      if (!response.ok) {
        throw new Error("Failed to fetch trade");
      }
      const data = await response.json();
      setTrade(data);
      setFormData({
        exitPrice: data.exitPrice ? data.exitPrice.toString() : "",
        exitDate: data.exitDate ? new Date(data.exitDate).toISOString().slice(0, 10) : "",
        reasonToSell: data.reasonToSell || "",
        mistakes: data.mistakes || "",
        lessonsLearned: data.lessonsLearned || "",
        notes: data.notes || "",
      });
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load trade");
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const user = getCurrentUser();
      const userId = user?.id;

      const updateData: any = {
        ...formData,
        exitPrice: formData.exitPrice ? parseFloat(formData.exitPrice) : undefined,
      };

      // Automatically close trade if exit price is provided
      if (formData.exitPrice && !formData.exitDate) {
        updateData.exitDate = new Date().toISOString();
      }

      if (formData.exitPrice) {
        updateData.status = "CLOSED";
      }

      const headers: any = { "Content-Type": "application/json" };
      if (userId) {
        headers["x-user-id"] = userId;
      }

      const response = await fetch(`/api/trades/${tradeId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Failed to update trade");
      }

      router.push("/trades");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading trade...</div>;
  }

  if (!trade) {
    return <div className="text-center py-12 text-red-600">Trade not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Edit Trade - {trade.symbol}
        </h1>
        <p className="text-slate-400">Review and update your trade details</p>
      </div>

      <div className="card-base p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">Trade Details</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-400">Entry Price</p>
            <p className="font-bold text-white text-lg">${(trade.entryPrice || 0).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-slate-400">Entry Date</p>
            <p className="font-bold text-white text-lg">
              {new Date(trade.tradeDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-slate-400">Type</p>
            <p className={`font-bold text-lg ${trade.type === "BUY" ? "text-green-400" : "text-red-400"}`}>
              {trade.type}
            </p>
          </div>
          <div>
            <p className="text-slate-400">Quantity</p>
            <p className="font-bold text-white text-lg">{trade.quantity}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {trade.status === "OPEN" && (
          <>
            <div className="card-base p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Exit Price
                  </label>
                  <input
                    type="number"
                    name="exitPrice"
                    value={formData.exitPrice}
                    onChange={handleChange}
                    step="0.01"
                    placeholder="Enter exit price to close trade"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Exit Date
                  </label>
                  <input
                    type="date"
                    name="exitDate"
                    value={formData.exitDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {formData.exitPrice && (
                <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
                  <p className="text-sm text-blue-300">
                    <strong>Profit/Loss:</strong> $
                    {(
                      (parseFloat(formData.exitPrice) - (trade.entryPrice || 0)) *
                      trade.quantity
                    ).toFixed(2)}{" "}
                    (
                    {(
                      (((parseFloat(formData.exitPrice) - (trade.entryPrice || 0)) /
                        (trade.entryPrice || 1)) *
                        100)
                    ).toFixed(2)}
                    %)
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {trade.status === "CLOSED" && (
          <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4">
            <p className="text-sm font-semibold text-green-300">
              ✓ This trade is closed
            </p>
            <p className="text-sm text-green-400 mt-1">
              Exit Price: ${(trade.exitPrice || 0).toFixed(2)}
            </p>
            {trade.profit !== undefined && (
              <p className={`text-sm font-semibold mt-1 ${trade.profit >= 0 ? "text-green-400" : "text-red-400"}`}>
                Profit/Loss: ${(trade.profit || 0).toFixed(2)}
              </p>
            )}
          </div>
        )}

        <div className="card-base p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Reason to Sell
            </label>
            <textarea
              name="reasonToSell"
              value={formData.reasonToSell}
              onChange={handleChange}
              placeholder="Why did you exit this trade..."
              rows={3}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Mistakes
            </label>
            <textarea
              name="mistakes"
              value={formData.mistakes}
              onChange={handleChange}
              placeholder="What could you have done better..."
              rows={3}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Lessons Learned
            </label>
            <textarea
              name="lessonsLearned"
              value={formData.lessonsLearned}
              onChange={handleChange}
              placeholder="Key takeaways from this trade..."
              rows={3}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any other observations..."
              rows={3}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
