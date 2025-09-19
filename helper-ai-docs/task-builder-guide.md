# ✅ Control Room – Task Builder Guide

This document equips the Helper AI to support users in creating, managing, and debugging Tasks — automated, rule-based operations inside Control Room.

---

## ⚙️ 1. What Are Tasks?

Tasks are small, automatable units of logic designed to:
- Run on a schedule or trigger
- Process data
- Call APIs or services
- Alert, update, or log information

They can run independently or alongside agents and policies.

---

## 🧩 2. Task Anatomy

Each task consists of:
- **Name** – User-defined label
- **Trigger** – Schedule, webhook, manual, or event-based
- **Conditions** – Optional rules to filter when the task runs
- **Action Block(s)** – Steps to perform (API call, webhook, log, notify)
- **Output** – Logs, metrics, updates, or feedback to the system

---

## 🏗️ 3. Creating a Task

1. Go to **Manage tab → Tasks**
2. Click **“Create New Task”**
3. Define:
   - Name & Description
   - Trigger Type (e.g. every 5 minutes)
   - Conditions (optional logic gates like “if error_rate > 5%”)
   - One or more Actions:
     - HTTP request
     - Send alert
     - Call agent
     - Log data
     - Trigger another task
4. Preview & Save

---

## 🧠 4. Helper AI Responsibilities

- Help explain task functionality and use cases
- Walk users through the task builder flow
- Suggest conditional logic (e.g., metric thresholds)
- Help structure action blocks properly
- Guide users on best practices for naming and scheduling
- Offer examples of common task automation patterns
- Debug task logic if not firing or behaving unexpectedly

---

## 🔄 5. Common Task Use Cases

- Retry agent if failed
- Log agent usage every hour
- Send webhook if API returns 500 status
- Trigger cleanup or reset logic every night
- Alert Admins if cost or risk metrics exceed limit

---

## 🛠️ 6. Troubleshooting Patterns

### “My task isn’t triggering”
> Ask the user:
- Is the trigger set correctly? (manual, schedule, event?)
- Are the conditions too strict?
- Did they save/publish the task?

---

### “The task ran but didn’t work”
> Ask:
- What were the action steps?
- Any errors in logs or console?
- Try isolating one action block and running again

---

### “Can I chain tasks?”
> Yes — use the “trigger another task” action block to sequence behavior.

---

## 🔐 7. RBAC Enforcement

- **Admin & Manager**: Can create, edit, and delete tasks
- **Viewer**: Read-only; can’t modify tasks
- Helper AI must respect these limits and never assist in unauthorized task creation.

---

## 📌 Best Practices

- Use clear, descriptive names like `retry_failed_agent`, `send_cost_alert`, or `log_usage_hourly`
- Avoid overly complex conditions without testing
- Separate long workflows into multiple simple tasks
- Always confirm task logic with the user before executing or saving via Action Mode

---

## 🤖 Action Mode Reminders

- Confirm every step before proceeding
- Allow user to preview the task setup before saving
- If unsure how to build a task, redirect to contact page