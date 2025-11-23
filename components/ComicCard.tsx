"use client";

import Link from "next/link";
import { ComicListItem } from "@/lib/types";

interface ComicCardProps {
  comic: ComicListItem;
}

export function ComicCard({ comic }: ComicCardProps) {
  const date = new Date(comic.timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/explore?id=${comic.id}`}>
      <div className="group cursor-pointer overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-lg hover:scale-[1.02]">
        <div className="aspect-[7/10] overflow-hidden bg-muted">
          {comic.preview ? (
            <img
              src={comic.preview}
              alt={comic.pitch}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No Preview
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="mb-2 line-clamp-2 text-sm font-medium">{comic.pitch}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="capitalize">{comic.style}</span>
            <span>{date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

