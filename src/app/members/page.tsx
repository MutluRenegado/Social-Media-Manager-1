"use client";

import { useEffect, useState } from "react";
import { auth } from "lib/firebase/firebase-config";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function MembersPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
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
      <p>This is a protected members-only area.</p>
    </main>
  );
}
