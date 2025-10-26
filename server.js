const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_KEY = process.env.OPENAI_API_KEY;

app.post('/api/chat', async (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: 'Missing "message" in request body' });

  if (!OPENAI_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured on server. Set OPENAI_API_KEY in env.' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [ { role: 'user', content: message } ],
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    // Return the entire OpenAI response so client can handle shapes it expects.
    return res.json(response.data);
  } catch (err) {
    console.error('OpenAI request failed:', err.response?.data || err.message);
    const status = err.response?.status || 500;
    return res.status(status).json({ error: 'OpenAI request failed', detail: err.response?.data || err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
