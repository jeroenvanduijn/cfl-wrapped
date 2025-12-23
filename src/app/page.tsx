"use client";

import { useState } from "react";
import Image from "next/image";
import WrappedSlides from "@/components/WrappedSlides";
import CoachWrappedSlides from "@/components/CoachWrappedSlides";
import wrappedData from "@/data/wrapped-data.json";
import coachWrappedData from "@/data/coach-wrapped-data.json";

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

export default function Home() {
  const [code, setCode] = useState("");
  const [member, setMember] = useState<MemberData | null>(null);
  const [coach, setCoach] = useState<CoachData | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const upperCode = code.toUpperCase().trim();
    const memberData = wrappedData as Record<string, MemberData>;
    const coachData = coachWrappedData as Record<string, CoachData>;

    // Simulate loading for effect
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if it's a coach code first
    if (coachData[upperCode]) {
      const foundCoach = coachData[upperCode];
      setCoach(foundCoach);

      // Log view
      try {
        await fetch("/api/views", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            memberId: 0, // Coach doesn't have memberId
            voornaam: foundCoach.voornaam + " (coach)",
            code: upperCode,
          }),
        });
      } catch (err) {
        console.error("Failed to log view:", err);
      }
    } else if (memberData[upperCode]) {
      const foundMember = memberData[upperCode];
      setMember(foundMember);

      // Log view
      try {
        await fetch("/api/views", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            memberId: foundMember.registratienummer,
            voornaam: foundMember.voornaam,
            code: upperCode,
          }),
        });
      } catch (err) {
        console.error("Failed to log view:", err);
      }
    } else {
      setError("Code niet gevonden. Controleer je code en probeer opnieuw.");
    }
    setIsLoading(false);
  };

  // Show Coach Wrapped slides if coach is loaded
  if (coach) {
    return <CoachWrappedSlides coach={coach} onBack={() => setCoach(null)} />;
  }

  // Show Member Wrapped slides if member is loaded
  if (member) {
    return <WrappedSlides member={member} onBack={() => setMember(null)} />;
  }

  // Code entry screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EF4C37] to-[#D43A28] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-32 h-20 mx-auto mb-4 relative">
            <Image
              src="/cfl-logo.png"
              alt="CrossFit Leiden"
              fill
              className="object-contain"
              style={{ filter: "invert(29%) sepia(93%) saturate(1352%) hue-rotate(346deg) brightness(91%) contrast(95%)" }}
            />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">
            Jouw Wrapped 2025
          </h1>
          <p className="text-gray-600">Vul je persoonlijke code in</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError("");
            }}
            placeholder="JOUW CODE"
            className="w-full text-center text-2xl font-bold tracking-widest border-2 border-gray-200 rounded-xl px-4 py-4 mb-4 focus:border-[#EF4C37] focus:outline-none transition-colors text-gray-900"
            maxLength={8}
            autoComplete="off"
            autoCapitalize="characters"
          />

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading || code.length < 4}
            className="w-full bg-[#EF4C37] text-white font-bold py-4 rounded-xl hover:bg-[#D43A28] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Laden..." : "Ontdek je Wrapped →"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Code staat op je kaart
        </p>
      </div>
    </div>
  );
}
