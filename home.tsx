'use client';

import { useState, useEffect } from 'react';
import { auth } from '@lib/firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { loginWithGoogle } from '@lib/firebase/auth';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [blogText, setBlogText] = useState('');
  const [message, setMessage] = useState('');
  const [summary, setSummary] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      alert('Login failed: ' + err.message);
    }
  };

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      alert('Sign-up failed: ' + err.message);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const submitText = async () => {
    setMessage('');
    setSummary('');
    setHashtags([]);

    if (!blogText.trim()) {
      setMessage('Please enter some text!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: blogText, email: user.email, tier: 'free' }),
      });

      const result = await response.json();
      if (response.ok) {
        setSummary(result.summary);
        setHashtags(result.hashtags);
        setMessage('Summary and hashtags generated!');
      } else {
        setMessage(`Error: ${result.error || 'Something went wrong'}`);
      }
    } catch (err) {
      setMessage('❌ Something went wrong while connecting to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: '2rem', fontFamily: 'Arial' }}>
      <h2>🧠 Blog Summarizer + Hashtag Generator</h2>

      {user ? (
        <>
          <p>Logged in as: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <p>{isSignUp ? 'Create an account' : 'Not logged in'}</p>

          {!showEmailLogin && (
            <>
              <button onClick={() => setShowEmailLogin(true)} style={{ marginBottom: '10px' }}>
                Login with Email
              </button>
              <button onClick={loginWithGoogle} style={{ background: '#007bff', color: 'white', padding: '10px', width: '100%' }}>
                Login with Google
              </button>
            </>
          )}

          {showEmailLogin && (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={{ width: '100%', marginBottom: '10px' }}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ width: '100%', marginBottom: '10px' }}
              />
              <button onClick={isSignUp ? handleSignUp : handleLogin}>
                {isSignUp ? 'Sign Up' : 'Login'}
              </button>
              <button onClick={() => setIsSignUp(!isSignUp)} style={{ marginLeft: '10px' }}>
                {isSignUp ? 'Switch to Login' : 'Switch to Sign Up'}
              </button>
              <button onClick={() => setShowEmailLogin(false)} style={{ marginTop: '10px', display: 'block' }}>
                Cancel
              </button>
            </>
          )}
        </>
      )}

      <hr style={{ margin: '20px 0' }} />

      <textarea
        value={blogText}
        onChange={(e) => setBlogText(e.target.value)}
        placeholder="Paste your blog post here..."
        style={{ width: '100%', height: '150px', marginBottom: '10px' }}
        disabled={!user || loading}
      />
      <button
        onClick={submitText}
        disabled={!user || loading}
        style={{ backgroundColor: '#007bff', color: 'white', padding: '10px', width: '100%' }}
      >
        {loading ? 'Summarizing...' : 'Summarize & Generate Hashtags'}
      </button>

      {message && (
        <div style={{ marginTop: '20px', whiteSpace: 'pre-line' }}>
          <strong>{message}</strong>
        </div>
      )}

      {summary && (
        <div style={{ marginTop: '20px' }}>
          <h3>📄 Summary</h3>
          <p>{summary}</p>
        </div>
      )}

      {hashtags.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>🏷️ Hashtags</h3>
          <p>{hashtags.join(' ')}</p>
        </div>
      )}
    </div>
  );
}
