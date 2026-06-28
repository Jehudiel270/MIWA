"use client";

import { BottomSheet } from "@/components/ui/motion";
import { CreditCard, Smartphone, Wallet, Check } from "lucide-react";
import { useState } from "react";

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className: string }>;
  isAvailable?: boolean;
}

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  methods: PaymentMethod[];
  selectedMethodId?: string;
  onSelectMethod: (methodId: string, method: PaymentMethod) => void;
  amount: number;
}

const defaultMethods: PaymentMethod[] = [
  {
    id: "mobile_money",
    name: "Mobile Money",
    description: "MTN, Moov, Celtiis",
    icon: Smartphone,
    isAvailable: true,
  },
  {
    id: "card",
    name: "Carte bancaire",
    description: "Visa, Mastercard",
    icon: CreditCard,
    isAvailable: true,
  },
  {
    id: "wallet",
    name: "Portefeuille",
    description: "Solde disponible",
    icon: Wallet,
    isAvailable: true,
  },
];

/**
 * PaymentMethodModal - BottomSheet pour sélectionner le mode de paiement
 * Réutilisable avec différentes méthodes
 */
export function PaymentMethodModal({
  isOpen,
  onClose,
  methods = defaultMethods,
  selectedMethodId,
  onSelectMethod,
  amount,
}: PaymentMethodModalProps) {
  const [tempSelected, setTempSelected] = useState(selectedMethodId);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Mode de paiement"
      maxHeight="70vh"
    >
      <div className="px-5 py-6 space-y-3">
        {methods.map((method) => {
          const Icon = method.icon;
          const isSelected = tempSelected === method.id;
          const isDisabled = method.isAvailable === false;

          return (
            <button
              key={method.id}
              onClick={() => !isDisabled && setTempSelected(method.id)}
              disabled={isDisabled}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                isSelected
                  ? "border-[#d4643f] bg-[#d4643f]/5"
                  : "border-[#e8e1db] bg-white"
              } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isSelected ? "bg-[#d4643f]" : "bg-[#f5f1ed]"
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${
                    isSelected ? "text-white" : "text-[#786f69]"
                  }`}
                />
              </div>

              {/* Details */}
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-[#2d2520]">
                  {method.name}
                </p>
                <p className="text-xs text-[#786f69]">{method.description}</p>
              </div>

              {/* Check */}
              {isSelected && (
                <Check className="w-5 h-5 text-[#d4643f] flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Info Section */}
      <div className="mx-5 my-4 p-4 bg-[#d4643f]/10 rounded-2xl border border-[#d4643f]/20">
        <p className="text-xs text-[#786f69] mb-1">Montant à payer</p>
        <p className="text-lg font-semibold text-[#2d2520]">
          {amount.toLocaleString()} FCFA
        </p>
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
            if (tempSelected) {
              const method = methods.find((m) => m.id === tempSelected);
              if (method) onSelectMethod(tempSelected, method);
              onClose();
            }
          }}
          disabled={!tempSelected}
          className="flex-1 px-4 py-3 bg-[#d4643f] text-white rounded-xl hover:bg-[#c25838] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Continuer
        </button>
      </div>
    </BottomSheet>
  );
}

export default PaymentMethodModal;
