import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { checkAdminRole, logAdminAction } from "@/lib/adminUtils";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { isAdmin, userId } = await checkAdminRole();
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { action, reason } = body;

    const supabase = await createClient();

    if (action === "ban") {
      const { error } = await supabase
        .from("users")
        .update({ is_banned: true, ban_reason: reason })
        .eq("id", id);

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 },
        );
      }

      await logAdminAction(userId!, "ban_user", "user", id, {}, { reason });
      return NextResponse.json(
        { success: true, message: "Utilisateur banni" },
        { status: 200 },
      );
    }

    if (action === "unban") {
      const { error } = await supabase
        .from("users")
        .update({ is_banned: false, ban_reason: null })
        .eq("id", id);

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 },
        );
      }

      await logAdminAction(userId!, "unban_user", "user", id);
      return NextResponse.json(
        { success: true, message: "Utilisateur débanni" },
        { status: 200 },
      );
    }

    if (action === "change_role") {
      const { new_role } = body;
      const { error } = await supabase
        .from("users")
        .update({ role: new_role })
        .eq("id", id);

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 },
        );
      }

      await logAdminAction(
        userId!,
        "change_role",
        "user",
        id,
        {},
        { new_role },
      );
      return NextResponse.json(
        { success: true, message: "Rôle changé" },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 },
    );
  } catch (error) {
    console.error("admin/users error", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
