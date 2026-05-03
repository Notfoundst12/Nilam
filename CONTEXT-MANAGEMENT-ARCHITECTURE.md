# Context Management Architecture: NILAM Command Center PRO

## 1. Overview
This document outlines the context management strategy for the NILAM Automation Tools ecosystem (v15.0+ Vantablack Edition). As a multi-component system (Client-side JavaScript, C2 Telemetry Bot, and Supabase Cloud), maintaining coherent state and context across aggressive browser refreshes, rate limits, and multi-agent operations is critical.

## 2. Core Context Domains

### 2.1 Client-Side Execution Context (The Vantablack UI)
The browser environment is highly volatile. Previous versions suffered from context degradation due to Vue Router pushes and hard page reloads (`location.href`).

**Context Preservation Strategy:**
- **DOM Independence:** The `#NILAM-ULTIMATE` UI is injected directly into `document.body`, outside of the primary Vue.js `#app` container. This isolates the tool's context from the host application's state changes.
- **Soft Form Reset (Zero-Navigation):** Instead of relying on URL changes to clear form state, context is reset via direct DOM manipulation (clearing `input.value` and dispatching `input`/`change` events) followed by simulated clicks on the "Kembali" button. This preserves the injected script's memory heap.
- **Global Variable Scoping:** Core execution state (`BOOKS`, `running`, `paused`) is isolated within an Immediately Invoked Function Expression (IIFE) to prevent variable collision with the host site.
- **Configuration State:** User preferences (Jitter, Ghost Mode, Delay) are stored in a reactive `window.__nilamConfig` object, allowing real-time updates from the UI sliders without interrupting the execution loop.

### 2.2 Telemetry & Progress Context (Supabase Cloud Memory)
To provide real-time updates to the Telegram Bot without requiring constant polling from the bot itself, the client script pushes state to a Supabase database.

**Context Synchronization:**
- **Unique Identification:** Users are assigned a resilient `uid`. The system attempts to extract the official AINS user ID from intercepted XHR requests or Vuex stores. If unavailable, it falls back to a persistent `Pelajar-XXXX` identifier.
- **Ephemeral State Tracking:** The client pushes a heartbeat string: `__TEL__|{uid}|{timestamp}|{ok}|{fail}|{target}|{status}`. 
- **Context Pruning (Garbage Collection):** To prevent database bloat and overlapping progress bars, the client issues a `DELETE` request for `ilike.__TEL__|{uid}|*` before inserting the new heartbeat. This ensures only the most recent context exists in the cloud.
- **Bot Context Retrieval:** The Telegram bot fetches all `__TEL__` records. It evaluates the `{timestamp}` against the current server time. Contexts older than 300 seconds (5 minutes) are considered stale/disconnected and are dropped from the "Live Users" dashboard.

### 2.3 Command & Control (C2) Context
The Telegram bot acts as an orchestrator, sending state-change commands (PAUSE, RESUME, KILL, MSG) to active browser clients.

**Context Routing & Security:**
- **Timestamped Payloads:** Commands are written to Supabase as `__CMD__|{ACTION}|{TIMESTAMP}`. 
- **Client-Side Expiration:** The `checkC2()` function in `n.js` parses the timestamp. Any command older than 60 seconds is ignored (`if (Date.now() - ts > 60000) continue;`). This critical context rule prevents the system from entering an infinite "PAUSE" loop if a command is left lingering in the database.
- **Message Idempotency:** Broadcast messages (`__CMD__|MSG|...`) generate a unique `msgId` based on their timestamp. This ID is stored in the browser's `localStorage` to ensure the user only sees the alert once, preserving UI flow.

## 3. Persistent Memory (Book Library & Used Tracking)

**Knowledge Base Integration:**
- **The Library:** `books_library.json` acts as a static, external knowledge graph of 10,000 books. It is fetched via jsDelivr.
- **Cache Invalidation:** To prevent stale data, the fetch URL uses explicit commit hashes (e.g., `@baa150f`).
- **Used Books Registry (`__nilam_used__`):** 
  - **Local Layer:** Successfully submitted books are stored in `localStorage`.
  - **Cloud Layer:** Titles are POSTed to Supabase with `Prefer: resolution=ignore-duplicates`.
  - **Context Merging:** Upon initialization, the system merges the Cloud list and Local list. This dual-layer memory ensures that even if the user changes browsers, their progress context is partially recoverable, preventing duplicate entries.

## 4. Multi-Agent Workflow Coordination (Bot Development)

When further developing this system, AI agents must adhere to the following context rules:
1. **Never use `location.href` or `location.reload()`** in the client script, as this destroys the execution context.
2. **Always URL Encode Supabase Queries:** Wildcards like `%` must be encoded when passing context through REST APIs to prevent query parsing failures.
3. **Respect the IIFE:** New helper functions must be injected *inside* the main `(async function(){ ... })();` block to maintain scope integrity.
4. **Update Bot Payload Hashes:** When the client script (`n.js`) is modified, the new git commit hash MUST be updated in `nilam_bot.py` to ensure the correct context is distributed to users.