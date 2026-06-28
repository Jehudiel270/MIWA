"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Establishment {
  id: string;
  name: string;
  type: string;
  city: string;
  owner_id: string;
  owner: { full_name: string; email: string };
  is_verified: boolean;
  is_active: boolean;
  verification_status: string;
  created_at: string;
}

export default function EstablishmentsPage() {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "pending" | "verified" | "rejected"
  >("all");

  useEffect(() => {
    fetchEstablishments();
  }, [filter]);

  const fetchEstablishments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/data?type=establishments&limit=100`);
      const data = await res.json();

      if (data.success) {
        let filtered = data.data;
        if (filter === "pending") {
          filtered = filtered.filter(
            (e: Establishment) => e.verification_status === "pending",
          );
        } else if (filter === "verified") {
          filtered = filtered.filter((e: Establishment) => e.is_verified);
        } else if (filter === "rejected") {
          filtered = filtered.filter(
            (e: Establishment) => e.verification_status === "rejected",
          );
        }
        setEstablishments(filtered);
      }
    } catch (error) {
      console.error("Error fetching establishments", error);
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: string) => {
    const res = await fetch(`/api/admin/establishments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "verify" }),
    });

    const data = await res.json();
    if (data.success) {
      toast.success("Établissement vérifié");
      fetchEstablishments();
    } else {
      toast.error(data.error);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Raison du rejet:");
    if (!reason) return;

    const res = await fetch(`/api/admin/establishments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject", reason }),
    });

    const data = await res.json();
    if (data.success) {
      toast.success("Établissement rejeté");
      fetchEstablishments();
    } else {
      toast.error(data.error);
    }
  };

  const handleDeactivate = async (id: string) => {
    const reason = prompt("Raison de la désactivation:");
    if (!reason) return;

    const res = await fetch(`/api/admin/establishments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deactivate", reason }),
    });

    const data = await res.json();
    if (data.success) {
      toast.success("Établissement désactivé");
      fetchEstablishments();
    } else {
      toast.error(data.error);
    }
  };

  const handleFlag = async (id: string) => {
    const reason = window.prompt(
      "Type de signalement (spam, fake, inappropriate):",
    );
    if (!reason) return;

    const res = await fetch(`/api/admin/establishments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "flag", reason }),
    });

    const data = await res.json();
    if (data.success) {
      toast.success("Établissement signalé");
      fetchEstablishments();
    } else {
      toast.error(data.error);
    }
  };

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
          Gestion des Établissements
        </h1>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-[#e8e1db] px-5 py-4">
        <div className="flex gap-3 flex-wrap">
          {["all", "pending", "verified", "rejected"].map((f) => (
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
              {f === "pending" && "En attente"}
              {f === "verified" && "Vérifiés"}
              {f === "rejected" && "Rejetés"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 md:p-8">
        {loading ? (
          <div className="text-center text-[#786f69]">Chargement...</div>
        ) : establishments.length === 0 ? (
          <div className="text-center text-[#786f69]">
            Aucun établissement trouvé
          </div>
        ) : (
          <div className="space-y-3">
            {establishments.map((est) => (
              <div
                key={est.id}
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#2d2520] mb-1">
                      {est.name}
                    </h3>
                    <p className="text-sm text-[#786f69]">
                      Propriétaire: {est.owner.full_name} ({est.owner.email})
                    </p>
                    <p className="text-sm text-[#786f69]">
                      Type: {est.type} • Ville: {est.city}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-end">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                        est.is_verified
                          ? "bg-green-100 text-green-700"
                          : est.verification_status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {est.is_verified && <CheckCircle className="w-4 h-4" />}
                      {!est.is_verified &&
                        est.verification_status === "rejected" && (
                          <XCircle className="w-4 h-4" />
                        )}
                      {est.verification_status === "pending" && (
                        <AlertCircle className="w-4 h-4" />
                      )}
                      {est.is_verified
                        ? "Vérifié"
                        : est.verification_status === "rejected"
                          ? "Rejeté"
                          : "En attente"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        est.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {est.is_active ? "Actif" : "Inactif"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-wrap pt-3 border-t border-[#e8e1db]">
                  {!est.is_verified &&
                    est.verification_status === "pending" && (
                      <>
                        <button
                          onClick={() => handleVerify(est.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-sm font-medium"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Vérifier
                        </button>
                        <button
                          onClick={() => handleReject(est.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium"
                        >
                          <XCircle className="w-4 h-4" />
                          Rejeter
                        </button>
                      </>
                    )}
                  {est.is_active && (
                    <button
                      onClick={() => handleDeactivate(est.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 text-sm font-medium"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Désactiver
                    </button>
                  )}
                  <button
                    onClick={() => handleFlag(est.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium"
                  >
                    <Shield className="w-4 h-4" />
                    Signaler
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
