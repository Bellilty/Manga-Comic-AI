"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StoryForm } from "@/components/StoryForm";
import { Button } from "@/components/ui/button";
import { Home, Sparkles } from "lucide-react";

export default function GeneratePage() {
  const router = useRouter();

  const handleComplete = (result: { id: string }) => {
    // Redirect to explore with the new comic
    router.push(`/explore?id=${result.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">ComicAI</h1>
          </div>
          <Link href="/">
            <Button variant="outline">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="max-w-2xl text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">
              Create Your Comic
            </h2>
            <p className="text-xl text-muted-foreground">
              Tell us your story and we'll bring it to life
            </p>
          </div>

          <StoryForm onComplete={handleComplete} />
        </div>
      </main>
    </div>
  );
}

