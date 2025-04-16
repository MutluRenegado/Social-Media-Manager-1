'use client';

import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);

  const handleSubmit = async () => {
    if (text.trim() === '') return;

    setLoading(true);
    setSummary('');
    setHashtags('');
    setPolling(true);

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong!');
      }

      const blogPostId = data.blogPostId;

      // Start polling
      pollResults(blogPostId);
    } catch (error: unknown) {
      // Handle the error properly
      if (error instanceof Error) {
        setSummary(`❌ Error: ${error.message}`);
      } else {
        setSummary('❌ Unknown error occurred.');
      }
      setHashtags('');
      console.error('Frontend error:', error);
    }
  };

  // Polling function
  const pollResults = async (blogPostId: string) => {
    const pollInterval = setInterval(async () => {
      const res = await fetch(`/api/poll-status?blogPostId=${blogPostId}`);
      const data = await res.json();

      if (data.status === 'done') {
        setSummary(data.summary);
        setHashtags(data.hashtags);
        clearInterval(pollInterval);
        setPolling(false);
      } else if (data.status === 'processing') {
        // Continue polling every 5 seconds
      }
    }, 5000); // Poll every 5 seconds
  };

  return (
    <main className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">🧠 Blog Summarizer + Hashtag Generator</h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your blog post here..."
        className="w-full border rounded p-2 min-h-[150px]"
      />

      <button
        onClick={handleSubmit}
        disabled={loading || polling}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading || polling ? 'Processing...' : 'Summarize & Generate Hashtags'}
      </button>

      {summary && (
        <>
          <h2 className="text-xl font-semibold">📄 Summary</h2>
          <p className="bg-gray-100 p-3 rounded whitespace-pre-wrap">{summary}</p>
        </>
      )}

      {hashtags && (
        <>
          <h2 className="text-xl font-semibold">🏷️ Hashtags</h2>
          <p className="bg-gray-100 p-3 rounded whitespace-pre-wrap">{hashtags}</p>
        </>
      )}
    </main>
  );
}
