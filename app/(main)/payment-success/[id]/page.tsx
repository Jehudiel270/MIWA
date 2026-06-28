"use client";

import Link from "next/link";
import { CheckCircle, Download, Home, RotateCcw } from "lucide-react";
import QRCode from "react-qr-code";
import { useRef } from "react";
import { FadeContainer } from "@/components/ui/motion";

export default function PaymentSuccessPage({
  params,
}: {
  params: { id: string };
}) {
  const transactionId =
    params.id || "TXN" + Math.random().toString(36).substr(2, 9).toUpperCase();
  const qrRef = useRef<HTMLDivElement | null>(null);

  const handleDownload = () => {
    try {
      const svg = qrRef.current?.querySelector("svg");
      if (!svg) return;

      const serializer = new XMLSerializer();
      const source = serializer.serializeToString(svg);
      const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${transactionId}-qr.svg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("download QR error", err);
    }
  };

  const qrValue = JSON.stringify({
    transactionId,
    type: "booking",
    timestamp: Date.now(),
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#10b981]/10 to-[#f5f1ed] pb-24">
      <div className="flex-1 flex flex-col justify-center px-5 py-12 min-h-screen">
        <FadeContainer>
          <div className="w-20 h-20 bg-[#10b981]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#10b981]" />
          </div>

          <h1 className="text-3xl font-bold text-[#2d2520] text-center mb-2">
            Paiement réussi!
          </h1>
          <p className="text-sm text-[#786f69] text-center mb-8">
            Votre réservation a été confirmée. Un email de confirmation a été
            envoyé.
          </p>

          <div className="bg-white rounded-3xl shadow-md p-6 mb-6 space-y-4">
            <div>
              <p className="text-xs text-[#786f69] mb-1">ID de transaction</p>
              <p className="text-sm font-mono text-[#2d2520]">
                {transactionId}
              </p>
            </div>
            <div className="border-t border-[#e8e1db] pt-4">
              <p className="text-xs text-[#786f69] mb-1">Montant payé</p>
              <p className="text-2xl font-bold text-[#d4643f]">53 750 FCFA</p>
            </div>
            <div className="border-t border-[#e8e1db] pt-4">
              <p className="text-xs text-[#786f69] mb-1">
                Solde à payer à l'arrivée
              </p>
              <p className="text-lg font-semibold text-[#2d2520]">
                53 750 FCFA
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 mb-8 text-center">
            <div ref={qrRef} className="inline-block bg-white p-4 rounded-md">
              <QRCode value={qrValue} size={128} />
            </div>
            <p className="text-xs text-[#786f69] mt-3">
              Présentez ce QR Code à la réception
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/bookings">
              <button className="w-full py-4 bg-[#d4643f] text-white rounded-2xl font-semibold hover:bg-[#c25838] transition-colors flex items-center justify-center gap-2">
                <Home className="w-5 h-5" />
                Voir mes réservations
              </button>
            </Link>
            <Link href="/">
              <button className="w-full py-4 border border-[#e8e1db] rounded-2xl text-[#2d2520] hover:bg-white transition-colors flex items-center justify-center gap-2">
                <RotateCcw className="w-5 h-5" />
                Retour à l'accueil
              </button>
            </Link>
            <button
              onClick={handleDownload}
              className="w-full py-4 border border-[#e8e1db] rounded-2xl text-[#2d2520] hover:bg-white transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Télécharger le QR
            </button>
          </div>
        </FadeContainer>
      </div>
    </div>
  );
}
