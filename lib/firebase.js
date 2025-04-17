// src/firebase/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCUa1SEk1qG0TbvuCtw8Ve6VctnlaBAgVQ",
  authDomain: "netlistore.firebaseapp.com",
  projectId: "netlistore",
  storageBucket: "netlistore.firebasestorage.app",
  messagingSenderId: "167604807583",
  appId: "1:167604807583:web:589e86070d77ba710cffaa"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

const loginWithGoogle = () => signInWithPopup(auth, provider);
const logout = () => signOut(auth);
const listenForAuthChanges = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};

export { app, db, auth, loginWithGoogle, logout, listenForAuthChanges };
