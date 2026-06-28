import Link from "next/link";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Calendar, MapPin, Bed } from "lucide-react";
import { createClient } from "@/lib/supabaseServer";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function ActiveReservation() {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return (
      <div className="px-5 pb-6">
        <h2 className="text-lg text-[#2d2520] mb-4">Réservation active</h2>
        <div className="rounded-3xl bg-white p-6 text-[#786f69] shadow-sm">
          Connectez-vous pour voir votre réservation active.
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const { data: bookings, error } = await supabase
    .from("hotel_bookings")
    .select(
      "*, establishment:establishments(name,city,cover_image_url), room:rooms(type)",
    )
    .eq("client_id", authData.user.id)
    .in("status", ["pending", "confirmed"])
    .gte("check_in_date", today)
    .order("check_in_date", { ascending: true })
    .limit(1);

  if (error || !bookings || bookings.length === 0) {
    return (
      <div className="px-5 pb-6">
        <h2 className="text-lg text-[#2d2520] mb-4">Réservation active</h2>
        <div className="rounded-3xl bg-white p-6 text-[#786f69] shadow-sm">
          Aucune réservation active trouvée.
        </div>
      </div>
    );
  }

  const booking = bookings[0];
  const image =
    booking.establishment?.cover_image_url ??
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=400&fit=crop";
  const roomType = booking.room?.type ?? "Chambre";
  const remaining = Number(booking.remaining_amount ?? 0);
  const depositStatus = remaining > 0 ? "Acompte payé" : "Paiement reçu";

  return (
    <div className="px-5 pb-6">
      <h2 className="text-lg text-[#2d2520] mb-4">Réservation active</h2>
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="h-48 overflow-hidden">
          <ImageWithFallback
            src={image}
            alt={booking.establishment?.name ?? "Réservation"}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-5">
          <h3 className="text-xl text-[#2d2520] mb-1">
            {booking.establishment?.name ?? "Établissement"}
          </h3>
          <div className="flex items-center gap-1 text-[#786f69] mb-4">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">
              {booking.establishment?.city ?? "Ville inconnue"}
            </span>
          </div>

          <div className="space-y-3 mb-5">
            <div className="flex items-center gap-2 text-sm">
              <Bed className="w-4 h-4 text-[#786f69]" />
              <span className="text-[#2d2520]">{roomType}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-[#786f69]" />
              <span className="text-[#2d2520]">
                Check-in: {formatDate(booking.check_in_date)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-5">
            <div className="inline-flex items-center px-3 py-1.5 bg-[#10b981]/10 rounded-full">
              <div className="w-2 h-2 bg-[#10b981] rounded-full mr-2"></div>
              <span className="text-sm text-[#10b981]">{depositStatus}</span>
            </div>
            {remaining > 0 && (
              <div className="text-sm text-[#786f69]">
                Reste:{" "}
                <span className="text-[#2d2520]">
                  {remaining.toLocaleString()} FCFA
                </span>
              </div>
            )}
          </div>

          <Link href="/qr">
            <button className="w-full py-4 bg-[#d4643f] text-white rounded-2xl shadow-md hover:bg-[#c25838] transition-colors">
              Mon QR
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
