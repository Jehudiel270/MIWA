"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronLeft, Users, MapPin, Edit2 } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { RoomSelector, ConfirmationDialog } from "@/components/modals";
import { FadeContainer, AnimatedItem } from "@/components/ui/motion";

interface ApiRoom {
  id: string;
  room_number: string;
  type: string;
  capacity: number;
  price_per_night: number;
  amenities?: string[];
  image_url?: string;
}

interface UiRoom {
  id: string;
  type: string;
  capacity: number;
  price: number;
  amenities: string[];
  image?: string;
}

interface Establishment {
  id: string;
  name: string;
  city?: string;
  address?: string;
  cover_image_url?: string;
}

const getDefaultDate = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().slice(0, 10);
};

export default function BookingConfirmationPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [rooms, setRooms] = useState<UiRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<UiRoom | null>(null);
  const [establishment, setEstablishment] = useState<Establishment | null>(
    null,
  );
  const [checkInDate, setCheckInDate] = useState(getDefaultDate(1));
  const [checkOutDate, setCheckOutDate] = useState(getDefaultDate(4));
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");
  const [isRoomSelectorOpen, setIsRoomSelectorOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadEstablishmentAndRooms() {
      try {
        const [estRes, roomsRes] = await Promise.all([
          fetch(`/api/establishments/${params.id}`),
          fetch(`/api/rooms?establishment_id=${params.id}&available=true`),
        ]);

        const estData = await estRes.json();
        const roomsData = await roomsRes.json();

        if (!estRes.ok || !estData.success) {
          throw new Error(estData.error || "Établissement introuvable");
        }

        if (!roomsRes.ok || !roomsData.success) {
          throw new Error(
            roomsData.error || "Impossible de charger les chambres",
          );
        }

        const mappedRooms: UiRoom[] = roomsData.data.map((room: ApiRoom) => ({
          id: room.id,
          type: room.type || `Chambre ${room.room_number}`,
          capacity: room.capacity,
          price: Number(room.price_per_night),
          amenities: Array.isArray(room.amenities) ? room.amenities : [],
          image:
            room.image_url ||
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=200&h=200&fit=crop",
        }));

        setEstablishment(estData.data);
        setRooms(mappedRooms);
        if (mappedRooms.length > 0) {
          setSelectedRoom(mappedRooms[0]);
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Impossible de charger les données de l'établissement",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadEstablishmentAndRooms();
  }, [params.id]);

  const nights = useMemo(() => {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff > 0 ? diff : 1;
  }, [checkInDate, checkOutDate]);

  const totalPrice = selectedRoom ? selectedRoom.price * nights : 0;

  return (
    <div className="pb-24">
      <div className="bg-[#d4643f] text-white px-5 py-6 relative">
        <Link href="/search">
          <button
            aria-label="Retour"
            className="absolute left-5 top-6 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-[#2d2520]" />
          </button>
        </Link>
        <div className="pl-12">
          <h1 className="text-2xl mb-1">
            {establishment
              ? `Réservation ${establishment.name}`
              : "Chargement..."}
          </h1>
          <p className="text-sm text-white/80">
            Vérifiez les détails avant de payer.
          </p>
        </div>
      </div>

      <div className="px-5 py-6 space-y-6">
        <FadeContainer stagger>
          <AnimatedItem>
            <div className="bg-white rounded-3xl shadow-md overflow-hidden">
              <div className="h-40 overflow-hidden">
                <ImageWithFallback
                  src={
                    establishment?.cover_image_url ||
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"
                  }
                  alt={establishment?.name || "Hébergement"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <h2 className="text-lg font-semibold text-[#2d2520] mb-1">
                  {establishment?.name || "Hébergement"}
                </h2>
                <div className="flex items-center gap-1 text-[#786f69] mb-4">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">
                    {establishment?.city || "Bénin"}
                  </span>
                </div>
              </div>
            </div>
          </AnimatedItem>

          <AnimatedItem>
            <div className="bg-white rounded-3xl shadow-md p-5">
              <h3 className="text-lg font-semibold text-[#2d2520] mb-4 flex items-center justify-between">
                <span>Chambre</span>
                <button
                  onClick={() => setIsRoomSelectorOpen(true)}
                  className="text-xs text-[#d4643f] flex items-center gap-1 hover:underline"
                >
                  <Edit2 className="w-3 h-3" />
                  Modifier
                </button>
              </h3>

              {isLoading ? (
                <div className="p-6 text-center text-sm text-[#786f69]">
                  Chargement des chambres...
                </div>
              ) : selectedRoom ? (
                <div className="p-3 bg-[#f5f1ed] rounded-2xl">
                  <p className="text-sm font-semibold text-[#2d2520]">
                    {selectedRoom.type}
                  </p>
                  <p className="text-xs text-[#786f69]">
                    {selectedRoom.capacity} personne(s)
                  </p>
                  <p className="text-lg font-semibold text-[#d4643f] mt-2">
                    {selectedRoom.price.toLocaleString()} FCFA/nuit
                  </p>
                </div>
              ) : (
                <div className="p-6 text-sm text-[#786f69] rounded-2xl border border-dashed border-[#e8e1db]">
                  Aucune chambre disponible pour cet établissement.
                </div>
              )}
            </div>
          </AnimatedItem>

          <AnimatedItem>
            <div className="bg-white rounded-3xl shadow-md p-5">
              <h3 className="text-lg font-semibold text-[#2d2520] mb-4">
                Dates
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-[#786f69] mb-1 block">
                    Check-in
                  </label>
                  <input
                    type="date"
                    aria-label="Date d'arrivée"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e8e1db] rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#786f69] mb-1 block">
                    Check-out
                  </label>
                  <input
                    type="date"
                    aria-label="Date de départ"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e8e1db] rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          </AnimatedItem>

          <AnimatedItem>
            <div className="bg-white rounded-3xl shadow-md p-5">
              <label className="text-sm font-semibold text-[#2d2520] block mb-3">
                Nombre de voyageurs
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    setNumberOfGuests(Math.max(1, numberOfGuests - 1))
                  }
                  className="w-10 h-10 rounded-full border border-[#e8e1db] hover:bg-[#f5f1ed] transition-colors"
                >
                  −
                </button>
                <span className="flex-1 text-center text-lg font-semibold text-[#2d2520]">
                  {numberOfGuests}
                </span>
                <button
                  onClick={() => setNumberOfGuests(numberOfGuests + 1)}
                  className="w-10 h-10 rounded-full border border-[#e8e1db] hover:bg-[#f5f1ed] transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </AnimatedItem>

          <AnimatedItem>
            <div className="bg-white rounded-3xl shadow-md p-5">
              <label className="text-sm font-semibold text-[#2d2520] block mb-3">
                Demandes spéciales (optionnel)
              </label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Ex: Chambre côté jardin, sans clim..."
                className="w-full px-3 py-2 border border-[#e8e1db] rounded-xl text-sm resize-none"
                rows={3}
              />
            </div>
          </AnimatedItem>

          <AnimatedItem>
            <div className="bg-[#d4643f]/10 rounded-3xl p-5 border border-[#d4643f]/20">
              <h3 className="text-sm font-semibold text-[#2d2520] mb-3">
                Résumé du prix
              </h3>
              <div className="space-y-2 text-sm mb-3 pb-3 border-b border-[#d4643f]/20">
                <div className="flex justify-between">
                  <span className="text-[#786f69]">
                    {selectedRoom?.price.toLocaleString() || 0} FCFA × {nights}{" "}
                    nuits
                  </span>
                  <span className="text-[#2d2520] font-semibold">
                    {totalPrice.toLocaleString()} FCFA
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#786f69]">Frais de service</span>
                  <span className="text-[#2d2520] font-semibold">
                    {Math.floor(totalPrice * 0.02).toLocaleString()} FCFA
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#2d2520] font-semibold">Total</span>
                <span className="text-2xl font-bold text-[#d4643f]">
                  {Math.floor(totalPrice * 1.02).toLocaleString()} FCFA
                </span>
              </div>
            </div>
          </AnimatedItem>
        </FadeContainer>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e8e1db] px-5 py-4 shadow-lg">
        <button
          onClick={() => setShowConfirmation(true)}
          disabled={!selectedRoom || isLoading}
          className="w-full max-w-md mx-auto block py-4 bg-[#d4643f] text-white rounded-2xl shadow-md hover:bg-[#c25838] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {isLoading ? "Chargement..." : "Procéder au paiement"}
        </button>
      </div>

      <RoomSelector
        isOpen={isRoomSelectorOpen}
        onClose={() => setIsRoomSelectorOpen(false)}
        rooms={rooms}
        selectedRoomId={selectedRoom?.id}
        onSelectRoom={(id, room) => setSelectedRoom(room)}
      />

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        type="info"
        title="Confirmer la réservation?"
        message="Passez à l'étape de paiement pour finaliser votre réservation."
        confirmText={isSubmitting ? "En cours..." : "Continuer"}
        cancelText="Retour"
        onConfirm={async () => {
          if (!selectedRoom) {
            toast.error("Sélectionnez une chambre avant de continuer");
            return;
          }

          setShowConfirmation(false);
          setIsSubmitting(true);

          try {
            const response = await fetch("/api/bookings", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                establishment_id: params.id,
                room_id: selectedRoom.id,
                check_in_date: checkInDate,
                check_out_date: checkOutDate,
                number_of_guests: numberOfGuests,
                special_requests: specialRequests,
              }),
            });

            const result = await response.json();

            if (!response.ok) {
              throw new Error(
                result.error || "Impossible de créer la réservation",
              );
            }

            toast.success("Réservation créée, passage au paiement");
            router.push(`/checkout/${result.data.id}`);
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message
                : "Erreur lors de la création de la réservation",
            );
          } finally {
            setIsSubmitting(false);
          }
        }}
      />
    </div>
  );
}
