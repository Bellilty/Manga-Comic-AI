import { NextResponse } from "next/server";
import { listAllComics } from "@/lib/storage";

export async function GET() {
  try {
    const comics = await listAllComics();
    return NextResponse.json(comics);
  } catch (error) {
    console.error("Error listing comics:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list comics" },
      { status: 500 }
    );
  }
}

