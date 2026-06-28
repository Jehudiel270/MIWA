import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code } = body;
    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required" },
        { status: 400 },
      );
    }

    // TODO: Verify code against DB or auth provider
    // Mock verification: accept any 6-digit code for now
    const ok = typeof code === "string" && code.trim().length === 6;
    if (!ok) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    // Simulate success
    return NextResponse.json({ message: "Email verified" }, { status: 200 });
  } catch (err) {
    console.error("verify-email error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
