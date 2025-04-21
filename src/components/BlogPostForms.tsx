'use client';

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

  const handleSubmit = async () => {
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
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your blog post here..."
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Processing...' : 'Submit'}
      </button>

      {summary && (
        <div>
          <h2>Summary</h2>
          <p>{summary}</p>
        </div>
      )}

      {Array.isArray(hashtags) && (
        <p className="bg-gray-100 p-3 rounded whitespace-pre-wrap">
          {hashtags.map((tag) => (
            <span key={tag} className="mr-2">
              {tag}
            </span>
          ))}
        </p>
      )}
    </div>
  );
};

export default BlogPostForm;
