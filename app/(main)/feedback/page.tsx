"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Send,
  Lightbulb,
  AlertCircle,
  ThumbsUp,
} from "lucide-react";
import { FadeContainer, AnimatedItem } from "@/components/ui/motion";

interface FeedbackType {
  type: "bug" | "feature" | "complaint" | "praise";
  label: string;
  icon: React.ComponentType<{ className: string }>;
  color: string;
}

export default function FeedbackPage() {
  const [selectedType, setSelectedType] = useState<
    "bug" | "feature" | "complaint" | "praise" | null
  >(null);
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const feedbackTypes: Record<string, FeedbackType> = {
    bug: {
      type: "bug",
      label: "Signaler un problème",
      icon: AlertCircle,
      color: "text-[#d4183d]",
    },
    feature: {
      type: "feature",
      label: "Demander une fonctionnalité",
      icon: Lightbulb,
      color: "text-[#d4643f]",
    },
    complaint: {
      type: "complaint",
      label: "Déposer une réclamation",
      icon: AlertCircle,
      color: "text-[#d4183d]",
    },
    praise: {
      type: "praise",
      label: "Nous féliciter",
      icon: ThumbsUp,
      color: "text-[#10b981]",
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !message.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedback_type: selectedType,
          message: message.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        console.error("Error submitting feedback:", data);
        return;
      }
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setSelectedType(null);
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b border-[#e8e1db] flex items-center gap-3">
        <Link href="/profile">
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f5f1ed] transition-colors"
            aria-label="Retour"
          >
            <ChevronLeft className="w-5 h-5 text-[#2d2520]" />
          </button>
        </Link>
        <h1 className="text-xl font-semibold text-[#2d2520]">
          Nous faire un retour
        </h1>
      </div>

      <div className="px-5 py-6 space-y-6">
        <FadeContainer stagger>
          {/* Intro */}
          <AnimatedItem>
            <p className="text-sm text-[#786f69] px-1">
              Votre avis est précieux et nous aide à améliorer Miwa. N'hésitez
              pas à partager vos suggestions, problèmes ou compliments.
            </p>
          </AnimatedItem>

          {/* Feedback Types */}
          <div className="grid grid-cols-2 gap-3">
            {Object.values(feedbackTypes).map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.type;

              return (
                <AnimatedItem key={type.type}>
                  <button
                    onClick={() => setSelectedType(type.type)}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      isSelected
                        ? `border-[#d4643f] bg-[#d4643f]/10`
                        : "border-[#e8e1db] bg-white hover:border-[#d4643f]"
                    }`}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${type.color}`} />
                    <p className="text-xs font-semibold text-[#2d2520]">
                      {type.label}
                    </p>
                  </button>
                </AnimatedItem>
              );
            })}
          </div>

          {/* Success Message */}
          {isSubmitted && (
            <AnimatedItem>
              <div className="p-4 bg-[#10b981]/10 border border-[#10b981]/20 rounded-2xl">
                <p className="text-sm text-[#10b981]">
                  ✓ Merci pour votre retour! Nous l'examinerons attentivement.
                </p>
              </div>
            </AnimatedItem>
          )}

          {/* Form */}
          {selectedType && !isSubmitted && (
            <AnimatedItem>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-[#2d2520] mb-2 block">
                    Détails de votre retour
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Dites-nous ce que vous pensez..."
                    className="w-full px-4 py-3 border border-[#e8e1db] rounded-xl text-[#2d2520] focus:outline-none focus:ring-2 focus:ring-[#d4643f]/20 resize-none"
                    rows={5}
                  />
                  <p className="text-xs text-[#786f69] mt-2">
                    {message.length} / 500 caractères
                  </p>
                </div>

                {/* Email (optional) */}
                <div>
                  <label className="text-sm font-semibold text-[#2d2520] mb-2 block">
                    Votre email (optionnel)
                  </label>
                  <input
                    type="email"
                    placeholder="Si vous souhaitez une réponse"
                    className="w-full px-4 py-3 border border-[#e8e1db] rounded-xl text-[#2d2520] focus:outline-none focus:ring-2 focus:ring-[#d4643f]/20"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedType(null);
                      setMessage("");
                    }}
                    className="flex-1 py-3 border border-[#e8e1db] rounded-xl text-[#2d2520] hover:bg-white transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={!message.trim() || isLoading}
                    className="flex-1 py-3 bg-[#d4643f] text-white rounded-xl hover:bg-[#c25838] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Envoyer
                  </button>
                </div>
              </form>
            </AnimatedItem>
          )}

          {/* Info Box */}
          <AnimatedItem>
            <div className="p-4 bg-[#f5f1ed] rounded-2xl">
              <p className="text-xs text-[#786f69]">
                <span className="font-semibold">À savoir:</span> Votre retour
                nous aide à améliorer Miwa et à offrir une meilleure expérience
                à tous nos utilisateurs.
              </p>
            </div>
          </AnimatedItem>
        </FadeContainer>
      </div>
    </div>
  );
}
