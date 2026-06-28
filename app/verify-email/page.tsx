"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, CheckCircle } from "lucide-react";
import { FadeContainer } from "@/components/ui/motion";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCount, setResendCount] = useState(0);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || code.trim().length !== 6) {
      toast.error("Email et code à 6 chiffres requis");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || "Code invalide");
      } else {
        toast.success("Email vérifié");
        setIsVerified(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur réseau");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCount >= 3) {
      toast.error("Limite de renvoi atteinte");
      return;
    }
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data?.error || "Erreur lors du renvoi");
        return;
      }
      setResendCount((c) => c + 1);
      toast.success("Code renvoyé");
    } catch (err) {
      console.error(err);
      toast.error("Erreur réseau");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f1ed] pb-24">
      <div className="flex-1 flex flex-col justify-center px-5 py-12 min-h-screen">
        <FadeContainer>
          {!isVerified ? (
            <>
              <div className="w-20 h-20 bg-[#d4643f]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-10 h-10 text-[#d4643f]" />
              </div>

              <h1 className="text-2xl font-bold text-[#2d2520] text-center mb-2">
                Vérification de l'email
              </h1>
              <p className="text-sm text-[#786f69] text-center mb-8">
                Entrez le code à 6 chiffres envoyé à votre adresse email.
              </p>

              <form
                onSubmit={handleVerify}
                className="max-w-md mx-auto w-full space-y-4"
              >
                <div className="bg-white rounded-2xl p-4">
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

                <div className="bg-white rounded-2xl p-4">
                  <label className="text-sm font-semibold text-[#2d2520] block mb-2">
                    Code (6 chiffres)
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={6}
                    className="w-full px-4 py-3 border border-[#e8e1db] rounded-xl font-mono text-center tracking-widest"
                  />
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-[#d4643f] text-white rounded-2xl font-semibold disabled:opacity-50"
                  >
                    {isLoading ? "Vérification..." : "Vérifier"}
                  </button>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resendCount >= 3}
                      className="flex-1 py-4 border border-[#e8e1db] rounded-2xl text-[#2d2520] disabled:opacity-50"
                    >
                      Renvoi ({resendCount}/3)
                    </button>
                    <Link href="/login" className="flex-1">
                      <button
                        type="button"
                        className="w-full py-4 border border-[#e8e1db] rounded-2xl text-[#2d2520]"
                      >
                        Retour
                      </button>
                    </Link>
                  </div>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-[#2d2520] mb-2">
                Email vérifié !
              </h1>
              <p className="text-sm text-[#786f69] mb-8">
                Votre compte est maintenant activé. Bienvenue sur Miwa !
              </p>

              <Link href="/">
                <button className="w-full py-4 bg-[#d4643f] text-white rounded-2xl font-semibold">
                  Commencer à explorer
                </button>
              </Link>
            </div>
          )}
        </FadeContainer>
      </div>
    </div>
  );
}
