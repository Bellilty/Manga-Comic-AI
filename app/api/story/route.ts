import { NextRequest, NextResponse } from "next/server";
import { generateText, extractJSON } from "@/lib/hf";
import { buildStoryPrompt } from "@/lib/prompts";
import { StoryStructure, ComicStyle } from "@/lib/types";

// Using OpenAI GPT-4o-mini
const TEXT_MODEL = "gpt-4o-mini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pitch, style, characterReference } = body as { 
      pitch: string; 
      style: ComicStyle;
      characterReference?: { name?: string; image?: string };
    };

    if (!pitch || !style) {
      return NextResponse.json(
        { error: "Missing pitch or style" },
        { status: 400 }
      );
    }

    console.log("Generating story structure with OpenAI GPT-4o-mini...");

    const prompt = buildStoryPrompt(pitch, style, characterReference);

    const rawOutput = await generateText(TEXT_MODEL, {
      inputs: prompt,
      parameters: {
        max_new_tokens: 4000, // Increased for detailed panel descriptions
        temperature: 0.7,
        top_p: 0.95,
        return_full_text: false,
      },
    });

    console.log("Raw output:", rawOutput);

    // Extract JSON from the output
    const storyData = extractJSON(rawOutput);

    // Validate the structure
    if (!storyData.pages_count || !storyData.pages || !storyData.characters) {
      throw new Error("Invalid story structure returned from model");
    }

    // Validate pages count (2-4)
    if (storyData.pages_count < 2 || storyData.pages_count > 4) {
      throw new Error(`Invalid pages_count: ${storyData.pages_count}. Must be between 2 and 4.`);
    }

    // Validate each panel has required fields
    for (const page of storyData.pages) {
      for (const panel of page.panels) {
        if (!panel.position || !panel.position.x || !panel.position.y || !panel.position.width || !panel.position.height) {
          throw new Error(`Panel ${panel.panel_number} missing position data`);
        }
        if (!panel.characters || !Array.isArray(panel.characters)) {
          throw new Error(`Panel ${panel.panel_number} missing characters array`);
        }
        if (!panel.background) {
          throw new Error(`Panel ${panel.panel_number} missing background`);
        }
        if (!panel.actions) {
          throw new Error(`Panel ${panel.panel_number} missing actions`);
        }
      }
    }

    const story: StoryStructure = {
      pages_count: storyData.pages_count,
      characters: storyData.characters,
      pages: storyData.pages,
    };

    return NextResponse.json(story);
  } catch (error) {
    console.error("Error generating story:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate story" },
      { status: 500 }
    );
  }
}

