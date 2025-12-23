"use client";

import { useState } from "react";
import coachData from "@/data/coach-wrapped-data.json";

// Community stats - update these with real data
const COMMUNITY_STATS = {
  totalVisits: 39326,
  totalMembers: 480,
  popularClass: "CFL Training",
  popularClassVisits: 25000,
  favoriteDay: "Wednesday",
  favoriteDayCount: 8500,
  favoriteTime: "09:00",
  earlyBirds: 12000,
  nightOwls: 8000,
  busiestDay: "January 6, 2025",
  busiestDayCount: 250,
  quietestDay: "December 25, 2025",
  quietestDayCount: 45,
  busiestClass: "CFL TRAINING",
  busiestClassDate: "January 6, 2025",
  busiestClassTime: "09:00",
  busiestClassAttendees: 32,
  gymBuddyDuos: 450,
  strongestBuddySessions: 97,
  cancellations: 15000,
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

What. A. Year.

${COMMUNITY_STATS.totalVisits.toLocaleString("en-US")} visits. ${COMMUNITY_STATS.totalMembers} members. 15 coaches.

🏆 Top Coaches:
🥇 ${topCoaches[0]?.voornaam} - ${topCoaches[0]?.lessen_gegeven} classes
🥈 ${topCoaches[1]?.voornaam} - ${topCoaches[1]?.lessen_gegeven} classes
🥉 ${topCoaches[2]?.voornaam} - ${topCoaches[2]?.lessen_gegeven} classes

🤝 ${COMMUNITY_STATS.gymBuddyDuos} gym buddy duos (10+ sessions together)

Thank you for every visit, every rep, every drop of sweat. 💪

Happy holidays and see you in 2026! 🎉

#CrossFitLeiden #Wrapped2025 #Community #CFLFamily`;

export default function CommunityExportPage() {
  const [activeTab, setActiveTab] = useState<SlideType>("story");
  const [downloading, setDownloading] = useState(false);
  const [captionCopied, setCaptionCopied] = useState(false);

  const downloadSlide = async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const html2canvas = (await import("html2canvas")).default;

    // Export at higher resolution for quality
    const isStory = elementId.startsWith("story");
    const targetWidth = 1080;
    const targetHeight = isStory ? 1920 : 1080;

    // Calculate scale based on original element size
    const originalWidth = isStory ? 270 : 320;
    const originalHeight = isStory ? 480 : 320;
    const scaleX = targetWidth / originalWidth;
    const scaleY = targetHeight / originalHeight;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const canvas = await (html2canvas as any)(element, {
        scale: scaleX, // Use scale option instead of CSS transform
        width: originalWidth,
        height: originalHeight,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      // Resize canvas to exact target dimensions if needed
      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = targetWidth;
      finalCanvas.height = targetHeight;
      const ctx = finalCanvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(canvas, 0, 0, targetWidth, targetHeight);
      }

      const link = document.createElement("a");
      link.download = filename + ".png";
      link.href = finalCanvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    }
  };

  const downloadAll = async () => {
    setDownloading(true);
    const prefix = activeTab === "story" ? "story" : "post";
    const count = activeTab === "story" ? 13 : 12;

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
        Click &quot;Download PNG&quot; to export each slide
      </p>

      {/* Tabs */}
      <div className="flex justify-center gap-5 mb-8">
        <button
          onClick={() => setActiveTab("story")}
          className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
            activeTab === "story" ? "bg-[#EF4C37]" : "bg-[#333] hover:bg-[#444]"
          }`}
        >
          Stories (9:16) - 13 slides
        </button>
        <button
          onClick={() => setActiveTab("post")}
          className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
            activeTab === "post" ? "bg-[#EF4C37]" : "bg-[#333] hover:bg-[#444]"
          }`}
        >
          Posts (1:1) - 12 slides
        </button>
      </div>

      {/* Download All Button */}
      <button
        onClick={downloadAll}
        disabled={downloading}
        className="block mx-auto mb-10 px-8 py-3.5 bg-[#EF4C37] rounded-lg font-semibold text-lg hover:bg-[#d43a28] transition-colors disabled:opacity-50"
      >
        {downloading ? "⏳ Downloading..." : "⬇️ Download All Slides"}
      </button>

      {/* Caption for Posts */}
      {activeTab === "post" && (
        <div className="max-w-xl mx-auto mb-10 bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
          <div className="text-sm text-gray-500 uppercase tracking-wider mb-3">
            Caption for carousel post:
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
            {captionCopied ? "✅ Copied!" : "📋 Copy Caption"}
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
              <StatBox style={{ marginTop: "24px" }}>What a year it was...</StatBox>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-1", "cfl-wrapped-story-1-intro")} />
          </SlideWrapper>

          {/* Story 2: Total visits */}
          <SlideWrapper label="Story 2 - Visits">
            <StorySlide id="story-2" bg="teal">
              <div className="text-5xl mb-4">💪</div>
              <div className="text-sm opacity-90 mb-2">Together we trained</div>
              <div className="text-[56px] font-black leading-none">
                {COMMUNITY_STATS.totalVisits.toLocaleString("en-US")}
              </div>
              <div className="text-xl font-bold mt-1">times</div>
              <StatBox>with {COMMUNITY_STATS.totalMembers} members</StatBox>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-2", "cfl-wrapped-story-2-visits")} />
          </SlideWrapper>

          {/* Story 3: Most popular class */}
          <SlideWrapper label="Story 3 - Popular Class">
            <StorySlide id="story-3" bg="coral">
              <div className="text-5xl mb-4">🏋️</div>
              <div className="text-sm opacity-90 mb-2">Most popular class</div>
              <div className="text-2xl font-black">{COMMUNITY_STATS.popularClass}</div>
              <StatBox style={{ marginTop: "16px" }}>
                <span style={{ fontSize: "24px", fontWeight: 900 }}>{COMMUNITY_STATS.popularClassVisits.toLocaleString("en-US")}</span>
                <br />
                <span>visits</span>
              </StatBox>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-3", "cfl-wrapped-story-3-class")} />
          </SlideWrapper>

          {/* Story 4: Favorite day */}
          <SlideWrapper label="Story 4 - Favorite Day">
            <StorySlide id="story-4" bg="yellow">
              <div className="text-5xl mb-4">📅</div>
              <div className="text-sm opacity-90 mb-2">Your favorite day?</div>
              <div className="text-4xl font-black">{COMMUNITY_STATS.favoriteDay}</div>
              <StatBox style={{ marginTop: "16px" }}>
                {COMMUNITY_STATS.favoriteDayCount.toLocaleString("en-US")} visits
                <br />
                <span style={{ fontSize: "12px", opacity: 0.7 }}>Midweek warriors 🔥</span>
              </StatBox>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-4", "cfl-wrapped-story-4-day")} />
          </SlideWrapper>

          {/* Story 5: Favorite time */}
          <SlideWrapper label="Story 5 - Favorite Time">
            <StorySlide id="story-5" bg="purple">
              <div className="text-5xl mb-4">⏰</div>
              <div className="text-sm opacity-90 mb-2">Most popular time</div>
              <div className="text-5xl font-black">{COMMUNITY_STATS.favoriteTime}</div>
              <div className="flex gap-3 mt-4">
                <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
                  <div className="text-lg font-black">☀️ {COMMUNITY_STATS.earlyBirds.toLocaleString("en-US")}</div>
                  <div className="text-xs opacity-80">early birds</div>
                </div>
                <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
                  <div className="text-lg font-black">🌙 {COMMUNITY_STATS.nightOwls.toLocaleString("en-US")}</div>
                  <div className="text-xs opacity-80">night owls</div>
                </div>
              </div>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-5", "cfl-wrapped-story-5-time")} />
          </SlideWrapper>

          {/* Story 6: Busiest Day */}
          <SlideWrapper label="Story 6 - Busiest Day">
            <StorySlide id="story-6" bg="coral">
              <div className="text-5xl mb-4">🔥</div>
              <div className="text-sm opacity-90 mb-2">Busiest day of the year</div>
              <div className="text-xl font-black">{COMMUNITY_STATS.busiestDay}</div>
              <StatBox style={{ marginTop: "16px" }}>
                <span style={{ fontSize: "30px", fontWeight: 900 }}>{COMMUNITY_STATS.busiestDayCount}</span>
                <br />
                <span>visits</span>
              </StatBox>
              <div style={{ fontSize: "12px", opacity: 0.7, marginTop: "12px" }}>What a start to the year! 💪</div>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-6", "cfl-wrapped-story-6-busiest-day")} />
          </SlideWrapper>

          {/* Story 7: Quietest Day */}
          <SlideWrapper label="Story 7 - Quietest Day">
            <StorySlide id="story-7" bg="teal">
              <div className="text-5xl mb-4">😴</div>
              <div className="text-sm opacity-90 mb-2">Quietest day of the year</div>
              <div className="text-xl font-black">{COMMUNITY_STATS.quietestDay}</div>
              <StatBox style={{ marginTop: "16px" }}>
                <span style={{ fontSize: "30px", fontWeight: 900 }}>{COMMUNITY_STATS.quietestDayCount}</span>
                <br />
                <span>visits</span>
              </StatBox>
              <div style={{ fontSize: "12px", opacity: 0.7, marginTop: "12px" }}>Christmas = rest... we get it 😉</div>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-7", "cfl-wrapped-story-7-quietest-day")} />
          </SlideWrapper>

          {/* Story 8: Busiest Class */}
          <SlideWrapper label="Story 8 - Busiest Class">
            <StorySlide id="story-8" bg="yellow">
              <div className="text-5xl mb-4">🏆</div>
              <div className="text-sm opacity-90 mb-2">Busiest class of the year</div>
              <div className="text-lg font-black">{COMMUNITY_STATS.busiestClass}</div>
              <div className="text-sm opacity-70">{COMMUNITY_STATS.busiestClassDate} • {COMMUNITY_STATS.busiestClassTime}</div>
              <StatBox style={{ marginTop: "16px" }}>
                <span style={{ fontSize: "30px", fontWeight: 900 }}>{COMMUNITY_STATS.busiestClassAttendees}</span>
                <br />
                <span>attendees</span>
              </StatBox>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-8", "cfl-wrapped-story-8-busiest-class")} />
          </SlideWrapper>

          {/* Story 9: Top Coaches */}
          <SlideWrapper label="Story 9 - Top Coaches">
            <StorySlide id="story-9" bg="coral">
              <div className="text-5xl mb-4">🏆</div>
              <div className="text-sm opacity-90 mb-2">Most group classes</div>
              <div className="w-full max-w-[220px] flex flex-col gap-2 mt-4">
                {topCoaches.map((coach, i) => (
                  <div key={coach.voornaam} className="bg-white/20 rounded-lg px-4 py-2.5 flex justify-between items-center">
                    <span className="font-bold">{["🥇", "🥈", "🥉"][i]} {coach.voornaam}</span>
                    <span className="opacity-70 text-sm">{coach.lessen_gegeven}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: "12px", opacity: 0.7, marginTop: "12px" }}>group classes taught</div>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-9", "cfl-wrapped-story-9-coaches")} />
          </SlideWrapper>

          {/* Story 10: Buddies */}
          <SlideWrapper label="Story 10 - Gym Buddies">
            <StorySlide id="story-10" bg="teal">
              <div className="text-5xl mb-4">🤝</div>
              <div className="text-sm opacity-90 mb-2">Community vibes</div>
              <div className="text-[56px] font-black leading-none">{COMMUNITY_STATS.gymBuddyDuos}</div>
              <div className="text-xl font-bold mt-1">gym buddy duos</div>
              <div className="text-xs opacity-70">(10+ sessions together)</div>
              <StatBox style={{ marginTop: "20px" }}>
                <div style={{ fontSize: "12px", opacity: 0.7 }}>Strongest buddies:</div>
                <div style={{ fontSize: "30px", fontWeight: 900 }}>{COMMUNITY_STATS.strongestBuddySessions}x</div>
                <div style={{ fontSize: "12px", opacity: 0.7 }}>trained together</div>
              </StatBox>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-10", "cfl-wrapped-story-10-buddies")} />
          </SlideWrapper>

          {/* Story 11: Cancellations */}
          <SlideWrapper label="Story 11 - Cancellations">
            <StorySlide id="story-11" bg="dark">
              <div className="text-5xl mb-4">😅</div>
              <div className="text-sm opacity-90 mb-2">And yes...</div>
              <div className="text-[56px] font-black leading-none">{COMMUNITY_STATS.cancellations.toLocaleString("en-US")}</div>
              <div className="text-xl font-bold mt-1">cancellations</div>
              <StatBox style={{}}>We&apos;ll do better in 2026... right? 😉</StatBox>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-11", "cfl-wrapped-story-11-cancellations")} />
          </SlideWrapper>

          {/* Story 12: Outro */}
          <SlideWrapper label="Story 12 - Outro">
            <StorySlide id="story-12" bg="coral">
              <div className="text-5xl mb-4">❤️</div>
              <div className="text-sm opacity-90 mb-2">Thank you for</div>
              <div className="text-2xl font-black">an amazing 2025</div>
              <StatBox style={{ marginTop: "24px" }}>
                <div>Here&apos;s to a strong and healthy</div>
                <div style={{ fontSize: "30px", fontWeight: 900, marginTop: "4px" }}>2026! 🎉</div>
              </StatBox>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-12", "cfl-wrapped-story-12-outro")} />
          </SlideWrapper>

          {/* Story 13: CTA - View your Wrapped */}
          <SlideWrapper label="Story 13 - CTA">
            <StorySlide id="story-13" bg="teal">
              <div className="text-5xl mb-4">📧</div>
              <div className="text-sm opacity-90 mb-2">Curious about your stats?</div>
              <div className="text-2xl font-black">View your</div>
              <div className="text-3xl font-black mt-1">CFL WRAPPED</div>
              <StatBox style={{ marginTop: "24px" }}>
                <div style={{ fontSize: "12px", opacity: 0.8 }}>Check your email for</div>
                <div style={{ fontSize: "18px", fontWeight: 900, marginTop: "4px" }}>your personal code</div>
              </StatBox>
              <div style={{ marginTop: "16px", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "8px", padding: "8px 16px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700 }}>wrapped.crossfitleiden.com</div>
              </div>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-13", "cfl-wrapped-story-13-cta")} />
          </SlideWrapper>
        </div>
      )}

      {/* Posts */}
      {activeTab === "post" && (
        <div className="flex flex-wrap gap-8 justify-center">
          {/* Post 1: Hero */}
          <SlideWrapper label="Post 1 - Hero">
            <PostSlide id="post-1" bg="coral">
              <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.8 }}>CrossFit Leiden 2025</div>
              <div style={{ fontSize: "48px", fontWeight: 900, margin: "8px 0" }}>{COMMUNITY_STATS.totalVisits.toLocaleString("en-US")}</div>
              <div style={{ fontSize: "18px", fontWeight: 700 }}>visits</div>
              <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                <div style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "8px", padding: "8px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: "18px", fontWeight: 900 }}>{COMMUNITY_STATS.totalMembers}</div>
                  <div style={{ fontSize: "10px", opacity: 0.8 }}>members</div>
                </div>
                <div style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "8px", padding: "8px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: "18px", fontWeight: 900 }}>15</div>
                  <div style={{ fontSize: "10px", opacity: 0.8 }}>coaches</div>
                </div>
              </div>
            </PostSlide>
            <DownloadButton onClick={() => downloadSlide("post-1", "cfl-wrapped-post-1-hero")} />
          </SlideWrapper>

          {/* Post 2: Day & Time */}
          <SlideWrapper label="Post 2 - Day & Time">
            <PostSlide id="post-2" bg="teal">
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>📅</div>
              <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.8 }}>Your favorite moment</div>
              <div style={{ fontSize: "28px", fontWeight: 900, margin: "8px 0" }}>{COMMUNITY_STATS.favoriteDay}</div>
              <div style={{ fontSize: "28px", fontWeight: 900, opacity: 0.8 }}>{COMMUNITY_STATS.favoriteTime}</div>
              <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                <div style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "8px", padding: "8px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: "16px", fontWeight: 900 }}>☀️ {COMMUNITY_STATS.earlyBirds.toLocaleString("en-US")}</div>
                  <div style={{ fontSize: "10px", opacity: 0.8 }}>early birds</div>
                </div>
                <div style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "8px", padding: "8px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: "16px", fontWeight: 900 }}>🌙 {COMMUNITY_STATS.nightOwls.toLocaleString("en-US")}</div>
                  <div style={{ fontSize: "10px", opacity: 0.8 }}>night owls</div>
                </div>
              </div>
            </PostSlide>
            <DownloadButton onClick={() => downloadSlide("post-2", "cfl-wrapped-post-2-day-time")} />
          </SlideWrapper>

          {/* Post 3: Popular Class */}
          <SlideWrapper label="Post 3 - Popular Class">
            <PostSlide id="post-3" bg="coral">
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🏋️</div>
              <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.8 }}>Most popular class</div>
              <div style={{ fontSize: "20px", fontWeight: 900, margin: "8px 0" }}>{COMMUNITY_STATS.popularClass}</div>
              <StatBox style={{ marginTop: "16px" }}>
                <span style={{ fontSize: "24px", fontWeight: 900 }}>{COMMUNITY_STATS.popularClassVisits.toLocaleString("en-US")}</span>
                <br />
                <span>visits</span>
              </StatBox>
            </PostSlide>
            <DownloadButton onClick={() => downloadSlide("post-3", "cfl-wrapped-post-3-class")} />
          </SlideWrapper>

          {/* Post 4: Busiest Day */}
          <SlideWrapper label="Post 4 - Busiest Day">
            <PostSlide id="post-4" bg="teal">
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔥</div>
              <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.8 }}>Busiest day</div>
              <div style={{ fontSize: "18px", fontWeight: 900, margin: "8px 0" }}>{COMMUNITY_STATS.busiestDay}</div>
              <StatBox style={{ marginTop: "16px" }}>
                <span style={{ fontSize: "30px", fontWeight: 900 }}>{COMMUNITY_STATS.busiestDayCount}</span>
                <br />
                <span>visits</span>
              </StatBox>
            </PostSlide>
            <DownloadButton onClick={() => downloadSlide("post-4", "cfl-wrapped-post-4-busiest-day")} />
          </SlideWrapper>

          {/* Post 5: Quietest Day */}
          <SlideWrapper label="Post 5 - Quietest Day">
            <PostSlide id="post-5" bg="purple">
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>😴</div>
              <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.8 }}>Quietest day</div>
              <div style={{ fontSize: "18px", fontWeight: 900, margin: "8px 0" }}>{COMMUNITY_STATS.quietestDay}</div>
              <StatBox style={{ marginTop: "16px" }}>
                <span style={{ fontSize: "30px", fontWeight: 900 }}>{COMMUNITY_STATS.quietestDayCount}</span>
                <br />
                <span>visits</span>
              </StatBox>
              <div style={{ fontSize: "12px", opacity: 0.7, marginTop: "8px" }}>Christmas = rest 😉</div>
            </PostSlide>
            <DownloadButton onClick={() => downloadSlide("post-5", "cfl-wrapped-post-5-quietest-day")} />
          </SlideWrapper>

          {/* Post 6: Busiest Class */}
          <SlideWrapper label="Post 6 - Busiest Class">
            <PostSlide id="post-6" bg="yellow">
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🏆</div>
              <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.8 }}>Busiest class</div>
              <div style={{ fontSize: "16px", fontWeight: 900 }}>{COMMUNITY_STATS.busiestClass}</div>
              <div style={{ fontSize: "14px", opacity: 0.7 }}>{COMMUNITY_STATS.busiestClassDate}</div>
              <StatBox style={{ marginTop: "16px" }}>
                <span style={{ fontSize: "30px", fontWeight: 900 }}>{COMMUNITY_STATS.busiestClassAttendees}</span>
                <br />
                <span>attendees</span>
              </StatBox>
            </PostSlide>
            <DownloadButton onClick={() => downloadSlide("post-6", "cfl-wrapped-post-6-busiest-class")} />
          </SlideWrapper>

          {/* Post 7: Top Coaches */}
          <SlideWrapper label="Post 7 - Coaches">
            <PostSlide id="post-7" bg="coral">
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🏆</div>
              <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.8 }}>Most group classes</div>
              <div style={{ width: "100%", maxWidth: "220px", display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                {topCoaches.map((coach, i) => (
                  <div key={coach.voornaam} style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "8px", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 700 }}>{["🥇", "🥈", "🥉"][i]} {coach.voornaam}</span>
                    <span style={{ opacity: 0.7, fontSize: "14px" }}>{coach.lessen_gegeven}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: "12px", opacity: 0.7, marginTop: "8px" }}>group classes taught</div>
            </PostSlide>
            <DownloadButton onClick={() => downloadSlide("post-7", "cfl-wrapped-post-7-coaches")} />
          </SlideWrapper>

          {/* Post 8: Early Birds vs Night Owls */}
          <SlideWrapper label="Post 8 - Times">
            <PostSlide id="post-8" bg="teal">
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>⏰</div>
              <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.8 }}>When do you train?</div>
              <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                <div style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
                  <div style={{ fontSize: "18px", fontWeight: 900 }}>☀️ {COMMUNITY_STATS.earlyBirds.toLocaleString("en-US")}</div>
                  <div style={{ fontSize: "12px", opacity: 0.8 }}>early birds</div>
                </div>
                <div style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
                  <div style={{ fontSize: "18px", fontWeight: 900 }}>🌙 {COMMUNITY_STATS.nightOwls.toLocaleString("en-US")}</div>
                  <div style={{ fontSize: "12px", opacity: 0.8 }}>night owls</div>
                </div>
              </div>
            </PostSlide>
            <DownloadButton onClick={() => downloadSlide("post-8", "cfl-wrapped-post-8-times")} />
          </SlideWrapper>

          {/* Post 9: Gym Buddies */}
          <SlideWrapper label="Post 9 - Buddies">
            <PostSlide id="post-9" bg="purple">
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🤝</div>
              <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.8 }}>Gym Buddies</div>
              <div style={{ fontSize: "48px", fontWeight: 900, margin: "8px 0" }}>{COMMUNITY_STATS.gymBuddyDuos}</div>
              <div style={{ fontSize: "14px", fontWeight: 700 }}>duos with 10+ sessions together</div>
              <StatBox style={{ marginTop: "16px" }}>
                <div style={{ fontSize: "12px", opacity: 0.7 }}>Strongest buddies</div>
                <div style={{ fontSize: "24px", fontWeight: 900 }}>{COMMUNITY_STATS.strongestBuddySessions}x together</div>
              </StatBox>
            </PostSlide>
            <DownloadButton onClick={() => downloadSlide("post-9", "cfl-wrapped-post-9-buddies")} />
          </SlideWrapper>

          {/* Post 10: Cancellations */}
          <SlideWrapper label="Post 10 - Cancellations">
            <PostSlide id="post-10" bg="dark">
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>😅</div>
              <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.8 }}>And yes...</div>
              <div style={{ fontSize: "40px", fontWeight: 900, margin: "8px 0" }}>{COMMUNITY_STATS.cancellations.toLocaleString("en-US")}</div>
              <div style={{ fontSize: "16px", fontWeight: 700 }}>cancellations</div>
              <StatBox style={{ marginTop: "16px" }}>Better in 2026? 😉</StatBox>
            </PostSlide>
            <DownloadButton onClick={() => downloadSlide("post-10", "cfl-wrapped-post-10-cancellations")} />
          </SlideWrapper>

          {/* Post 11: Thank you */}
          <SlideWrapper label="Post 11 - Outro">
            <PostSlide id="post-11" bg="coral">
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>❤️</div>
              <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.8 }}>Thank you for 2025</div>
              <div style={{ fontSize: "18px", fontWeight: 900, margin: "12px 0" }}>Here&apos;s to a strong</div>
              <div style={{ fontSize: "48px", fontWeight: 900 }}>2026</div>
              <StatBox style={{ marginTop: "16px", fontSize: "14px" }}>
                Happy holidays<br />
                See you on the floor 💪
              </StatBox>
            </PostSlide>
            <DownloadButton onClick={() => downloadSlide("post-11", "cfl-wrapped-post-11-outro")} />
          </SlideWrapper>

          {/* Post 12: CTA - View your Wrapped */}
          <SlideWrapper label="Post 12 - CTA">
            <PostSlide id="post-12" bg="teal">
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>📧</div>
              <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.8 }}>Your personal stats</div>
              <div style={{ fontSize: "18px", fontWeight: 900, margin: "8px 0" }}>View your</div>
              <div style={{ fontSize: "22px", fontWeight: 900 }}>CFL WRAPPED</div>
              <StatBox style={{ marginTop: "16px" }}>
                <div style={{ fontSize: "11px", opacity: 0.8 }}>Check your email for your code</div>
                <div style={{ fontSize: "14px", fontWeight: 900, marginTop: "4px" }}>wrapped.crossfitleiden.com</div>
              </StatBox>
            </PostSlide>
            <DownloadButton onClick={() => downloadSlide("post-12", "cfl-wrapped-post-12-cta")} />
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
