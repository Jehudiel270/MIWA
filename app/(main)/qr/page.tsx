import { QrCode, Shield, Calendar, Bed, Hash } from "lucide-react";
import { createClient } from "@/lib/supabaseServer";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function QRPage() {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return (
      <div className="min-h-screen bg-[#f5f1ed] pb-24">
        <div className="px-5 py-6">
          <h1 className="text-2xl text-[#2d2520] text-center mb-8">
            Mon QR Code
          </h1>
          <div className="rounded-3xl bg-white p-8 text-center text-[#786f69] shadow-sm">
            Connectez-vous pour afficher votre QR de réservation.
          </div>
        </div>
      </div>
    );
  }

  const { data: bookings, error } = await supabase
    .from("hotel_bookings")
    .select("*, establishment:establishments(name), room:rooms(room_number)")
    .eq("client_id", authData.user.id)
    .in("status", ["pending", "confirmed", "completed"])
    .order("check_in_date", { ascending: true });

  if (error || !bookings || bookings.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f1ed] pb-24">
        <div className="px-5 py-6">
          <h1 className="text-2xl text-[#2d2520] text-center mb-8">
            Mon QR Code
          </h1>
          <div className="rounded-3xl bg-white p-8 text-center text-[#786f69] shadow-sm">
            Aucune réservation disponible pour afficher un QR code.
          </div>
        </div>
      </div>
    );
  }

  const booking = bookings[0];
  const hotelName = booking.establishment?.name ?? "Établissement";
  const roomNumber = booking.room?.room_number ?? "N/A";
  const bookingCode = booking.booking_code ?? booking.id;
  const checkInDate = formatDate(booking.check_in_date);
  const checkInTime = "14:00";

  return (
    <div className="min-h-screen bg-[#f5f1ed] pb-24">
      <div className="px-5 py-6">
        <h1 className="text-2xl text-[#2d2520] text-center mb-8">
          Mon QR Code
        </h1>

        <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
          <div className="w-64 h-64 mx-auto bg-white rounded-2xl border-4 border-[#d4643f] p-4 mb-4">
            <div className="w-full h-full bg-[#2d2520] rounded-xl flex items-center justify-center">
              <QrCode className="w-48 h-48 text-white" />
            </div>
          </div>
          <p className="text-center text-sm text-[#786f69]">
            Présentez ce code à la réception
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-md p-5 mb-6">
          <h2 className="text-lg text-[#2d2520] mb-4">
            Détails de réservation
          </h2>
          <div className="space-y-4">
            {[
              { icon: Bed, label: "Hôtel", value: hotelName },
              { icon: Hash, label: "Numéro de chambre", value: roomNumber },
              {
                icon: Calendar,
                label: "Check-in",
                value: `${checkInDate} à ${checkInTime}`,
              },
              {
                icon: QrCode,
                label: "Code de réservation",
                value: bookingCode,
                mono: true,
              },
            ].map(({ icon: Icon, label, value, mono }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f5f1ed] rounded-full flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#d4643f]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[#786f69]">{label}</p>
                  <p
                    className={`text-sm text-[#2d2520] ${mono ? "font-mono" : ""}`}
                  >
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#10b981]/10 rounded-3xl p-5 mb-6 border-2 border-[#10b981]/20">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-[#10b981]" />
            <span className="text-sm text-[#10b981]">Acompte validé</span>
          </div>
          <p className="text-xs text-[#786f69] ml-8">
            Votre paiement a été confirmé. Vous pouvez procéder au check-in.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-md p-5">
          <h3 className="text-sm text-[#2d2520] mb-3">Instructions</h3>
          <ul className="space-y-2 text-xs text-[#786f69]">
            {[
              "Présentez ce QR code à la réception de l'hôtel",
              `Le code est valable à partir du ${checkInDate} à ${checkInTime}`,
              "Une pièce d'identité sera requise au check-in",
              "Le solde restant sera payable à la réception",
            ].map((instruction, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-[#d4643f]">•</span>
                <span>{instruction}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
