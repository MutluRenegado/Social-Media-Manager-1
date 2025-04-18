//generate-background
const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
// Function to process the entire text (summarize & generate hashtags)
async function processText(text) {
    try {
        // Summarize the blog post
        const summaryRes = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: `Summarize the following text:\n\n${text}` }],
        });
        const summary = summaryRes.choices[0].message.content;
        // Generate hashtags for the summary
        const hashtagRes = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: `Generate relevant hashtags for this summary:\n\n${summary}` }],
        });
        const hashtags = hashtagRes.choices[0].message.content;
        return { summary, hashtags };
    }
    catch (error) {
        console.error('Error processing text:', error.message);
        throw new Error('Failed to process text.');
    }
}
exports.handler = async function (event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }
    try {
        const { text } = JSON.parse(event.body);
        if (!text || typeof text !== 'string' || text.trim() === '') {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid input: Text is required.' }),
            };
        }
        console.log("Starting summarization...");
        // Process the entire text
        const { summary, hashtags } = await processText(text);
        console.log("Summarization complete.");
        return {
            statusCode: 200,
            body: JSON.stringify({ summary, hashtags }),
        };
    }
    catch (error) {
        console.error('API error:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to summarize or generate hashtags.' }),
        };
    }
};
// 🟡 This line tells Netlify to treat it as a background function
exports.config = {
    type: "background"
};
