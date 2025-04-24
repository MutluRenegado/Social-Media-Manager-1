'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '@lib/firebase/firebase-config';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { loginWithGoogle } from '@lib/firebase/auth';
import { db } from '@lib/firebase/firebase-config';
import { collection, doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import CheckoutButton from '../components/CheckoutButton';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [blogText, setBlogText] = useState('');
  const [message, setMessage] = useState('');
  const [summary, setSummary] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingHashtags, setLoadingHashtags] = useState(false);
  const [sendingParts, setSendingParts] = useState(false);
  const [userChoice, setUserChoice] = useState<string | null>(null);
  const [loadingRetrieve, setLoadingRetrieve] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

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

  const summarizeText = async () => {
    setMessage('');
    setSummary('');
    setHashtags([]);

    if (!blogText.trim()) {
      setMessage('Please enter some text!');
      return;
    }

    setLoadingSummary(true);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: blogText, email: user.email, tier: 'free' }),
      });

      const result = await response.json();
      if (response.ok) {
        setSummary(result.summary);
        setMessage('Summary generated!');
      } else {
        setMessage(`Error: ${result.error || 'Something went wrong'}`);
      }
    } catch {
      setMessage('❌ Something went wrong while connecting to the server.');
    } finally {
      setLoadingSummary(false);
    }
  };

  const generateHashtags = async () => {
    setMessage('');
    setHashtags([]);
    setSummary('');

    if (!blogText.trim()) {
      setMessage('Please enter some text!');
      return;
    }

    setLoadingHashtags(true);

    try {
      const userDocRef = doc(db, 'users', user.email);
      const userDocSnap = await getDoc(userDocRef);
      const tier = userDocSnap.exists() ? userDocSnap.data()?.tier || 'free' : 'free';

      const response = await fetch('/api/hashtag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: blogText, email: user.email, tier }),
      });

      const result = await response.json();
      if (response.ok) {
        setHashtags(result.hashtags);
        setMessage('Hashtags generated!');
      } else {
        setMessage(`Error: ${result.error || 'Something went wrong'}`);
      }
    } catch {
      setMessage('❌ Something went wrong while connecting to the server.');
    } finally {
      setLoadingHashtags(false);
    }
  };

  const splitAndSendTextParts = async () => {
    if (!blogText.trim()) {
      setMessage('Please enter some text to split and send.');
      return;
    }
    if (!user) {
      setMessage('You must be logged in to send text parts.');
      return;
    }

    setSendingParts(true);
    setMessage('');
    setUserChoice(null);

    const mid = Math.floor(blogText.length / 2);
    let splitIndex = blogText.lastIndexOf('.', mid);
    if (splitIndex === -1) splitIndex = blogText.indexOf('.', mid);
    if (splitIndex === -1) splitIndex = mid;
    splitIndex += 1;

    const part1 = blogText.slice(0, splitIndex).trim();
    const part2 = blogText.slice(splitIndex).trim();

    try {
      const codePartsCollection = collection(db, "codes", user.uid, "codeParts");
      await setDoc(doc(codePartsCollection, "part1"), {
        text: part1, order: 1, userId: user.uid, createdAt: serverTimestamp(),
      });
      await setDoc(doc(codePartsCollection, "part2"), {
        text: part2, order: 2, userId: user.uid, createdAt: serverTimestamp(),
      });

      setMessage("Text parts sent to Firebase successfully! Please choose what to do next.");
    } catch (error) {
      console.error("Error sending to Firebase: ", error);
      setMessage("Failed to send text parts.");
    } finally {
      setSendingParts(false);
    }
  };

  const retrieveSavedText = async () => {
    if (!user) {
      setMessage('You must be logged in to retrieve saved text.');
      return;
    }

    setLoadingRetrieve(true);
    setMessage('');

    try {
      const part1Snap = await getDoc(doc(db, "codes", user.uid, "codeParts", "part1"));
      const part2Snap = await getDoc(doc(db, "codes", user.uid, "codeParts", "part2"));
      const text = [part1Snap.data()?.text || '', part2Snap.data()?.text || ''].join(' ').trim();
      text ? setBlogText(text) : setMessage('No saved text found.');
    } catch (error) {
      console.error('Error retrieving saved text:', error);
      setMessage('Failed to retrieve saved text.');
    } finally {
      setLoadingRetrieve(false);
    }
  };

  const handleUserChoice = (choice: string) => {
    setUserChoice(choice);
    setMessage(`You chose to: ${choice}`);
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: '2rem', fontFamily: 'Arial' }}>
      <h2>🧠 Blog Summarizer + Hashtag Generator</h2>

      {user ? (
        <>
          <p>Logged in as: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
          <CheckoutButton
            priceId="price_1234567890abcdef"
            onError={() => setCheckoutError('⚠️ Checkout failed. Please try again later.')}
          />
          {checkoutError && <p style={{ color: 'red' }}>{checkoutError}</p>}
        </>
      ) : (
        <>
          <p>{isSignUp ? 'Create an account' : 'Not logged in'}</p>
          {!showEmailLogin ? (
            <>
              <button onClick={() => setShowEmailLogin(true)} style={{ marginBottom: '10px' }}>
                Login with Email
              </button>
              <button onClick={loginWithGoogle} style={{ background: '#007bff', color: 'white', padding: '10px', width: '100%' }}>
                Login with Google
              </button>
            </>
          ) : (
            <>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
              <button onClick={isSignUp ? handleSignUp : handleLogin}>
                {isSignUp ? 'Sign Up' : 'Login'}
              </button>
              <button onClick={() => setIsSignUp(!isSignUp)}>{isSignUp ? 'Switch to Login' : 'Switch to Sign Up'}</button>
              <button onClick={() => setShowEmailLogin(false)}>Cancel</button>
            </>
          )}
        </>
      )}

      <hr style={{ margin: '20px 0' }} />

      <textarea
        value={blogText}
        onChange={(e) => setBlogText(e.target.value)}
        placeholder="Paste your blog post here..."
        style={{ width: '100%', height: '150px' }}
        disabled={!user || loadingSummary || loadingHashtags || sendingParts}
      />

      <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
        <button onClick={summarizeText} disabled={!user || loadingSummary || sendingParts}>
          {loadingSummary ? 'Summarizing...' : 'Summarize'}
        </button>
        <button onClick={generateHashtags} disabled={!user || loadingHashtags || sendingParts}>
          {loadingHashtags ? 'Generating...' : 'Generate Hashtags'}
        </button>
        <button onClick={splitAndSendTextParts} disabled={!user || sendingParts}>
          {sendingParts ? 'Sending...' : 'Split & Send'}
        </button>
        <button onClick={retrieveSavedText} disabled={!user || loadingRetrieve}>
          {loadingRetrieve ? 'Retrieving...' : 'Retrieve Saved Text'}
        </button>
      </div>

      {message && <p><strong>{message}</strong></p>}

      {summary && <><h3>📄 Summary</h3><p>{summary}</p></>}
      {hashtags.length > 0 && <><h3>🏷️ Hashtags</h3><p>{hashtags.join(' ')}</p></>}
      {userChoice === null && !sendingParts && (
        <>
          <h3>What would you like to do next?</h3>
          <button onClick={() => handleUserChoice('Summarize')}>Summarize</button>
          <button onClick={() => handleUserChoice('Generate Hashtags')}>Generate Hashtags</button>
        </>
      )}
    </div>
  );
}
