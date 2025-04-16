const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to split the text into two parts
function splitText(text) {
  const middleIndex = Math.floor(text.length / 2);
  const part1 = text.slice(0, middleIndex);
  const part2 = text.slice(middleIndex);
  return [part1, part2];
}


// Function to process each part of the text (summarize & generate hashtags)
async function processTextPart(part) {
  const summaryRes = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: Summarize the following text:\n\n${part} }],
  });


  const summary = summaryRes.choices[0].message.content;


  const hashtagRes = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: Generate relevant hashtags for this summary:\n\n${summary} }],
  });


  const hashtags = hashtagRes.choices[0].message.content;


  return { summary, hashtags };
}


exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }


  try {
    // Here you would parse the request body to get the text
    const { text } = JSON.parse(event.body);


// Split the text into two parts
const [part1, part2] = splitText(text);

// Process both parts concurrently
const [resultPart1, resultPart2] = await Promise.all([
  processTextPart(part1),
  processTextPart(part2),
]);

// Combine the summaries and hashtags from both parts
const summary = resultPart1.summary + &quot;\n&quot; + resultPart2.summary;
const hashtags = resultPart1.hashtags + &quot;\n&quot; + resultPart2.hashtags;

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
