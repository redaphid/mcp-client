import { JSONRPCRequest, InitializeRequest, InitializedNotification, CallToolRequest, JSONRPC_VERSION } from "./schemas"

export class MCPClient {
  private isInitialized = false

  constructor(public endpoint: string, public requestOptions?: any) {}

  private generateRequestId() {
    return crypto.randomUUID()
  }

  private checkInitialized() {
    if (!this.isInitialized) {
      throw new Error("Client must be initialized before making requests")
    }
  }

  async connect() {
    return "connected"
  }

  async initialize() {
    // MCP Initialization: https://modelcontextprotocol.io/specification/2025-06-18/basic/lifecycle
    // Client sends initialize request with protocol version and capabilities
    const response = await fetch(`${this.endpoint}/mcp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        ...this.requestOptions?.headers,
      },
      body: JSON.stringify({
        jsonrpc: JSONRPC_VERSION,
        id: this.generateRequestId(),
        method: "initialize",
        params: {
          protocolVersion: "2025-06-18",
          capabilities: {},
          clientInfo: { name: "mystical-test-familiar", version: "0.0.0" },
        },
      } as JSONRPCRequest & InitializeRequest),
    })

    const data = await response.json()

    // MCP Initialized Notification: https://modelcontextprotocol.io/specification/2025-06-18/basic/lifecycle
    // After successful initialize response, client must send initialized notification
    await fetch(`${this.endpoint}/mcp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        ...this.requestOptions?.headers,
      },
      body: JSON.stringify({
        jsonrpc: JSONRPC_VERSION,
        method: "notifications/initialized",
      } as InitializedNotification),
    })

    this.isInitialized = true
    return data.result
  }

  async listTools() {
    this.checkInitialized()
    // MCP Tools List: https://modelcontextprotocol.io/specification/2025-06-18/server/tools
    const response = await fetch(`${this.endpoint}/mcp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        ...this.requestOptions?.headers,
      },
      body: JSON.stringify({
        jsonrpc: JSONRPC_VERSION,
        id: this.generateRequestId(),
        method: "tools/list"
      })
    })
    const data = await response.json()
    return data.result.tools
  }

  async callTool(name, args, callback?) {
    this.checkInitialized()
    // MCP Tool Call: https://modelcontextprotocol.io/specification/2025-06-18/server/tools
    const response = await fetch(`${this.endpoint}/mcp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        ...this.requestOptions?.headers,
      },
      body: JSON.stringify({
        jsonrpc: JSONRPC_VERSION,
        id: this.generateRequestId(),
        method: "tools/call",
        params: { name, arguments: args },
      } as JSONRPCRequest & CallToolRequest),
    })

    const contentType = response.headers.get("content-type")

    // MCP Streamable HTTP Transport: https://modelcontextprotocol.io/specification/2025-06-18/basic/transports
    // Server may respond with SSE stream for progress notifications
    if (contentType?.includes("text/event-stream")) {
      const text = await response.text()
      const lines = text.split("\n")
      let finalResult = null

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          // SSE Format: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
          // Remove "data: " prefix (6 characters) to extract JSON
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

    const data = await response.json()

    // JSON-RPC Error Handling: https://www.jsonrpc.org/specification#error_object
    if (data.error) {
      throw new Error(data.error.message)
    }

    // JSON-RPC Response: https://www.jsonrpc.org/specification#response_object
    if (data.result) {
      return data.result
    }

    return data
  }
}
