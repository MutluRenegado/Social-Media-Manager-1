import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import OpenAI from 'openai';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Firebase Admin only once
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
      .map((tag) => (tag.startsWith('#') ? tag : `#${tag.replace(/^#*/, '')}`)); // Guarantee hashtags

    await db.collection('blogHashtags').add({
      text,
      hashtags: hashtagsArray,
      createdAt: new Date(),
    });

    return NextResponse.json({ hashtags: hashtagsArray });
  } catch (error) {
    console.error('Hashtag API error:', error);
    return NextResponse.json({ error: 'Failed to generate hashtags.' }, { status: 500 });
  }
}
