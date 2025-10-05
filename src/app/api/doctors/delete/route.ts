import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/utils/FirebaseAdmin";

export async function DELETE(req: NextRequest) {
  try {
    const { uid } = await req.json();
    if (!uid) return NextResponse.json({ message: "UID is required" }, { status: 400 });

    await admin.auth().deleteUser(uid);

    return NextResponse.json({ message: "Doctor auth deleted successfully" }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
