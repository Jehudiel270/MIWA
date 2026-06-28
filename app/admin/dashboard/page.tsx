"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  MessageSquare,
  Users,
  BookOpen,
  CreditCard,
  LogOut,
  Menu,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabaseBrowser";
import { toast } from "sonner";

interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  totalFeedback: number;
  totalMessages: number;
  totalRevenue: number;
  pendingFeedback: number;
  pendingMessages: number;
}

interface FeedbackItem {
  id: string;
  feedback_type: string;
  message: string;
  status: string;
  client: { full_name: string; email: string };
  created_at: string;
}

interface ContactMessage {
  id: string;
  email: string;
  full_name: string;
  subject: string;
  status: string;
  created_at: string;
}

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

interface Establishment {
  id: string;
  name: string;
  type: string;
  city: string;
  is_verified: boolean;
  is_active: boolean;
  verification_status: string;
  owner: { full_name: string; email: string };
  created_at: string;
}

export default function AdminDashboard() {
  const supabase = createClient();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "users"
    | "establishments"
    | "bookings"
    | "payments"
    | "feedback"
    | "messages"
  >("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const statsRes = await fetch("/api/admin/stats");
      const statsData = await statsRes.json();

      if (statsData.success) {
        setStats({
          totalUsers: statsData.data.stats.users?.total_users || 0,
          totalBookings: statsData.data.stats.bookings?.total_bookings || 0,
          totalFeedback: statsData.data.stats.feedback?.count || 0,
          totalMessages: statsData.data.stats.messages?.count || 0,
          totalRevenue: statsData.data.stats.payments?.total_paid || 0,
          pendingFeedback: statsData.data.stats.feedback?.pending || 0,
          pendingMessages: statsData.data.stats.messages?.pending || 0,
        });
      }

      if (activeTab === "users") {
        const dataRes = await fetch("/api/admin/data?type=users&limit=50");
        const data = await dataRes.json();
        if (data.success) setUsers(data.data);
      }

      if (activeTab === "establishments") {
        const dataRes = await fetch(
          "/api/admin/data?type=establishments&limit=50",
        );
        const data = await dataRes.json();
        if (data.success) setEstablishments(data.data);
      }

      if (activeTab === "feedback") {
        const dataRes = await fetch("/api/admin/data?type=feedback&limit=50");
        const data = await dataRes.json();
        if (data.success) setFeedback(data.data);
      }

      if (activeTab === "messages") {
        const dataRes = await fetch("/api/admin/data?type=messages&limit=50");
        const data = await dataRes.json();
        if (data.success) setMessages(data.data);
      }
    } catch (error) {
      console.error("Error fetching admin data", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleBanUser = async (userId: string, isBanned: boolean) => {
    const action = isBanned ? "unban" : "ban";
    const reason = isBanned ? undefined : prompt("Raison du bannissement:");
    if (!isBanned && !reason) return;

    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, reason }),
    });

    const data = await res.json();
    if (data.success) {
      toast.success(isBanned ? "Utilisateur débanni" : "Utilisateur banni");
      fetchData();
    } else {
      toast.error(data.error);
    }
  };

  const handleVerifyEstablishment = async (establishmentId: string) => {
    const res = await fetch(`/api/admin/establishments/${establishmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "verify" }),
    });

    const data = await res.json();
    if (data.success) {
      toast.success("Établissement vérifié");
      fetchData();
    } else {
      toast.error(data.error);
    }
  };

  if (loading && activeTab === "overview") {
    return (
      <div className="min-h-screen bg-[#f5f1ed] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4643f]" />
          <p className="mt-4 text-[#786f69]">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f1ed]">
      {/* Header */}
      <div className="bg-white border-b border-[#e8e1db] px-5 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-[#2d2520]">Miwa Admin</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-red-50 text-[#d4183d] rounded-lg hover:bg-red-100"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed md:relative w-64 bg-white border-r border-[#e8e1db] h-screen transition-all ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <nav className="p-4 space-y-2">
            {[
              { id: "overview", label: "Vue d'ensemble", icon: BarChart3 },
              { id: "users", label: "Utilisateurs", icon: Users },
              { id: "establishments", label: "Établissements", icon: BookOpen },
              { id: "bookings", label: "Réservations", icon: BookOpen },
              { id: "payments", label: "Paiements", icon: CreditCard },
              { id: "feedback", label: "Retours", icon: MessageSquare },
              { id: "messages", label: "Messages", icon: MessageSquare },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id as any);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === id
                    ? "bg-[#d4643f] text-white"
                    : "text-[#2d2520] hover:bg-[#f5f1ed]"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-5 md:p-8">
          {activeTab === "overview" && stats && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#2d2520]">
                Vue d'ensemble
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  {
                    label: "Utilisateurs",
                    value: stats.totalUsers,
                    icon: Users,
                    color: "bg-blue-50",
                  },
                  {
                    label: "Réservations",
                    value: stats.totalBookings,
                    icon: BookOpen,
                    color: "bg-green-50",
                  },
                  {
                    label: "Paiements",
                    value: `${stats.totalRevenue.toLocaleString()} FCFA`,
                    icon: CreditCard,
                    color: "bg-purple-50",
                  },
                  {
                    label: "Retours",
                    value: stats.totalFeedback,
                    icon: MessageSquare,
                    color: "bg-yellow-50",
                  },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className={`${color} rounded-2xl p-6`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#786f69] mb-1">{label}</p>
                        <p className="text-3xl font-bold text-[#2d2520]">
                          {value}
                        </p>
                      </div>
                      <Icon className="w-8 h-8 text-[#d4643f] opacity-30" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#2d2520]">
                Gestion des Utilisateurs
              </h2>
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
                          Rôle
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
                      {users.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b border-[#e8e1db] hover:bg-[#f5f1ed]"
                        >
                          <td className="px-6 py-4 text-[#2d2520]">
                            {user.full_name}
                          </td>
                          <td className="px-6 py-4 text-[#786f69]">
                            {user.email}
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
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                user.is_banned
                                  ? "bg-red-100 text-red-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {user.is_banned ? "Banni" : "Actif"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() =>
                                handleBanUser(user.id, user.is_banned)
                              }
                              className="text-sm px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
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
            </div>
          )}

          {activeTab === "establishments" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#2d2520]">
                Gestion des Établissements
              </h2>
              <div className="space-y-3">
                {establishments.map((est) => (
                  <div
                    key={est.id}
                    className="bg-white rounded-2xl p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-[#2d2520]">
                          {est.name}
                        </p>
                        <p className="text-sm text-[#786f69]">
                          {est.owner.full_name} • {est.type}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            est.is_verified
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {est.is_verified ? "Vérifié" : "En attente"}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            est.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {est.is_active ? "Actif" : "Inactif"}
                        </span>
                      </div>
                    </div>
                    {!est.is_verified && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => handleVerifyEstablishment(est.id)}
                          className="text-sm px-3 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100"
                        >
                          Vérifier
                        </button>
                        <button className="text-sm px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100">
                          Rejeter
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#2d2520]">
                Réservations
              </h2>
              <div className="bg-white rounded-2xl p-6 text-center text-[#786f69]">
                Fonctionnalité en développement
              </div>
            </div>
          )}

          {activeTab === "payments" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#2d2520]">Paiements</h2>
              <div className="bg-white rounded-2xl p-6 text-center text-[#786f69]">
                Fonctionnalité en développement
              </div>
            </div>
          )}

          {activeTab === "feedback" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#2d2520]">
                Retours Utilisateurs
              </h2>
              <div className="space-y-3">
                {feedback.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-[#2d2520]">
                          {item.client?.full_name}
                        </p>
                        <p className="text-sm text-[#786f69]">{item.message}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          item.feedback_type === "bug"
                            ? "bg-red-100 text-red-700"
                            : item.feedback_type === "feature"
                              ? "bg-blue-100 text-blue-700"
                              : item.feedback_type === "complaint"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.feedback_type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#2d2520]">
                Messages de Contact
              </h2>
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="bg-white rounded-2xl p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-[#2d2520]">
                          {msg.full_name}
                        </p>
                        <p className="text-sm text-[#786f69]">{msg.email}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          msg.status === "new"
                            ? "bg-red-100 text-red-700"
                            : msg.status === "read"
                              ? "bg-yellow-100 text-yellow-700"
                              : msg.status === "responded"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {msg.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
