"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";

export function RegisterForm() {
  const { register, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({
        nom: formData.fullName,
        email: formData.email,
        telephone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
    } catch (err) {
      // Error is handled in useAuth hook
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={handleRegister}
      className="space-y-4 max-w-md mx-auto w-full"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {[
        {
          label: "Nom complet",
          name: "fullName",
          type: "text",
          placeholder: "Koffi Mensah",
          Icon: User,
        },
        {
          label: "Email",
          name: "email",
          type: "email",
          placeholder: "votre.email@exemple.com",
          Icon: Mail,
        },
        {
          label: "Téléphone",
          name: "phone",
          type: "tel",
          placeholder: "+229 97 12 34 56",
          Icon: Phone,
        },
      ].map(({ label, name, type, placeholder, Icon }) => (
        <div key={name}>
          <label className="block text-sm text-[#2d2520] mb-2 px-1">
            {label}
          </label>
          <div className="relative">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#786f69]" />
            <input
              type={type}
              name={name}
              value={formData[name as keyof typeof formData]}
              onChange={handleChange}
              placeholder={placeholder}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-[#e8e1db] text-[#2d2520] placeholder:text-[#786f69] focus:outline-none focus:ring-2 focus:ring-[#d4643f]/20"
              required
              disabled={loading}
            />
          </div>
        </div>
      ))}

      {[
        {
          label: "Mot de passe",
          name: "password",
          show: showPassword,
          toggle: () => setShowPassword(!showPassword),
        },
        {
          label: "Confirmer le mot de passe",
          name: "confirmPassword",
          show: showConfirmPassword,
          toggle: () => setShowConfirmPassword(!showConfirmPassword),
        },
      ].map(({ label, name, show, toggle }) => (
        <div key={name}>
          <label className="block text-sm text-[#2d2520] mb-2 px-1">
            {label}
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#786f69]" />
            <input
              type={show ? "text" : "password"}
              name={name}
              value={formData[name as keyof typeof formData]}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border border-[#e8e1db] text-[#2d2520] placeholder:text-[#786f69] focus:outline-none focus:ring-2 focus:ring-[#d4643f]/20"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={toggle}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              disabled={loading}
            >
              {show ? (
                <EyeOff className="w-5 h-5 text-[#786f69]" />
              ) : (
                <Eye className="w-5 h-5 text-[#786f69]" />
              )}
            </button>
          </div>
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-[#d4643f] text-white rounded-2xl shadow-md hover:bg-[#c25838] transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Création en cours..." : "Créer mon compte"}
      </button>

      <div className="text-center pt-6">
        <span className="text-sm text-[#786f69]">
          Vous avez déjà un compte ?{" "}
        </span>
        <Link
          href="/login"
          className="text-sm text-[#d4643f] hover:text-[#c25838]"
        >
          Se connecter
        </Link>
      </div>

      <p className="text-xs text-center text-[#786f69] pt-4">
        En créant un compte, vous acceptez nos{" "}
        <button type="button" className="text-[#d4643f]">
          Conditions d&apos;utilisation
        </button>{" "}
        et notre{" "}
        <button type="button" className="text-[#d4643f]">
          Politique de confidentialité
        </button>
      </p>
    </form>
  );
}
