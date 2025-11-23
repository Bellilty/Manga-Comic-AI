import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/hf";
import { buildPanelPrompt } from "@/lib/prompts";
import { ComicStyle } from "@/lib/types";

// Truly free model on HF infrastructure (no providers needed)
const IMAGE_MODEL = "runwayml/stable-diffusion-v1-5";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { description, style, character, dialogue, previousContext } = body as {
      description: string;
      style: ComicStyle;
      character: string;
      dialogue: string;
      previousContext?: string;
    };

    if (!description || !style || !character) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Generating panel...");

    const prompt = buildPanelPrompt(description, style, character, dialogue, previousContext);

    const imageBuffer = await generateImage(IMAGE_MODEL, {
      inputs: prompt,
      parameters: {
        negative_prompt:
          "blurry, low quality, distorted, deformed, ugly, bad anatomy, watermark, text, words, letters, written dialogue, captions, writing, photo realistic",
        num_inference_steps: 25,
        guidance_scale: 7.5,
      },
    });

    // Convert to base64
    const base64Image = imageBuffer.toString("base64");
    const dataUrl = `data:image/png;base64,${base64Image}`;

    return NextResponse.json({ image: dataUrl });
  } catch (error) {
    console.error("Error generating panel:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate panel" },
      { status: 500 }
    );
  }
}

