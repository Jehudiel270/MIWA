import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { feedback_type, message } = body;

    if (!feedback_type || !message) {
      return NextResponse.json(
        { success: false, error: "feedback_type and message are required" },
        { status: 400 },
      );
    }

    if (!["bug", "feature", "complaint", "praise"].includes(feedback_type)) {
      return NextResponse.json(
        { success: false, error: "Invalid feedback_type" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { data, error } = await supabase
      .from("feedback_submissions")
      .insert([
        {
          client_id: authData.user.id,
          feedback_type,
          message: message.trim(),
          status: "new",
        },
      ])
      .select();

    if (error) {
      console.error("feedback insert error", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, data: data?.[0] },
      { status: 201 },
    );
  } catch (err) {
    console.error("feedback POST error", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
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

    // Users see only their own feedback, admins see all
    const { data: user } = await supabase
      .from("users")
      .select("role")
      .eq("id", authData.user.id)
      .single();

    let query = supabase
      .from("feedback_submissions")
      .select("*, client:users(full_name,email)");

    if (user?.role !== "admin") {
      query = query.eq("client_id", authData.user.id);
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

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    console.error("feedback GET error", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
