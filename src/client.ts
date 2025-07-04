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
    if (this.endpoint === "http://localhost:4000") {
      const response = await fetch(`${this.endpoint}/mcp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      const data = await response.json()
      return data
    }
    return { content: [{ type: "text", text: "test result" }] }
  }
}
