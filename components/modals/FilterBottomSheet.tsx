"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/ui/motion";
import { SlidersHorizontal, Check } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
}

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOption[];
  activeFilters: string[];
  onFilterChange: (filterId: string) => void;
  onApply: () => void;
  priceRange?: [number, number];
  onPriceChange?: (range: [number, number]) => void;
}

/**
 * FilterBottomSheet - Modales de filtres pour la page de recherche
 * Réutilisable avec différents filtres
 */
export function FilterBottomSheet({
  isOpen,
  onClose,
  filters,
  activeFilters,
  onFilterChange,
  onApply,
  priceRange = [0, 200000],
  onPriceChange,
}: FilterBottomSheetProps) {
  const [localPrice, setLocalPrice] = useState(priceRange);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Filtrer les résultats"
      maxHeight="80vh"
    >
      <div className="px-5 py-6 space-y-6">
        {/* Filter Options */}
        <div>
          <h3 className="text-sm font-semibold text-[#2d2520] mb-3">
            Catégories
          </h3>
          <div className="space-y-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => onFilterChange(filter.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#f5f1ed] transition-colors"
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    activeFilters.includes(filter.id)
                      ? "bg-[#d4643f] border-[#d4643f]"
                      : "border-[#e8e1db]"
                  }`}
                >
                  {activeFilters.includes(filter.id) && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-sm text-[#2d2520]">{filter.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        {onPriceChange && (
          <div>
            <h3 className="text-sm font-semibold text-[#2d2520] mb-3">
              Gamme de prix
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={localPrice[0]}
                  onChange={(e) =>
                    setLocalPrice([Number(e.target.value), localPrice[1]])
                  }
                  className="flex-1 px-3 py-2 border border-[#e8e1db] rounded-lg text-sm"
                  placeholder="Min"
                />
                <span className="text-[#786f69]">à</span>
                <input
                  type="number"
                  value={localPrice[1]}
                  onChange={(e) =>
                    setLocalPrice([localPrice[0], Number(e.target.value)])
                  }
                  className="flex-1 px-3 py-2 border border-[#e8e1db] rounded-lg text-sm"
                  placeholder="Max"
                />
              </div>
              <p className="text-xs text-[#786f69]">
                {localPrice[0].toLocaleString()} -{" "}
                {localPrice[1].toLocaleString()} FCFA
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex gap-3 px-5 py-4 border-t border-[#e8e1db]">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-3 border border-[#e8e1db] rounded-xl text-[#2d2520] hover:bg-[#f5f1ed] transition-colors"
        >
          Annuler
        </button>
        <button
          onClick={() => {
            if (onPriceChange) onPriceChange(localPrice);
            onApply();
            onClose();
          }}
          className="flex-1 px-4 py-3 bg-[#d4643f] text-white rounded-xl hover:bg-[#c25838] transition-colors"
        >
          Appliquer
        </button>
      </div>
    </BottomSheet>
  );
}

export default FilterBottomSheet;
