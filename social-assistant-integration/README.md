# Social Media Visual Assistant — Wiring Kit

This bundle gives you a **drop-in integration** for Firebase (Auth+Firestore), an **AI drafting endpoint**,
and **schedule storage** for a Next.js App Router project. Adjust file paths if your repo layout differs.

## 1) Install deps

```bash
npm i firebase firebase-admin openai zod
```

If you plan to use Firebase Cloud Functions, also set up the Firebase CLI and initialize functions in your project root:
```bash
npm i -g firebase-tools
firebase login
firebase init functions
```

## 2) Environment variables
Copy `.env.example` to `.env.local` and fill values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Server-side
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
OPENAI_API_KEY=
```

> For the private key, keep the literal `\n` newlines if using env files.

## 3) Add files to your repo

- `src/lib/firebase.ts` — client+admin setup
- `src/app/api/ai/draft/route.ts` — AI drafting endpoint (server only)
- `src/app/api/schedule/route.ts` — create/read scheduled posts in Firestore
- `src/app/api/publish/meta/route.ts` — placeholder for Meta (Facebook/Instagram) publishing
- `firestore.rules` — basic locked-down rules
- `components/SocialMediaAssistant.tsx` — the UI component (optional, if you don’t already have it)

## 4) Firestore structure
```
/users/{uid}
/posts/{postId} {
  authorUid, text, hashtags[], link, media[], createdAt, updatedAt, status
}
/schedules/{scheduleId} {
  postId, platforms[], runAt, timezone, status
}
```

## 5) Secure keys (Vercel/Netlify/etc.)
Add all keys to your hosting provider as **encrypted env vars**. Never commit `.env.local`.

## 6) Test locally
```bash
npm run dev
# Draft:    POST /api/ai/draft
# Schedule: POST /api/schedule
# Publish:  POST /api/publish/meta  (stub)
```

## 7) Optional: Firebase Cloud Functions
If you want to offload AI calls or scheduling to cron jobs, deploy `functions/` and set a scheduled function
to scan upcoming `/schedules` and publish via the social APIs.
