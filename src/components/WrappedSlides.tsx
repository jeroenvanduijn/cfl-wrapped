"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Calendar,
  User,
  Users,
  TrendingUp,
  Award,
  X,
  Image as ImageIcon,
  Play,
  Send,
  Target,
  Trophy,
} from "lucide-react";
import communityStats from "@/data/community-stats.json";

type MemberData = {
  registratienummer: number;
  voornaam: string;
  volledige_naam: string;
  code: string;
  bezoeken: number;
  afmeldingen: number;
  favoriete_coaches: string;
  coaches_meervoud: boolean;
  favoriete_dag: string;
  top_maand: string;
  rustigste_maand: string;
  eerste_bezoek: string;
  percentile: number;
  buddy_1: string;
  buddy_1_sessies: number;
  buddy_2: string;
  buddy_2_sessies: number;
  buddy_3: string;
  buddy_3_sessies: number;
  favoriete_lestype: string;
  community_bezoeken: number;
  moeilijkste_dag: string;
  moeilijkste_dag_count: number;
  moeilijkste_tijd: string;
  moeilijkste_tijd_count: number;
  no_shows: number;
};

type Props = {
  member: MemberData;
  onBack: () => void;
};

const getDayMessage = (day: string, isPopular: boolean): string => {
  if (isPopular) {
    return "Net als de meeste CFL'ers!";
  }
  const messages: Record<string, string> = {
    maandag: "Sterk de week in",
    dinsdag: "Dinsdag = gains day",
    woensdag: "Midden in de week. Slimme keuze.",
    donderdag: "Bijna weekend, maar eerst knallen",
    vrijdag: "Weekend warrior style",
    zaterdag: "Uitslapen en dan knallen",
    zondag: "Zondag = jouw dag",
  };
  return messages[day.toLowerCase()] || "Jouw ritme, jouw regels.";
};

