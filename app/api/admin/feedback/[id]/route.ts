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
    const { action, status, response } = body;

    const supabase = await createClient();

    if (action === "update_status") {
      const { error } = await supabase
        .from("feedback_submissions")
        .update({ status })
        .eq("id", id);

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 },
        );
      }

      await logAdminAction(
        userId!,
        "update_feedback_status",
        "feedback",
        id,
        {},
        { status },
      );
      return NextResponse.json(
        { success: true, message: "Statut mis à jour" },
        { status: 200 },
      );
    }

    if (action === "add_response") {
      const { error } = await supabase
        .from("feedback_submissions")
        .update({
          response,
          status: "responded",
          admin_response_date: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 },
        );
      }

      await logAdminAction(
        userId!,
        "respond_to_feedback",
        "feedback",
        id,
        {},
        { response },
      );
      return NextResponse.json(
        { success: true, message: "Réponse ajoutée" },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 },
    );
  } catch (error) {
    console.error("admin/feedback error", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
