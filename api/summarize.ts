"use strict";
import OpenAI from 'openai';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'lib/firebase/firestore';
import { firebaseConfig } from 'lib/firebase/firebase-config';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }

    const summaryRes = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: `Summarize the following blog post:\n\n${text}` }],
    });

    const summary = summaryRes.choices[0].message.content;

    // Optional: Save to Firestore
    await addDoc(collection(db, 'blogSummaries'), {
      text,
      summary,
      createdAt: new Date(),
    });

    return res.status(200).json({ summary });
  } catch (error) {
    console.error('Summarize API error:', error instanceof Error ? error.message : error);
    return res.status(500).json({ error: 'Failed to summarize text.' });
  }
}
