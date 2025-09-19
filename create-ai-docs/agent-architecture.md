This document outlines how every AI agent generated in Control Room should be structured, including required files, coding standards, common components, and best practices. This ensures a consistent developer experience and reliable production performance.

---

## ✨ Purpose

Control Room agents are autonomous programs designed to perform tasks like automation, data handling, integration, and decision-making. These agents can be deployed on schedules or triggered by specific events.

---

## 📁 Required Files

Each generated agent must include the following:

### 1. `agent.js`

* Main file containing the agent logic
* Must include:

  * Top-level async function (e.g. `main()`)
  * `try/catch` blocks for all major logic
  * Logging for each key step
  * Proper use of `await` for async calls
  * API calls using `fetch` or `axios`
  * Use of environment variables via `process.env`
  * Config loading from `config.json`

### 2. `package.json`

* Defines the dependencies and entry point
* Must include:

  * Accurate `name`, `version`, and `main`
  * Dependencies (e.g. `axios`, `dotenv` if needed)

```json
{
  "name": "control-room-agent",
  "version": "1.0.0",
  "main": "agent.js",
  "scripts": {
    "start": "node agent.js"
  },
  "dependencies": {
    "axios": "^1.3.0"
  }
}
```

### 3. `config.json`

* User-editable config file for:

  * Schedule (cron syntax)
  * Triggers (event types)
  * API keys and parameters

Example:

```json
{
  "schedule": "0 * * * *",
  "triggers": ["onNewOrder"],
  "apiKeys": ["MY_API_KEY"],
  "params": {
    "endpoint": "https://api.example.com/data"
  }
}
```

### 4. `README.md`

* Contains:

  * Summary of what the agent does
  * Setup and usage steps
  * Example config
  * Notes on customization

---

## ✅ Best Practices & Standards

* **Async/Await**: Never mix callbacks and promises
* **Readable Code**: Clean indentation, naming, and comments
* **Error Handling**: Handle all major failure points
* **Environment Safety**: Never hardcode secrets or credentials
* **Fail-Safes**: Add fallback responses if APIs fail

---

## ⚡ Common Components

The following components are often reused:

### Logging

```js
console.log("[Step 1] Fetching data from API...")
```

### Error Wrapper

```js
try {
  const res = await axios.get(url)
} catch (err) {
  console.error("API fetch failed:", err.message)
}
```

### Config Loader

```js
import fs from 'fs'
const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"))
```

---

## 🤝 Optional Files (Advanced Agents)

* `utils.js`: Shared helper functions
* `constants.js`: Constants and mappings
* `types.d.ts`: Type definitions if using TypeScript
* `cron.log`: Optional output logs

---

## 🤖 Agent Capabilities

Agents can be designed to:

* Run on schedules (e.g. every hour)
* React to triggers (e.g. new user, webhook)
* Call external APIs or services
* Scrape or fetch data
* Perform calculations and summaries
* Send notifications, alerts, emails

---

## ⚖️ Example Use Cases

* Twitter bot that summarizes daily headlines
* Shopify webhook listener that logs orders to Notion
* Scheduled script that monitors prices and sends alerts
* Lead enrichment agent that uses Clearbit API

---

## 💡 AI Guidance

When generating agents:

* Start with a clear comment header summarizing the agent’s function
* Generate full working versions of all 4 required files
* If API keys are needed, insert placeholders in `config.json`
* If the user doesn’t have an API key, offer a dummy/test mode
* Format all code clearly
* Do not assume external hosting unless specified
* Ask for clarification if purpose or logic is vague

---

## ❓ FAQs for AI

* **Q:** What if a user provides minimal details?

  * **A:** Ask clarifying questions before generating code.

* **Q:** Can I generate TypeScript?

  * **A:** Default to JavaScript unless user requests TypeScript.

* **Q:** Should agents store state?

  * **A:** Avoid state unless specified. Keep them stateless and functional.

---

This doc is meant to be referenced by the AI when creating, debugging, or editing any agent in the platform. Always follow this structure unless specifically asked otherwise.
