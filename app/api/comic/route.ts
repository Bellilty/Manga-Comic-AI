import { NextRequest, NextResponse } from "next/server";
import { saveComicMeta, saveComicPage, saveStoryStructure } from "@/lib/storage";
import { ComicMeta, StoryStructure, ComicStyle } from "@/lib/types";
import { generateImageWithIdeogram } from "@/lib/hf";
import { buildPagePrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pitch, style, story, characterReferenceImage } = body as {
      pitch: string;
      style: ComicStyle;
      story: StoryStructure;
      characterReferenceImage?: string; // Base64 or URL of character reference image
    };

    if (!pitch || !style || !story) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log(`Generating comic with ${story.pages_count} pages using Ideogram API...`);

    const comicId = `comic_${Date.now()}`;
    const timestamp = new Date().toISOString();

    // Get all characters for consistency
    const charactersDesc = story.characters
      .map((c) => `${c.name} (${c.visual || c.description})`)
      .join(", ");

    const pages: string[] = [];
    const pageBuffers: Buffer[] = []; // Store all previous page buffers
    
    // Track previous pages for visual context
    const previousPagesVisualContext: string[] = [];

    // Generate each page (ONE image per page with multiple panels!)
    for (let pageIdx = 0; pageIdx < story.pages.length; pageIdx++) {
      const page = story.pages[pageIdx];
      const isFirstPage = pageIdx === 0;
      
      console.log(`Generating page ${page.page}/${story.pages_count} with ${page.panels_count} panels...`);

      try {
        // Build context from ALL previous pages
        const contextSummary = previousPagesVisualContext.length > 0
          ? `PREVIOUS PAGES (maintain visual consistency):\n${previousPagesVisualContext.join("\n\n")}`
          : undefined;
        
        // Build detailed prompt with all panel information
        const prompt = buildPagePrompt(
          page.panels,
          page.panels_count,
          style,
          charactersDesc,
          page.page,
          contextSummary,
          isFirstPage
        );
        
        // Store this page's visual description for next pages
        const pageContextStr = page.panels.map(p => 
          `Panel ${p.panel_number}: ${p.description} - ${p.actions}`
        ).join(" | ");
        previousPagesVisualContext.push(
          `Page ${page.page} (${page.panels_count} panels): ${pageContextStr}`
        );

        // Prepare Ideogram parameters
        const ideogramParams: any = {
          prompt: prompt,
          model: "3.0-default", // Using Default with Character Reference
          aspect_ratio: "9:16", // Vertical page format
        };

        // For first page: use character reference image if provided
        if (isFirstPage && characterReferenceImage) {
          console.log("Using character reference image for first page");
          ideogramParams.character_reference_image = characterReferenceImage;
        }

        // For subsequent pages: send all previous pages as reference images
        if (!isFirstPage && pageBuffers.length > 0) {
          console.log(`Sending ${pageBuffers.length} previous page(s) as reference for page ${page.page}`);
          
          // Convert previous pages to base64 data URLs
          // For Ideogram, we'll send the most recent page as primary reference
          // and include context about all previous pages in the prompt
          const lastPageBase64 = `data:image/png;base64,${pageBuffers[pageBuffers.length - 1].toString("base64")}`;
          ideogramParams.reference_image = lastPageBase64;
          ideogramParams.style_strength = 0.7; // Strong style consistency
          
          // Also use character reference if provided
          if (characterReferenceImage) {
            ideogramParams.character_reference_image = characterReferenceImage;
          }
        } else if (!isFirstPage && characterReferenceImage) {
          // If no previous pages but character ref exists, use it
          ideogramParams.character_reference_image = characterReferenceImage;
        }

        console.log(`Generating page ${page.page} with Ideogram API...`);
        const pageBuffer = await generateImageWithIdeogram(ideogramParams);

        // Save page
        await saveComicPage(comicId, page.page, pageBuffer);
        pageBuffers.push(pageBuffer); // Store for next pages

        // Convert to base64 for response
        const base64Page = pageBuffer.toString("base64");
        pages.push(`data:image/png;base64,${base64Page}`);

        console.log(`Page ${page.page} completed`);
      } catch (error) {
        console.error(`Error generating page ${page.page}:`, error);
        throw error;
      }
    }

    // Save metadata
    const meta: ComicMeta = {
      id: comicId,
      pitch,
      style,
      timestamp,
      characters: story.characters,
      pages_count: story.pages_count,
    };

    await saveComicMeta(comicId, meta);
    
    // Save full story structure for reference
    await saveStoryStructure(comicId, story);

    return NextResponse.json({
      id: comicId,
      pages,
      meta,
    });
  } catch (error) {
    console.error("Error generating comic:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate comic" },
      { status: 500 }
    );
  }
}

