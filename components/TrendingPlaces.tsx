import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Star } from "lucide-react";
import { createClient } from "@/lib/supabaseServer";

interface PlaceCardProps {
  image: string;
  name: string;
  category: string;
  rating: number;
  price: string;
}

function PlaceCard({ image, name, category, rating, price }: PlaceCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden shrink-0 w-64">
      <div className="h-40 overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-[#2d2520]">{name}</h4>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-[#d4643f] text-[#d4643f]" />
            <span className="text-sm text-[#2d2520]">{rating.toFixed(1)}</span>
          </div>
        </div>
        <p className="text-sm text-[#786f69] mb-2">{category}</p>
        <p className="text-sm text-[#2d2520]">{price}</p>
      </div>
    </div>
  );
}

export async function TrendingPlaces() {
  const supabase = await createClient();

  const { data: establishments, error: establishmentsError } = await supabase
    .from("establishments")
    .select("id,name,type,city,cover_image_url,average_rating")
    .eq("is_active", true)
    .order("average_rating", { ascending: false })
    .limit(8);

  if (establishmentsError || !establishments) {
    return (
      <div className="pb-6 px-5">
        <h2 className="text-lg text-[#2d2520] mb-4">Tendances à Cotonou</h2>
        <div className="rounded-3xl bg-white p-6 text-[#786f69]">
          Impossible de charger les établissements tendance.
        </div>
      </div>
    );
  }

  const establishmentIds = establishments.map(
    (establishment) => establishment.id,
  );
  const { data: rooms } = await supabase
    .from("rooms")
    .select("establishment_id, price_per_night")
    .in("establishment_id", establishmentIds)
    .order("price_per_night", { ascending: true });

  const minPrices =
    rooms?.reduce<Record<string, number>>((acc, room) => {
      if (!acc[room.establishment_id]) {
        acc[room.establishment_id] = Number(room.price_per_night || 0);
      }
      return acc;
    }, {}) ?? {};

  const places = establishments.slice(0, 3).map((establishment) => ({
    image:
      establishment.cover_image_url ||
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
    name: establishment.name,
    category:
      establishment.type === "hotel"
        ? "Hôtel"
        : establishment.type === "restaurant"
          ? "Restaurant"
          : "Coworking",
    rating: Number(establishment.average_rating ?? 0),
    price: minPrices[establishment.id]
      ? `À partir de ${minPrices[establishment.id].toLocaleString()} FCFA/nuit`
      : "Tarifs disponibles",
  }));

  return (
    <div className="pb-6">
      <div className="px-5 mb-4">
        <h2 className="text-lg text-[#2d2520]">Tendances à Cotonou</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto px-5 pb-2 scrollbar-hide">
        {places.map((place, index) => (
          <PlaceCard key={index} {...place} />
        ))}
      </div>
    </div>
  );
}
