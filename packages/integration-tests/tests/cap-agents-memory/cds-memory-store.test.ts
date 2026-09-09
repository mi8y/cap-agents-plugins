import {
  CdsMemoryStore,
  DEFAULT_FQN_ENTITY_STORE_ITEM_FIELDS,
  DEFAULT_FQN_ENTITY_STORE_ITEMS,
} from "@mi8y/cap-agents-memory";
import cds from "@sap/cds";
import path from "path";
import { beforeEach, describe, it } from "vitest";

const NS = "plugin.langgraph.memory";

async function cleanup() {
  await DELETE.from(DEFAULT_FQN_ENTITY_STORE_ITEM_FIELDS);
  await DELETE.from(DEFAULT_FQN_ENTITY_STORE_ITEMS);
}

describe("CAP Agents Memory integration", () => {
  cds.root = path.join(import.meta.dirname, "../..");
  const { expect } = cds.test("@mi8y/integration-tests");

  describe("generated CDS model", () => {
    it("exposes and deploys the default memory entities", async () => {
      const { StoreItems, StoreItemFields } = cds.entities(NS);
      expect(StoreItems.name).to.equal(`${NS}.StoreItems`);
      expect(StoreItemFields.name).to.equal(`${NS}.StoreItemFields`);
      expect(await SELECT.from(StoreItems)).to.be.an("array");
      expect(await SELECT.from(StoreItemFields)).to.be.an("array");
    });
  });

  describe("CdsMemoryStore", () => {
    beforeEach(cleanup);

    it("persists, updates, and deletes values through generated entities", async () => {
      const store = new CdsMemoryStore({ name: "memory-a" });
      await store.put(["users", "alice"], "profile", { tone: "brief" });
      const item = await store.get(["users", "alice"], "profile");
      expect(item?.key).to.equal("profile");
      expect(item?.namespace).to.deep.equal(["users", "alice"]);

      await store.put(["users", "alice"], "profile", { tone: "detailed" });
      expect(
        (await store.get(["users", "alice"], "profile"))?.value,
      ).to.deep.equal({
        tone: "detailed",
      });

      await store.delete(["users", "alice"], "profile");
      expect(await store.get(["users", "alice"], "profile")).to.equal(null);
    });

    it("supports batch operations, search, filters, and namespace listing", async () => {
      const store = new CdsMemoryStore({ name: "memory-a" });
      await store.batch([
        {
          namespace: ["users", "alice"],
          key: "profile",
          value: { role: "admin", topic: "travel" },
        },
        {
          namespace: ["users", "bob"],
          key: "profile",
          value: { role: "reader", topic: "books" },
        },
      ]);

      const matches = await store.search(["users"], {
        query: "travel",
        filter: { role: "admin" },
      });
      expect(matches.map((item) => item.key)).to.deep.equal(["profile"]);
      expect(
        await store.listNamespaces({
          matchConditions: [{ matchType: "prefix", path: ["users"] }],
        }),
      ).to.deep.equal([
        ["users", "alice"],
        ["users", "bob"],
      ]);
    });

    it("isolates records by store name", async () => {
      const first = new CdsMemoryStore({ name: "memory-a" });
      const second = new CdsMemoryStore({ name: "memory-b" });
      await first.put(["shared"], "setting", { enabled: true });
      expect(await second.get(["shared"], "setting")).to.equal(null);
    });
  });
});
