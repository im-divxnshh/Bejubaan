import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/utils/FirebaseAdmin";

export async function DELETE(req: NextRequest) {
  try {
    const { uid } = await req.json();
    if (!uid) {
      return NextResponse.json({ message: "UID is required" }, { status: 400 });
    }

    // Delete Firebase Auth user only
    await admin.auth().deleteUser(uid);

    return NextResponse.json({ message: "Firebase Auth user deleted successfully" }, { status: 200 });
  } catch (error: unknown) {
    let message = "Unknown error";
    if (error instanceof Error) message = error.message;
    console.error(error);
    return NextResponse.json({ message }, { status: 500 });
  }
}
