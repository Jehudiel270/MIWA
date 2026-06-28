import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    const city = url.searchParams.get("city");
    const search = url.searchParams.get("search");
    const limit = Number(url.searchParams.get("limit") ?? "50");
    const offset = Number(url.searchParams.get("offset") ?? "0");

    let query = supabase
      .from("establishments")
      .select("*", { count: "exact" })
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (type) query = query.eq("type", type);
    if (city) query = query.eq("city", city);
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data,
      total: count ?? 0,
      limit,
      offset,
    });
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
      name,
      type,
      address,
      city,
      payout_account,
      description,
      email,
      phone,
      website,
      latitude,
      longitude,
    } = body;

    if (!name || !type || !address || !city || !payout_account) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("establishments")
      .insert([
        {
          owner_id: authData.user.id,
          name,
          type,
          address,
          city,
          payout_account,
          description,
          email,
          phone,
          website,
          latitude: latitude ?? null,
          longitude: longitude ?? null,
          is_active: true,
          is_verified: false,
          average_rating: 0,
          total_reviews: 0,
          payout_frequency: "daily",
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
