"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Feedback {
  id: string;
  feedback_type: string;
  message: string;
  status: string;
  response: string | null;
  client: { full_name: string; email: string };
  created_at: string;
}

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "read" | "responded">(
    "all",
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");

  useEffect(() => {
    fetchFeedback();
  }, [filter]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/data?type=feedback&limit=100`);
      const data = await res.json();

      if (data.success) {
        let filtered = data.data;
        if (filter === "new") {
          filtered = filtered.filter((f: Feedback) => f.status === "new");
        } else if (filter === "read") {
          filtered = filtered.filter((f: Feedback) => f.status === "read");
        } else if (filter === "responded") {
          filtered = filtered.filter((f: Feedback) => f.status === "responded");
        }
        setFeedback(filtered);
      }
    } catch (error) {
      console.error("Error fetching feedback", error);
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/feedback/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_status", status }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Statut mis à jour");
        fetchFeedback();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Error updating feedback status", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleAddResponse = async (id: string) => {
    if (!responseText.trim()) {
      toast.error("Veuillez entrer une réponse");
      return;
    }

    try {
      const res = await fetch(`/api/admin/feedback/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_response",
          response: responseText,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Réponse ajoutée");
        setResponseText("");
        setExpandedId(null);
        fetchFeedback();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Error adding response", error);
      toast.error("Erreur lors de l'ajout de la réponse");
    }
  };

  const getFeedbackTypeColor = (type: string) => {
    switch (type) {
      case "bug":
        return "bg-red-100 text-red-700";
      case "feature":
        return "bg-blue-100 text-blue-700";
      case "complaint":
        return "bg-yellow-100 text-yellow-700";
      case "praise":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-red-100 text-red-700";
      case "read":
        return "bg-yellow-100 text-yellow-700";
      case "responded":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
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
          Gestion des Retours
        </h1>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-[#e8e1db] px-5 py-4">
        <div className="flex gap-3 flex-wrap">
          {["all", "new", "read", "responded"].map((f) => (
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
              {f === "new" && "Nouveaux"}
              {f === "read" && "Lus"}
              {f === "responded" && "Répondus"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 md:p-8">
        {loading ? (
          <div className="text-center text-[#786f69]">Chargement...</div>
        ) : feedback.length === 0 ? (
          <div className="text-center text-[#786f69]">Aucun retour trouvé</div>
        ) : (
          <div className="space-y-3">
            {feedback.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className="p-5 cursor-pointer"
                  onClick={() =>
                    setExpandedId(expandedId === item.id ? null : item.id)
                  }
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-[#2d2520]">
                          {item.client?.full_name}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${getFeedbackTypeColor(
                            item.feedback_type,
                          )}`}
                        >
                          {item.feedback_type}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                            item.status,
                          )}`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="text-sm text-[#786f69] mb-2">
                        {item.message}
                      </p>
                      <p className="text-xs text-[#999]">
                        {new Date(item.created_at).toLocaleString("fr-FR")}
                      </p>
                    </div>
                  </div>
                </div>

                {expandedId === item.id && (
                  <div className="border-t border-[#e8e1db] p-5 space-y-3">
                    {item.response && (
                      <div className="bg-[#f5f1ed] rounded-lg p-3">
                        <p className="text-xs font-semibold text-[#2d2520] mb-1">
                          Réponse de l'admin:
                        </p>
                        <p className="text-sm text-[#786f69]">
                          {item.response}
                        </p>
                      </div>
                    )}

                    {item.status !== "responded" && (
                      <div className="space-y-2">
                        <textarea
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder="Votre réponse..."
                          className="w-full px-3 py-2 border border-[#e8e1db] rounded-lg text-sm resize-none"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddResponse(item.id)}
                            className="flex-1 px-4 py-2 bg-[#d4643f] text-white rounded-lg text-sm font-medium hover:bg-[#c7541b]"
                          >
                            Envoyer une réponse
                          </button>
                          <select
                            aria-label="Statut de la demande"
                            value={item.status}
                            onChange={(e) =>
                              handleUpdateStatus(item.id, e.target.value)
                            }
                            className="px-3 py-2 border border-[#e8e1db] rounded-lg text-sm"
                          >
                            <option value="new">Nouveau</option>
                            <option value="read">Lu</option>
                            <option value="responded">Répondu</option>
                          </select>
                        </div>
                      </div>
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
