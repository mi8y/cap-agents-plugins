const cds = require("@sap/cds");

const LOG = cds.log("cap-agents-memory");

const DEFAULT_CDS_CONTENT = `namespace plugin.langgraph.memory;

using { StoreItem, StoreItemField } from '@mi8y/cap-agents-memory';

entity StoreItems : StoreItem {
    fields : Composition of many StoreItemFields
                 on fields.item = $self;
}

entity StoreItemFields : StoreItemField {
    item      : Association to StoreItems
                    on  item.graphName = $self.graphName
                    and item.namespace = $self.namespace
                    and item.id        = $self.id;
    embedding : Vector(1536); // Configure the dimension for the embedding model in use.
}
`;

class AddCapAgentsMemoryPlugin extends cds.add.Plugin {
  static help() {
    return "LangGraph long-term memory store";
  }

  async run() {
    const dbPath = cds.env.folders?.db || "db/";
    const cdsFileRelPath = cds.utils.path.join(dbPath, "agent-memory.cds");
    const cdsFileAbsPath = cds.utils.path.join(cds.root, cdsFileRelPath);

    if (!cds.utils.fs.existsSync(cdsFileAbsPath)) {
      await cds.utils.write(DEFAULT_CDS_CONTENT).to(cdsFileAbsPath);
      LOG.info(`Added LangGraph memory store entities: '${cdsFileRelPath}'`);
    } else {
      LOG.info(
        `LangGraph memory store entities already exist: '${cdsFileRelPath}'`,
      );
    }
  }
}

module.exports = { AddCapAgentsMemoryPlugin };
