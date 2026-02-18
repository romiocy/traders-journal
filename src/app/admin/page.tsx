"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getCurrentUser } from "@/lib/auth";

interface Portfolio {
  totalTrades: number;
  openTrades: number;
  closedTrades: number;
  winningTrades: number;
  losingTrades: number;
  totalProfit: number;
  winRate: number;
  bestTrade: number;
  worstTrade: number;
  openPositionValue: number;
}

interface RecentTrade {
  id: string;
  symbol: string;
  type: string;
  entryPrice: number;
  exitPrice: number | null;
  profit: number | null;
  profitPercentage: number | null;
  status: string;
  tradeDate: string;
}

interface User {
  id: string;
  login: string;
  name: string;
  surname: string;
  email: string;
  phone: string | null;
  isAdmin: boolean;
  createdAt: string;
  tradeCount: number;
  profileImage: string | null;
  portfolio: Portfolio;
  recentTrades: RecentTrade[];
}

export default function AdminPanel() {
  const router = useRouter();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminAndFetchUsers = async () => {
      const currentUser = getCurrentUser();

      if (!currentUser) {
        router.push("/login");
        return;
      }

      if (!currentUser.isAdmin) {
        router.push("/");
        return;
      }

      try {
        const response = await fetch("/api/admin/users", {
          method: "GET",
          headers: {
            "x-admin-id": currentUser.id,
            "x-admin-login": currentUser.login,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          setError("Failed to fetch users");
        }
      } catch (err) {
        setError("Error fetching users");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndFetchUsers();
  }, [router]);

  const toggleExpand = (userId: string) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  // Aggregate portfolio stats
  const totalMembers = users.length;
  const totalAdmins = users.filter((u) => u.isAdmin).length;
  const totalAllTrades = users.reduce((sum, u) => sum + u.tradeCount, 0);
  const totalAllProfit = users.reduce((sum, u) => sum + (u.portfolio?.totalProfit || 0), 0);
  const usersWithClosed = users.filter((u) => u.portfolio?.closedTrades > 0);
  const avgWinRate = usersWithClosed.length > 0
    ? usersWithClosed.reduce((sum, u) => sum + (u.portfolio?.winRate || 0), 0) / usersWithClosed.length
    : 0;
  const newThisMonth = users.filter((u) => {
    const d = new Date(u.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
        <p className="text-slate-400">Overview of all registered members and their investment portfolios</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <OverviewCard label="Total Members" value={totalMembers} icon="👥" />
        <OverviewCard label="Admins" value={totalAdmins} icon="🛡️" color="text-blue-400" />
        <OverviewCard label="Total Trades" value={totalAllTrades} icon="📊" color="text-cyan-400" />
        <OverviewCard
          label="Platform P&L"
          value={`$${totalAllProfit.toFixed(2)}`}
          icon="💰"
          color={totalAllProfit >= 0 ? "text-green-400" : "text-red-400"}
        />
        <OverviewCard
          label="Avg Win Rate"
          value={`${isNaN(avgWinRate) ? 0 : avgWinRate.toFixed(1)}%`}
          icon="🎯"
          color="text-yellow-400"
        />
        <OverviewCard label="New This Month" value={newThisMonth} icon="🆕" color="text-green-400" />
      </div>

      {/* Members List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">All Members</h2>
        
        {users.length === 0 ? (
          <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-12 text-center">
            <p className="text-slate-400">No members found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((member) => (
              <div
                key={member.id}
                className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden transition hover:border-slate-600"
              >
                {/* Member Row */}
                <button
                  onClick={() => toggleExpand(member.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-blue-600/80 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                      {(member.name[0] + member.surname[0]).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold truncate">
                          {member.name} {member.surname}
                        </span>
                        {member.isAdmin && (
                          <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded text-xs font-semibold border border-blue-600/40 flex-shrink-0">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm truncate">{member.email}</p>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-6 mr-4">
                    <div className="text-center">
                      <p className="text-xs text-slate-500">Trades</p>
                      <p className="text-sm font-bold text-cyan-400">{member.tradeCount}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-500">Win Rate</p>
                      <p className="text-sm font-bold text-yellow-400">{member.portfolio.winRate}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-500">Total P&L</p>
                      <p className={`text-sm font-bold ${member.portfolio.totalProfit >= 0 ? "text-green-400" : "text-red-400"}`}>
                        ${member.portfolio.totalProfit.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-500">Joined</p>
                      <p className="text-sm text-slate-300">{new Date(member.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <span className={`text-slate-400 transition-transform ${expandedUser === member.id ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>

                {/* Expanded Portfolio Details */}
                {expandedUser === member.id && (
                  <div className="border-t border-slate-700 px-6 py-5 bg-slate-900/50">
                    {/* Member Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Username</p>
                        <p className="text-sm text-slate-300">{member.login}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Email</p>
                        <p className="text-sm text-slate-300">{member.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Phone</p>
                        <p className="text-sm text-slate-300">{member.phone || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Member Since</p>
                        <p className="text-sm text-slate-300">{new Date(member.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Portfolio Stats */}
                    <h3 className="text-sm font-semibold text-white mb-3">📊 Investment Portfolio</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                      <MiniStat label="Total Trades" value={member.portfolio.totalTrades} />
                      <MiniStat label="Open" value={member.portfolio.openTrades} color="text-blue-400" />
                      <MiniStat label="Closed" value={member.portfolio.closedTrades} color="text-slate-300" />
                      <MiniStat label="Wins" value={member.portfolio.winningTrades} color="text-green-400" />
                      <MiniStat label="Losses" value={member.portfolio.losingTrades} color="text-red-400" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                      <MiniStat
                        label="Total P&L"
                        value={`$${member.portfolio.totalProfit.toFixed(2)}`}
                        color={member.portfolio.totalProfit >= 0 ? "text-green-400" : "text-red-400"}
                      />
                      <MiniStat
                        label="Win Rate"
                        value={`${member.portfolio.winRate}%`}
                        color={member.portfolio.winRate >= 50 ? "text-green-400" : "text-yellow-400"}
                      />
                      <MiniStat
                        label="Best Trade"
                        value={`$${member.portfolio.bestTrade.toFixed(2)}`}
                        color="text-green-400"
                      />
                      <MiniStat
                        label="Worst Trade"
                        value={`$${member.portfolio.worstTrade.toFixed(2)}`}
                        color="text-red-400"
                      />
                    </div>

                    {member.portfolio.openPositionValue > 0 && (
                      <div className="bg-blue-900/20 border border-blue-800/40 rounded-lg p-3 mb-6">
                        <p className="text-xs text-blue-400 mb-1">Open Position Value</p>
                        <p className="text-lg font-bold text-blue-300">${member.portfolio.openPositionValue.toFixed(2)}</p>
                      </div>
                    )}

                    {/* Recent Trades */}
                    {member.recentTrades.length > 0 ? (
                      <>
                        <h3 className="text-sm font-semibold text-white mb-3">📝 Recent Trades (Last 5)</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-slate-700">
                                <th className="text-left text-xs text-slate-500 pb-2 pr-4">Symbol</th>
                                <th className="text-left text-xs text-slate-500 pb-2 pr-4">Type</th>
                                <th className="text-left text-xs text-slate-500 pb-2 pr-4">Entry</th>
                                <th className="text-left text-xs text-slate-500 pb-2 pr-4">Exit</th>
                                <th className="text-left text-xs text-slate-500 pb-2 pr-4">P&L</th>
                                <th className="text-left text-xs text-slate-500 pb-2 pr-4">Status</th>
                                <th className="text-left text-xs text-slate-500 pb-2">Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {member.recentTrades.map((trade) => (
                                <tr key={trade.id} className="border-b border-slate-800">
                                  <td className="py-2 pr-4 text-white font-medium">{trade.symbol}</td>
                                  <td className="py-2 pr-4">
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                      trade.type === "BUY" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                                    }`}>
                                      {trade.type}
                                    </span>
                                  </td>
                                  <td className="py-2 pr-4 text-slate-300">${trade.entryPrice.toFixed(2)}</td>
                                  <td className="py-2 pr-4 text-slate-300">
                                    {trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : "—"}
                                  </td>
                                  <td className={`py-2 pr-4 font-medium ${
                                    (trade.profit || 0) >= 0 ? "text-green-400" : "text-red-400"
                                  }`}>
                                    {trade.profit != null ? `$${trade.profit.toFixed(2)}` : "—"}
                                  </td>
                                  <td className="py-2 pr-4">
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                      trade.status === "OPEN" ? "bg-blue-500/20 text-blue-400" : "bg-slate-500/20 text-slate-400"
                                    }`}>
                                      {trade.status}
                                    </span>
                                  </td>
                                  <td className="py-2 text-slate-400">{new Date(trade.tradeDate).toLocaleDateString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : (
                      <p className="text-slate-500 text-sm italic">No trades recorded yet</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OverviewCard({
  label,
  value,
  icon,
  color = "text-white",
}: {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
}) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function MiniStat({
  label,
  value,
  color = "text-white",
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/50">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
  );
}
