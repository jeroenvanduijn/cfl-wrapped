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

export default function WinsPage() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const storyRef = useRef<HTMLDivElement>(null);

  const wins = responses.filter((r) => r.grootsteWin2025?.trim());

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
    if (!storyRef.current) return;
    setIsGenerating(true);

    try {
      const canvas = await (html2canvas as any)(storyRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });

      const link = document.createElement("a");
      link.download = `cfl-win-${currentIndex + 1}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
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
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Wins 2025 - Story Templates
            </h1>
            <p className="text-gray-400">
              {wins.length} wins gevonden (anoniem)
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchData}
              className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={downloadAllStories}
              disabled={wins.length === 0 || isGenerating}
              className="flex items-center gap-2 bg-[#EF4C37] text-white px-4 py-2 rounded-lg hover:bg-[#D43A28] transition-colors disabled:opacity-50"
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
              className="relative bg-gradient-to-br from-[#EF4C37] to-[#D43A28] rounded-3xl overflow-hidden"
              style={{ width: 360, height: 640 }}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full" />
                <div className="absolute bottom-20 right-10 w-24 h-24 border-4 border-white rounded-full" />
                <div className="absolute top-1/2 left-1/2 w-40 h-40 border-4 border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full p-8">
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
