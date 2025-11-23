import sharp from "sharp";

export const PAGE_WIDTH = 1400;
export const PAGE_HEIGHT = 2000;
export const PANEL_WIDTH = 1300;
export const PANEL_HEIGHT = 450; // Fixed height per panel for 4 panels
export const PANEL_SPACING = 30;
export const PAGE_PADDING = 35;

/**
 * Detect white speech bubble regions in image
 * Returns the bounding box of the brightest/whitest region (likely a speech bubble)
 */
async function detectSpeechBubble(
  imageBuffer: Buffer
): Promise<{ x: number; y: number; width: number; height: number } | null> {
  try {
    const image = sharp(imageBuffer);
    const { width, height } = await image.metadata();
    
    if (!width || !height) return null;

    // Get raw pixel data
    const { data } = await image
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Divide image into grid and find brightest regions
    const gridSize = 20;
    const cellWidth = Math.floor(width / gridSize);
    const cellHeight = Math.floor(height / gridSize);
    
    let brightestRegion = { x: 0, y: 0, brightness: 0 };

    // Scan image for bright regions (potential speech bubbles)
    for (let gridY = 0; gridY < gridSize; gridY++) {
      for (let gridX = 0; gridX < gridSize; gridX++) {
        let totalBrightness = 0;
        let pixelCount = 0;

        // Sample pixels in this grid cell
        for (let y = gridY * cellHeight; y < (gridY + 1) * cellHeight && y < height; y++) {
          for (let x = gridX * cellWidth; x < (gridX + 1) * cellWidth && x < width; x++) {
            const idx = (y * width + x) * 3; // RGB (3 channels)
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            // Calculate brightness
            const brightness = (r + g + b) / 3;
            totalBrightness += brightness;
            pixelCount++;
          }
        }

        const avgBrightness = totalBrightness / pixelCount;
        
        if (avgBrightness > brightestRegion.brightness) {
          brightestRegion = {
            x: gridX * cellWidth,
            y: gridY * cellHeight,
            brightness: avgBrightness,
          };
        }
      }
    }

    // If we found a bright region (>200 brightness = whitish)
    if (brightestRegion.brightness > 200) {
      return {
        x: brightestRegion.x,
        y: brightestRegion.y,
        width: cellWidth * 3, // Expand to cover speech bubble
        height: cellHeight * 3,
      };
    }

    return null;
  } catch (error) {
    console.error("Error detecting speech bubble:", error);
    return null;
  }
}

/**
 * Add dialogue text to detected speech bubble or overlay
 */
export async function addDialogueToPanel(
  panelBuffer: Buffer,
  dialogue: string
): Promise<Buffer> {
  if (!dialogue || dialogue.trim() === "") {
    return panelBuffer;
  }

  const image = sharp(panelBuffer);
  const metadata = await image.metadata();
  const width = metadata.width || PANEL_WIDTH;
  const height = metadata.height || PANEL_HEIGHT;

  // Try to detect existing speech bubble
  const bubbleRegion = await detectSpeechBubble(panelBuffer);

  // Word wrap the dialogue
  const maxCharsPerLine = 35;
  const words = dialogue.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + " " + word).length <= maxCharsPerLine) {
      currentLine += (currentLine ? " " : "") + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  // Text styling
  const fontSize = 22;
  const lineHeight = fontSize * 1.4;
  const padding = 15;

  let boxX: number, boxY: number, textWidth: number;

  if (bubbleRegion) {
    // Position text in detected bubble
    textWidth = Math.min(bubbleRegion.width - 40, 500);
    boxX = bubbleRegion.x + (bubbleRegion.width - textWidth) / 2;
    boxY = bubbleRegion.y + 30; // Slight offset from top of bubble
  } else {
    // Fallback: position at top-right (common for speech bubbles)
    textWidth = Math.min(width - 100, 450);
    boxX = width - textWidth - 50;
    boxY = 30;
  }

  const textHeight = lines.length * lineHeight + padding * 2;

  // Create SVG text (no background if bubble detected, white bg if not)
  const svgText = lines
    .map(
      (line, i) =>
        `<text x="${textWidth / 2}" y="${padding + i * lineHeight + fontSize * 0.8}" 
         text-anchor="middle" 
         font-family="Comic Sans MS, Arial, sans-serif" 
         font-size="${fontSize}" 
         font-weight="bold"
         fill="#000"
         stroke="#000"
         stroke-width="0.5">${escapeXml(line)}</text>`
    )
    .join("\n");

  // If no bubble detected, add white background
  const background = bubbleRegion
    ? ""
    : `<rect x="0" y="0" width="${textWidth}" height="${textHeight}" 
         fill="white" stroke="black" stroke-width="3" rx="12"/>`;

  const svg = `
    <svg width="${textWidth}" height="${textHeight}">
      ${background}
      ${svgText}
    </svg>
  `;

  const textBuffer = Buffer.from(svg);
  
  return await image
    .composite([
      {
        input: textBuffer,
        top: Math.round(Math.max(0, Math.min(boxY, height - textHeight))),
        left: Math.round(Math.max(0, Math.min(boxX, width - textWidth))),
      },
    ])
    .toBuffer();
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Assemble multiple panel images into a single vertical page
 * Each panel is resized to fit exactly, ensuring 4 panels fit on one page
 */
export async function assemblePageFromPanels(
  panelBuffers: Buffer[],
  dialogues?: string[]
): Promise<Buffer> {
  if (panelBuffers.length === 0) {
    throw new Error("No panels provided");
  }

  // Force resize all panels to FIXED dimensions
  // This ensures exactly 4 panels fit on a page
  const resizedPanels: Buffer[] = [];
  
  for (let i = 0; i < panelBuffers.length; i++) {
    let resized = await sharp(panelBuffers[i])
      .resize(PANEL_WIDTH, PANEL_HEIGHT, { 
        fit: "cover", 
        position: "center" 
      })
      .toBuffer();
    
    // Add dialogue if provided
    if (dialogues && dialogues[i]) {
      resized = await addDialogueToPanel(resized, dialogues[i]);
    }
    
    resizedPanels.push(resized);
  }

  // Calculate total height for page
  // 4 panels * 450px + 3 spacings * 30px + 2 paddings * 35px = 1800 + 90 + 70 = 1960px (fits in 2000px)
  const totalPanelHeight = PANEL_HEIGHT * resizedPanels.length;
  const totalSpacing = PANEL_SPACING * (resizedPanels.length - 1);
  const pageHeight = totalPanelHeight + totalSpacing + (PAGE_PADDING * 2);

  // Create composite operations for sharp
  const compositeOps: sharp.OverlayOptions[] = [];
  let currentY = PAGE_PADDING;

  for (const panel of resizedPanels) {
    compositeOps.push({
      input: panel,
      top: currentY,
      left: (PAGE_WIDTH - PANEL_WIDTH) / 2,
    });
    currentY += PANEL_HEIGHT + PANEL_SPACING;
  }

  // Create white background and composite all panels
  const page = await sharp({
    create: {
      width: PAGE_WIDTH,
      height: Math.min(pageHeight, PAGE_HEIGHT),
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite(compositeOps)
    .png()
    .toBuffer();

  return page;
}

/**
 * Create a placeholder image for testing
 */
export async function createPlaceholderPanel(
  text: string,
  width: number = 512,
  height: number = 512
): Promise<Buffer> {
  const svg = `
    <svg width="${width}" height="${height}">
      <rect width="${width}" height="${height}" fill="#f0f0f0"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="24" fill="#333">
        ${text}
      </text>
    </svg>
  `;

  return await sharp(Buffer.from(svg)).png().toBuffer();
}

