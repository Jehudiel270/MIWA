"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Plus,
  CreditCard,
  Smartphone,
  Trash2,
} from "lucide-react";
import { FadeContainer, AnimatedItem } from "@/components/ui/motion";
import { ConfirmationDialog } from "@/components/modals";

interface PaymentMethod {
  id: string;
  type: "card" | "mobile";
  label: string;
  details: string;
  isDefault: boolean;
}

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "card",
      label: "Carte Visa",
      details: "•••• •••• •••• 4242",
      isDefault: true,
    },
    {
      id: "2",
      type: "mobile",
      label: "MTN Mobile Money",
      details: "+229 97 12 34 56",
      isDefault: false,
    },
  ]);

  const [removeConfirm, setRemoveConfirm] = useState<string | null>(null);

  const handleRemoveMethod = (id: string) => {
    setMethods(methods.filter((method) => method.id !== id));
    setRemoveConfirm(null);
  };

  const handleSetDefault = (id: string) => {
    setMethods(
      methods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    );
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b border-[#e8e1db] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/profile">
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f5f1ed] transition-colors">
              <ChevronLeft className="w-5 h-5 text-[#2d2520]" />
            </button>
          </Link>
          <h1 className="text-xl font-semibold text-[#2d2520]">
            Moyens de paiement
          </h1>
        </div>
        <Link href="/payment-methods/add">
          <button className="w-10 h-10 bg-[#d4643f] text-white rounded-full flex items-center justify-center hover:bg-[#c25838] transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </Link>
      </div>

      <div className="px-5 py-6 space-y-4">
        {methods.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-[#e8e1db] mx-auto mb-4" />
            <p className="text-[#786f69] mb-4">
              Aucun moyen de paiement enregistré
            </p>
            <Link href="/payment-methods/add">
              <button className="px-6 py-3 bg-[#d4643f] text-white rounded-2xl hover:bg-[#c25838] transition-colors">
                Ajouter un moyen de paiement
              </button>
            </Link>
          </div>
        ) : (
          <FadeContainer stagger>
            {methods.map((method) => {
              const Icon = method.type === "card" ? CreditCard : Smartphone;
              return (
                <AnimatedItem key={method.id}>
                  <div className="bg-white rounded-2xl p-4 border-2 border-[#e8e1db] hover:border-[#d4643f] transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#f5f1ed] rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-[#d4643f]" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-[#2d2520]">
                            {method.label}
                          </h3>
                          {method.isDefault && (
                            <span className="text-xs bg-[#d4643f] text-white px-2 py-0.5 rounded-full">
                              Par défaut
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#786f69]">
                          {method.details}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {!method.isDefault && (
                          <button
                            onClick={() => handleSetDefault(method.id)}
                            className="text-xs text-[#d4643f] hover:underline"
                          >
                            Définir par défaut
                          </button>
                        )}
                        <button
                          onClick={() => setRemoveConfirm(method.id)}
                          className="w-8 h-8 text-[#d4183d] hover:bg-[#d4183d]/10 rounded-full flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </AnimatedItem>
              );
            })}
          </FadeContainer>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={removeConfirm !== null}
        onClose={() => setRemoveConfirm(null)}
        type="warning"
        title="Supprimer ce moyen de paiement?"
        message="Vous ne pourrez plus utiliser ce moyen de paiement."
        confirmText="Supprimer"
        cancelText="Annuler"
        isDangerous={true}
        onConfirm={() => {
          if (removeConfirm) handleRemoveMethod(removeConfirm);
        }}
      />
    </div>
  );
}
