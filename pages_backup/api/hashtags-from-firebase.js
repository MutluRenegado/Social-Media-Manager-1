import OpenAI from 'openai';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import nodemailer from 'nodemailer';  // or any email lib you want
import { firebaseConfig } from 'lib/firebase/firebase-config';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Set up your email transporter (example with Gmail SMTP, replace with your config)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,     // your email
    pass: process.env.EMAIL_PASSWORD, // your email password or app password
  },
});

async function generateHashtags(text) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: `Generate 5 relevant and popular hashtags for this text:\n\n${text}` }],
  });

  const hashtags = response.choices[0].message.content;
  return hashtags
    .split('\n')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
    .slice(0, 5);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userEmail } = req.body;
  if (!userEmail) {
    return res.status(400).json({ error: 'User email is required' });
  }

  try {
    // Query the two most recent parts from your 'texts' collection
    const q = query(collection(db, 'texts'), orderBy('createdAt', 'desc'), limit(2));
    const querySnapshot = await getDocs(q);
    const docs = [];
    querySnapshot.forEach(doc => docs.push(doc.data()));

    if (docs.length < 2) {
      return res.status(400).json({ error: 'Not enough text parts found in Firebase' });
    }

    // The docs array is in descending order, reverse to get original order
    docs.reverse();
    const part1 = docs[0].content;
    const part2 = docs[1].content;

    // Generate hashtags for each part
    const hashtags1 = await generateHashtags(part1);
    const hashtags2 = await generateHashtags(part2);

    // Merge hashtags (unique)
    const mergedHashtags = Array.from(new Set([...hashtags1, ...hashtags2]));

    // Prepare email content
    const emailContent = `
      Here is the combined text and hashtags you requested:

      Part 1:
      ${part1}

      Hashtags:
      ${hashtags1.join(' ')}

      Part 2:
      ${part2}

      Hashtags:
      ${hashtags2.join(' ')}

      Merged Hashtags:
      ${mergedHashtags.join(' ')}
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Your Text Hashtags",
      text: emailContent,
    });

    // Return merged hashtags in response
    res.status(200).json({ hashtags: mergedHashtags });
  } catch (error) {
    console.error('Error in hashtag generation/email:', error);
    res.status(500).json({ error: 'Failed to generate hashtags and send email.' });
  }
}
