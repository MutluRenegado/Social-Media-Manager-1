import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { db } from 'lib/firebase/firebase-config';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const FREE_TIER_MAX_REQUESTS = 2;
const FREE_TIER_MAX_HASHTAGS = 5;
const PAID_TIER_MAX_HASHTAGS = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, email, tier } = body;

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }
    if (!email || !tier) {
      return NextResponse.json({ error: 'User email and tier are required' }, { status: 400 });
    }

    // Check user request count for free tier
    if (tier === 'free') {
      const userDocRef = doc(db, 'users', email);
      const userDocSnap = await getDoc(userDocRef);
      let requestCount = 0;
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        requestCount = userData.hashtagRequestCount || 0;
      }
      if (requestCount >= FREE_TIER_MAX_REQUESTS) {
        return NextResponse.json({ error: 'Free tier request limit reached. Please upgrade to a paid plan.' }, { status: 403 });
      }
      // Increment request count
      await updateDoc(userDocRef, {
        hashtagRequestCount: increment(1),
      });
    }

    // Determine number of hashtags to generate based on tier
    const maxHashtags = tier === 'free' ? FREE_TIER_MAX_HASHTAGS : PAID_TIER_MAX_HASHTAGS;

    // Generate hashtags for the input text
    const hashtagRes = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Generate ${maxHashtags} relevant and popular hashtags for this blog post:\n\n${text}`,
        },
      ],
    });
    const hashtagsRaw = hashtagRes.choices[0].message?.content ?? '';
    const hashtags = hashtagsRaw
      .split('\n')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
      .slice(0, maxHashtags);

    // Return hashtags to frontend
    return NextResponse.json({ hashtags });
  } catch (error) {
    console.error('Hashtag API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to generate hashtags: ${errorMessage}` }, { status: 500 });
  }
}
