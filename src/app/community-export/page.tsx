"use client";

import { useState } from "react";
import coachData from "@/data/coach-wrapped-data.json";

// Community stats - update these with real data
const COMMUNITY_STATS = {
  totaalBezoeken: 39326,
  totaalLeden: 480,
  populairsteLes: "CFL Training",
  populairsteLesBezoeken: 25000,
  favorieteDay: "Woensdag",
  favoriteDayCount: 8500,
  favoriteTijd: "09:00",
  earlyBirds: 12000,
  nightOwls: 8000,
  druksteDag: "6 januari 2025",
  druksteDagCount: 250,
  rustigsteDag: "25 december 2025",
  rustigsteDagCount: 45,
  druksteLes: "CFL TRAINING",
  druksteLesDate: "6 januari 2025",
  druksteLesTijd: "09:00",
  druksteLesDeelnemers: 32,
  gymBuddyDuos: 450,
  sterksteBuddySessies: 97,
  afmeldingen: 15000,
};

// Get top 3 coaches by lessons given
const coaches = Object.values(coachData) as Array<{
  voornaam: string;
  lessen_gegeven: number;
}>;
const topCoaches = coaches
  .sort((a, b) => b.lessen_gegeven - a.lessen_gegeven)
  .slice(0, 3);

type SlideType = "story" | "post";

const CAROUSEL_CAPTION = `🎉 CROSSFIT LEIDEN WRAPPED 2025

Wat. Een. Jaar.

${COMMUNITY_STATS.totaalBezoeken.toLocaleString("nl-NL")} bezoeken. ${COMMUNITY_STATS.totaalLeden} leden. 15 coaches.

🏆 Top Coaches:
🥇 ${topCoaches[0]?.voornaam} - ${topCoaches[0]?.lessen_gegeven} lessen
🥈 ${topCoaches[1]?.voornaam} - ${topCoaches[1]?.lessen_gegeven} lessen
🥉 ${topCoaches[2]?.voornaam} - ${topCoaches[2]?.lessen_gegeven} lessen

🤝 ${COMMUNITY_STATS.gymBuddyDuos} gym buddy duo's (10+ sessies samen)

Bedankt voor elk bezoek, elke rep, elke druppel zweet. 💪

Fijne feestdagen en tot in 2026! 🎉

#CrossFitLeiden #Wrapped2025 #Community #CFLFamily`;

