"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import {
  Shield,
  CreditCard,
  Smartphone,
  Wallet,
  Check,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";

interface Booking {
  id: string;
  establishment_id: string;
  room_id: string;
  total_price: number;
  deposit_amount: number | null;
  remaining_amount: number | null;
  number_of_nights: number;
  check_in_date: string;
  check_out_date: string;
}

interface RoomDetails {
  id: string;
  room_number: string;
  type?: string;
  price_per_night: number;
  image_url?: string;
}

interface Establishment {
  id: string;
  name: string;
  cover_image_url?: string;
  city?: string;
}

const paymentMethods = [
  {
    id: "mobile",
    name: "Mobile Money",
    icon: Smartphone,
    description: "MTN, Moov, Celtis",
  },
  {
    id: "card",
    name: "Carte bancaire",
    icon: CreditCard,
    description: "Visa, Mastercard",
  },
  {
    id: "wallet",
    name: "Portefeuille",
    icon: Wallet,
    description: "Solde: 125 000 FCFA",
  },
];

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState("mobile");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [room, setRoom] = useState<RoomDetails | null>(null);
  const [establishment, setEstablishment] = useState<Establishment | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function loadBooking() {
      try {
        const bookingResponse = await fetch(`/api/hotel-bookings/${params.id}`);
        const bookingResult = await bookingResponse.json();

        if (!bookingResponse.ok || !bookingResult.success) {
          throw new Error(bookingResult.error || "Réservation introuvable");
        }

        const bookingData = bookingResult.data as Booking;
        setBooking(bookingData);

        const [roomResponse, establishmentResponse] = await Promise.all([
          fetch(`/api/rooms/${bookingData.room_id}`),
          fetch(`/api/establishments/${bookingData.establishment_id}`),
        ]);

        const roomResult = await roomResponse.json();
        const establishmentResult = await establishmentResponse.json();

        if (roomResponse.ok && roomResult.success) {
          setRoom(roomResult.data as RoomDetails);
        }

        if (establishmentResponse.ok && establishmentResult.success) {
          setEstablishment(establishmentResult.data as Establishment);
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Impossible de charger les détails de réservation",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadBooking();
  }, [params.id]);

  const pricePerNight = booking
    ? Number(booking.total_price) / booking.number_of_nights
    : 0;

  const serviceFee = 2500;
  const totalAmount = booking ? Number(booking.total_price) + serviceFee : 0;
  const depositAmount = booking
    ? Number(booking.deposit_amount ?? Math.round(totalAmount * 0.5))
    : 0;
  const remainingBalance = booking
    ? Number(booking.remaining_amount ?? totalAmount - depositAmount)
    : 0;

  const handlePayment = async () => {
    if (!booking) {
      toast.error("Aucune réservation chargée");
      return;
    }

    if (isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          amount: depositAmount,
          paymentMethod: selectedPayment,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Échec du paiement");
      }

      toast.success("Paiement enregistré avec succès");
      router.push(`/payment-success/${result.transactionId}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur lors du paiement",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1ed] pb-32">
      <div className="bg-[#d4643f] text-white px-5 py-6 relative">
        <button
          aria-label="Retour"
          onClick={() => router.back()}
          className="absolute left-5 top-6 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-[#2d2520]" />
        </button>
        <div className="pl-12">
          <h1 className="text-2xl mb-1">Paiement sécurisé</h1>
          <p className="text-sm text-white/80">Confirmez votre réservation</p>
        </div>
      </div>

      <div className="px-5 py-6 space-y-6">
        <div className="bg-white rounded-3xl shadow-md overflow-hidden">
          <div className="h-40 overflow-hidden">
            <ImageWithFallback
              src={
                establishment?.cover_image_url ||
                room?.image_url ||
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"
              }
              alt={establishment?.name || room?.type || "Réservation"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-5">
            <h2 className="text-lg text-[#2d2520] mb-1">
              {establishment?.name || "Votre réservation"}
            </h2>
            <p className="text-sm text-[#786f69] mb-4">
              {room?.type || `Chambre ${room?.room_number ?? ""}`}
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#786f69]">Arrivée</p>
                <p className="text-[#2d2520]">
                  {booking
                    ? new Date(booking.check_in_date).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-[#786f69]">Départ</p>
                <p className="text-[#2d2520]">
                  {booking
                    ? new Date(booking.check_out_date).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-md p-5">
          <h2 className="text-lg text-[#2d2520] mb-4">Détails du paiement</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#786f69]">
                {pricePerNight.toLocaleString()} FCFA ×{" "}
                {booking?.number_of_nights} nuits
              </span>
              <span className="text-[#2d2520]">
                {booking ? Number(booking.total_price).toLocaleString() : 0}{" "}
                FCFA
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#786f69]">Frais de service</span>
              <span className="text-[#2d2520]">
                {serviceFee.toLocaleString()} FCFA
              </span>
            </div>
            <div className="border-t border-[#e8e1db] pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#786f69]">Total</span>
                <span className="text-xl text-[#2d2520]">
                  {totalAmount.toLocaleString()} FCFA
                </span>
              </div>
              <div className="bg-[#10b981]/10 rounded-xl p-3 mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#10b981]">Acompte (50%)</span>
                  <span className="text-lg text-[#10b981]">
                    {depositAmount.toLocaleString()} FCFA
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#786f69]">À payer à l&apos;arrivée</span>
                <span className="text-[#2d2520]">
                  {remainingBalance.toLocaleString()} FCFA
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-md p-5">
          <h2 className="text-lg text-[#2d2520] mb-4">Mode de paiement</h2>
          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                    selectedPayment === method.id
                      ? "border-[#d4643f] bg-[#d4643f]/5"
                      : "border-[#e8e1db] bg-white"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      selectedPayment === method.id
                        ? "bg-[#d4643f]"
                        : "bg-[#f5f1ed]"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        selectedPayment === method.id
                          ? "text-white"
                          : "text-[#786f69]"
                      }`}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm text-[#2d2520]">{method.name}</p>
                    <p className="text-xs text-[#786f69]">
                      {method.description}
                    </p>
                  </div>
                  {selectedPayment === method.id && (
                    <Check className="w-5 h-5 text-[#d4643f]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-[#786f69]">
          <Shield className="w-4 h-4 text-[#10b981]" />
          <span>Paiement sécurisé et crypté</span>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e8e1db] px-5 py-4 shadow-lg">
        <button
          onClick={handlePayment}
          disabled={isLoading || isProcessing || !booking}
          className="w-full max-w-md mx-auto block py-4 bg-[#d4643f] text-white rounded-2xl shadow-md hover:bg-[#c25838] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing
            ? "Paiement en cours..."
            : `Payer l'acompte (${depositAmount.toLocaleString()} FCFA)`}
        </button>
      </div>
    </div>
  );
}
