import { z } from "zod"
import { JSONRPCNotificationSchema } from "./json-rpc.ts"

// Progress Token Schema
export const ProgressTokenSchema = z.union([z.string(), z.number()])

// Progress Notification Schema
export const ProgressNotificationSchema = JSONRPCNotificationSchema.extend({
  method: z.literal("notifications/progress"),
  params: z.object({
    progressToken: ProgressTokenSchema,
    progress: z.number(),
    total: z.number().optional(),
    message: z.string().optional()
  })
})

// Cancelled Notification Schema
export const CancelledNotificationSchema = JSONRPCNotificationSchema.extend({
  method: z.literal("notifications/cancelled"),
  params: z.object({
    requestId: z.union([z.string(), z.number()]),
    reason: z.string().optional()
  })
})