import { z } from "zod"
import { JSONRPCRequestSchema } from "./json-rpc"

// Content Block Schema
export const ContentBlockSchema = z.object({
  type: z.literal("text"),
  text: z.string()
})

// Tool Schema
export const ToolSchema = z.object({
  name: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  inputSchema: z.object({
    type: z.literal("object"),
    properties: z.record(z.object({})).optional(),
    required: z.array(z.string()).optional()
  })
})

// Tool Call Request Schema
export const CallToolRequestSchema = JSONRPCRequestSchema.extend({
  method: z.literal("tools/call"),
  params: z.object({
    name: z.string(),
    arguments: z.record(z.unknown()).optional()
  })
})

// Tool Call Result Schema
export const CallToolResultSchema = z.object({
  content: z.array(ContentBlockSchema),
  structuredContent: z.record(z.unknown()).optional(),
  isError: z.boolean().optional()
})

// List Tools Request Schema
export const ListToolsRequestSchema = JSONRPCRequestSchema.extend({
  method: z.literal("tools/list"),
  params: z.object({
    cursor: z.string().optional()
  }).optional()
})

// List Tools Result Schema
export const ListToolsResultSchema = z.object({
  tools: z.array(ToolSchema),
  nextCursor: z.string().optional()
})

// Type exports
export type Tool = z.infer<typeof ToolSchema>
export type CallToolRequest = z.infer<typeof CallToolRequestSchema>
export type CallToolResult = z.infer<typeof CallToolResultSchema>
export type ListToolsRequest = z.infer<typeof ListToolsRequestSchema>
export type ListToolsResult = z.infer<typeof ListToolsResultSchema>