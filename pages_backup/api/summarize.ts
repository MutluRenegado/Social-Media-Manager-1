import { OpenAI } from 'openai';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'lib/firebase/firestore';
import firebaseConfig from 'lib/firebase/firebase-config';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    console.log('Method not allowed');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, userId } = req.body;
    console.log('Received request with text and userId:', text, userId);
    if (!text || !userId) {
      console.log('Missing blog text or user info');
      return res.status(400).json({ error: 'Missing blog text or user info' });
    }

    // Split text by period and divide into 2 halves
    const sentences = text.split('.').filter(s => s.trim() !== '');
    const mid = Math.floor(sentences.length / 2);
    const part1 = sentences.slice(0, mid).join('.') + '.';
    const part2 = sentences.slice(mid).join('.') + '.';

    console.log('Text split into two parts:', part1, part2);

    const summarize = async (txt: string) => {
      console.log('Summarizing text:', txt);
      const res = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: `Summarize this blog content:\n${txt}` }],
      });
      console.log('Summarization result:', res.choices[0].message.content);
      return res.choices[0].message.content?.trim() || '';
    };

    const getHashtags = async (summary: string) => {
      console.log('Generating hashtags for summary:', summary);
      const res = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: `Generate 2 relevant and popular hashtags (comma-separated, no # symbols):\n${summary}` }],
      });
      console.log('Hashtags result:', res.choices[0].message.content);
      return res.choices[0].message.content
        ?.split(',')
        .map(t => '#' + t.trim().replace(/^#/, ''))
        .slice(0, 2) || [];
    };

    const summary1 = await summarize(part1);
    const summary2 = await summarize(part2);
    const hashtags1 = await getHashtags(summary1);
    const hashtags2 = await getHashtags(summary2);

    console.log('Summaries and hashtags:', summary1, summary2, hashtags1, hashtags2);

    const finalSummary = `${summary1}\n\n${summary2}`;
    const finalHashtags = [...hashtags1, ...hashtags2];

    console.log('Final summary and hashtags:', finalSummary, finalHashtags);

    // Store in Firestore (optional for free tier)
    await addDoc(collection(db, 'blogPosts'), {
      userId,
      originalText: text,
      summary: finalSummary,
      hashtags: finalHashtags,
      createdAt: new Date(),
      tier: 'free',
    });

    console.log('Document added to Firestore');

    return res.status(200).json({ summary: finalSummary, hashtags: finalHashtags });
  } catch (error) {
    console.error('Summarize API Error:', error);
    return res.status(500).json({ error: 'Failed to process your blog post.' });
  }
}