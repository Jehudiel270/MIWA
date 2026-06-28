"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Ban, CheckCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  is_banned: boolean;
  wallet_balance: number;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "banned" | "active">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/data?type=users&limit=100`);
      const data = await res.json();

      if (data.success) {
        let filtered = data.data;
        if (filter === "banned") {
          filtered = filtered.filter((u: User) => u.is_banned);
        } else if (filter === "active") {
          filtered = filtered.filter((u: User) => !u.is_banned);
        }
        setUsers(filtered);
      }
    } catch (error) {
      console.error("Error fetching users", error);
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async (userId: string) => {
    const reason = prompt("Raison du bannissement:");
    if (!reason) return;

    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "ban", reason }),
    });

    const data = await res.json();
    if (data.success) {
      toast.success("Utilisateur banni");
      fetchUsers();
    } else {
      toast.error(data.error);
    }
  };

  const handleUnban = async (userId: string) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "unban" }),
    });

    const data = await res.json();
    if (data.success) {
      toast.success("Utilisateur débanni");
      fetchUsers();
    } else {
      toast.error(data.error);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#f5f1ed]">
      {/* Header */}
      <div className="bg-white border-b border-[#e8e1db] px-5 py-4 flex items-center gap-4">
        <Link
          href="/admin/dashboard"
          className="text-[#d4643f] hover:bg-[#f5f1ed] p-2 rounded"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-[#2d2520]">
          Gestion des Utilisateurs
        </h1>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-[#e8e1db] px-5 py-4 space-y-3">
        <div className="flex gap-3 flex-wrap">
          {["all", "active", "banned"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-[#d4643f] text-white"
                  : "bg-[#f5f1ed] text-[#2d2520] hover:bg-[#e8e1db]"
              }`}
            >
              {f === "all" && "Tous"}
              {f === "active" && "Actifs"}
              {f === "banned" && "Bannis"}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Rechercher par nom ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-[#e8e1db] rounded-lg text-sm"
        />
      </div>

      {/* Content */}
      <div className="p-5 md:p-8">
        {loading ? (
          <div className="text-center text-[#786f69]">Chargement...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center text-[#786f69]">
            Aucun utilisateur trouvé
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#f5f1ed] border-b border-[#e8e1db]">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-[#2d2520]">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-[#2d2520]">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-[#2d2520]">
                      Téléphone
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-[#2d2520]">
                      Rôle
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-[#2d2520]">
                      Solde
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-[#2d2520]">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-[#2d2520]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-[#e8e1db] hover:bg-[#f5f1ed]"
                    >
                      <td className="px-6 py-4 text-[#2d2520] font-medium">
                        {user.full_name}
                      </td>
                      <td className="px-6 py-4 text-[#786f69]">{user.email}</td>
                      <td className="px-6 py-4 text-[#786f69]">
                        {user.phone || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#2d2520]">
                        {user.wallet_balance.toLocaleString()} FCFA
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 w-fit ${
                            user.is_banned
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {user.is_banned ? (
                            <>
                              <Ban className="w-3 h-3" />
                              Banni
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Actif
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            user.is_banned
                              ? handleUnban(user.id)
                              : handleBan(user.id)
                          }
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                            user.is_banned
                              ? "bg-green-50 text-green-600 hover:bg-green-100"
                              : "bg-red-50 text-red-600 hover:bg-red-100"
                          }`}
                        >
                          {user.is_banned ? "Débanner" : "Bannir"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
