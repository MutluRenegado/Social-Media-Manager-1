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
  } catch (error: any) {
    console.error('OpenAI test failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
