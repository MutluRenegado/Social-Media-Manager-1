'use client';

import { useState, useEffect } from 'react';
import { loginWithGoogle, logout, listenForAuthChanges } from '../../firebase/auth';
import { db } from '../../firebase/firestore';
import { setDoc, doc } from 'firebase/firestore';
import { User } from 'firebase/auth'; // Import the User type
import Poll from '../components/Poll';

export default function Home() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Use User | null instead of any

  useEffect(() => {
    const unsubscribe = listenForAuthChanges(setUser);
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const handleSubmit = async () => {
    if (text.trim() === '' || !user) return;

    setLoading(true);
    setSummary('');
    setHashtags('');

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

      setSummary(data.summary);
      setHashtags(data.hashtags);

      // Store result in Firestore under user's UID
      await setDoc(doc(db, 'users', user.uid, 'summaries', new Date().toISOString()), {
        text,
        summary: data.summary,
        hashtags: data.hashtags,
        createdAt: new Date(),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSummary(`❌ Error: ${error.message}`);
      } else {
        setSummary('❌ Unknown error occurred.');
      }
      setHashtags('');
      console.error('Frontend error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">🧠 Blog Summarizer + Hashtag Generator</h1>

      {user ? (
        <div>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
          <p>Welcome, {user.displayName}!</p>
        </div>
      ) : (
        <button
          onClick={loginWithGoogle}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Login with Google
        </button>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your blog post here..."
        className="w-full border rounded p-2 min-h-[150px]"
        disabled={!user}
      />

      <button
        onClick={handleSubmit}
        disabled={loading || !user}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Summarizing...' : 'Summarize & Generate Hashtags'}
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

      <Poll />
    </main>
  );
}
