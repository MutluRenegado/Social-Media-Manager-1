import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    const chat = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use GPT-4 if your key allows it
      messages: [
        { role: 'user', content: 'Say hello from OpenAI' },
      ],
    });

    const response = chat.choices[0].message.content;

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error('❌ OpenAI Test Error:', error);
    return NextResponse.json({ error: 'OpenAI request failed', details: error.message }, { status: 500 });
  }
}
