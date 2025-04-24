import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { adminDb } from 'lib/firebase-admin';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function splitTextIntoParts(text: string, maxLength: number): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+[\])'"`’”]*|.+$/g) || [];
  const parts: string[] = [];
  let currentPart = '';

  for (const sentence of sentences) {
    if ((currentPart + sentence).length > maxLength) {
      if (currentPart) {
        parts.push(currentPart.trim());
        currentPart = sentence;
      } else {
        parts.push(sentence.trim());
        currentPart = '';
      }
    } else {
      currentPart += sentence;
    }
  }
  if (currentPart) parts.push(currentPart.trim());
  return parts;
}

export async function POST(request: NextRequest) {
  try {
    const { text, email, tier } = await request.json();

    if (!text || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const parts = splitTextIntoParts(text, 3000);
    const summaries: string[] = [];

    for (const part of parts) {
      const summaryRes = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: `Summarize this:\n\n${part}` }],
      });
      summaries.push(summaryRes.choices[0].message?.content?.trim() ?? '');
    }

    const mergedSummary = summaries.join('\n\n');

    await adminDb.collection('summaries').add({
      text,
      summary: mergedSummary,
      tier: tier || 'free',
      email,
      createdAt: new Date(),
    });

    return NextResponse.json({ summary: mergedSummary });
  } catch (error) {
    console.error('Summarize error:', error);
    return NextResponse.json({ error: 'Failed to summarize.' }, { status: 500 });
  }
}
