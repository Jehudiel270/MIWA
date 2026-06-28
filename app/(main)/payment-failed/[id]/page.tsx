"use client";

import Link from "next/link";
import { AlertCircle, ChevronLeft, RotateCcw, Phone } from "lucide-react";
import { FadeContainer } from "@/components/ui/motion";

export default function PaymentFailedPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#d4183d]/10 to-[#f5f1ed] pb-24">
      <div className="flex-1 flex flex-col justify-center px-5 py-12 min-h-screen">
        <FadeContainer>
          {/* Error Icon */}
          <div className="w-20 h-20 bg-[#d4183d]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-[#d4183d]" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-[#2d2520] text-center mb-2">
            Paiement échoué
          </h1>
          <p className="text-sm text-[#786f69] text-center mb-8">
            Une erreur s'est produite lors du traitement de votre paiement.
            Veuillez réessayer.
          </p>

          {/* Error Details */}
          <div className="bg-white rounded-3xl shadow-md p-6 mb-8">
            <div className="space-y-3 mb-4">
              <div>
                <p className="text-xs text-[#786f69] mb-1">
                  Raison de l'erreur
                </p>
                <p className="text-sm font-semibold text-[#d4183d]">
                  Fonds insuffisants
                </p>
              </div>
              <div>
                <p className="text-xs text-[#786f69] mb-1">Code d'erreur</p>
                <p className="text-xs font-mono text-[#786f69]">
                  ERR_INSUFFICIENT_FUNDS
                </p>
              </div>
            </div>

            <div className="bg-[#d4183d]/10 rounded-xl p-3 border border-[#d4183d]/20">
              <p className="text-xs text-[#d4183d]">
                Si cette erreur persiste, veuillez contacter le support client
                ou réessayer avec un autre moyen de paiement.
              </p>
            </div>
          </div>

          {/* Suggested Actions */}
          <div className="bg-[#f5f1ed] rounded-2xl p-4 mb-8">
            <h3 className="text-sm font-semibold text-[#2d2520] mb-3">
              Que pouvez-vous faire?
            </h3>
            <ul className="text-xs text-[#786f69] space-y-2">
              <li>• Vérifiez votre solde de compte</li>
              <li>• Essayez avec un autre moyen de paiement</li>
              <li>• Contactez votre opérateur télécom (pour Mobile Money)</li>
              <li>• Attendez quelques minutes avant de réessayer</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link href="/checkout/1">
              <button className="w-full py-4 bg-[#d4643f] text-white rounded-2xl font-semibold hover:bg-[#c25838] transition-colors flex items-center justify-center gap-2">
                <RotateCcw className="w-5 h-5" />
                Réessayer le paiement
              </button>
            </Link>
            <button className="w-full py-4 border border-[#e8e1db] rounded-2xl text-[#2d2520] hover:bg-white transition-colors flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" />
              Contacter le support
            </button>
            <Link href="/">
              <button className="w-full py-4 border border-[#e8e1db] rounded-2xl text-[#2d2520] hover:bg-white transition-colors flex items-center justify-center gap-2">
                <ChevronLeft className="w-5 h-5" />
                Retour à l'accueil
              </button>
            </Link>
          </div>
        </FadeContainer>
      </div>
    </div>
  );
}
