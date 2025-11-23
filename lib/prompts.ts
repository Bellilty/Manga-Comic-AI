import { ComicStyle, Panel } from "./types";

export function buildPagePrompt(
  panels: Panel[],
  panelsCount: number,
  style: ComicStyle,
  characters: string,
  pageNumber: number,
  previousContext?: string,
  isFirstPage: boolean = false
): string {
  const readingDirection = style === "manga" ? "RIGHT TO LEFT" : "LEFT TO RIGHT";
  
  let prompt = `Create a full ${style} comic page (PAGE ${pageNumber} of the story) with exactly ${panelsCount} panels.\n`;
  prompt += `Reading direction: ${readingDirection}\n`;
  prompt += `Professional ${style} layout with unique panel arrangement.\n\n`;
  
  // Add previous context for visual consistency
  if (previousContext && !isFirstPage) {
    prompt += `CONTEXT FROM PREVIOUS PAGES (maintain visual consistency):\n${previousContext}\n\n`;
    prompt += `This is PAGE ${pageNumber} - continue the story visually and narratively.\n\n`;
  }
  
  prompt += `PAGE ${pageNumber} LAYOUT - ${panelsCount} PANELS:\n\n`;
  
  // Describe each panel with precise positioning
  panels.forEach((panel) => {
    prompt += `PANEL ${panel.panel_number} (Position: x=${panel.position.x}%, y=${panel.position.y}%, width=${panel.position.width}%, height=${panel.position.height}%):\n`;
    prompt += `Characters: ${panel.characters.join(", ")}\n`;
    prompt += `Background: ${panel.background}\n`;
    prompt += `Actions: ${panel.actions}\n`;
    prompt += `Visual Details: ${panel.description}\n`;
    if (panel.dialogue && panel.dialogue.trim()) {
      prompt += `Dialogue (in speech bubble with readable ENGLISH text): "${panel.dialogue}"\n`;
    }
    prompt += `\n`;
  });
  
  prompt += `Main characters (maintain visual consistency): ${characters}\n\n`;
  
  // Style-specific instructions
  if (style === "manga") {
    prompt += `MANGA STYLE with ENGLISH dialogue:\n`;
    prompt += `- Right-to-left reading flow (panels arranged from right to left)\n`;
    prompt += `- Dynamic panel layouts (varying sizes, creative arrangements)\n`;
    prompt += `- Speed lines, emotional expressions, dramatic angles\n`;
    prompt += `- Screentones and shading\n`;
    prompt += `- Speech bubbles with ENGLISH text in Latin alphabet ONLY\n`;
  } else if (style === "comic") {
    prompt += `COMIC BOOK STYLE:\n`;
    prompt += `- Left-to-right reading flow (panels arranged from left to right)\n`;
    prompt += `- Dynamic action, bold outlines, clear panel borders\n`;
    prompt += `- Speech bubbles with ENGLISH text in Latin alphabet ONLY\n`;
  } else {
    prompt += `LIGNE CLAIRE STYLE:\n`;
    prompt += `- Left-to-right reading flow\n`;
    prompt += `- Clean lines, flat colors, clear compositions\n`;
    prompt += `- European BD aesthetic\n`;
    prompt += `- Speech bubbles with ENGLISH text in Latin alphabet ONLY\n`;
  }
  
  prompt += `\nCRITICAL INSTRUCTIONS:\n`;
  prompt += `- Exactly ${panelsCount} panels positioned as specified above\n`;
  prompt += `- Panel positions must match the coordinates exactly (x, y, width, height)\n`;
  prompt += `- Clear panel borders separating each panel\n`;
  prompt += `- Speech bubbles with ENGLISH text in Latin alphabet ONLY\n`;
  prompt += `- NO Japanese, Chinese, or Korean characters\n`;
  prompt += `- Readable English dialogue in speech bubbles\n`;
  prompt += `- Consistent character designs (same colors, clothing, features as previous pages)\n`;
  prompt += `- Professional ${style} aesthetic\n`;
  prompt += `- Full vertical page layout (portrait orientation)\n`;
  prompt += `- Unique, creative panel arrangement (not just a grid)\n`;
  
  return prompt;
}

export function buildStoryPrompt(pitch: string, style: ComicStyle, characterReference?: { name?: string; image?: string }): string {
  const readingDirection = style === "manga" ? "RIGHT TO LEFT" : "LEFT TO RIGHT";
  
  return `You are a professional ${style} writer and layout artist.
Turn this pitch into a short illustrated ${style} story of 2 to 4 pages.
Determine the number of pages (2-4) based on story complexity.
Each page should have a unique panel layout with precise positioning.

Pitch: "${pitch}"
Visual Style: "${style}"
Reading Direction: ${readingDirection}${characterReference ? `\nCharacter Reference: ${characterReference.name || "Character"}${characterReference.image ? " (image provided)" : ""}` : ""}

Output STRICT JSON (NO markdown, NO explanation, ONLY JSON, NO extra fields):
{
  "pages_count": 2 | 3 | 4,
  "characters": [
    { 
      "name": "Character Name", 
      "description": "Brief description", 
      "visual": "Detailed appearance: hair, clothes, colors, features, age, build" 
    }
  ],
  "pages": [
    {
      "page": 1,
      "panels_count": 3 | 4 | 5,
      "panels": [
        {
          "panel_number": 1,
          "position": {
            "x": 0,
            "y": 0,
            "width": 50,
            "height": 30
          },
          "description": "Detailed visual description: exact character positions, poses, facial expressions, clothing details, background elements, lighting, mood",
          "characters": ["Character Name"],
          "background": "Detailed background description: location, setting, objects, atmosphere",
          "actions": "What is happening in this panel: specific actions, movements, interactions",
          "dialogue": "Character Name: dialogue text" or ""
        }
      ]
    }
  ]
}

CRITICAL RULES:
- Output ONLY these fields: pages_count, characters (name, description, visual), pages (page, panels_count, panels)
- Each panel MUST have: panel_number, position (x, y, width, height as percentages 0-100), description, characters (array), background, actions, dialogue
- Position coordinates: x=left edge, y=top edge, width=panel width, height=panel height (all 0-100)
- Panel positions must NOT overlap and must fit within page (0-100 range)
- Reading direction: ${readingDirection} - arrange panels accordingly
- Each page layout should be UNIQUE and CREATIVE (not just a grid)
- Panels can vary in size (some large, some small for visual interest)
- Each page must have 3-5 panels (panels_count field)
- Use ONLY double quotes, NO smart quotes
- NO trailing commas
- Empty dialogue is OK: ""
- Keep descriptions detailed but concise (2-3 sentences per field)

IMPORTANT: 
- Create unique, dynamic layouts for each page (not repetitive grids)
- Panel sizes and positions should create visual flow following ${readingDirection} reading direction
- Include colors, clothing, expressions in description text
- Each panel advances the story
- Maintain visual continuity across panels and pages
- Background should be detailed (location, time of day, mood, objects)`;
}

export function buildCharacterPrompt(
  characterDescription: string,
  style: ComicStyle
): string {
  return `Character design portrait. Style: ${style}.
${characterDescription}
Front-facing portrait. Clean line art. Strong silhouette. Consistent proportions.
Professional comic book character sheet style.`;
}

