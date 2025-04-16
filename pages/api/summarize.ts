import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }

    // Step 1: Summarize the blog post
    const summaryRes = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: `Summarize the following blog post:\n\n${text}` }],
    });

    const summary = summaryRes.choices[0].message.content;

    // Step 2: Generate hashtags
    const hashtagRes = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: `Generate 30 relevant and popular hashtags for this blog summary:\n\n${summary}` }],
    });

    const hashtags = hashtagRes.choices[0].message.content;

    // Step 3: Store the blog post, summary, and hashtags in Firestore
    const blogPostRef = await addDoc(collection(db, 'blogPosts'), {
      text,
      summary,
      hashtags,
      createdAt: new Date(),
    });

    // Step 4: Return the summary and hashtags
    return res.status(200).json({ summary, hashtags });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('API error:', error.message);
      return res.status(500).json({ error: 'Failed to summarize or generate hashtags.' });
    }
    console.error('Unknown error:', error);
    return res.status(500).json({ error: 'An unknown error occurred.' });
  }
}
