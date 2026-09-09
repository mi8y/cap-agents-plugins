const cds = require("@sap/cds");

const LOG = cds.log("cds-langgraph-persistence");

const CHECKPOINTER_CDS_CONTENT = `namespace plugin.langgraph.persistence;

using {
    Checkpoint,
    CheckpointWrite
} from '@mi8y/cds-langgraph-persistence';

entity Checkpoints : Checkpoint {
    writes : Composition of many CheckpointWrites
                 on writes.checkpoint = $self;
}

entity CheckpointWrites : CheckpointWrite {
    checkpoint : Association to Checkpoints
                     on  checkpoint.graphName = $self.checkpoint_graphName
                     and checkpoint.namespace = $self.checkpoint_namespace
                     and checkpoint.threadId  = $self.checkpoint_threadId
                     and checkpoint.id        = $self.checkpoint_id;
}
`;

async function writeCdsFile(cdsFileRelPath, cdsContent, description) {
  const cdsFileAbsPath = cds.utils.path.join(cds.root, cdsFileRelPath);

  if (!cds.utils.fs.existsSync(cdsFileAbsPath)) {
    await cds.utils.write(cdsContent).to(cdsFileAbsPath);
    LOG.info(`Added ${description}: '${cdsFileRelPath}'`);
  } else {
    LOG.info(`${description} already exists: '${cdsFileRelPath}'`);
  }
}

async function addCheckpointerEntities() {
  const dbPath = cds.env.folders?.db || "db/";
  const cdsFileRelPath = cds.utils.path.join(
    dbPath,
    "langgraph-checkpointer.cds",
  );
  await writeCdsFile(
    cdsFileRelPath,
    CHECKPOINTER_CDS_CONTENT,
    "LangGraph checkpointer entities",
  );
}

class AddLangGraphCheckpointerPlugin extends cds.add.Plugin {
  static help() {
    return "LangGraph checkpointer storage";
  }

  async run() {
    await addCheckpointerEntities();
  }
}

module.exports = {
  AddLangGraphCheckpointerPlugin,
};
