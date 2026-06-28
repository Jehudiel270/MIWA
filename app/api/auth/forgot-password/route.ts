import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // TODO: Integrate with Supabase / mail service to send reset link
    // For now, simulate success and return 200
    return NextResponse.json({ message: "Reset email sent" }, { status: 200 });
  } catch (err) {
    console.error("forgot-password error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
