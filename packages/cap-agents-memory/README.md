# @mi8y/cap-agents-memory

[![npm version](https://img.shields.io/npm/v/@mi8y/cap-agents-memory)](https://www.npmjs.com/package/@mi8y/cap-agents-memory)

CDS-backed long-term memory for LangGraph. `CdsMemoryStore` implements LangGraph's Store API, so facts and preferences can be shared across threads while remaining within CAP's database and tenant context.

## Installation

```bash
npm install @mi8y/cap-agents-memory
cds add cap-agents-memory
```

The add command creates `db/cap-agents-memory.cds` with `StoreItems` and `StoreItemFields` in the `plugin.langgraph.memory` namespace. It never overwrites an existing generated file.

Requires `@sap/cds >= 10` and `@langchain/core >= 1`.

## Usage

```ts
import { CdsMemoryStore } from "@mi8y/cap-agents-memory";

const store = new CdsMemoryStore({ name: "support-memory" });
const graph = builder.compile({ store });

await store.put(["users", "alice"], "profile", {
  preferredTone: "concise",
  lastTopic: "travel",
});

const profile = await store.get(["users", "alice"], "profile");
```

`name` is required and becomes `graphName` in CDS, isolating multiple stores that share a database. Unlike checkpointers, a Store is long-lived and can be read from any graph thread.

## Custom entities

The generated entities are defaults. Define your own entities by implementing the exported aspects, then pass their fully qualified names to the Store.

```cds
using { StoreItem, StoreItemField } from '@mi8y/cap-agents-memory';

namespace my.app.memory;

entity Items : StoreItem {
    fields : Composition of many Fields on fields.item = $self;
}

entity Fields : StoreItemField {
    item : Association to Items
        on item.graphName = $self.graphName
        and item.namespace = $self.namespace
        and item.id = $self.id;
    embedding : Vector(3072);
}
```

```ts
const store = new CdsMemoryStore({
  name: "support-memory",
  fqnStoreItemsEntity: "my.app.memory.Items",
  fqnStoreItemFieldsEntity: "my.app.memory.Fields",
});
```

## API

```ts
new CdsMemoryStore(config);
```

| Option                     | Type         | Description                                            |
| -------------------------- | ------------ | ------------------------------------------------------ |
| `name`                     | `string`     | Required store name used for isolation.                |
| `embeddings`               | `Embeddings` | Optional LangChain embeddings implementation.          |
| `fqnStoreItemsEntity`      | `string`     | Defaults to `plugin.langgraph.memory.StoreItems`.      |
| `fqnStoreItemFieldsEntity` | `string`     | Defaults to `plugin.langgraph.memory.StoreItemFields`. |

Supported Store operations are `put`, `get`, `delete`, `search`, `listNamespaces`, and `batch`.

Namespaces are non-empty arrays of non-empty strings. A label cannot contain `.` and the root `langgraph` namespace is reserved.

## Search and filtering

`search(namespacePrefix, options)` supports `query`, `filter`, `limit`, and `offset`. Without embeddings, `query` matches stored field values. Metadata filters support direct equality and `$eq`, `$ne`, `$in`, and `$notIn` operators.

Provide `embeddings` to embed stored fields on `put` and query text on `search` for vector-assisted search. The generated `Vector(1536)` field must be changed to match the selected embedding model's dimensions.

## CAP notes

- Use the Store inside CAP request handlers to inherit the active database and tenant context.
- CAP-supported SQLite, SAP HANA, and PostgreSQL adapters are supported by the CDS query implementation.
- Use a checkpointer for short-term, thread-scoped graph state; use this package for cross-thread long-term memory.

## License

[MIT License](./LICENSE)
