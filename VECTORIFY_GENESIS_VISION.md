# Vectorify Genesis: The Business IDE
> "Transform intention into operational structure in 10 seconds."

## 1. The Vision: "Cursor for Business"

Vectorify is not another project management tool. It is an **Integrated Business Environment (IBE)**.
Just as Cursor won by vertically integrating the editor with AI to remove coding friction, Vectorify wins by vertically integrating strategy (Docs), execution (Tasks), and automation (Agents) to remove **Context Switching**.

### The Core Philosophy
*   **Vertical Integration**: Control the environment where work happens. Don't just be a wrapper; be the host.
*   **Native AI**: AI is not a chatbot on the side. It has "write permissions" to your business state (DB, Docs, Tasks).
*   **Business as Code**: Strategy should be structured, versionable, and refactorable like code.
*   **Prompt-to-Workflow**: No complex node graphs (n8n). Natural language triggers invisible automation.

---

## 2. The Problem: The Execution Gap

Current tools force founders to act as "human data buses", manually copying strategic ideas into execution tickets.
*   **Notion**: Passive canvas. Requires manual structure.
*   **Jira/Linear**: Rigid bureaucracy. Kills creativity.
*   **ChatGPT**: "Brain in a Jar". Gives advice but cannot execute or change state.
*   **n8n**: Too complex for non-engineers.

**Vectorify's Moat**: We eliminate the administrative burden of "passing to clean" (converting ideas to tasks).

---

## 3. The MVP: "Vectorify Genesis"

**Goal**: A "Refactor Business" tool.
**Key Metric**: Time to go from "Vague Idea" to "Structured Plan" (Target: < 10s).

### The Killer Feature: "The Composer" (Cmd+K)
A floating command bar with "God Mode" permissions over the project.

**The Workflow:**
1.  **Input**: "Pivot strategy to focus on B2B Real Estate SaaS."
2.  **AI Action (The "Wow" Moment)**:
    *   **Live Docs**: Updates the Strategy Document (e.g., Value Prop, Target Audience).
    *   **Live Tasks**: Marks old B2C tasks as "Obsolete", creates new B2B tasks (e.g., "Scrape Real Estate Leads", "Draft B2B Email").
3.  **Diff View**: User sees a "Code Diff" style view of changes (Red = Removed, Green = Added).
4.  **Merge**: User clicks "Accept", and the business reality is updated instantly.

### Scope (Kill List for MVP)
To move fast, we cut:
*   ❌ External Integrations (Gmail, Slack, Jira) - *Later*.
*   ❌ Real-time Multiplayer (Cursors) - *Later*.
*   ❌ Complex Rich Text (Images/Embeds) - *Later*.
*   ❌ Visual Node Graphs - *Never*.

---

## 4. Technical Architecture (MVP)

**Stack**:
*   **Frontend**: Next.js + Tailwind.
*   **Editor**: TipTap (Headless, AI-friendly).
*   **AI Engine**: Vercel AI SDK (Streaming UI) + OpenAI/Anthropic (Function Calling).
*   **Backend/DB**: PostgreSQL (Projects, Docs, Tasks).

**Data Model (Simplified)**:
*   `Projects`: The container.
*   `Docs`: Markdown content, "The Strategy".
*   `Tasks`: Simple list (Todo/Doing/Done), "The Execution".

**AI Tools (Function Calling)**:
*   `create_tasks({ tasks: string[] })`
*   `update_doc({ content: string, mode: 'replace' | 'patch' })`

---

## 5. Strategic Roadmap

### Phase 1: The Structure (MVP - Now)
*   **Capabilities**: Split view (Doc | Tasks), Composer Chat.
*   **Value**: Instant planning and restructuring.

### Phase 2: The Knowledge (Months 2-3)
*   **Capabilities**: Web Browsing (Perplexity/Tavily API).
*   **Value**: Strategic research agent ("Research competitor pricing and update my pricing doc").

### Phase 3: The Action (Months 4-6)
*   **Capabilities**: External APIs (Gmail, Slack) via "Invisible Automation".
*   **Value**: The first digital employee ("Send these emails").

---

## 6. Implementation Plan (Immediate)

1.  **Core UI**: Build the Split View Dashboard (Left: Strategy Doc, Right: Task List).
2.  **Composer UI**: Implement the `Cmd+K` floating modal.
3.  **AI Wiring**: logic using Vercel AI SDK to call `create_task` and `update_doc`.
4.  **Diff View**: A simple modal showing "Proposed Changes" before committing.
