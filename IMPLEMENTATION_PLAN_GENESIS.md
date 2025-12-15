# Vectorify Genesis: Implementation Plan

## Phase 1: Foundation & Dependencies

- [ ] **Install Core Dependencies**
    - `npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder ai @ai-sdk/openai zimmer`
    - (Note: We already have `cmdk` and `radix-ui`)

- [ ] **Database Schema Update**
    - Check `@vectorify/db` (Prisma?).
    - Ensure models exist:
        - `Project`: id, name, description.
        - `Document`: id, projectId, content (text), title.
        - `Task`: id, projectId, title, status (todo/doing/done).

## Phase 2: Core UI Components

- [ ] **Strategy Editor (TipTap)**
    - Create `components/editor/StrategyEditor.tsx`.
    - Minimalist design, markdown capability.
    - Expose `setContent` and `getContent` for AI.

- [ ] **Task List**
    - Create `components/tasks/TaskList.tsx`.
    - Simple list with checkboxes and status toggles.
    - Optimistic updates via server actions or API.

- [ ] **Main Layout (Split View)**
    - Update `app/dashboard/page.tsx` (or equivalent).
    - Implement Resizable Panel (optional) or fixed 50/50 Code/Preview style layout.
    - Left: Editor. Right: Tasks.

## Phase 3: The Composer (AI Engine)

- [ ] **Composer Component**
    - Create `components/composer/Composer.tsx`.
    - Floating UI (Cmd+K triggered or Persistent Button).
    - Input for natural language commands.

- [ ] **AI Backend (Vercel AI SDK)**
    - Create `app/api/chat/route.ts`.
    - Configure `openai` provider (Model: `gpt-4o` or `claude-3-5-sonnet` if available via provider).
    - **Define Tools**:
        - `generate_tasks`: Accepts list of tasks strings.
        - `update_strategy`: Accepts markdown content.

## Phase 4: Wiring It Together ("The Wow")

- [ ] **Connect Composer to State**
    - When AI calls `generate_tasks`, update local state immediately (or DB).
    - When AI calls `update_strategy`, stream changes to TipTap editor.

- [ ] **Diff View (MVP Lite)**
    - Visual indicator of what changed (e.g., toast notification: "Created 5 tasks", "Updated Strategy").
    - (Advanced Diff View reserved for Phase 1.5).

## Execution Steps

1.  **Analyze DB**: I will check `@vectorify/db` next to ensure the schema supports our needs.
2.  **Install Deps**: Run the install command.
3.  **Build Components**: Start with the Editor and Task List.
4.  **Integrate AI**: Build the API route and connect the Composer.
