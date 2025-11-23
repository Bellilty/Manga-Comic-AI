import { HfInference } from "@huggingface/inference";

const HF_TOKEN = process.env.HF_TOKEN || "";
const hf = new HfInference(HF_TOKEN);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const IDEOGRAM_API_KEY = process.env.IDEOGRAM_API_KEY || "";

export interface HFTextGenerationParams {
  inputs: string;
  parameters?: {
    max_new_tokens?: number;
    temperature?: number;
    top_p?: number;
    return_full_text?: boolean;
  };
}

export interface HFImageGenerationParams {
  inputs: string;
  parameters?: {
    negative_prompt?: string;
    num_inference_steps?: number;
    guidance_scale?: number;
  };
}

/**
 * Call OpenAI GPT-4o-mini for text generation
 */
export async function generateText(
  model: string,
  params: HFTextGenerationParams,
  retries = 3
): Promise<string> {
  // Use OpenAI instead of Hugging Face
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set in environment variables");
  }

  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Generating text with OpenAI GPT-4o-mini`);
      
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: params.inputs,
            },
          ],
          max_tokens: params.parameters?.max_new_tokens || 4000,
          temperature: params.parameters?.temperature || 0.7,
          top_p: params.parameters?.top_p || 0.95,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Text generation successful");
      const generatedText = data.choices[0]?.message?.content || "";
      return generatedText;
    } catch (error: any) {
      console.error(`Attempt ${i + 1} failed:`, error.message || error);
      
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  throw new Error("Failed to generate text after retries");
}

/**
 * Generate image using Ideogram API with Character Reference support
 */
export interface IdeogramImageParams {
  prompt: string;
  model?: "3.0-turbo" | "3.0-default" | "3.0-quality";
  aspect_ratio?: string;
  character_reference_image?: string; // URL or base64
  reference_image?: string; // URL or base64 (for style consistency)
  style_strength?: number; // 0.0 to 1.0
}

export async function generateImageWithIdeogram(
  params: IdeogramImageParams,
  retries = 3
): Promise<Buffer> {
  if (!IDEOGRAM_API_KEY) {
    throw new Error("IDEOGRAM_API_KEY is not set in environment variables");
  }

  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Generating image with Ideogram API (model: ${params.model || "3.0-default"})`);
      
      const requestBody: any = {
        prompt: params.prompt,
        model: params.model || "3.0-default",
        aspect_ratio: params.aspect_ratio || "9:16", // Vertical page format
      };

      // Add character reference if provided
      if (params.character_reference_image) {
        requestBody.character_reference_image = params.character_reference_image;
      }

      // Add reference image for style consistency
      if (params.reference_image) {
        requestBody.reference_image = params.reference_image;
        requestBody.style_strength = params.style_strength || 0.7;
      }

      const response = await fetch("https://api.ideogram.ai/api/v1/generate", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${IDEOGRAM_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ideogram API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      // Ideogram returns image URLs - we need to fetch the image
      const imageUrl = data.image_url || data.output_image_url || data.images?.[0]?.url;
      
      if (!imageUrl) {
        throw new Error("No image URL in Ideogram response");
      }

      console.log("Fetching generated image from Ideogram...");
      const imageResponse = await fetch(imageUrl);
      
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.status}`);
      }

      const arrayBuffer = await imageResponse.arrayBuffer();
      console.log("Image generation successful with Ideogram");
      
      return Buffer.from(arrayBuffer);
    } catch (error: any) {
      console.error(`Attempt ${i + 1} failed:`, error.message || error);
      
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  throw new Error("Failed to generate image after retries");
}

/**
 * Legacy function - kept for compatibility but now uses Ideogram
 */
export async function generateImage(
  model: string,
  params: HFImageGenerationParams,
  retries = 3
): Promise<Buffer> {
  return generateImageWithIdeogram({
    prompt: params.inputs,
    model: "3.0-default",
  }, retries);
}


/**
 * Extract JSON from text that might contain markdown or extra text
 */
export function extractJSON(text: string): any {
  // Try to find JSON between ```json and ``` or just parse directly
  const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[1]);
  }

  // Try to find a JSON object in the text
  let objectMatch = text.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    let jsonStr = objectMatch[0];
    
    // Try to fix common LLM JSON errors
    try {
      return JSON.parse(jsonStr);
    } catch (e: any) {
      console.log("JSON parse failed, attempting to fix...");
      console.log("Error:", e.message);
      
      // Fix 1: Replace problematic characters in strings
      // Replace smart quotes, apostrophes, etc.
      jsonStr = jsonStr
        .replace(/[\u2018\u2019]/g, "'")  // Smart single quotes
        .replace(/[\u201C\u201D]/g, '"')  // Smart double quotes
        .replace(/\u2026/g, '...');       // Ellipsis
      
      // Fix 2: Ensure proper closing of arrays and objects
      // Count opening/closing braces and brackets
      const openBraces = (jsonStr.match(/\{/g) || []).length;
      const closeBraces = (jsonStr.match(/\}/g) || []).length;
      const openBrackets = (jsonStr.match(/\[/g) || []).length;
      const closeBrackets = (jsonStr.match(/\]/g) || []).length;
      
      // Add missing closing brackets
      for (let i = 0; i < openBrackets - closeBrackets; i++) {
        jsonStr += ']';
      }
      
      // Add missing closing braces
      for (let i = 0; i < openBraces - closeBraces; i++) {
        jsonStr += '}';
      }
      
      // Fix 3: Try to fix trailing comma issues
      jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1');
      
      console.log("Fixed JSON structure, retrying parse...");
      try {
        return JSON.parse(jsonStr);
      } catch (e2: any) {
        console.error("Still failed after fixes. Attempting aggressive fix...");
        
        // Last resort: Try to extract just the valid JSON portion
        // This is hacky but might work for partial JSON
        try {
          // Try to find the last valid closing position
          let depth = 0;
          let lastValidPos = -1;
          for (let i = 0; i < jsonStr.length; i++) {
            if (jsonStr[i] === '{') depth++;
            if (jsonStr[i] === '}') {
              depth--;
              if (depth === 0) {
                lastValidPos = i + 1;
                break;
              }
            }
          }
          
          if (lastValidPos > 0) {
            jsonStr = jsonStr.substring(0, lastValidPos);
            console.log("Trimmed to valid JSON, retrying...");
            return JSON.parse(jsonStr);
          }
        } catch (e3) {
          console.error("All JSON fixes failed");
        }
        
        throw new Error(`JSON parsing failed: ${e2.message}`);
      }
    }
  }

  // Try parsing directly
  return JSON.parse(text);
}
