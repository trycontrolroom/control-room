# Agent Extensions and Advanced Capabilities

This document outlines how the Create AI should handle extended functionality or advanced requests from users. Extensions may include third-party integrations, modular features, optional scheduling, or plugin-like functionality that enhances the agent's capabilities.

---

## 🧩 What Are Extensions?

Extensions are additional features, modules, or behaviors layered onto the base agent. They are usually requested after the core functionality is defined.

These may include:
- Integrations (e.g., Slack, Discord, Twilio, Airtable, Zapier, Notion, etc.)
- File I/O or external storage (Google Drive, AWS S3)
- Email or SMS notifications
- Conditional logic, filters, or branching
- Multi-step workflows
- Dynamic configuration via environment variables
- Retry logic, backoff systems, alerting

---

## 🧠 When to Offer Extensions

- When a user says “Can this also notify Slack?” or “Can it save the data somewhere?”
- After the base agent has been clarified
- If the AI detects a use case that would benefit from one (suggest proactively)

Example prompt:

```text
Would you like this agent to also:
• Send alerts to Slack or Discord?
• Save the output to a database or spreadsheet?
• Run on a schedule or only manually?

I can add these if needed!
```

---

## 🔌 Extension Implementation Strategy

Each extension should follow modular design principles:

- Place extension logic in a **separate function** within `agent.js`
- Ensure all added dependencies are included in `package.json`
- Include usage/setup instructions in the `README.md`
- Use placeholders for sensitive values (`process.env.DISCORD_WEBHOOK_URL`)
- Comment all advanced logic clearly
- Gate complex logic behind `if` statements or flags when needed

---

## 📦 Example Agent Files with Extensions

**agent.js**
```js
import { sendSlackAlert } from './lib/notify.js'

async function run() {
  const result = await doMainTask()
  if (process.env.SLACK_ALERTS === 'true') {
    await sendSlackAlert(result)
  }
}
```

**package.json**
```json
{
  "dependencies": {
    "axios": "^1.3.0"
  }
}
```

**config.json**
```json
{
  "alerts": true,
  "targets": ["slack"]
}
```

**README.md**
```md
### Slack Notifications
To enable Slack alerts:
1. Set `SLACK_ALERTS=true` in your `.env`
2. Add your webhook: `SLACK_WEBHOOK_URL=https://hooks.slack.com/...`
```

---

## 🛑 When NOT to Add Extensions

- If the user has a `VIEWER` role (read-only permission)
- If the request would cause security issues or requires elevated access
- If dependencies are not well-known or stable
- If it breaks the “single responsibility” of the agent

Respond with:
```text
That’s a great idea! However, this feature may require Admin or Manager access. Please check with your team or have someone with the right role enable this.
```

---

## ⚙️ Extension Revisions and Follow-ups

If the user says:

> “Can you also send SMS?”  
> “I want it to log errors to a file”  
> “Add Google Sheets export”

The Create AI should:
1. Confirm what service or method the user wants
2. Offer defaults if unclear
3. Add necessary code + README instructions
4. Return a new agent bundle with updated files

---

## 🔐 Safety and Best Practices

- Never hardcode keys or endpoints
- Keep optional logic **toggleable via env/config**
- Clearly comment all extension logic
- Validate all user inputs
- Use reputable libraries only

---

## ✅ Summary Rules

1. Extensions are optional and modular
2. Suggest helpful ones based on context
3. Gate behind roles or flags if needed
4. Include everything in the returned bundle:
   - Code
   - config.json
   - Instructions
5. Always confirm first, then implement cleanly