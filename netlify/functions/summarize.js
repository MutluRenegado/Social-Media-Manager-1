const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { text } = JSON.parse(event.body);
    if (!text) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No text provided' }),
      };
    }

    const summaryRes = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: `Summarize the following blog post:\n\n${text}` }],
    });

    const summary = summaryRes.choices[0].message.content;

    const hashtagRes = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: `Generate 30 relevant and popular hashtags for this blog summary:\n\n${summary}` }],
    });

    const hashtags = hashtagRes.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ summary, hashtags }),
    };
  } catch (error) {
    console.error('API error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to summarize or generate hashtags.' }),
    };
  }
};
