import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { firebaseConfig } from 'lib/firebase/firebase-config';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;
    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const summaryRes = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: `Summarize the following blog post:\n\n${text}` }],
    });

    const summary = summaryRes.choices[0].message?.content ?? '';

    // Optional: Save to Firestore
    await addDoc(collection(db, 'blogSummaries'), {
      text,
      summary,
      createdAt: new Date(),
    });

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Summarize API error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Failed to summarize text.' }, { status: 500 });
  }
}
