import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const url = new URL(request.url);
    const establishmentId = url.searchParams.get("establishment_id");
    const available = url.searchParams.get("available");

    let query = supabase.from("rooms").select("*");

    if (establishmentId) {
      query = query.eq("establishment_id", establishmentId);
    }

    if (available === "true") {
      query = query.eq("is_available", true);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
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
      room_number,
      type,
      capacity,
      price_per_night,
      currency,
      amenities,
    } = body;

    if (!establishment_id || !room_number || !capacity || !price_per_night) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const { data: establishment, error: establishmentError } = await supabase
      .from("establishments")
      .select("owner_id")
      .eq("id", establishment_id)
      .single();

    if (establishmentError || !establishment) {
      return NextResponse.json(
        { success: false, error: "Establishment not found" },
        { status: 404 },
      );
    }

    if (establishment.owner_id !== authData.user.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      );
    }

    const { data, error } = await supabase
      .from("rooms")
      .insert([
        {
          establishment_id,
          room_number,
          type,
          capacity,
          price_per_night,
          currency: currency ?? "XOF",
          amenities: amenities ?? {},
          is_available: true,
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

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
