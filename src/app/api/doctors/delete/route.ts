import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/utils/FirebaseAdmin"; // ✅ server-side only

export async function DELETE(req: NextRequest) {
  const { uid } = await req.json();
  if (!uid) return NextResponse.json({ message: "UID required" }, { status: 400 });

  try {
    await admin.auth().deleteUser(uid); // Only deleting Auth
    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: (err as Error).message }, { status: 500 });
  }
}
