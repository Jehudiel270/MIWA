"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Calendar, MapPin, QrCode } from "lucide-react";

type TabId = "upcoming" | "past" | "cancelled";

type BookingItem = {
  id: string;
  status: string;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  remaining_amount: number | null;
  qr_code_url: string | null;
  establishment: {
    name: string;
    city: string;
    cover_image_url?: string;
  } | null;
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("upcoming");
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/bookings");
        const payload = await response.json();

        if (!payload.success) {
          setError(
            payload.error || "Erreur lors du chargement des réservations",
          );
          setBookings([]);
        } else {
          setBookings(payload.data ?? []);
        }
      } catch (err) {
        setError("Impossible de charger les réservations");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const grouped = useMemo(() => {
    const upcoming: BookingItem[] = [];
    const past: BookingItem[] = [];
    const cancelled: BookingItem[] = [];

    bookings.forEach((booking) => {
      const checkIn = new Date(booking.check_in_date);
      const checkOut = new Date(booking.check_out_date);

      if (booking.status === "cancelled") {
        cancelled.push(booking);
        return;
      }

      if (checkOut < today || booking.status === "completed") {
        past.push(booking);
        return;
      }

      upcoming.push(booking);
    });

    return { upcoming, past, cancelled };
  }, [bookings, today]);

  const tabs = [
    {
      id: "upcoming" as TabId,
      label: "À venir",
      count: grouped.upcoming.length,
    },
    { id: "past" as TabId, label: "Passées", count: grouped.past.length },
    {
      id: "cancelled" as TabId,
      label: "Annulées",
      count: grouped.cancelled.length,
    },
  ];

  const currentBookings = grouped[activeTab];

  return (
    <div className="min-h-screen bg-[#f5f1ed] pb-24">
      <div className="bg-white px-5 py-6 border-b border-[#e8e1db]">
        <h1 className="text-2xl text-[#2d2520] mb-4">Mes réservations</h1>
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 rounded-xl transition-colors ${
                activeTab === tab.id
                  ? "bg-[#d4643f] text-white"
                  : "bg-[#f5f1ed] text-[#786f69]"
              }`}
            >
              <span className="text-sm">{tab.label}</span>
              <span className="ml-1 text-xs">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-6 space-y-4">
        {loading ? (
          <div className="rounded-3xl bg-white p-6 text-center text-[#786f69] shadow-sm">
            Chargement des réservations...
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-white p-6 text-center text-red-600 shadow-sm">
            {error}
          </div>
        ) : currentBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#786f69]">
              Aucune réservation{" "}
              {activeTab === "upcoming"
                ? "à venir"
                : activeTab === "past"
                  ? "passée"
                  : "annulée"}
            </p>
          </div>
        ) : (
          currentBookings.map((booking) => {
            const image =
              booking.establishment?.cover_image_url ||
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop";
            const statusLabel =
              booking.status === "confirmed"
                ? "Confirmée"
                : booking.status === "pending"
                  ? "En attente"
                  : booking.status === "cancelled"
                    ? "Annulée"
                    : booking.status;
            const statusStyle =
              booking.status === "confirmed"
                ? "bg-[#10b981]/10 text-[#10b981]"
                : booking.status === "pending"
                  ? "bg-[#d4643f]/10 text-[#d4643f]"
                  : "bg-[#786f69]/10 text-[#786f69]";
            const qrAvailable = Boolean(
              booking.qr_code_url && booking.status !== "pending",
            );

            return (
              <div
                key={booking.id}
                className="bg-white rounded-3xl shadow-md overflow-hidden"
              >
                <div className="h-40 overflow-hidden">
                  <ImageWithFallback
                    src={image}
                    alt={booking.establishment?.name ?? "Réservation"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg text-[#2d2520] mb-1">
                        {booking.establishment?.name ?? "Établissement"}
                      </h3>
                      <div className="flex items-center gap-1 text-[#786f69] mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">
                          {booking.establishment?.city ?? "Ville inconnue"}
                        </span>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full ${statusStyle}`}>
                      <span className="text-xs">{statusLabel}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1 text-[#786f69]">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(booking.check_in_date)}</span>
                    </div>
                    <span className="text-[#786f69]">→</span>
                    <span className="text-[#786f69]">
                      {formatDate(booking.check_out_date)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[#786f69]">Prix total</p>
                      <p className="text-lg text-[#2d2520]">
                        {Number(booking.total_price).toLocaleString()} FCFA
                      </p>
                    </div>
                    {qrAvailable && (
                      <Link href="/qr">
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#d4643f] text-white rounded-xl hover:bg-[#c25838] transition-colors">
                          <QrCode className="w-4 h-4" />
                          <span className="text-sm">QR Code</span>
                        </button>
                      </Link>
                    )}
                    {booking.status === "pending" && (
                      <Link href={`/checkout/${booking.id}`}>
                        <button className="px-4 py-2 bg-[#d4643f] text-white rounded-xl hover:bg-[#c25838] transition-colors text-sm">
                          Payer
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
