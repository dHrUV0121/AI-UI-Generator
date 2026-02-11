# AI UI Generator

> Convert natural language UI descriptions into working, deterministic React code with live preview.

An AI-powered multi-agent system that generates production-quality UIs from plain English descriptions. Built with a **fixed component library** (19 components), **3 specialized AI agents** (Planner → Generator → Explainer), and a **3-panel split-view** interface with chat, code editor, and live preview.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** 9+
- **Google Gemini API key** ([Get one here](https://aistudio.google.com/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ai-ui-generator.git
cd ai-ui-generator

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local and add your GEMINI_API_KEY

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ | Google Gemini API key for AI generation |

---

## 🏗️ Architecture Overview

### High-Level Design

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                     │
│                                                          │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │Chat Panel│  │  Code Panel   │  │  Preview Panel    │  │
│  │(Input +  │  │  (Monaco     │  │  (Sandboxed       │  │
│  │ History) │  │   Editor)    │  │   iframe + Babel) │  │
│  └────┬─────┘  └──────┬───────┘  └───────┬──────────┘  │
│       │               │                   │              │
│       └───────────────┼───────────────────┘              │
│                       │                                  │
│              ┌────────┴────────┐                        │
│              │  State Manager  │ (useGeneratorStore)     │
│              │  + Version Hist │                        │
│              └────────┬────────┘                        │
└───────────────────────┼─────────────────────────────────┘
                        │ POST /api/generate
                        ▼
┌───────────────────────────────────────────────────────┐
│                   Backend (API Route)                   │
│                                                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │              Orchestrator                        │  │
│  │                                                  │  │
│  │  Step 1: ┌──────────┐  Structured JSON Plan     │  │
│  │          │ Planner  │ ──────────────────┐       │  │
│  │          │  Agent   │                   │       │  │
│  │          └──────────┘                   ▼       │  │
│  │  Step 2: ┌──────────┐  ┌──────────┐            │  │
│  │          │Generator │→ │Validator │ (Whitelist) │  │
│  │          │  Agent   │  │          │ ←retry      │  │
│  │          └──────────┘  └──────────┘            │  │
│  │  Step 3: ┌──────────┐                          │  │
│  │          │Explainer │ → Human explanations      │  │
│  │          │  Agent   │                          │  │
│  │          └──────────┘                          │  │
│  └─────────────────────────────────────────────────┘  │
│                        │                               │
│              ┌─────────┴──────────┐                   │
│              │   Gemini 2.0 Flash │                   │
│              │   (Low Temperature)│                   │
│              └────────────────────┘                   │
└───────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Input** → Chat panel receives natural language description
2. **Sanitization** → Input checked for prompt injection patterns
3. **Planner Agent** → Analyzes intent, selects components, creates structured JSON plan
4. **Generator Agent** → Converts plan to valid React/JSX code
5. **Validator** → Checks code against component whitelist, rejects violations
6. **Explainer Agent** → Generates human-readable explanation of decisions
7. **State Update** → Code and explanation sent to frontend
8. **Live Preview** → Code rendered in sandboxed iframe via Babel transform

---

## 🤖 Agent Design & Prompts

### Multi-Agent Architecture

The system uses **3 specialized agents**, each with a distinct role, separate prompt templates, and clear separation of concerns:

### 1️⃣ Planner Agent (`src/lib/agents/planner.ts`)

**Role:** Interpret user intent → Structured plan

**System Prompt Key Points:**
- Receives the full component catalog with all props
- Must output valid JSON only (no markdown, no explanations)
- Supports two modes: **NEW** (from scratch) and **EDIT** (incremental modifications)
- In edit mode, receives current code context and must plan targeted changes

**Output Format (New):**
```json
{
  "layout": {
    "type": "flex-col",
    "description": "Dashboard layout with header and content",
    "sections": [{
      "id": "header",
      "type": "single",
      "components": [{"component": "Navbar", "props": {...}}]
    }]
  },
  "reasoning": "Why these choices were made"
}
```

**Output Format (Edit):**
```json
{
  "editType": "modify",
  "changes": [
    {"action": "add", "component": "Table", "position": "after stats section"}
  ],
  "preserveExisting": true,
  "reasoning": "Added table while keeping existing components"
}
```

### 2️⃣ Generator Agent (`src/lib/agents/generator.ts`)

**Role:** Structured plan → Valid React/JSX code

**System Prompt Key Points:**
- Receives explicit whitelist of 19 allowed components
- STRICT rules: NO className, NO style={}, NO imports, NO new components
- Must output a single `GeneratedUI` function component
- In edit mode, must MODIFY existing code, not rewrite
- May use `React.useState` for interactive elements (modals, tabs)

**Validation & Retry:**
The generator's output is validated by the component whitelist checker. If validation fails:
1. Error details are appended to the plan
2. Generator is called again with error context
3. Up to 2 retries before failing

### 3️⃣ Explainer Agent (`src/lib/agents/explainer.ts`)

**Role:** Plan + Code → Human-readable explanations

**System Prompt Key Points:**
- Explains WHY specific components were chosen
- References specific props and layout decisions
- In edit mode, explains what changed and what was preserved
- Falls back gracefully if JSON parsing fails

**Output Format:**
```json
{
  "summary": "Created a dashboard with stats and a data table",
  "decisions": [
    {"what": "Used Stat component", "why": "Best for KPI display", "component": "Stat"},
    {"what": "Chose bar chart", "why": "Better for comparing categories", "component": "Chart"}
  ],
  "structureExplanation": "Two-column grid layout with sidebar navigation"
}
```

### Prompt Templates (`src/lib/agents/prompts.ts`)

All 6 prompt templates are in a single file for visibility:
- `PLANNER_SYSTEM_PROMPT` — New UI generation planning
- `PLANNER_EDIT_SYSTEM_PROMPT` — Incremental modification planning
- `GENERATOR_SYSTEM_PROMPT` — New code generation
- `GENERATOR_EDIT_SYSTEM_PROMPT` — Code modification
- `EXPLAINER_SYSTEM_PROMPT` — New build explanation
- `EXPLAINER_EDIT_SYSTEM_PROMPT` — Change explanation

### Orchestrator (`src/lib/agents/orchestrator.ts`)

Coordinates the pipeline with:
- Sequential agent execution (Planner → Generator → Validator → Explainer)
- Retry logic on validation failure (up to 2 retries)
- Comprehensive console logging at each step
- Non-critical failure handling (Explainer errors don't block generation)

---

## 🧩 Component System Design

### Design Principles

1. **Immutable Components** — Styling is built into each component and cannot be changed
2. **Props-Only Customization** — All variation is controlled through typed props
3. **Deterministic Rendering** — Same props → identical visual output every time
4. **Self-Contained** — No external CSS dependencies (Tailwind classes are built-in)

### Available Components (19 total)

| Component | Category | Description | Key Props |
|-----------|----------|-------------|-----------|
| **Button** | Input | Action triggers | `variant`, `size`, `icon`, `fullWidth` |
| **Card** | Layout | Content containers | `title`, `subtitle`, `footer`, `variant` |
| **Input** | Input | Form text fields | `label`, `type`, `error`, `icon` |
| **Table** | Data | Tabular display | `columns`, `data`, `striped`, `compact` |
| **Modal** | Feedback | Dialog overlays | `isOpen`, `onClose`, `title`, `size` |
| **Sidebar** | Navigation | Side nav panel | `items`, `collapsed`, `header` |
| **Navbar** | Navigation | Top nav bar | `brand`, `items`, `actions`, `sticky` |
| **Chart** | Data | Visualizations | `type`, `data`, `xKey`, `yKey`, `color` |
| **Badge** | Display | Status labels | `variant`, `size` |
| **Avatar** | Display | User images | `src`, `fallback`, `status`, `size` |
| **Tabs** | Navigation | Tab interface | `tabs`, `variant`, `defaultIndex` |
| **Alert** | Feedback | Notifications | `variant`, `title`, `dismissible` |
| **Divider** | Layout | Separators | `label`, `orientation` |
| **Select** | Input | Dropdowns | `options`, `label`, `error` |
| **Textarea** | Input | Multi-line input | `label`, `rows`, `maxLength` |
| **Toggle** | Input | Switch toggle | `checked`, `onChange`, `label` |
| **Tooltip** | Display | Hover info | `content`, `position` |
| **ProgressBar** | Feedback | Progress indicator | `value`, `variant`, `showLabel` |
| **Stat** | Data | KPI metrics | `label`, `value`, `change`, `icon` |

### Component Registry (`src/lib/component-registry.ts`)

Central source of truth containing:
- Full prop schemas for each component
- Component categories (layout, input, display, feedback, navigation, data)
- Catalog generator for AI prompts
- Whitelist validator for generated code

---

## 🎯 Key Features

### 1. Multi-Agent Pipeline
- Three distinct agents with separate prompts
- Visible agent separation in code
- Structured intermediary formats

### 2. Deterministic Generation
- Fixed component library (no AI-generated components)
- Whitelist enforcement with validation
- Low temperature (0.1) for consistent outputs

### 3. Incremental Edits
- Edit-aware prompts that modify, not rewrite
- Context preservation across iterations
- Conversation history passed to planner

### 4. Version History & Rollback
- Every generation stored as a version
- Click any version to rollback
- Code and explanation preserved per version

### 5. Live Preview
- Sandboxed iframe with Babel transform
- All 19 components available in preview
- Zoom controls (100%, 75%, 50%)
- Auto-updates on code changes

### 6. Safety & Validation
- Component whitelist enforcement
- Prompt injection detection
- Input sanitization
- Retry on validation failure

---

## 🔒 Safety & Validation

### Component Whitelist
- All generated JSX tags are checked against the 19 approved components
- Custom components, className, style={}, and external imports are rejected
- Validation happens before the explainer step; failures trigger retry

### Prompt Injection Protection
- Detects patterns like "ignore all previous instructions"
- Strips HTML tags from user input
- Truncates input to 2000 characters
- Logs suspicious patterns

### Pre-Render Validation
- Code syntax checked before iframe injection
- Error boundary in preview for graceful failures
- User-friendly error messages

---

## ⚠️ Known Limitations

1. **No Streaming** — Full generation completes before showing results (no token streaming)
2. **Preview Isolation** — Charts in preview use UMD Recharts bundle which may slightly differ from SSR
3. **Edit Precision** — Complex multi-part edit requests may occasionally trigger full rewrites
4. **No Persistent Storage** — All state is in-memory; refreshing the page resets everything
5. **Single Session** — No multi-user support or session persistence
6. **Limited Error Recovery** — If all retry attempts fail, user must try again manually

---

## 🚀 Future Improvements

1. **Streaming Responses** — Show generation token-by-token for better UX
2. **Diff View** — Side-by-side comparison between versions
3. **Export/Download** — Package generated code for local use
4. **Component Schema Validation** — Formal JSON schema for component props
5. **Undo/Redo Stack** — Beyond version rollback
6. **Persistent Sessions** — Save/load generation sessions
7. **More Components** — Forms, Breadcrumbs, Pagination, Accordion, etc.
8. **AST-Based Editing** — Parse code into AST for more precise incremental edits
9. **Dark Mode** — UI theme toggle
10. **Custom Themes** — User-configurable color palettes for components

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI/LLM | Google Gemini 2.0 Flash |
| Code Editor | Monaco Editor |
| Charts | Recharts |
| Preview | Sandboxed iframe + Babel Standalone |
| Deployment | Vercel |

---

## 📂 Project Structure

```
src/
├── app/
│   ├── api/generate/route.ts    # API endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main 3-panel UI
├── components/
│   ├── app/                      # Application panels
│   │   ├── ChatPanel.tsx         # Chat interface
│   │   ├── CodePanel.tsx         # Monaco code editor
│   │   ├── PreviewPanel.tsx      # Sandboxed preview
│   │   └── VersionHistory.tsx    # Version rollback
│   └── ui/                       # Fixed component library
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── ... (19 components)
│       └── index.ts              # Barrel export
├── hooks/
│   └── useGeneratorStore.ts      # State management
└── lib/
    ├── agents/
    │   ├── planner.ts            # Agent 1: Intent → Plan
    │   ├── generator.ts          # Agent 2: Plan → Code
    │   ├── explainer.ts          # Agent 3: Decisions → Explanation
    │   ├── orchestrator.ts       # Pipeline coordinator
    │   └── prompts.ts            # All prompt templates
    ├── component-registry.ts     # Component whitelist & schemas
    ├── gemini.ts                 # LLM API client
    ├── preview-builder.ts        # Preview HTML builder
    ├── sanitizer.ts              # Input sanitization
    └── validator.ts              # Code validation (unused - integrated into registry)
```

---

## 📝 Setup Instructions

### Local Development

1. **Clone:** `git clone <repo-url> && cd ai-ui-generator`
2. **Install:** `npm install`
3. **Configure:** Create `.env.local` with `GEMINI_API_KEY=your_key_here`
4. **Run:** `npm run dev`
5. **Open:** http://localhost:3000

### Deployment (Vercel)

1. Push code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com/new)
3. Add `GEMINI_API_KEY` as environment variable
4. Deploy

### API Key Setup

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a new API key
3. Add to `.env.local`: `GEMINI_API_KEY=your_api_key_here`

---

