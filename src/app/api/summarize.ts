"use strict";
//summarize
import OpenAI from 'openai';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'lib/firebase/firestore';  // Updated path
import { auth } from 'lib/firebase/auth';  // Updated path
import { firebaseConfig } from 'lib/firebase/firebase-config';  // Updated path

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'No text provided' });
        }

        // Step 1: Summarize the blog post
        const summaryRes = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: `Summarize the following blog post:\n\n${text}` }],
        });
        const summary = summaryRes.choices[0].message.content;

        // Step 2: Generate hashtags
        const hashtagRes = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: `Generate 30 relevant and popular hashtags for this blog summary:\n\n${summary}` }],
        });
        const hashtags = hashtagRes.choices[0].message.content;

        // Split the hashtags into an array and clean up
        const hashtagsArray = hashtags
            .split('\n')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        // Step 3: Store the blog post, summary, and hashtags in Firestore
        await addDoc(collection(db, 'blogPosts'), {
            text,
            summary,
            hashtags: hashtagsArray,
            createdAt: new Date(),
        });

        // Step 4: Return the summary and hashtags
        return res.status(200).json({ summary, hashtags: hashtagsArray });
    }
    catch (error) {
        console.error('API error:', error instanceof Error ? error.message : error);
        return res.status(500).json({ error: 'Failed to summarize or generate hashtags.' });
    }
}
