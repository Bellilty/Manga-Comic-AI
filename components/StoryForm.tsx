"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ComicStyle, StoryStructure } from "@/lib/types";
import { Sparkles } from "lucide-react";

interface StoryFormProps {
  onComplete: (result: { id: string; pages: string[] }) => void;
}

interface FormData {
  pitch: string;
  style: ComicStyle;
  referenceImage?: FileList;
}

export function StoryForm({ onComplete }: StoryFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<ComicStyle>("comic");

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsGenerating(true);
    setProgress("Creating story structure...");

    try {
      // Step 1: Generate story structure
      const storyResponse = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pitch: data.pitch, style: selectedStyle }),
      });

      if (!storyResponse.ok) {
        throw new Error("Failed to generate story");
      }

      const story: StoryStructure = await storyResponse.json();
      console.log("Story structure:", story);

      // Step 2: Generate the full comic
      setProgress(`Generating ${story.pages_count} pages with AI illustrations...`);

      const comicResponse = await fetch("/api/comic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pitch: data.pitch,
          style: selectedStyle,
          story,
        }),
      });

      if (!comicResponse.ok) {
        throw new Error("Failed to generate comic");
      }

      const result = await comicResponse.json();
      console.log("Comic generated:", result);

      setProgress("Complete!");
      onComplete(result);
    } catch (error) {
      console.error("Error generating comic:", error);
      alert(error instanceof Error ? error.message : "Failed to generate comic");
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="w-full max-w-2xl">
        <LoadingSpinner message={progress} />
        <p className="text-center text-sm text-muted-foreground mt-4">
          This may take 2-5 minutes. Please be patient while the AI creates your comic.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="pitch">Story Pitch</Label>
        <Textarea
          id="pitch"
          placeholder="Describe your comic story idea... (e.g., 'A brave knight discovers a magical sword in an ancient temple')"
          rows={6}
          {...register("pitch", { required: "Please enter a story pitch" })}
          className="resize-none"
        />
        {errors.pitch && (
          <p className="text-sm text-destructive">{errors.pitch.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="style">Visual Style</Label>
        <Select value={selectedStyle} onValueChange={(value) => setSelectedStyle(value as ComicStyle)}>
          <SelectTrigger id="style">
            <SelectValue placeholder="Select a style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="comic">Comic</SelectItem>
            <SelectItem value="manga">Manga</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reference">Reference Image (Optional)</Label>
        <Input
          id="reference"
          type="file"
          accept="image/*"
          {...register("referenceImage")}
        />
        <p className="text-xs text-muted-foreground">
          Upload a character reference image for better consistency
        </p>
      </div>

      <Button type="submit" size="lg" className="w-full">
        <Sparkles className="mr-2 h-5 w-5" />
        Generate Comic
      </Button>
    </form>
  );
}

