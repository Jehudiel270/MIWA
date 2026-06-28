"use client";

import Link from "next/link";
import { ChevronLeft, Globe, Users, Award, Zap } from "lucide-react";
import { FadeContainer, AnimatedItem } from "@/components/ui/motion";

export default function AboutPage() {
  const features = [
    {
      icon: Zap,
      title: "Rapide et facile",
      description: "Réservez en quelques secondes depuis votre téléphone",
    },
    {
      icon: Users,
      title: "Communauté",
      description: "Connecté avec des milliers de voyageurs",
    },
    {
      icon: Award,
      title: "Fiable",
      description: "Les meilleures établissements vérifiés",
    },
    {
      icon: Globe,
      title: "Global",
      description: "Découvrez des destinations dans toute l'Afrique",
    },
  ];

  const team = [
    { name: "Koffi Mensah", role: "Co-fondateur & CEO" },
    { name: "Ama Boateng", role: "Co-fondateur & CTO" },
    { name: "Yaw Asante", role: "Responsable Partenariats" },
    { name: "Akosua Owusu", role: "Responsable Produit" },
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
          À propos de Miwa
        </h1>
      </div>

      <div className="px-5 py-6 space-y-8">
        <FadeContainer stagger>
          {/* Hero Section */}
          <AnimatedItem>
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-[#d4643f] rounded-3xl flex items-center justify-center mx-auto">
                <span className="text-3xl font-bold text-white">M</span>
              </div>
              <h2 className="text-2xl font-bold text-[#2d2520]">Miwa</h2>
              <p className="text-sm text-[#786f69]">
                Réservez votre séjour parfait en Afrique de l'Ouest
              </p>
            </div>
          </AnimatedItem>

          {/* Mission */}
          <AnimatedItem>
            <div className="bg-gradient-to-br from-[#d4643f] to-[#c25838] rounded-3xl p-6 text-white space-y-3">
              <h3 className="text-lg font-semibold">Notre mission</h3>
              <p className="text-sm leading-relaxed">
                Miwa rend les voyages en Afrique de l'Ouest accessibles,
                abordables et inoubliables. Nous connectons les voyageurs avec
                les meilleures expériences locales.
              </p>
            </div>
          </AnimatedItem>

          {/* Features Grid */}
          <div className="space-y-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <AnimatedItem key={index}>
                  <div className="bg-white rounded-2xl p-4 flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#d4643f]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[#d4643f]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#2d2520]">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-[#786f69] mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </AnimatedItem>
              );
            })}
          </div>

          {/* Stats */}
          <AnimatedItem>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Utilisateurs", value: "50K+" },
                { label: "Réservations", value: "10K+" },
                { label: "Pays", value: "5+" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-4 text-center border border-[#e8e1db]"
                >
                  <p className="text-lg font-bold text-[#d4643f]">
                    {stat.value}
                  </p>
                  <p className="text-xs text-[#786f69]">{stat.label}</p>
                </div>
              ))}
            </div>
          </AnimatedItem>

          {/* Team Section */}
          <AnimatedItem>
            <div>
              <h3 className="text-lg font-semibold text-[#2d2520] mb-4">
                Notre équipe
              </h3>
              <div className="space-y-3">
                {team.map((member, index) => (
                  <div key={index} className="bg-white rounded-2xl p-4">
                    <p className="font-semibold text-[#2d2520] text-sm">
                      {member.name}
                    </p>
                    <p className="text-xs text-[#786f69]">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedItem>

          {/* Contact */}
          <AnimatedItem>
            <div className="bg-[#f5f1ed] rounded-3xl p-6 text-center space-y-4">
              <h3 className="text-lg font-semibold text-[#2d2520]">
                Nous contacter
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-[#786f69]">
                  Email: <span className="text-[#d4643f]">hello@miwa.com</span>
                </p>
                <p className="text-[#786f69]">
                  Téléphone:{" "}
                  <span className="text-[#d4643f]">+229 XXX XX XX XX</span>
                </p>
                <p className="text-[#786f69]">
                  Web: <span className="text-[#d4643f]">www.miwa.com</span>
                </p>
              </div>
            </div>
          </AnimatedItem>

          {/* Version */}
          <AnimatedItem>
            <p className="text-xs text-[#786f69] text-center">
              Version 1.0.0 • © 2024 Miwa. Tous droits réservés.
            </p>
          </AnimatedItem>
        </FadeContainer>
      </div>
    </div>
  );
}
