import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/utils/FirebaseAdmin";
import { db, storage } from "@/utils/FirebaseConfig";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

export async function DELETE(req: NextRequest) {
  try {
    const { uid } = await req.json();

    if (!uid) return NextResponse.json({ message: "UID is required" }, { status: 400 });

    const docRef = doc(db, "doctors", uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return NextResponse.json({ message: "Doctor not found" }, { status: 404 });

    const data = docSnap.data() as {
      photoURL?: string;
      aadharCardPhoto?: string;
      panCardPhoto?: string;
    };

    const deleteStorageFile = async (url?: string) => {
      if (!url) return;
      try {
        const path = decodeURIComponent(url.split("/o/")[1].split("?")[0]);
        const fileRef = ref(storage, path);
        await deleteObject(fileRef);
      } catch (err) {
        console.warn("Error deleting file:", err);
      }
    };

    await Promise.all([
      deleteStorageFile(data.photoURL),
      deleteStorageFile(data.aadharCardPhoto),
      deleteStorageFile(data.panCardPhoto),
    ]);

    await deleteDoc(docRef);
    await admin.auth().deleteUser(uid);

    return NextResponse.json({ message: "Doctor deleted successfully" }, { status: 200 });
  } catch (error: unknown) {
    let message = "Unknown error";
    if (error instanceof Error) message = error.message;
    console.error(error);
    return NextResponse.json({ message }, { status: 500 });
  }
}