export default function CommunityExportPage() {
  const [activeTab, setActiveTab] = useState<SlideType>("story");
  const [downloading, setDownloading] = useState(false);
  const [captionCopied, setCaptionCopied] = useState(false);

  const downloadSlide = async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const html2canvas = (await import("html2canvas")).default;

    // Preview size vs export size - need to scale 4x for stories (270->1080), 3.375x for posts (320->1080)
    const isStory = elementId.startsWith("story");
    const targetWidth = 1080;
    const targetHeight = isStory ? 1920 : 1080;
    const scaleFactor = isStory ? 4 : 3.375;

    const wrapper = document.createElement("div");
    wrapper.style.width = `${targetWidth}px`;
    wrapper.style.height = `${targetHeight}px`;
    wrapper.style.position = "fixed";
    wrapper.style.left = "-9999px";
    wrapper.style.top = "0";
    wrapper.style.overflow = "hidden";
    document.body.appendChild(wrapper);

    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.width = isStory ? "270px" : "320px";
    clone.style.height = isStory ? "480px" : "320px";
    clone.style.borderRadius = "0";
    clone.style.transform = `scale(${scaleFactor})`;
    clone.style.transformOrigin = "top left";
    wrapper.appendChild(clone);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const canvas = await (html2canvas as any)(wrapper, {
        width: targetWidth,
        height: targetHeight,
        scale: 1,
        useCORS: true,
        backgroundColor: null,
      });

      const link = document.createElement("a");
      link.download = filename + ".png";
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export mislukt. Probeer het opnieuw.");
    } finally {
      document.body.removeChild(wrapper);
    }
  };

  const downloadAll = async () => {
    setDownloading(true);
    const prefix = activeTab === "story" ? "story" : "post";
    const count = activeTab === "story" ? 12 : 11;

    for (let i = 1; i <= count; i++) {
      const slideId = `${prefix}-${i}`;
      const filename = `cfl-wrapped-${slideId}`;
      await downloadSlide(slideId, filename);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
    setDownloading(false);
  };

  const copyCaption = () => {
    navigator.clipboard.writeText(CAROUSEL_CAPTION).then(() => {
      setCaptionCopied(true);
      setTimeout(() => setCaptionCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-[#111] text-white p-10">
      <h1 className="text-3xl font-bold text-center mb-2">
        CFL Community Wrapped 2025
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Klik op &quot;Download PNG&quot; om elke slide te exporteren
      </p>

      {/* Tabs */}
      <div className="flex justify-center gap-5 mb-8">
        <button
          onClick={() => setActiveTab("story")}
          className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
            activeTab === "story" ? "bg-[#EF4C37]" : "bg-[#333] hover:bg-[#444]"
          }`}
        >
          Stories (9:16) - 12 slides
        </button>
        <button
          onClick={() => setActiveTab("post")}
          className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
            activeTab === "post" ? "bg-[#EF4C37]" : "bg-[#333] hover:bg-[#444]"
          }`}
        >
          Posts (1:1) - 11 slides
        </button>
      </div>

      {/* Download All Button */}
      <button
        onClick={downloadAll}
        disabled={downloading}
        className="block mx-auto mb-10 px-8 py-3.5 bg-[#EF4C37] rounded-lg font-semibold text-lg hover:bg-[#d43a28] transition-colors disabled:opacity-50"
      >
        {downloading ? "⏳ Downloaden..." : "⬇️ Download Alle Slides"}
      </button>

      {/* Caption for Posts */}
      {activeTab === "post" && (
        <div className="max-w-xl mx-auto mb-10 bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
          <div className="text-sm text-gray-500 uppercase tracking-wider mb-3">
            Caption voor carousel post:
          </div>
          <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line max-h-[200px] overflow-y-auto mb-4 font-mono">
            {CAROUSEL_CAPTION}
          </div>
          <button
            onClick={copyCaption}
            className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
              captionCopied ? "bg-[#0CBABA]" : "bg-[#333] hover:bg-[#444]"
            }`}
          >
            {captionCopied ? "✅ Gekopieerd!" : "📋 Kopieer Caption"}
          </button>
        </div>
      )}

      {/* Stories */}
      {activeTab === "story" && (
        <div className="flex flex-wrap gap-8 justify-center">
          {/* Story 1: Intro */}
          <SlideWrapper label="Story 1 - Intro">
            <StorySlide id="story-1" bg="coral">
              <div className="text-5xl mb-4">🎉</div>
              <div className="text-2xl font-black">CrossFit Leiden</div>
              <div className="text-[42px] font-black mt-2">WRAPPED</div>
              <div className="text-xl font-bold">2025</div>
              <StatBox style={{ marginTop: "24px" }}>Wat een jaar was dit...</StatBox>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-1", "cfl-wrapped-story-1-intro")} />
          </SlideWrapper>

          {/* Story 2: Totaal bezoeken */}
          <SlideWrapper label="Story 2 - Bezoeken">
            <StorySlide id="story-2" bg="teal">
              <div className="text-5xl mb-4">💪</div>
              <div className="text-sm opacity-90 mb-2">Samen kwamen we</div>
              <div className="text-[56px] font-black leading-none">
                {COMMUNITY_STATS.totaalBezoeken.toLocaleString("nl-NL")}
              </div>
              <div className="text-xl font-bold mt-1">keer trainen</div>
              <StatBox>met {COMMUNITY_STATS.totaalLeden} leden</StatBox>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-2", "cfl-wrapped-story-2-bezoeken")} />
          </SlideWrapper>

          {/* Story 3: Populairste les */}
          <SlideWrapper label="Story 3 - Populairste Les">
            <StorySlide id="story-3" bg="coral">
              <div className="text-5xl mb-4">🏋️</div>
              <div className="text-sm opacity-90 mb-2">Populairste les</div>
              <div className="text-2xl font-black">{COMMUNITY_STATS.populairsteLes}</div>
              <StatBox style={{ marginTop: "16px" }}>
                <span style={{ fontSize: "24px", fontWeight: 900 }}>{COMMUNITY_STATS.populairsteLesBezoeken.toLocaleString("nl-NL")}</span>
                <br />
                <span>bezoeken</span>
              </StatBox>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-3", "cfl-wrapped-story-3-les")} />
          </SlideWrapper>

          {/* Story 4: Favoriete dag */}
          <SlideWrapper label="Story 4 - Favoriete Dag">
            <StorySlide id="story-4" bg="yellow">
              <div className="text-5xl mb-4">📅</div>
              <div className="text-sm opacity-90 mb-2">Jullie favoriete dag?</div>
              <div className="text-4xl font-black">{COMMUNITY_STATS.favorieteDay}</div>
              <StatBox style={{ marginTop: "16px" }}>
                {COMMUNITY_STATS.favoriteDayCount.toLocaleString("nl-NL")} bezoeken
                <br />
                <span style={{ fontSize: "12px", opacity: 0.7 }}>Midden in de week knallen 🔥</span>
              </StatBox>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-4", "cfl-wrapped-story-4-dag")} />
          </SlideWrapper>

          {/* Story 5: Favoriete tijd */}
          <SlideWrapper label="Story 5 - Favoriete Tijd">
            <StorySlide id="story-5" bg="purple">
              <div className="text-5xl mb-4">⏰</div>
              <div className="text-sm opacity-90 mb-2">Populairste tijd</div>
              <div className="text-5xl font-black">{COMMUNITY_STATS.favoriteTijd}</div>
              <div className="flex gap-3 mt-4">
                <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
                  <div className="text-lg font-black">☀️ {COMMUNITY_STATS.earlyBirds.toLocaleString("nl-NL")}</div>
                  <div className="text-xs opacity-80">early birds</div>
                </div>
                <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
                  <div className="text-lg font-black">🌙 {COMMUNITY_STATS.nightOwls.toLocaleString("nl-NL")}</div>
                  <div className="text-xs opacity-80">night owls</div>
                </div>
              </div>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-5", "cfl-wrapped-story-5-tijd")} />
          </SlideWrapper>

          {/* Story 6: Drukste Dag */}
          <SlideWrapper label="Story 6 - Drukste Dag">
            <StorySlide id="story-6" bg="coral">
              <div className="text-5xl mb-4">🔥</div>
              <div className="text-sm opacity-90 mb-2">Drukste dag van het jaar</div>
              <div className="text-xl font-black">{COMMUNITY_STATS.druksteDag}</div>
              <StatBox style={{ marginTop: "16px" }}>
                <span style={{ fontSize: "30px", fontWeight: 900 }}>{COMMUNITY_STATS.druksteDagCount}</span>
                <br />
                <span>bezoeken</span>
              </StatBox>
              <div style={{ fontSize: "12px", opacity: 0.7, marginTop: "12px" }}>Wat een start van het jaar! 💪</div>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-6", "cfl-wrapped-story-6-drukste-dag")} />
          </SlideWrapper>

          {/* Story 7: Rustigste Dag */}
          <SlideWrapper label="Story 7 - Rustigste Dag">
            <StorySlide id="story-7" bg="teal">
              <div className="text-5xl mb-4">😴</div>
              <div className="text-sm opacity-90 mb-2">Rustigste dag van het jaar</div>
              <div className="text-xl font-black">{COMMUNITY_STATS.rustigsteDag}</div>
              <StatBox style={{ marginTop: "16px" }}>
                <span style={{ fontSize: "30px", fontWeight: 900 }}>{COMMUNITY_STATS.rustigsteDagCount}</span>
                <br />
                <span>bezoeken</span>
              </StatBox>
              <div style={{ fontSize: "12px", opacity: 0.7, marginTop: "12px" }}>Kerst = rust... snappen we 😉</div>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-7", "cfl-wrapped-story-7-rustigste-dag")} />
          </SlideWrapper>

          {/* Story 8: Drukste Les */}
          <SlideWrapper label="Story 8 - Drukste Les">
            <StorySlide id="story-8" bg="yellow">
              <div className="text-5xl mb-4">🏆</div>
              <div className="text-sm opacity-90 mb-2">Drukste les van het jaar</div>
              <div className="text-lg font-black">{COMMUNITY_STATS.druksteLes}</div>
              <div className="text-sm opacity-70">{COMMUNITY_STATS.druksteLesDate} • {COMMUNITY_STATS.druksteLesTijd}</div>
              <StatBox style={{ marginTop: "16px" }}>
                <span style={{ fontSize: "30px", fontWeight: 900 }}>{COMMUNITY_STATS.druksteLesDeelnemers}</span>
                <br />
                <span>deelnemers</span>
              </StatBox>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-8", "cfl-wrapped-story-8-drukste-les")} />
          </SlideWrapper>

          {/* Story 9: Top Coaches */}
          <SlideWrapper label="Story 9 - Top Coaches">
            <StorySlide id="story-9" bg="coral">
              <div className="text-5xl mb-4">🏆</div>
              <div className="text-sm opacity-90 mb-2">Meeste groepslessen</div>
              <div className="w-full max-w-[220px] flex flex-col gap-2 mt-4">
                {topCoaches.map((coach, i) => (
                  <div key={coach.voornaam} className="bg-white/20 rounded-lg px-4 py-2.5 flex justify-between items-center">
                    <span className="font-bold">{["🥇", "🥈", "🥉"][i]} {coach.voornaam}</span>
                    <span className="opacity-70 text-sm">{coach.lessen_gegeven}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: "12px", opacity: 0.7, marginTop: "12px" }}>groepslessen gegeven</div>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-9", "cfl-wrapped-story-9-coaches")} />
          </SlideWrapper>

          {/* Story 10: Buddies */}
          <SlideWrapper label="Story 10 - Gym Buddies">
            <StorySlide id="story-10" bg="teal">
              <div className="text-5xl mb-4">🤝</div>
              <div className="text-sm opacity-90 mb-2">Community vibes</div>
              <div className="text-[56px] font-black leading-none">{COMMUNITY_STATS.gymBuddyDuos}</div>
              <div className="text-xl font-bold mt-1">gym buddy duo&apos;s</div>
              <div className="text-xs opacity-70">(10+ sessies samen)</div>
              <StatBox style={{ marginTop: "20px" }}>
                <div style={{ fontSize: "12px", opacity: 0.7 }}>Sterkste buddies:</div>
                <div style={{ fontSize: "30px", fontWeight: 900 }}>{COMMUNITY_STATS.sterksteBuddySessies}x</div>
                <div style={{ fontSize: "12px", opacity: 0.7 }}>samen getraind</div>
              </StatBox>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-10", "cfl-wrapped-story-10-buddies")} />
          </SlideWrapper>

          {/* Story 11: Afmeldingen */}
          <SlideWrapper label="Story 11 - Afmeldingen">
            <StorySlide id="story-11" bg="dark">
              <div className="text-5xl mb-4">😅</div>
              <div className="text-sm opacity-90 mb-2">En ja...</div>
              <div className="text-[56px] font-black leading-none">{COMMUNITY_STATS.afmeldingen.toLocaleString("nl-NL")}</div>
              <div className="text-xl font-bold mt-1">afmeldingen</div>
              <StatBox style={{}}>In 2026 doen we beter... toch? 😉</StatBox>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-11", "cfl-wrapped-story-11-afmeldingen")} />
          </SlideWrapper>

          {/* Story 12: Outro */}
          <SlideWrapper label="Story 12 - Outro">
            <StorySlide id="story-12" bg="coral">
              <div className="text-5xl mb-4">❤️</div>
              <div className="text-sm opacity-90 mb-2">Bedankt voor</div>
              <div className="text-2xl font-black">een geweldig 2025</div>
              <StatBox style={{ marginTop: "24px" }}>
                <div>Op naar een sterk en gezond</div>
                <div style={{ fontSize: "30px", fontWeight: 900, marginTop: "4px" }}>2026! 🎉</div>
              </StatBox>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-12", "cfl-wrapped-story-12-outro")} />
          </SlideWrapper>
        </div>
      )}

      {/* Posts */}
      {activeTab === "post" && (
        <div className="flex flex-wrap gap-8 justify-center">
          {/* Post 1: Hero */}
          <SlideWrapper label="Post 1 - Hero">
            <PostSlide id="post-1" bg="coral">
              <div className="text-xs uppercase tracking-widest opacity-80">CrossFit Leiden 2025</div>
              <div className="text-6xl font-black my-2">{COMMUNITY_STATS.totaalBezoeken.toLocaleString("nl-NL")}</div>
              <div className="text-xl font-bold">bezoeken</div>
              <div className="flex gap-3 mt-4">
                <div className="bg-white/20 rounded-lg px-4 py-2 text-center">
                  <div className="text-xl font-black">{COMMUNITY_STATS.totaalLeden}</div>
                  <div className="text-xs opacity-80">leden</div>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2 text-center">
                  <div className="text-xl font-black">15</div>
                  <div className="text-xs opacity-80">coaches</div>
                </div>
              </div>
            </PostSlide>
            <DownloadButton onClick={() => downloadSlide("post-1", "cfl-wrapped-post-1-hero")} />
          </SlideWrapper>

          {/* Post 2: Dag & Tijd */}
          <SlideWrapper label="Post 2 - Dag & Tijd">
            <PostSlide id="post-2" bg="teal">
              <div className="text-4xl mb-2">📅</div>
              <div className="text-xs uppercase tracking-widest opacity-80">Jullie favoriete moment</div>
              <div className="text-3xl font-black my-2">{COMMUNITY_STATS.favorieteDay}</div>
              <div className="text-3xl font-black opacity-80">{COMMUNITY_STATS.favoriteTijd}</div>
              <div className="flex gap-3 mt-4">
                <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
                  <div className="text-lg font-black">☀️ {COMMUNITY_STATS.earlyBirds.toLocaleString("nl-NL")}</div>
                  <div className="text-xs opacity-80">early birds</div>
                </div>
                <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
                  <div className="text-lg font-black">🌙 {COMMUNITY_STATS.nightOwls.toLocaleString("nl-NL")}</div>
                  <div className="text-xs opacity-80">night owls</div>
                </div>
              </div>
            </PostSlide>
            <DownloadButton onClick={() => downloadSlide("post-2", "cfl-wrapped-post-2-dag-tijd")} />
          </SlideWrapper>

          {/* Post 3: Populairste Les */}
          <SlideWrapper label="Post 3 - Populairste Les">
            <PostSlide id="post-3" bg="coral">
              <div className="text-4xl mb-2">🏋️</div>
              <div className="text-xs uppercase tracking-widest opacity-80">Populairste les</div>
              <div className="text-2xl font-black my-2">{COMMUNITY_STATS.populairsteLes}</div>
              <StatBox style={{ marginTop: "16px" }}>
                <span style={{ fontSize: "24px", fontWeight: 900 }}>{COMMUNITY_STATS.populairsteLesBezoeken.toLocaleString("nl-NL")}</span>
                <br />
                <span>bezoeken</span>
              </StatBox>
            </PostSlide>
            <DownloadButton onClick={() => downloadSlide("post-3", "cfl-wrapped-post-3-les")} />
          </SlideWrapper>

          {/* Post 4: Drukste Dag */}
          <SlideWrapper label="Post 4 - Drukste Dag">
            <PostSlide id="post-4" bg="teal">
              <div className="text-4xl mb-2">🔥</div>
              <div className="text-xs uppercase tracking-widest opacity-80">Drukste dag</div>
              <div className="text-xl font-black my-2">{COMMUNITY_STATS.druksteDag}</div>
              <StatBox style={{ marginTop: "16px" }}>
                <span style={{ fontSize: "30px", fontWeight: 900 }}>{COMMUNITY_STATS.druksteDagCount}</span>
                <br />
                <span>bezoeken</span>
              </StatBox>
            </PostSlide>
            <DownloadButton onClick={() => downloadSlide("post-4", "cfl-wrapped-post-4-drukste-dag")} />
          </SlideWrapper>

          {/* Post 5: Rustigste Dag */}
          <SlideWrapper label="Post 5 - Rustigste Dag">
            <PostSlide id="post-5" bg="purple">
              <div className="text-4xl mb-2">😴</div>
              <div className="text-xs uppercase tracking-widest opacity-80">Rustigste dag</div>
              <div className="text-xl font-black my-2">{COMMUNITY_STATS.rustigsteDag}</div>
              <StatBox style={{ marginTop: "16px" }}>
                <span style={{ fontSize: "30px", fontWeight: 900 }}>{COMMUNITY_STATS.rustigsteDagCount}</span>
                <br />
                <span>bezoeken</span>
              </StatBox>
              <div style={{ fontSize: "12px", opacity: 0.7, marginTop: "8px" }}>Kerst = rust 😉</div>
            </PostSlide>
            <DownloadButton onClick={() => downloadSlide("post-5", "cfl-wrapped-post-5-rustigste-dag")} />
          </SlideWrapper>

          {/* Post 6: Drukste Les */}
          <SlideWrapper label="Post 6 - Drukste Les">
            <PostSlide id="post-6" bg="yellow">
              <div className="text-4xl mb-2">🏆</div>
              <div className="text-xs uppercase tracking-widest opacity-80">Drukste les</div>
              <div className="text-lg font-black">{COMMUNITY_STATS.druksteLes}</div>
              <div className="text-sm opacity-70">{COMMUNITY_STATS.druksteLesDate}</div>
              <StatBox style={{ marginTop: "16px" }}>
                <span style={{ fontSize: "30px", fontWeight: 900 }}>{COMMUNITY_STATS.druksteLesDeelnemers}</span>
                <br />
                <span>deelnemers</span>
              </StatBox>
            </PostSlide>
            <DownloadButton onClick={() => downloadSlide("post-6", "cfl-wrapped-post-6-drukste-les")} />
          </SlideWrapper>

          {/* Post 7: Top Coaches */}
          <SlideWrapper label="Post 7 - Coaches">
            <PostSlide id="post-7" bg="coral">
              <div className="text-4xl mb-2">🏆</div>
              <div className="text-xs uppercase tracking-widest opacity-80">Meeste groepslessen</div>
              <div className="w-full max-w-[220px] flex flex-col gap-2 mt-3">
                {topCoaches.map((coach, i) => (
                  <div key={coach.voornaam} style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "8px", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 700 }}>{["🥇", "🥈", "🥉"][i]} {coach.voornaam}</span>
                    <span style={{ opacity: 0.7, fontSize: "14px" }}>{coach.lessen_gegeven}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: "12px", opacity: 0.7, marginTop: "8px" }}>groepslessen gegeven</div>
            </PostSlide>
            <DownloadButton onClick={() => downloadSlide("post-7", "cfl-wrapped-post-7-coaches")} />
          </SlideWrapper>

          {/* Post 8: Early Birds vs Night Owls */}
          <SlideWrapper label="Post 8 - Tijden">
            <PostSlide id="post-8" bg="teal">
              <div className="text-4xl mb-2">⏰</div>
              <div className="text-xs uppercase tracking-widest opacity-80">Wanneer trainen jullie?</div>
              <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                <div style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
                  <div style={{ fontSize: "18px", fontWeight: 900 }}>☀️ {COMMUNITY_STATS.earlyBirds.toLocaleString("nl-NL")}</div>
                  <div style={{ fontSize: "12px", opacity: 0.8 }}>early birds</div>
                </div>
                <div style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
                  <div style={{ fontSize: "18px", fontWeight: 900 }}>🌙 {COMMUNITY_STATS.nightOwls.toLocaleString("nl-NL")}</div>
                  <div style={{ fontSize: "12px", opacity: 0.8 }}>night owls</div>
                </div>
              </div>
            </PostSlide>
            <DownloadButton onClick={() => downloadSlide("post-8", "cfl-wrapped-post-8-tijden")} />
          </SlideWrapper>

          {/* Post 9: Gym Buddies */}
          <SlideWrapper label="Post 9 - Buddies">
            <PostSlide id="post-9" bg="purple">
              <div className="text-4xl mb-2">🤝</div>
              <div className="text-xs uppercase tracking-widest opacity-80">Gym Buddies</div>
              <div className="text-6xl font-black my-2">{COMMUNITY_STATS.gymBuddyDuos}</div>
              <div className="text-sm font-bold">duo&apos;s met 10+ sessies samen</div>
              <StatBox style={{ marginTop: "16px" }}>
                <div style={{ fontSize: "12px", opacity: 0.7 }}>Sterkste buddies</div>
                <div style={{ fontSize: "24px", fontWeight: 900 }}>{COMMUNITY_STATS.sterksteBuddySessies}x samen</div>
              </StatBox>
            </PostSlide>
            <DownloadButton onClick={() => downloadSlide("post-9", "cfl-wrapped-post-9-buddies")} />
          </SlideWrapper>

          {/* Post 10: Afmeldingen */}
          <SlideWrapper label="Post 10 - Afmeldingen">
            <PostSlide id="post-10" bg="dark">
              <div className="text-4xl mb-2">😅</div>
              <div className="text-xs uppercase tracking-widest opacity-80">En ja...</div>
              <div className="text-5xl font-black my-2">{COMMUNITY_STATS.afmeldingen.toLocaleString("nl-NL")}</div>
              <div className="text-lg font-bold">afmeldingen</div>
              <StatBox style={{ marginTop: "16px" }}>In 2026 beter? 😉</StatBox>
            </PostSlide>
            <DownloadButton onClick={() => downloadSlide("post-10", "cfl-wrapped-post-10-afmeldingen")} />
          </SlideWrapper>

          {/* Post 11: Thank you */}
          <SlideWrapper label="Post 11 - Outro">
            <PostSlide id="post-11" bg="coral">
              <div className="text-4xl mb-2">❤️</div>
              <div className="text-xs uppercase tracking-widest opacity-80">Bedankt voor 2025</div>
              <div className="text-xl font-black my-3">Op naar een sterk</div>
              <div className="text-[56px] font-black">2026</div>
              <StatBox style={{ marginTop: "16px", fontSize: "14px" }}>
                🎉 Fijne feestdagen<br />
                💪 Tot op de vloer
              </StatBox>
            </PostSlide>
            <DownloadButton onClick={() => downloadSlide("post-11", "cfl-wrapped-post-11-outro")} />
          </SlideWrapper>
        </div>
      )}
    </div>
  );
}

// Components
function SlideWrapper({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
      {children}
    </div>
  );
}

function StorySlide({ id, bg, children }: { id: string; bg: string; children: React.ReactNode }) {
  const bgStyles: Record<string, React.CSSProperties> = {
    coral: { background: "linear-gradient(135deg, #EF4C37 0%, #c93d2d 100%)" },
    teal: { background: "linear-gradient(135deg, #0CBABA 0%, #099999 100%)" },
    yellow: { background: "linear-gradient(135deg, #F7CB15 0%, #e5b800 100%)", color: "#1a1a1a" },
    purple: { background: "linear-gradient(135deg, #7B6D8D 0%, #5d5169 100%)" },
    dark: { background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)" },
  };

  return (
    <div
      id={id}
      style={{
        width: "270px",
        height: "480px",
        borderRadius: "16px",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "24px",
        color: "white",
        ...bgStyles[bg],
      }}
    >
      {children}
      <div style={{
        position: "absolute",
        bottom: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: "10px",
        fontWeight: "bold",
        letterSpacing: "0.1em",
        opacity: 0.6,
      }}>
        CROSSFIT LEIDEN
      </div>
    </div>
  );
}

function PostSlide({ id, bg, children }: { id: string; bg: string; children: React.ReactNode }) {
  const bgStyles: Record<string, React.CSSProperties> = {
    coral: { background: "linear-gradient(135deg, #EF4C37 0%, #c93d2d 100%)" },
    teal: { background: "linear-gradient(135deg, #0CBABA 0%, #099999 100%)" },
    yellow: { background: "linear-gradient(135deg, #F7CB15 0%, #e5b800 100%)", color: "#1a1a1a" },
    purple: { background: "linear-gradient(135deg, #7B6D8D 0%, #5d5169 100%)" },
    dark: { background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)" },
  };

  return (
    <div
      id={id}
      style={{
        width: "320px",
        height: "320px",
        borderRadius: "12px",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "24px",
        color: "white",
        ...bgStyles[bg],
      }}
    >
      {children}
      <div style={{
        position: "absolute",
        bottom: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: "10px",
        fontWeight: "bold",
        letterSpacing: "0.1em",
        opacity: 0.6,
      }}>
        CROSSFIT LEIDEN
      </div>
    </div>
  );
}

function StatBox({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderRadius: "12px",
      padding: "12px 16px",
      fontSize: "14px",
      ...style,
    }}>
      {children}
    </div>
  );
}

function DownloadButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-5 py-2.5 bg-[#EF4C37] rounded-lg text-sm font-semibold hover:scale-105 transition-transform"
    >
      Download PNG
    </button>
  );
}
