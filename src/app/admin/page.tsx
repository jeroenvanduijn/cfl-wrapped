"use client";

import { useState, useEffect } from "react";
import { Download, RefreshCw, Eye, MessageSquare } from "lucide-react";

type Response = {
  memberId: number;
  voornaam: string;
  voornemen2026: string;
  grootsteWin2025: string;
  timestamp: string;
};

type View = {
  memberId: string;
  voornaam: string;
  code: string;
  timestamp: string;
  viewCount: number;
};

export default function AdminPage() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [views, setViews] = useState<View[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"views" | "responses">("views");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [responsesRes, viewsRes] = await Promise.all([
        fetch("/api/responses"),
        fetch("/api/views"),
      ]);

      if (responsesRes.ok) {
        const data = await responsesRes.json();
        setResponses(data);
      }
      if (viewsRes.ok) {
        const data = await viewsRes.json();
        setViews(data);
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
              CFL Wrapped Admin
            </h1>
            <div className="flex gap-3">
              <button
                onClick={fetchData}
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

          {/* Tabs */}
          <div className="flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("views")}
              className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition-colors ${
                activeTab === "views"
                  ? "border-[#EF4C37] text-[#EF4C37]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Eye className="w-4 h-4" />
              Views ({views.length})
            </button>
            <button
              onClick={() => setActiveTab("responses")}
              className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition-colors ${
                activeTab === "responses"
                  ? "border-[#EF4C37] text-[#EF4C37]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Responses ({responses.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Laden...</div>
        ) : activeTab === "views" ? (
          // Views tab
          views.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Nog geen views
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Naam</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Code</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Bekeken</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Laatste keer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {views
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((view, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{view.voornaam}</td>
                        <td className="px-6 py-4 text-gray-600 font-mono">{view.code}</td>
                        <td className="px-6 py-4 text-gray-600">{view.viewCount}x</td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          {new Date(view.timestamp).toLocaleString("nl-NL")}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          // Responses tab
          responses.length === 0 ? (
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
          )
        )}
      </div>
    </div>
  );
}
