import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, full_name, phone, subject, message } = body;

    if (!email || !full_name || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "email, full_name, subject, and message are required",
        },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("contact_messages")
      .insert([
        {
          email: email.trim(),
          full_name: full_name.trim(),
          phone: phone?.trim() || null,
          subject: subject.trim(),
          message: message.trim(),
          status: "new",
        },
      ])
      .select();

    if (error) {
      console.error("contact insert error", error);
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
    console.error("contact POST error", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
