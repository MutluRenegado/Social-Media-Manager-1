'use client'; // if using App Router

import { useState, useEffect } from 'react';
import { auth, db } from 'lib/firebase'; // ✅ updated path
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import { loginWithGoogle } from 'lib/firebase/auth'; // Make sure you have the correct method for Google login

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSignUp, setIsSignUp] = useState<boolean>(false); // Toggle between sign-up and login
  const [blogText, setBlogText] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  // Listen for auth state changes (login/logout)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Handle login with email and password
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      alert('Login failed: ' + err.message);
    }
  };

  // Handle sign-up with email and password
  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      alert('Sign-up failed: ' + err.message);
    }
  };

  // Logout user
  const handleLogout = () => {
    signOut(auth);
  };

  // Submit blog text for processing
  const submitText = async () => {
    setMessage('');
    if (!blogText.trim()) {
      setMessage('Please enter some text!');
      return;
    }

    const token = await user.getIdToken();
    const response = await fetch('/.netlify/functions/generate-background', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ text: blogText }),
    });

    const result = await response.json();
    if (response.ok) {
      setMessage('Your request is being processed!');
      pollResults(user.uid);
    } else {
      setMessage(`Error: ${result.error || 'Something went wrong'}`);
    }
  };

  // Poll for processing status
  const pollResults = async (userId: string) => {
    const response = await fetch(`/.netlify/functions/check-status?user_id=${userId}`);
    const data = await response.json();
    if (data.status === 'done') {
      setMessage(`Summary: ${data.summary}\nHashtags: ${data.hashtags}`);
    } else {
      setTimeout(() => pollResults(userId), 5000);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: '2rem', fontFamily: 'Arial' }}>
      <h2>Blog Post Summarizer & Hashtag Generator</h2>

      {user ? (
        <>
          <p>Logged in as: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <p>{isSignUp ? 'Create an account' : 'Not logged in'}</p>
          <div>
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
          </div>
        </>
      )}

      <textarea
        value={blogText}
        onChange={(e) => setBlogText(e.target.value)}
        placeholder="Paste your blog post here..."
        style={{ width: '100%', height: '150px', marginTop: '20px' }}
        disabled={!user}
      />
      <button onClick={submitText} disabled={!user} style={{ marginTop: '10px' }}>
        Submit
      </button>

      {message && <p style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>{message}</p>}
    </div>
  );
}
