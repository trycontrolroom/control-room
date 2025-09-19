# ✅ Control Room – Task Flow Guide

This document outlines how tasks are created, triggered, executed, and managed within Control Room. It provides the Helper AI with full context to assist users in understanding and managing their tasks correctly.

---

## 🔄 1. What Is a Task?

A **task** in Control Room is a discrete automation or action that is tied to an agent or policy. Tasks represent what the system **does** — such as running an agent, sending a report, or logging a result.

---

## 🧩 2. Task Structure

Each task consists of:

- **Name** – A descriptive label (e.g. “Run Daily Data Sync”)
- **Linked Agent/Policy** – What the task is attached to
- **Trigger Method** – When and how it runs (schedule, metric threshold, manual, etc.)
- **Input Parameters** – Any values or config needed
- **Expected Output** – Result of the task (e.g. log, action, API call)
- **Status** – Enabled or disabled

---

## ⏰ 3. Trigger Methods

Tasks are activated by the following:

- **Scheduled Time (Cron)** – e.g. every day at 3 AM
- **Manual Run** – via dashboard button
- **Metric Change** – if a custom metric passes a certain threshold
- **Policy Trigger** – if a condition is met within a policy

---

## ⚙️ 4. Execution Flow

1. **Trigger Fires**
2. **Input is pulled in** from the config
3. **Linked agent or policy is activated**
4. **Output is logged or executed**
5. **Notifications are sent** (if configured)

---

## 🧠 5. Tips for Creating Effective Tasks

- Be clear with naming: describe what the task does
- Link tasks to agents with meaningful outcomes
- Schedule tasks only if needed — don’t overload runtime
- Use metric-based triggers for dynamic logic
- Enable notifications for visibility

---

## 🧪 6. Common Questions

### “How do I test a task?”
> Use the **Manual Run** option from the Manage tab or Dashboard. It will execute the task instantly using current config.

---

### “How do I edit a task?”
> Go to the **Manage tab**, locate the task, click edit. You can update trigger method, inputs, or the agent it links to.

---

### “How do I delete a task?”
> Only Admins and Managers can delete tasks. Select the task in the Manage tab, then click delete. Viewers can only observe tasks.

---

### “How do I make a task run every hour?”
> Use this cron expression: `0 * * * *`

---

### “How do I make a task run based on a metric?”
> When creating the task, choose “Custom Metric” as the trigger, then define the metric threshold and evaluation logic.

---

## 🔐 7. Role Permissions

- **Admin**: Can create, edit, delete, and assign tasks
- **Manager**: Can do everything except assign tasks across workspaces
- **Viewer**: Can view task results but not run or edit

---

## 🧠 8. What Helper AI Can Do

- Explain each part of a task and how it works
- Guide users through creating or editing a task
- Suggest improvements or fixes for task logic
- Diagnose why a task didn’t trigger (e.g., inactive policy, missing input, disabled task)
- Recommend cron expressions and trigger logic
- Assist in linking tasks to agents or metrics

If the issue cannot be resolved, redirect to the contact page.

---

## 📌 Final Notes

- All tasks should follow workspace and role boundaries
- AI should always confirm before creating or updating a task
- Never allow Viewers to initiate actions