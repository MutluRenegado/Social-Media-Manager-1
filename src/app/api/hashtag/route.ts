import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { db } from 'lib/firebase/firebase-config';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import admin from 'firebase-admin';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const FREE_TIER_MAX_REQUESTS = 2;
const FREE_TIER_MAX_HASHTAGS = 5;
const PAID_TIER_MAX_HASHTAGS = 30;

if (!admin.apps.length) {
  if (
    !process.env.FIREBASE_PROJECT_ID ||
    !process.env.FIREBASE_CLIENT_EMAIL ||
    !process.env.FIREBASE_PRIVATE_KEY
  ) {
    console.error('Missing Firebase Admin SDK environment variables');
    throw new Error('Missing Firebase Admin SDK environment variables');
  } else {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY
          ? process.env.FIREBASE_PRIVATE_KEY.replace(/^"(.*)"$/, '$1').replace(/\\n/g, '\n')
          : '',
        }),
      });
      console.log('Firebase Admin SDK initialized successfully');
    } catch (initError) {
      console.error('Firebase Admin SDK initialization error:', initError);
      throw initError;
    }
  }
}

import nodemailer from 'nodemailer';

function splitTextIntoParts(text: string, maxLength = 1000): string[] {
  const parts: string[] = [];
  let start = 0;
  while (start < text.length) {
    let end = start + maxLength;
    if (end > text.length) {
      end = text.length;
    } else {
      // Try to split at last space before maxLength
      const lastSpace = text.lastIndexOf(' ', end);
      if (lastSpace > start) {
        end = lastSpace;
      }
    }
    parts.push(text.slice(start, end).trim());
    start = end;
  }
  return parts;
}

async function saveTextPart(userEmail: string, partIndex: number, textPart: string) {
  const partDocRef = doc(db, 'users', userEmail, 'textParts', `part_${partIndex}`);
  await updateDoc(partDocRef, { text: textPart, createdAt: new Date().toISOString() }).catch(async () => {
    // If doc doesn't exist, create it
    await setDoc(partDocRef, { text: textPart, createdAt: new Date().toISOString() });
  });
}

async function generateHashtagsForText(text: string, maxHashtags: number): Promise<string[]> {
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
  return hashtagsRaw
    .split('\n')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
    .slice(0, maxHashtags);
}

async function saveHashtagsForPart(userEmail: string, partIndex: number, hashtags: string[]) {
  const hashtagsDocRef = doc(db, 'users', userEmail, 'textParts', `part_${partIndex}`);
  await updateDoc(hashtagsDocRef, { hashtags, updatedAt: new Date().toISOString() }).catch(async () => {
    await setDoc(hashtagsDocRef, { hashtags, updatedAt: new Date().toISOString() });
  });
}

function mergeHashtags(allHashtags: string[][]): string[] {
  const mergedSet = new Set<string>();
  allHashtags.forEach((hashtags) => {
    hashtags.forEach((tag) => mergedSet.add(tag));
  });
  return Array.from(mergedSet);
}

async function sendEmail(to: string, subject: string, body: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: body,
  });
}

export async function POST(request: NextRequest) {
  try {
    // Get the Firebase ID token from the Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
    }
    const idToken = authHeader.split('Bearer ')[1];

    // Verify the ID token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userEmail = decodedToken.email;

    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized: Email not found in token' }, { status: 401 });
    }

    const body = await request.json();
    const { text, tier } = body;

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }
    if (!tier) {
      return NextResponse.json({ error: 'User tier is required' }, { status: 400 });
    }

    // Check user request count for free tier
    if (tier === 'free') {
      const userDocRef = doc(db, 'users', userEmail);
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

    // Split text into parts
    const textParts = splitTextIntoParts(text);

    // Save text parts and generate hashtags for each part
    const allHashtags: string[][] = [];
    for (let i = 0; i < textParts.length; i++) {
      const part = textParts[i];
      await saveTextPart(userEmail, i, part);
      const hashtags = await generateHashtagsForText(part, maxHashtags);
      await saveHashtagsForPart(userEmail, i, hashtags);
      allHashtags.push(hashtags);
    }

    // Merge all hashtags
    const mergedHashtags = mergeHashtags(allHashtags);

    // Save merged hashtags to user doc
    const userDocRef = doc(db, 'users', userEmail);
    await updateDoc(userDocRef, { mergedHashtags, updatedAt: new Date().toISOString() }).catch(async () => {
      await setDoc(userDocRef, { mergedHashtags, updatedAt: new Date().toISOString() });
    });

    // Send email to user with merged hashtags
    const emailBody = `Here are your generated hashtags:\n\n${mergedHashtags.join('\n')}`;
    await sendEmail(userEmail, 'Your Generated Hashtags', emailBody);

    // Return merged hashtags to frontend
    return NextResponse.json({ hashtags: mergedHashtags });
  } catch (error: unknown) {
    console.error('Hashtag API error:', error);
    if (error instanceof Error) {
      console.error(error.stack);
    }
    // Additional detailed error logging for common failure points
    if (typeof error === 'object' && error !== null) {
      if ('code' in error) {
        // @ts-expect-error
        console.error('Error code:', error.code);
      }
      if ('response' in error) {
        // @ts-expect-error
        console.error('Error response:', error.response);
      }
    }
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to generate hashtags: ${errorMessage}` }, { status: 500 });
  }
}
