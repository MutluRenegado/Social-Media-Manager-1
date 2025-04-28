'use client'

//src/components/BlogPostForms

import React, { useState } from 'react';

interface BlogPostFormProps {
  user: {
    uid: string;
  };
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({ user }) => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent page reload

    if (text.trim() === '' || !user) return;

    setLoading(true);
    setSummary('');
    setHashtags([]);

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, userId: user.uid }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      setSummary(data.summary);
      setHashtags(data.hashtags);
    } catch (error) {
      setSummary(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error occurred.'}`);
      setHashtags([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your blog post here..."
          className="p-4 border rounded-lg resize-none min-h-[150px] focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>

      {summary && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Summary</h2>
          <p className="text-gray-700">{summary}</p>
        </div>
      )}

      {Array.isArray(hashtags) && hashtags.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Hashtags</h2>
          <div className="bg-gray-100 p-3 rounded flex flex-wrap gap-2">
            {hashtags.map((tag) => (
              <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPostForm;
