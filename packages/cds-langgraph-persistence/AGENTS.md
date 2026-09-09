# CDS Persistence Plugin for LangGraph Checkpoints

This package provides LangGraph checkpoint persistence (short-term, thread-scoped memory) for SAP CAP applications. For long-term memory stores, use `@mi8y/cap-agents-memory`.

## Project Structure

<package-root>
├── package.json
├── AGENTS.md <- You are here
├── lib
│  └── add.js // helper lib for CDS plugin
├── src
│ ├── checkpoint
│ │ ├── cds-checkpointer.ts
│ │ └── index.ts
├── tests // unit tests
│   ├── checkpoint
└── cds-plugin.js // CDS plugin entry point

## Commands

- Build: `pnpm build`
- Test: `pnpm test`
- Lint: `pnpm lint`
