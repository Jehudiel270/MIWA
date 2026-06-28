"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
} from "lucide-react";
import { FadeContainer, AnimatedItem } from "@/components/ui/motion";

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  icon: React.ComponentType<{ className: string }>;
}

export default function NotificationsPage() {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "booking_confirmation",
      label: "Confirmations de réservation",
      description: "Notification quand votre réservation est confirmée",
      enabled: true,
      icon: MessageSquare,
    },
    {
      id: "payment_received",
      label: "Paiements reçus",
      description: "Notification quand votre paiement est traité",
      enabled: true,
      icon: Mail,
    },
    {
      id: "check_in_reminder",
      label: "Rappels de check-in",
      description: "Rappel 24h avant votre arrivée",
      enabled: true,
      icon: Bell,
    },
    {
      id: "promotional",
      label: "Offres promotionnelles",
      description: "Nouvelles offres et réductions exclusives",
      enabled: false,
      icon: MessageSquare,
    },
    {
      id: "sms_notifications",
      label: "Notifications SMS",
      description: "Recevoir les alertes par SMS",
      enabled: true,
      icon: Smartphone,
    },
    {
      id: "email_newsletter",
      label: "Infolettre par email",
      description: "Actualisations et conseils de voyage",
      enabled: false,
      icon: Mail,
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(
      settings.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting,
      ),
    );
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b border-[#e8e1db] flex items-center gap-3">
        <Link href="/profile">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f5f1ed] transition-colors">
            <ChevronLeft className="w-5 h-5 text-[#2d2520]" />
          </button>
        </Link>
        <h1 className="text-xl font-semibold text-[#2d2520]">Notifications</h1>
      </div>

      <div className="px-5 py-6 space-y-4">
        <FadeContainer stagger>
          {settings.map((setting) => {
            const Icon = setting.icon;
            return (
              <AnimatedItem key={setting.id}>
                <div className="bg-white rounded-2xl p-4 flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#f5f1ed] rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-[#d4643f]" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-[#2d2520]">
                      {setting.label}
                    </h3>
                    <p className="text-xs text-[#786f69] mt-1">
                      {setting.description}
                    </p>
                  </div>

                  {/* Toggle */}
                  <button
                    onClick={() => toggleSetting(setting.id)}
                    className={`w-12 h-7 rounded-full transition-colors flex items-center ${
                      setting.enabled ? "bg-[#d4643f]" : "bg-[#e8e1db]"
                    } p-0.5`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full transition-transform ${
                        setting.enabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </AnimatedItem>
            );
          })}
        </FadeContainer>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-[#d4643f]/10 rounded-2xl border border-[#d4643f]/20">
          <p className="text-xs text-[#786f69]">
            Les paramètres de notification sont synchronisés sur tous vos
            appareils et mises à jour en temps réel.
          </p>
        </div>
      </div>
    </div>
  );
}