export default function WrappedSlides({ member, onBack }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [voornemen2026, setVoornemen2026] = useState("");
  const [grootsteWin2025, setGrootsteWin2025] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const slideRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video URL - replace with actual URL when available
  const videoUrl = ""; // TODO: Add video URL

  const weeklyAvg = Math.round((member.bezoeken / 52) * 10) / 10;
  const avgWeeklyAvg = Math.round((communityStats.avgBezoeken / 52) * 10) / 10;

  // Comparisons
  const bezoekenVsAvg = member.bezoeken - communityStats.avgBezoeken;
  const isAboveAvgBezoeken = bezoekenVsAvg > 0;
  const afmeldingenVsAvg = member.afmeldingen - communityStats.avgAfmeldingen;
  const isAboveAvgAfmeldingen = afmeldingenVsAvg > 0;
  const isSameDay = member.favoriete_dag.toLowerCase() === communityStats.popularDay.toLowerCase();
  const isSameCoach = member.favoriete_coaches.includes(communityStats.popularCoach);

  // Handle feedback submission
  const handleSubmitFeedback = async () => {
    if (isSubmitting || submitted) return;
    if (!voornemen2026.trim() && !grootsteWin2025.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: member.registratienummer,
          voornaam: member.voornaam,
          voornemen2026: voornemen2026.trim(),
          grootsteWin2025: grootsteWin2025.trim(),
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const slides = [
    {
      id: "intro",
      bg: "bg-gradient-to-br from-[#EF4C37] to-[#D43A28]",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-white text-center px-8">
          <div className="w-48 h-24 relative mb-8">
            <Image
              src="/cfl-logo.png"
              alt="CrossFit Leiden"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-4xl font-black mb-4 tracking-tight">
            {member.voornaam}
          </h1>
          <p className="text-xl opacity-90 font-light">Jouw</p>
          <p className="text-5xl font-black mt-2">Wrapped 2025</p>
          <div className="mt-12 animate-bounce">
            <ChevronRight className="w-8 h-8 opacity-60" />
          </div>
        </div>
      ),
    },
    // Video slide - shows after intro
    {
      id: "video",
      bg: "bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-white text-center px-8">
          {videoUrl ? (
            <div className="w-full max-w-md aspect-[9/16] relative">
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-cover rounded-2xl"
                controls
                playsInline
                onPlay={() => setVideoPlaying(true)}
                onPause={() => setVideoPlaying(false)}
                onEnded={() => setVideoPlaying(false)}
              />
            </div>
          ) : (
            <>
              <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center mb-8">
                <Play className="w-16 h-16 opacity-60" />
              </div>
              <p className="text-2xl font-bold mb-4">Video komt binnenkort</p>
              <p className="text-lg opacity-70">
                Hier komt een speciale boodschap voor jou
              </p>
            </>
          )}
          <div className="mt-8">
            <ChevronRight className="w-8 h-8 opacity-40 animate-bounce" />
          </div>
        </div>
      ),
    },
    {
      id: "attendance",
      bg: "bg-gradient-to-br from-[#0CBABA] to-[#099999]",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-white text-center px-8">
          <Calendar className="w-16 h-16 mb-6 opacity-80" />
          <p className="text-xl opacity-90 mb-4">Dit jaar kwam je</p>
          <p className="text-8xl font-black mb-2">{member.bezoeken}</p>
          <p className="text-2xl font-bold">keer trainen</p>
          <div className="mt-8 bg-white/20 rounded-2xl px-6 py-4">
            <p className="text-lg">
              Dat is {weeklyAvg}x per week
              {isAboveAvgBezoeken
                ? ` — ${Math.round(bezoekenVsAvg)} meer dan gemiddeld! 💪`
                : ` (gemiddeld: ${avgWeeklyAvg}x)`
              }
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "rhythm",
      bg: "bg-gradient-to-br from-[#F7CB15] to-[#E5B800]",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-[#1a1a1a] text-center px-8">
          <div className="text-6xl mb-6">📅</div>
          <p className="text-xl opacity-80 mb-4">Jouw vaste dag?</p>
          <p className="text-5xl font-black mb-6 capitalize">
            {member.favoriete_dag}
          </p>
          <div className="bg-black/10 rounded-2xl px-8 py-4">
            <p className="text-lg">{getDayMessage(member.favoriete_dag, isSameDay)}</p>
          </div>
          {!isSameDay && (
            <p className="text-sm opacity-60 mt-4">
              Populairst bij CFL: {communityStats.popularDay}
            </p>
          )}
        </div>
      ),
    },
    {
      id: "coach",
      bg: "bg-gradient-to-br from-[#7B6D8D] to-[#5D5169]",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-white text-center px-8">
          <User className="w-16 h-16 mb-6 opacity-80" />
          <p className="text-xl opacity-90 mb-4">
            {member.coaches_meervoud
              ? "Je favoriete coaches"
              : "Je favoriete coach"}
          </p>
          <p className="text-4xl font-black mb-6">{member.favoriete_coaches}</p>
          <div className="bg-white/20 rounded-2xl px-8 py-4">
            <p className="text-lg">
              {isSameCoach
                ? `Ook de populairste coach van CFL! 🏆`
                : member.coaches_meervoud
                  ? "Zij kennen jouw squat depth inmiddels 😉"
                  : "Die kent jouw squat depth inmiddels 😉"
              }
            </p>
          </div>
          {!isSameCoach && (
            <p className="text-sm opacity-60 mt-4">
              Populairst: {communityStats.popularCoach}
            </p>
          )}
        </div>
      ),
    },
    // Buddies slide - only show if there are buddies
    ...(member.buddy_1
      ? [
          {
            id: "buddies",
            bg: "bg-gradient-to-br from-[#F7CB15] to-[#E5B800]",
            content: (
              <div className="flex flex-col items-center justify-center h-full text-[#1a1a1a] text-center px-8">
                <Users className="w-16 h-16 mb-6 opacity-80" />
                <p className="text-xl opacity-80 mb-4">Jouw top training buddies</p>
                <div className="space-y-3 w-full max-w-xs">
                  {member.buddy_1 && (
                    <div className="bg-black/10 rounded-2xl px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black">🥇</span>
                        <span className="text-xl font-bold">{member.buddy_1}</span>
                      </div>
                      <span className="text-lg opacity-70">{member.buddy_1_sessies}x</span>
                    </div>
                  )}
                  {member.buddy_2 && (
                    <div className="bg-black/10 rounded-2xl px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black">🥈</span>
                        <span className="text-xl font-bold">{member.buddy_2}</span>
                      </div>
                      <span className="text-lg opacity-70">{member.buddy_2_sessies}x</span>
                    </div>
                  )}
                  {member.buddy_3 && (
                    <div className="bg-black/10 rounded-2xl px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black">🥉</span>
                        <span className="text-xl font-bold">{member.buddy_3}</span>
                      </div>
                      <span className="text-lg opacity-70">{member.buddy_3_sessies}x</span>
                    </div>
                  )}
                </div>
                <p className="text-sm opacity-60 mt-6">
                  Samen in de les = samen sterker 💪
                </p>
              </div>
            ),
          },
        ]
      : []),
    // Favorite lesson type slide
    {
      id: "lestype",
      bg: "bg-gradient-to-br from-[#0CBABA] to-[#099999]",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-white text-center px-8">
          <div className="text-6xl mb-6">🏋️</div>
          <p className="text-xl opacity-80 mb-4">Jouw favoriete lestype</p>
          <p className="text-5xl font-black mb-6">{member.favoriete_lestype}</p>
          <div className="bg-white/20 rounded-2xl px-8 py-4">
            <p className="text-lg">
              {member.favoriete_lestype === "CrossFit"
                ? "De basis, altijd goed!"
                : member.favoriete_lestype === "Intensity"
                  ? "Extra gas geven 🔥"
                  : member.favoriete_lestype === "Running" || member.favoriete_lestype === "Engine"
                    ? "Kilometers maken!"
                    : member.favoriete_lestype.includes("Hyrox")
                      ? "Race ready! 🏃"
                      : member.favoriete_lestype === "Focus"
                        ? "Skills sharpenen"
                        : member.favoriete_lestype === "Flex Friday"
                          ? "Flexibel de week uit"
                          : member.favoriete_lestype === "GetShredded"
                            ? "Shredded worden! 💪"
                            : member.favoriete_lestype.includes("28 Day")
                              ? "28 dagen knallen!"
                              : member.favoriete_lestype === "Teens"
                                ? "De toekomst van CFL!"
                                : member.favoriete_lestype.includes("BUILD") || member.favoriete_lestype === "Strongman"
                                  ? "Sterk worden 💪"
                                  : member.favoriete_lestype.includes("Oly") || member.favoriete_lestype === "Weightlifting"
                                    ? "Heavy lifting! 🏋️"
                                    : "Lekker variëren!"}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "seasons",
      bg: "bg-gradient-to-br from-[#EF4C37] to-[#D43A28]",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-white text-center px-8">
          <TrendingUp className="w-16 h-16 mb-6 opacity-80" />
          <div className="space-y-8">
            <div>
              <p className="text-lg opacity-80">Topmaand</p>
              <p className="text-4xl font-black capitalize">
                {member.top_maand} 🔥
              </p>
              {member.top_maand.toLowerCase() === communityStats.popularMonth.toLowerCase() && (
                <p className="text-sm opacity-70 mt-1">Net als de meeste leden!</p>
              )}
            </div>
            <div className="w-24 h-px bg-white/30 mx-auto" />
            <div>
              <p className="text-lg opacity-80">Rustigste maand</p>
              <p className="text-4xl font-black capitalize">
                {member.rustigste_maand}
              </p>
              <p className="text-sm opacity-70 mt-2">
                (vakantie telt niet mee 😄)
              </p>
            </div>
          </div>
        </div>
      ),
    },
    ...(member.afmeldingen > 0
      ? [
          {
            id: "cancellations",
            bg: "bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]",
            content: (
              <div className="flex flex-col items-center justify-center h-full text-white text-center px-8">
                <div className="text-6xl mb-6">😅</div>
                <p className="text-xl opacity-80 mb-4">En ja...</p>
                <p className="text-7xl font-black mb-2">
                  {member.afmeldingen}x
                </p>
                <p className="text-2xl font-bold mb-6">afgezegd</p>
                <div className="bg-white/10 rounded-2xl px-8 py-4">
                  <p className="text-lg">
                    {isAboveAvgAfmeldingen
                      ? `Dat is ${Math.round(afmeldingenVsAvg)} meer dan gemiddeld (${Math.round(communityStats.avgAfmeldingen)}). Volgend jaar beter? 😉`
                      : `Minder dan gemiddeld (${Math.round(communityStats.avgAfmeldingen)}) — netjes! 👏`
                    }
                  </p>
                </div>
              </div>
            ),
          },
        ]
      : []),
    // Moeilijkste moment slide (only show if they have cancellations)
    ...(member.moeilijkste_dag && member.moeilijkste_dag_count > 0
      ? [
          {
            id: "moeilijkste",
            bg: "bg-gradient-to-br from-[#6B5B95] to-[#4A4063]",
            content: (
              <div className="flex flex-col items-center justify-center h-full text-white text-center px-8">
                <div className="text-6xl mb-6">⏰</div>
                <p className="text-xl opacity-80 mb-4">Jouw moeilijkste moment</p>
                <div className="bg-white/20 rounded-2xl px-8 py-6 mb-6">
                  <p className="text-4xl font-black mb-2">{member.moeilijkste_dag}</p>
                  <p className="text-lg opacity-80">{member.moeilijkste_dag_count}x afgezegd</p>
                </div>
                {member.moeilijkste_tijd && (
                  <div className="bg-white/10 rounded-2xl px-8 py-4">
                    <p className="text-lg opacity-80">Vooral om</p>
                    <p className="text-3xl font-bold">{member.moeilijkste_tijd}</p>
                    <p className="text-sm opacity-60">({member.moeilijkste_tijd_count}x)</p>
                  </div>
                )}
                {member.no_shows > 0 && (
                  <p className="mt-6 text-sm opacity-60">
                    En {member.no_shows}x niet komen opdagen... 👀
                  </p>
                )}
              </div>
            ),
          },
        ]
      : []),
    {
      id: "community",
      bg: "bg-gradient-to-br from-[#0CBABA] to-[#099999]",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-white text-center px-8">
          <Award className="w-16 h-16 mb-6 opacity-80" />
          <p className="text-xl opacity-90 mb-4">Je hoort bij de</p>
          <p className="text-7xl font-black mb-2">top {member.percentile}%</p>
          <p className="text-xl mb-8">meest actieve leden</p>
          <div className="bg-white/20 rounded-2xl px-8 py-4">
            <p className="text-sm opacity-90">
              Samen kwamen {communityStats.totalMembers} CFL&apos;ers dit jaar
            </p>
            <p className="text-2xl font-bold">
              {member.community_bezoeken.toLocaleString("nl-NL")} keer
            </p>
            <p className="text-sm opacity-90">trainen</p>
          </div>
        </div>
      ),
    },
    // Feedback slide
    {
      id: "feedback",
      bg: "bg-gradient-to-br from-[#7B6D8D] to-[#5D5169]",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-white text-center px-6 py-12">
          <p className="text-xl opacity-90 mb-2">Deel met ons!</p>
          <p className="text-sm opacity-60 mb-6">Vul in en ontvang daarna je social share afbeelding 📸</p>

          {submitted ? (
            <div className="bg-white/20 rounded-2xl px-8 py-6 mb-6">
              <p className="text-2xl font-bold mb-2">Bedankt! 🙏</p>
              <p className="opacity-80">Je antwoorden zijn opgeslagen</p>
              <p className="text-sm opacity-60 mt-2">Swipe door voor je download →</p>
            </div>
          ) : (
            <div className="w-full max-w-sm space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 opacity-80" />
                  <p className="text-sm opacity-80">Grootste win van 2025</p>
                </div>
                <textarea
                  value={grootsteWin2025}
                  onChange={(e) => setGrootsteWin2025(e.target.value)}
                  placeholder="Mijn eerste muscle-up, 100kg deadlift..."
                  className="w-full bg-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 border border-white/20 focus:border-white/50 focus:outline-none resize-none"
                  rows={2}
                  maxLength={200}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 opacity-80" />
                  <p className="text-sm opacity-80">Goed voornemen voor 2026</p>
                </div>
                <textarea
                  value={voornemen2026}
                  onChange={(e) => setVoornemen2026(e.target.value)}
                  placeholder="Elke week 3x trainen, handstand leren..."
                  className="w-full bg-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 border border-white/20 focus:border-white/50 focus:outline-none resize-none"
                  rows={2}
                  maxLength={200}
                />
              </div>

              <button
                onClick={handleSubmitFeedback}
                disabled={isSubmitting || (!voornemen2026.trim() && !grootsteWin2025.trim())}
                className="w-full bg-white text-[#7B6D8D] font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                {isSubmitting ? "Verzenden..." : "Verstuur"}
              </button>
            </div>
          )}

          <div className="mt-4">
            <ChevronRight className="w-8 h-8 opacity-40 animate-bounce" />
          </div>
        </div>
      ),
    },
    // Outro slide
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
            Dank je dat je deel bent van
          </p>
          <p className="text-4xl font-black mb-6">CrossFit Leiden</p>
          <div className="bg-white/20 rounded-2xl px-8 py-4 mb-6">
            <p className="text-xl font-bold">🎉 2026 = 10 jaar CFL!</p>
            <p className="text-sm opacity-80">En dat gaan we vieren</p>
          </div>
          <p className="text-lg opacity-80 mb-4">Tot op de vloer! ❤️</p>
          <p className="text-sm opacity-50">Data van 1 december 2024 t/m 30 november 2025</p>
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

  // Helper to trigger download that works on mobile
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
            title: "CrossFit Leiden Wrapped 2025",
          });
          return;
        }
      } catch (err) {
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

  // Generate 9:16 Instagram Story image
  const generateStoryImage = async (
    element: HTMLElement,
    filename: string
  ): Promise<void> => {
    const html2canvas = (await import("html2canvas")).default;

    const wrapper = document.createElement("div");
    wrapper.style.width = "1080px";
    wrapper.style.height = "1920px";
    wrapper.style.position = "fixed";
    wrapper.style.left = "-9999px";
    wrapper.style.top = "0";
    document.body.appendChild(wrapper);

    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.width = "100%";
    clone.style.height = "100%";
    clone.style.position = "relative";
    wrapper.appendChild(clone);

    try {
      const canvas = await html2canvas(wrapper, {
        width: 1080,
        height: 1920,
        scale: 1,
        useCORS: true,
        backgroundColor: null,
      });

      await triggerDownload(canvas.toDataURL("image/png"), filename);
    } finally {
      document.body.removeChild(wrapper);
    }
  };

  const handleDownloadSlide = async () => {
    if (!slideRef.current) return;
    setIsGenerating(true);
    setShowDownloadMenu(false);

    try {
      await generateStoryImage(
        slideRef.current,
        `cfl-wrapped-${member.voornaam}-${slides[currentSlide].id}.png`
      );
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadSummary = () => {
    setShowDownloadMenu(false);

    // Load logo first, then draw canvas
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
      gradient.addColorStop(0, "#EF4C37");
      gradient.addColorStop(1, "#D43A28");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1920);

      // Draw logo centered at top
      const logoWidth = 300;
      const logoHeight = 150;
      ctx.drawImage(logo, (1080 - logoWidth) / 2, 60, logoWidth, logoHeight);

      // White text
      ctx.fillStyle = "white";
      ctx.textAlign = "center";

      // Header (below logo)
      ctx.font = "bold 80px Arial, sans-serif";
      ctx.fillText(member.voornaam, 540, 320);

      ctx.font = "40px Arial, sans-serif";
      ctx.fillText("Wrapped 2025", 540, 400);

      // Stats boxes helper
      const drawBox = (x: number, y: number, w: number, h: number) => {
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 24);
        ctx.fill();
        ctx.fillStyle = "white";
      };

      // Trainingen
      drawBox(90, 480, 900, 220);
      ctx.font = "28px Arial, sans-serif";
      ctx.fillText("Trainingen", 540, 540);
      ctx.font = "bold 90px Arial, sans-serif";
      ctx.fillText(String(member.bezoeken), 540, 650);
      ctx.font = "22px Arial, sans-serif";
      ctx.fillText("gemiddeld: " + Math.round(communityStats.avgBezoeken), 540, 690);

      // Dag & Top
      drawBox(90, 730, 430, 160);
      drawBox(560, 730, 430, 160);
      ctx.font = "24px Arial, sans-serif";
      ctx.fillText("Favoriete dag", 305, 790);
      ctx.fillText("Top actief", 775, 790);
      ctx.font = "bold 36px Arial, sans-serif";
      ctx.fillText(member.favoriete_dag, 305, 850);
      ctx.fillText(member.percentile + "%", 775, 850);

      // Coach
      drawBox(90, 920, 900, 160);
      ctx.font = "28px Arial, sans-serif";
      ctx.fillText("Favoriete coach", 540, 980);
      ctx.font = "bold 34px Arial, sans-serif";
      ctx.fillText(member.favoriete_coaches, 540, 1040);

      // Topmaand & Lestype
      drawBox(90, 1110, 430, 160);
      drawBox(560, 1110, 430, 160);
      ctx.font = "24px Arial, sans-serif";
      ctx.fillText("Topmaand", 305, 1170);
      ctx.fillText("Lestype", 775, 1170);
      ctx.font = "bold 34px Arial, sans-serif";
      ctx.fillText(member.top_maand, 305, 1230);
      ctx.fillText(member.favoriete_lestype, 775, 1230);

      // Moeilijkste moment & No-shows
      drawBox(90, 1300, 430, 160);
      drawBox(560, 1300, 430, 160);
      ctx.font = "24px Arial, sans-serif";
      ctx.fillText("Moeilijkste dag", 305, 1360);
      ctx.fillText("No-shows", 775, 1360);
      ctx.font = "bold 34px Arial, sans-serif";
      ctx.fillText(member.moeilijkste_dag || "-", 305, 1420);
      ctx.fillText(String(member.no_shows), 775, 1420);

      // Buddies (if exists)
      if (member.buddy_1) {
        // Tel hoeveel buddies er zijn voor dynamische hoogte
        const buddyCount = [member.buddy_1, member.buddy_2, member.buddy_3].filter(Boolean).length;
        const boxHeight = 80 + buddyCount * 50;

        drawBox(90, 1490, 900, boxHeight);
        ctx.font = "24px Arial, sans-serif";
        ctx.fillText("Training Buddies", 540, 1535);
        ctx.font = "bold 28px Arial, sans-serif";

        let buddyY = 1580;
        const buddySpacing = 45;

        if (member.buddy_1) {
          ctx.fillText(`🥇 ${member.buddy_1} (${member.buddy_1_sessies}x)`, 540, buddyY);
          buddyY += buddySpacing;
        }
        if (member.buddy_2) {
          ctx.fillText(`🥈 ${member.buddy_2} (${member.buddy_2_sessies}x)`, 540, buddyY);
          buddyY += buddySpacing;
        }
        if (member.buddy_3) {
          ctx.fillText(`🥉 ${member.buddy_3} (${member.buddy_3_sessies}x)`, 540, buddyY);
        }
      }

      // Footer
      ctx.font = "28px Arial, sans-serif";
      ctx.fillText("crossfitleiden.nl", 540, 1850);

      // Trigger download
      const dataUrl = canvas.toDataURL("image/png");
      triggerDownload(dataUrl, `cfl-wrapped-${member.voornaam}-overzicht.png`);
    };
    logo.src = "/cfl-logo.png";
  };

  const handleShare = async () => {
    if (!slideRef.current) return;
    setIsGenerating(true);

    try {
      const html2canvas = (await import("html2canvas")).default;

      const wrapper = document.createElement("div");
      wrapper.style.width = "1080px";
      wrapper.style.height = "1920px";
      wrapper.style.position = "fixed";
      wrapper.style.left = "-9999px";
      wrapper.style.top = "0";
      document.body.appendChild(wrapper);

      const clone = slideRef.current.cloneNode(true) as HTMLElement;
      clone.style.width = "100%";
      clone.style.height = "100%";
      wrapper.appendChild(clone);

      const canvas = await html2canvas(wrapper, {
        width: 1080,
        height: 1920,
        scale: 1,
        useCORS: true,
        backgroundColor: null,
      });

      document.body.removeChild(wrapper);

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        if (navigator.share && navigator.canShare) {
          const file = new File(
            [blob],
            `cfl-wrapped-${member.voornaam}.png`,
            { type: "image/png" }
          );

          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: "Mijn CrossFit Leiden Wrapped 2025",
            });
            setIsGenerating(false);
            return;
          }
        }

        handleDownloadSlide();
      }, "image/png");
    } catch (error) {
      console.error("Error sharing:", error);
      handleDownloadSlide();
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Hidden summary card for download */}
      <div
        ref={summaryRef}
        className="fixed left-[-9999px] top-0 w-[1080px] h-[1920px] bg-gradient-to-br from-[#EF4C37] to-[#D43A28] text-white flex flex-col items-center justify-center p-16"
      >
        <div className="text-center mb-12">
          <div className="w-64 h-32 relative mx-auto mb-8">
            <img
              src="/cfl-logo.png"
              alt="CrossFit Leiden"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-6xl font-black mb-4">{member.voornaam}</h1>
          <p className="text-3xl opacity-90">Wrapped 2025</p>
        </div>

        <div className="w-full max-w-2xl space-y-8">
          <div className="bg-white/20 rounded-3xl p-8 text-center">
            <p className="text-2xl opacity-80 mb-2">Trainingen</p>
            <p className="text-7xl font-black">{member.bezoeken}</p>
            <p className="text-xl opacity-70 mt-2">
              gemiddeld: {Math.round(communityStats.avgBezoeken)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/20 rounded-3xl p-6 text-center">
              <p className="text-xl opacity-80 mb-2">Favoriete dag</p>
              <p className="text-3xl font-black capitalize">
                {member.favoriete_dag}
              </p>
            </div>
            <div className="bg-white/20 rounded-3xl p-6 text-center">
              <p className="text-xl opacity-80 mb-2">Top</p>
              <p className="text-3xl font-black">{member.percentile}%</p>
            </div>
          </div>

          <div className="bg-white/20 rounded-3xl p-8 text-center">
            <p className="text-2xl opacity-80 mb-2">Favoriete coach</p>
            <p className="text-3xl font-black">{member.favoriete_coaches}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/20 rounded-3xl p-6 text-center">
              <p className="text-xl opacity-80 mb-2">Topmaand</p>
              <p className="text-2xl font-black capitalize">
                {member.top_maand}
              </p>
            </div>
            <div className="bg-white/20 rounded-3xl p-6 text-center">
              <p className="text-xl opacity-80 mb-2">Afmeldingen</p>
              <p className="text-2xl font-black">{member.afmeldingen}x</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center opacity-80">
          <p className="text-2xl">crossfitleiden.nl</p>
        </div>
      </div>

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
            className="flex items-center gap-2 bg-white text-[#EF4C37] px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform disabled:opacity-50"
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
