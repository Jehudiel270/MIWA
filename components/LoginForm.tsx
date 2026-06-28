"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";

export function LoginForm() {
  const searchParams = useSearchParams();
  const { login, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccessMessage("Inscription réussie! Connectez-vous pour continuer.");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (err) {
      // Error is handled in useAuth hook
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 max-w-md mx-auto w-full">
      {successMessage && (
        <div className="bg-[#10b981]/10 border border-[#10b981]/20 rounded-2xl p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[#10b981]">{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm text-[#2d2520] mb-2 px-1">Email</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#786f69]" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre.email@exemple.com"
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-[#e8e1db] text-[#2d2520] placeholder:text-[#786f69] focus:outline-none focus:ring-2 focus:ring-[#d4643f]/20"
            required
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-[#2d2520] mb-2 px-1">
          Mot de passe
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#786f69]" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border border-[#e8e1db] text-[#2d2520] placeholder:text-[#786f69] focus:outline-none focus:ring-2 focus:ring-[#d4643f]/20"
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
            disabled={loading}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5 text-[#786f69]" />
            ) : (
              <Eye className="w-5 h-5 text-[#786f69]" />
            )}
          </button>
        </div>
      </div>

      <div className="text-right">
        <button
          type="button"
          className="text-sm text-[#d4643f] hover:text-[#c25838]"
          disabled={loading}
        >
          Mot de passe oublié ?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-[#d4643f] text-white rounded-2xl shadow-md hover:bg-[#c25838] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Connexion en cours..." : "Se connecter"}
      </button>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#e8e1db]"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-[#f5f1ed] text-[#786f69]">
            Ou continuer avec
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="py-3 bg-white rounded-2xl border border-[#e8e1db] text-sm text-[#2d2520] hover:bg-[#f5f1ed] transition-colors"
        >
          Google
        </button>
        <button
          type="button"
          className="py-3 bg-white rounded-2xl border border-[#e8e1db] text-sm text-[#2d2520] hover:bg-[#f5f1ed] transition-colors"
        >
          Facebook
        </button>
      </div>

      <div className="text-center pt-6">
        <span className="text-sm text-[#786f69]">Pas encore de compte ? </span>
        <Link
          href="/register"
          className="text-sm text-[#d4643f] hover:text-[#c25838]"
        >
          S&apos;inscrire
        </Link>
      </div>
    </form>
  );
}
