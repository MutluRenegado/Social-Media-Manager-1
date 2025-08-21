import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

const Body = z.object({
  text: z.string().default(""),
  tone: z.enum(["Friendly", "Bold", "Formal"]).default("Friendly"),
  brevity: z.number().min(20).max(100).default(50),
});

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("Missing OPENAI_API_KEY");
    const body = Body.parse(await req.json());
    const openai = new OpenAI({ apiKey });

    // Simple prompt; replace with your tuned system prompts
    const prompt = `Rewrite the following social post in a ${body.tone} tone. Target brevity level = ${body.brevity}/100. Keep URLs and hashtags intact.\n\nTEXT:\n${body.text}`;

    const chat = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a concise social media copywriter." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const drafted = chat.choices[0]?.message?.content?.trim() || body.text;
    return NextResponse.json({ ok: true, drafted });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
