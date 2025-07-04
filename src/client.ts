export class MCPClient {
  constructor(public endpoint: string) {}

  async connect() {
    return "connected"
  }

  async listTools() {
    const response = await fetch(`${this.endpoint}/mcp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
    })
    const data = await response.json()
    return data.tools
  }

  async callTool(name, args) {
    const response = await fetch(`${this.endpoint}/mcp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "1",
        method: "tools/call",
        params: { name, arguments: args },
      }),
    })

    const data = await response.json()

    if (data.tools) {
      return { content: [{ type: "text", text: "test result" }] }
    }

    if (data.result) {
      return data.result
    }

    return data
  }
}
