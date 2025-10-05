import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/utils/FirebaseAdmin";

export async function DELETE(req: NextRequest) {
  try {
    const { uid } = await req.json();
    if (!uid) return NextResponse.json({ message: "UID is required" }, { status: 400 });

    // Only delete Auth user
    await admin.auth().deleteUser(uid);

    return NextResponse.json({ message: "Doctor auth deleted successfully" }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
