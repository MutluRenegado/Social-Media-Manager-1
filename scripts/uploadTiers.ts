import { db } from "lib/firebase/firebase-config";
import { doc, setDoc } from "firebase/firestore";

const tiersData = [
  {
    id: "free",
    name: "Free Plan",
    description: "Ideal for bloggers who want to get started with basic hashtag tools and educational resources.",
    features: [
      { topic: "Hashtag Tools", items: ["Basic Hashtag Generation (up to 5 hashtags)", "Hashtag Counter"] },
      { topic: "SEO & Analytics", items: ["Basic keyword count", "Basic hashtag usage analytics"] },
      { topic: "Education", items: ["Hashtag & SEO Guide"] },
      { topic: "Monetization", items: ["Displaying Ads"] }
    ]
  },
  {
    id: "pro",
    name: "Pro Plan",
    description: "Best for professionals looking to grow their online reach with advanced SEO, AI, analytics, and customization tools.",
    features: [
      { topic: "Hashtag Generation & Optimization", items: ["Advanced Hashtag Suggestions", "Hashtag Length Analyzer", "Personalized Hashtag Settings", "Hashtag Grouping", "Custom Hashtag Templates"] },
      { topic: "SEO Tools", items: ["SEO Title & Meta Description Generator", "Keyword Density Analyzer", "Content Readability Score", "Keyword Analysis"] },
      { topic: "Analytics", items: ["Hashtag performance tracking", "Engagement insights"] },
      { topic: "AI-Powered Tools", items: ["AI Content Summarizer", "Sentiment Analysis", "Automatic Content Suggestions"] },
      { topic: "Social Media Integration", items: ["Social Media Scheduling", "Social Media Insights", "Direct Post Generation"] },
      { topic: "User Engagement", items: ["Content Feedback", "Collaboration Features"] },
      { topic: "Gamification", items: ["Hashtag Challenges", "Badges & Achievements", "Leaderboards"] },
      { topic: "Account Management", items: ["Multi-Account Support", "User Profile Customization", "Subscription Tier Management"] },
      { topic: "Education & Support", items: ["Webinars & Workshops", "Priority Customer Support"] },
      { topic: "Premium Integrations", items: ["Google Analytics", "Email Marketing", "Blogging Platform Integration"] },
      { topic: "Content Tools", items: ["Custom Blog Post Templates"] },
      { topic: "Monetization", items: ["Paid Plans"] }
    ]
  },
  {
    id: "elite",
    name: "Elite Plan",
    description: "For enterprises and power users who need the most advanced features, priority support, and exclusive integrations.",
    features: [
      { topic: "All Pro Features", items: ["Includes everything in Pro Plan"] },
      { topic: "Enterprise Integrations", items: ["Custom API Access", "Dedicated Account Manager", "Advanced Security Features"] },
      { topic: "Priority Support", items: ["24/7 Support", "Dedicated Support Team", "Faster Response Times"] },
      { topic: "Customization", items: ["Custom Branding", "Advanced Analytics Dashboards", "Tailored Training Sessions"] }
    ]
  }
];

export const uploadTiersToFirestore = async () => {
  for (const tier of tiersData) {
    await setDoc(doc(db, "tiers", tier.id), {
      name: tier.name,
      description: tier.description,
      features: tier.features
    });
  }
  console.log("Tier data uploaded successfully.");
};
