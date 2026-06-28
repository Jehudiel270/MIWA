import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../lib/supabaseServer";

export const dynamic = "force-dynamic";

const paymentMethodMap = {
  mobile: "mobile_money",
  card: "card",
  wallet: "wallet",
} as const;

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const [{ data: user }, { data: payments, error: paymentsError }] =
      await Promise.all([
        supabase
          .from("users")
          .select("wallet_balance")
          .eq("id", authData.user.id)
          .single(),
        supabase
          .from("payments")
          .select(
            `*, establishment:establishments(id,name,city,cover_image_url,type)`,
          )
          .eq("client_id", authData.user.id)
          .order("payment_date", { ascending: false })
          .limit(50),
      ]);

    if (paymentsError) {
      return NextResponse.json(
        { success: false, error: paymentsError.message },
        { status: 500 },
      );
    }

    const pendingBalance =
      payments?.reduce((sum, payment) => {
        if (payment.payment_status === "pending") {
          return sum + Number(payment.amount_requested ?? 0);
        }
        return sum;
      }, 0) ?? 0;

    return NextResponse.json(
      {
        success: true,
        data: payments,
        walletBalance: Number(user?.wallet_balance ?? 0),
        pendingBalance,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { bookingId, amount, paymentMethod } = body;

    if (!bookingId || !amount || !paymentMethod) {
      return NextResponse.json(
        {
          success: false,
          error: "bookingId, amount and paymentMethod are required",
        },
        { status: 400 },
      );
    }

    const mappedMethod =
      paymentMethodMap[paymentMethod as keyof typeof paymentMethodMap];

    if (!mappedMethod) {
      return NextResponse.json(
        { success: false, error: "Unsupported payment method" },
        { status: 400 },
      );
    }

    const { data: booking, error: bookingError } = await supabase
      .from("hotel_bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 },
      );
    }

    if (booking.client_id !== authData.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 },
      );
    }

    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid amount" },
        { status: 400 },
      );
    }

    const transactionId = `TXN-${Math.random().toString(36).slice(2, 12).toUpperCase()}`;
    const commissionRate = 0.05;
    const commissionMiw = Number((parsedAmount * commissionRate).toFixed(2));
    const payoutAmount = Number((parsedAmount - commissionMiw).toFixed(2));

    const { data, error } = await supabase
      .from("payments")
      .insert([
        {
          order_id: bookingId,
          client_id: authData.user.id,
          establishment_id: booking.establishment_id,
          amount_requested: parsedAmount,
          amount_paid: parsedAmount,
          deposit_paid: parsedAmount,
          remaining_due: booking.remaining_amount,
          payment_method: mappedMethod,
          payment_status: "paid",
          transaction_id: transactionId,
          webhook_received: false,
          payment_date: new Date().toISOString(),
          commission_rate: commissionRate,
          commission_miwa: commissionMiw,
          payout_amount: payoutAmount,
          payout_status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    await supabase
      .from("hotel_bookings")
      .update({
        status: "confirmed",
        qr_code_url:
          booking.qr_code_url ||
          `${process.env.NEXT_PUBLIC_APP_URL ?? "https://miwa.local"}/qr/${booking.booking_code ?? bookingId}`,
      })
      .eq("id", bookingId);

    return NextResponse.json(
      {
        success: true,
        data,
        transactionId,
        status: "paid",
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("payments POST error", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
