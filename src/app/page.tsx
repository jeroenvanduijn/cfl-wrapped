"use client";

import { useState } from "react";
import Image from "next/image";
import WrappedSlides from "@/components/WrappedSlides";
import wrappedData from "@/data/wrapped-data.json";

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

export default function Home() {
  const [code, setCode] = useState("");
  const [member, setMember] = useState<MemberData | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const upperCode = code.toUpperCase().trim();
    const data = wrappedData as Record<string, MemberData>;

    // Simulate loading for effect
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (data[upperCode]) {
      const memberData = data[upperCode];
      setMember(memberData);

      // Log view
      try {
        await fetch("/api/views", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            memberId: memberData.registratienummer,
            voornaam: memberData.voornaam,
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

  // Show Wrapped slides if member is loaded
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
