import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/src/lib/firebase";
import { z } from "zod";

const Body = z.object({
  post: z.object({
    text: z.string(),
    hashtags: z.array(z.string()).default([]),
    link: z.string().optional(),
    media: z.array(z.object({ name: z.string(), url: z.string().optional() })).default([]),
  }),
  platforms: z.array(z.string()).min(1),
  runAtISO: z.string(), // e.g., '2025-08-21T18:30:00.000Z'
  timezone: z.string().default("Europe/London"),
});

export async function POST(req: NextRequest) {
  try {
    const body = Body.parse(await req.json());
    const ref = await adminDb.collection("schedules").add({
      ...body,
      status: "queued",
      createdAt: new Date(),
    });
    return NextResponse.json({ ok: true, id: ref.id });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  const snap = await adminDb.collection("schedules").orderBy("runAtISO", "asc").limit(20).get();
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return NextResponse.json({ ok: true, items });
}
