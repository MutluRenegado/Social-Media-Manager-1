import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

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

    const summaryRes = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: `Summarize the following blog post:\n\n${text}` },
      ],
    });

    const summary = summaryRes.choices[0].message.content;

    const hashtagRes = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: `Generate 30 relevant and popular hashtags for this blog summary:\n\n${summary}` },
      ],
    });

    const hashtags = hashtagRes.choices[0].message.content;

    return res.status(200).json({ summary, hashtags });
  } catch (error: any) {
    console.error('API error:', error.message);
    return res.status(500).json({ error: 'Failed to summarize or generate hashtags.' });
  }
}

