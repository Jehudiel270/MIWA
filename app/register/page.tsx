"use client";

import { Suspense } from "react";
import { RegisterForm } from "@/components/RegisterForm";

function RegisterContent() {
  return (
    <div className="min-h-screen bg-[#f5f1ed] flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-5 py-12">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#d4643f] rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <span className="text-3xl text-white">M</span>
          </div>
          <h1 className="text-3xl text-[#2d2520] mb-2">Créer un compte</h1>
          <p className="text-sm text-[#786f69]">
            Rejoignez Miwa Check-In aujourd&apos;hui
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f5f1ed]" />}>
      <RegisterContent />
    </Suspense>
  );
}
