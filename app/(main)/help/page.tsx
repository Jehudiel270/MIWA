"use client";

import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Mail,
  Phone,
  MessageSquare,
} from "lucide-react";
import { FadeContainer, AnimatedItem } from "@/components/ui/motion";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export default function HelpCenterPage() {
  const faqs: FAQItem[] = [
    {
      id: "1",
      category: "Réservations",
      question: "Comment modifier ma réservation?",
      answer:
        "Vous pouvez modifier votre réservation dans la section 'Mes réservations' en cliquant sur le bouton 'Modifier'. Les modifications sont possibles jusqu'à 48h avant votre arrivée.",
    },
    {
      id: "2",
      category: "Réservations",
      question: "Puis-je annuler ma réservation?",
      answer:
        "Oui, vous pouvez annuler votre réservation. Les conditions d'annulation dépendent de l'établissement. Veuillez consulter les conditions spécifiques de votre réservation.",
    },
    {
      id: "3",
      category: "Paiements",
      question: "Quels sont les modes de paiement acceptés?",
      answer:
        "Nous acceptons Mobile Money (MTN, Moov, Celtiis), les cartes bancaires (Visa, Mastercard) et notre portefeuille Miwa.",
    },
    {
      id: "4",
      category: "Paiements",
      question: "Mon paiement a échoué. Que faire?",
      answer:
        "Vérifiez que vous avez les fonds suffisants et réessayez avec un autre moyen de paiement. Si le problème persiste, contactez le support.",
    },
    {
      id: "5",
      category: "Compte",
      question: "Comment sécuriser mon compte?",
      answer:
        "Utilisez un mot de passe fort, activez la vérification en deux étapes et mettez à jour régulièrement vos informations personnelles.",
    },
    {
      id: "6",
      category: "Compte",
      question: "Comment supprimer mon compte?",
      answer:
        "Vous pouvez demander la suppression de votre compte dans les paramètres de confidentialité. Tous vos données seront supprimées dans les 30 jours.",
    },
  ];

  const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b border-[#e8e1db] flex items-center gap-3">
        <Link href="/profile">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f5f1ed] transition-colors">
            <ChevronLeft className="w-5 h-5 text-[#2d2520]" />
          </button>
        </Link>
        <h1 className="text-xl font-semibold text-[#2d2520]">Centre d'aide</h1>
      </div>

      <div className="px-5 py-6 space-y-6">
        <FadeContainer stagger>
          {/* Contact Quick Links */}
          <AnimatedItem>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 bg-white rounded-2xl border border-[#e8e1db] hover:border-[#d4643f] hover:shadow-md transition-all flex flex-col items-center gap-2">
                <Phone className="w-6 h-6 text-[#d4643f]" />
                <span className="text-xs font-semibold text-[#2d2520] text-center">
                  Appeler le support
                </span>
              </button>
              <button className="p-4 bg-white rounded-2xl border border-[#e8e1db] hover:border-[#d4643f] hover:shadow-md transition-all flex flex-col items-center gap-2">
                <Mail className="w-6 h-6 text-[#d4643f]" />
                <span className="text-xs font-semibold text-[#2d2520] text-center">
                  Envoyer un email
                </span>
              </button>
              <button className="p-4 bg-white rounded-2xl border border-[#e8e1db] hover:border-[#d4643f] hover:shadow-md transition-all flex flex-col items-center gap-2">
                <MessageSquare className="w-6 h-6 text-[#d4643f]" />
                <span className="text-xs font-semibold text-[#2d2520] text-center">
                  Chat en direct
                </span>
              </button>
              <button className="p-4 bg-white rounded-2xl border border-[#e8e1db] hover:border-[#d4643f] hover:shadow-md transition-all flex flex-col items-center gap-2">
                <HelpCircle className="w-6 h-6 text-[#d4643f]" />
                <span className="text-xs font-semibold text-[#2d2520] text-center">
                  FAQ Complète
                </span>
              </button>
            </div>
          </AnimatedItem>

          {/* FAQ by Category */}
          {categories.map((category) => (
            <div key={category}>
              <h2 className="text-sm font-semibold text-[#2d2520] mb-3 px-1">
                {category}
              </h2>
              <div className="space-y-2">
                {faqs
                  .filter((faq) => faq.category === category)
                  .map((faq) => (
                    <AnimatedItem key={faq.id}>
                      <details className="bg-white rounded-2xl border border-[#e8e1db] overflow-hidden hover:border-[#d4643f] transition-colors">
                        <summary className="p-4 cursor-pointer flex items-center justify-between">
                          <span className="text-sm font-semibold text-[#2d2520] text-left flex-1">
                            {faq.question}
                          </span>
                          <ChevronRight className="w-5 h-5 text-[#786f69] flex-shrink-0" />
                        </summary>
                        <div className="px-4 pb-4 pt-0 text-sm text-[#786f69] border-t border-[#e8e1db]">
                          {faq.answer}
                        </div>
                      </details>
                    </AnimatedItem>
                  ))}
              </div>
            </div>
          ))}

          {/* Still need help? */}
          <AnimatedItem>
            <div className="bg-gradient-to-br from-[#d4643f] to-[#c25838] rounded-3xl p-6 text-white text-center">
              <h3 className="text-lg font-semibold mb-2">
                Vous ne trouvez pas votre réponse?
              </h3>
              <p className="text-sm text-white/80 mb-4">
                Notre équipe de support est prête à vous aider.
              </p>
              <button className="w-full py-3 bg-white text-[#d4643f] rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Contacter le support
              </button>
            </div>
          </AnimatedItem>
        </FadeContainer>
      </div>
    </div>
  );
}
