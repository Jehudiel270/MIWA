import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../lib/supabaseServer";

export const dynamic = "force-dynamic";

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
      .from("favorites")
      .select(
        `id, establishment:establishments(id,name,city,type,cover_image_url,average_rating,total_reviews)`,
      )
      .eq("client_id", authData.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    const establishmentIds =
      data?.map((favorite) => favorite.establishment.id) ?? [];
    let priceMap: Record<string, number> = {};

    if (establishmentIds.length > 0) {
      const { data: rooms, error: roomsError } = await supabase
        .from("rooms")
        .select("establishment_id, price_per_night")
        .in("establishment_id", establishmentIds)
        .order("price_per_night", { ascending: true });

      if (!roomsError && rooms) {
        priceMap = rooms.reduce(
          (acc, room) => {
            if (!acc[room.establishment_id]) {
              acc[room.establishment_id] = Number(room.price_per_night || 0);
            }
            return acc;
          },
          {} as Record<string, number>,
        );
      }
    }

    const favorites =
      data?.map((favorite) => ({
        ...favorite,
        establishment: {
          ...favorite.establishment,
          min_price: priceMap[favorite.establishment.id] ?? null,
        },
      })) ?? [];

    return NextResponse.json(
      { success: true, data: favorites },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Favorite id is required" },
        { status: 400 },
      );
    }

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("id", id)
      .eq("client_id", authData.user.id);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
