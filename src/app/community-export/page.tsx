"use client";

import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import coachData from "@/data/coach-wrapped-data.json";

// Community stats - update these with real data
const COMMUNITY_STATS = {
  totaalBezoeken: 39326,
  totaalLeden: 480,
  populairsteLes: "CFL Training",
  populairsteLesBezoeken: 25000, // Estimate based on data
  favorieteDay: "Woensdag",
  favoriteDayCount: 8500,
  favoriteTijd: "09:00",
  earlyBirds: 12000, // voor 09:00
  nightOwls: 8000, // na 19:00
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

export default function CommunityExportPage() {
  const [activeTab, setActiveTab] = useState<SlideType>("story");
  const [downloading, setDownloading] = useState(false);

  const downloadSlide = async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const isStory = elementId.startsWith("story");
    const scale = isStory ? 4 : 3.375;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const canvas = await (html2canvas as any)(element, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });

      const link = document.createElement("a");
      link.download = filename + ".png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export mislukt. Probeer het opnieuw.");
    }
  };

  const downloadAll = async () => {
    setDownloading(true);
    const prefix = activeTab === "story" ? "story" : "post";
    const count = activeTab === "story" ? 12 : 5;

    for (let i = 1; i <= count; i++) {
      const slideId = `${prefix}-${i}`;
      const filename = `cfl-wrapped-${slideId}`;
      await downloadSlide(slideId, filename);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    setDownloading(false);
  };

  const copyCaption = (caption: string, buttonId: string) => {
    navigator.clipboard.writeText(caption).then(() => {
      const btn = document.getElementById(buttonId);
      if (btn) {
        btn.textContent = "✅ Gekopieerd!";
        setTimeout(() => {
          btn.textContent = "📋 Kopieer";
        }, 2000);
      }
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
          Posts (1:1) - 5 slides
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
              <StatBox className="mt-6">Wat een jaar was dit...</StatBox>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-1", "cfl-wrapped-story-1-intro")} />
            <CaptionBox
              id="caption-1"
              caption={`🎉 CROSSFIT LEIDEN WRAPPED 2025

Wat. Een. Jaar.

Swipe voor jullie cijfers ➡️

#CrossFitLeiden #Wrapped2025 #Community`}
              onCopy={(c) => copyCaption(c, "copy-btn-1")}
            />
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
            <CaptionBox
              id="caption-2"
              caption={`💪 ${COMMUNITY_STATS.totaalBezoeken.toLocaleString("nl-NL")} BEZOEKEN

Samen. Met ${COMMUNITY_STATS.totaalLeden} leden.

Dat is gemiddeld ${Math.round(COMMUNITY_STATS.totaalBezoeken / COMMUNITY_STATS.totaalLeden)} bezoeken per lid. Jullie zijn machines.

#CrossFitLeiden #Wrapped2025`}
              onCopy={(c) => copyCaption(c, "copy-btn-2")}
            />
          </SlideWrapper>

          {/* Story 3: Populairste les */}
          <SlideWrapper label="Story 3 - Populairste Les">
            <StorySlide id="story-3" bg="coral">
              <div className="text-5xl mb-4">🏋️</div>
              <div className="text-sm opacity-90 mb-2">Populairste les</div>
              <div className="text-2xl font-black">{COMMUNITY_STATS.populairsteLes}</div>
              <StatBox className="mt-4">
                <span className="text-2xl font-black">{COMMUNITY_STATS.populairsteLesBezoeken.toLocaleString("nl-NL")}</span>
                <br />
                <span>bezoeken</span>
              </StatBox>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-3", "cfl-wrapped-story-3-les")} />
            <CaptionBox
              id="caption-3"
              caption={`🏋️ ${COMMUNITY_STATS.populairsteLes.toUpperCase()} = FAVORIET

${COMMUNITY_STATS.populairsteLesBezoeken.toLocaleString("nl-NL")} bezoeken aan onze signature class.

Jullie weten wat werkt 💪

#CrossFitLeiden #CFLTraining`}
              onCopy={(c) => copyCaption(c, "copy-btn-3")}
            />
          </SlideWrapper>

          {/* Story 4: Favoriete dag */}
          <SlideWrapper label="Story 4 - Favoriete Dag">
            <StorySlide id="story-4" bg="yellow">
              <div className="text-5xl mb-4">📅</div>
              <div className="text-sm opacity-90 mb-2">Jullie favoriete dag?</div>
              <div className="text-4xl font-black">{COMMUNITY_STATS.favorieteDay}</div>
              <StatBox className="mt-4">
                {COMMUNITY_STATS.favoriteDayCount.toLocaleString("nl-NL")} bezoeken
                <br />
                <span className="text-xs opacity-70">Midden in de week knallen 🔥</span>
              </StatBox>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-4", "cfl-wrapped-story-4-dag")} />
            <CaptionBox
              id="caption-4"
              caption={`📅 ${COMMUNITY_STATS.favorieteDay.toUpperCase()} = JULLIE DAG

${COMMUNITY_STATS.favoriteDayCount.toLocaleString("nl-NL")} bezoeken op ${COMMUNITY_STATS.favorieteDay.toLowerCase()}.

Midden in de week even gas geven. Slimme keuze.

#CrossFitLeiden #WoensdagMotivatie`}
              onCopy={(c) => copyCaption(c, "copy-btn-4")}
            />
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
            <CaptionBox
              id="caption-5"
              caption={`⏰ ${COMMUNITY_STATS.favoriteTijd} = PRIME TIME

${COMMUNITY_STATS.earlyBirds.toLocaleString("nl-NL")} early birds (vóór 9u)
${COMMUNITY_STATS.nightOwls.toLocaleString("nl-NL")} night owls (na 19u)

Of je nou 's ochtends of 's avonds traint - jullie kwamen opdagen 💪

#CrossFitLeiden #EarlyBird #NightOwl`}
              onCopy={(c) => copyCaption(c, "copy-btn-5")}
            />
          </SlideWrapper>

          {/* Story 6: Drukste Dag */}
          <SlideWrapper label="Story 6 - Drukste Dag">
            <StorySlide id="story-6" bg="coral">
              <div className="text-5xl mb-4">🔥</div>
              <div className="text-sm opacity-90 mb-2">Drukste dag van het jaar</div>
              <div className="text-xl font-black">{COMMUNITY_STATS.druksteDag}</div>
              <StatBox className="mt-4">
                <span className="text-3xl font-black">{COMMUNITY_STATS.druksteDagCount}</span>
                <br />
                <span>bezoeken</span>
              </StatBox>
              <div className="text-xs opacity-70 mt-3">Wat een start van het jaar! 💪</div>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-6", "cfl-wrapped-story-6-drukste-dag")} />
            <CaptionBox
              id="caption-6"
              caption={`🔥 DRUKSTE DAG VAN HET JAAR

${COMMUNITY_STATS.druksteDag} - ${COMMUNITY_STATS.druksteDagCount} bezoeken

Wat een manier om 2025 te starten! De gym was PACKED.

#CrossFitLeiden #Wrapped2025 #RecordDay`}
              onCopy={(c) => copyCaption(c, "copy-btn-6")}
            />
          </SlideWrapper>

          {/* Story 7: Rustigste Dag */}
          <SlideWrapper label="Story 7 - Rustigste Dag">
            <StorySlide id="story-7" bg="teal">
              <div className="text-5xl mb-4">😴</div>
              <div className="text-sm opacity-90 mb-2">Rustigste dag van het jaar</div>
              <div className="text-xl font-black">{COMMUNITY_STATS.rustigsteDag}</div>
              <StatBox className="mt-4">
                <span className="text-3xl font-black">{COMMUNITY_STATS.rustigsteDagCount}</span>
                <br />
                <span>bezoeken</span>
              </StatBox>
              <div className="text-xs opacity-70 mt-3">Kerst = rust... snappen we 😉</div>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-7", "cfl-wrapped-story-7-rustigste-dag")} />
            <CaptionBox
              id="caption-7"
              caption={`😴 RUSTIGSTE DAG VAN HET JAAR

${COMMUNITY_STATS.rustigsteDag} - ${COMMUNITY_STATS.rustigsteDagCount} bezoeken

Kerst = rustdag? Voor ${COMMUNITY_STATS.rustigsteDagCount} van jullie in ieder geval niet 💪

#CrossFitLeiden #Wrapped2025 #ChristmasWOD`}
              onCopy={(c) => copyCaption(c, "copy-btn-7")}
            />
          </SlideWrapper>

          {/* Story 8: Drukste Les */}
          <SlideWrapper label="Story 8 - Drukste Les">
            <StorySlide id="story-8" bg="yellow">
              <div className="text-5xl mb-4">🏆</div>
              <div className="text-sm opacity-90 mb-2">Drukste les van het jaar</div>
              <div className="text-lg font-black">{COMMUNITY_STATS.druksteLes}</div>
              <div className="text-sm opacity-70">{COMMUNITY_STATS.druksteLesDate} • {COMMUNITY_STATS.druksteLesTijd}</div>
              <StatBox className="mt-4">
                <span className="text-3xl font-black">{COMMUNITY_STATS.druksteLesDeelnemers}</span>
                <br />
                <span>deelnemers</span>
              </StatBox>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-8", "cfl-wrapped-story-8-drukste-les")} />
            <CaptionBox
              id="caption-8"
              caption={`🏆 DRUKSTE LES VAN HET JAAR

${COMMUNITY_STATS.druksteLes}
${COMMUNITY_STATS.druksteLesDate} om ${COMMUNITY_STATS.druksteLesTijd}
${COMMUNITY_STATS.druksteLesDeelnemers} deelnemers

Een volle bak voor een speciale workout. Dit is community 💪

#CrossFitLeiden #Wrapped2025`}
              onCopy={(c) => copyCaption(c, "copy-btn-8")}
            />
          </SlideWrapper>

          {/* Story 9: Top Coaches */}
          <SlideWrapper label="Story 9 - Top Coaches">
            <StorySlide id="story-9" bg="coral">
              <div className="text-5xl mb-4">🏆</div>
              <div className="text-sm opacity-90 mb-2">Jullie top coaches</div>
              <div className="w-full max-w-[220px] flex flex-col gap-2 mt-4">
                {topCoaches.map((coach, i) => (
                  <div key={coach.voornaam} className="bg-white/20 rounded-lg px-4 py-2.5 flex justify-between items-center">
                    <span className="font-bold">{["🥇", "🥈", "🥉"][i]} {coach.voornaam}</span>
                    <span className="opacity-70 text-sm">{coach.lessen_gegeven}</span>
                  </div>
                ))}
              </div>
              <div className="text-xs opacity-70 mt-3">lessen gegeven</div>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-9", "cfl-wrapped-story-9-coaches")} />
            <CaptionBox
              id="caption-9"
              caption={`🏆 JULLIE TOP COACHES 2025

🥇 ${topCoaches[0].voornaam} - ${topCoaches[0].lessen_gegeven} lessen
🥈 ${topCoaches[1].voornaam} - ${topCoaches[1].lessen_gegeven} lessen
🥉 ${topCoaches[2].voornaam} - ${topCoaches[2].lessen_gegeven} lessen

Uren vroeg op. Uren tellen. Uren "nog één rep!"

Bedankt team 🙏

#CrossFitLeiden #Coaches #TeamCFL`}
              onCopy={(c) => copyCaption(c, "copy-btn-9")}
            />
          </SlideWrapper>

          {/* Story 10: Buddies */}
          <SlideWrapper label="Story 10 - Gym Buddies">
            <StorySlide id="story-10" bg="teal">
              <div className="text-5xl mb-4">🤝</div>
              <div className="text-sm opacity-90 mb-2">Community vibes</div>
              <div className="text-[56px] font-black leading-none">{COMMUNITY_STATS.gymBuddyDuos}</div>
              <div className="text-xl font-bold mt-1">gym buddy duo&apos;s</div>
              <div className="text-xs opacity-70">(10+ sessies samen)</div>
              <StatBox className="mt-5">
                <div className="text-xs opacity-70">Sterkste buddies:</div>
                <div className="text-3xl font-black">{COMMUNITY_STATS.sterksteBuddySessies}x</div>
                <div className="text-xs opacity-70">samen getraind</div>
              </StatBox>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-10", "cfl-wrapped-story-10-buddies")} />
            <CaptionBox
              id="caption-10"
              caption={`🤝 ${COMMUNITY_STATS.gymBuddyDuos} GYM BUDDY DUO'S

Dit is waar het om draait.

${COMMUNITY_STATS.gymBuddyDuos} duo's die minstens 10x samen trainden. De sterkste? ${COMMUNITY_STATS.sterksteBuddySessies} sessies samen.

Niet alleen trainen. Samen trainen.

Tag je gym buddy! 👇

#CrossFitLeiden #GymBuddy #StrongerTogether`}
              onCopy={(c) => copyCaption(c, "copy-btn-10")}
            />
          </SlideWrapper>

          {/* Story 11: Afmeldingen */}
          <SlideWrapper label="Story 11 - Afmeldingen">
            <StorySlide id="story-11" bg="dark">
              <div className="text-5xl mb-4">😅</div>
              <div className="text-sm opacity-90 mb-2">En ja...</div>
              <div className="text-[56px] font-black leading-none">{COMMUNITY_STATS.afmeldingen.toLocaleString("nl-NL")}</div>
              <div className="text-xl font-bold mt-1">afmeldingen</div>
              <StatBox>In 2026 doen we beter... toch? 😉</StatBox>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-11", "cfl-wrapped-story-11-afmeldingen")} />
            <CaptionBox
              id="caption-11"
              caption={`😅 EN JA...

${COMMUNITY_STATS.afmeldingen.toLocaleString("nl-NL")} afmeldingen.

We snappen het. Het leven. Het weer. De snooze button.

In 2026 doen we beter... toch? 😉

#CrossFitLeiden #Wrapped2025 #Eerlijk`}
              onCopy={(c) => copyCaption(c, "copy-btn-11")}
            />
          </SlideWrapper>

          {/* Story 12: Outro */}
          <SlideWrapper label="Story 12 - Outro">
            <StorySlide id="story-12" bg="coral">
              <div className="text-5xl mb-4">❤️</div>
              <div className="text-sm opacity-90 mb-2">Bedankt voor</div>
              <div className="text-2xl font-black">een geweldig 2025</div>
              <StatBox className="mt-6">
                <div>Op naar een sterk en gezond</div>
                <div className="text-3xl font-black mt-1">2026! 🎉</div>
              </StatBox>
            </StorySlide>
            <DownloadButton onClick={() => downloadSlide("story-12", "cfl-wrapped-story-12-outro")} />
            <CaptionBox
              id="caption-12"
              caption={`❤️ BEDANKT

Voor elke burpee.
Voor elke PR.
Voor elke high five.
Voor elke keer dat je er was.

Jullie maken CrossFit Leiden.

Fijne feestdagen en tot in 2026! 🎉

#CrossFitLeiden #Wrapped2025 #ThankYou #FijneFeestdagen`}
              onCopy={(c) => copyCaption(c, "copy-btn-12")}
            />
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
            <CaptionBox
              id="caption-post-1"
              caption={`🎉 WAT. EEN. JAAR.

${COMMUNITY_STATS.totaalBezoeken.toLocaleString("nl-NL")} bezoeken. ${COMMUNITY_STATS.totaalLeden} leden. 15 coaches.

Dit zijn jullie cijfers. Dit is onze community.

Bedankt voor elk bezoek, elke rep, elke druppel zweet. 💪

#CrossFitLeiden #Wrapped2025 #Community #CFLFamily`}
              onCopy={(c) => copyCaption(c, "copy-btn-post-1")}
            />
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
            <CaptionBox
              id="caption-post-2"
              caption={`📅 ${COMMUNITY_STATS.favorieteDay.toUpperCase()} ${COMMUNITY_STATS.favoriteTijd}

Dat was jullie moment. Week in, week uit.

Maar of je nou early bird bent (${COMMUNITY_STATS.earlyBirds.toLocaleString("nl-NL")} leden!) of night owl (${COMMUNITY_STATS.nightOwls.toLocaleString("nl-NL")} leden) - jullie kwamen opdagen.

Elke. Keer. Weer.

Ben jij team ☀️ of team 🌙?

#CrossFitLeiden #WoensdagMotivatie #GymLife`}
              onCopy={(c) => copyCaption(c, "copy-btn-post-2")}
            />
          </SlideWrapper>

          {/* Post 3: Coaches */}
          <SlideWrapper label="Post 3 - Coaches">
            <PostSlide id="post-3" bg="yellow">
              <div className="text-4xl mb-2">🏆</div>
              <div className="text-xs uppercase tracking-widest opacity-80">Top Coaches 2025</div>
              <div className="w-full max-w-[220px] flex flex-col gap-2 mt-3">
                {topCoaches.map((coach, i) => (
                  <div key={coach.voornaam} className="bg-black/10 rounded-lg px-4 py-2.5 flex justify-between items-center">
                    <span className="font-bold">{["🥇", "🥈", "🥉"][i]} {coach.voornaam}</span>
                    <span className="opacity-70 text-sm">{coach.lessen_gegeven}</span>
                  </div>
                ))}
              </div>
              <div className="text-xs opacity-70 mt-2">lessen gegeven dit jaar</div>
            </PostSlide>
            <DownloadButton onClick={() => downloadSlide("post-3", "cfl-wrapped-post-3-coaches")} />
            <CaptionBox
              id="caption-post-3"
              caption={`🏆 JULLIE TOP COACHES

🥇 ${topCoaches[0].voornaam} - ${topCoaches[0].lessen_gegeven} lessen
🥈 ${topCoaches[1].voornaam} - ${topCoaches[1].lessen_gegeven} lessen
🥉 ${topCoaches[2].voornaam} - ${topCoaches[2].lessen_gegeven} lessen

Deze drie hebben jullie door 2025 heen gecoacht.

Uren vroeg op. Uren stemmen tellen. Uren "nog één rep!"

Bedankt team 🙏

#CrossFitLeiden #Coaches #TeamCFL #ThankYou`}
              onCopy={(c) => copyCaption(c, "copy-btn-post-3")}
            />
          </SlideWrapper>

          {/* Post 4: Buddies */}
          <SlideWrapper label="Post 4 - Buddies">
            <PostSlide id="post-4" bg="purple">
              <div className="text-4xl mb-2">🤝</div>
              <div className="text-xs uppercase tracking-widest opacity-80">Gym Buddies</div>
              <div className="text-6xl font-black my-2">{COMMUNITY_STATS.gymBuddyDuos}</div>
              <div className="text-sm font-bold">duo&apos;s met 10+ sessies samen</div>
              <StatBox className="mt-4">
                <div className="text-xs opacity-70">Sterkste buddies</div>
                <div className="text-2xl font-black">{COMMUNITY_STATS.sterksteBuddySessies}x samen</div>
              </StatBox>
            </PostSlide>
            <DownloadButton onClick={() => downloadSlide("post-4", "cfl-wrapped-post-4-buddies")} />
            <CaptionBox
              id="caption-post-4"
              caption={`🤝 ${COMMUNITY_STATS.gymBuddyDuos} GYM BUDDY DUO'S

Dit is waar CrossFit om draait.

Niet alleen trainen. Samen trainen.

${COMMUNITY_STATS.gymBuddyDuos} duo's die minimaal 10 keer samen hebben getraind. En de sterkste buddies? ${COMMUNITY_STATS.sterksteBuddySessies} sessies samen.

Dat is commitment. Dat is community. 💪

Wie is jouw gym buddy? Tag ze! 👇

#CrossFitLeiden #GymBuddy #Community #StrongerTogether`}
              onCopy={(c) => copyCaption(c, "copy-btn-post-4")}
            />
          </SlideWrapper>

          {/* Post 5: Thank you */}
          <SlideWrapper label="Post 5 - Outro">
            <PostSlide id="post-5" bg="coral">
              <div className="text-4xl mb-2">❤️</div>
              <div className="text-xs uppercase tracking-widest opacity-80">Bedankt voor 2025</div>
              <div className="text-xl font-black my-3">Op naar een sterk</div>
              <div className="text-[56px] font-black">2026</div>
              <StatBox className="mt-4 text-sm">
                🎉 Fijne feestdagen<br />
                💪 Tot op de vloer
              </StatBox>
            </PostSlide>
            <DownloadButton onClick={() => downloadSlide("post-5", "cfl-wrapped-post-5-outro")} />
            <CaptionBox
              id="caption-post-5"
              caption={`❤️ BEDANKT

Voor elke burpee.
Voor elke PR.
Voor elke high five.
Voor elke keer dat je er was.

Jullie maken CrossFit Leiden wat het is.

Fijne feestdagen en tot in 2026! 🎉

#CrossFitLeiden #Wrapped2025 #ThankYou #HappyHolidays #FijneFeestdagen #2026`}
              onCopy={(c) => copyCaption(c, "copy-btn-post-5")}
            />
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
  const bgClasses: Record<string, string> = {
    coral: "bg-gradient-to-br from-[#EF4C37] to-[#c93d2d]",
    teal: "bg-gradient-to-br from-[#0CBABA] to-[#099999]",
    yellow: "bg-gradient-to-br from-[#F7CB15] to-[#e5b800] text-[#1a1a1a]",
    purple: "bg-gradient-to-br from-[#7B6D8D] to-[#5d5169]",
    dark: "bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]",
  };

  return (
    <div
      id={id}
      className={`w-[270px] h-[480px] rounded-2xl relative overflow-hidden flex flex-col items-center justify-center text-center p-6 ${bgClasses[bg]}`}
    >
      {children}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-widest opacity-60">
        CROSSFIT LEIDEN
      </div>
    </div>
  );
}

function PostSlide({ id, bg, children }: { id: string; bg: string; children: React.ReactNode }) {
  const bgClasses: Record<string, string> = {
    coral: "bg-gradient-to-br from-[#EF4C37] to-[#c93d2d]",
    teal: "bg-gradient-to-br from-[#0CBABA] to-[#099999]",
    yellow: "bg-gradient-to-br from-[#F7CB15] to-[#e5b800] text-[#1a1a1a]",
    purple: "bg-gradient-to-br from-[#7B6D8D] to-[#5d5169]",
  };

  return (
    <div
      id={id}
      className={`w-[320px] h-[320px] rounded-xl relative overflow-hidden flex flex-col items-center justify-center text-center p-6 ${bgClasses[bg]}`}
    >
      {children}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-widest opacity-60">
        CROSSFIT LEIDEN
      </div>
    </div>
  );
}

function StatBox({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/20 rounded-xl px-4 py-3 text-sm ${className}`}>
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

function CaptionBox({ id, caption, onCopy }: { id: string; caption: string; onCopy: (caption: string) => void }) {
  return (
    <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-3 w-[270px]">
      <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">Caption:</div>
      <div className="text-xs text-gray-400 leading-relaxed whitespace-pre-line max-h-[150px] overflow-y-auto mb-2.5">
        {caption}
      </div>
      <button
        id={`copy-btn-${id}`}
        onClick={() => onCopy(caption)}
        className="w-full py-2 bg-[#333] rounded-md text-xs hover:bg-[#444] transition-colors"
      >
        📋 Kopieer
      </button>
    </div>
  );
}
