aspect StoreItem {
    key graphName  : String(256) not null;
    key namespace  : String(256) not null;
    key id         : String(256) not null;
        createdAt  : Timestamp default $now;
        modifiedAt : Timestamp default $now @cds.on.update: $now;
}

aspect StoreItemField {
    key graphName : String(256) not null;
    key namespace : String(256) not null;
    key id        : String(256) not null;
    key name      : String(256) not null;
        value     : String;
        embedding : Vector;
}
