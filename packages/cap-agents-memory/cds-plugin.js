const cds = require("@sap/cds");

const LOG = cds.log("cap-agents-memory");

// Register the 'agent-memory' plugin for the 'cds add' command
cds.add?.register(
  "agent-memory",
  require("./lib/add").AddCapAgentsMemoryPlugin,
);

cds.on("loaded", (model) => {
  let hasStoreItemAspectApplied = false;
  let hasStoreItemFieldAspectApplied = false;

  for (const entityName in model.definitions) {
    const entity = model.definitions[entityName];
    if (entity.kind === "entity" && entity.includes) {
      hasStoreItemAspectApplied ||= entity.includes.includes("StoreItem");
      hasStoreItemFieldAspectApplied ||=
        entity.includes.includes("StoreItemField");
    }
  }

  if (!(hasStoreItemAspectApplied && hasStoreItemFieldAspectApplied)) {
    LOG.warn(
      "Detected '@mi8y/cap-agents-memory' installation, but no entities implementing the aspects 'StoreItem' or 'StoreItemField' were found in the model. " +
        "Run 'cds add agent-memory' to add the default memory store entities.",
    );
  }
});
