"use client";

import { useEffect, useState } from "react";
import { db } from "lib/firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import CheckoutButton from "src/components/CheckoutButton";

interface Feature {
  topic: string;
  items: string[];
}

interface Tier {
  id: string;
  name: string;
  description: string;
  features: Feature[];
}

type BillingOption = "monthly" | "yearly";

const priceIdMap: Record<string, Record<BillingOption, string>> = {
  pro: {
    monthly: "price_pro_monthly_id", // Replace with actual Stripe price ID for pro monthly
    yearly: "price_pro_yearly_id",   // Replace with actual Stripe price ID for pro yearly
  },
  elite: {
    monthly: "price_elite_monthly_id", // Replace with actual Stripe price ID for elite monthly
    yearly: "price_elite_yearly_id",   // Replace with actual Stripe price ID for elite yearly
  },
};

export default function PricingPage() {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [billingOption, setBillingOption] = useState<BillingOption>("monthly");

  useEffect(() => {
    const fetchTiers = async () => {
      const tiersCol = collection(db, "tiers");
      const tiersSnapshot = await getDocs(tiersCol);
      const tiersList: Tier[] = tiersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Tier, "id">),
      }));
      setTiers(tiersList);
    };
    fetchTiers();
  }, []);

  const handleBillingChange = (option: BillingOption) => {
    setBillingOption(option);
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Pricing Plans</h1>
      <div style={{ marginBottom: "1rem", textAlign: "center" }}>
        <label>
          <input
            type="radio"
            name="billing"
            value="monthly"
            checked={billingOption === "monthly"}
            onChange={() => handleBillingChange("monthly")}
          />
          Monthly
        </label>
        <label style={{ marginLeft: "1rem" }}>
          <input
            type="radio"
            name="billing"
            value="yearly"
            checked={billingOption === "yearly"}
            onChange={() => handleBillingChange("yearly")}
          />
          Yearly
        </label>
      </div>
      <div style={{ display: "flex", gap: "2rem", justifyContent: "center" }}>
        {tiers.map((tier) => (
          <div key={tier.id} style={{ border: "1px solid #ccc", padding: "1rem", width: "300px" }}>
            <h2>{tier.name}</h2>
            <p>{tier.description}</p>
            <ul>
              {tier.features.map((feature) => (
                <li key={feature.topic}>
                  <strong>{feature.topic}</strong>
                  <ul>
                    {feature.items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            {tier.id !== "free" && (
              <CheckoutButton priceId={priceIdMap[tier.id]?.[billingOption] || ""} />
            )}
            {tier.id === "free" && (
              <button disabled style={{ cursor: "not-allowed" }}>
                Current Plan
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
