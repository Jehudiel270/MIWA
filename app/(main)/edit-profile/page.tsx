"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, User, Mail, Phone, Camera } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { FadeContainer, AnimatedItem } from "@/components/ui/motion";

export default function EditProfilePage() {
  const [fullName, setFullName] = useState("Koffi Mensah");
  const [email, setEmail] = useState("koffi.mensah@email.com");
  const [phone, setPhone] = useState("+229 97 12 34 56");
  const [city, setCity] = useState("Cotonou");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");

    try {
      // TODO: Call update profile API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccessMessage("Profil mis à jour avec succès!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b border-[#e8e1db]">
        <div className="flex items-center gap-3">
          <Link href="/profile">
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f5f1ed] transition-colors">
              <ChevronLeft className="w-5 h-5 text-[#2d2520]" />
            </button>
          </Link>
          <h1 className="text-xl font-semibold text-[#2d2520]">
            Modifier le profil
          </h1>
        </div>
      </div>

      <div className="px-5 py-6 space-y-6">
        <FadeContainer stagger>
          {/* Profile Picture */}
          <AnimatedItem>
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24 mb-4">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full border-4 border-[#d4643f]"
                />
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#d4643f] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#c25838] transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-[#786f69]">
                Cliquez pour changer votre photo
              </p>
            </div>
          </AnimatedItem>

          {/* Success Message */}
          {successMessage && (
            <AnimatedItem>
              <div className="p-4 bg-[#10b981]/10 border border-[#10b981]/20 rounded-2xl">
                <p className="text-sm text-[#10b981]">{successMessage}</p>
              </div>
            </AnimatedItem>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <AnimatedItem>
              <div>
                <label className="text-sm font-semibold text-[#2d2520] mb-2 block flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nom complet
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-[#e8e1db] rounded-xl text-[#2d2520] focus:outline-none focus:ring-2 focus:ring-[#d4643f]/20"
                />
              </div>
            </AnimatedItem>

            {/* Email */}
            <AnimatedItem>
              <div>
                <label className="text-sm font-semibold text-[#2d2520] mb-2 block flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Adresse email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-[#e8e1db] rounded-xl text-[#2d2520] focus:outline-none focus:ring-2 focus:ring-[#d4643f]/20"
                />
                <p className="text-xs text-[#786f69] mt-1">
                  Vérifiée •{" "}
                  <button
                    type="button"
                    className="text-[#d4643f] hover:underline"
                  >
                    Changer
                  </button>
                </p>
              </div>
            </AnimatedItem>

            {/* Phone */}
            <AnimatedItem>
              <div>
                <label className="text-sm font-semibold text-[#2d2520] mb-2 block flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Numéro de téléphone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-[#e8e1db] rounded-xl text-[#2d2520] focus:outline-none focus:ring-2 focus:ring-[#d4643f]/20"
                />
              </div>
            </AnimatedItem>

            {/* City */}
            <AnimatedItem>
              <div>
                <label className="text-sm font-semibold text-[#2d2520] mb-2 block">
                  Ville
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 border border-[#e8e1db] rounded-xl text-[#2d2520] focus:outline-none focus:ring-2 focus:ring-[#d4643f]/20"
                >
                  <option>Cotonou</option>
                  <option>Porto-Novo</option>
                  <option>Parakou</option>
                  <option>Natitingou</option>
                </select>
              </div>
            </AnimatedItem>

            {/* Submit Button */}
            <AnimatedItem>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 mt-6 bg-[#d4643f] text-white rounded-2xl font-semibold hover:bg-[#c25838] disabled:opacity-50 transition-colors"
              >
                {isLoading ? "Mise à jour..." : "Enregistrer les modifications"}
              </button>
            </AnimatedItem>
          </form>
        </FadeContainer>
      </div>
    </div>
  );
}
