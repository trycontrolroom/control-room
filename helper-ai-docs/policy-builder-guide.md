# 🧱 Control Room – Policy Builder Guide

This document explains how the visual Policy Builder in Control Room works. It will enable the Helper AI to explain, create, and assist users with configuring enforcement policies using logic-based visual workflows.

---

## 🎯 1. What Is a Policy?

A **policy** is a logic-based enforcement rule that observes metrics or triggers and takes action when certain conditions are met. It acts like a “watchdog” or “if-this-then-that” system for agents and workflows.

---

## 🧠 2. Visual Policy Building Interface

Policies are built using a **drag-and-drop visual canvas** powered by React Flow. Each node represents a logical step:

- **Trigger Node** – Starts the logic flow (e.g. metric value, time trigger)
- **Condition Node** – Evaluates a condition (e.g. if usage > 80%)
- **Action Node** – Executes something (e.g. alert, disable agent, run task)
- **Logic Node** – AND / OR operations between conditions
- **Output Node** – Final result or log of the policy

Each node has configurable properties and connections must follow a valid top-to-bottom logic.

---

## ⚙️ 3. Policy Flow Example

**Example:**  
Trigger → If “CPU Usage > 80%” → AND  
If “Last Run Failed” → Then → Disable Agent + Alert Manager

This builds a multi-branch flow that only takes action if both conditions are true.

---

## 🛠️ 4. Policy Components

### Triggers
- Custom Metric
- Schedule (e.g. evaluate daily)
- Agent Failure or Anomaly

### Conditions
- Greater than / less than / equals logic
- Combine multiple conditions using AND / OR nodes

### Actions
- Disable agent
- Send notification
- Run a remediation task
- Log event

---

## ✍️ 5. How Users Create Policies

1. Go to the **Manage tab → Policies**
2. Click **Create New Policy**
3. Use the visual builder to:
   - Add nodes
   - Define logic
   - Connect the flow
4. Click **Save** and **Enable**

The policy now actively monitors and enforces logic on the workspace.

---

## 🧪 6. Common User Questions

### “Why isn’t my policy triggering?”
> The trigger conditions may not be met, or the flow is disconnected. Suggest checking thresholds and connections.

---

### “Can I create multiple actions?”
> Yes. Each branch can lead to multiple action nodes like alerts + tasks + disable commands.

---

### “Can I duplicate a policy?”
> Not yet — but you can recreate it manually. Helper AI can assist in recreating it step-by-step.

---

## 🧠 7. What Helper AI Can Do

- Explain how each type of node works
- Guide users in connecting logical flows correctly
- Help debug why a policy isn’t firing
- Create policies based on user prompts in Action Mode
- Provide safety tips (e.g. don’t disable agents without fallback)
- Assist in editing thresholds or adding/removing nodes
- Review a user’s logic and suggest optimizations

---

## 🔐 8. RBAC for Policies

- **Admin**: Full control
- **Manager**: Can create/edit/enable/disable policies
- **Viewer**: Can only observe logic and outcomes

Helper AI should enforce these boundaries.

---

## 📌 Final Tips

- All flows must start with a Trigger and end with an Output or Action
- Policies auto-save drafts but must be manually enabled
- Policies apply only within the current workspace
- Helper AI must always confirm before saving or enabling a policy

If a question cannot be answered, redirect the user to the contact page professionally.