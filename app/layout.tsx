import type { Metadata } from "next";
import "./theme.css";
import "./globals.css";

import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Miwa Check-In",
  description:
    "Réservez des hôtels, restaurants et espaces de coworking au Bénin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        {children}
        <Toaster position="bottom-center" richColors />
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </body>
    </html>
  );
}
