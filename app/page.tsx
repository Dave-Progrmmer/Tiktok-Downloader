"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetch = async () => {
    setLoading(true);
    setError("");
    setVideoUrl(null);

    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (res.ok && data.downloadUrl) {
        setVideoUrl(data.downloadUrl);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!videoUrl) return;
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = "tiktok-video.mp4"; // default filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="flex flex-col min-h-screen bg-[#0e0e0e] text-gray-100">
      {/* Header */}
      <header className="p-4 bg-[#1a1a1a] text-center shadow-md border-b border-gray-800">
        <h1 className="text-2xl font-bold">TikTok Downloader</h1>
        <p className="text-sm mt-1 text-gray-400">
          Preview & download TikTok videos without watermark 🚀
        </p>
      </header>

      {/* Main content */}
      <section className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#1a1a1a] rounded-2xl shadow-lg p-6 border border-gray-800">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste TikTok video URL..."
            className="w-full px-4 py-3 bg-[#0e0e0e] border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-sm text-gray-100 placeholder-gray-500"
          />

          <button
            onClick={handleFetch}
            disabled={!url || loading}
            className="mt-4 w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition"
          >
            {loading ? "Fetching..." : "Get Video"}
          </button>

          {error && <p className="mt-3 text-sm text-red-400 text-center">{error}</p>}

          {/* Preview video */}
          {videoUrl && (
            <div className="mt-6">
              <p className="text-sm font-medium mb-2 text-center text-gray-300">
                Video Preview:
              </p>
              <video
                src={videoUrl}
                controls
                playsInline
                className="w-full rounded-xl shadow border border-gray-700"
              />
              <button
                onClick={handleDownload}
                className="mt-4 w-full text-center bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
              >
                Download Video
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="p-4 text-center text-sm bg-[#1a1a1a] border-t border-gray-800">
        <p className="text-gray-400">
          Made by <span className="font-medium text-gray-200">David </span>
        </p>
        <p className="text-gray-500 mt-1">
          &copy; {new Date().getFullYear()} David . All rights reserved.
        </p>
      </footer>
    </main>
  );
}
