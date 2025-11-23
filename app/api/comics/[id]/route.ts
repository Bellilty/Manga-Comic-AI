import { NextRequest, NextResponse } from "next/server";
import { getComicMeta, getComicPage } from "@/lib/storage";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const meta = await getComicMeta(id);
    if (!meta) {
      return NextResponse.json({ error: "Comic not found" }, { status: 404 });
    }

    // Get all pages
    const pages: string[] = [];
    for (let i = 1; i <= meta.pages_count; i++) {
      const pageBuffer = await getComicPage(id, i);
      if (pageBuffer) {
        const base64 = pageBuffer.toString("base64");
        pages.push(`data:image/png;base64,${base64}`);
      }
    }

    return NextResponse.json({
      meta,
      pages,
    });
  } catch (error) {
    console.error("Error getting comic:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get comic" },
      { status: 500 }
    );
  }
}

