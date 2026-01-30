# HarvestConnect: Advanced Agentic Implementation Plan

## 🤖 Multi-Agent Orchestration Strategy

To achieve the objective of highly efficient, best-practice engineering with premium design, we will operate through four specialized agentic personas:

1.  **🏰 Architect & Infrastructure Lead**: Manages Neon & InsForge setup, project structure, and deployment pipelines.
2.  **🎨 Creative Director & Lead UI/UX**: Ensures visual excellence (glassmorphism, vibrant palettes, modern typography) and consistency with provided designs.
3.  **⚙️ Backend & API Engineer**: Focuses on Django robust logic, database efficiency, and API performance.
4.  **🧪 QA & Performance Manager**: Implements unit tests, manages token efficiency, and validates all builds.

---

## 🏗️ Technical Architecture & Best Practices

### 1. Database & Infrastructure (Neon & InsForge)
- **Neon Branching**: Utilize Neon branches for safe schema migrations and isolated feature testing.
- **InsForge SDK**: Implement the latest InsForge SDK for Auth, Storage, and AI features to avoid redundant API logic.
- **Engineering Rule**: Always use MCP tools for infra setup and SDKs for application code.

### 2. Frontend Design System (Next.js + Tailwind 3.4)
- **Design Tokens**: Standardize colors, spacing, and glassmorphism effects based on the `code.html` reference.
- **Atomic Components**: Break down large components into "Smaller Builders" (atoms/molecules) for better maintainability and testing.
- **Visual Excellence**:
    - **Typography**: Manrope (Google Fonts).
    - **Palette**: HSL-based primary `#52d411` with varied tints.
    - **Effects**: `backdrop-blur-xl`, `shadow-glass`, smooth HSL gradients.

### 3. Engineering Quality
- **Unit Testing**: Implement Jest/React Testing Library for frontend and Django Test Runner for backend.
- **Linting & Documentation**: Maintain strict TypeScript types and JSDoc/Docstrings.
- **Smaller Builders Pattern**: Avoid "mega-files". Use directory-based component structures (e.g., `components/Button/index.tsx`, `components/Button/Button.test.tsx`).

---

## 📅 Roadmap: Phase 6 & Beyond

### 🚀 Milestone 1: Design System & Core Refresh
- Update `globals.css` with standard HarvestConnect tokens.
- Refactor the TopNavBar and HeroSection into atomic builders.
- **Specialist**: UI/UX Designer.

### 🚀 Milestone 2: Infrastructure & Auth Optimization
- Verify Neon connection pooling ($DATABASE_URL).
- Integrate InsForge SDK for production-ready Auth (replacing/enhancing local JWT logic).
- **Specialist**: Infrastructure Lead.

### 🚀 Milestone 3: Feature Implementation (Shopping Cart)
- Create `CartContext` for global state management.
- Build the `CartDrawer` and `CartPage` using premium design patterns.
- Implement API endpoints for cart persistence (if needed).
- **Specialist**: Backend & Frontend Engineers.

### 🚀 Milestone 4: QA & Deployment
- Write unit tests for the core API client and cart logic.
- Deploy a preview branch via InsForge/Vercel.
- **Specialist**: QA Manager.

---

## 🪙 Token Efficiency Strategy (TOON Integration)

### Core Principle: Convert Large Context to TOON Before Processing

**TOON** (Token-Oriented Object Notation) is a compact, schema-aware format that reduces token usage by 30-60% compared to JSON.

### MCP Configuration
The `toon-optimizer` MCP server is now added to `~/.gemini/antigravity/mcp_config.json`:
```json
"toon-optimizer": {
  "command": "npx",
  "args": ["-y", "json-to-toon-mcp-server@latest"]
}
```

### Agent-Specific Token Savings

| Agent | Large Context Source | TOON Action |
| :--- | :--- | :--- |
| **Architect** | `ARCHITECTURE.md`, file trees | Summarize as TOON before orchestrating |
| **UI Designer** | Design tokens, component props | Convert Tailwind config to TOON |
| **Backend Engineer** | Django model schemas, API specs | Compress `models.py` exports via TOON |
| **QA Manager** | Test reports, coverage data | Convert pytest/vitest JSON to TOON |

### Operational Guidelines
1. **Partial Reads**: Use `StartLine` and `EndLine` in `view_file` to only read what's necessary.
2. **Tool Chaining**: Batch related operations (e.g., multiple file writes) in sequence without redundant status checks.
3. **TOON Compression**: Before passing large JSON/YAML data between agents, convert to TOON format.
4. **Succinct Communication**: Focus on actionable reports as per Neon guidelines.

---

## 📋 Current HarvestConnect Status

### ✅ Completed
- Next.js 16 + Django 4.2 fullstack integration
- JWT Authentication flow
- 60+ API endpoints via DRF
- 9 frontend pages (homepage, marketplace, community-hub, etc.)

### 🔄 In Progress
- Shopping Cart (UI Ready, Backend Ready, Integration Pending)
- Checkout flow
- Premium design system refinement

### 🎯 Next Agent Actions
1. **UI Designer Agent**: Refine `globals.css` with HarvestConnect design tokens
2. **Backend Agent**: Implement cart persistence endpoints
3. **QA Agent**: Run and fix the pending `vitest` test suite

