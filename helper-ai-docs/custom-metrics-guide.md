# 📊 Control Room – Custom Metrics Guide

This document teaches the Helper AI how custom metrics work in Control Room, how users create them, and how to assist with metric-related troubleshooting, optimization, and best practices.

---

## 📐 1. What Are Custom Metrics?

Custom metrics are user-defined data points tracked across agents or systems. They allow Control Room to observe specific behaviors, patterns, or performance stats — and are essential for triggering policies.

---

## 🛠️ 2. Common Use Cases

- Tracking **API error rates** or **response times**
- Monitoring **task success/failure**
- Keeping count of **agent usage** or **calls per hour**
- Measuring **latency**, **cost**, or **resource usage**
- Observing **user churn signals** or **conversion events**

---

## 🧩 3. Metric Structure

Each custom metric has:
- **Metric Name** – Unique, descriptive title
- **Metric Key** – Used in code/policies (e.g. `api_latency_ms`)
- **Data Type** – `number`, `boolean`, `string`, or `percent`
- **Source** – Agent, event, or task reporting it
- **Tags** (optional) – For filtering or grouping metrics

---

## ✏️ 4. How Users Create Metrics

1. Go to **Manage tab → Metrics**
2. Click **“Create New Metric”**
3. Define:
   - Name (e.g. "Average API Latency")
   - Key (e.g. `avg_latency_ms`)
   - Type (e.g. Number)
   - Reporting Agent (optional)
   - Description (optional)
4. Save the metric — it’s now available in the system

Users can now reference this metric in:
- Policy Builder
- Task Conditions
- Agent Logging

---

## 🔁 5. How Metrics Are Updated

Metrics are updated by:
- Agent reports (via `logMetric()` or similar)
- Tasks sending data (manual or automated)
- External webhook or API feed integration

Control Room stores historical values for dashboards and policies.

---

## 🧠 6. Helper AI Responsibilities

- Explain how metrics are created and used
- Help name and structure new metrics
- Assist with common metric logic (e.g. calculating success rate)
- Recommend whether to use `number`, `boolean`, or `string` types
- Help debug metrics not updating (e.g. missing agent logic)
- Suggest metrics based on goals (e.g. “track agent cost over time”)

---

## 🧪 7. Common Troubleshooting Scenarios

### “My metric isn’t updating”
> Suggest checking:
- The agent code is calling the right function
- The metric key matches exactly
- There are no typos in the reporting logic

---

### “Can I edit a metric type?”
> Not directly — recommend deleting and recreating the metric if the data type needs to change.

---

### “Can I use the same metric in multiple policies?”
> Yes. Metrics are global per workspace and can be reused across policies and agents.

---

## 🔐 8. RBAC & Permissions

- **Admin & Manager**: Can create, edit, and delete metrics
- **Viewer**: Can observe but not change anything
- Helper AI must never allow unauthorized metric creation or edits

---

## 📌 Final Tips

- Metric keys must be unique and lowercase with underscores
- Helper AI should guide users through naming best practices (e.g. `avg_latency`, `task_success_rate`)
- Confirm before saving any metric created via Action Mode
- If unsure, offer to redirect to the contact page for further assistance