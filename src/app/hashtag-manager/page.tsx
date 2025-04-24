"use client";

import { useEffect, useState } from "react";
import { db } from "lib/firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore";

interface Feature {
  topic: string;
  items: string[];
}

interface Tier {
  id: string;
  name: string;
  features: Feature[];
}

export default function HashtagManagerPage() {
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    const fetchProFeatures = async () => {
      const tiersCol = collection(db, "tiers");
      const tiersSnapshot = await getDocs(tiersCol);
      const proTier = tiersSnapshot.docs.find(doc => doc.id === "pro");
      if (proTier) {
        const data = proTier.data() as Tier;
        setFeatures(data.features);
      }
    };
    fetchProFeatures();
  }, []);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Hashtag Manager</h1>
      {features.length === 0 ? (
        <p>Loading features...</p>
      ) : (
        <div>
          {features.map((feature) => (
            <section key={feature.topic} style={{ marginBottom: "1.5rem" }}>
              <h2>{feature.topic}</h2>
              <ul>
                {feature.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
