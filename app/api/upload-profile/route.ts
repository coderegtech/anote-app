import { db } from "@/lib/firebase";
import { put } from "@vercel/blob";
import { doc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    console.log(`file: ${file}, userId: ${userId}`);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload to Vercel Blob
    const blob = await put(
      `profiles/${userId}-${Date.now()}.${file.name.split(".").pop()}`,
      file,
      {
        access: "public",
      }
    );

    // Update user profile in Firestore
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      profilePicture: blob.url,
      updatedAt: Date.now(),
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("[v0] Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
