import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import ProfileEdit from "@/components/ProfileEdit";
import {
  ChevronRight,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabaseServer";

const menuItems = [
  {
    section: "Préférences",
    items: [
      { icon: MapPin, label: "Lieux enregistrés", count: 3 },
      { icon: CreditCard, label: "Moyens de paiement", count: 2 },
      { icon: Bell, label: "Notifications", badge: "new" },
    ],
  },
  {
    section: "Sécurité et assistance",
    items: [
      { icon: Shield, label: "Confidentialité et sécurité" },
      { icon: HelpCircle, label: "Centre d'aide" },
    ],
  },
];

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return (
      <div className="min-h-screen bg-[#f5f1ed] pb-24">
        <div className="bg-white px-5 py-8">
          <div className="rounded-3xl bg-white p-8 text-center text-[#786f69] shadow-sm">
            Connectez-vous pour voir votre profil.
          </div>
        </div>
      </div>
    );
  }

  const [{ data: user }, { count: bookingsCount }] = await Promise.all([
    supabase
      .from("users")
      .select("full_name,email,phone,profile_picture_url")
      .eq("id", authData.user.id)
      .single(),
    supabase
      .from("hotel_bookings")
      .select("id", { count: "exact", head: true })
      .eq("client_id", authData.user.id),
  ]);

  const displayName = user?.full_name || authData.user.email || "Utilisateur";
  const email = user?.email || authData.user.email || "";
  const phone = user?.phone || "";
  const imageUrl =
    user?.profile_picture_url ||
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop";

  return (
    <div className="min-h-screen bg-[#f5f1ed] pb-24">
      <div className="bg-white px-5 py-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-[#d4643f] shadow-lg">
            <ImageWithFallback
              src={imageUrl}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl text-[#2d2520] mb-1">{displayName}</h1>
            <p className="text-sm text-[#786f69]">{email}</p>
            {phone && <p className="text-sm text-[#786f69]">{phone}</p>}
            <ProfileEdit
              initialName={displayName}
              initialEmail={email}
              initialPhone={phone}
              initialImage={imageUrl}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { value: String(bookingsCount ?? 0), label: "Réservations" },
            { value: "—", label: "Avis" },
            { value: "—", label: "Note moyenne" },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="bg-[#f5f1ed] rounded-2xl p-4 text-center"
            >
              <p className="text-2xl text-[#d4643f] mb-1">{value}</p>
              <p className="text-xs text-[#786f69]">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-6 space-y-6">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h2 className="text-sm text-[#786f69] mb-3 px-2">
              {section.section}
            </h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <button
                    key={itemIndex}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[#f5f1ed] transition-colors border-b border-[#e8e1db] last:border-b-0"
                  >
                    <div className="w-10 h-10 bg-[#f5f1ed] rounded-full flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#d4643f]" />
                    </div>
                    <span className="flex-1 text-left text-sm text-[#2d2520]">
                      {item.label}
                    </span>
                    {"count" in item && item.count && (
                      <span className="text-xs text-[#786f69] bg-[#f5f1ed] px-2 py-1 rounded-full">
                        {item.count}
                      </span>
                    )}
                    {"badge" in item && item.badge === "new" && (
                      <span className="text-xs text-white bg-[#d4643f] px-2 py-1 rounded-full">
                        Nouveau
                      </span>
                    )}
                    <ChevronRight className="w-5 h-5 text-[#786f69]" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <button className="w-full flex items-center justify-center gap-3 bg-white rounded-2xl shadow-sm px-5 py-4 text-[#d4183d] hover:bg-red-50 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Déconnexion</span>
        </button>

        <div className="text-center text-xs text-[#786f69] pt-4">
          <p>Miwa Check-In v1.0.0</p>
          <p className="mt-1">© 2026 Miwa. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
}
