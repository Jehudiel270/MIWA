"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, AlertCircle, Lock } from "lucide-react";
import { FadeContainer, AnimatedItem } from "@/components/ui/motion";

export default function AddPaymentMethodPage() {
  const [paymentType, setPaymentType] = useState<"card" | "mobile" | null>(
    null,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    cardName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });
  const [mobileData, setMobileData] = useState({
    operateur: "",
    phoneNumber: "",
  });

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      // TODO: Call API to add card
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // TODO: Show success and redirect to payment-methods
    } catch (error) {
      console.error("Error adding card:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddMobile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      // TODO: Call API to add mobile money
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // TODO: Show success and redirect to payment-methods
    } catch (error) {
      console.error("Error adding mobile money:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b border-[#e8e1db] flex items-center gap-3">
        <Link href="/payment-methods">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f5f1ed] transition-colors">
            <ChevronLeft className="w-5 h-5 text-[#2d2520]" />
          </button>
        </Link>
        <h1 className="text-xl font-semibold text-[#2d2520]">
          Ajouter un moyen de paiement
        </h1>
      </div>

      <div className="px-5 py-6 space-y-6">
        <FadeContainer stagger>
          {/* Payment Type Selection */}
          {!paymentType && (
            <>
              <AnimatedItem>
                <p className="text-sm text-[#786f69] px-1">
                  Choisissez le type de moyen de paiement
                </p>
              </AnimatedItem>

              <div className="space-y-3">
                <AnimatedItem>
                  <button
                    onClick={() => setPaymentType("card")}
                    className="w-full p-4 bg-white rounded-2xl border-2 border-[#e8e1db] hover:border-[#d4643f] hover:shadow-md transition-all text-left"
                  >
                    <p className="font-semibold text-[#2d2520]">
                      Carte bancaire
                    </p>
                    <p className="text-xs text-[#786f69] mt-1">
                      Visa, Mastercard, etc.
                    </p>
                  </button>
                </AnimatedItem>

                <AnimatedItem>
                  <button
                    onClick={() => setPaymentType("mobile")}
                    className="w-full p-4 bg-white rounded-2xl border-2 border-[#e8e1db] hover:border-[#d4643f] hover:shadow-md transition-all text-left"
                  >
                    <p className="font-semibold text-[#2d2520]">Mobile Money</p>
                    <p className="text-xs text-[#786f69] mt-1">
                      MTN, Moov, Celtiis
                    </p>
                  </button>
                </AnimatedItem>
              </div>
            </>
          )}

          {/* Card Form */}
          {paymentType === "card" && (
            <AnimatedItem>
              <form onSubmit={handleAddCard} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-[#2d2520] mb-2 block">
                    Nom sur la carte
                  </label>
                  <input
                    type="text"
                    value={cardData.cardName}
                    onChange={(e) =>
                      setCardData({ ...cardData, cardName: e.target.value })
                    }
                    placeholder="Koffi Mensah"
                    className="w-full px-4 py-3 border border-[#e8e1db] rounded-xl text-[#2d2520] focus:outline-none focus:ring-2 focus:ring-[#d4643f]/20"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#2d2520] mb-2 block">
                    Numéro de carte
                  </label>
                  <input
                    type="text"
                    value={cardData.cardNumber}
                    onChange={(e) =>
                      setCardData({ ...cardData, cardNumber: e.target.value })
                    }
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    className="w-full px-4 py-3 border border-[#e8e1db] rounded-xl text-[#2d2520] focus:outline-none focus:ring-2 focus:ring-[#d4643f]/20 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-[#2d2520] mb-2 block">
                      Mois
                    </label>
                    <input
                      type="text"
                      value={cardData.expiryMonth}
                      onChange={(e) =>
                        setCardData({
                          ...cardData,
                          expiryMonth: e.target.value,
                        })
                      }
                      placeholder="MM"
                      maxLength={2}
                      className="w-full px-4 py-3 border border-[#e8e1db] rounded-xl text-[#2d2520] focus:outline-none focus:ring-2 focus:ring-[#d4643f]/20"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#2d2520] mb-2 block">
                      Année
                    </label>
                    <input
                      type="text"
                      value={cardData.expiryYear}
                      onChange={(e) =>
                        setCardData({ ...cardData, expiryYear: e.target.value })
                      }
                      placeholder="YY"
                      maxLength={2}
                      className="w-full px-4 py-3 border border-[#e8e1db] rounded-xl text-[#2d2520] focus:outline-none focus:ring-2 focus:ring-[#d4643f]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#2d2520] mb-2 block">
                    Code de sécurité (CVV)
                  </label>
                  <input
                    type="text"
                    value={cardData.cvv}
                    onChange={(e) =>
                      setCardData({ ...cardData, cvv: e.target.value })
                    }
                    placeholder="123"
                    maxLength={3}
                    className="w-full px-4 py-3 border border-[#e8e1db] rounded-xl text-[#2d2520] focus:outline-none focus:ring-2 focus:ring-[#d4643f]/20 font-mono"
                  />
                </div>

                {/* Security Info */}
                <div className="p-3 bg-[#d4643f]/10 rounded-lg border border-[#d4643f]/20 flex items-start gap-2">
                  <Lock className="w-4 h-4 text-[#d4643f] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#2d2520]">
                    Vos données sont sécurisées et chiffrées avec SSL.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setPaymentType(null)}
                    className="flex-1 py-3 border border-[#e8e1db] rounded-xl text-[#2d2520] hover:bg-white transition-colors"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 py-3 bg-[#d4643f] text-white rounded-xl hover:bg-[#c25838] disabled:opacity-50 transition-colors"
                  >
                    {isProcessing ? "Ajout..." : "Ajouter la carte"}
                  </button>
                </div>
              </form>
            </AnimatedItem>
          )}

          {/* Mobile Money Form */}
          {paymentType === "mobile" && (
            <AnimatedItem>
              <form onSubmit={handleAddMobile} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-[#2d2520] mb-2 block">
                    Opérateur
                  </label>
                  <select
                    value={mobileData.operateur}
                    onChange={(e) =>
                      setMobileData({
                        ...mobileData,
                        operateur: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-[#e8e1db] rounded-xl text-[#2d2520] focus:outline-none focus:ring-2 focus:ring-[#d4643f]/20"
                  >
                    <option value="">Sélectionnez un opérateur</option>
                    <option value="mtn">MTN Mobile Money</option>
                    <option value="moov">Moov Money</option>
                    <option value="celtiis">Celtiis Money</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#2d2520] mb-2 block">
                    Numéro de téléphone
                  </label>
                  <input
                    type="tel"
                    value={mobileData.phoneNumber}
                    onChange={(e) =>
                      setMobileData({
                        ...mobileData,
                        phoneNumber: e.target.value,
                      })
                    }
                    placeholder="+229 XX XX XX XX"
                    className="w-full px-4 py-3 border border-[#e8e1db] rounded-xl text-[#2d2520] focus:outline-none focus:ring-2 focus:ring-[#d4643f]/20"
                  />
                </div>

                {/* Info Box */}
                <div className="p-3 bg-[#d4643f]/10 rounded-lg border border-[#d4643f]/20 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-[#d4643f] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#2d2520]">
                    Vous recevrez un code de confirmation sur ce numéro.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setPaymentType(null)}
                    className="flex-1 py-3 border border-[#e8e1db] rounded-xl text-[#2d2520] hover:bg-white transition-colors"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 py-3 bg-[#d4643f] text-white rounded-xl hover:bg-[#c25838] disabled:opacity-50 transition-colors"
                  >
                    {isProcessing ? "Ajout..." : "Continuer"}
                  </button>
                </div>
              </form>
            </AnimatedItem>
          )}
        </FadeContainer>
      </div>
    </div>
  );
}
