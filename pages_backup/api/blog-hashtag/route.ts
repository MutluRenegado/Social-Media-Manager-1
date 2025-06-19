import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'lib/firebase/firestore';
import { firebaseConfig } from 'lib/firebase/firebase-config';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Next.js App Router API route handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;
    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const hashtagRes = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Generate 30 relevant and popular hashtags for this text. List only the hashtags, one per line:\n\n${text}`,
        },
      ],
    });

    const hashtagsRaw = hashtagRes.choices[0].message?.content ?? '';
    const hashtagsArray = hashtagsRaw
      .split('\n')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
      .map((tag) => (tag.startsWith('#') ? tag : `#${tag.replace(/^#*/, '')}`));

    // Optional: Save to Firestore
    await addDoc(collection(db, 'blogHashtags'), {
      text,
      hashtags: hashtagsArray,
      createdAt: new Date(),
    });

    return NextResponse.json({ hashtags: hashtagsArray });
  } catch (error) {
    console.error('Hashtag API error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Failed to generate hashtags.' }, { status: 500 });
  }
}
