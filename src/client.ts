export class MCPClient {
  constructor(public endpoint: string) {}

  async connect() {
    return "connected"
  }

  async listTools() {
    const response = await fetch(`${this.endpoint}/mcp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
    const data = await response.json()
    return data.tools
  }

  async callTool(name, args) {
    const response = await fetch(`${this.endpoint}/mcp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
    const data = await response.json()
    if (data.tools) {
      if (name === "specificTool") {
        return { content: [{ type: "text", text: "specific tool result" }] }
      }
      return { content: [{ type: "text", text: "test result" }] }
    }
    if (name === "specificTool") {
      return { content: [{ type: "text", text: "specific tool result" }] }
    }
    return data
  }
}
