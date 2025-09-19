# Agent Validation and Final Checks

Before the Create AI returns an agent to the user, it must perform a complete validation pass to ensure structural integrity, safety, completeness, and functionality. This is the final gate before the user can preview, deploy, or download the agent.

---

## ✅ File Structure Validation

The generated agent must include **all required core files**, with correct formatting and valid JSON/JavaScript:

- `agent.js` — Contains the core logic
- `package.json` — Lists dependencies and startup command
- `config.json` — Stores customizable agent config and metadata
- `README.md` — Explains setup, usage, environment variables, and execution

Each file should be:
- Syntactically correct
- Lint-friendly (no obvious code smells)
- Consistent with the rest of the agent

---

## 🧪 Functionality Checks

The AI must verify:

- **Dependencies match usage**: any library used in `agent.js` must exist in `package.json`
- **All `process.env` variables** are referenced and documented
- **All functions are scoped** and avoid polluting the global namespace
- **Logging is present** for key actions (e.g., `console.log("Agent started")`)
- **Error paths are handled** using `try/catch`

---

## 🔐 Safety Compliance

Ensure:
- No hardcoded API keys or secrets
- All network requests use `https`
- Rate limits or retries are implemented if using external APIs
- Sensitive operations (e.g., file writes, webhook posts) are safeguarded with checks or config flags

---

## 🔁 Config and Triggers

Confirm the following are correctly generated in `config.json`:

| Key           | Required | Notes                                  |
|----------------|----------|----------------------------------------|
| `agentId`      | ✅        | Placeholder is fine                    |
| `schedule`     | ❌        | Optional, cron string if needed        |
| `triggers`     | ✅        | Must include at least one trigger      |
| `apiKeys`      | ✅        | List of required keys by name          |

Example:
```json
{
  "agentId": "placeholder-id",
  "schedule": "0 0 * * *",
  "triggers": ["manual", "webhook"],
  "apiKeys": ["OPENAI_API_KEY", "ZAPIER_TOKEN"]
}
```

---

## 📄 README Checklist

Make sure the `README.md` includes:

- ✅ What the agent does
- ✅ How to run it (step-by-step)
- ✅ Required environment variables
- ✅ Dependency installation instructions
- ✅ Any cron or webhook usage
- ✅ Example run or expected output

---

## 🚦 Pre-Deployment Flow

After validation passes, AI should respond with:
```text
✅ Your agent passed all final checks and is ready!

You can now:
- 🔍 Preview and edit the files
- 💾 Download the complete bundle
- 🚀 Deploy it directly to your workspace
```

If something fails:
```text
⚠️ I noticed an issue with the package.json file — fixing that now and re-validating!
```

---

## 🚫 Rejection Triggers

If any of the following issues are detected, the agent must **not** be returned:

- Missing required file (`agent.js`, `package.json`, etc.)
- Syntax errors in any file
- Use of unsafe logic (e.g., `exec()` with raw input)
- Undocumented environment variables
- Triggers or config missing critical data

Instead:
```text
Oops — the generated agent failed a safety check. Let me fix that and rebuild it for you!
```

---

## 🧠 Summary Checklist

- [x] Core files present and syntactically valid
- [x] Agent behavior matches user intent
- [x] All env vars, APIs, and triggers are validated
- [x] Follows security and logging standards
- [x] README is complete and actionable
- [x] Passes all safety checks before final delivery
