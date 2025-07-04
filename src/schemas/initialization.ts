import { z } from "zod"
import { JSONRPCRequestSchema, JSONRPCNotificationSchema, JSONRPC_VERSION } from "./json-rpc"

// MCP Initialization Schemas
export const ClientCapabilitiesSchema = z.object({
  experimental: z.record(z.object({})).optional(),
  roots: z.object({
    listChanged: z.boolean().optional()
  }).optional(),
  sampling: z.object({}).optional(),
  elicitation: z.object({}).optional()
})

export const ServerCapabilitiesSchema = z.object({
  experimental: z.record(z.object({})).optional(),
  logging: z.object({}).optional(),
  completions: z.object({}).optional(),
  prompts: z.object({
    listChanged: z.boolean().optional()
  }).optional(),
  resources: z.object({
    subscribe: z.boolean().optional(),
    listChanged: z.boolean().optional()
  }).optional(),
  tools: z.object({
    listChanged: z.boolean().optional()
  }).optional()
})

export const ImplementationSchema = z.object({
  name: z.string(),
  version: z.string(),
  title: z.string().optional()
})

export const InitializeRequestSchema = JSONRPCRequestSchema.extend({
  method: z.literal("initialize"),
  params: z.object({
    protocolVersion: z.string(),
    capabilities: ClientCapabilitiesSchema,
    clientInfo: ImplementationSchema
  })
})

export const InitializeResultSchema = z.object({
  protocolVersion: z.string(),
  capabilities: ServerCapabilitiesSchema,
  serverInfo: ImplementationSchema,
  instructions: z.string().optional()
})

export const InitializedNotificationSchema = JSONRPCNotificationSchema.extend({
  method: z.literal("notifications/initialized")
})

// Type exports
export type InitializeRequest = z.infer<typeof InitializeRequestSchema>
export type InitializeResult = z.infer<typeof InitializeResultSchema>
export type InitializedNotification = z.infer<typeof InitializedNotificationSchema>