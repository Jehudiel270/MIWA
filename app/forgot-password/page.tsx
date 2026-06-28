"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, CheckCircle } from "lucide-react";
import { FadeContainer } from "@/components/ui/motion";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Veuillez entrer votre email");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || "Erreur lors de l'envoi");
      } else {
        toast.success("Email de réinitialisation envoyé");
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur réseau");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f1ed] pb-24">
      <div className="flex-1 flex flex-col justify-center px-5 py-12 min-h-screen">
        <FadeContainer>
          {!isSubmitted ? (
            <>
              <div className="w-20 h-20 bg-[#d4643f]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-10 h-10 text-[#d4643f]" />
              </div>

              <h1 className="text-2xl font-bold text-[#2d2520] text-center mb-2">
                Réinitialiser le mot de passe
              </h1>
              <p className="text-sm text-[#786f69] text-center mb-8">
                Entrez votre adresse email et nous vous enverrons un lien pour
                réinitialiser votre mot de passe.
              </p>

              <form onSubmit={handleSubmit} className="max-w-md mx-auto w-full">
                <div className="bg-white rounded-2xl p-4 mb-4">
                  <label className="text-sm font-semibold text-[#2d2520] block mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-[#e8e1db] rounded-xl"
                    placeholder="votre@email.com"
                  />
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-[#d4643f] text-white rounded-2xl font-semibold disabled:opacity-50"
                  >
                    {isLoading ? "Envoi..." : "Envoyer le lien"}
                  </button>
                  <Link href="/login">
                    <button
                      type="button"
                      className="w-full py-4 border border-[#e8e1db] rounded-2xl text-[#2d2520]"
                    >
                      Retour à la connexion
                    </button>
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-[#2d2520] mb-2">
                Email envoyé
              </h1>
              <p className="text-sm text-[#786f69] mb-8">
                Vérifiez votre boîte de réception pour le lien de
                réinitialisation.
              </p>
              <Link href="/login">
                <button className="w-full py-4 bg-[#d4643f] text-white rounded-2xl font-semibold">
                  Retour à la connexion
                </button>
              </Link>
            </div>
          )}
        </FadeContainer>
      </div>
    </div>
  );
}
