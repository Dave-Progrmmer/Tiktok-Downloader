"use client";

import { useState, FormEvent } from "react";

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setDownloadUrl("");

    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data: { downloadUrl?: string; error?: string } = await res.json();

      if (data.downloadUrl) {
        setDownloadUrl(data.downloadUrl);
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      alert("Error: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">TikTok Downloader (No Watermark)</h1>
      
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="url"
          placeholder="Enter TikTok video URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border rounded px-3 py-2 w-80"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Fetching..." : "Download"}
        </button>
      </form>

      {downloadUrl && (
        <div className="mt-8 flex flex-col items-center">
          <video
            src={downloadUrl}
            controls
            className="rounded-lg shadow-md w-[400px] max-w-full"
          />
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Video
          </a>
        </div>
      )}
    </main>
  );
}
