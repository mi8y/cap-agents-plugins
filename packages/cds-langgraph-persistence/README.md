# @mi8y/cds-langgraph-persistence

[![npm version](https://img.shields.io/npm/v/@mi8y/cds-langgraph-persistence)](https://www.npmjs.com/package/@mi8y/cds-langgraph-persistence)

CDS-backed LangGraph checkpoint persistence for SAP CAP applications. Checkpoints are short-term, thread-scoped state used to resume workflows, retain conversation history, and support time travel.

> SAP's official [`@cap-js/agents`](https://github.com/cap-js/agents) package now includes checkpointer support. Prefer it for new CAP agent applications. This package remains available for its existing CDS checkpointer implementation.

## Installation

```bash
npm install @mi8y/cds-langgraph-persistence
cds add langgraph-checkpointer
```

The add command creates `db/langgraph-checkpointer.cds`, which supplies default `Checkpoints` and `CheckpointWrites` entities. You can instead implement the exported `Checkpoint` and `CheckpointWrite` aspects with your own entities.

Requires `@sap/cds >= 10`.

## Usage

```ts
import { CdsCheckpointSaver } from "@mi8y/cds-langgraph-persistence";

const checkpointer = new CdsCheckpointSaver({ name: "support-agent" });
const graph = builder.compile({ checkpointer });

await graph.invoke(input, {
  configurable: { thread_id: "customer-123" },
});
```

`name` isolates checkpoints for each graph. Use `configurable.thread_id` to isolate each conversation or workflow run.

## API

```ts
new CdsCheckpointSaver(config, serde?)
```

| Option                      | Type     | Description                                                  |
| --------------------------- | -------- | ------------------------------------------------------------ |
| `name`                      | `string` | Required logical graph name.                                 |
| `ttl`                       | `number` | Optional checkpoint lifetime in milliseconds.                |
| `fqnCheckpointsEntity`      | `string` | Defaults to `plugin.langgraph.persistence.Checkpoints`.      |
| `fqnCheckpointWritesEntity` | `string` | Defaults to `plugin.langgraph.persistence.CheckpointWrites`. |

Main methods are `getTuple`, `list`, `put`, `putWrites`, and `deleteThread`.

## TTL cleanup

`purgeExpiredCheckpoints()` removes expired completed threads. Invoke it from a scheduled job; interrupted or in-progress threads with pending writes are skipped.

```ts
import cds from "@sap/cds";
import { purgeExpiredCheckpoints } from "@mi8y/cds-langgraph-persistence";

cds.spawn({ every: 60 * 60 * 1000 }, () => purgeExpiredCheckpoints());
```

## Long-term memory

For cross-thread user preferences, facts, and Store API search, install [`@mi8y/cap-agents-memory`](../cap-agents-memory/). It provides `CdsMemoryStore` and `cds add agent-memory`.

## License

[MIT License](./LICENSE)
