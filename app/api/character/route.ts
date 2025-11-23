import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/hf";
import { buildCharacterPrompt } from "@/lib/prompts";
import { ComicStyle } from "@/lib/types";

// Truly free model on HF infrastructure (no providers needed)
const IMAGE_MODEL = "runwayml/stable-diffusion-v1-5";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { characterDescription, style } = body as {
      characterDescription: string;
      style: ComicStyle;
    };

    if (!characterDescription || !style) {
      return NextResponse.json(
        { error: "Missing character description or style" },
        { status: 400 }
      );
    }

    console.log("Generating character reference...");

    const prompt = buildCharacterPrompt(characterDescription, style);

    const imageBuffer = await generateImage(IMAGE_MODEL, {
      inputs: prompt,
      parameters: {
        negative_prompt:
          "blurry, low quality, distorted, deformed, ugly, bad anatomy, watermark, text, words, letters",
        num_inference_steps: 25,
        guidance_scale: 7.5,
      },
    });

    // Convert to base64
    const base64Image = imageBuffer.toString("base64");
    const dataUrl = `data:image/png;base64,${base64Image}`;

    return NextResponse.json({ image: dataUrl });
  } catch (error) {
    console.error("Error generating character:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate character" },
      { status: 500 }
    );
  }
}

