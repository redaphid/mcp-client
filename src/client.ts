import { JSONRPC_VERSION, InitializeRequestSchema, InitializedNotificationSchema, CallToolRequestSchema } from "./schemas/index.ts"
import createDebug from "debug"

const debug = createDebug("mcp:client")

export class MCPClient {
  private isInitialized = false
  endpoint: string
  requestOptions?: any

  constructor(endpoint: string, requestOptions?: any) {
    this.endpoint = endpoint
    this.requestOptions = requestOptions
    debug("MCPClient created with endpoint: %s", endpoint)
  }

  private generateRequestId() {
    const id = crypto.randomUUID()
    debug("Generated request ID: %s", id)
    return id
  }

  private checkInitialized() {
    if (!this.isInitialized) {
      throw new Error("Client must be initialized before making requests")
    }
  }

  private async parseResponse(response: Response, callback?: (notification: any) => void) {
    const contentType = response.headers.get("content-type")
    
    // MCP Streamable HTTP Transport: https://modelcontextprotocol.io/specification/2025-06-18/basic/transports
    // Server may respond with SSE stream
    if (contentType?.includes("text/event-stream")) {
      const text = await response.text()
      const lines = text.split("\n")
      let finalResult = null
      
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          // SSE Format: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
          // Remove "data: " prefix to extract JSON
          const jsonData = JSON.parse(line.slice("data: ".length))
          if (jsonData.method && callback) {
            // MCP Progress Notifications: https://modelcontextprotocol.io/specification/2025-06-18/basic/lifecycle
            callback(jsonData.params)
          }
          if (jsonData.result) {
            finalResult = jsonData.result
          }
        }
      }
      
      return finalResult
    }
    
    // Parse as regular JSON
    const data = await response.json()
    
    // JSON-RPC Error Handling: https://www.jsonrpc.org/specification#error_object
    if (data.error) {
      throw new Error(data.error.message)
    }
    
    // JSON-RPC Response: https://www.jsonrpc.org/specification#response_object
    return data.result || data
  }

  async connect() {
    return "connected"
  }

  async initialize() {
    debug("Starting initialization...")
    // MCP Initialization: https://modelcontextprotocol.io/specification/2025-06-18/basic/lifecycle
    // Client sends initialize request with protocol version and capabilities
    const requestBody = InitializeRequestSchema.parse({
      jsonrpc: JSONRPC_VERSION,
      id: this.generateRequestId(),
      method: "initialize",
      params: {
        protocolVersion: "2025-06-18",
        capabilities: {},
        clientInfo: { name: "mystical-test-familiar", version: "0.0.0" },
      },
    })
    
    debug("Sending initialize request: %O", requestBody)
    
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        ...this.requestOptions?.headers,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`HTTP ${response.status}: ${text}`)
    }
    
    debug('Response status: %d', response.status)
    debug('Response headers: %O', Object.fromEntries(response.headers.entries()))
    
    const data = await this.parseResponse(response)

    debug("Initialize response data: %O", data)
    
    // MCP Initialized Notification: https://modelcontextprotocol.io/specification/2025-06-18/basic/lifecycle
    // After successful initialize response, client must send initialized notification
    const notificationBody = InitializedNotificationSchema.parse({
      jsonrpc: JSONRPC_VERSION,
      method: "notifications/initialized",
    })
    
    debug("Sending initialized notification: %O", notificationBody)
    
    await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        ...this.requestOptions?.headers,
      },
      body: JSON.stringify(notificationBody),
    })

    this.isInitialized = true
    debug("Initialization complete, client is now initialized")
    return data
  }

  async listTools() {
    this.checkInitialized()
    debug("Listing tools...")
    // MCP Tools List: https://modelcontextprotocol.io/specification/2025-06-18/server/tools
    const requestBody = {
      jsonrpc: JSONRPC_VERSION,
      id: this.generateRequestId(),
      method: "tools/list"
    }
    
    debug("Sending listTools request: %O", requestBody)
    
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        ...this.requestOptions?.headers,
      },
      body: JSON.stringify(requestBody)
    })
    
    debug('listTools response status: %d', response.status)
    debug('listTools response headers: %O', Object.fromEntries(response.headers.entries()))
    
    const result = await this.parseResponse(response)
    debug("listTools response data: %O", result)
    
    return result.tools
  }

  async callTool(name, args, callback?) {
    this.checkInitialized()
    // MCP Tool Call: https://modelcontextprotocol.io/specification/2025-06-18/server/tools
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        ...this.requestOptions?.headers,
      },
      body: JSON.stringify(CallToolRequestSchema.parse({
        jsonrpc: JSONRPC_VERSION,
        id: this.generateRequestId(),
        method: "tools/call",
        params: { name, arguments: args },
      })),
    })

    return await this.parseResponse(response, callback)
  }
}
