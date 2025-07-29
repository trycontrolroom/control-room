# Agent Deployment and Finalization Guidelines

Once an agent has been successfully generated and validated, the Create AI must assist the user in **previewing, editing, and deploying the agent** to their Control Room workspace.

---

## 🎯 Deployment Options Overview

After generation, the user should be presented with:

- 🔍 **Preview** of all files (read-only)
- 💾 **Download** of the full agent package
- 🧠 **Edit Agent** (via in-app code editor)
- 🚀 **Deploy to Workspace** (adds to dashboard and enables testing)

---

## 🔐 RBAC Enforcement

Only users with the following roles may finalize or deploy an agent:

| Role     | Deployment Permission |
|----------|------------------------|
| ADMIN    | ✅ Allowed             |
| MANAGER  | ✅ Allowed             |
| VIEWER   | ❌ Not allowed         |

If a viewer tries to deploy:
```text
You can preview and download this agent, but only Admins or Managers can deploy it to your workspace. Please contact your workspace lead.
```

---

## 🛠️ Deployment Workflow

Upon user confirmation to deploy:

1. **Send agent files** to backend API endpoint (`/api/agents/deploy`)
2. **Save agent metadata** (name, config, createdAt, workspaceId)
3. **Store file contents** in persistent storage (e.g., DB or S3)
4. **Make it appear** in the agent dashboard of that workspace

The AI should then say:
```text
🎉 Your agent has been successfully deployed! It’s now available in your dashboard under “Agents.” You can test, schedule, or monitor it from there.
```

---

## 🧠 Post-Deployment Behavior

Once deployed:

- AI should **update the config** with the actual agent ID
- The agent should now be:
  - Viewable in all areas (elements and tabs) where agents should be displayed
  - Editable through the in-app editor
  - Runnable or schedulable if triggers are defined

---

## 📝 Editable Before Finalization

Users must always be given the option to **edit files before deployment** via the agent editor interface. Edits should support:

- `agent.js`, `config.json`, `package.json`, `README.md`
- File add/remove support (optional, not required at MVP)

AI should prompt:
```text
Would you like to deploy this agent as-is, or open it in the code editor to make some final tweaks?
```

---

## 🧩 Storage Format Expectations

Each deployed agent should include:

```json
{
  "agentId": "uuid-v4",
  "name": "Generated Agent",
  "description": "Brief purpose",
  "workspaceId": "ws-123",
  "files": {
    "agent.js": "...",
    "package.json": "...",
    "config.json": "...",
    "README.md": "..."
  },
  "triggers": ["manual", "webhook"],
  "apiKeys": ["OPENAI_API_KEY"],
  "createdAt": "timestamp"
}
```

---

## 🔁 Redepoyment or Updates

If a user makes changes to an existing deployed agent:

- AI should detect it’s a modification
- Ask whether to overwrite or save as a new version
- Keep a change log (optional)

---

## 🔚 Summary

- ✅ Only Admins and Managers can deploy agents
- ✅ Always offer preview, download, edit, and deploy options
- ✅ Deployment sends agent data to backend and assigns agent ID
- ✅ Workspace dashboard must reflect deployed agent
- ✅ AI updates config and confirms deployment success
