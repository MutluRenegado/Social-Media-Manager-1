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

    const hashtagRes = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: `Generate 30 relevant and popular hashtags for this text:\n\n${text}` }],
    });

    const hashtags = hashtagRes.choices[0].message.content;

    const hashtagsArray = hashtags
      .split('\n')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    // Optional: Save to Firestore
    await addDoc(collection(db, 'blogHashtags'), {
      text,
      hashtags: hashtagsArray,
      createdAt: new Date(),
    });

    return res.status(200).json({ hashtags: hashtagsArray });
  } catch (error) {
    console.error('Hashtag API error:', error instanceof Error ? error.message : error);
    return res.status(500).json({ error: 'Failed to generate hashtags.' });
  }
}
