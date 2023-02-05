
type FileStorageType = "indexeddb" | "file-system";

type ItemType = "folder" | "file";

type EditorLayout = "aside" | "stacked";

declare function log<T>(data: T, trace?: boolean): T;
