"use client";

import Link from "next/link";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { FadeContainer, AnimatedItem } from "@/components/ui/motion";

export default function TermsPage() {
  const sections = [
    {
      title: "1. Conditions d'utilisation",
      content:
        "En utilisant Miwa, vous acceptez nos conditions d'utilisation et notre politique de confidentialité. Vous êtes responsable du maintien de la confidentialité de votre compte.",
    },
    {
      title: "2. Réservations et annulations",
      content:
        "Tous les tarifs affichés sont en FCFA. Les conditions d'annulation varient selon l'établissement. Veuillez consulter les conditions spécifiques avant de confirmer votre réservation.",
    },
    {
      title: "3. Responsabilité des utilisateurs",
      content:
        "Vous êtes responsable de l'exactitude des informations que vous fournissez. Miwa ne peut pas être tenu responsable des dommages résultant de l'utilisation de la plateforme.",
    },
    {
      title: "4. Propriété intellectuelle",
      content:
        "Tout le contenu de Miwa, y compris les logos, images et textes, est la propriété de Miwa ou de ses partenaires et ne peut pas être reproduit sans permission.",
    },
    {
      title: "5. Frais et paiements",
      content:
        "Les frais de service peuvent s'appliquer à certaines transactions. Vous acceptez de payer tous les frais associés à votre réservation.",
    },
    {
      title: "6. Modifications des conditions",
      content:
        "Miwa se réserve le droit de modifier ces conditions à tout moment. Les modifications seront communiquées par email.",
    },
  ];

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b border-[#e8e1db] flex items-center gap-3">
        <Link href="/">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f5f1ed] transition-colors">
            <ChevronLeft className="w-5 h-5 text-[#2d2520]" />
          </button>
        </Link>
        <h1 className="text-xl font-semibold text-[#2d2520]">
          Conditions d'utilisation
        </h1>
      </div>

      <div className="px-5 py-6 space-y-6">
        <FadeContainer stagger>
          {/* Last Updated */}
          <AnimatedItem>
            <p className="text-xs text-[#786f69] px-1">
              Dernière mise à jour: 15 décembre 2024
            </p>
          </AnimatedItem>

          {/* Sections */}
          {sections.map((section, index) => (
            <AnimatedItem key={index}>
              <div className="bg-white rounded-2xl p-4 border border-[#e8e1db]">
                <h2 className="text-sm font-semibold text-[#2d2520] mb-2">
                  {section.title}
                </h2>
                <p className="text-xs text-[#786f69] leading-relaxed">
                  {section.content}
                </p>
              </div>
            </AnimatedItem>
          ))}

          {/* Contact Section */}
          <AnimatedItem>
            <div className="bg-gradient-to-br from-[#d4643f] to-[#c25838] rounded-3xl p-6 text-white">
              <h3 className="font-semibold mb-2">Des questions?</h3>
              <p className="text-sm text-white/80 mb-4">
                Si vous avez des questions concernant nos conditions, veuillez
                nous contacter.
              </p>
              <button className="flex items-center gap-2 text-sm font-semibold hover:underline">
                support@miwa.com
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </AnimatedItem>
        </FadeContainer>
      </div>
    </div>
  );
}
