import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { getComicPage, getComicMeta, saveComicPDF } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { comicId } = body as { comicId: string };

    if (!comicId) {
      return NextResponse.json({ error: "Missing comicId" }, { status: 400 });
    }

    console.log(`Generating PDF for comic ${comicId}...`);

    const meta = await getComicMeta(comicId);
    if (!meta) {
      return NextResponse.json({ error: "Comic not found" }, { status: 404 });
    }

    // Create PDF document
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));

    // Add pages
    for (let i = 1; i <= meta.pages_count; i++) {
      if (i > 1) {
        doc.addPage();
      }

      const pageBuffer = await getComicPage(comicId, i);
      if (pageBuffer) {
        // Fit image to page
        doc.image(pageBuffer, {
          fit: [doc.page.width - 100, doc.page.height - 100],
          align: "center",
          valign: "center",
        });
      }
    }

    doc.end();

    // Wait for PDF to finish
    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
    });

    // Save PDF
    await saveComicPDF(comicId, pdfBuffer);

    // Return as downloadable file
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${comicId}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate PDF" },
      { status: 500 }
    );
  }
}

