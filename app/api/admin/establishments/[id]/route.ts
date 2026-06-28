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

    if (action === "verify") {
      const { error } = await supabase
        .from("establishments")
        .update({ is_verified: true, verification_status: "approved" })
        .eq("id", id);

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 },
        );
      }

      await logAdminAction(
        userId!,
        "verify_establishment",
        "establishment",
        id,
      );
      return NextResponse.json(
        { success: true, message: "Établissement vérifié" },
        { status: 200 },
      );
    }

    if (action === "reject") {
      const { error } = await supabase
        .from("establishments")
        .update({ verification_status: "rejected" })
        .eq("id", id);

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 },
        );
      }

      await logAdminAction(
        userId!,
        "reject_establishment",
        "establishment",
        id,
        {},
        { reason },
      );
      return NextResponse.json(
        { success: true, message: "Établissement rejeté" },
        { status: 200 },
      );
    }

    if (action === "deactivate") {
      const { error } = await supabase
        .from("establishments")
        .update({ is_active: false })
        .eq("id", id);

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 },
        );
      }

      await logAdminAction(
        userId!,
        "deactivate_establishment",
        "establishment",
        id,
        {},
        { reason },
      );
      return NextResponse.json(
        { success: true, message: "Établissement désactivé" },
        { status: 200 },
      );
    }

    if (action === "flag") {
      const { error } = await supabase.from("establishment_flags").insert({
        establishment_id: id,
        flag_type: reason,
        reason: reason,
        flagged_by: userId,
      });

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 },
        );
      }

      await logAdminAction(
        userId!,
        "flag_establishment",
        "establishment",
        id,
        {},
        { flag_type: reason },
      );
      return NextResponse.json(
        { success: true, message: "Établissement signalé" },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 },
    );
  } catch (error) {
    console.error("admin/establishments error", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
