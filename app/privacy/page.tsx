"use client";

import Link from "next/link";
import { ChevronLeft, ExternalLink, Shield, Lock, Eye } from "lucide-react";
import { FadeContainer, AnimatedItem } from "@/components/ui/motion";

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Données que nous collectons",
      content:
        "Nous collectons des informations personnelles comme votre nom, email, numéro de téléphone et adresse pour traiter votre réservation et améliorer nos services.",
      icon: Eye,
    },
    {
      title: "2. Comment nous utilisons vos données",
      content:
        "Vos données sont utilisées uniquement pour traiter votre réservation, vous envoyer des confirmations et améliorer votre expérience utilisateur.",
      icon: Shield,
    },
    {
      title: "3. Sécurité de vos données",
      content:
        "Nous utilisons le chiffrement SSL et des mesures de sécurité avancées pour protéger vos données personnelles contre l'accès non autorisé.",
      icon: Lock,
    },
    {
      title: "4. Partage de données",
      content:
        "Nous ne partageons jamais vos données personnelles avec des tiers sans votre consentement, sauf si cela est requis par la loi.",
    },
    {
      title: "5. Vos droits",
      content:
        "Vous avez le droit d'accéder, de modifier ou de supprimer vos données personnelles à tout moment. Contactez-nous pour exercer ces droits.",
    },
    {
      title: "6. Cookies",
      content:
        "Miwa utilise des cookies pour améliorer votre expérience. Vous pouvez contrôler les paramètres des cookies dans les paramètres de votre navigateur.",
    },
    {
      title: "7. Modifications de la politique",
      content:
        "Cette politique peut être modifiée à tout moment. Les modifications seront publiées sur cette page avec la date de mise à jour.",
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
          Politique de confidentialité
        </h1>
      </div>

      <div className="px-5 py-6 space-y-6">
        <FadeContainer stagger>
          {/* Intro */}
          <AnimatedItem>
            <div className="space-y-2">
              <p className="text-sm text-[#786f69]">
                Votre vie privée est importante pour nous. Cette politique
                explique comment Miwa collecte, utilise et protège vos données
                personnelles.
              </p>
              <p className="text-xs text-[#786f69]">
                Dernière mise à jour: 15 décembre 2024
              </p>
            </div>
          </AnimatedItem>

          {/* Sections */}
          {sections.map((section, index) => {
            const Icon = section.icon || null;
            return (
              <AnimatedItem key={index}>
                <div className="bg-white rounded-2xl p-4 border border-[#e8e1db]">
                  <div className="flex items-start gap-3">
                    {Icon && (
                      <div className="w-8 h-8 bg-[#d4643f]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-[#d4643f]" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-sm font-semibold text-[#2d2520] mb-2">
                        {section.title}
                      </h2>
                      <p className="text-xs text-[#786f69] leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedItem>
            );
          })}

          {/* GDPR/Data Rights */}
          <AnimatedItem>
            <div className="bg-[#d4643f]/10 rounded-2xl p-4 border border-[#d4643f]/20">
              <h3 className="text-sm font-semibold text-[#2d2520] mb-2">
                Vos droits RGPD
              </h3>
              <ul className="text-xs text-[#786f69] space-y-1">
                <li>• Droit d'accès à vos données</li>
                <li>• Droit de rectification de vos données</li>
                <li>• Droit à l'effacement ("droit à l'oubli")</li>
                <li>• Droit de limiter le traitement</li>
                <li>• Droit à la portabilité des données</li>
              </ul>
            </div>
          </AnimatedItem>

          {/* Contact Section */}
          <AnimatedItem>
            <div className="bg-gradient-to-br from-[#d4643f] to-[#c25838] rounded-3xl p-6 text-white">
              <h3 className="font-semibold mb-2">
                Responsable de la protection des données
              </h3>
              <p className="text-sm text-white/80 mb-4">
                Pour toute question concernant la confidentialité ou pour
                exercer vos droits, veuillez nous contacter.
              </p>
              <div className="space-y-2">
                <button className="flex items-center gap-2 text-sm font-semibold hover:underline">
                  privacy@miwa.com
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button className="flex items-center gap-2 text-sm font-semibold hover:underline">
                  +229 XXX XX XX XX
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </AnimatedItem>
        </FadeContainer>
      </div>
    </div>
  );
}
