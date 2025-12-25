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

export default function WinsPage() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const storyRef = useRef<HTMLDivElement>(null);

  const wins = responses.filter((r) => r.grootsteWin2025?.trim());

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

  const nextWin = () => {
    if (currentIndex < wins.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevWin = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const downloadStory = async () => {
    if (!storyRef.current) {
      alert("No storyRef");
      return;
    }
    setIsGenerating(true);

    try {
      // Create a larger wrapper for Instagram story size (1080x1920)
      const wrapper = document.createElement("div");
      wrapper.style.width = "1080px";
      wrapper.style.height = "1920px";
      wrapper.style.position = "fixed";
      wrapper.style.left = "-9999px";
      wrapper.style.top = "0";
      document.body.appendChild(wrapper);

      const clone = storyRef.current.cloneNode(true) as HTMLElement;
      clone.style.width = "100%";
      clone.style.height = "100%";
      clone.style.borderRadius = "0";
      wrapper.appendChild(clone);

      const canvas = await (html2canvas as any)(wrapper, {
        width: 1080,
        height: 1920,
        scale: 1,
        useCORS: true,
        backgroundColor: null,
      });

      document.body.removeChild(wrapper);

      canvas.toBlob(async (blob: Blob | null) => {
        if (!blob) {
          alert("No blob generated");
          setIsGenerating(false);
          return;
        }

        const file = new File([blob], `cfl-win-${currentIndex + 1}.png`, { type: "image/png" });

        // Try native share (iOS Safari)
        if (navigator.share) {
          try {
            await navigator.share({
              files: [file],
            });
            setIsGenerating(false);
            return;
          } catch (e) {
            alert("Share error: " + (e as Error).message);
          }
        } else {
          alert("navigator.share not available");
        }

        // Fallback for desktop: download directly
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `cfl-win-${currentIndex + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setIsGenerating(false);
      }, "image/png");
    } catch (error) {
      alert("Error: " + (error as Error).message);
      setIsGenerating(false);
    }
  };

  const downloadAllStories = async () => {
    if (!storyRef.current) return;
    setIsGenerating(true);

    try {
      for (let i = 0; i < wins.length; i++) {
        setCurrentIndex(i);
        await new Promise((resolve) => setTimeout(resolve, 100));

        const canvas = await (html2canvas as any)(storyRef.current, {
          scale: 2,
          backgroundColor: null,
          useCORS: true,
        });

        const link = document.createElement("a");
        link.download = `cfl-win-${i + 1}.png`;
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

  const currentWin = wins[currentIndex];

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
              Wins 2025
            </h1>
            <p className="text-gray-400 text-sm">
              {wins.length} wins (anoniem)
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
              disabled={wins.length === 0 || isGenerating}
              className="hidden md:flex items-center gap-2 bg-[#EF4C37] text-white px-3 py-2 rounded-lg hover:bg-[#D43A28] transition-colors disabled:opacity-50 text-sm"
            >
              <Download className="w-4 h-4" />
              Download Alle
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Laden...</div>
        ) : wins.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            Nog geen wins ontvangen
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Navigation */}
            <div className="flex items-center gap-6 mb-6">
              <button
                onClick={prevWin}
                disabled={currentIndex === 0}
                className="p-2 bg-gray-700 rounded-full text-white disabled:opacity-30 hover:bg-gray-600 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="text-white text-lg">
                {currentIndex + 1} / {wins.length}
              </span>
              <button
                onClick={nextWin}
                disabled={currentIndex === wins.length - 1}
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

                {/* Trophy icon */}
                <div className="text-center mb-6">
                  <div className="text-6xl">🏆</div>
                </div>

                {/* Label */}
                <div className="text-center mb-4">
                  <p className="text-white/80 text-lg font-medium">
                    Grootste Win 2025
                  </p>
                </div>

                {/* Win text */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                    <p className="text-white text-xl font-bold text-center leading-relaxed">
                      &quot;{currentWin?.grootsteWin2025}&quot;
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-auto pt-6">
                  <p className="text-white/60 text-sm">
                    www.crossfitleiden.com
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
