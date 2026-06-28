import { ImageWithFallback } from "./figma/ImageWithFallback";
import { createClient } from "@/lib/supabaseServer";

export async function GreetingHeader() {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  const name =
    authData?.user?.user_metadata?.full_name ||
    authData?.user?.email ||
    "Bonjour";
  const avatar =
    authData?.user?.user_metadata?.avatar_url ||
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop";

  return (
    <div className="flex items-center justify-between px-5 pt-6 pb-4">
      <div>
        <p className="text-sm text-[#786f69] mb-1">Bonjour,</p>
        <h1 className="text-2xl text-[#2d2520]">
          {typeof name === "string" ? name : "Bienvenue"}
        </h1>
      </div>
      <div className="w-12 h-12 rounded-full overflow-hidden bg-[#d4643f] flex items-center justify-center shadow-md">
        <ImageWithFallback
          src={avatar}
          alt="User avatar"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
