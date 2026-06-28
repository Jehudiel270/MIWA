"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search as SearchIcon,
  SlidersHorizontal,
  MapPin,
  Star,
  Map,
} from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import Link from "next/link";

const filterOptions = [
  { id: "hotels", label: "Hôtels" },
  { id: "restaurants", label: "Restaurants" },
  { id: "coworking", label: "Coworking" },
  { id: "price", label: "Prix" },
  { id: "rating", label: "Note" },
  { id: "nearby", label: "À proximité" },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId],
    );
  };

  const selectedType = useMemo(() => {
    if (activeFilters.includes("hotels")) return "hotel";
    if (activeFilters.includes("restaurants")) return "restaurant";
    if (activeFilters.includes("coworking")) return "coworking";
    return "";
  }, [activeFilters]);

  useEffect(() => {
    const fetchEstablishments = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (selectedType) params.append("type", selectedType);
        if (searchQuery) params.append("search", searchQuery);

        const response = await fetch(
          `/api/establishments?${params.toString()}`,
        );
        const payload = await response.json();

        if (!payload.success) {
          setError(payload.error || "Erreur lors de la recherche");
          setResults([]);
        } else {
          setResults(payload.data || []);
        }
      } catch (fetchError) {
        setError("Impossible de charger les établissements");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEstablishments();
  }, [selectedType, searchQuery]);

  return (
    <div className="pb-6">
      <div className="sticky top-0 z-20 bg-[#f5f1ed] pt-6 pb-4 px-5 border-b border-[#e8e1db]">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#786f69]" />
          <input
            type="text"
            placeholder="Rechercher un hôtel, restaurant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border border-[#e8e1db] text-[#2d2520] placeholder:text-[#786f69] focus:outline-none focus:ring-2 focus:ring-[#d4643f]/20"
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2"
            aria-label="Ouvrir les filtres"
            title="Ouvrir les filtres"
          >
            <SlidersHorizontal className="w-5 h-5 text-[#786f69]" />
          </button>
        </div>
      </div>

      <div className="px-5 py-4 overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {filterOptions.map((filter) => (
            <button
              key={filter.id}
              onClick={() => toggleFilter(filter.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                activeFilters.includes(filter.id)
                  ? "bg-[#d4643f] text-white"
                  : "bg-white text-[#2d2520] border border-[#e8e1db]"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 space-y-4">
        <p className="text-sm text-[#786f69]">
          {loading ? "Chargement..." : `${results.length} résultats trouvés`}
        </p>

        {error && <p className="text-sm text-red-600">{error}</p>}

        {results.length === 0 && !loading && !error && (
          <div className="rounded-3xl bg-white p-6 shadow-sm text-center text-[#786f69]">
            Aucune offre disponible pour ces critères.
          </div>
        )}

        {results.map((item) => (
          <Link key={item.id} href={`/listing/${item.id}`}>
            <div className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <ImageWithFallback
                  src={
                    item.cover_image_url ||
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"
                  }
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg text-[#2d2520] mb-1">{item.name}</h3>
                    <div className="flex items-center gap-1 text-[#786f69] mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">
                        {item.address}, {item.city}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-[#f5f1ed] px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 fill-[#d4643f] text-[#d4643f]" />
                    <span className="text-sm text-[#2d2520]">
                      {item.average_rating?.toFixed(1) ?? "0.0"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#786f69]">
                    {item.total_reviews ?? 0} avis
                  </span>
                  <div className="text-right">
                    <p className="text-sm text-[#786f69]">Type</p>
                    <p className="text-lg text-[#d4643f]">{item.type}</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <button
        className="fixed bottom-24 right-5 w-14 h-14 bg-[#d4643f] text-white rounded-full shadow-xl flex items-center justify-center hover:bg-[#c25838] transition-colors z-10"
        aria-label="Voir la carte"
        title="Voir la carte"
      >
        <Map className="w-6 h-6" />
      </button>
    </div>
  );
}
