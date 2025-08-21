// Client + Admin Firebase setup (Next.js / Node)
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { App, cert, getApps as getAdminApps, initializeApp as initializeAdminApp } from "firebase-admin/app";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";

// ---- Client ----
const clientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

export const clientApp = getApps().length ? getApp() : initializeApp(clientConfig);
export const clientAuth = getAuth(clientApp);
export const clientDb = getFirestore(clientApp);

// ---- Admin ----
function getAdmin() {
  if (getAdminApps().length) {
    return getAdminApps()[0]!.name as string;
  }
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing Firebase admin env vars");
  }
  // Handle escaped newlines
  privateKey = privateKey.replace(/\\n/g, "\n");
  initializeAdminApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
  return getAdminApps()[0]!.name as string;
}
getAdmin();
export const adminDb = getAdminFirestore();
