const cds = require("@sap/cds");

const LOG = cds.log("cap-agents-cds-vectorstore");

// Register the 'agent-cds-vectorstore' plugin for the 'cds add' command
cds.add?.register(
  "agent-cds-vectorstore",
  require("./lib/add").AddLangChainVectorstorePlugin,
);

cds.on("loaded", (model) => {
  let hasCdsDocumentAspectApplied,
    hasCdsDocumentMetadataAspectApplied = false;

  // check if model has implemented persistence related aspects in their entities
  for (const entityName in model.definitions) {
    const entity = model.definitions[entityName];
    if (entity.kind === "entity" && entity.includes) {
      hasCdsDocumentAspectApplied ||=
        entity.includes.includes("VectorDocument");
      hasCdsDocumentMetadataAspectApplied ||= entity.includes.includes(
        "VectorDocumentMetadata",
      );
    }
  }

  if (!(hasCdsDocumentAspectApplied && hasCdsDocumentMetadataAspectApplied)) {
    LOG.warn(
      `Detected '@mi8y/cap-agents-cds-vectorstore' CDS plugin installation, but no entities implementing the aspects 'VectorDocument' or 'VectorDocumentMetadata' found in the model. ` +
        `Run 'cds add agent-cds-vectorstore' to add the default vectorstore entities.`,
    );
  }
});
