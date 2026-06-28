"use client";

import { useState } from "react";
import { toast } from "sonner";

interface Props {
  initialName: string;
  initialEmail: string;
  initialPhone?: string;
  initialImage?: string;
}

export default function ProfileEdit({
  initialName,
  initialEmail,
  initialPhone = "",
  initialImage = "",
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [image, setImage] = useState(initialImage);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: name,
          phone,
          profile_picture_url: image,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data?.error || "Impossible de mettre à jour le profil");
      } else {
        toast.success("Profil mis à jour");
        setIsOpen(false);
        // reload to reflect server-side changes
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setIsOpen((s) => !s)}
        className="px-4 py-2 bg-white rounded-2xl shadow-sm text-sm text-[#d4643f] hover:bg-[#fef2f0]"
      >
        {isOpen ? "Annuler" : "Éditer le profil"}
      </button>

      {isOpen && (
        <form
          onSubmit={handleSave}
          className="mt-4 bg-white rounded-2xl p-4 shadow-sm space-y-3"
        >
          <div>
            <label htmlFor="name-input" className="text-xs text-[#786f69]">
              Nom complet
            </label>
            <input
              id="name-input"
              placeholder="Ex: Koffi Mensah"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="email-input" className="text-xs text-[#786f69]">
              Email (non modifiable)
            </label>
            <input
              id="email-input"
              value={initialEmail}
              disabled
              placeholder="votre.email@exemple.com"
              className="w-full mt-1 px-3 py-2 border rounded-lg bg-[#f5f1ed]"
            />
          </div>

          <div>
            <label htmlFor="phone-input" className="text-xs text-[#786f69]">
              Téléphone
            </label>
            <input
              id="phone-input"
              placeholder="+229 XX XX XX XX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="avatar-input" className="text-xs text-[#786f69]">
              URL de l'avatar
            </label>
            <input
              id="avatar-input"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
              className="w-full mt-1 px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-[#d4643f] text-white rounded-2xl font-semibold"
            >
              {loading ? "En cours..." : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-3 border rounded-2xl"
            >
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
