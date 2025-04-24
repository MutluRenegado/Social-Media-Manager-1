"use client";

import { useEffect, useState } from "react";
import { auth, db } from "lib/firebase/firebase-config";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

export default function MembersPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [tier, setTier] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserTier = async (uid: string) => {
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setTier(userData.tier || "free");
      } else {
        setTier("free"); // default to free if no user doc
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserTier(currentUser.uid);
      } else {
        router.push("/"); // redirect to home or login page if not authenticated
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Members Area</h1>
      <p>Welcome, {user?.email}!</p>
      <p>Your current subscription tier: {tier}</p>
      <p>This is a protected members-only area.</p>
    </main>
  );
}
