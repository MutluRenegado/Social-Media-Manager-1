import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
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

    // Generate 5 hashtags for the input text
    const hashtagRes = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Generate 5 relevant and popular hashtags for this blog post. List only the hashtags, one per line (no explanations or numbering):\n\n${text}`,
        },
      ],
    });
    const hashtagsRaw = hashtagRes.choices[0].message?.content ?? '';
    // Clean up output: remove empty lines and ensure each string starts with '#'
    const hashtags = hashtagsRaw
      .split('\n')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .map(tag => (tag.startsWith('#') ? tag : `#${tag.replace(/^#*/, '')}`)); // ensure # prefix

    // Return hashtags to frontend
    return NextResponse.json({ hashtags });
  } catch (error) {
    console.error('Hashtag API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to generate hashtags: ${errorMessage}` }, { status: 500 });
  }
}
