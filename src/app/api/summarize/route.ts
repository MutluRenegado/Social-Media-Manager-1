import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    // Generate summary
    const summaryRes = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: `Summarize the following blog post:\n\n${text}` },
      ],
    });

    const summary = summaryRes.choices[0].message.content;

    // Generate hashtags
    const hashtagRes = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: `Generate 30 relevant and popular hashtags for this blog summary:\n\n${summary}` },
      ],
    });

    const hashtags = hashtagRes.choices[0].message.content;

    return NextResponse.json({ summary, hashtags });
  } catch (error: unknown) {
    console.error('API error:', error);

    // Type-check the error and handle it accordingly
    if (error instanceof Error) {
      return NextResponse.json({ error: `Failed to summarize or generate hashtags. Error: ${error.message}` }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Failed to summarize or generate hashtags.' }, { status: 500 });
    }
  }
}
