# Minimal Node/Express backend for ChatGPT proxy

This small backend exposes POST /api/chat and proxies requests to the OpenAI Chat Completions API. It's intended to be used together with the static `index.html` in this workspace.

Security note: Keep your OpenAI API key secret and never expose it from browser code. Use this server as a secure proxy.

## Files added

- `server.js` - Express server that forwards `{ message }` to OpenAI and returns the raw OpenAI JSON.
- `package.json` - scripts and dependencies.
- `.env.example` - example environment variables.

## Quick start (Windows PowerShell)

1. Copy the example env file and add your OpenAI key:

```powershell
cp .env.example .env
notepad .env
# add your OPENAI_API_KEY value and save
```

2. Install dependencies:

```powershell
npm install
```

3. Run the server:

```powershell
npm start
```

4. By default the server listens on `http://localhost:3000`. The frontend `index.html` will POST to `/api/chat` (so if you open the HTML from file://, set the server URL to http://localhost:3000 in the fetch call or serve the static file with a local static server).

## Endpoint

POST /api/chat
- Request JSON: `{ "message": "Hello" }`
- Response: returns the OpenAI `chat.completions` response JSON. For a simple string reply, the frontend can read `choices[0].message.content` or the server will accept a custom `reply` field if you adapt it.

## Notes & next steps
- Consider adding authentication or rate-limiting if this is public-facing.
- Do not commit your real `.env` to git.
- If you'd like, I can adapt the server to return a simplified `{ reply: '...' }` object, add streaming, or provide a Dockerfile.
