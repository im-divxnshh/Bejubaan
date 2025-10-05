import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/utils/FirebaseAdmin";

export async function DELETE(req: NextRequest) {
  const admin = getAdmin(); // <- call inside function
  try {
    const { uid } = await req.json();
    if (!uid) return NextResponse.json({ message: "UID is required" }, { status: 400 });

    await admin.auth().deleteUser(uid);
    return NextResponse.json({ message: "Doctor deleted successfully" }, { status: 200 });
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ message }, { status: 500 });
  }
}
