"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Calendar,
  Users,
  Award,
  X,
  Clock,
  Star,
} from "lucide-react";

type CoachData = {
  coach_naam: string;
  voornaam: string;
  code: string;
  lessen_gegeven: number;
  leden_getraind_totaal: number;
  unieke_leden: number;
  gemiddeld_per_les: number;
  favoriete_dag: string;
  favoriete_dag_count: number;
  favoriete_tijd: string;
  favoriete_tijd_count: number;
  top_maand: string;
  top_maand_count: number;
  top_lestype: string;
  top_lestype_count: number;
  drukste_les_naam: string;
  drukste_les_datum: string;
  drukste_les_tijd: string;
  drukste_les_deelnemers: number;
  vaste_klant_1: string;
  vaste_klant_1_count: number;
  vaste_klant_2: string;
  vaste_klant_2_count: number;
  vaste_klant_3: string;
  vaste_klant_3_count: number;
  early_bird_lessen: number;
  early_bird_percentage: number;
  night_owl_lessen: number;
  night_owl_percentage: number;
  percentile: number;
};

type Props = {
  coach: CoachData;
  onBack: () => void;
};

export default function CoachWrappedSlides({ coach, onBack }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const slideRef = useRef<HTMLDivElement>(null);

  const slides = [
    // Intro
    {
      id: "intro",
      bg: "bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-white text-center px-8">
          <div className="w-32 h-16 relative mb-8">
            <Image
              src="/cfl-logo.png"
              alt="CrossFit Leiden"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-xl opacity-80 mb-4">Coach Wrapped 2025</p>
          <p className="text-5xl font-black mb-6">{coach.voornaam}</p>
          <div className="bg-white/20 rounded-2xl px-8 py-4">
            <p className="text-lg opacity-80">Bedankt voor alles dit jaar! 💪</p>
          </div>
        </div>
      ),
    },
    // Lessen gegeven
    {
      id: "lessen",
      bg: "bg-gradient-to-br from-[#EF4C37] to-[#D43A28]",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-white text-center px-8">
          <Calendar className="w-16 h-16 mb-6 opacity-80" />
          <p className="text-xl opacity-80 mb-4">Dit jaar gaf jij</p>
          <p className="text-8xl font-black mb-2">{coach.lessen_gegeven}</p>
          <p className="text-2xl font-bold mb-6">lessen</p>
          <div className="bg-white/20 rounded-2xl px-8 py-4">
            <p className="text-lg">
              Daarmee train je in de top {coach.percentile}% van alle coaches!
            </p>
          </div>
        </div>
      ),
    },
    // Leden getraind
    {
      id: "leden",
      bg: "bg-gradient-to-br from-[#0CBABA] to-[#099999]",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-white text-center px-8">
          <Users className="w-16 h-16 mb-6 opacity-80" />
          <p className="text-xl opacity-80 mb-4">Je trainde</p>
          <p className="text-7xl font-black mb-2">{coach.leden_getraind_totaal}</p>
          <p className="text-2xl font-bold mb-6">leden</p>
          <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
            <div className="bg-white/20 rounded-2xl px-4 py-3">
              <p className="text-3xl font-bold">{coach.unieke_leden}</p>
              <p className="text-sm opacity-80">unieke leden</p>
            </div>
            <div className="bg-white/20 rounded-2xl px-4 py-3">
              <p className="text-3xl font-bold">{coach.gemiddeld_per_les}</p>
              <p className="text-sm opacity-80">gem. per les</p>
            </div>
          </div>
        </div>
      ),
    },
    // Favoriete dag & tijd
    {
      id: "timing",
      bg: "bg-gradient-to-br from-[#6B5B95] to-[#4A4063]",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-white text-center px-8">
          <Clock className="w-16 h-16 mb-6 opacity-80" />
          <p className="text-xl opacity-80 mb-6">Jouw favoriete moment</p>
          <div className="bg-white/20 rounded-2xl px-8 py-6 mb-4 w-full max-w-xs">
            <p className="text-4xl font-black mb-1">{coach.favoriete_dag}</p>
            <p className="text-lg opacity-80">{coach.favoriete_dag_count}x coaching</p>
          </div>
          <div className="bg-white/10 rounded-2xl px-8 py-4 w-full max-w-xs">
            <p className="text-3xl font-bold mb-1">{coach.favoriete_tijd}</p>
            <p className="text-sm opacity-80">{coach.favoriete_tijd_count}x op dit tijdstip</p>
          </div>
          {(coach.early_bird_percentage > 40 || coach.night_owl_percentage > 40) && (
            <p className="mt-6 text-lg">
              {coach.early_bird_percentage > coach.night_owl_percentage
                ? `🌅 Early bird! ${coach.early_bird_percentage}% ochtendlessen`
                : `🌙 Night owl! ${coach.night_owl_percentage}% avondlessen`}
            </p>
          )}
        </div>
      ),
    },
    // Top lestype
    {
      id: "lestype",
      bg: "bg-gradient-to-br from-[#F7941D] to-[#E87D0D]",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-white text-center px-8">
          <div className="text-6xl mb-6">🏋️</div>
          <p className="text-xl opacity-80 mb-4">Jouw specialty</p>
          <p className="text-4xl font-black mb-2">{coach.top_lestype}</p>
          <p className="text-xl opacity-80 mb-6">{coach.top_lestype_count}x gegeven</p>
          <div className="bg-white/20 rounded-2xl px-8 py-4">
            <p className="text-sm opacity-80">Top maand</p>
            <p className="text-2xl font-bold capitalize">{coach.top_maand}</p>
            <p className="text-sm opacity-60">{coach.top_maand_count} lessen</p>
          </div>
        </div>
      ),
    },
    // Drukste les
    {
      id: "drukste",
      bg: "bg-gradient-to-br from-[#E91E63] to-[#C2185B]",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-white text-center px-8">
          <div className="text-6xl mb-6">🔥</div>
          <p className="text-xl opacity-80 mb-4">Je drukste les</p>
          <p className="text-5xl font-black mb-2">{coach.drukste_les_deelnemers}</p>
          <p className="text-xl mb-6">deelnemers</p>
          <div className="bg-white/20 rounded-2xl px-8 py-4">
            <p className="font-bold text-lg">{coach.drukste_les_naam}</p>
            <p className="text-sm opacity-80">{coach.drukste_les_datum}</p>
            <p className="text-sm opacity-60">{coach.drukste_les_tijd}</p>
          </div>
        </div>
      ),
    },
    // Vaste klanten
    {
      id: "fans",
      bg: "bg-gradient-to-br from-[#9C27B0] to-[#7B1FA2]",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-white text-center px-8">
          <Star className="w-16 h-16 mb-6 opacity-80" />
          <p className="text-xl opacity-80 mb-6">Jouw biggest fans</p>
          <div className="space-y-3 w-full max-w-xs">
            {coach.vaste_klant_1 && (
              <div className="bg-white/20 rounded-2xl px-6 py-4 flex items-center justify-between">
                <span className="text-2xl">🥇</span>
                <span className="font-bold text-xl">{coach.vaste_klant_1}</span>
                <span className="opacity-80">{coach.vaste_klant_1_count}x</span>
              </div>
            )}
            {coach.vaste_klant_2 && (
              <div className="bg-white/15 rounded-2xl px-6 py-3 flex items-center justify-between">
                <span className="text-xl">🥈</span>
                <span className="font-bold">{coach.vaste_klant_2}</span>
                <span className="opacity-80">{coach.vaste_klant_2_count}x</span>
              </div>
            )}
            {coach.vaste_klant_3 && (
              <div className="bg-white/10 rounded-2xl px-6 py-3 flex items-center justify-between">
                <span className="text-xl">🥉</span>
                <span className="font-bold">{coach.vaste_klant_3}</span>
                <span className="opacity-80">{coach.vaste_klant_3_count}x</span>
              </div>
            )}
          </div>
        </div>
      ),
    },
    // Outro
    {
      id: "outro",
      bg: "bg-gradient-to-br from-[#EF4C37] to-[#D43A28]",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-white text-center px-8">
          <div className="w-48 h-24 relative mb-6">
            <Image
              src="/cfl-logo.png"
              alt="CrossFit Leiden"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-2xl font-light mb-4">
            Bedankt voor je inzet,
          </p>
          <p className="text-4xl font-black mb-6">{coach.voornaam}!</p>
          <div className="bg-white/20 rounded-2xl px-8 py-4 mb-6">
            <p className="text-xl font-bold">🎉 2026 = 10 jaar CFL!</p>
            <p className="text-sm opacity-80">En dat gaan we vieren</p>
          </div>
          <p className="text-lg opacity-80 mb-4">Op naar nog een mooi jaar! ❤️</p>
        </div>
      ),
    },
  ];

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1 && !isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => prev + 1);
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [currentSlide, slides.length, isAnimating]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => prev - 1);
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [currentSlide, isAnimating]);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) nextSlide();
    if (distance < -minSwipeDistance) prevSlide();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "Escape") onBack();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, onBack]);

  const triggerDownload = async (dataUrl: string, filename: string) => {
    if (navigator.share && navigator.canShare) {
      try {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], filename, { type: "image/png" });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "Mijn Coach Wrapped 2025",
          });
          setIsGenerating(false);
          return;
        }
      } catch {
        // Fall through to regular download
      }
    }

    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setIsGenerating(false);
  };

  const handleDownloadSummary = () => {
    setIsGenerating(true);

    const logo = new window.Image();
    logo.crossOrigin = "anonymous";
    logo.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Background
      const gradient = ctx.createLinearGradient(0, 0, 1080, 1920);
      gradient.addColorStop(0, "#1a1a1a");
      gradient.addColorStop(1, "#2d2d2d");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1920);

      // Draw logo
      const logoWidth = 300;
      const logoHeight = 150;
      ctx.drawImage(logo, (1080 - logoWidth) / 2, 60, logoWidth, logoHeight);

      // White text
      ctx.fillStyle = "white";
      ctx.textAlign = "center";

      // Header
      ctx.font = "bold 80px Arial, sans-serif";
      ctx.fillText(coach.voornaam, 540, 320);

      ctx.font = "40px Arial, sans-serif";
      ctx.fillText("Coach Wrapped 2025", 540, 400);

      // Stats boxes helper
      const drawBox = (x: number, y: number, w: number, h: number) => {
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 24);
        ctx.fill();
        ctx.fillStyle = "white";
      };

      // Lessen gegeven
      drawBox(90, 480, 900, 200);
      ctx.font = "28px Arial, sans-serif";
      ctx.fillText("Lessen gegeven", 540, 540);
      ctx.font = "bold 90px Arial, sans-serif";
      ctx.fillText(String(coach.lessen_gegeven), 540, 650);

      // Leden & Unieke
      drawBox(90, 710, 430, 160);
      drawBox(560, 710, 430, 160);
      ctx.font = "24px Arial, sans-serif";
      ctx.fillText("Leden getraind", 305, 770);
      ctx.fillText("Unieke leden", 775, 770);
      ctx.font = "bold 36px Arial, sans-serif";
      ctx.fillText(String(coach.leden_getraind_totaal), 305, 830);
      ctx.fillText(String(coach.unieke_leden), 775, 830);

      // Favoriete dag & tijd
      drawBox(90, 900, 430, 160);
      drawBox(560, 900, 430, 160);
      ctx.font = "24px Arial, sans-serif";
      ctx.fillText("Favoriete dag", 305, 960);
      ctx.fillText("Favoriete tijd", 775, 960);
      ctx.font = "bold 34px Arial, sans-serif";
      ctx.fillText(coach.favoriete_dag, 305, 1020);
      ctx.fillText(coach.favoriete_tijd, 775, 1020);

      // Top lestype
      drawBox(90, 1090, 900, 160);
      ctx.font = "24px Arial, sans-serif";
      ctx.fillText("Top lestype", 540, 1150);
      ctx.font = "bold 34px Arial, sans-serif";
      ctx.fillText(coach.top_lestype, 540, 1210);

      // Biggest fans
      if (coach.vaste_klant_1) {
        drawBox(90, 1280, 900, 200);
        ctx.font = "24px Arial, sans-serif";
        ctx.fillText("Biggest Fans", 540, 1330);
        ctx.font = "bold 28px Arial, sans-serif";
        let fanY = 1380;
        if (coach.vaste_klant_1) {
          ctx.fillText(`🥇 ${coach.vaste_klant_1} (${coach.vaste_klant_1_count}x)`, 540, fanY);
          fanY += 40;
        }
        if (coach.vaste_klant_2) {
          ctx.fillText(`🥈 ${coach.vaste_klant_2} (${coach.vaste_klant_2_count}x)`, 540, fanY);
          fanY += 40;
        }
        if (coach.vaste_klant_3) {
          ctx.fillText(`🥉 ${coach.vaste_klant_3} (${coach.vaste_klant_3_count}x)`, 540, fanY);
        }
      }

      // Top percentage
      drawBox(90, 1510, 900, 120);
      ctx.font = "bold 36px Arial, sans-serif";
      ctx.fillText(`Top ${coach.percentile}% actieve coaches`, 540, 1585);

      // Footer
      ctx.font = "28px Arial, sans-serif";
      ctx.fillText("crossfitleiden.nl", 540, 1800);

      // Trigger download
      const dataUrl = canvas.toDataURL("image/png");
      triggerDownload(dataUrl, `cfl-coach-wrapped-${coach.voornaam}.png`);
    };
    logo.src = "/cfl-logo.png";
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      {/* Current slide */}
      <div
        ref={slideRef}
        className={`min-h-screen transition-all duration-300 ease-out ${slides[currentSlide]?.bg}`}
        style={{
          transform: isAnimating ? "scale(0.98)" : "scale(1)",
          opacity: isAnimating ? 0.8 : 1,
        }}
      >
        {slides[currentSlide]?.content}
      </div>

      {/* Navigation arrows */}
      {currentSlide > 0 && (
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}

      {currentSlide < slides.length - 1 && (
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Progress dots */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isAnimating) {
                setIsAnimating(true);
                setCurrentSlide(index);
                setTimeout(() => setIsAnimating(false), 300);
              }
            }}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? "bg-white w-6"
                : "bg-white/40 hover:bg-white/60 w-2"
            }`}
          />
        ))}
      </div>

      {/* Action buttons on last slide */}
      {currentSlide === slides.length - 1 && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={handleDownloadSummary}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-white text-[#1a1a1a] px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            {isGenerating ? "Bezig..." : "Download totaaloverzicht"}
          </button>
        </div>
      )}

      {/* Swipe hint on first slide */}
      {currentSlide === 0 && (
        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm">
          Swipe of gebruik pijltjestoetsen →
        </p>
      )}
    </div>
  );
}
