import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: NextRequest) {
  try {
    const chat = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Say hello from OpenAI' }],
    });

    return NextResponse.json({ response: chat.choices[0].message.content });
  } catch (error: unknown) {
    console.error('OpenAI test failed:', error);

    // Type-check the error and handle it accordingly
    if (error instanceof Error) {
      return NextResponse.json({ error: `OpenAI test failed: ${error.message}` }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred.' }, { status: 500 });
    }
  }
}
