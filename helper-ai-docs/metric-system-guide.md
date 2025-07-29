# 📊 Control Room – Metric System Guide

This document trains the Helper AI to assist users in understanding, creating, customizing, and acting upon metrics inside the Control Room platform. Metrics are essential for tracking performance, triggering policies, and informing users about their AI agents’ behavior.

---

## 📐 1. What Are Metrics?

Metrics are **quantitative measurements** collected from agents or user-defined tasks. They help teams:
- Monitor agent health, performance, and costs
- Detect anomalies or issues
- Trigger policies automatically
- Visualize usage trends in the dashboard

---

## 🔢 2. Types of Metrics

### 🔹 Default System Metrics:
Automatically tracked for all agents:
- `latency_ms`: Agent response time
- `success_rate`: % of successful executions
- `failure_count`: Number of recent errors
- `tokens_used`: Total OpenAI tokens
- `daily_cost_usd`: Cost per day
- `uptime_percent`: Availability over time

### 🧪 Custom Metrics:
Users can define their own, such as:
- `user_dropoff_rate`
- `data_pipeline_throughput`
- `customer_satisfaction_score`
These can be emitted by agents or external webhooks.

---

## ⚙️ 3. Creating a Custom Metric

Users (Admin or Manager roles) can create a new metric via:

1. **Manage → Metrics → Create New**
2. Provide:
   - **Metric name** (e.g., `conversion_rate`)
   - **Description**
   - **Value type**: number, percentage, boolean
   - **Source**: agent-emitted or external webhook
   - **Visibility** (public/private in workspace)
3. Click **Save**

The system will provide a webhook endpoint to push values.

---

## 📈 4. Visualizing Metrics

All metrics are displayed in the Stats tab:

- Use filters to select agent or metric
- View real-time and historical charts
- Hover to see timestamps and values
- Toggle between daily, weekly, monthly ranges

---

## 🧠 5. Helper AI Responsibilities

- Explain what metrics are and why they matter
- Help users create or edit metrics in Action mode
- Suggest useful metrics based on agent purpose
- Troubleshoot issues like:
  - “Metric not updating”
  - “Custom metric not showing on dashboard”
- Guide users in linking metrics to Policies or Tasks

---

## 🚨 6. Metric Troubleshooting Patterns

### “My metric isn’t updating”
> Ask:
- Is the agent emitting the value?
- Was the webhook properly configured?
- Was the metric saved and deployed?

---

### “I can’t find this metric on the dashboard”
> Ask:
- Is it public or private?
- Is it filtered correctly by agent/date?
- Was it created successfully?

---

### “Can I delete or reset a metric?”
> Explain:
- You can’t reset historical values.
- Metrics can be **disabled** but not fully deleted.

---

## 🧠 7. Explain Mode Behavior

- Define each metric term simply
- Walk users through creating or editing a metric
- Suggest visualizations or grouping strategies
- Redirect to contact page if AI cannot assist

---

## ⚙️ 8. Action Mode Behavior

- Ask user for:
  - Metric name and description
  - Value type
  - Emission method (agent or external)
- Confirm creation request
- Generate the config and register it in backend
- Return success or next step instructions (e.g., "send your values here")

---

## ✅ 9. Best Practices

- Use clear, lowercase, underscore-separated metric names (e.g., `daily_cost_usd`)
- Use consistent units (e.g., ms, %, USD)
- Don’t overload metrics — one value per purpose
- Document what each custom metric tracks

---

## 🔐 10. RBAC Rules

- **Admins & Managers** can create/edit metrics
- **Viewers** can only see them in dashboards
- AI must never bypass these rules

---
