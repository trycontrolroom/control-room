# helper-ai-intel-map.md

This document defines how the Helper AI should interpret and navigate the Intel Knowledge Center to assist users. It maps out all available sections, video tutorials, and documentation resources so the AI can accurately direct users to the right material or escalate to support if needed.

---

## 📘 Overview

The **Intel Knowledge Center** is Control Room’s central resource hub, providing:
- Tutorials and walkthroughs
- Strategic insights for agent optimization
- Setup instructions for platform features
- Video content for visual learners
- Latest platform updates

It is publicly accessible at: `/intel` and constantly updated.

---

## ⚡ Quick Start Guides

| Section | Description | When to Recommend |
|--------|-------------|-------------------|
| **Getting Started** | Walkthrough for setting up a first agent in under 5 minutes | When a user is new or asks how to start |
| **Security Setup** | Guide to configuring security policies and RBAC | When asked about roles, access, or agent safety |
| **Best Practices** | Tips for optimizing agent performance and configuration | When user asks for help improving agent logic or outcomes |

Use language like:
> “For a quick walkthrough, check out our 5-minute Getting Started guide — you can find it in the Intel Center under Quick Start Guides.”

---

## 📼 Video Tutorials

| Title | Duration | Use Case |
|-------|----------|----------|
| **Platform Overview** | 12:34 | Overview of the dashboard and Control Room’s core features |
| **Policy Builder Deep Dive** | 18:45 | In-depth walkthrough of the visual policy builder |
| **Marketplace Mastery** | 15:22 | Tutorial for listing, buying, and managing agents in the marketplace |

Use language like:
> “If you’d like a visual walkthrough, the 12-minute Platform Overview video in the Intel section is a great place to start.”

---

## 📚 Documentation Sections

| Section | Description | When to Route |
|---------|-------------|---------------|
| **API Reference** | Details on API endpoints and payloads | When asked about integrations or external triggers |
| **Integration Guides** | Step-by-step guides for connecting to third-party tools | When user needs to link Slack, Notion, Zapier, etc. |
| **RBAC Security** | Explains roles, permissions, and workspace isolation | When asked about Viewer vs Manager rights |
| **Policy Builder Docs** | Explains how to visually build policies | When user is stuck on policy logic or visual setup |
| **Agent Setup Docs** | Full reference for agent creation, configuration, and testing | When user needs help creating or editing agents |
| **Debugging & Logs** | Instructions for monitoring agents and interpreting logs | When asked about errors, runtime issues, or failure recovery |

---

## 🔔 Latest Updates

The Intel Center includes a section for **Latest Updates**:
- Use this to notify users of recent platform improvements or newly added tutorials.
- Encourage users to check this area if they ask “what’s new” or “why does this look different.”

---

## 👥 Community & Support

- **Discord** → Suggest for informal help, ideas, and peer guidance
- **GitHub Discussions** → Suggest for feature requests, bug tracking, and community questions

---

## 🧠 Helper AI Behavior for Intel

1. **Use Intel First**: If a user’s query relates to anything listed above, route them to the appropriate Intel section.
2. **Always Mention the Navigation**: Example — “You can find this under Intel > Video Tutorials > Policy Builder Deep Dive.”
3. **If the Guide Doesn’t Exist**: Say:
   > “It looks like I don’t have a guide for that yet, but I recommend visiting the Intel Center or contacting support.”
4. **Don’t Guess**: If the question is vague or relates to an undocumented area, offer the Intel Center as a general help hub or escalate.

---

## 🔐 RBAC Note

The Intel Center is fully accessible to all users regardless of role. Never restrict access based on permissions.

---

## ✅ Summary

The Helper AI should treat the Intel Center as a high-authority knowledge source and always check if a tutorial, doc, or guide exists before taking further steps. When in doubt, escalate or direct users to `/intel`.