'use client';
//home.tsx
import { useState, useEffect } from 'react';
import { loginWithGoogle, logout, listenForAuthChanges } from '@/firebase/auth';
import { storeSummary } from '@/firebase/firestore';
import Poll from '@/components/Poll'; // Adjusted using alias path
export default function Home() {
    const [text, setText] = useState('');
    const [summary, setSummary] = useState('');
    const [hashtags, setHashtags] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null); // Replace 'any' with proper user type if using TypeScript Firebase types
    useEffect(() => {
        listenForAuthChanges(setUser);
    }, []);
    const handleSubmit = async () => {
        if (text.trim() === '' || !user)
            return;
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
            await storeSummary(user, text, data.summary, data.hashtags);
        }
        catch (error) {
            if (error instanceof Error) {
                setSummary(`❌ Error: ${error.message}`);
            }
            else {
                setSummary('❌ Unknown error occurred.');
            }
            setHashtags('');
            console.error('Frontend error:', error);
        }
        finally {
            setLoading(false);
        }
    };
    return (React.createElement("main", { className: "max-w-2xl mx-auto p-4 space-y-4" },
        React.createElement("h1", { className: "text-2xl font-bold" }, "\uD83E\uDDE0 Blog Summarizer + Hashtag Generator"),
        user ? (React.createElement("div", { className: "space-y-2" },
            React.createElement("button", { onClick: logout, className: "bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700" }, "Logout"),
            React.createElement("p", null,
                "Welcome, ",
                user.displayName || 'User',
                "!"))) : (React.createElement("button", { onClick: loginWithGoogle, className: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" }, "Login with Google")),
        React.createElement("textarea", { value: text, onChange: (e) => setText(e.target.value), placeholder: "Paste your blog post here...", className: "w-full border rounded p-2 min-h-[150px]", disabled: !user }),
        React.createElement("button", { onClick: handleSubmit, disabled: loading || !user, className: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" }, loading ? 'Summarizing...' : 'Summarize & Generate Hashtags'),
        summary && (React.createElement(React.Fragment, null,
            React.createElement("h2", { className: "text-xl font-semibold" }, "\uD83D\uDCC4 Summary"),
            React.createElement("p", { className: "bg-gray-100 p-3 rounded whitespace-pre-wrap" }, summary))),
        hashtags && (React.createElement(React.Fragment, null,
            React.createElement("h2", { className: "text-xl font-semibold" }, "\uD83C\uDFF7\uFE0F Hashtags"),
            React.createElement("p", { className: "bg-gray-100 p-3 rounded whitespace-pre-wrap" }, hashtags))),
        React.createElement(Poll, null)));
}
