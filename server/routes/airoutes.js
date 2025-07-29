const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/suggest', async (req, res) => {
  console.log("Request Body:", req.body); // Debug log
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
    });

    const response = completion.choices[0]?.message?.content || '';
    res.json({ response });
  } catch (err) {
    console.error('OpenAI error:', err);
    res.status(500).json({ error: err.message || 'AI request failed' });
  }
});

module.exports = router;
