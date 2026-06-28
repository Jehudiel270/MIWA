"use client";

import { useEffect, useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface PaymentTransaction {
  id: string;
  amount_requested: number | null;
  amount_paid: number | null;
  remaining_due: number | null;
  payment_method: string;
  payment_status: string;
  payment_date: string | null;
  establishment?: {
    name?: string;
  };
}

interface PaymentsResponse {
  success: boolean;
  data: PaymentTransaction[];
  walletBalance: number;
  pendingBalance: number;
  error?: string;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (dateString?: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [pendingBalance, setPendingBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/payments");
        const payload = (await response.json()) as PaymentsResponse;

        if (!payload.success) {
          setError(payload.error || "Erreur lors du chargement des paiements");
          return;
        }

        setTransactions(payload.data ?? []);
        setWalletBalance(payload.walletBalance ?? 0);
        setPendingBalance(payload.pendingBalance ?? 0);
      } catch (err) {
        setError("Impossible de charger les transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const renderStatusIcon = (status: string) => {
    if (status === "paid") return CheckCircle;
    if (status === "pending") return Clock;
    return XCircle;
  };

  return (
    <div className="min-h-screen bg-[#f5f1ed] pb-24">
      <div className="bg-linear-to-br from-[#d4643f] to-[#c25838] text-white px-5 py-8">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="w-5 h-5" />
          <span className="text-sm opacity-90">Solde du portefeuille</span>
        </div>
        <h1 className="text-4xl mb-6">{walletBalance.toLocaleString()} FCFA</h1>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <p className="text-xs opacity-80 mb-1">En attente</p>
            <p className="text-xl">{pendingBalance.toLocaleString()} FCFA</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <p className="text-xs opacity-80 mb-1">Disponible</p>
            <p className="text-xl">
              {(walletBalance - pendingBalance).toLocaleString()} FCFA
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg text-[#2d2520]">Transactions</h2>
          <button
            type="button"
            className="text-sm text-[#d4643f]"
            onClick={() => window.location.reload()}
          >
            Actualiser
          </button>
        </div>

        {loading && (
          <div className="rounded-3xl bg-white p-6 text-center text-[#786f69] shadow-sm">
            Chargement des transactions...
          </div>
        )}

        {error && (
          <div className="rounded-3xl bg-white p-6 text-center text-red-600 shadow-sm">
            {error}
          </div>
        )}

        {!loading && !error && transactions.length === 0 && (
          <div className="rounded-3xl bg-white p-6 text-center text-[#786f69] shadow-sm">
            Aucune transaction disponible pour le moment.
          </div>
        )}

        <div className="space-y-3">
          {transactions.map((transaction) => {
            const amount = Number(
              transaction.amount_paid ?? transaction.amount_requested ?? 0,
            );
            const isRefund = transaction.payment_status === "refunded";
            const displayAmount = isRefund ? amount : -amount;
            const Icon = isRefund ? TrendingUp : TrendingDown;
            const StatusIcon = renderStatusIcon(transaction.payment_status);
            const title =
              transaction.payment_status === "refunded"
                ? `Remboursement - ${transaction.establishment?.name ?? "Réservation"}`
                : transaction.remaining_due && transaction.remaining_due > 0
                  ? `Acompte - ${transaction.establishment?.name ?? "Réservation"}`
                  : `Paiement - ${transaction.establishment?.name ?? "Réservation"}`;

            return (
              <div
                key={transaction.id}
                className="bg-white rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${isRefund ? "bg-[#10b981]/10" : "bg-[#d4643f]/10"}`}
                  >
                    <Icon
                      className={`w-6 h-6 ${isRefund ? "text-[#10b981]" : "text-[#d4643f]"}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-sm text-[#2d2520] truncate">
                        {title}
                      </h3>
                      <p
                        className={`text-sm whitespace-nowrap ml-2 ${isRefund ? "text-[#10b981]" : "text-[#2d2520]"}`}
                      >
                        {displayAmount > 0 ? "+" : ""}
                        {displayAmount.toLocaleString()} FCFA
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[#786f69]">
                        {transaction.payment_date ? (
                          <>
                            {formatDate(transaction.payment_date)} •{" "}
                            {formatTime(transaction.payment_date)}
                          </>
                        ) : (
                          "Date inconnue"
                        )}
                      </p>
                      <div className="flex items-center gap-1">
                        <StatusIcon
                          className={`w-3.5 h-3.5 ${
                            transaction.payment_status === "paid"
                              ? "text-[#10b981]"
                              : transaction.payment_status === "pending"
                                ? "text-[#d4643f]"
                                : "text-[#786f69]"
                          }`}
                        />
                        <span
                          className={`text-xs ${
                            transaction.payment_status === "paid"
                              ? "text-[#10b981]"
                              : transaction.payment_status === "pending"
                                ? "text-[#d4643f]"
                                : "text-[#786f69]"
                          }`}
                        >
                          {transaction.payment_status === "paid"
                            ? "Terminée"
                            : transaction.payment_status === "pending"
                              ? "En attente"
                              : transaction.payment_status === "refunded"
                                ? "Remboursée"
                                : transaction.payment_status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
