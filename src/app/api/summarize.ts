// src/pages/api/summarize.ts
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }

    // Example logic for generating summary and hashtags (replace with your own logic)
    const summary = text.slice(0, 100); // Just a simple slice for demo purposes
    const hashtags = `#${text.split(' ')[0]} #${text.split(' ')[1]}`; // Simple hashtag generation

    return res.status(200).json({ summary, hashtags });
  }

  res.status(405).json({ error: 'Method Not Allowed' });
}

