"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ComicCard } from "@/components/ComicCard";
import { PageViewer } from "@/components/PageViewer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { ComicListItem } from "@/lib/types";
import { Home, Sparkles, ArrowLeft } from "lucide-react";

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const comicId = searchParams.get("id");

  const [comics, setComics] = useState<ComicListItem[]>([]);
  const [selectedComic, setSelectedComic] = useState<{
    meta: any;
    pages: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadComics();
  }, []);

  useEffect(() => {
    if (comicId) {
      loadComic(comicId);
    }
  }, [comicId]);

  const loadComics = async () => {
    try {
      const response = await fetch("/api/comics/list");
      if (response.ok) {
        const data = await response.json();
        setComics(data);
      }
    } catch (error) {
      console.error("Error loading comics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadComic = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/comics/${id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedComic(data);
      }
    } catch (error) {
      console.error("Error loading comic:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    setSelectedComic(null);
    window.history.pushState({}, "", "/explore");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">ComicAI</h1>
          </div>
          <div className="flex gap-2">
            {selectedComic && (
              <Button variant="outline" onClick={goBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Explore
              </Button>
            )}
            <Link href="/">
              <Button variant="outline">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {isLoading ? (
          <LoadingSpinner message="Loading comics..." />
        ) : selectedComic ? (
          <div className="flex justify-center">
            <PageViewer
              pages={selectedComic.pages}
              comicId={selectedComic.meta.id}
              pitch={selectedComic.meta.pitch}
              timestamp={selectedComic.meta.timestamp}
            />
          </div>
        ) : (
          <>
            <div className="mb-8 text-center space-y-2">
              <h2 className="text-3xl font-bold">Explore Comics</h2>
              <p className="text-muted-foreground">
                Browse all the AI-generated comics created by the community
              </p>
            </div>

            {comics.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground mb-4">
                  No comics yet. Be the first to create one!
                </p>
                <Link href="/">
                  <Button size="lg">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Create Your First Comic
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {comics.map((comic) => (
                  <ComicCard key={comic.id} comic={comic} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

