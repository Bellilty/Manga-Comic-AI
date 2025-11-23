export type ComicStyle = "comic" | "manga";

export interface Character {
  name: string;
  description: string;
  visual: string;
}

export interface Panel {
  panel_number: number;
  // Position and layout
  position: {
    x: number; // X position (0-100, percentage of page width)
    y: number; // Y position (0-100, percentage of page height)
    width: number; // Width (0-100, percentage)
    height: number; // Height (0-100, percentage)
  };
  // Visual content
  description: string; // Detailed visual: character positions, actions, expressions, background, lighting
  characters: string[]; // Which characters appear in this panel
  background: string; // Background description
  actions: string; // What's happening in this panel
  dialogue: string; // Dialogue for this panel (with speaker names, e.g., "Knight: Hello!")
}

export interface Page {
  page: number;
  panels_count: number; // Number of panels in this page (e.g., 3, 4, 5)
  panels: Panel[]; // Array of panels with their content
}

export interface StoryStructure {
  pages_count: number;
  characters: Character[];
  pages: Page[];
}

export interface ComicMeta {
  id: string;
  pitch: string;
  style: ComicStyle;
  timestamp: string;
  characters: Character[];
  pages_count: number;
}

export interface GenerateRequest {
  pitch: string;
  style: ComicStyle;
  referenceImage?: string; // Legacy - kept for compatibility
  characterReference?: {
    name?: string; // Optional character name
    image?: string; // Base64 or URL of character reference image
  };
}

export interface ComicListItem {
  id: string;
  preview: string;
  pitch: string;
  style: ComicStyle;
  timestamp: string;
}

