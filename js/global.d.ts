
type FileStorageType = "indexeddb" | "file-system";

type ItemType = "folder" | "file";

declare function log<T>(data: T, trace?: boolean): T;
