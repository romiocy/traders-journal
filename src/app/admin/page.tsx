"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getCurrentUser } from "@/lib/auth";

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
}

export default function AdminPanel() {
  const router = useRouter();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminAndFetchUsers = async () => {
      // Get current user
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-300">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
        <p className="text-slate-300">Manage and view all members</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
          <p className="text-slate-400 text-sm mb-2">Total Members</p>
          <p className="text-3xl font-bold text-white">{users.length}</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
          <p className="text-slate-400 text-sm mb-2">Admins</p>
          <p className="text-3xl font-bold text-blue-400">{users.filter((u) => u.isAdmin).length}</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
          <p className="text-slate-400 text-sm mb-2">Total Trades</p>
          <p className="text-3xl font-bold text-cyan-400">
            {users.reduce((sum, u) => sum + u.tradeCount, 0)}
          </p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
          <p className="text-slate-400 text-sm mb-2">New This Month</p>
          <p className="text-3xl font-bold text-green-400">
            {users.filter((u) => {
              const createdDate = new Date(u.createdAt);
              const today = new Date();
              return (
                createdDate.getMonth() === today.getMonth() &&
                createdDate.getFullYear() === today.getFullYear()
              );
            }).length}
          </p>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-900/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Login</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Trades</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                    No members found
                  </td>
                </tr>
              ) : (
                users.map((member) => (
                  <tr key={member.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600/80 flex items-center justify-center text-xs font-bold text-white">
                          {(member.name[0] + member.surname[0]).toUpperCase()}
                        </div>
                        <div className="text-sm font-medium text-white">
                          {member.name} {member.surname}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">{member.login}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{member.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{member.phone || "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-slate-300 font-semibold text-cyan-400">
                      {member.tradeCount}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {member.isAdmin ? (
                        <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs font-semibold border border-blue-600/40">
                          Admin
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-slate-600/20 text-slate-400 rounded text-xs font-semibold border border-slate-600/40">
                          Member
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
