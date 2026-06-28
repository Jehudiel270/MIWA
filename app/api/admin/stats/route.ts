import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { checkAdminRole } from "@/lib/adminUtils";

export const dynamic = "force-dynamic";

export async function GET() {
  const { isAdmin, userId } = await checkAdminRole();
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const supabase = await createClient();

    const [
      { data: users },
      { data: userStats },
      { data: bookingStats },
      { data: paymentStats },
      { data: establishmentStats },
      feedbackCountRes,
      feedbackPendingRes,
      messageCountRes,
      messagePendingRes,
    ] = await Promise.all([
      supabase
        .from("users")
        .select("id, full_name, email, phone, role, is_banned, created_at")
        .limit(50),
      supabase.rpc("admin_user_stats"),
      supabase.rpc("admin_booking_stats"),
      supabase.rpc("admin_payment_stats"),
      supabase.rpc("admin_establishment_stats"),
      supabase
        .from("feedback_submissions")
        .select("id", { count: "exact" })
        .limit(1),
      supabase
        .from("feedback_submissions")
        .select("id", { count: "exact" })
        .eq("status", "new")
        .limit(1),
      supabase
        .from("contact_messages")
        .select("id", { count: "exact" })
        .limit(1),
      supabase
        .from("contact_messages")
        .select("id", { count: "exact" })
        .eq("status", "new")
        .limit(1),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          users,
          stats: {
            users: userStats?.[0],
            bookings: bookingStats?.[0],
            payments: paymentStats?.[0],
            establishments: establishmentStats?.[0],
            feedback: {
              count: feedbackCountRes.count ?? 0,
              pending: feedbackPendingRes.count ?? 0,
            },
            messages: {
              count: messageCountRes.count ?? 0,
              pending: messagePendingRes.count ?? 0,
            },
          },
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("admin/stats error", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
