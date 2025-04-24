"use client";

import { useState } from "react";
import { auth } from "lib/firebase/firebase-config";

export default function SummarizePage() {
  const [user, setUser] = useState<null | import("firebase/auth").User>(null);
  const [blogText, setBlogText] = useState("");
  const [message, setMessage] = useState("");
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Listen for auth state changes
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const summarizeText = async () => {
    setMessage("");
    setSummary("");

    if (!blogText.trim()) {
      setMessage("Please enter some text!");
      return;
    }

    setLoadingSummary(true);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: blogText, email: user?.email || "", tier: "free" }),
      });

      const result = await response.json();
      if (response.ok) {
        setSummary(result.summary);
        setMessage("Summary generated!");
      } else {
        setMessage(`Error: ${result.error || "Something went wrong"}`);
      }
    } catch {
      setMessage("❌ Something went wrong while connecting to the server.");
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 font-sans">
      <h2 className="text-2xl font-bold mb-4">Blog Summarizer</h2>
      {user ? (
        <>
          <p className="mb-2">Logged in as: {user.email}</p>
          <textarea
            value={blogText}
            onChange={(e) => setBlogText(e.target.value)}
            placeholder="Paste your blog post here..."
            className="w-full h-40 p-2 border border-gray-300 rounded mb-4 resize-none"
          />
          <button
            onClick={summarizeText}
            disabled={loadingSummary}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loadingSummary ? "Summarizing..." : "Summarize"}
          </button>
          {message && <p className="mt-4 text-red-600">{message}</p>}
          {summary && (
            <div className="mt-6 p-4 border border-gray-300 rounded bg-gray-50">
              <h3 className="text-xl font-semibold mb-2">Summary</h3>
              <p>{summary}</p>
            </div>
          )}
        </>
      ) : (
        <p>Please log in to use the summarizer.</p>
      )}
    </div>
  );
}
