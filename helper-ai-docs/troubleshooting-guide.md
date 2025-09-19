# 🛠️ Control Room – Troubleshooting Guide

This document provides the Helper AI with structured responses for common user issues in Control Room. It outlines how to identify problems, walk users through solutions, and when to redirect them to support.

---

## 🔍 1. General Troubleshooting Workflow

When a user mentions something isn't working, follow this sequence:

1. **Ask for specifics**:
   - What were they trying to do?
   - What page/section were they in?
   - Any error messages or odd behavior?
2. **Check role permissions**:
   - Are they a Viewer, Manager, or Admin?
   - Some features are restricted by RBAC.
3. **Guide through the steps**:
   - Explain the correct workflow and UI path.
4. **Offer reset/refresh**:
   - Suggest logging out and back in, refreshing, or trying in another browser if applicable.
5. **Escalate**:
   - If the issue persists or is unknown, link to the Contact page.

---

## ⚙️ 2. Common Issues & Resolutions

### ✅ Issue: “I don’t see the Create Agent button.”
- **Likely Cause**: Viewer role
- **Response**:
  > “Only Managers or Admins can create agents. If you’re a Viewer, you’ll need to ask your Admin to grant access or assist you.”

---

### ✅ Issue: “I created a workspace but don’t see the dashboard.”
- **Likely Cause**: Dashboard did not refresh
- **Response**:
  > “Try refreshing your browser or navigating back to the main dashboard tab. If that doesn't work, log out and back in.”

---

### ✅ Issue: “My policy isn’t working or triggering.”
- **Ask**:
  - What is the trigger logic?
  - Is the agent it connects to deployed?
- **Response**:
  > “Let’s check the following:
  > - Is the policy marked as active?
  > - Does the agent it’s attached to have the correct input triggers?
  > - Are any custom metrics involved receiving updates?
  > If everything seems correct, try toggling the policy off and back on.”

---

### ✅ Issue: “I’m not receiving notifications.”
- **Possible Causes**:
  - Notification provider not configured (e.g., Courier)
  - Workspace-level notifications disabled
- **Response**:
  > “Let’s make sure your notification provider is configured in the workspace settings. If it’s already connected, try reauthenticating and checking your notification rules.”

---

### ✅ Issue: “I can’t deploy an agent.”
- **Likely Cause**: Role restriction or missing API keys
- **Response**:
  > “Only Admins and Managers can deploy agents. Also, make sure any required environment variables or API keys are configured in the agent’s config file.”

---

### ✅ Issue: “My task isn’t executing.”
- **Ask**:
  - What’s the agent or policy it’s linked to?
  - What’s the trigger method?
- **Response**:
  > “Make sure the task is:
  > - Enabled in the Manage tab
  > - Connected to an active policy or agent
  > - Has a valid trigger like a time schedule or metric change
  > If all looks correct, try editing and resaving the task to refresh it.”

---

### ✅ Issue: “I’m stuck on the loading screen.”
- **Likely Cause**: Network or cache issue
- **Response**:
  > “Try refreshing, clearing cache, or using a private/incognito window. If that fails, try from a different browser.”

---

## 🚫 3. When AI Can’t Help

If Helper AI cannot determine the cause:

> “Hmm, I’m not 100% sure what’s causing this. I recommend reaching out to our support team here so they can take a closer look: [Contact Page Link]”

---

## 🔐 4. Role-Specific Troubleshooting

### Viewer
- Can’t edit, deploy, or delete
- Must be reminded of limited access

### Manager
- Can do almost everything except workspace/user management and billing

### Admin
- Has full access; if issues arise, it’s likely a system bug or misconfiguration

---

## 🧠 5. Tips for Improving UX

- Always explain what *should* happen
- Offer “try this” steps even when unsure
- Never leave the user hanging — always offer a clear next step (retry, refresh, or contact support)