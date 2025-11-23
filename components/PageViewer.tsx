"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";

interface PageViewerProps {
  pages: string[];
  comicId: string;
  pitch: string;
  timestamp: string;
}

export function PageViewer({ pages, comicId, pitch, timestamp }: PageViewerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const downloadPDF = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comicId }),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${comicId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  const date = new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6 space-y-2">
        <h2 className="text-2xl font-bold">Your Comic</h2>
        <p className="text-muted-foreground">{pitch}</p>
        <p className="text-sm text-muted-foreground">Created on {date}</p>
      </div>

      <div className="relative mb-6 overflow-hidden rounded-lg border bg-muted">
        <img
          src={pages[currentPage]}
          alt={`Page ${currentPage + 1}`}
          className="w-full h-auto"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            onClick={prevPage}
            disabled={currentPage === 0}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            onClick={nextPage}
            disabled={currentPage === pages.length - 1}
            variant="outline"
            size="sm"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <span className="text-sm text-muted-foreground">
          Page {currentPage + 1} of {pages.length}
        </span>

        <Button onClick={downloadPDF} disabled={isDownloading} size="sm">
          <Download className="h-4 w-4 mr-2" />
          {isDownloading ? "Generating..." : "Download PDF"}
        </Button>
      </div>
    </div>
  );
}

