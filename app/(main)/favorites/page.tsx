"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, MapPin, Star } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { FadeContainer, AnimatedItem } from "@/components/ui/motion";
import { ConfirmationDialog } from "@/components/modals";

interface FavoriteItem {
  id: string;
  establishment: {
    id: string;
    name: string;
    city: string;
    type: string;
    average_rating: number | null;
    total_reviews: number | null;
    cover_image_url?: string;
    min_price?: number | null;
  };
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [removeConfirm, setRemoveConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/favorites");
        const payload = await response.json();

        if (!payload.success) {
          setError(payload.error || "Impossible de charger les favoris");
          setFavorites([]);
        } else {
          setFavorites(payload.data ?? []);
        }
      } catch (err) {
        setError("Erreur lors du chargement des favoris");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (id: string) => {
    try {
      const response = await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const payload = await response.json();

      if (!payload.success) {
        setError(payload.error || "Impossible de supprimer le favori");
        return;
      }

      setFavorites((current) => current.filter((fav) => fav.id !== id));
      setRemoveConfirm(null);
    } catch (err) {
      setError("Erreur lors de la suppression du favori");
    }
  };

  return (
    <div className="pb-24">
      <div className="bg-white px-5 py-6 border-b border-[#e8e1db]">
        <h1 className="text-2xl font-semibold text-[#2d2520]">Mes favoris</h1>
        <p className="text-sm text-[#786f69]">
          {favorites.length} établissement{favorites.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="px-5 py-6 space-y-4">
        {loading ? (
          <div className="rounded-3xl bg-white p-6 text-center text-[#786f69] shadow-sm">
            Chargement des favoris...
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-white p-6 text-center text-red-600 shadow-sm">
            {error}
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-[#e8e1db] mx-auto mb-4" />
            <p className="text-[#786f69] mb-4">Aucun favori pour le moment</p>
            <Link href="/search">
              <button className="px-6 py-3 bg-[#d4643f] text-white rounded-2xl hover:bg-[#c25838] transition-colors">
                Découvrir des établissements
              </button>
            </Link>
          </div>
        ) : (
          <FadeContainer stagger className="space-y-4">
            {favorites.map((favorite) => (
              <AnimatedItem key={favorite.id}>
                <Link href={`/listing/${favorite.establishment.id}`}>
                  <div className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                    <div className="relative h-40">
                      <ImageWithFallback
                        src={
                          favorite.establishment.cover_image_url ??
                          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"
                        }
                        alt={favorite.establishment.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setRemoveConfirm(favorite.id);
                        }}
                        className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                        aria-label="Retirer des favoris"
                        title="Retirer des favoris"
                      >
                        <Heart className="w-5 h-5 text-[#d4643f] fill-current" />
                      </button>

                      <div className="absolute bottom-3 left-3 px-3 py-1 bg-white rounded-full text-xs font-semibold text-[#2d2520]">
                        {favorite.establishment.type}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-[#2d2520] mb-1">
                            {favorite.establishment.name}
                          </h3>
                          <div className="flex items-center gap-1 text-[#786f69] mb-2">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">
                              {favorite.establishment.city}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-[#f5f1ed] px-2 py-1 rounded-lg">
                          <Star className="w-4 h-4 fill-[#d4643f] text-[#d4643f]" />
                          <span className="text-sm text-[#2d2520]">
                            {favorite.establishment.average_rating?.toFixed(
                              1,
                            ) ?? "0.0"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-[#786f69]">
                        <span>
                          {favorite.establishment.total_reviews ?? 0} avis
                        </span>
                        {favorite.establishment.min_price ? (
                          <span className="text-[#d4643f] font-semibold">
                            À partir de{" "}
                            {favorite.establishment.min_price.toLocaleString()}{" "}
                            FCFA
                          </span>
                        ) : (
                          <span className="text-[#786f69]">
                            Tarifs disponibles
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedItem>
            ))}
          </FadeContainer>
        )}
      </div>

      <ConfirmationDialog
        isOpen={removeConfirm !== null}
        onClose={() => setRemoveConfirm(null)}
        type="warning"
        title="Supprimer de mes favoris?"
        message="Vous pouvez retrouver cet établissement à tout moment dans la recherche."
        confirmText="Supprimer"
        cancelText="Garder"
        isDangerous={true}
        onConfirm={() => {
          if (removeConfirm) handleRemoveFavorite(removeConfirm);
        }}
      />
    </div>
  );
}
