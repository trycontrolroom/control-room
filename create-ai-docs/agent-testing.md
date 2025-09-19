# Agent Testing and Validation Guidelines

After deployment, users must be able to test their agents to ensure they work as expected. This document outlines how the Create AI should guide testing, what options are available, and how to respond to errors or test results.

---

## 🧪 Types of Testing

Create AI should support and guide the following test modes:

### 1. **Manual Trigger Test**
- User clicks a “Run Test” button
- Agent runs using default or mock input
- Output is shown in a test log or response console

### 2. **Webhook Test (if applicable)**
- AI provides a test URL (e.g., `/api/agents/:id/webhook/test`)
- User can send a sample payload to validate input/output handling

### 3. **Scheduled Test**
- If agent uses a cron schedule, simulate a scheduled run on demand

---

## 🧠 AI Responsibilities

After deployment, the Create AI should say:

```text
Would you like to test this agent now? You can:
✅ Run a manual test
📨 Send a webhook event
⏰ Simulate a scheduled run

Let me know what you'd like to do!
```

If user chooses to test:

- Call the appropriate backend test route
- Display test logs, errors, or output
- Offer follow-up debugging if test fails

---

## 🛠️ Error Feedback

If the test fails or logs errors:

- Capture error stack or return message
- Provide a human-readable interpretation
- Suggest likely causes
- Offer to regenerate or edit the broken file(s)

### Example:
```text
❌ Test failed: "Cannot read properties of undefined (reading 'status')"

This may mean your API response isn’t being parsed correctly.
Would you like me to review the agent.js file and fix it?
```

---

## 🧪 Test Result Format

Test responses should be shown as:

```json
{
  "status": "success",
  "output": "Sample output or console logs",
  "timestamp": "2025-07-27T12:34:56Z"
}
```

Or in case of failure:

```json
{
  "status": "error",
  "message": "TypeError: Cannot read properties of undefined",
  "trace": "...stack trace here..."
}
```

---

## 📋 Testing Rules

- All deployed agents must be testable
- RBAC enforced: Viewers cannot trigger tests
- AI must never auto-deploy based on test results — user must approve
- Logs must be persisted for agent history (if possible)

---

## 🧩 Extra Considerations

- Offer default input payloads if user hasn’t defined any
- Allow retrying the same test with new input
- Tests must timeout gracefully and log failures

---

## ✅ Summary

- Users can test agents via manual, webhook, or scheduled simulations
- AI assists in interpreting results and debugging failures
- All logic must be safe, user-initiated, and RBAC-aware
- Agent test logs should be accessible and clearly formatted