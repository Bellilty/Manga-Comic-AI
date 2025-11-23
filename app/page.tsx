"use client";

import { useState } from "react";
import Link from "next/link";
import { StoryForm } from "@/components/StoryForm";
import { PageViewer } from "@/components/PageViewer";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles } from "lucide-react";

export default function Home() {
  const [generatedComic, setGeneratedComic] = useState<{
    id: string;
    pages: string[];
    meta: {
      pitch: string;
      timestamp: string;
    };
  } | null>(null);

  const handleComplete = (result: any) => {
    setGeneratedComic(result);
  };

  const startNew = () => {
    setGeneratedComic(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">ComicAI</h1>
          </div>
          <Link href="/explore">
            <Button variant="outline">
              <BookOpen className="mr-2 h-4 w-4" />
              Explore Comics
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {!generatedComic ? (
          <div className="flex flex-col items-center justify-center space-y-8">
            <div className="max-w-2xl text-center space-y-4">
              <h2 className="text-4xl font-bold tracking-tight">
                Transform Your Stories Into Comics
              </h2>
              <p className="text-xl text-muted-foreground">
                Describe your story and watch as AI creates a beautiful,
                illustrated comic in your chosen style
              </p>
            </div>

            <StoryForm onComplete={handleComplete} />
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-8">
            <PageViewer
              pages={generatedComic.pages}
              comicId={generatedComic.id}
              pitch={generatedComic.meta.pitch}
              timestamp={generatedComic.meta.timestamp}
            />

            <Button onClick={startNew} size="lg">
              Create Another Comic
            </Button>
          </div>
        )}
      </main>

      <footer className="border-t py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Powered by Hugging Face AI Models</p>
        </div>
      </footer>
    </div>
  );
}

