import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("transaction_id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: "Payment not found" },
        { status: 404 },
      );
    }

    const { data: booking, error: bookingError } = await supabase
      .from("hotel_bookings")
      .select("*")
      .eq("id", data.order_id)
      .single();

    return NextResponse.json({
      success: true,
      data: {
        payment: data,
        booking: bookingError ? null : booking,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
