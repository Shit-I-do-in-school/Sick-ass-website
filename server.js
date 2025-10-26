const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_KEY = process.env.OPENAI_API_KEY;

// Mock responses: 45 pre-made answers you can use for local testing.
const mockResponses = [
  "Hi! I love talking about photography — what kind of photos do you like?",
  "Natural light can make portraits feel more alive. Try shooting near a window.",
  "Golden hour (shortly after sunrise or before sunset) is perfect for warm, soft light.",
  "For crisp landscapes, use a small aperture like f/8 to f/16.",
  "Try a low ISO and a tripod for long exposure shots at night.",
  "I recommend shooting in RAW if you plan to edit heavily later.",
  "Experiment with different angles — sometimes the best shot is from the ground.",
  "Rule of thirds is a great starting composition guideline, but break it when it helps.",
  "Use a reflector to fill shadows when shooting faces outdoors.",
  "If you want creamy background blur, use a wide aperture (small f-number).",
  "For action shots, prioritize shutter speed over aperture to freeze motion.",
  "Try backlighting to get a rim light effect — expose for the subject, not the sky.",
  "Use manual white balance when mixed lighting throws off your colors.",
  "A polarizing filter helps reduce reflections and deepen skies.",
  "Practice makes perfect — shoot every day, even quick studies on your phone.",
  "If you want to sell prints, consider offering square and landscape crops.",
  "Storytelling matters: think about the emotion you want the image to convey.",
  "Minimalist compositions often work well for galleries and social media.",
  "Try a 50mm prime lens for versatile portraits with pleasing perspective.",
  "Capture candid moments by blending into the scene and using a longer lens.",
  "For product photos, use soft, even lighting and a clean background.",
  "When editing, subtle adjustments usually read as more professional than heavy filters.",
  "Consider tethered shooting for studio sessions — it speeds feedback and selection.",
  "Local contrast and clarity can bring out texture in landscape photos.",
  "Bring spare batteries and memory cards on long shoots — they always help.",
  "Try shooting in burst mode for unpredictable movement and pick the best frame.",
  "Use leading lines to guide the viewer's eye through your composition.",
  "If you're starting out, focus on mastering exposure before advanced techniques.",
  "Learn basic color theory — complementary colors often create strong visuals.",
  "When photographing people, chat with them — relaxed subjects look better.",
  "Macro photography reveals textures you wouldn't notice at first glance.",
  "Try black & white conversions to emphasize shape and emotion.",
  "For architecture, correct perspective distortion in post if needed.",
  "Create a portfolio of 10–20 strong images rather than many average ones.",
  "Offer limited edition prints to create exclusivity for collectors.",
  "If you're unsure how to price work, research local photographers with similar style.",
  "Use social media to share behind-the-scenes content; clients love that.",
  "Back up your photos in at least two separate places (cloud + local).",
  "Don't be afraid to crop tightly to remove distractions and focus the subject.",
  "Try intentional camera movement for creative abstract effects.",
  "If you want, I can help suggest camera settings for a specific scene — tell me the camera and lighting.",
  "Want a random photography tip or a set of editing presets? I can provide more."
];

function chooseMockReply(message) {
  if (!message) return mockResponses[0];
  const m = message.toLowerCase();
  // Simple keyword-based routing for more relevant replies
  const pricingKeywords = ['price', 'cost', 'rate', 'charge', 'pricing'];
  const bookingKeywords = ['book', 'available', 'availability', 'schedule', 'date'];
  const lightingKeywords = ['light', 'lighting', 'golden', 'sunset', 'sunrise', 'flash'];
  const equipmentKeywords = ['lens', 'camera', 'tripod', 'filter', 'iso', 'aperture', 'shutter'];

  if (pricingKeywords.some(k => m.includes(k))) {
    const options = [
      "Pricing varies by session length and usage — tell me what you need and I can suggest a package.",
      "I offer portrait sessions, event coverage, and print packages. Which are you interested in?",
      "For most portraits, a basic session starts with a licence for personal use; commercial pricing is different."
    ];
    return options[Math.floor(Math.random() * options.length)];
  }

  if (bookingKeywords.some(k => m.includes(k))) {
    const options = [
      "I usually book 2–4 weeks in advance; let me know the date and I'll check availability.",
      "Send me the preferred date and type of session (portrait, event, product) and I'll confirm availability.",
      "I can hold a tentative slot for 48 hours if you need time to confirm."
    ];
    return options[Math.floor(Math.random() * options.length)];
  }

  if (lightingKeywords.some(k => m.includes(k))) {
    const options = [
      "Softer light is usually better for portraits — try shooting in shade or during golden hour.",
      "Use a diffuser for harsh midday sun or seek open shade for even light.",
      "If you're indoors, position subjects facing a large window for flattering natural light."
    ];
    return options[Math.floor(Math.random() * options.length)];
  }

  if (equipmentKeywords.some(k => m.includes(k))) {
    const options = [
      "A 50mm prime is a great all-around lens for portraits and low-light shooting.",
      "A sturdy tripod makes long exposures and landscapes much easier to nail.",
      "If you want background blur, use a lens with a wide maximum aperture (f/1.8, f/1.4)."
    ];
    return options[Math.floor(Math.random() * options.length)];
  }

  // Fallback: return a random helpful tip from the list
  return mockResponses[Math.floor(Math.random() * mockResponses.length)];
}

app.post('/api/chat', async (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: 'Missing "message" in request body' });

  // If mock mode enabled via env or query param, return a canned reply
  const mockEnabled = (process.env.USE_MOCK && process.env.USE_MOCK.toLowerCase() === 'true') || req.query.mock === '1';
  if (mockEnabled) {
    const reply = chooseMockReply(message);
    console.log('Mock reply chosen for message:', message, '=>', reply);
    return res.json({ reply });
  }

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
