# CAP Agents Memory Plugin

This package provides `CdsMemoryStore`, a CDS-backed implementation of LangGraph long-term memory.

## Structure

- `src/memory/` contains the Store implementation and CDS mapping helpers.
- `index.cds` exports reusable `StoreItem` and `StoreItemField` aspects.
- `lib/add.js` generates default entities through `cds add cap-agents-memory`.
- `tests/memory/` contains the Store unit suite.

## Commands

- Build: `pnpm build`
- Test: `pnpm test`
- Lint: `pnpm lint`

Keep the Store API compatible with LangGraph's `BaseStore`, and query the CAP MCP server before changing CDS models or CAP handlers when it is available.
