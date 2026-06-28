import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return NextResponse.json(
      { error: "Configuration Supabase manquante" },
      { status: 500 },
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  try {
    const body = await request.json();
    const { email, password, nom, telephone } = body;

    // Validate input
    if (!email || !password || !nom || !telephone) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 },
      );
    }
    // Normalize and validate phone length to match DB (VARCHAR(20))
    const phone = String(telephone).replace(/\s+/g, "");
    if (phone.length > 20) {
      return NextResponse.json(
        { error: "Le numéro de téléphone ne doit pas dépasser 20 caractères" },
        { status: 400 },
      );
    }

    // Create Supabase user via admin API to avoid email confirmation rate limits
    const { data: adminData, error: adminError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: nom,
          phone,
        },
      });

    if (adminError) {
      return NextResponse.json({ error: adminError.message }, { status: 400 });
    }

    if (!adminData.user) {
      return NextResponse.json(
        { error: "Erreur lors de la création de l'utilisateur" },
        { status: 500 },
      );
    }

    const authUser = adminData.user;

    // Create user profile in public.users table
    const { error: profileError } = await supabase.from("users").insert([
      {
        id: authUser.id,
        full_name: nom,
        phone,
        email,
        role: "client",
      },
    ]);

    if (profileError) {
      console.error("Profile creation error:", profileError);
      await supabase.auth.admin.deleteUser(authUser.id);
      return NextResponse.json(
        {
          error: `Erreur lors de la création du profil: ${profileError.message}`,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "Inscription réussie.",
        user: authUser,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'inscription" },
      { status: 500 },
    );
  }
}
