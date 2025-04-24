'use client';

import { useState, useEffect } from 'react';
import { auth } from '@lib/firebase/firebase-config';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { loginWithGoogle } from '@lib/firebase/auth';
import { db } from '@lib/firebase/firebase-config';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import CheckoutButton from '../components/CheckoutButton';

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
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingHashtags, setLoadingHashtags] = useState(false);
  const [sendingParts, setSendingParts] = useState(false);
  const [userChoice, setUserChoice] = useState<string | null>(null);

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: blogText, email: user.email, tier: 'free' }),
      });

      const result = await response.json();
      if (response.ok) {
        setSummary(result.summary);
        setMessage('Summary generated!');
        setHashtags([]); // Clear hashtags when summarizing
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
      const response = await fetch('/api/hashtag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: blogText, email: user.email, tier: 'free' }),
      });

      const result = await response.json();
      if (response.ok) {
        setHashtags(result.hashtags);
        setMessage('Hashtags generated!');
        setSummary(''); // Clear summary when generating hashtags
      } else {
        setMessage(`Error: ${result.error || 'Something went wrong'}`);
      }
    } catch (err) {
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

    // Find split index based on last '.' near middle
    const mid = Math.floor(blogText.length / 2);
    let splitIndex = blogText.lastIndexOf('.', mid);
    if (splitIndex === -1) {
      splitIndex = blogText.indexOf('.', mid);
      if (splitIndex === -1) {
        splitIndex = mid;
      }
    }
    splitIndex += 1;

    const part1 = blogText.slice(0, splitIndex).trim();
    const part2 = blogText.slice(splitIndex).trim();

    try {
      const codePartsCollection = collection(db, "codes", user.uid, "codeParts");

      // Save part 1 with metadata
      await setDoc(doc(codePartsCollection, "part1"), {
        text: part1,
        order: 1,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      // Save part 2 with metadata
      await setDoc(doc(codePartsCollection, "part2"), {
        text: part2,
        order: 2,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      setMessage("Text parts sent to Firebase successfully! Please choose what to do next.");
    } catch (error) {
      console.error("Error sending to Firebase: ", error);
      setMessage("Failed to send text parts.");
    } finally {
      setSendingParts(false);
    }
  };

  const handleUserChoice = (choice: string) => {
    setUserChoice(choice);
    setMessage(`You chose to: ${choice}`);
    // Implement further logic based on user choice here
  };

  const [loadingRetrieve, setLoadingRetrieve] = useState(false);

  const retrieveSavedText = async () => {
    if (!user) {
      setMessage('You must be logged in to retrieve saved text.');
      return;
    }
    setLoadingRetrieve(true);
    setMessage('');
    try {
      const part1Doc = await import('firebase/firestore').then(({ doc, getDoc }) => {
        return getDoc(doc(db, "codes", user.uid, "codeParts", "part1"));
      });
      const part2Doc = await import('firebase/firestore').then(({ doc, getDoc }) => {
        return getDoc(doc(db, "codes", user.uid, "codeParts", "part2"));
      });

      const part1Text = part1Doc.exists() ? part1Doc.data().text : '';
      const part2Text = part2Doc.exists() ? part2Doc.data().text : '';

      const combinedText = (part1Text + ' ' + part2Text).trim();

      if (combinedText) {
        setBlogText(combinedText);
        setMessage('Saved text retrieved successfully!');
      } else {
        setMessage('No saved text found.');
      }
    } catch (error) {
      console.error('Error retrieving saved text:', error);
      setMessage('Failed to retrieve saved text.');
    } finally {
      setLoadingRetrieve(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: '2rem', fontFamily: 'Arial' }}>
      <h2>🧠 Blog Summarizer + Hashtag Generator</h2>

      {user ? (
        <>
          <p>Logged in as: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
          <CheckoutButton priceId="price_1234567890abcdef" />
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

      <div style={{ position: 'relative' }}>
        <textarea
          value={blogText}
          onChange={(e) => setBlogText(e.target.value)}
          placeholder="Paste your blog post here..."
          style={{ width: '100%', height: '150px', marginBottom: '10px', resize: 'vertical' }}
          disabled={!user || loadingSummary || loadingHashtags || sendingParts}
        />
        <div style={{ position: 'absolute', bottom: 4, right: 8, fontSize: '0.8rem', color: '#666' }}>
          {blogText.length} characters
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <button
          onClick={summarizeText}
          disabled={!user || loadingSummary || sendingParts}
          style={{ flex: 1, backgroundColor: '#007bff', color: 'white', padding: '10px' }}
        >
          {loadingSummary ? 'Summarizing...' : 'Summarize'}
        </button>
        <button
          onClick={generateHashtags}
          disabled={!user || loadingHashtags || sendingParts}
          style={{ flex: 1, backgroundColor: '#28a745', color: 'white', padding: '10px' }}
        >
          {loadingHashtags ? 'Generating...' : 'Generate Hashtags'}
        </button>
        <button
          onClick={splitAndSendTextParts}
          disabled={!user || sendingParts}
          style={{ flex: 1, backgroundColor: '#6c757d', color: 'white', padding: '10px' }}
        >
          {sendingParts ? 'Sending...' : 'Split & Send'}
        </button>
        <button
          onClick={retrieveSavedText}
          disabled={!user || loadingRetrieve}
          style={{ flex: 1, backgroundColor: '#17a2b8', color: 'white', padding: '10px' }}
        >
          {loadingRetrieve ? 'Retrieving...' : 'Retrieve Saved Text'}
        </button>
      </div>

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

      {userChoice === null && !sendingParts && (
        <div style={{ marginTop: '20px' }}>
          <h3>What would you like to do next?</h3>
          <button onClick={() => handleUserChoice('Summarize')} style={{ marginRight: '10px' }}>
            Summarize
          </button>
          <button onClick={() => handleUserChoice('Generate Hashtags')} style={{ marginRight: '10px' }}>
            Generate Hashtags
          </button>
          <button onClick={() => handleUserChoice('Clear Text')}>
            Clear Text
          </button>
        </div>
      )}

      {userChoice && (
        <div style={{ marginTop: '20px' }}>
          <h3>You chose to: {userChoice}</h3>
          <button onClick={() => setUserChoice(null)}>Reset Choice</button>
        </div>
      )}
    </div>
  );
}
