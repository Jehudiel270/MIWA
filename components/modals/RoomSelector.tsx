"use client";

import { Modal } from "@/components/ui/motion";
import { Users, Wifi, Wind, Coffee, ParkingSquare, X } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { useState } from "react";

interface Room {
  id: string;
  type: string;
  capacity: number;
  price: number;
  amenities: string[];
  image?: string;
}

interface RoomSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  selectedRoomId?: string;
  onSelectRoom: (roomId: string, room: Room) => void;
}

const amenityIcons: Record<string, typeof Wifi> = {
  wifi: Wifi,
  ac: Wind,
  breakfast: Coffee,
  parking: ParkingSquare,
};

/**
 * RoomSelector - Modal pour sélectionner une chambre
 * Affiche les détails et prix de chaque chambre
 */
export function RoomSelector({
  isOpen,
  onClose,
  rooms,
  selectedRoomId,
  onSelectRoom,
}: RoomSelectorProps) {
  const [tempSelected, setTempSelected] = useState(selectedRoomId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sélectionner une chambre"
      size="lg"
    >
      <div className="space-y-4 max-h-[50vh] overflow-y-auto">
        {rooms.map((room) => {
          const isSelected = tempSelected === room.id;
          return (
            <button
              key={room.id}
              onClick={() => setTempSelected(room.id)}
              className={`w-full rounded-2xl overflow-hidden border-2 transition-all ${
                isSelected ? "border-[#d4643f]" : "border-[#e8e1db]"
              }`}
            >
              <div className="flex gap-3 p-3">
                {/* Image */}
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-[#e8e1db]">
                  <ImageWithFallback
                    src={
                      room.image ||
                      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=200&h=200&fit=crop"
                    }
                    alt={room.type}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-[#2d2520] mb-1">
                    {room.type}
                  </h3>
                  <div className="flex items-center gap-1 text-[#786f69] mb-2">
                    <Users className="w-4 h-4" />
                    <span className="text-xs">{room.capacity} personne(s)</span>
                  </div>

                  {/* Amenities */}
                  <div className="flex gap-1 mb-2">
                    {room.amenities.slice(0, 3).map((amenity) => {
                      const Icon = amenityIcons[amenity.toLowerCase()] || Wifi;
                      return (
                        <Icon
                          key={amenity}
                          className="w-3.5 h-3.5 text-[#d4643f]"
                        />
                      );
                    })}
                    {room.amenities.length > 3 && (
                      <span className="text-xs text-[#786f69]">
                        +{room.amenities.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-semibold text-[#d4643f]">
                      {room.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#786f69]">FCFA/nuit</span>
                  </div>
                </div>

                {/* Selection Indicator */}
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? "bg-[#d4643f] border-[#d4643f]"
                        : "border-[#e8e1db]"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex gap-3 pt-4 mt-4 border-t border-[#e8e1db]">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-3 border border-[#e8e1db] rounded-xl text-[#2d2520] hover:bg-[#f5f1ed] transition-colors"
        >
          Annuler
        </button>
        <button
          onClick={() => {
            if (tempSelected) {
              const room = rooms.find((r) => r.id === tempSelected);
              if (room) onSelectRoom(tempSelected, room);
              onClose();
            }
          }}
          disabled={!tempSelected}
          className="flex-1 px-4 py-3 bg-[#d4643f] text-white rounded-xl hover:bg-[#c25838] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Confirmer
        </button>
      </div>
    </Modal>
  );
}

export default RoomSelector;
