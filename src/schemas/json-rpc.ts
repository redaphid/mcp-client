import { z } from "zod"

// JSON-RPC 2.0 Base Schemas
export const JSONRPC_VERSION = "2.0"

export const RequestIdSchema = z.union([z.string(), z.number()])

export const JSONRPCRequestSchema = z.object({
  jsonrpc: z.literal(JSONRPC_VERSION),
  id: RequestIdSchema,
  method: z.string(),
  params: z.unknown().optional()
})

export const JSONRPCNotificationSchema = z.object({
  jsonrpc: z.literal(JSONRPC_VERSION),
  method: z.string(),
  params: z.unknown().optional()
})

export const JSONRPCResponseSchema = z.object({
  jsonrpc: z.literal(JSONRPC_VERSION),
  id: RequestIdSchema,
  result: z.unknown()
})

export const JSONRPCErrorSchema = z.object({
  jsonrpc: z.literal(JSONRPC_VERSION),
  id: RequestIdSchema,
  error: z.object({
    code: z.number(),
    message: z.string(),
    data: z.unknown().optional()
  })
})

// Type exports
export type JSONRPCRequest = z.infer<typeof JSONRPCRequestSchema>
export type JSONRPCNotification = z.infer<typeof JSONRPCNotificationSchema>
export type JSONRPCResponse = z.infer<typeof JSONRPCResponseSchema>
export type JSONRPCError = z.infer<typeof JSONRPCErrorSchema>