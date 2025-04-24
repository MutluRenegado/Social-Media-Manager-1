"use client";
import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { loginWithGoogle, logout, listenForAuthChanges, loginUser, registerUser } from "../../lib/firebase/auth";
import { db } from "../../lib/firebase/firestore";
import { doc, setDoc } from "firebase/firestore";

export default function Home() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const unsubscribe = listenForAuthChanges(setUser);
    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (text.trim() === "" || !user) return;

    setLoading(true);
    setSummary("");
    setHashtags("");

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, email: user.email, tier: "free" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong!");
      }

      if (data.status === "pending") {
        // pollForResult(data.jobId); // Removed polling for poll-status
      } else {
        setSummary(data.summary);
        setHashtags(data.hashtags);
        await saveToFirestore(data.summary, data.hashtags);
      }
    } catch (error) {
      if (error instanceof Error) {
        setSummary(`❌ Error: ${error.message}`);
      } else {
        setSummary("❌ Unknown error occurred.");
      }
      setHashtags("");
      console.error("Frontend error:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveToFirestore = async (summary: string, hashtags: string) => {
    if (!user) return;
    await setDoc(doc(db, "users", user.uid, "summaries", new Date().toISOString()), {
      text,
      summary,
      hashtags,
      createdAt: new Date(),
    });
  };

  const handleEmailLogin = async () => {
    setErrorMessage("");
    try {
      await loginUser(email, password);
    } catch (error: any) {
      setErrorMessage(error.message || "Login failed");
    }
  };

  const handleEmailSignUp = async () => {
    setErrorMessage("");
    try {
      await registerUser(email, password);
    } catch (error: any) {
      setErrorMessage(error.message || "Sign-up failed");
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">🤠 Blog Summarizer + Hashtag Generator</h1>
      {user ? (
        <div>
          <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded-sm hover:bg-red-700">
            Logout
          </button>
          <p>Welcome, {user.displayName || user.email}!</p>
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-sm p-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-sm p-2"
          />
          <div className="flex space-x-2">
            <button
              onClick={isSignUp ? handleEmailSignUp : handleEmailLogin}
              className="bg-blue-600 text-white px-4 py-2 rounded-sm hover:bg-blue-700"
            >
              {isSignUp ? "Sign Up" : "Login"}
            </button>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="bg-gray-600 text-white px-4 py-2 rounded-sm hover:bg-gray-700"
            >
              {isSignUp ? "Switch to Login" : "Switch to Sign Up"}
            </button>
          </div>
          <button
            onClick={async () => {
              try {
                setLoading(true);
                await loginWithGoogle();
              } catch (error) {
                console.error("Login error:", error);
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-sm hover:bg-blue-700 w-full"
          >
            Login with Google
          </button>
          {errorMessage && <p className="text-red-600">{errorMessage}</p>}
        </div>
      )}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your blog post here..."
        className="w-full border rounded-sm p-2 min-h-[150px]"
        disabled={!user}
      />
      <button
        onClick={handleSubmit}
        disabled={loading || !user}
        className="bg-blue-600 text-white px-4 py-2 rounded-sm hover:bg-blue-700"
      >
        {loading ? "Summarizing..." : "Summarize & Generate Hashtags"}
      </button>
      {summary && (
        <>
          <h2 className="text-xl font-semibold">📄 Summary</h2>
          <p className="bg-gray-100 p-3 rounded-sm whitespace-pre-wrap">{summary}</p>
        </>
      )}
      {hashtags && (
        <>
          <h2 className="text-xl font-semibold">🏷️ Hashtags</h2>
          <p className="bg-gray-100 p-3 rounded-sm whitespace-pre-wrap">{hashtags}</p>
        </>
      )}
    </main>
  );
}
