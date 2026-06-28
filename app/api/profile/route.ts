import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { full_name, phone, profile_picture_url } = body;

    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const updates: Record<string, any> = {};
    if (typeof full_name === "string") updates.full_name = full_name;
    if (typeof phone === "string") updates.phone = phone;
    if (typeof profile_picture_url === "string")
      updates.profile_picture_url = profile_picture_url;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: "No fields to update" },
        { status: 400 },
      );
    }

    const { error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", authData.user.id);
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("profile PATCH error", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
