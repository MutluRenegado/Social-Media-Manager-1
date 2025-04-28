import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Only initialize once
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

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
      messages: [
        {
          role: 'user',
          content: `Generate 30 relevant and popular hashtags for this text:\n\n${text}`,
        },
      ],
    });

    const hashtags = hashtagRes.choices[0].message.content;

    const hashtagsArray = hashtags
      .split('\n')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    await db.collection('blogHashtags').add({
      text,
      hashtags: hashtagsArray,
      createdAt: new Date(),
    });

    return res.status(200).json({ hashtags: hashtagsArray });
  } catch (error) {
    console.error('Hashtag API error:', error);
    return res.status(500).json({ error: 'Failed to generate hashtags.' });
  }
}
