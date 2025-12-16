"use client";

import { useState, useEffect } from "react";
import { Download, RefreshCw } from "lucide-react";

type Response = {
  memberId: number;
  voornaam: string;
  voornemen2026: string;
  grootsteWin2025: string;
  timestamp: string;
};

export default function AdminPage() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResponses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/responses");
      if (res.ok) {
        const data = await res.json();
        setResponses(data);
      }
    } catch (error) {
      console.error("Error fetching responses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(responses, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cfl-wrapped-responses-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const headers = ["Member ID", "Voornaam", "Grootste Win 2025", "Voornemen 2026", "Timestamp"];
    const rows = responses.map((r) => [
      r.memberId,
      r.voornaam,
      `"${r.grootsteWin2025.replace(/"/g, '""')}"`,
      `"${r.voornemen2026.replace(/"/g, '""')}"`,
      r.timestamp,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cfl-wrapped-responses-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              CFL Wrapped Responses
            </h1>
            <div className="flex gap-3">
              <button
                onClick={fetchResponses}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button
                onClick={downloadCSV}
                disabled={responses.length === 0}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                CSV
              </button>
              <button
                onClick={downloadJSON}
                disabled={responses.length === 0}
                className="flex items-center gap-2 bg-[#EF4C37] text-white px-4 py-2 rounded-lg hover:bg-[#D43A28] transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                JSON
              </button>
            </div>
          </div>

          <p className="text-gray-600 mb-4">
            Totaal: <strong>{responses.length}</strong> responses
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Laden...</div>
        ) : responses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Nog geen responses ontvangen
          </div>
        ) : (
          <div className="space-y-4">
            {responses.map((response, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    {response.voornaam}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {new Date(response.timestamp).toLocaleString("nl-NL")}
                  </span>
                </div>

                {response.grootsteWin2025 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Grootste win 2025
                    </p>
                    <p className="text-gray-800">{response.grootsteWin2025}</p>
                  </div>
                )}

                {response.voornemen2026 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Voornemen 2026
                    </p>
                    <p className="text-gray-800">{response.voornemen2026}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
