"use client";

import { useState, useEffect, useRef } from "react";
import { Download, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import html2canvas from "html2canvas";
import Image from "next/image";

type Response = {
  memberId: number;
  voornaam: string;
  voornemen2026: string;
  grootsteWin2025: string;
  timestamp: string;
};

// Color gradients from community slides
const gradients = [
  { from: "#EF4C37", to: "#D43A28" }, // Red (CFL brand)
  { from: "#0CBABA", to: "#099999" }, // Teal
  { from: "#F7CB15", to: "#E5B800" }, // Yellow
  { from: "#7B6D8D", to: "#5D5169" }, // Purple
  { from: "#6B5B95", to: "#4A4063" }, // Dark purple
  { from: "#1a1a1a", to: "#2d2d2d" }, // Dark
];

export default function VoornemensPage() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const storyRef = useRef<HTMLDivElement>(null);

  const voornemens = responses.filter((r) => r.voornemen2026?.trim());

  // Get gradient based on current index
  const currentGradient = gradients[currentIndex % gradients.length];

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/responses");
      if (res.ok) {
        const data = await res.json();
        setResponses(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const nextVoornemen = () => {
    if (currentIndex < voornemens.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevVoornemen = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const triggerDownload = async (dataUrl: string, filename: string) => {
    // Try Web Share API first (works best on mobile)
    if (navigator.share && navigator.canShare) {
      try {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], filename, { type: "image/png" });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "CrossFit Leiden Voornemen 2026",
          });
          return;
        }
      } catch {
        console.log("Share failed, falling back to download");
      }
    }

    // Fallback: open in new tab (user can long-press to save on mobile)
    const newTab = window.open();
    if (newTab) {
      newTab.document.write(`
        <html>
          <head><title>${filename}</title></head>
          <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#000;">
            <img src="${dataUrl}" style="max-width:100%;max-height:100vh;" />
          </body>
        </html>
      `);
      newTab.document.close();
    } else {
      // Last resort: regular download link
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadStory = async () => {
    if (!storyRef.current) return;
    setIsGenerating(true);

    try {
      const canvas = await (html2canvas as any)(storyRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });

      const dataUrl = canvas.toDataURL("image/png");
      await triggerDownload(dataUrl, `cfl-voornemen-${currentIndex + 1}.png`);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAllStories = async () => {
    if (!storyRef.current) return;
    setIsGenerating(true);

    try {
      for (let i = 0; i < voornemens.length; i++) {
        setCurrentIndex(i);
        await new Promise((resolve) => setTimeout(resolve, 100));

        const canvas = await (html2canvas as any)(storyRef.current, {
          scale: 2,
          backgroundColor: null,
          useCORS: true,
        });

        const link = document.createElement("a");
        link.download = `cfl-voornemen-${i + 1}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();

        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    } catch (error) {
      console.error("Error generating images:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentVoornemen = voornemens[currentIndex];

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
              Voornemens 2026
            </h1>
            <p className="text-gray-400 text-sm">
              {voornemens.length} voornemens (anoniem)
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchData}
              className="flex items-center gap-2 bg-gray-700 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={downloadAllStories}
              disabled={voornemens.length === 0 || isGenerating}
              className="hidden md:flex items-center gap-2 bg-[#0CBABA] text-white px-3 py-2 rounded-lg hover:bg-[#099999] transition-colors disabled:opacity-50 text-sm"
            >
              <Download className="w-4 h-4" />
              Download Alle
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Laden...</div>
        ) : voornemens.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            Nog geen voornemens ontvangen
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Navigation */}
            <div className="flex items-center gap-6 mb-6">
              <button
                onClick={prevVoornemen}
                disabled={currentIndex === 0}
                className="p-2 bg-gray-700 rounded-full text-white disabled:opacity-30 hover:bg-gray-600 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="text-white text-lg">
                {currentIndex + 1} / {voornemens.length}
              </span>
              <button
                onClick={nextVoornemen}
                disabled={currentIndex === voornemens.length - 1}
                className="p-2 bg-gray-700 rounded-full text-white disabled:opacity-30 hover:bg-gray-600 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Story Template */}
            <div
              ref={storyRef}
              className="relative rounded-3xl overflow-hidden"
              style={{
                width: 360,
                height: 640,
                background: `linear-gradient(to bottom right, ${currentGradient.from}, ${currentGradient.to})`
              }}
            >
              {/* Content */}
              <div className="flex flex-col h-full p-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                  <Image
                    src="/cfl-logo.png"
                    alt="CrossFit Leiden"
                    width={50}
                    height={50}
                    className="rounded-lg"
                  />
                  <div>
                    <p className="text-white font-bold text-lg">CrossFit Leiden</p>
                    <p className="text-white/70 text-sm">Wrapped 2025</p>
                  </div>
                </div>

                {/* Target icon */}
                <div className="text-center mb-6">
                  <div className="text-6xl">🎯</div>
                </div>

                {/* Label */}
                <div className="text-center mb-4">
                  <p className="text-white/80 text-lg font-medium">
                    Voornemen 2026
                  </p>
                </div>

                {/* Voornemen text */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                    <p className="text-white text-xl font-bold text-center leading-relaxed">
                      &quot;{currentVoornemen?.voornemen2026}&quot;
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-auto pt-6">
                  <p className="text-white/60 text-sm">
                    cfl-wrapped.vercel.app
                  </p>
                </div>
              </div>
            </div>

            {/* Download button */}
            <button
              onClick={downloadStory}
              disabled={isGenerating}
              className="mt-6 flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              {isGenerating ? "Genereren..." : "Download Story"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
