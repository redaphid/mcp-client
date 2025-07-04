# MCP Streamable HTTP Transport Specification

## Overview

This document details the Model Context Protocol (MCP) Streamable HTTP transport specification as defined in the [official MCP specification](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#streamable-http). This transport allows MCP servers to be implemented as HTTP endpoints that can stream multiple messages back to clients.

## Transport Mechanism

The Streamable HTTP transport uses standard HTTP protocols with support for both single-response and streaming modes:

- **Protocol**: HTTP POST and GET requests
- **Streaming**: Server-Sent Events (SSE) for multi-message responses
- **Endpoint**: Requires a single HTTP endpoint path

## Client Requirements

### Message Sending

Clients MUST:
- Use HTTP POST to send JSON-RPC messages to the server
- Include an `Accept` header with both:
  - `application/json` (for single responses)
  - `text/event-stream` (for SSE streaming)
- Send exactly one JSON-RPC request, notification, or response per POST request

### Example Request Headers
```http
POST /mcp HTTP/1.1
Accept: application/json, text/event-stream
Content-Type: application/json
```

## Server Response Behaviors

### For Notifications and Responses

When receiving a notification or response (not expecting a reply):
- Server MUST return HTTP 202 Accepted
- No body content is expected

### For Requests

When receiving a request (expecting a reply), server can:

1. **Single Response Mode**:
   - Return a single JSON response with appropriate HTTP status
   - Content-Type: `application/json`

2. **Streaming Mode (SSE)**:
   - Return HTTP 200 with Content-Type: `text/event-stream`
   - Send multiple messages as SSE events
   - Each message is a complete JSON-RPC message
   - Stream SHOULD eventually include the response to the original request
   - Server SHOULD close the stream after sending the final response

## SSE Message Format

When using Server-Sent Events, each message follows the SSE format:

```
data: {"jsonrpc": "2.0", "method": "notifications/message", "params": {...}}

data: {"jsonrpc": "2.0", "id": "123", "result": {...}}

```

Key points:
- Each message starts with `data: ` prefix
- Messages are separated by double newlines
- Each data field contains a complete JSON-RPC message

## Session Management

### Session IDs

- Server MAY assign a session ID during initialization
- Session ID requirements:
  - MUST be globally unique
  - MUST be cryptographically secure (unguessable)
  - MUST contain only visible ASCII characters (0x20-0x7E)
  - Recommended: Use Base64 encoding of random bytes

### Session Persistence

- Clients SHOULD include session ID in subsequent requests if provided
- Servers MAY use session ID to maintain state between requests

## Security Considerations

### Critical Security Requirements

1. **Origin Validation**:
   - Servers MUST validate the `Origin` header
   - Reject requests from untrusted origins

2. **Local Binding**:
   - Servers SHOULD bind to localhost/127.0.0.1 only
   - Prevents exposure to network attacks

3. **Authentication**:
   - Implement proper authentication mechanisms
   - Consider using bearer tokens or API keys

4. **HTTPS**:
   - Use HTTPS in production environments
   - Protect against man-in-the-middle attacks

## Implementation Flow

### Typical Request/Response Flow

1. **Client sends request**:
   ```json
   POST /mcp HTTP/1.1
   Accept: application/json, text/event-stream
   Content-Type: application/json

   {
     "jsonrpc": "2.0",
     "id": "1",
     "method": "tools/list",
     "params": {}
   }
   ```

2. **Server responds with SSE stream**:
   ```
   HTTP/1.1 200 OK
   Content-Type: text/event-stream

   data: {"jsonrpc": "2.0", "method": "notifications/progress", "params": {"progress": 0.5}}

   data: {"jsonrpc": "2.0", "id": "1", "result": {"tools": [...]}}

   ```

3. **Server closes connection** after sending the response

## Cloudflare Workers Considerations

When implementing on Cloudflare Workers:

- Workers can return ReadableStream for SSE responses
- Use `TransformStream` to convert messages to SSE format
- Ensure proper headers are set for streaming
- Handle connection lifecycle within Worker limits

## Error Handling

### HTTP Status Codes

- **200 OK**: Successful request (single response or SSE stream)
- **202 Accepted**: Notification/response received (no reply expected)
- **400 Bad Request**: Malformed request
- **401 Unauthorized**: Authentication required
- **500 Internal Server Error**: Server error

### JSON-RPC Errors

Even in streaming mode, errors follow JSON-RPC format:
```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "error": {
    "code": -32601,
    "message": "Method not found"
  }
}
```

## Backwards Compatibility

- Clients SHOULD detect server capabilities via Accept headers
- Servers MAY fall back to single-response mode if SSE not requested
- Protocol version negotiation happens during initialization

## Best Practices

1. **Keep connections short-lived**:
   - Close SSE streams promptly after sending responses
   - Avoid long-polling patterns

2. **Message ordering**:
   - Preserve message order in streams
   - Send notifications before final response

3. **Error recovery**:
   - Clients should retry on connection failures
   - Implement exponential backoff

4. **Resource limits**:
   - Set reasonable timeouts
   - Limit message sizes
   - Monitor memory usage in streaming scenarios

## Example Implementation Pattern (Pseudo-code)

```typescript
// Server endpoint handler
async function handleMCPRequest(request: Request): Promise<Response> {
  const acceptsSSE = request.headers.get('accept')?.includes('text/event-stream')
  const message = await request.json()
  
  // For notifications/responses (no reply expected)
  if (message.method || !message.id) {
    return new Response(null, { status: 202 })
  }
  
  // For requests
  if (acceptsSSE && shouldStream(message)) {
    return createSSEResponse(async (writer) => {
      // Send progress notifications
      await writer.write({
        jsonrpc: "2.0",
        method: "notifications/progress",
        params: { progress: 0.5 }
      })
      
      // Process and send final response
      const result = await processRequest(message)
      await writer.write({
        jsonrpc: "2.0",
        id: message.id,
        result
      })
    })
  } else {
    // Single response mode
    const result = await processRequest(message)
    return Response.json({
      jsonrpc: "2.0",
      id: message.id,
      result
    })
  }
}
```

## References

- [Official MCP Specification](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#streamable-http)
- [Server-Sent Events Specification](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)