// Re-export all schemas
export * from "./json-rpc.ts"
export * from "./initialization.ts"
export * from "./tools.ts"
export * from "./notifications.ts"

// Re-export constants from original schema file
export { LATEST_PROTOCOL_VERSION } from "../mcp-specification-schema.ts"