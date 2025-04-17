// src/firebase/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signOut, signInWithPopup, User } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Google authentication provider
const googleProvider = new GoogleAuthProvider();

// Auth functions
const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
const logout = () => signOut(auth);

// Listen for authentication state changes
const listenForAuthChanges = (callback: (user: User | null) => void) => onAuthStateChanged(auth, callback);

// Export the necessary objects and functions
export { app, auth, db, googleProvider, loginWithGoogle, logout, listenForAuthChanges, setDoc, doc };
