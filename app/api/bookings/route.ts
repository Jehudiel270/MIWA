import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../lib/supabaseServer";

export const dynamic = "force-dynamic";

function calculateNights(checkIn: string, checkOut: string) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = Math.ceil((end.getTime() - start.getTime()) / msPerDay);
  return diff > 0 ? diff : 0;
}

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

    const { data, error } = await supabase
      .from("hotel_bookings")
      .select(
        `*,
        establishment:establishments(id,name,city,cover_image_url,type),
        room:rooms(id,room_number,type,price_per_night,currency)`,
      )
      .eq("client_id", authData.user.id)
      .order("check_in_date", { ascending: true });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
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
    const {
      establishment_id,
      room_id,
      check_in_date,
      check_out_date,
      number_of_guests,
      special_requests,
    } = body;

    if (
      !establishment_id ||
      !room_id ||
      !check_in_date ||
      !check_out_date ||
      !number_of_guests
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const nights = calculateNights(check_in_date, check_out_date);
    if (nights <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "check_out_date must be after check_in_date",
        },
        { status: 400 },
      );
    }

    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", room_id)
      .single();

    if (roomError || !room) {
      return NextResponse.json(
        { success: false, error: "Room not found" },
        { status: 404 },
      );
    }

    if (!room.is_available) {
      return NextResponse.json(
        { success: false, error: "Room is not available" },
        { status: 400 },
      );
    }

    const pricePerNight = Number(room.price_per_night);
    const totalPrice = Number((pricePerNight * nights).toFixed(2));
    const depositAmount = Number((totalPrice * 0.5).toFixed(2));
    const remainingAmount = Number((totalPrice - depositAmount).toFixed(2));
    const bookingCode = `MIWA-${Date.now()}`;
    const qrCodeUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://miwa.local"}/qr/${bookingCode}`;

    const { data, error } = await supabase
      .from("hotel_bookings")
      .insert([
        {
          establishment_id,
          room_id,
          client_id: authData.user.id,
          check_in_date,
          check_out_date,
          number_of_nights: nights,
          number_of_guests: Number(number_of_guests),
          total_price: totalPrice,
          deposit_amount: depositAmount,
          remaining_amount: remainingAmount,
          payment_split: 50,
          status: "pending",
          booking_code: bookingCode,
          qr_code_url: qrCodeUrl,
          special_requests: special_requests || null,
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
      .from("rooms")
      .update({ is_available: false })
      .eq("id", room_id);

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error("bookings POST error", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
