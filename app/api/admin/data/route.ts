import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { checkAdminRole } from "@/lib/adminUtils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { isAdmin } = await checkAdminRole();
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type") || "users";
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (type === "users") {
      const { data, error, count } = await supabase
        .from("users")
        .select(
          "id, full_name, email, phone, role, is_banned, wallet_balance, created_at",
          { count: "exact" },
        )
        .range(offset, offset + limit - 1)
        .order("created_at", { ascending: false });

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 },
        );
      }

      return NextResponse.json(
        { success: true, data, total: count },
        { status: 200 },
      );
    }

    if (type === "establishments") {
      const { data, error, count } = await supabase
        .from("establishments")
        .select(
          "id, name, owner_id, owner:users(full_name,email), type, city, is_verified, is_active, verification_status, created_at",
          { count: "exact" },
        )
        .range(offset, offset + limit - 1)
        .order("created_at", { ascending: false });

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 },
        );
      }

      return NextResponse.json(
        { success: true, data, total: count },
        { status: 200 },
      );
    }

    if (type === "bookings") {
      const { data, error, count } = await supabase
        .from("hotel_bookings")
        .select(
          "id, booking_code, status, check_in_date, check_out_date, total_price, client:users(full_name), establishment:establishments(name)",
          { count: "exact" },
        )
        .range(offset, offset + limit - 1)
        .order("created_at", { ascending: false });

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 },
        );
      }

      return NextResponse.json(
        { success: true, data, total: count },
        { status: 200 },
      );
    }

    if (type === "payments") {
      const { data, error, count } = await supabase
        .from("payments")
        .select(
          "id, amount_requested, amount_paid, payment_status, payment_method, client:users(full_name), establishment:establishments(name), created_at",
          { count: "exact" },
        )
        .range(offset, offset + limit - 1)
        .order("created_at", { ascending: false });

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 },
        );
      }

      return NextResponse.json(
        { success: true, data, total: count },
        { status: 200 },
      );
    }

    if (type === "feedback") {
      const { data, error, count } = await supabase
        .from("feedback_submissions")
        .select(
          "id, feedback_type, message, status, response, client:users(full_name,email), created_at",
          { count: "exact" },
        )
        .range(offset, offset + limit - 1)
        .order("created_at", { ascending: false });

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 },
        );
      }

      return NextResponse.json(
        { success: true, data, total: count },
        { status: 200 },
      );
    }

    if (type === "messages") {
      const { data, error, count } = await supabase
        .from("contact_messages")
        .select(
          "id, email, full_name, phone, subject, message, status, created_at",
          { count: "exact" },
        )
        .range(offset, offset + limit - 1)
        .order("created_at", { ascending: false });

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 },
        );
      }

      return NextResponse.json(
        { success: true, data, total: count },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { success: false, error: "Invalid type parameter" },
      { status: 400 },
    );
  } catch (error) {
    console.error("admin/data error", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
