const cds = require("@sap/cds");

const LOG = cds.log("cds-langgraph-persistence");

/**
 * `cds add` plugin for adding the default entities for the LangGraph persistence plugin.
 */

cds.add?.register(
  "langgraph-checkpointer",
  require("./lib/add").AddLangGraphCheckpointerPlugin,
);

/**
 * Check for the presence of entities if not already added via `cds add` and log a warning if not found.
 */

cds.on("loaded", (model) => {
  let hasCdsCheckpointAspectApplied = false;
  let hasCdsCheckpointWriteAspectApplied = false;

  // check if model has implemented persistence related aspects in their entities
  for (const entityName in model.definitions) {
    const entity = model.definitions[entityName];
    if (entity.kind === "entity" && entity.includes) {
      hasCdsCheckpointAspectApplied ||= entity.includes.includes("Checkpoint");
      hasCdsCheckpointWriteAspectApplied ||=
        entity.includes.includes("CheckpointWrite");
    }
  }

  if (!(hasCdsCheckpointAspectApplied && hasCdsCheckpointWriteAspectApplied)) {
    LOG.warn(
      `Detected '@mi8y/cds-langgraph-persistence' installation, but no entities which implements the aspects 'Checkpoint' or 'CheckpointWrite', found in the model. ` +
        `Run 'cds add langgraph-checkpointer' to add the default checkpoint entities.`,
    );
  }
});
