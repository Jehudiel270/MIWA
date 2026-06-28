"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import {
  Star,
  MapPin,
  Wifi,
  Wind,
  Coffee,
  ParkingSquare,
  ChevronLeft,
  ChevronRight,
  Shield,
  Map,
} from "lucide-react";
import { BackButton } from "@/components/BackButton";

export default function ListingDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const [hotelData, setHotelData] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEstablishment = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/establishments/${params.slug}`);
        const payload = await response.json();
        if (!payload.success) {
          setError(payload.error || "Établissement introuvable");
        } else {
          setHotelData(payload.data);
        }
      } catch (fetchError) {
        setError("Impossible de charger l’établissement");
      } finally {
        setLoading(false);
      }
    };

    fetchEstablishment();
  }, [params.slug]);

  const nextImage = () => {
    if (!hotelData?.images?.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % hotelData.images.length);
  };

  const prevImage = () => {
    if (!hotelData?.images?.length) return;
    setCurrentImageIndex(
      (prev) => (prev - 1 + hotelData.images.length) % hotelData.images.length,
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f1ed] text-[#2d2520]">
        Chargement de l’établissement...
      </div>
    );
  }

  if (error || !hotelData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f1ed] text-[#d4643f] px-5 text-center">
        <div>
          <p className="text-lg font-semibold">
            {error || "Aucun établissement trouvé"}
          </p>
          <Link
            href="/search"
            className="mt-4 inline-flex rounded-full bg-[#d4643f] px-6 py-3 text-white"
          >
            Retour à la recherche
          </Link>
        </div>
      </div>
    );
  }

  const images = hotelData.cover_image_url
    ? [hotelData.cover_image_url]
    : [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop",
      ];

  const rating = Number(hotelData.average_rating ?? 0).toFixed(1);
  const reviewCount = hotelData.total_reviews ?? 0;
  const price = hotelData.rooms?.[0]?.price_per_night ?? 0;

  return (
    <div className="pb-24">
      <div className="relative h-80 overflow-hidden bg-[#2d2520]">
        <ImageWithFallback
          src={images[currentImageIndex]}
          alt={hotelData.name}
          className="w-full h-full object-cover"
        />
        <BackButton className="absolute left-4 top-4 z-10" />
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          aria-label="Image précédente"
          title="Image précédente"
        >
          <ChevronLeft className="w-5 h-5 text-[#2d2520]" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          aria-label="Image suivante"
          title="Image suivante"
        >
          <ChevronRight className="w-5 h-5 text-[#2d2520]" />
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImageIndex ? "bg-white w-6" : "bg-white/50"
              }`}
              aria-label={`Voir l’image ${index + 1}`}
              title={`Voir l’image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="px-5 py-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl text-[#2d2520]">{hotelData.name}</h1>
              {hotelData.is_verified && (
                <Shield className="w-5 h-5 text-[#10b981]" />
              )}
            </div>
            <div className="flex items-center gap-1 text-[#786f69] mb-3">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                {hotelData.address}, {hotelData.city}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-[#f5f1ed] px-3 py-2 rounded-xl">
            <Star className="w-5 h-5 fill-[#d4643f] text-[#d4643f]" />
            <span className="text-lg text-[#2d2520]">{rating}</span>
            <span className="text-sm text-[#786f69]">({reviewCount})</span>
          </div>
        </div>

        <div className="bg-[#d4643f]/10 rounded-2xl p-4 mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl text-[#d4643f]">
              {Number(price).toLocaleString()}
            </span>
            <span className="text-sm text-[#786f69]">FCFA / nuit</span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg text-[#2d2520] mb-4">Équipements</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Wifi, label: "WiFi gratuit" },
              { icon: Wind, label: "Climatisation" },
              { icon: Coffee, label: "Petit-déjeuner" },
              { icon: ParkingSquare, label: "Parking gratuit" },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm"
                >
                  <Icon className="w-5 h-5 text-[#d4643f]" />
                  <span className="text-sm text-[#2d2520]">
                    {feature.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg text-[#2d2520] mb-3">Description</h2>
          <p className="text-sm text-[#786f69] leading-relaxed">
            {hotelData.description}
          </p>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-6">
          <div className="h-48 bg-[#e8e1db] flex items-center justify-center">
            <Map className="w-12 h-12 text-[#786f69]" />
          </div>
          <div className="p-4">
            <p className="text-sm text-[#2d2520]">Voir sur la carte</p>
            <p className="text-xs text-[#786f69]">{hotelData.city}</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e8e1db] px-5 py-4 shadow-lg">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div>
            <p className="text-sm text-[#786f69]">Prix à partir de</p>
            <p className="text-xl text-[#2d2520]">
              {Number(price).toLocaleString()} FCFA
            </p>
          </div>
          <Link href={`/checkout/${params.slug}`}>
            <button className="px-8 py-4 bg-[#d4643f] text-white rounded-2xl shadow-md hover:bg-[#c25838] transition-colors">
              Réserver
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
