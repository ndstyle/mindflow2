import React, { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import MindMapDisplay from "./MindMapDisplay";

export default function MindMapGenerator() {
  const [input, setInput] = useState("");
  const [mindMap, setMindMap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMindMap(null);

    try {
      const res = await fetch("/api/parse-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Unknown error");

      setMindMap(data.mindMap);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          className="w-full border rounded p-2"
          rows={8}
          placeholder="Paste your notes here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Generating…" : "Generate Mind Map"}
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <LoadingSpinner />}
      {mindMap && <MindMapDisplay mindMap={mindMap} />}
    </div>
  );
}
